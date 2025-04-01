"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Selección de elementos del DOM
const btnAgregar = document.getElementById("btn-agregar");
const formAgregar = document.getElementById("form-agregar");
const formTitulo = document.querySelector("#form-agregar .title");
const btnModificar = document.getElementById("btn-modificar");
const buscadorModificar = document.getElementById("buscador-modificar");
const btnBuscarPokemon = document.getElementById("btn-buscar-pokemon");
const inputBusquedaModificar = document.getElementById("buscar-id-nombre");
const mensajeError = document.getElementById("msg-error");
// Mostrar/ocultar formulario de agregar y limpiar
btnAgregar.addEventListener("click", () => {
    formAgregar.style.display = formAgregar.style.display === "none" ? "block" : "none";
    formAgregar.reset();
    formTitulo.textContent = "➕ Añadir Pokémon";
    formAgregar.removeAttribute("data-id-edicion");
});
// Mostrar/ocultar buscador de modificación
btnModificar.addEventListener("click", () => {
    buscadorModificar.style.display = buscadorModificar.style.display === "none" ? "block" : "none";
});
// Buscar por nombre o ID y rellenar el formulario para editar
btnBuscarPokemon.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    const valor = inputBusquedaModificar.value.trim().toLowerCase();
    let personalizados = JSON.parse(localStorage.getItem("pokemonsPersonalizados") || "[]");
    let encontrado = personalizados.find((p) => p.name.toLowerCase() === valor || p.id.toString() === valor);
    // Si no está en personalizados, buscar en la API
    if (!encontrado) {
        try {
            const res = yield fetch(`https://pokeapi.co/api/v2/pokemon/${valor}`);
            if (!res.ok)
                throw new Error("No encontrado");
            const data = yield res.json();
            encontrado = {
                id: data.id,
                name: data.name,
                sprites: { front_default: data.sprites.front_default },
                height: data.height,
                weight: data.weight,
                stats: data.stats,
                types: data.types
            };
            personalizados.push(encontrado);
            localStorage.setItem("pokemonsPersonalizados", JSON.stringify(personalizados));
        }
        catch (error) {
            mensajeError.textContent = "❌ Pokémon no encontrado en la API.";
            mensajeError.style.display = "block";
            return;
        }
    }
    mensajeError.style.display = "none";
    inputBusquedaModificar.value = "";
    formAgregar.style.display = "block";
    formTitulo.textContent = "✏️ Modificar Pokémon";
    document.getElementById("nombre").value = encontrado.name;
    document.getElementById("imagen").value = encontrado.sprites.front_default;
    document.getElementById("height").value = encontrado.height;
    document.getElementById("weight").value = encontrado.weight;
    document.getElementById("hp").value = ((_a = encontrado.stats.find((s) => s.stat.name === "hp")) === null || _a === void 0 ? void 0 : _a.base_stat) || 0;
    document.getElementById("attack").value = ((_b = encontrado.stats.find((s) => s.stat.name === "attack")) === null || _b === void 0 ? void 0 : _b.base_stat) || 0;
    document.getElementById("defense").value = ((_c = encontrado.stats.find((s) => s.stat.name === "defense")) === null || _c === void 0 ? void 0 : _c.base_stat) || 0;
    document.getElementById("special-attack").value = ((_d = encontrado.stats.find((s) => s.stat.name === "special-attack")) === null || _d === void 0 ? void 0 : _d.base_stat) || 0;
    document.getElementById("special-defense").value = ((_e = encontrado.stats.find((s) => s.stat.name === "special-defense")) === null || _e === void 0 ? void 0 : _e.base_stat) || 0;
    document.getElementById("speed").value = ((_f = encontrado.stats.find((s) => s.stat.name === "speed")) === null || _f === void 0 ? void 0 : _f.base_stat) || 0;
    formAgregar.setAttribute("data-id-edicion", encontrado.id);
}));
// Guardar nuevo o modificar existente
formAgregar.addEventListener("submit", (e) => {
    e.preventDefault();
    const idEdicion = formAgregar.getAttribute("data-id-edicion");
    const nuevoPokemon = {
        id: idEdicion ? parseInt(idEdicion) : Date.now(),
        name: document.getElementById("nombre").value,
        sprites: {
            front_default: document.getElementById("imagen").value
        },
        height: parseFloat(document.getElementById("height").value),
        weight: parseFloat(document.getElementById("weight").value),
        stats: [
            { stat: { name: "hp" }, base_stat: parseInt(document.getElementById("hp").value) },
            { stat: { name: "attack" }, base_stat: parseInt(document.getElementById("attack").value) },
            { stat: { name: "defense" }, base_stat: parseInt(document.getElementById("defense").value) },
            { stat: { name: "special-attack" }, base_stat: parseInt(document.getElementById("special-attack").value) },
            { stat: { name: "special-defense" }, base_stat: parseInt(document.getElementById("special-defense").value) },
            { stat: { name: "speed" }, base_stat: parseInt(document.getElementById("speed").value) }
        ],
        types: []
    };
    let almacenados = JSON.parse(localStorage.getItem("pokemonsPersonalizados") || "[]");
    if (idEdicion) {
        almacenados = almacenados.map((p) => p.id === nuevoPokemon.id ? nuevoPokemon : p);
    }
    else {
        almacenados.push(nuevoPokemon);
    }
    localStorage.setItem("pokemonsPersonalizados", JSON.stringify(almacenados));
    alert(idEdicion ? "✏️ Pokémon modificado con éxito." : "✅ Pokémon añadido correctamente.");
    formAgregar.reset();
    formAgregar.removeAttribute("data-id-edicion");
    formAgregar.style.display = "none";
});
