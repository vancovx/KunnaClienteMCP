import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, NavLink, Outlet } from "react-router-dom";
import "./App.css";

import Home from "./pages/Home.jsx";
import WhatIsMcp from "./pages/WhatIsMcp.jsx";
import Inspector from "./pages/Inspector.jsx";
import Creadora from "./pages/Creadora.jsx";

const MoonIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
);

const SunIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
);

function navClass({ isActive }) {
    return isActive ? "navlink active" : "navlink";
}

function Layout({ theme, toggleTheme }) {
    return (
        <div className="app">
            <header className="nav">
                <NavLink to="/" className="brand">Kunna MCP</NavLink>
                <nav className="navlinks">
                    <NavLink to="/inspector" className={navClass}>Inspector</NavLink>
                    <NavLink to="/mcp" className={navClass}>¿Qué es MCP?</NavLink>
                    <NavLink to="/creadora" className={navClass}>¿Por qué?</NavLink>
                </nav>
                <button className="icon-btn" onClick={toggleTheme} aria-label="Cambiar tema" title="Cambiar tema">
                    {theme === "dark" ? <SunIcon /> : <MoonIcon />}
                </button>
            </header>

            <main className="page">
                <Outlet />
            </main>

            <footer className="foot">
                <span className="dots">
                    <i style={{ background: "#fc90c2" }} />
                    <i style={{ background: "#b2fd94" }} />
                    <i style={{ background: "#f6ed9e" }} />
                </span>
                <span>Cliente Kunna MCP · Trabajo de fin de grado · Universidad de Alicante · 2026</span>
            </footer>
        </div>
    );
}

export default function App() {
    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem("inspector-theme");
        if (saved) return saved;
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    });

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("inspector-theme", theme);
    }, [theme]);

    const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout theme={theme} toggleTheme={toggleTheme} />}>
                    <Route index element={<Home />} />
                    <Route path="mcp" element={<WhatIsMcp />} />
                    <Route path="inspector" element={<Inspector />} />
                    <Route path="creadora" element={<Creadora />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}