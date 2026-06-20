import { Link } from "react-router-dom";
import "./Home.css";

import pieceLeft from "../assets/puzzle-left.png";
import pieceCenter from "../assets/puzzle-center.png";
import pieceRight from "../assets/puzzle-right.png";


/* Una pieza de puzle: imagen de fondo + texto centrado encima.
   El borde grueso y la sombra ya vienen dibujados en el propio PNG,
   incluso girada se ve limpio (cosa que con clip-path no se conseguía). */
function PuzzlePiece({
    variant = "ai",          // ai | mcp | data
    src,
    label,
    rotate = 0,
    className = "",
}) {
    return (
        <div
            className={`piece piece--${variant} ${className}`}
            style={{ "--rot": `${rotate}deg` }}
        >
            <img className="piece__img" src={src} alt="" aria-hidden="true" />
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
                    <PuzzlePiece variant="ai"   src={pieceLeft}   label="IA"     rotate={-7} className="home__puzzle-piece" />
                    <PuzzlePiece variant="mcp"  src={pieceCenter} label="MCP"       rotate={8}  className="home__puzzle-piece home__puzzle-piece--mid" />
                    <PuzzlePiece variant="data" src={pieceRight}  label="Datos" rotate={-5} className="home__puzzle-piece" />
                </div>
            </div>
    
    );
}