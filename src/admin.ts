// Selección de elementos del DOM
const btnAgregar = document.getElementById("btn-agregar")!;
const formAgregar = document.getElementById("form-agregar") as HTMLFormElement;
const formTitulo = document.querySelector("#form-agregar .title")!;
const btnModificar = document.getElementById("btn-modificar")!;
const buscadorModificar = document.getElementById("buscador-modificar") as HTMLDivElement;
const btnBuscarPokemon = document.getElementById("btn-buscar-pokemon")!;
const inputBusquedaModificar = document.getElementById("buscar-id-nombre") as HTMLInputElement;
const mensajeError = document.getElementById("msg-error")!;
const btnEliminar = document.getElementById("btn-eliminar")!;
const buscadorEliminar = document.getElementById("buscador-eliminar") as HTMLDivElement;
const inputEliminar = document.getElementById("input-eliminar") as HTMLInputElement;
const btnConfirmarEliminar = document.getElementById("btn-confirmar-eliminar")!;
const mensajeEliminar = document.getElementById("msg-eliminar")!;

let esEdicion = false;
let pokemonIdEditar: number | null = null;

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
  if (!valor) return;

  let personalizados = JSON.parse(localStorage.getItem("pokemonsPersonalizados") || "[]");

  if (!personalizados.find((p: any) => p.name.toLowerCase() === valor || p.id.toString() === valor)) {
    fetch(`https://pokeapi.co/api/v2/pokemon/${valor}`)
      .then(res => {
        if (!res.ok) throw new Error();
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
  } else {
    personalizados = personalizados.filter((p: any) => p.name.toLowerCase() !== valor && p.id.toString() !== valor);
    localStorage.setItem("pokemonsPersonalizados", JSON.stringify(personalizados));
    mensajeEliminar.textContent = "🗑️ Pokémon eliminado correctamente.";
    mensajeEliminar.style.display = "block";
  }
});

// Buscar Pokémon para modificar
btnBuscarPokemon.addEventListener("click", () => {
  const valor = inputBusquedaModificar.value.trim().toLowerCase();
  if (!valor) return;

  const personalizados = JSON.parse(localStorage.getItem("pokemonsPersonalizados") || "[]");
  const encontrado = personalizados.find((p: any) =>
    p.name.toLowerCase() === valor || p.id.toString() === valor
  );

  if (encontrado) {
    rellenarFormulario(encontrado);
    return;
  }

  // Si no está en personalizados, lo buscamos en la API
  fetch(`https://pokeapi.co/api/v2/pokemon/${valor}`)
    .then(res => {
      if (!res.ok) throw new Error();
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


function rellenarFormulario(pokemon: any) {
  mensajeError.style.display = "none";
  formAgregar.style.display = "block";
  formTitulo.textContent = "✏️ Modificar Pokémon";
  esEdicion = true;
  pokemonIdEditar = pokemon.id;

  (document.getElementById("nombre") as HTMLInputElement).value = pokemon.name;
  (document.getElementById("imagen") as HTMLInputElement).value = pokemon.sprites.front_default;
  (document.getElementById("height") as HTMLInputElement).value = pokemon.height;
  (document.getElementById("weight") as HTMLInputElement).value = pokemon.weight;
  (document.getElementById("hp") as HTMLInputElement).value = pokemon.stats.find((s: any) => s.stat.name === "hp")?.base_stat || 0;
  (document.getElementById("attack") as HTMLInputElement).value = pokemon.stats.find((s: any) => s.stat.name === "attack")?.base_stat || 0;
  (document.getElementById("defense") as HTMLInputElement).value = pokemon.stats.find((s: any) => s.stat.name === "defense")?.base_stat || 0;
  (document.getElementById("special-attack") as HTMLInputElement).value = pokemon.stats.find((s: any) => s.stat.name === "special-attack")?.base_stat || 0;
  (document.getElementById("special-defense") as HTMLInputElement).value = pokemon.stats.find((s: any) => s.stat.name === "special-defense")?.base_stat || 0;
  (document.getElementById("speed") as HTMLInputElement).value = pokemon.stats.find((s: any) => s.stat.name === "speed")?.base_stat || 0;
  const tipo1 = pokemon.types[0]?.type.name || "";
  const tipo2 = pokemon.types[1]?.type.name || "";
  (document.getElementById("tipo1") as HTMLSelectElement).value = tipo1;
  (document.getElementById("tipo2") as HTMLSelectElement).value = tipo2;

  formAgregar.setAttribute("data-id-edicion", pokemon.id);
}


// Guardar nuevo o modificar existente
formAgregar.addEventListener("submit", (e) => {
  e.preventDefault();
  let almacenados = JSON.parse(localStorage.getItem("pokemonsPersonalizados") || "[]");

  // ✅ ID: si estás en modo edición, usamos el ID que ya tenía
  const nuevoId = esEdicion && pokemonIdEditar ? pokemonIdEditar : Math.max(...almacenados.map((p: any) => p.id), 1025) + 1;

  const tipo1 = (document.getElementById("tipo1") as HTMLSelectElement).value.trim().toLowerCase();
  const tipo2 = (document.getElementById("tipo2") as HTMLSelectElement).value.trim().toLowerCase();

  const tipos: { type: { name: string } }[] = [];
  if (tipo1) tipos.push({ type: { name: tipo1 } });
  if (tipo2 && tipo2 !== tipo1) tipos.push({ type: { name: tipo2 } });

  if (tipos.length === 0) {
    alert("❗ Debes seleccionar al menos un tipo para el Pokémon.");
    return;
  }

  const nuevoPokemon = {
    id: nuevoId,
    name: (document.getElementById("nombre") as HTMLInputElement).value,
    sprites: {
      front_default: (document.getElementById("imagen") as HTMLInputElement).value
    },
    height: parseFloat((document.getElementById("height") as HTMLInputElement).value),
    weight: parseFloat((document.getElementById("weight") as HTMLInputElement).value),
    stats: [
      { stat: { name: "hp" }, base_stat: parseInt((document.getElementById("hp") as HTMLInputElement).value) },
      { stat: { name: "attack" }, base_stat: parseInt((document.getElementById("attack") as HTMLInputElement).value) },
      { stat: { name: "defense" }, base_stat: parseInt((document.getElementById("defense") as HTMLInputElement).value) },
      { stat: { name: "special-attack" }, base_stat: parseInt((document.getElementById("special-attack") as HTMLInputElement).value) },
      { stat: { name: "special-defense" }, base_stat: parseInt((document.getElementById("special-defense") as HTMLInputElement).value) },
      { stat: { name: "speed" }, base_stat: parseInt((document.getElementById("speed") as HTMLInputElement).value) }
    ],
    types: tipos
  };

  if (esEdicion) {
    // 🔁 Modificamos
    almacenados = almacenados.map((p: any) => p.id === nuevoPokemon.id ? nuevoPokemon : p);
  } else {
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
