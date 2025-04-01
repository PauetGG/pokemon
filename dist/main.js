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
// DOM
const contenedor = document.getElementById("contenedor-pokemon");
const modal = document.getElementById("modal-pokemon");
const modalNombre = document.getElementById("modal-nombre");
const modalImagen = document.getElementById("modal-imagen");
const modalTipos = document.getElementById("modal-tipos");
const modalEstadisticas = document.getElementById("modal-estadisticas");
const btnCerrarModal = document.getElementById("cerrar");
const iconosTipo = document.getElementById("iconos-tipo");
const inputBusqueda = document.getElementById("input-busqueda");
const loaderScroll = document.getElementById("loader-scroll");
const pokeballLoader = document.getElementById("pokeball-loader");
const loaderText = document.getElementById("loader-text");
// Datos y control
let todosLosPokemons = [];
let tiposSeleccionados = [];
let cantidadMostrada = 0;
const CANTIDAD_POR_LOTE = 20;
let modoFiltradoActivo = false;
// Cargar todos los Pokémon
function cargarPokemons() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const respuesta = yield fetch("https://pokeapi.co/api/v2/pokemon?limit=1025");
            const data = yield respuesta.json();
            const lista = data.results;
            let contador = 0;
            for (const p of lista) {
                const detalle = yield obtenerDetalle(p.url);
                todosLosPokemons.push(detalle);
                if (contador < 20) {
                    crearCard(detalle);
                    cantidadMostrada++;
                }
                contador++;
            }
            // ✅ Después de cargar todos los de la API, cargamos los personalizados
            const personalizados = JSON.parse(localStorage.getItem("pokemonsPersonalizados") || "[]");
            if (personalizados.length > 0) {
                todosLosPokemons = todosLosPokemons.concat(personalizados);
            }
        }
        catch (error) {
            console.error("Error al cargar Pokémon:", error);
        }
    });
}
// Obtener detalle individual
function obtenerDetalle(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch(url);
        const data = yield res.json();
        return data;
    });
}
function mostrarLotePokemon() {
    const siguienteLote = todosLosPokemons.slice(cantidadMostrada, cantidadMostrada + CANTIDAD_POR_LOTE);
    siguienteLote.forEach(p => crearCard(p));
    cantidadMostrada += CANTIDAD_POR_LOTE;
}
// Crear cada card de Pokémon
function crearCard(pokemon) {
    const card = document.createElement("section");
    card.className = "nes-container with-title card";
    card.id = `pokemon-${pokemon.id}`;
    const titulo = document.createElement("p");
    titulo.className = "title";
    titulo.textContent = pokemon.name.toUpperCase();
    const imagen = document.createElement("img");
    imagen.src = pokemon.sprites.front_default;
    imagen.alt = pokemon.name;
    imagen.className = "sprite";
    const footer = document.createElement("div");
    footer.className = "card-footer";
    const idTexto = document.createElement("span");
    idTexto.className = "card-id";
    idTexto.textContent = `#${pokemon.id}`;
    const tipoContainer = document.createElement("div");
    tipoContainer.className = "card-tipos";
    pokemon.types.forEach(t => {
        const tipo = t.type.name.toLowerCase();
        const icono = document.createElement("img");
        icono.src = `https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/${tipo}.svg`;
        icono.alt = tipo;
        icono.title = tipo;
        icono.className = `tipo-icono tipo-${tipo}`;
        tipoContainer.appendChild(icono);
    });
    footer.appendChild(idTexto);
    footer.appendChild(tipoContainer);
    card.appendChild(titulo);
    card.appendChild(imagen);
    card.appendChild(footer);
    card.addEventListener("click", () => {
        mostrarModal(pokemon);
    });
    contenedor.appendChild(card);
}
// Mostrar información en modal
function mostrarModal(pokemon) {
    modalNombre.textContent = pokemon.name.toUpperCase();
    modalImagen.src = pokemon.sprites.front_default;
    modalImagen.alt = pokemon.name;
    modalTipos.innerHTML = "";
    pokemon.types.forEach(t => {
        const tipo = t.type.name.toLowerCase();
        const img = document.createElement("img");
        img.src = `https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/${tipo}.svg`;
        img.alt = tipo;
        img.title = tipo;
        img.className = `tipo-icono tipo-${tipo}`;
        modalTipos.appendChild(img);
    });
    modalEstadisticas.innerHTML = "";
    const altura = document.createElement("p");
    altura.innerHTML = `<span>HEIGHT</span><span>${(pokemon.height / 10).toFixed(1)} m</span>`;
    modalEstadisticas.appendChild(altura);
    const peso = document.createElement("p");
    peso.innerHTML = `<span>WEIGHT</span><span>${(pokemon.weight / 10).toFixed(1)} kg</span>`;
    modalEstadisticas.appendChild(peso);
    pokemon.stats.forEach(stat => {
        const p = document.createElement("p");
        const nombreStat = document.createElement("span");
        nombreStat.textContent = stat.stat.name.toUpperCase();
        const valorStat = document.createElement("span");
        valorStat.textContent = stat.base_stat.toString();
        p.appendChild(nombreStat);
        p.appendChild(valorStat);
        modalEstadisticas.appendChild(p);
    });
    modal.style.display = "flex";
}
// Cerrar modal
btnCerrarModal.addEventListener("click", () => {
    modal.style.display = "none";
});
// Crear los botones visuales de tipos
const tiposPokemon = [
    "normal", "fire", "water", "electric", "grass", "ice", "fighting", "poison",
    "ground", "flying", "psychic", "bug", "rock", "ghost", "dragon",
    "dark", "steel", "fairy"
];
function crearBotonesTipo() {
    const iconosTipoContainer = document.getElementById("iconos-tipo");
    iconosTipoContainer.innerHTML = "";
    // Crear botón de reset
    const btnReset = document.createElement("img");
    btnReset.src = "/pinpng.com-pokemon-xy-png-3435125.png";
    btnReset.alt = "Reset";
    btnReset.title = "Quitar filtros";
    btnReset.className = "tipo-icono reset-icono";
    btnReset.style.display = "none"; // oculto por defecto
    btnReset.addEventListener("click", () => {
        tiposSeleccionados.length = 0;
        inputBusqueda.value = "";
        modoFiltradoActivo = false;
        cantidadMostrada = 0;
        // 👇 Esto borra la clase "activo" de los iconos visualmente
        document.querySelectorAll(".tipo-icono").forEach(icono => {
            icono.classList.remove("activo");
        });
        actualizarFiltro();
    });
    iconosTipoContainer.appendChild(btnReset);
    // Crear iconos de tipos
    tiposPokemon.forEach(tipo => {
        const icono = document.createElement("img");
        icono.src = `https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/${tipo}.svg`;
        icono.alt = tipo;
        icono.title = tipo;
        icono.className = `tipo-icono tipo-${tipo}`;
        icono.addEventListener("click", () => {
            const index = tiposSeleccionados.indexOf(tipo);
            if (index !== -1) {
                tiposSeleccionados.splice(index, 1);
                icono.classList.remove("activo");
            }
            else {
                tiposSeleccionados.push(tipo);
                icono.classList.add("activo");
            }
            actualizarFiltro();
        });
        iconosTipoContainer.appendChild(icono);
    });
    // Función para actualizar filtrado
    function actualizarFiltro() {
        const hayFiltros = tiposSeleccionados.length > 0 || inputBusqueda.value.trim() !== "";
        modoFiltradoActivo = hayFiltros;
        // Mostrar u ocultar el botón de reset
        btnReset.style.display = hayFiltros ? "inline-block" : "none";
        // Si no hay filtros ni búsqueda, volvemos al scroll infinito
        if (!hayFiltros) {
            cantidadMostrada = 0;
            contenedor.innerHTML = "";
            mostrarLotePokemon();
            return;
        }
        // Aplicar filtro por tipo
        let resultado = tiposSeleccionados.length === 0
            ? todosLosPokemons
            : todosLosPokemons.filter(p => tiposSeleccionados.every(filtro => p.types.some(t => t.type.name === filtro)));
        // Aplicar búsqueda por nombre si hay texto
        const texto = inputBusqueda.value.toLowerCase().trim();
        if (texto) {
            resultado = resultado.filter(p => p.name.toLowerCase().includes(texto));
        }
        // Mostrar los Pokémon filtrados
        contenedor.innerHTML = "";
        resultado.forEach(p => crearCard(p));
        // Marcar visualmente los tipos seleccionados
        document.querySelectorAll(".tipo-icono").forEach(icono => {
            const tipo = icono.getAttribute("alt");
            if (tipo && tiposSeleccionados.includes(tipo)) {
                icono.classList.add("activo");
            }
            else {
                icono.classList.remove("activo");
            }
        });
    }
}
inputBusqueda.addEventListener("input", aplicarFiltros);
function aplicarFiltros() {
    const texto = inputBusqueda.value.toLowerCase().trim();
    const hayFiltros = tiposSeleccionados.length > 0 || texto !== "";
    modoFiltradoActivo = hayFiltros;
    // 👇 Si no hay texto ni filtros, restaurar scroll infinito y mostrar los primeros 20
    if (!hayFiltros) {
        cantidadMostrada = 0;
        contenedor.innerHTML = "";
        mostrarLotePokemon();
        return;
    }
    // 🧠 Filtrado por tipo
    let resultado = tiposSeleccionados.length === 0
        ? todosLosPokemons
        : todosLosPokemons.filter(p => tiposSeleccionados.every(filtro => p.types.some(t => t.type.name === filtro)));
    // 🔍 Filtrado por nombre si hay texto
    if (texto) {
        resultado = resultado.filter(p => p.name.toLowerCase().includes(texto));
    }
    // Mostrar resultado filtrado
    contenedor.innerHTML = "";
    resultado.forEach(p => crearCard(p));
}
let cargandoScroll = false;
// Scroll infinito
window.addEventListener("scroll", () => __awaiter(void 0, void 0, void 0, function* () {
    if (modoFiltradoActivo || cargandoScroll)
        return;
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
        if (cantidadMostrada >= todosLosPokemons.length) {
            loaderScroll.style.display = "block";
            loaderText.textContent = "¡Has visto todos los Pokémon!";
            pokeballLoader.style.animation = "none";
            return;
        }
        cargandoScroll = true; // ✅ Bloquea nuevas llamadas
        loaderScroll.style.display = "block";
        loaderText.textContent = "Cargando más Pokémon...";
        pokeballLoader.style.animation = "girar 1s infinite linear";
        yield new Promise(resolve => setTimeout(resolve, 800)); // Simulación
        mostrarLotePokemon();
        loaderScroll.style.display = "none";
        cargandoScroll = false; // ✅ Permite siguiente carga
    }
}));
// Iniciar todo
cargarPokemons();
crearBotonesTipo();
