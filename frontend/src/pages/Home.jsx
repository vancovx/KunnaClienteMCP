import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div className="home">
            <p className="eyebrow">TFG · Universidad de Alicante</p>

            <h1 className="hero">
                Esto es un <span className="hl hl-pink">cliente</span>{" "}
                <span className="hl hl-lime">MCP</span>.
            </h1>

            <p className="lead">
                Una herramienta para conectarse a cualquier servidor del Model Context
                Protocol, inspeccionar las tools y prompts que expone, y probarlas al
                instante — sin escribir una sola línea de código.
            </p>

            <Link className="cta" to="/inspector">Abrir el inspector →</Link>

            <div className="cards">
                <article className="card card-pink">
                    <h3>Conecta con cualquiera</h3>
                    <p>HTTP, SSE o stdio, con o sin autenticación. Tú pones la URL y el token.</p>
                </article>
                <article className="card card-lime">
                    <h3>Inspecciona</h3>
                    <p>Descubre las tools, prompts y capacidades que declara el servidor.</p>
                </article>
                <article className="card card-yellow">
                    <h3>Prueba al instante</h3>
                    <p>Lanza llamadas con tus argumentos y mira la respuesta en crudo.</p>
                </article>
            </div>
        </div>
    );
}