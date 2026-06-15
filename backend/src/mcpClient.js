import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

// Construye los headers HTTP a partir de la opción de auth que elija el usuario.
// type: "none" | "bearer" | "custom"
function buildHeaders(auth = { type: "none" }) {
    if (auth?.type === "bearer") return { Authorization: `Bearer ${auth.token}` };
    if (auth?.type === "custom") return { ...(auth.headers ?? {}) };
    return {};
}

// Devuelve el transporte adecuado según la config de conexión.
// Esto es lo que hace que el cliente sea GENÉRICO: el usuario elige a qué
// servidor y por qué transporte conectarse en tiempo de ejecución.
function buildTransport(config) {
    switch (config.transport) {
        case "http":
            return new StreamableHTTPClientTransport(new URL(config.url), {
                requestInit: { headers: buildHeaders(config.auth) },
            });

        case "sse":
            return new SSEClientTransport(new URL(config.url), {
                requestInit: { headers: buildHeaders(config.auth) },
            });

        case "stdio":
            return new StdioClientTransport({
                command: config.command,      // ej: "node"
                args: config.args ?? [],      // ej: ["server.js"]
                env: config.env,              // variables de entorno opcionales
            });

        default:
            throw new Error(`Transporte no soportado: ${config.transport}`);
    }
}

// Mantiene UNA conexión MCP activa. De momento es suficiente para arrancar;
// el soporte multi-sesión (varias conexiones a la vez) lo añadiremos después.
export class McpConnection {
    constructor() {
        this.client = null;
        this.transport = null;
    }

    get connected() {
        return this.client !== null;
    }

    async connect(config) {
        // Si ya había una conexión, la cerramos antes de abrir otra.
        if (this.client) await this.disconnect();

        this.transport = buildTransport(config);
        this.client = new Client(
            { name: "mi-inspector-tfg", version: "0.1.0" },
            { capabilities: {} }
        );

        // connect() hace internamente el initialize + notifications/initialized
        await this.client.connect(this.transport);

        // Descubrimiento por capacidades: solo pedimos lo que el servidor declara.
        const capabilities = this.client.getServerCapabilities() ?? {};
        const [tools, prompts, resources] = await Promise.all([
            capabilities.tools     ? this.client.listTools()     : { tools: [] },
            capabilities.prompts   ? this.client.listPrompts()   : { prompts: [] },
            capabilities.resources ? this.client.listResources() : { resources: [] },
        ]);

        return {
            serverInfo: this.client.getServerVersion(),  // { name, version }
            capabilities,
            tools: tools.tools,
            prompts: prompts.prompts,
            resources: resources.resources,
        };
    }

    async callTool(name, args = {}) {
        if (!this.client) throw new Error("No hay conexión activa");
        return this.client.callTool({ name, arguments: args });
    }

    async getPrompt(name, args = {}) {
        if (!this.client) throw new Error("No hay conexión activa");
        return this.client.getPrompt({ name, arguments: args });
    }

    async disconnect() {
        if (this.client) await this.client.close();
        this.client = null;
        this.transport = null;
    }
}