# Cliente MCP de Kunna

Cliente web para el [MCP (Model Context Protocol)](https://modelcontextprotocol.io) desarrollado en **React + Vite**. Permite conectarse a cualquier servidor MCP, inspeccionar al instante sus *tools*, *prompts* y *resources*, y ejecutarlos desde el navegador para comprobar que todo funciona.

Aunque nace como pieza para cerrar el ciclo del servidor MCP, el cliente no está atado a él: sirve como *inspector* de propósito general para cualquier servidor que hable MCP sobre Streamable HTTP o SSE.

> Este repositorio es parte de un Trabajo de Fin de Grado (TFG). Existe también el servidor que expone los datos IoT del campus y completa la arquitectura MCP: [`Servidor MCP de Kunna`](#).

![Página de inicio de Kunna](/public/Home.png)


## ¿Qué hace este cliente?

- **Se conecta a cualquier servidor MCP** indicando su URL, el transporte (**HTTP** o **SSE**) y, si el servidor lo exige, un token **Bearer**.
- **Descubre las capacidades del servidor** tras el *handshake*: lista automáticamente sus *tools*, *prompts* y *resources*.
- **Genera formularios sobre la marcha.** A partir del `inputSchema` de cada tool (o de los argumentos de cada prompt) construye un formulario con validación de tipos, campos obligatorios, enums y booleanos. También ofrece un modo **JSON en crudo** para casos avanzados.
- **Ejecuta y muestra la respuesta.** Llama a la tool o resuelve el prompt y presenta el resultado formateado, con una **consola de actividad** que registra cada petición y respuesta.
- **Explica el contexto.** Incluye páginas divulgativas (*¿Qué es MCP?* y *¿Por qué?*) que sitúan la arquitectura y la motivación del proyecto.

![Página de inicio de Kunna](/public/Inspector.png)

## Stack tecnológico

| Pieza | Tecnología |
|---|---|
| UI | React 19 |
| Bundler / servidor de desarrollo | Vite (ESM) |
| Enrutado | react-router-dom |
| Protocolo | `@modelcontextprotocol/sdk` (cliente) · transportes Streamable HTTP y SSE |
| Validación | zod |
| Estilos | CSS propio + Google Fonts (Poppins · Source Serif 4) |
| Linter | ESLint |
| Contenedor | Docker (build multi-etapa) servido con nginx |


## Estructura del proyecto

```
.
├── index.html                    # HTML raíz que monta la app de React
├── vite.config.js                # Configuración de Vite
├── eslint.config.js              # Reglas de ESLint
├── Dockerfile                    # Build multi-etapa: Vite build → nginx
├── nginx.conf                    # Config de nginx para servir la SPA (puerto 5173)
├── package.json
├── public/                       # Estáticos servidos tal cual (favicon, iconos)
└── src/
    ├── main.jsx                  # Punto de entrada de React (monta <App/>)
    ├── App.jsx                   # Layout, navegación, tema claro/oscuro y rutas
    ├── index.css                 # Estilos base y variables de tema
    ├── App.css                   # Estilos de la app y del inspector
    │
    ├── pages/
    │   ├── Home.jsx              # Landing: «La pieza que faltaba»
    │   ├── Inspector.jsx        # El inspector: conectar, explorar y probar un servidor MCP
    │   ├── WhatIsMcp.jsx        # Página divulgativa «¿Qué es MCP?»
    │   └── Desarrollo.jsx      # Página «¿Por qué?»: motivación del proyecto
    │
    ├── components/
    │   ├── Dropdown.jsx         # Selector desplegable reutilizable
    │   └── ConsoleLog.jsx      # Consola de actividad (log de peticiones/respuestas)
    │
    ├── lib/
    │   └── mcpClient.js         # McpConnection: envuelve el SDK MCP (transporte HTTP/SSE)
    │
    └── assets/                   # Imágenes (piezas de puzzle, diagramas de flujo, perfil)
```

**Resumen de carpetas:**

- **`src/pages/`** — cada pantalla de la aplicación. El corazón es `Inspector.jsx`; el resto son la portada y las páginas divulgativas.
- **`src/components/`** — piezas de interfaz reutilizables (el desplegable y la consola de actividad).
- **`src/lib/`** — la lógica que habla MCP: `mcpClient.js` mantiene **una** conexión activa y expone `connect`, `callTool`, `getPrompt` y `disconnect`.
- **`src/assets/`** y **`public/`** — recursos gráficos e iconos.
- **`Dockerfile` + `nginx.conf`** — todo lo necesario para construir la imagen y servir la build estática.


## Requisitos

- Node.js (versión con soporte de ESM, p. ej. 18+; el `Dockerfile` usa Node 20).
- Un **servidor MCP accesible** por Streamable HTTP o SSE (por ejemplo, el servidor Kunna) con **CORS habilitado** para el origen desde el que se sirve este cliente.


## Puesta en marcha

### 1. Instalar dependencias

```bash
npm install
```

### 2. Arrancar en desarrollo

```bash
npm run dev
```

Vite levanta el servidor de desarrollo (por defecto en `http://localhost:5173`) con recarga en caliente.


## Uso del inspector

1. Abre la pestaña **Inspector**.
2. Elige el **transporte** (`HTTP` o `SSE`) e introduce la **URL** del servidor MCP, por ejemplo `http://localhost:3000/mcp`.
3. Si el servidor requiere autenticación, selecciona **Bearer** e introduce el token.
4. Pulsa **Conectar**. El cliente realiza el *handshake* MCP, lee las capacidades del servidor y lista sus **tools**, **prompts** y **resources**.
5. Selecciona una tool o un prompt: se genera un **formulario** a partir de su esquema. Rellénalo (o cambia a **modo JSON**) y pulsa ejecutar.
6. Consulta el **resultado** y revisa la **consola de actividad**, que registra cada petición y respuesta.

### Flujo típico con el servidor Kunna

1. Arranca el servidor MCP de Kunna (por defecto en `http://localhost:3000/mcp`).
2. Conéctate desde el inspector con auth **Bearer** y el `MCP_AUTH_TOKEN` del servidor (salvo en `development`, donde no hace falta).
3. Explora sus tools (`search-campus-buildings`, `query-data`, `query-aggregation`…) y sus prompts de informes, y pruébalos directamente desde la web.


## Despliegue con Docker

El proyecto incluye un *build* multi-etapa que compila la SPA con Vite y la sirve con nginx:

```bash
# Construir la imagen
docker build . -t kunnaclientemcp-frontend:latest
#   equivalente: npm run build-docker

# Ejecutar el contenedor
docker run -p 5173:5173 kunnaclientemcp-frontend:latest
```

Una vez levantado, abre `http://localhost:5173`.


## Notas

- **CORS.** Como el inspector se ejecuta en el navegador, el servidor MCP remoto debe **permitir el origen** desde el que se sirve el cliente. Si la conexión falla con un error de red, casi siempre es CORS. En el servidor Kunna esto se controla con la variable `CORS_ALLOWED_ORIGINS`.
- **Tema claro/oscuro.** La preferencia se guarda en `localStorage`, respetando el ajuste del sistema en la primera visita.
- **SDK en el navegador.** La conexión MCP se apoya en `@modelcontextprotocol/sdk` desde el lado cliente; el proyecto incluye `vite-plugin-node-polyfills` entre sus dependencias por si hiciera falta polirrellenar APIs de Node en el bundle del navegador.


## Trabajo de Fin de Grado

Proyecto desarrollado como Trabajo de Fin de Grado en la Universidad de Alicante.

- **Cliente (este repo):** cliente/inspector web genérico para servidores MCP.
- **Servidor:** [`Servidor MCP de Kunna`](#)
- **Autora:** Vanessa Covrig Roibu
- **Tutor:** Francisco Maciá Pérez