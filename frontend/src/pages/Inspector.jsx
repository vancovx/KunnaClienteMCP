import { useState } from "react";
import ConsoleLog from "../components/ConsoleLog";

const API = "http://localhost:4000/api";

/* ── Helpers de esquema ────────────────────────────────────────────── */
function schemaToFields(schema) {
    if (!schema || !schema.properties) return [];
    const required = new Set(schema.required || []);
    return Object.entries(schema.properties).map(([name, prop]) => ({
        name,
        type: prop.type || "string",
        description: prop.description || "",
        required: required.has(name),
        enum: prop.enum || null,
        default: prop.default,
    }));
}

function promptArgsToFields(args) {
    if (!Array.isArray(args)) return [];
    return args.map((a) => ({
        name: a.name,
        type: "string",
        description: a.description || "",
        required: !!a.required,
        enum: null,
        default: undefined,
    }));
}

function initialValues(fields) {
    const v = {};
    for (const f of fields) {
        if (f.default !== undefined) v[f.name] = String(f.default);
        else if (f.type === "boolean") v[f.name] = "false";
        else v[f.name] = "";
    }
    return v;
}

function coerceValues(fields, values) {
    const out = {};
    for (const f of fields) {
        const raw = values[f.name];
        if (raw === "" || raw === undefined) {
            if (f.required && f.type !== "boolean") {
                throw new Error(`El campo «${f.name}» es obligatorio`);
            }
            if (raw === "") continue;
        }
        switch (f.type) {
            case "number":
            case "integer": {
                const n = Number(raw);
                if (Number.isNaN(n)) throw new Error(`«${f.name}» debe ser un número`);
                out[f.name] = f.type === "integer" ? Math.trunc(n) : n;
                break;
            }
            case "boolean":
                out[f.name] = raw === "true";
                break;
            case "object":
            case "array":
                try {
                    out[f.name] = JSON.parse(raw);
                } catch {
                    throw new Error(`«${f.name}» debe ser JSON válido`);
                }
                break;
            default:
                out[f.name] = raw;
        }
    }
    return out;
}

// Extrae los bloques de texto de una respuesta MCP para mostrarlos de forma
// legible. Devuelve null si la respuesta no tiene la forma esperada, en cuyo
// caso el componente cae al JSON crudo (importante para un cliente genérico:
// bloques image, resource, etc. no se pierden nunca).
function extractTextBlocks(result) {
    // Respuesta de tool: { content: [{ type: "text", text }, ...] }
    if (Array.isArray(result?.content)) {
        const blocks = result.content
            .filter((b) => b.type === "text" && typeof b.text === "string")
            .map((b) => ({ label: null, text: b.text }));
        return blocks.length ? blocks : null;
    }
    // Respuesta de prompt: { messages: [{ role, content: { type: "text", text } }, ...] }
    if (Array.isArray(result?.messages)) {
        const blocks = result.messages
            .filter((m) => m.content?.type === "text")
            .map((m) => ({ label: m.role, text: m.content.text }));
        return blocks.length ? blocks : null;
    }
    return null;
}

export default function Inspector() {
    const [form, setForm] = useState({
        transport: "http",
        url: "http://localhost:3001/mcp",
        authType: "bearer",
        token: "",
    });
    const [status, setStatus] = useState("idle");
    const [error, setError] = useState("");
    const [server, setServer] = useState(null);

    const [selected, setSelected] = useState(null); // { kind, item }
    const [fieldValues, setFieldValues] = useState({});
    const [rawMode, setRawMode] = useState(false);
    const [argsText, setArgsText] = useState("{}");

    const [calling, setCalling] = useState(false);
    const [result, setResult] = useState(null);
    const [resultView, setResultView] = useState("pretty"); // "pretty" | "json"
    const [callError, setCallError] = useState("");

    // Log de actividad para la consola.
    const [log, setLog] = useState([]);

    const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));
    const connected = status === "connected";

    function pushLog(kind, label, msg) {
        const time = new Date().toLocaleTimeString("es-ES");
        setLog((l) => [...l, { kind, label, msg, time }]);
    }

    const fields = selected
        ? selected.kind === "tool"
            ? schemaToFields(selected.item.inputSchema)
            : promptArgsToFields(selected.item.arguments)
        : [];

    async function connect() {
        setStatus("connecting");
        setError("");
        setServer(null);
        setSelected(null);
        setResult(null);
        pushLog("req", "→ POST", `/connect ${form.url}`);
        try {
            const auth =
                form.authType === "bearer"
                    ? { type: "bearer", token: form.token }
                    : { type: "none" };
            const res = await fetch(`${API}/connect`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ transport: form.transport, url: form.url, auth }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.cause || data.error || "Error desconocido");
            setServer(data);
            setStatus("connected");
            pushLog(
                "ok",
                "← 200",
                `conectado · ${data.serverInfo?.name ?? "servidor"}` +
                    (data.serverInfo?.version ? ` v${data.serverInfo.version}` : "") +
                    ` · ${data.tools.length} tools, ${data.prompts.length} prompts`
            );
        } catch (e) {
            setError(e.message);
            setStatus("error");
            pushLog("err", "← error", e.message);
        }
    }

    async function disconnect() {
        pushLog("req", "→ POST", "/disconnect");
        await fetch(`${API}/disconnect`, { method: "POST" });
        setServer(null);
        setSelected(null);
        setResult(null);
        setStatus("idle");
        pushLog("ok", "← ok", "desconectado");
    }

    function select(kind, item) {
        const f =
            kind === "tool"
                ? schemaToFields(item.inputSchema)
                : promptArgsToFields(item.arguments);
        setSelected({ kind, item });
        setFieldValues(initialValues(f));
        setArgsText("{}");
        setRawMode(false);
        setResult(null);
        setResultView("pretty");
        setCallError("");
    }

    function clearSelection() {
        setSelected(null);
        setResult(null);
        setCallError("");
    }

    function setField(name, value) {
        setFieldValues((v) => ({ ...v, [name]: value }));
    }

    async function run() {
        setCalling(true);
        setCallError("");
        setResult(null);
        setResultView("pretty");
        try {
            let args;
            if (rawMode) {
                try {
                    args = JSON.parse(argsText || "{}");
                } catch {
                    throw new Error("Los argumentos no son JSON válido");
                }
            } else {
                args = coerceValues(fields, fieldValues);
            }

            const endpoint = selected.kind === "tool" ? "/call" : "/prompt";
            pushLog(
                "req",
                selected.kind === "tool" ? "→ CALL" : "→ PROMPT",
                `${selected.item.name} ${JSON.stringify(args)}`
            );
            const res = await fetch(`${API}${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: selected.item.name, arguments: args }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.cause || data.error || "Error en la llamada");
            setResult(data);
            pushLog("ok", "← ok", "respuesta recibida");
        } catch (e) {
            setCallError(e.message);
            pushLog("err", "← error", e.message);
        } finally {
            setCalling(false);
        }
    }

    // Bloques de texto extraídos del resultado (null → solo vista JSON).
    const textBlocks = result ? extractTextBlocks(result) : null;

    return (
        <div className="inspector">
            <div className="inspector-head">
                <h1>Inspector</h1>
                {connected && server?.serverInfo && (
                    <span className="server-badge">
                        <i className="dot" /> {server.serverInfo.name} v{server.serverInfo.version}
                    </span>
                )}
            </div>

            <section className="connect-bar">
                <select value={form.transport} onChange={(e) => update("transport", e.target.value)} disabled={connected}>
                    <option value="http">HTTP</option>
                    <option value="sse">SSE</option>
                </select>
                <input
                    className="url"
                    placeholder="http://localhost:3001/mcp"
                    value={form.url}
                    onChange={(e) => update("url", e.target.value)}
                    disabled={connected}
                />
                <select value={form.authType} onChange={(e) => update("authType", e.target.value)} disabled={connected}>
                    <option value="none">Sin auth</option>
                    <option value="bearer">Bearer</option>
                </select>
                {form.authType === "bearer" && (
                    <input
                        className="token"
                        type="password"
                        placeholder="token"
                        value={form.token}
                        onChange={(e) => update("token", e.target.value)}
                        disabled={connected}
                    />
                )}
                {connected ? (
                    <button className="danger" onClick={disconnect}>Desconectar</button>
                ) : (
                    <button onClick={connect} disabled={status === "connecting"}>
                        {status === "connecting" ? "Conectando…" : "Conectar"}
                    </button>
                )}
            </section>

            {status === "error" && <div className="banner error">No se pudo conectar: {error}</div>}

            {connected && server && (
                <main className={selected ? "grid split" : "grid full"}>
                    <aside className="panel sidebar">
                        <h2>Tools <span className="count">{server.tools.length}</span></h2>
                        <ul className="list">
                            {server.tools.length === 0 && <li className="empty">Ninguna</li>}
                            {server.tools.map((t) => (
                                <li
                                    key={t.name}
                                    className={
                                        selected?.kind === "tool" && selected.item.name === t.name
                                            ? "item active"
                                            : "item"
                                    }
                                    onClick={() => select("tool", t)}
                                >
                                    <code>{t.name}</code>
                                    {t.description && <span className="item-desc">{t.description}</span>}
                                </li>
                            ))}
                        </ul>

                        <h2>Prompts <span className="count">{server.prompts.length}</span></h2>
                        <ul className="list">
                            {server.prompts.length === 0 && <li className="empty">Ninguno</li>}
                            {server.prompts.map((p) => (
                                <li
                                    key={p.name}
                                    className={
                                        selected?.kind === "prompt" && selected.item.name === p.name
                                            ? "item active"
                                            : "item"
                                    }
                                    onClick={() => select("prompt", p)}
                                >
                                    <code>{p.name}</code>
                                    {p.description && <span className="item-desc">{p.description}</span>}
                                </li>
                            ))}
                        </ul>
                    </aside>

                    {selected && (
                        <section className="panel main">
                            <header className="detail-head">
                                <span className={`kind-pill kind-${selected.kind}`}>
                                    {selected.kind === "tool" ? "Tool" : "Prompt"}
                                </span>
                                <h2 className="tool-title"><code>{selected.item.name}</code></h2>
                                <button className="close-btn" onClick={clearSelection} aria-label="Cerrar" title="Cerrar">×</button>
                            </header>
                            {selected.item.description && (
                                <p className="desc">{selected.item.description}</p>
                            )}

                            <div className="params-head">
                                <span className="params-label">Parámetros</span>
                                {fields.length > 0 && (
                                    <button
                                        type="button"
                                        className="link-btn"
                                        onClick={() => setRawMode((m) => !m)}
                                    >
                                        {rawMode ? "← Volver al formulario" : "Editar como JSON"}
                                    </button>
                                )}
                            </div>

                            {fields.length === 0 ? (
                                <p className="hint small">Esta {selected.kind === "tool" ? "tool" : "prompt"} no recibe parámetros.</p>
                            ) : rawMode ? (
                                <textarea
                                    value={argsText}
                                    onChange={(e) => setArgsText(e.target.value)}
                                    rows={8}
                                    spellCheck={false}
                                    placeholder='{ "clave": "valor" }'
                                />
                            ) : (
                                <div className="form-fields">
                                    {fields.map((f) => (
                                        <div className="field" key={f.name}>
                                            <label className="field-label">
                                                <span className="field-name">{f.name}</span>
                                                <span className="field-type">{f.type}</span>
                                                {f.required && <span className="field-req">obligatorio</span>}
                                            </label>
                                            {f.description && (
                                                <p className="field-desc">{f.description}</p>
                                            )}
                                            {f.enum ? (
                                                <select
                                                    value={fieldValues[f.name] ?? ""}
                                                    onChange={(e) => setField(f.name, e.target.value)}
                                                >
                                                    <option value="">— elige —</option>
                                                    {f.enum.map((opt) => (
                                                        <option key={opt} value={opt}>{opt}</option>
                                                    ))}
                                                </select>
                                            ) : f.type === "boolean" ? (
                                                <select
                                                    value={fieldValues[f.name] ?? "false"}
                                                    onChange={(e) => setField(f.name, e.target.value)}
                                                >
                                                    <option value="false">false</option>
                                                    <option value="true">true</option>
                                                </select>
                                            ) : f.type === "object" || f.type === "array" ? (
                                                <textarea
                                                    className="field-json"
                                                    value={fieldValues[f.name] ?? ""}
                                                    onChange={(e) => setField(f.name, e.target.value)}
                                                    rows={3}
                                                    spellCheck={false}
                                                    placeholder={f.type === "array" ? "[ ... ]" : "{ ... }"}
                                                />
                                            ) : (
                                                <input
                                                    type={f.type === "number" || f.type === "integer" ? "number" : "text"}
                                                    value={fieldValues[f.name] ?? ""}
                                                    onChange={(e) => setField(f.name, e.target.value)}
                                                    placeholder={f.required ? "" : "opcional"}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {selected.item.inputSchema && (
                                <details className="schema">
                                    <summary>Ver inputSchema</summary>
                                    <pre>{JSON.stringify(selected.item.inputSchema, null, 2)}</pre>
                                </details>
                            )}

                            <button className="run-btn" onClick={run} disabled={calling}>
                                {calling
                                    ? "Ejecutando…"
                                    : selected.kind === "tool"
                                        ? "Llamar a la tool"
                                        : "Obtener prompt"}
                            </button>

                            {callError && <div className="banner error">{callError}</div>}

                            {result && (
                                <div className="result-block">
                                    <div className="result-head">
                                        <label>Resultado</label>
                                        {textBlocks && (
                                            <div className="view-toggle">
                                                <button
                                                    type="button"
                                                    className={resultView === "pretty" ? "active" : ""}
                                                    onClick={() => setResultView("pretty")}
                                                >
                                                    Legible
                                                </button>
                                                <button
                                                    type="button"
                                                    className={resultView === "json" ? "active" : ""}
                                                    onClick={() => setResultView("json")}
                                                >
                                                    JSON
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {textBlocks && resultView === "pretty" ? (
                                        <div className="result pretty">
                                            {textBlocks.map((b, i) => (
                                                <div key={i} className="text-block">
                                                    {b.label && <span className="role-pill">{b.label}</span>}
                                                    <div className="text-content">{b.text}</div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <pre className="result">{JSON.stringify(result, null, 2)}</pre>
                                    )}
                                </div>
                            )}
                        </section>
                    )}
                </main>
            )}

            {!connected && (
                <div className="empty-state">
                    <div className="empty-icon" aria-hidden="true">🔌</div>
                    <h2 className="empty-title">Conecta un servidor para empezar</h2>
                    <p className="empty-sub">
                        Introduce la URL de un servidor MCP arriba y pulsa <strong>Conectar</strong>.
                        Verás aquí sus tools, prompts y recursos, y podrás probarlos uno a uno.
                    </p>
                    <ol className="empty-steps">
                        <li><span className="step-num pink">1</span> Elige transporte y URL</li>
                        <li><span className="step-num lime">2</span> Conecta</li>
                        <li><span className="step-num ghost">3</span> Explora y ejecuta</li>
                    </ol>
                </div>
            )}

            <ConsoleLog entries={log} onClear={() => setLog([])} />
        </div>
    );
}