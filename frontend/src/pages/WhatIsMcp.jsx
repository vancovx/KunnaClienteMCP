import { useState, useRef } from "react";
import flowLight from "../assets/mcp-flow-light.png";
import flowDark from "../assets/mcp-flow-dark.png";

// ── Contenido de cada carpeta ──────────────────────────────────────────
const PIEZAS = [
    {
        id: "tools",
        label: "Tools",
        tab: "vtab-lime",
        title: "Tools",
        content: (
            <>
                <p>
                    Acciones que el modelo puede <strong>ejecutar</strong>: consultar
                    datos, lanzar un cálculo, crear un registro, llamar a una API…
                </p>
                <p>
                    Reciben unos argumentos de entrada (descritos por un esquema JSON) y
                    devuelven un resultado. Son la forma en que el modelo deja de solo
                    “hablar” y pasa a <em>actuar</em> sobre sistemas externos.
                </p>
            </>
        ),
    },
    {
        id: "prompts",
        label: "Prompts",
        tab: "vtab-pink",
        title: "Prompts",
        content: (
            <>
                <p>
                    Plantillas de instrucciones <strong>reutilizables</strong> que el
                    servidor ofrece ya parametrizadas para tareas concretas.
                </p>
                <p>
                    En lugar de que cada usuario redacte el prompt desde cero, el servidor
                    expone uno probado y consistente al que solo hay que pasarle unos
                    argumentos.
                </p>
            </>
        ),
    },
    {
        id: "resources",
        label: "Resources",
        tab: "vtab-yellow",
        title: "Resources",
        content: (
            <>
                <p>
                    Datos o documentos que el servidor pone a disposición del cliente como{" "}
                    <strong>contexto</strong>: archivos, registros de una base de datos,
                    lecturas de sensores…
                </p>
                <p>
                    Cada recurso se identifica por una URI y el cliente decide cuándo
                    cargarlo para alimentar al modelo con información actualizada.
                </p>
            </>
        ),
    },
];

const TRANSPORTES = [
    {
        id: "stdio",
        label: "stdio",
        tab: "vtab-lime",
        title: "stdio",
        content: (
            <>
                <p>
                    El servidor se lanza como un <strong>proceso local</strong> y cliente y
                    servidor se comunican por la entrada/salida estándar.
                </p>
                <p>
                    Es lo habitual para herramientas que se ejecutan en tu propia máquina,
                    sin red de por medio.
                </p>
            </>
        ),
    },
    {
        id: "http",
        label: "HTTP",
        tab: "vtab-pink",
        title: "HTTP",
        content: (
            <>
                <p>
                    Pensado para <strong>servidores remotos</strong>. Es el transporte{" "}
                    <em>recomendado hoy</em> para conexiones a través de la red.
                </p>
                <p>
                    Permite autenticación mediante cabeceras (por ejemplo un token{" "}
                    <code>Bearer</code>), lo que encaja bien con servicios desplegados en
                    un servidor.
                </p>
            </>
        ),
    },
    {
        id: "sse",
        label: "SSE",
        tab: "vtab-yellow",
        title: "SSE",
        content: (
            <>
                <p>
                    La variante HTTP <strong>anterior</strong>, basada en{" "}
                    <em>Server-Sent Events</em>.
                </p>
                <p>
                    Hoy está en desuso frente a HTTP, pero se mantiene por
                    compatibilidad con servidores que aún la emplean.
                </p>
            </>
        ),
    },
];

// ── Carpeta con pestañas LATERALES (versión vertical de la de "¿Por qué?") ──
function VFolder({ items, idBase, label }) {
    const [active, setActive] = useState(0);
    const tabRefs = useRef([]);

    function onKeyDown(e, i) {
        let next = null;
        if (e.key === "ArrowDown") next = (i + 1) % items.length;
        if (e.key === "ArrowUp") next = (i - 1 + items.length) % items.length;
        if (e.key === "Home") next = 0;
        if (e.key === "End") next = items.length - 1;
        if (next !== null) {
            e.preventDefault();
            setActive(next);
            tabRefs.current[next]?.focus();
        }
    }

    return (
        <div className="vfolder">
            <div
                className="vtabs"
                role="tablist"
                aria-orientation="vertical"
                aria-label={label}
            >
                {items.map((it, i) => (
                    <button
                        key={it.id}
                        ref={(el) => (tabRefs.current[i] = el)}
                        className={`vtab ${it.tab} ${active === i ? "is-active" : ""}`}
                        role="tab"
                        id={`${idBase}-tab-${i}`}
                        aria-controls={`${idBase}-panel-${i}`}
                        aria-selected={active === i}
                        tabIndex={active === i ? 0 : -1}
                        onClick={() => setActive(i)}
                        onKeyDown={(e) => onKeyDown(e, i)}
                    >
                        {it.label}
                    </button>
                ))}
            </div>

            <div className="vbody">
                {items.map((it, i) => (
                    <section
                        key={it.id}
                        className="vpanel"
                        role="tabpanel"
                        id={`${idBase}-panel-${i}`}
                        aria-labelledby={`${idBase}-tab-${i}`}
                        hidden={active !== i}
                    >
                        <h3>{it.title}</h3>
                        {it.content}
                    </section>
                ))}
            </div>
        </div>
    );
}

export default function WhatIsMcp() {
    return (
        <div className="prose">
            <h1>¿Qué es MCP?</h1>

            <p className="lead">
                El <strong>Model Context Protocol</strong> (MCP) es un estándar abierto que
                permite a las aplicaciones de IA conectarse con herramientas y fuentes de
                datos externas de forma uniforme, sin integraciones a medida para cada una.
            </p>

            <figure className="mcp-flow">
                <img className="mcp-flow-light" src={flowLight} alt="Flujo de comunicación del Model Context Protocol" />
                <img className="mcp-flow-dark" src={flowDark} alt="Flujo de comunicación del Model Context Protocol" />
            </figure>

            <h2>El problema que resuelve</h2>
            <p>
                Antes, conectar un modelo de IA a cada servicio (una base de datos, una API,
                un sistema de archivos) requería código específico para cada combinación. MCP
                define un único “idioma” entre cliente y servidor: cualquier cliente que hable
                MCP puede usar cualquier servidor que lo implemente.
            </p>

            <h2>Las piezas</h2>
            <p>Un servidor MCP puede exponer tres tipos de capacidades:</p>
            <VFolder items={PIEZAS} idBase="piezas" label="Capacidades de un servidor MCP" />

            <h2>Transportes</h2>
            <p>
                Cliente y servidor se comunican por un “transporte”. Este inspector soporta
                los tres habituales:
            </p>
            <VFolder items={TRANSPORTES} idBase="transportes" label="Transportes soportados" />
        </div>
    );
}