import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

function buildHeaders(auth = { type: "none" }) {
    if (auth?.type === "bearer") return { Authorization: `Bearer ${auth.token}` };
    if (auth?.type === "custom") return { ...(auth.headers ?? {}) };
    return {};
}

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

        default:
            throw new Error(`Transporte no soportado en navegador: ${config.transport}`);
    }
}

// Mantiene UNA conexión MCP activa en el frontend.
export class McpConnection {
    constructor() {
        this.client = null;
        this.transport = null;
    }

    get connected() {
        return this.client !== null;
    }

    async connect(config) {
        if (this.client) await this.disconnect();

        this.transport = buildTransport(config);
        this.client = new Client(
            { name: "mi-inspector-tfg-web", version: "0.1.0" },
            { capabilities: {} }
        );

        await this.client.connect(this.transport);

        const capabilities = this.client.getServerCapabilities() ?? {};
        const [tools, prompts, resources] = await Promise.all([
            capabilities.tools     ? this.client.listTools()     : { tools: [] },
            capabilities.prompts   ? this.client.listPrompts()   : { prompts: [] },
            capabilities.resources ? this.client.listResources() : { resources: [] },
        ]);

        return {
            serverInfo: this.client.getServerVersion(),  
            capabilities,
            tools: tools.tools || [],
            prompts: prompts.prompts || [],
            resources: resources.resources || [],
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
        if (this.client) {
            try {
                await this.client.close();
            } catch (err) {
                console.warn("Error al cerrar conexión MCP:", err);
            }
        }
        this.client = null;
        this.transport = null;
    }
}
