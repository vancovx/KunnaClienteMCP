import { Link } from "react-router-dom";

export default function Home() {
    return (
        <section className="hero-stage">
            <span className="hero-tag hero-tag-tr">Model Context Protocol</span>
            <span className="hero-tag hero-tag-bl">TFG · Universidad de Alicante</span>

            <span className="deco deco-1" aria-hidden="true"></span>
            <span className="deco deco-2" aria-hidden="true"></span>
            <span className="deco deco-3" aria-hidden="true"></span>

            <div className="hero-grid">
                <h1 className="display">
                    <span className="display-line">Esto es un</span>
                    <span className="display-line">cliente</span>
                    <span className="display-pixel">MCP</span>
                </h1>

                <div className="hero-aside">
                    <p className="hero-lead">
                        Conéctate a cualquier servidor del Model Context Protocol,
                        inspecciona las tools y prompts que expone y pruébalas al
                        instante — sin escribir una sola línea de código.
                    </p>
                    <Link className="cta" to="/inspector">Abrir el inspector →</Link>
                </div>
            </div>
        </section>
    );
}