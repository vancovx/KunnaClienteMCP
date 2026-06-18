import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, NavLink, Outlet } from "react-router-dom";
import "./App.css";

import Home from "./pages/Home.jsx";
import WhatIsMcp from "./pages/WhatIsMcp.jsx";
import Inspector from "./pages/Inspector.jsx";
import Desarrollo from "./pages/Desarrollo.jsx";

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

const GithubIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38
        0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13
        -.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07
        -.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2
        -.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2
        .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15
        0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0
        .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
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

                <div className="nav-right">
                    <nav className="navlinks">
                        <NavLink to="/inspector" className={navClass}>Inspector</NavLink>
                        <NavLink to="/mcp" className={navClass}>¿Qué es MCP?</NavLink>
                        <NavLink to="/desarrollo" className={navClass}>¿Por qué?</NavLink>
                    </nav>

                    <a
                        className="icon-btn"
                        href="https://github.com/vancovx/KunnaClienteMCP"
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Repositorio en GitHub"
                        title="GitHub"
                    >
                        <GithubIcon />
                    </a>

                    <button className="icon-btn" onClick={toggleTheme} aria-label="Cambiar tema" title="Cambiar tema">
                        {theme === "dark" ? <SunIcon /> : <MoonIcon />}
                    </button>
                </div>
            </header>

            <main className="page">
                <Outlet />
            </main>

            <footer className="foot">
                <p className="foot-main">
                    Hecho por Vanessa Covrig Roibu para la Universidad de Alicante
                    <span className="heart">❤️</span>
                    <a className="foot-gh" href="https://github.com/vancovx/KunnaClienteMCP" target="_blank" rel="noreferrer">
                        <GithubIcon /> GitHub
                    </a>
                </p>
                <p className="foot-note">
                    Model Context Protocol es una especificación abierta de Anthropic. Los nombres de
                    productos, logotipos y marcas mencionados pertenecen a sus respectivos propietarios.
                    Este proyecto es un Trabajo de Fin de Grado de carácter académico.
                </p>
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
                    <Route path="desarrollo" element={<Desarrollo />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}