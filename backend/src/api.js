import express from "express";
import cors from "cors";
import { McpConnection } from "./mcpClient.js";

const app = express();

app.use(cors());            // en desarrollo permitimos que el frontend (Vite) hable con el backend
app.use(express.json());

// De momento una sola conexión activa, guardada en memoria.
const connection = new McpConnection();

// Comprobar que el backend vive y si hay conexión MCP abierta.
app.get("/api/health", (req, res) => {
    res.json({ ok: true, connected: connection.connected });
});

// Abrir conexión con un servidor MCP. Body de ejemplo (tu servidor):
// { "transport": "http", "url": "http://localhost:3000/mcp",
//   "auth": { "type": "bearer", "token": "TU_TOKEN" } }
app.post("/api/connect", async (req, res) => {
    try {
        const result = await connection.connect(req.body);
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Llamar a una tool. Body: { "name": "search-campus-buildings",
//                            "arguments": { "query": "la poli" } }
app.post("/api/call", async (req, res) => {
    try {
        const { name, arguments: args } = req.body;
        const result = await connection.callTool(name, args ?? {});
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Obtener prompts
app.post("/api/prompt", async (req, res) => {
    try {
        const { name, arguments: args } = req.body;
        const result = await connection.getPrompt(name, args ?? {});
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Cerrar la conexión activa.
app.post("/api/disconnect", async (req, res) => {
    await connection.disconnect();
    res.json({ ok: true });
});

const PORT = process.env.PORT ?? 4000;
app.listen(PORT, () => {
    console.log(`Backend del inspector escuchando en http://localhost:${PORT}`);
});