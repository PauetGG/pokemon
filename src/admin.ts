// Selección de elementos del DOM
const btnAgregar = document.getElementById("btn-agregar")!;
const formAgregar = document.getElementById("form-agregar") as HTMLFormElement;
const formTitulo = document.querySelector("#form-agregar .title")!;
const btnModificar = document.getElementById("btn-modificar")!;
const buscadorModificar = document.getElementById("buscador-modificar") as HTMLDivElement;
const btnBuscarPokemon = document.getElementById("btn-buscar-pokemon")!;
const inputBusquedaModificar = document.getElementById("buscar-id-nombre") as HTMLInputElement;
const mensajeError = document.getElementById("msg-error")!;

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
btnBuscarPokemon.addEventListener("click", async () => {
  const valor = inputBusquedaModificar.value.trim().toLowerCase();

  let personalizados = JSON.parse(localStorage.getItem("pokemonsPersonalizados") || "[]");

  let encontrado = personalizados.find((p: any) =>
    p.name.toLowerCase() === valor || p.id.toString() === valor
  );

  // Si no está en personalizados, buscar en la API
  if (!encontrado) {
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${valor}`);
      if (!res.ok) throw new Error("No encontrado");
      const data = await res.json();
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
    } catch (error) {
      mensajeError.textContent = "❌ Pokémon no encontrado en la API.";
      mensajeError.style.display = "block";
      return;
    }
  }

  mensajeError.style.display = "none";
  inputBusquedaModificar.value = "";
  formAgregar.style.display = "block";
  formTitulo.textContent = "✏️ Modificar Pokémon";

  (document.getElementById("nombre") as HTMLInputElement).value = encontrado.name;
  (document.getElementById("imagen") as HTMLInputElement).value = encontrado.sprites.front_default;
  (document.getElementById("height") as HTMLInputElement).value = encontrado.height;
  (document.getElementById("weight") as HTMLInputElement).value = encontrado.weight;
  (document.getElementById("hp") as HTMLInputElement).value = encontrado.stats.find((s: any) => s.stat.name === "hp")?.base_stat || 0;
  (document.getElementById("attack") as HTMLInputElement).value = encontrado.stats.find((s: any) => s.stat.name === "attack")?.base_stat || 0;
  (document.getElementById("defense") as HTMLInputElement).value = encontrado.stats.find((s: any) => s.stat.name === "defense")?.base_stat || 0;
  (document.getElementById("special-attack") as HTMLInputElement).value = encontrado.stats.find((s: any) => s.stat.name === "special-attack")?.base_stat || 0;
  (document.getElementById("special-defense") as HTMLInputElement).value = encontrado.stats.find((s: any) => s.stat.name === "special-defense")?.base_stat || 0;
  (document.getElementById("speed") as HTMLInputElement).value = encontrado.stats.find((s: any) => s.stat.name === "speed")?.base_stat || 0;

  formAgregar.setAttribute("data-id-edicion", encontrado.id);
});

// Guardar nuevo o modificar existente
formAgregar.addEventListener("submit", (e) => {
  e.preventDefault();

  const idEdicion = formAgregar.getAttribute("data-id-edicion");
  const nuevoPokemon = {
    id: idEdicion ? parseInt(idEdicion) : Date.now(),
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
    types: []
  };

  let almacenados = JSON.parse(localStorage.getItem("pokemonsPersonalizados") || "[]");

  if (idEdicion) {
    almacenados = almacenados.map((p: any) => p.id === nuevoPokemon.id ? nuevoPokemon : p);
  } else {
    almacenados.push(nuevoPokemon);
  }

  localStorage.setItem("pokemonsPersonalizados", JSON.stringify(almacenados));

  alert(idEdicion ? "✏️ Pokémon modificado con éxito." : "✅ Pokémon añadido correctamente.");
  formAgregar.reset();
  formAgregar.removeAttribute("data-id-edicion");
  formAgregar.style.display = "none";
});