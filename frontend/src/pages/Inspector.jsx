import { useState } from "react";
import ConsoleLog from "../components/ConsoleLog";
import Dropdown from "../components/Dropdown";

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

            {!connected && (
                <p className="inspector-lead">
                    Introduce la URL de un servidor MCP y pulsa <strong>Conectar</strong> para
                    explorar y probar sus tools y prompts.
                </p>
            )}

            <section className="connect-bar">
                <Dropdown
                    value={form.transport}
                    onChange={(v) => update("transport", v)}
                    disabled={connected}
                    options={[
                        { value: "http", label: "HTTP" },
                        { value: "sse", label: "SSE" },
                    ]}
                />
                <input
                    className="url"
                    placeholder="http://localhost:3001/mcp"
                    value={form.url}
                    onChange={(e) => update("url", e.target.value)}
                    disabled={connected}
                />
                <Dropdown
                    value={form.authType}
                    onChange={(v) => update("authType", v)}
                    disabled={connected}
                    options={[
                        { value: "none", label: "Sin auth" },
                        { value: "bearer", label: "Bearer" },
                    ]}
                />
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
                                                <Dropdown
                                                    value={fieldValues[f.name] ?? ""}
                                                    onChange={(v) => setField(f.name, v)}
                                                    placeholder="— elige —"
                                                    options={f.enum.map((opt) => ({
                                                        value: opt,
                                                        label: opt,
                                                    }))}
                                                />
                                            ) : f.type === "boolean" ? (
                                                <Dropdown
                                                    value={fieldValues[f.name] ?? "false"}
                                                    onChange={(v) => setField(f.name, v)}
                                                    options={[
                                                        { value: "false", label: "false" },
                                                        { value: "true", label: "true" },
                                                    ]}
                                                />
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
                                    <label>Resultado</label>
                                    <pre className="result">{JSON.stringify(result, null, 2)}</pre>
                                </div>
                            )}
                        </section>
                    )}
                </main>
            )}

            <ConsoleLog entries={log} onClear={() => setLog([])} />
        </div>
    );
}