import { useState } from "react";

const API = "http://localhost:4000/api";

export default function Inspector() {
    const [form, setForm] = useState({
        transport: "http",
        url: "http://localhost:3001/mcp",
        authType: "bearer",
        token: "",
    });
    const [status, setStatus] = useState("idle"); // idle | connecting | connected | error
    const [error, setError] = useState("");
    const [server, setServer] = useState(null);   // { serverInfo, capabilities, tools, prompts }
    const [selected, setSelected] = useState(null);
    const [argsText, setArgsText] = useState("{}");
    const [calling, setCalling] = useState(false);
    const [result, setResult] = useState(null);
    const [callError, setCallError] = useState("");

    const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));
    const connected = status === "connected";

    async function connect() {
        setStatus("connecting");
        setError("");
        setServer(null);
        setSelected(null);
        setResult(null);
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
        } catch (e) {
            setError(e.message);
            setStatus("error");
        }
    }

    async function disconnect() {
        await fetch(`${API}/disconnect`, { method: "POST" });
        setServer(null);
        setSelected(null);
        setResult(null);
        setStatus("idle");
    }

    function selectTool(tool) {
        setSelected(tool);
        setResult(null);
        setCallError("");
        setArgsText("{}");
    }

    async function callTool() {
        setCalling(true);
        setCallError("");
        setResult(null);
        try {
            let args;
            try {
                args = JSON.parse(argsText || "{}");
            } catch {
                throw new Error("Los argumentos no son JSON válido");
            }
            const res = await fetch(`${API}/call`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: selected.name, arguments: args }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.cause || data.error || "Error al llamar");
            setResult(data);
        } catch (e) {
            setCallError(e.message);
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
                <main className="grid">
                    <aside className="panel">
                        <h2>Tools <span className="count">{server.tools.length}</span></h2>
                        <ul className="list">
                            {server.tools.map((t) => (
                                <li
                                    key={t.name}
                                    className={selected?.name === t.name ? "item active" : "item"}
                                    onClick={() => selectTool(t)}
                                >
                                    <code>{t.name}</code>
                                </li>
                            ))}
                        </ul>

                        <h2>Prompts <span className="count">{server.prompts.length}</span></h2>
                        <ul className="list">
                            {server.prompts.map((p) => (
                                <li key={p.name} className="item static">
                                    <code>{p.name}</code>
                                </li>
                            ))}
                        </ul>
                    </aside>

                    <section className="panel main">
                        {!selected ? (
                            <p className="hint">Elige una tool de la izquierda para probarla.</p>
                        ) : (
                            <>
                                <h2 className="tool-title"><code>{selected.name}</code></h2>
                                {selected.description && <p className="desc">{selected.description}</p>}

                                {selected.inputSchema && (
                                    <details className="schema">
                                        <summary>Ver inputSchema</summary>
                                        <pre>{JSON.stringify(selected.inputSchema, null, 2)}</pre>
                                    </details>
                                )}

                                <label>Argumentos (JSON)</label>
                                <textarea
                                    value={argsText}
                                    onChange={(e) => setArgsText(e.target.value)}
                                    rows={6}
                                    spellCheck={false}
                                />
                                <button onClick={callTool} disabled={calling}>
                                    {calling ? "Llamando…" : "Llamar a la tool"}
                                </button>

                                {callError && <div className="banner error">{callError}</div>}
                                {result && (
                                    <>
                                        <label>Resultado</label>
                                        <pre className="result">{JSON.stringify(result, null, 2)}</pre>
                                    </>
                                )}
                            </>
                        )}
                    </section>
                </main>
            )}

            {status === "idle" && (
                <p className="hint center">Introduce la URL de un servidor MCP y pulsa Conectar.</p>
            )}
        </div>
    );
}