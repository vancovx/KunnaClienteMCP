import { useState } from "react";

const FOLDERS = [
    {
        title: "Sobre mí",
        cls: "fld-pink",
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
        cls: "fld-yellow",
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
        cls: "fld-lime",
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
        cls: "fld-orange",
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
    const [open, setOpen] = useState(0);

    return (
        <section className="dev-stage">
            <header className="dev-hero">
                <h1 className="dev-title">El porqué</h1>
                <p className="dev-sub">Cómo y por qué nació este cliente MCP.</p>
            </header>

            <div className="folders">
                {FOLDERS.map((f, i) => (
                    <article key={f.title} className={`fld ${f.cls} ${open === i ? "open" : ""}`}>
                        <button
                            className="ftab"
                            onClick={() => setOpen(i)}
                            aria-expanded={open === i}
                        >
                            {f.title}
                        </button>
                        <div className="fbody">
                            <div className="fpad">{f.content}</div>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}