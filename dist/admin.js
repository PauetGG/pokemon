"use strict";
// Selección de elementos del DOM
const btnAgregar = document.getElementById("btn-agregar");
const formAgregar = document.getElementById("form-agregar");
const formTitulo = document.querySelector("#form-agregar .title");
const btnModificar = document.getElementById("btn-modificar");
const buscadorModificar = document.getElementById("buscador-modificar");
const btnBuscarPokemon = document.getElementById("btn-buscar-pokemon");
const inputBusquedaModificar = document.getElementById("buscar-id-nombre");
const mensajeError = document.getElementById("msg-error");
const btnEliminar = document.getElementById("btn-eliminar");
const buscadorEliminar = document.getElementById("buscador-eliminar");
const inputEliminar = document.getElementById("input-eliminar");
const btnConfirmarEliminar = document.getElementById("btn-confirmar-eliminar");
const mensajeEliminar = document.getElementById("msg-eliminar");
let esEdicion = false;
let pokemonIdEditar = null;
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
// Mostrar/ocultar buscador de eliminación
btnEliminar.addEventListener("click", () => {
    buscadorEliminar.style.display = buscadorEliminar.style.display === "none" ? "block" : "none";
    mensajeEliminar.style.display = "none";
    inputEliminar.value = "";
});
// Confirmar eliminación
btnConfirmarEliminar.addEventListener("click", () => {
    const valor = inputEliminar.value.trim().toLowerCase();
    if (!valor)
        return;
    let personalizados = JSON.parse(localStorage.getItem("pokemonsPersonalizados") || "[]");
    if (!personalizados.find((p) => p.name.toLowerCase() === valor || p.id.toString() === valor)) {
        fetch(`https://pokeapi.co/api/v2/pokemon/${valor}`)
            .then(res => {
            if (!res.ok)
                throw new Error();
            return res.json();
        })
            .then(data => {
            personalizados.push({
                id: data.id,
                name: data.name,
                sprites: { front_default: data.sprites.front_default },
                height: data.height,
                weight: data.weight,
                stats: data.stats,
                types: data.types,
                eliminado: true
            });
            localStorage.setItem("pokemonsPersonalizados", JSON.stringify(personalizados));
            mensajeEliminar.textContent = "🗑️ Pokémon eliminado correctamente.";
            mensajeEliminar.style.display = "block";
        })
            .catch(() => {
            mensajeEliminar.textContent = "❌ Pokémon no encontrado.";
            mensajeEliminar.style.display = "block";
        });
    }
    else {
        personalizados = personalizados.filter((p) => p.name.toLowerCase() !== valor && p.id.toString() !== valor);
        localStorage.setItem("pokemonsPersonalizados", JSON.stringify(personalizados));
        mensajeEliminar.textContent = "🗑️ Pokémon eliminado correctamente.";
        mensajeEliminar.style.display = "block";
    }
});
// Buscar Pokémon para modificar
btnBuscarPokemon.addEventListener("click", () => {
    const valor = inputBusquedaModificar.value.trim().toLowerCase();
    if (!valor)
        return;
    const personalizados = JSON.parse(localStorage.getItem("pokemonsPersonalizados") || "[]");
    const encontrado = personalizados.find((p) => p.name.toLowerCase() === valor || p.id.toString() === valor);
    if (encontrado) {
        rellenarFormulario(encontrado);
        return;
    }
    // Si no está en personalizados, lo buscamos en la API
    fetch(`https://pokeapi.co/api/v2/pokemon/${valor}`)
        .then(res => {
        if (!res.ok)
            throw new Error();
        return res.json();
    })
        .then(data => {
        rellenarFormulario(data);
    })
        .catch(() => {
        mensajeError.textContent = "❌ Pokémon no encontrado.";
        mensajeError.style.display = "block";
    });
});
function rellenarFormulario(pokemon) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    mensajeError.style.display = "none";
    formAgregar.style.display = "block";
    formTitulo.textContent = "✏️ Modificar Pokémon";
    esEdicion = true;
    pokemonIdEditar = pokemon.id;
    document.getElementById("nombre").value = pokemon.name;
    document.getElementById("imagen").value = pokemon.sprites.front_default;
    document.getElementById("height").value = pokemon.height;
    document.getElementById("weight").value = pokemon.weight;
    document.getElementById("hp").value = ((_a = pokemon.stats.find((s) => s.stat.name === "hp")) === null || _a === void 0 ? void 0 : _a.base_stat) || 0;
    document.getElementById("attack").value = ((_b = pokemon.stats.find((s) => s.stat.name === "attack")) === null || _b === void 0 ? void 0 : _b.base_stat) || 0;
    document.getElementById("defense").value = ((_c = pokemon.stats.find((s) => s.stat.name === "defense")) === null || _c === void 0 ? void 0 : _c.base_stat) || 0;
    document.getElementById("special-attack").value = ((_d = pokemon.stats.find((s) => s.stat.name === "special-attack")) === null || _d === void 0 ? void 0 : _d.base_stat) || 0;
    document.getElementById("special-defense").value = ((_e = pokemon.stats.find((s) => s.stat.name === "special-defense")) === null || _e === void 0 ? void 0 : _e.base_stat) || 0;
    document.getElementById("speed").value = ((_f = pokemon.stats.find((s) => s.stat.name === "speed")) === null || _f === void 0 ? void 0 : _f.base_stat) || 0;
    const tipo1 = ((_g = pokemon.types[0]) === null || _g === void 0 ? void 0 : _g.type.name) || "";
    const tipo2 = ((_h = pokemon.types[1]) === null || _h === void 0 ? void 0 : _h.type.name) || "";
    document.getElementById("tipo1").value = tipo1;
    document.getElementById("tipo2").value = tipo2;
    formAgregar.setAttribute("data-id-edicion", pokemon.id);
}
// Guardar nuevo o modificar existente
formAgregar.addEventListener("submit", (e) => {
    e.preventDefault();
    let almacenados = JSON.parse(localStorage.getItem("pokemonsPersonalizados") || "[]");
    // ✅ ID: si estás en modo edición, usamos el ID que ya tenía
    const nuevoId = esEdicion && pokemonIdEditar ? pokemonIdEditar : Math.max(...almacenados.map((p) => p.id), 1025) + 1;
    const tipo1 = document.getElementById("tipo1").value.trim().toLowerCase();
    const tipo2 = document.getElementById("tipo2").value.trim().toLowerCase();
    const tipos = [];
    if (tipo1)
        tipos.push({ type: { name: tipo1 } });
    if (tipo2 && tipo2 !== tipo1)
        tipos.push({ type: { name: tipo2 } });
    if (tipos.length === 0) {
        alert("❗ Debes seleccionar al menos un tipo para el Pokémon.");
        return;
    }
    const nuevoPokemon = {
        id: nuevoId,
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
        types: tipos
    };
    if (esEdicion) {
        // 🔁 Modificamos
        almacenados = almacenados.map((p) => p.id === nuevoPokemon.id ? nuevoPokemon : p);
    }
    else {
        // ➕ Añadimos nuevo
        almacenados.push(nuevoPokemon);
    }
    localStorage.setItem("pokemonsPersonalizados", JSON.stringify(almacenados));
    alert(esEdicion ? "✏️ Pokémon modificado con éxito." : "✅ Pokémon añadido correctamente.");
    formAgregar.reset();
    formAgregar.style.display = "none";
    // 🔄 Reiniciamos estado
    esEdicion = false;
    pokemonIdEditar = null;
});
