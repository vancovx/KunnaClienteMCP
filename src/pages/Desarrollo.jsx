import { useState, useRef } from "react";
import fotoPerfil from "../assets/vanessa-perfil.jpg";

const GithubIcon = () => (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38
        0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13
        -.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07
        -.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2
        -.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2
        .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15
        0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0
        .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
);

const LinkedinIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.03-1.85-3.03-1.86 0-2.15
        1.45-2.15 2.94v5.66H9.33V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85
        3.61 0 4.28 2.38 4.28 5.47v6.27zM5.34 7.43a2.07 2.07 0 1 1 0-4.14
        2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.56V9h3.56v11.45z" />
    </svg>
);

const MailIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 6-10 7L2 6" />
    </svg>
);

const FOLDERS = [
    {
        title: "Sobre mí",
        tab: "dtab-pink",
        content: (
            <div className="dabout">
                <div className="dabout-text">
                    <p>
                        Soy <strong>Vanessa Covrig Roibu</strong>, estudiante de último curso de Ingeniería Multimedia 
                        en la Universidad de Alicante. Este cliente MCP es una pequeña parte del
                        resultado de mi Trabajo de Fin de Grado.
                    </p>
                    <p>
                        Nace del interés por explorar la integración entre modelos de
                        lenguaje (LLMs) y sistemas externos mediante protocolos
                        estandarizados de comunicación.
                    </p>

                    <a
                        className="icon-btn"
                        href="https://github.com/vancovx"
                        target="_blank"
                        rel="noreferrer"
                        aria-label="GitHub"
                        title="GitHub"
                    >
                        <GithubIcon />
                    </a>
                    <a
                        className="icon-btn"
                        href="https://www.linkedin.com/in/vanessa-covrig-19161229b"
                        target="_blank"
                        rel="noreferrer"
                        aria-label="LinkedIn"
                        title="LinkedIn"
                    >
                        <LinkedinIcon />
                    </a>
                    <a
                        className="icon-btn"
                        href="mailto:[vanessacovrig7]@gmail.com"
                        aria-label="Email"
                        title="Email"
                    >
                        <MailIcon />
                    </a>
                </div>
                <img
                    src={fotoPerfil}
                    alt="Vanessa Covrig Roibu"
                    className="dabout-photo"
                />
            </div>
        ),
    },
    {
        title: "El proyecto",
        tab: "dtab-yellow",
        content: (
            <>
                <p>
                    Este Trabajo de Fin de Grado consiste en el diseño e implementación de un{" "}
                    <strong>servidor MCP</strong> (<em>Model Context Protocol</em>) en el contexto
                    de plataformas <strong>smart univeristy</strong>, más concretamente integrado con{" "}
                    <strong>Kunna</strong>, el proyecto de universidad inteligente de la{" "}
                    <a href="https://smart.ua.es/" target="_blank" rel="noreferrer">
                        Universidad de Alicante
                    </a>
                    
                </p>
                <p>
                    El servidor expone los datos IoT del campus universitario como herramientas,
                    prompts y recursos accesibles para modelos de lenguaje. Este cliente visual
                    permite conectarse a dicho servidor, explorar lo que ofrece y probarlo de
                    forma interactiva.
                
                </p>
                <div className="dabout-text">
                <a className="foot-gh" href="https://github.com/vancovx/KunnaServidorMCP" target="_blank" rel="noreferrer">
                        <GithubIcon /> Servidor MCP
                </a>
                </div>

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
                        <strong>Protocolo de extremo a extremo:</strong> desarrollar servidor y
                        cliente es la única forma de asimilar el ciclo de vida de MCP
                        negociación de capacidades, JSON-RPC y gestión de contextos.
                    </li>
                    <li>
                        <strong>Depuración:</strong> un cliente propio
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