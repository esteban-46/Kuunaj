/*RUTA DEL JSON*/
const RUTA_JSON = "data/flores.json";
/*CANTIDAD DE PLANTAS*/
const CANTIDAD = 3;

/*ASOCIACION DEL FORMULARIO CON EL JSON MEDIANTE OBJETOS CON ARREGLOS*/
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
/*RELACIONAR EL CODIGO CON EL PAIS*/
const NOMBRE_PAIS = Object.fromEntries(Object.values(PAISES));

const formulario = document.getElementById("formulario");
const resultados = document.getElementById("resultados");

/*CARGAR EL JSON AL ABRIR LA PAGINA*/
const carga = fetch(RUTA_JSON)
  .then((r) => {
    if (!r.ok) throw new Error(r.status);
    return r.json();
  })
  .catch(() => null);

/*REVOLVER LA LISTA SI SALEN MAS DE 3*/
/**/
function mezclar(lista) {
  return lista
    .map((f) => [Math.random(), f])
    .sort((a, b) => a[0] - b[0])
    .map((par) => par[1]);
}

/*CONVERSION DE VARIABLES A TEXTO*/
function lista(items) {
  return `<ul>${items.map((i) => `<li>${i}</li>`).join("")}</ul>`;
}

/*ASOCIA UNA PLANTA CON LOS PAISES QUE LA CONTIENEN*/
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

/*CREAR EL IMG DEL HTML CON LA INFORMACION DEL JSON*/
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

/*BORRADO DE BUSQUEDA(enseña las 3 plantas), OCULTA LA SECCION HASTA DAR ENVIAR, TRANSICION*/
function mostrar(html) {
  resultados.innerHTML = html;
  resultados.hidden = false;
  resultados.scrollIntoView({ behavior: "smooth" });
}

/*ENVIO EL FORMULARIO*/
formulario.addEventListener("submit", async (e) => {
  /*HACE QUE NO REINICIE PAGINA*/
  e.preventDefault();
 
  /*CARGA DEL JSON ANTES DE ENVIAR EL FORMULARIO*/
  const flores = await carga;

  const [codigo] = PAISES[formulario.elements.pais.value];
  const clima = formulario.elements.clima.value;

  const elegidas = mezclar(
    flores.filter((f) => f.paises_disponibles.includes(codigo) && f.climas_compatibles.includes(clima))
  ).slice(0, CANTIDAD);


  mostrar(`<h2>Plantas para ti</h2>${elegidas.map((f) => tarjeta(f, codigo)).join("")}`);
});
