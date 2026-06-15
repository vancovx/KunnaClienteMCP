export default function Creadora() {
    return (
        <div className="prose creadora">
            <h1>La creadora</h1>

            <div className="profile">
                <div className="avatar">TN</div>
                <div>
                    <h2 className="profile-name">[Tu nombre]</h2>
                    <p className="role">[Grado] · Universidad de Alicante</p>
                </div>
            </div>

            <p>
                [Breve presentación: quién eres, en qué grado estás y qué te llevó a hacer
                este trabajo. Dos o tres frases en primera persona quedan muy naturales aquí.]
            </p>

            <h2>Sobre este proyecto</h2>
            <p>
                Este cliente MCP es parte de mi Trabajo de Fin de Grado. Su objetivo es ofrecer
                una interfaz visual para conectarse a servidores del Model Context Protocol,
                inspeccionar las herramientas que exponen y probarlas sin necesidad de la
                terminal, usando como caso de estudio el servidor de datos IoT del campus.
            </p>

            <h2>Contacto</h2>
            <p>
                [Correo, GitHub o LinkedIn que quieras dejar.]
            </p>

            <p className="note">
                Edita esta página en <code>src/pages/Creadora.jsx</code> con tus datos reales.
            </p>
        </div>
    );
}