export default function WhatIsMcp() {
    return (
        <div className="prose">
            <h1>¿Qué es MCP?</h1>

            <p className="lead">
                El <strong>Model Context Protocol</strong> (MCP) es un estándar abierto que
                permite a las aplicaciones de IA conectarse con herramientas y fuentes de
                datos externas de forma uniforme, sin integraciones a medida para cada una.
            </p>

            <div className="diagram">
                <div className="node">
                    Cliente
                    <span>esta app, Claude, un IDE…</span>
                </div>
                <div className="arrow">— MCP —&gt;</div>
                <div className="node">
                    Servidor
                    <span>tus tools y datos</span>
                </div>
            </div>

            <h2>El problema que resuelve</h2>
            <p>
                Antes, conectar un modelo de IA a cada servicio (una base de datos, una API,
                un sistema de archivos) requería código específico para cada combinación. MCP
                define un único “idioma” entre cliente y servidor: cualquier cliente que hable
                MCP puede usar cualquier servidor que lo implemente.
            </p>

            <h2>Las piezas</h2>
            <p>Un servidor MCP puede exponer tres tipos de capacidades:</p>
            <ul className="features">
                <li>
                    <strong className="tag tag-pink">Tools</strong>
                    Acciones que el modelo puede ejecutar: consultar datos, lanzar un cálculo,
                    crear un registro. Reciben argumentos y devuelven un resultado.
                </li>
                <li>
                    <strong className="tag tag-lime">Prompts</strong>
                    Plantillas de instrucciones reutilizables que el servidor ofrece para
                    tareas concretas, ya parametrizadas.
                </li>
                <li>
                    <strong className="tag tag-yellow">Resources</strong>
                    Datos o documentos que el servidor pone a disposición del cliente como
                    contexto.
                </li>
            </ul>

            <h2>Transportes</h2>
            <p>
                Cliente y servidor se comunican por un “transporte”. Los habituales son{" "}
                <strong>stdio</strong> (servidor local lanzado como proceso),{" "}
                <strong>HTTP</strong> (servidores remotos, el recomendado hoy) y{" "}
                <strong>SSE</strong> (la variante HTTP anterior, ya en desuso). Este inspector
                soporta los tres.
            </p>
        </div>
    );
}