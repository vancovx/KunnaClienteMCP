export default function ConsoleLog({ entries, onClear }) {
    return (
        <div className="console">
            <div className="console-bar">
                <span className="cdot red" />
                <span className="cdot yellow" />
                <span className="cdot green" />
                <span className="console-title">actividad</span>
                {entries.length > 0 && (
                    <button className="console-clear" onClick={onClear}>limpiar</button>
                )}
            </div>
            <div className="console-body">
                {entries.length === 0 && (
                    <div className="console-line muted">Esperando actividad…</div>
                )}
                {entries.map((e, i) => (
                    <div key={i} className="console-line">
                        <span className="ts">{e.time}</span>
                        <span className={`tag ${e.kind}`}>{e.label}</span>
                        <span className="msg">{e.msg}</span>
                    </div>
                ))}
                <div className="console-line prompt">
                    <span className="caret">$</span>
                    <span className="cursor" />
                </div>
            </div>
        </div>
    );
}