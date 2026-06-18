import { useState, useRef } from "react";

const FOLDERS = [
    {
        title: "Sobre mí",
        tab: "dtab-pink",
        content: (
            <>
                <p>
                    Soy <strong>Vanessa Covrig Roibu</strong>, estudiante de{" "}
                    [Grado] en la Universidad de Alicante. Este cliente MCP es el
                    resultado de mi Trabajo de Fin de Grado.
                </p>
                <p>
                    Nace del interés por explorar la integración entre modelos de
                    lenguaje (LLMs) y sistemas externos mediante protocolos
                    estandarizados de comunicación.
                </p>
            </>
        ),
    },
    {
        title: "El proyecto",
        tab: "dtab-yellow",
        content: (
            <>
                <p>
                    Una interfaz visual e intuitiva para conectarse a servidores del{" "}
                    <em>Model Context Protocol</em>, inspeccionar las tools, prompts y
                    recursos que exponen y probarlos de forma interactiva.
                </p>
                <p>
                    Como caso de estudio principal, el sistema interactúa con el
                    servidor de datos IoT desarrollado para el campus.
                </p>
            </>
        ),
    },
    {
        title: "¿Por qué un cliente propio?",
        tab: "dtab-lime",
        content: (
            <>
                <p>
                    El ecosistema ya tiene clientes consolidados (Claude Desktop, la
                    extensión de VS Code…). Aun así, programar uno a medida tiene
                    sentido para este TFG:
                </p>
                <ul>
                    <li>
                        <strong>Protocolo de extremo a extremo:</strong> picar servidor y
                        cliente es la única forma de asimilar el ciclo de vida de MCP —
                        negociación de capacidades, JSON-RPC y gestión de contextos.
                    </li>
                    <li>
                        <strong>Depuración sin cajas negras:</strong> un cliente propio
                        deja inspeccionar logs y flujos en tiempo real con el servidor IoT
                        sin la opacidad de los clientes comerciales.
                    </li>
                    <li>
                        <strong>Caso de uso especializado:</strong> adaptar la experiencia
                        y la visualización a las necesidades del entorno IoT universitario.
                    </li>
                </ul>
            </>
        ),
    },
    {
        title: "Contacto",
        tab: "dtab-ink",
        content: (
            <p>
                <strong>GitHub:</strong>{" "}
                <a href="https://github.com/[TuUsuario]" target="_blank" rel="noreferrer">
                    github.com/[TuUsuario]
                </a>{" "}
                · <strong>LinkedIn:</strong>{" "}
                <a href="https://linkedin.com/in/[TuPerfil]" target="_blank" rel="noreferrer">
                    linkedin.com/in/[TuPerfil]
                </a>{" "}
                · <strong>Email:</strong>{" "}
                <a href="mailto:[tu-correo]@alu.ua.es">[tu-correo]@alu.ua.es</a>
            </p>
        ),
    },
];

export default function Desarrollo() {
    const [active, setActive] = useState(0);
    const tabRefs = useRef([]);

    function onKeyDown(e, i) {
        let next = null;
        if (e.key === "ArrowRight") next = (i + 1) % FOLDERS.length;
        if (e.key === "ArrowLeft") next = (i - 1 + FOLDERS.length) % FOLDERS.length;
        if (e.key === "Home") next = 0;
        if (e.key === "End") next = FOLDERS.length - 1;
        if (next !== null) {
            e.preventDefault();
            setActive(next);
            tabRefs.current[next]?.focus();
        }
    }

    return (
        <section className="dev-stage">
            <header className="dev-hero">
                <h1 className="dev-title">¿Por qué?</h1>
                <p className="dev-sub">Cómo y por qué nació este cliente MCP.</p>
            </header>

            <div className="dfolder">
                <div className="dtabs" role="tablist" aria-label="Sobre el proyecto">
                    {FOLDERS.map((f, i) => (
                        <button
                            key={f.title}
                            ref={(el) => (tabRefs.current[i] = el)}
                            className={`dtab ${f.tab} ${active === i ? "is-active" : ""}`}
                            role="tab"
                            id={`dtab-${i}`}
                            aria-controls={`dpanel-${i}`}
                            aria-selected={active === i}
                            tabIndex={active === i ? 0 : -1}
                            onClick={() => setActive(i)}
                            onKeyDown={(e) => onKeyDown(e, i)}
                        >
                            {f.title}
                        </button>
                    ))}
                </div>

                <div className="dbody">
                    {FOLDERS.map((f, i) => (
                        <section
                            key={f.title}
                            className="dpanel"
                            role="tabpanel"
                            id={`dpanel-${i}`}
                            aria-labelledby={`dtab-${i}`}
                            hidden={active !== i}
                        >
                            <h2>{f.title}</h2>
                            {f.content}
                        </section>
                    ))}
                </div>
            </div>
        </section>
    );
}