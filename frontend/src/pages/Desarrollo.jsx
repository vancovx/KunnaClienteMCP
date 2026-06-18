export default function Desarrollo() {
    return (
        <div className="prose creadora">
            <h1>La creadora</h1>

            <div className="profile">
                <div className="avatar">TN</div>
                <div>
                    <h2 className="profile-name">[Tu nombre]</h2>
                    <p className="role">[Grado, ej. Grado en Ingeniería Informática] · Universidad de Alicante</p>
                </div>
            </div>

            <p>
                ¡Hola! Soy [Tu Nombre], estudiante en la Universidad de Alicante. Este proyecto nace como el resultado 
                de mi Trabajo de Fin de Grado, impulsado por el interés de explorar el potencial de la integración entre 
                Modelos de Lenguaje (LLMs) y sistemas externos mediante protocolos estandarizados de comunicación.
            </p>

            <h2>Sobre este proyecto</h2>
            <p>
                Este cliente MCP es la pieza que cierra el ecosistema de mi Trabajo de Fin de Grado. Su objetivo es ofrecer
                una interfaz visual e intuitiva para conectarse a servidores del <em>Model Context Protocol</em> (MCP),
                inspeccionar las herramientas, prompts y recursos que exponen, y probarlas de forma interactiva. Como caso 
                de estudio principal, el sistema interactúa con el servidor de datos IoT desarrollado para el campus.
            </p>

            <h2>¿Por qué desarrollar un cliente propio?</h2>
            <p>
                Es cierto que el ecosistema MCP ya cuenta con clientes oficiales y comunitarios consolidados (como Claude Desktop o la extensión de VS Code). Sin embargo, la decisión de diseñar y programar un cliente a medida responde a tres motivos fundamentales para el desarrollo de este TFG:
            </p>
            
            <ul>
                <li>
                    <strong>Comprensión del protocolo de extremo a extremo:</strong> Implementar tanto el servidor como el cliente es la única manera de asimilar de forma holística el flujo de ciclo de vida de MCP. Permite entender de primera mano la negociación de capacidades, el formateo de JSON-RPC y la gestión de contextos desde ambas perspectivas.
                </li>
                <li>
                    <strong>Aislamiento de pruebas y depuración:</strong> Al disponer de un cliente propio, se elimina la opacidad de los clientes comerciales. Esto facilita la inspección directa de los mensajes de depuración (logs) y los flujos de datos en tiempo real entre la interfaz y el servidor IoT del campus sin interferencias externas.
                </li>
                <li>
                    <strong>Especialización del caso de uso:</strong> Aunque los clientes genéricos son potentes, desarrollar una interfaz específica permite adaptar la experiencia de usuario y la visualización de datos a las necesidades concretas del entorno IoT universitario analizado.
                </li>
            </ul>

            <blockquote>
                En informática hay una máxima inquebrantable: <em>&ldquo;No entiendes realmente cómo funciona un protocolo hasta que no picas tú mismo tanto el servidor como el cliente&rdquo;</em>. Este proyecto es la demostración empírica de ese proceso de aprendizaje.
            </blockquote>

            <h2>Contacto</h2>
            <p>
                Si tienes curiosidad por el proyecto, quieres revisar el código del servidor o simplemente charlar sobre MCP e IA, puedes encontrarme en:
            </p>
            <ul>
                <li><strong>GitHub:</strong> <a href="https://github.com/[TuUsuario]" target="_blank" rel="noreferrer">github.com/[TuUsuario]</a></li>
                <li><strong>LinkedIn:</strong> <a href="https://linkedin.com/in/[TuPerfil]" target="_blank" rel="noreferrer">linkedin.com/in/[TuPerfil]</a></li>
                <li><strong>Email:</strong> <a href="mailto:[tu-correo]@alu.ua.es">[tu-correo]@alu.ua.es</a></li>
            </ul>
        </div>
    );
}