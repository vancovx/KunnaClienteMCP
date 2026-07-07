import { useEffect, useRef, useState } from "react";

/**
 * Desplegable propio para sustituir a los <select> nativos y poder darles
 * el estilo de la app (píldora, colores del tema, lista redondeada).
 *
 * Props:
 *  - value:      valor seleccionado actualmente
 *  - options:    [{ value, label }]
 *  - onChange:   (value) => void
 *  - disabled:   deshabilita el control
 *  - placeholder: texto cuando no hay valor seleccionado
 *  - className:  clases extra para el contenedor
 */
export default function Dropdown({
    value,
    options,
    onChange,
    disabled = false,
    placeholder = "— elige —",
    className = "",
}) {
    const [open, setOpen] = useState(false);
    const [highlight, setHighlight] = useState(-1);
    const rootRef = useRef(null);

    const current = options.find((o) => o.value === value);

    // Cierra el menú al hacer clic fuera del componente.
    useEffect(() => {
        function onDocClick(e) {
            if (rootRef.current && !rootRef.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", onDocClick);
        return () => document.removeEventListener("mousedown", onDocClick);
    }, []);

    function toggle() {
        if (disabled) return;
        setOpen((o) => !o);
        setHighlight(options.findIndex((o) => o.value === value));
    }

    function pick(opt) {
        onChange(opt.value);
        setOpen(false);
    }

    // Navegación con teclado (flechas, Enter/Espacio, Escape).
    function onKeyDown(e) {
        if (disabled) return;
        switch (e.key) {
            case "Enter":
            case " ":
                e.preventDefault();
                if (!open) toggle();
                else if (highlight >= 0) pick(options[highlight]);
                break;
            case "Escape":
                setOpen(false);
                break;
            case "ArrowDown":
                e.preventDefault();
                if (!open) toggle();
                else setHighlight((h) => Math.min(h + 1, options.length - 1));
                break;
            case "ArrowUp":
                e.preventDefault();
                setHighlight((h) => Math.max(h - 1, 0));
                break;
            default:
                break;
        }
    }

    return (
        <div className={`dd ${className}`} ref={rootRef}>
            <button
                type="button"
                className={`dd-toggle ${open ? "is-open" : ""}`}
                onClick={toggle}
                onKeyDown={onKeyDown}
                disabled={disabled}
                aria-haspopup="listbox"
                aria-expanded={open}
            >
                <span className={current ? "dd-value" : "dd-value dd-placeholder"}>
                    {current ? current.label : placeholder}
                </span>
                <svg
                    className="dd-chevron"
                    width="12"
                    height="8"
                    viewBox="0 0 12 8"
                    aria-hidden="true"
                >
                    <path
                        d="M1 1l5 5 5-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>

            {open && (
                <ul className="dd-menu" role="listbox">
                    {options.map((opt, i) => (
                        <li
                            key={String(opt.value)}
                            role="option"
                            aria-selected={opt.value === value}
                            className={
                                "dd-option" +
                                (opt.value === value ? " is-selected" : "") +
                                (i === highlight ? " is-highlight" : "")
                            }
                            onMouseEnter={() => setHighlight(i)}
                            onClick={() => pick(opt)}
                        >
                            {opt.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}