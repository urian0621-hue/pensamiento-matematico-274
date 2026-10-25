document.addEventListener("DOMContentLoaded", () => {
    const pantallaExpresion = document.getElementById("calc-expression");
    const pantallaResultado = document.getElementById("calc-result");
    const botones = document.querySelectorAll(".calculator-buttons button");

    if (!pantallaExpresion || !pantallaResultado || !botones.length) {
        return;
    }

    let expresion = "";
    let resultadoMostrado = false;

    function actualizarPantalla() {
        pantallaExpresion.textContent = expresion || " ";
        pantallaResultado.textContent = expresion || "0";
    }

    function insertar(valor) {
        if (resultadoMostrado) {
            if (/^[0-9.]$/.test(valor) || valor === "pi" ||
                ["sqrt(", "sqrt3(", "sin(", "cos(", "tan(", "log("].includes(valor)) {
                expresion = "";
            }
            resultadoMostrado = false;
        }

        expresion += valor;
        actualizarPantalla();
    }

    function calcular() {
        try {
            let codigo = expresion;

            if (!codigo) return;

            // Convertir los símbolos de la calculadora.
            codigo = codigo
                .replace(/×/g, "*")
                .replace(/÷/g, "/")
                .replace(/\bpi\b/g, "Math.PI")
                .replace(/\bsqrt3\(/g, "Math.cbrt(")
                .replace(/\bsqrt\(/g, "Math.sqrt(")
                .replace(/\bsin\(/g, "Math.sin(")
                .replace(/\bcos\(/g, "Math.cos(")
                .replace(/\btan\(/g, "Math.tan(")
                .replace(/\blog\(/g, "Math.log10(");

            // Convertir las potencias, por ejemplo 2^3.
            codigo = codigo.replace(
                /(\d+(?:\.\d+)?|\))\^(\d+(?:\.\d+)?|\()/g,
                "Math.pow($1,$2)"
            );

            // Convertir porcentajes.
            codigo = codigo.replace(/(\d+(?:\.\d+)?)%/g, "($1/100)");

            // Validar los caracteres permitidos.
            if (!/^[0-9+\-*/().,\sA-Za-z]+$/.test(codigo)) {
                throw new Error("Expresión no válida");
            }

            // Solo aceptar las funciones matemáticas permitidas.
            const expresionSegura = codigo.replace(
                /Math\.(?:PI|cbrt|sqrt|sin|cos|tan|log10|pow)/g,
                ""
            );

            if (/[A-Za-z]/.test(expresionSegura)) {
                throw new Error("Función no válida");
            }

            const resultado = Function('"use strict"; return (' + codigo + ')')();

            if (typeof resultado !== "number" || !Number.isFinite(resultado)) {
                throw new Error("Resultado no válido");
            }

            const final = Number(resultado.toPrecision(10));

            pantallaExpresion.textContent = expresion + " =";
            pantallaResultado.textContent = String(final);
            expresion = String(final);
            resultadoMostrado = true;
        } catch (error) {
            pantallaResultado.textContent = "Error";
            resultadoMostrado = false;
        }
    }

    botones.forEach((boton) => {
        boton.addEventListener("click", () => {
            const accion = boton.dataset.action;
            const valor = boton.dataset.value;

            if (accion === "clear") {
                expresion = "";
                resultadoMostrado = false;
                actualizarPantalla();
            } else if (accion === "delete") {
                expresion = expresion.slice(0, -1);
                resultadoMostrado = false;
                actualizarPantalla();
            } else if (accion === "calculate") {
                calcular();
            } else if (valor !== undefined) {
                insertar(valor);
            }
        });
    });

    actualizarPantalla();
});
/* ABRIR LAS LECCIONES DE ECUACIONES EN OTRA PESTAÑA */
document.querySelectorAll(".equation-option").forEach((button) => {
    button.addEventListener("click", () => {
        const tema = button.dataset.equation;

        if (tema) {
            window.open(
                "leccion.html?tema=" + encodeURIComponent(tema),
                "_blank"
            );
        }
    });
});
document.querySelectorAll("[data-otro]").forEach((button) => {
    button.addEventListener("click", () => {
        const tema = button.dataset.otro;

        if (tema) {
            window.open(
                "leccion-otros.html?tema=" + encodeURIComponent(tema),
                "_blank"
            );
        }
    });
});