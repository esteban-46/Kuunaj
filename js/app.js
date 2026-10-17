/*RUTA DEL JSON (cambiala si lo guardas en otra carpeta)*/
const RUTA_JSON = "data/flores.json";
const CANTIDAD = 3;

/*PAISES: valor del formulario -> [codigo del JSON, nombre para mostrar]*/
const PAISES = {
  "costa-rica": ["CR", "Costa Rica"],
  "el-salvador": ["SV", "El Salvador"],
  "mexico": ["MX", "México"],
  "nicaragua": ["NI", "Nicaragua"],
  "colombia": ["CO", "Colombia"],
  "ecuador": ["EC", "Ecuador"],
  "peru": ["PE", "Perú"],
  "bolivia": ["BO", "Bolivia"],
  "argentina": ["AR", "Argentina"],
  "brasil": ["BR", "Brasil"],
  "chile": ["CL", "Chile"]
};
/*CODIGO -> NOMBRE (ej. "MX" -> "México")*/
const NOMBRE_PAIS = Object.fromEntries(Object.values(PAISES));

const formulario = document.getElementById("formulario");
const resultados = document.getElementById("resultados");

/*CARGAR EL JSON UNA SOLA VEZ AL ABRIR LA PAGINA*/
const carga = fetch(RUTA_JSON)
  .then((r) => {
    if (!r.ok) throw new Error(r.status);
    return r.json();
  })
  .catch(() => null);

/*REVOLVER LA LISTA (para que no salgan siempre las mismas)*/
function mezclar(lista) {
  return lista
    .map((f) => [Math.random(), f])
    .sort((a, b) => a[0] - b[0])
    .map((par) => par[1]);
}

function lista(items) {
  return `<ul>${items.map((i) => `<li>${i}</li>`).join("")}</ul>`;
}

/*"COMO SE LE CONOCE": agrupa por nombre y pone primero el de tu pais*/
function nombresLocales(flor, codigo) {
  const total = Object.keys(NOMBRE_PAIS).length;
  const items = Object.entries(flor.nombres_locales)
    .sort((a, b) => b[1].includes(codigo) - a[1].includes(codigo))
    .map(([nombre, paises]) => {
      const donde = paises.length === total
        ? "todos los países"
        : paises.map((c) => NOMBRE_PAIS[c]).join(", ");
      return `<strong>${nombre}:</strong> ${donde}`;
    });
  return lista(items);
}

/*TARJETA DE UNA PLANTA: texto a la izquierda, foto a la derecha*/
function tarjeta(flor, codigo) {
  const foto = flor.imagen ? `<img src="${flor.imagen}" alt="${flor.nombre}">` : "";
  return `
    <article class="info flor">
      <div class="textos">
        <section>
          <h2>${flor.nombre}</h2>
          <p><em>${flor.nombre_cientifico}</em></p>
          <p>${flor.descripcion}</p>
        </section>
        <section>
          <h2>Características</h2>
          ${lista(flor.caracteristicas)}
        </section>
        <section>
          <h2>Condiciones de vida</h2>
          ${lista(flor.condiciones)}
        </section>
        <section>
          <h2>¿Cómo se le conoce?</h2>
          ${nombresLocales(flor, codigo)}
        </section>
      </div>
      <div class="foto" role="img" aria-label="Foto de ${flor.nombre}">${foto}</div>
    </article>`;
}

function mostrar(html) {
  resultados.innerHTML = html;
  resultados.hidden = false;
  resultados.scrollIntoView({ behavior: "smooth" });
}

/*AL ENVIAR EL FORMULARIO*/
formulario.addEventListener("submit", async (e) => {
  e.preventDefault();

  const flores = await carga;
  if (!flores) {
    mostrar("<p>No se pudo cargar flores.json. Si abriste index.html directo desde la carpeta, ábrelo con un servidor local (por ejemplo, Live Server).</p>");
    return;
  }

  const [codigo] = PAISES[formulario.elements.pais.value];
  const clima = formulario.elements.clima.value;

  const elegidas = mezclar(
    flores.filter((f) => f.paises_disponibles.includes(codigo) && f.climas_compatibles.includes(clima))
  ).slice(0, CANTIDAD);

  if (elegidas.length === 0) {
    mostrar("<p>No encontramos plantas para esa combinación.</p>");
    return;
  }

  mostrar(`<h2>Plantas para ti</h2>${elegidas.map((f) => tarjeta(f, codigo)).join("")}`);
});
