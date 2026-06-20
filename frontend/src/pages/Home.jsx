import { Link } from "react-router-dom";
import "./Home.css";

/* Una pieza de puzle dibujada en SVG: el borde grueso queda limpio
   incluso girada (cosa que con clip-path no se consigue bien). */
function PuzzlePiece({
    variant = "ai",          // ai | mcp | data
    label,
    rotate = 0,
    className = "",
}) {
    // Cada variante encaja por lados distintos:
    //  - ai   : pestaña SALIENTE a la derecha
    //  - mcp  : hueco ENTRANTE a la izquierda + pestaña SALIENTE a la derecha
    //  - data : hueco ENTRANTE a la izquierda
    const paths = {
        ai: "M8,8 H78 V40 C78,30 96,30 96,46 C96,62 78,62 78,52 V92 H8 Z",
        mcp: "M28,8 H86 V40 C86,30 104,30 104,46 C104,62 86,62 86,52 V92 H28 V70 C28,80 10,80 10,64 C10,48 28,48 28,58 Z",
        data: "M30,8 H98 V92 H30 V70 C30,80 12,80 12,64 C12,48 30,48 30,58 Z",
    };

    return (
        <div
            className={`piece piece--${variant} ${className}`}
            style={{ "--rot": `${rotate}deg` }}
            aria-hidden="true"
        >
            <svg viewBox="0 0 112 100" className="piece__svg">
                <path className="piece__shape" d={paths[variant]} />
            </svg>
            <span className={`piece__label ${variant === "mcp" ? "piece__label--pixel" : ""}`}>
                {label}
            </span>
        </div>
    );
}

export default function Home() {
    return (

            <div className="home__inner">
    
                <h1 className="home__title">
                    <span className="home__title-line">La pieza</span>
                    <span className="home__title-line">
                        que <mark className="home__mark">faltaba</mark>
                    </span>
                </h1>

                <p className="home__lead">
                    Kunna es un cliente del <strong>Model Context Protocol</strong>:
                    el puente que conecta tu IA con tus herramientas y datos.
                    Conéctate a cualquier servidor, inspecciona sus tools y prompts
                    y pruébalos al instante.
                </p>

                <div className="home__actions">
                    <Link className="home__cta" to="/inspector">
                        Abrir el inspector</Link>
                </div>

                {/* Las tres piezas desencajadas y giradas */}
                <div className="home__puzzle" role="img" aria-label="Tu IA se conecta con tus datos a través de MCP">
                    <PuzzlePiece variant="ai" label="Tu IA" rotate={-7} className="home__puzzle-piece" />
                    <PuzzlePiece variant="mcp" label="MCP" rotate={8} className="home__puzzle-piece home__puzzle-piece--mid" />
                    <PuzzlePiece variant="data" label="Tus datos" rotate={-5} className="home__puzzle-piece" />
                </div>
            </div>
        
    );
}