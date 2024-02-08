// Variables
const productos = [
  {
    id: 1,
    imagen: "./imagenes/productos/calzado-marrón.png",
    nombre: "Zapatilla marrón",
    precio: 45,
    cant: 1,
  },
  {
    id: 2,
    imagen: "./imagenes/productos/calzado-blanco.png",
    nombre: "Zapatilla blanca",
    precio: 40,
    cant: 1,
  },
  {
    id: 3,
    imagen: "./imagenes/productos/calzado-celeste.png",
    nombre: "Zapatilla celeste",
    precio: 35,
    cant: 1,
  },
  {
    id: 4,
    imagen: "./imagenes/productos/calzado-negro.png",
    nombre: "Zapatilla negra",
    precio: 39,
    cant: 1,
  }
];
urlApi = `https://api.bluelytics.com.ar/v2/latest`;
carrito = [];
contenedorCotización = document.getElementById("cotización");
contenedorZapatillas = document.getElementById("contenedor__prod");
contenedorCarrito = document.getElementById("contenedor__carrito");
contenedorTotal = document.getElementById("total");
btnCompra = document.getElementById("botón__comprar");

// Agregar todos los productos al body
productos.forEach((prod) => {
  const elemento = `
    <div class='img__flex${prod.id} prod__container'>
      <img class='zapatilla' src=${prod.imagen} alt=${prod.nombre}>
      <span>U$S ${prod.precio}</span>
      <form>
        <input type='number' id='cantidad${prod.id}' class="cant" min='1' value='1'>
        <button class='botón' id='${prod.id}'>Agregar al carrito</button>
      </form>
    </div>`;
  contenedorZapatillas.insertAdjacentHTML("beforeend", elemento);

  const btnAgregarAlCarrito = document.getElementById(prod.id);
  btnAgregarAlCarrito.addEventListener("click", (event) => {
    event.preventDefault();
    const cant = document.getElementById(`cantidad${prod.id}`);
    const input = cant.value;
    agregarZapatilla(prod.id, input);
  });
});

// Texto inicial del modal
contenedorCarrito.innerHTML = `<p class='vacío'>El carrito está vacío</p>`;

// Agregar los productos al modal del carrito
function sumarAlCarrito() {
  const totalNum = carrito.reduce(
    (acc, prod) => acc + prod.precio * prod.cant,
    0
  );
  contenedorCarrito.innerHTML = "";

  // Agregar o eliminar los productos al modal
  carrito.forEach((prod) => {
    const subtotal = prod.cant * prod.precio;
    const elemento = `
        <div class='contenedor__elemento'>
          <svg class='basura' id='basura(${prod.id})' xmlns="http://www.w3.org/2000/svg" width="20" height="26" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
          <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z"/></svg>
          <p class='nombre'>${prod.nombre}</p>
          <p class='cantidad'>x${prod.cant}</p>
          <p class='subtotal'>U$S ${subtotal}</p>
        </div>`;
    const elementoTotal = `
        <div class='contenedor__total'>
          <p class='total__texto'>Total:</p>
          <p class='total__num'>U$S ${totalNum}</p>
        </div>`;

    contenedorCarrito.insertAdjacentHTML("beforeend", elemento);
    contenedorTotal.innerHTML = elementoTotal;

    const btnBasura = document.getElementById(`basura(${prod.id})`);
    btnBasura.addEventListener("click", () => {
      eliminarZapatilla(prod.id);
    });
  });

  // borrar el total cuando el carrito se vacía y mostrar texto
  function vacío() {
    contenedorCarrito.innerHTML = `<p class='vacío'>El carrito está vacío</p>`;
    contenedorTotal.innerHTML = "";
  }
  carrito.length === 0 && vacío();

  // traer la información del storage
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Agregar una zapatilla a la lista carrito
function agregarZapatilla(id, input) {
  // Buscar el producto por id
  const encontrar = carrito.some((product) => product.id === id);
  if(encontrar){
    // Sumar cantidad en la lista carrito
    const encontrarProd = carrito.find(prod=>prod.id === id)
    if(encontrarProd){
      input = parseInt(prod.cant) + parseInt(input);
      prod.cant = input;
    }
  }else{
    // Agregar la zapatilla a la lista carrito por primera vez
    const agregarProd = productos.find((product) => product.id === id);
    agregarProd.cant = parseInt(input);
    carrito.push(agregarProd);
  }
  sumarAlCarrito();
}

// Eliminar producto de la lista carrito
function eliminarZapatilla(id) {
  const EncontrarProd = carrito.find((product) => product.id === id);
  EncontrarProd.cant = 1;
  const resultado = carrito.indexOf(EncontrarProd);
  carrito.splice(resultado, 1);
  sumarAlCarrito();
}

// Guardar en el localstorage los productos que se agregaron al carrito
window.onload = () => {
  if (localStorage.getItem("carrito")) {
    carrito = JSON.parse(localStorage.getItem("carrito"));
    sumarAlCarrito();
  }
};

// Finalizar compra
btnCompra.addEventListener("click", () => {
  if (carrito.length != 0) {
    Swal.fire({
      position: "top-center",
      icon: "success",
      title: "¡Su compra ha sido realizada con exito!",
      showConfirmButton: false,
      timer: 3000,
    });
    contenedorCarrito.innerHTML = `<p class='vacío'>El carrito está vacío</p>`;
    contenedorTotal.innerHTML = "";
    localStorage.removeItem("carrito");
    setTimeout(() => {
      location.reload();
    }, 3300);
  }
});

// Agregar API de cotización del dólar
const llamarApi = async () => {
  try {
    const response = await fetch(urlApi);
    const data = await response.json();
    const cotEnPesos = data.blue.value_sell;
    contenedorCotización.innerHTML = `U$S 1 = $ ${cotEnPesos}`;
  } catch (error) {
    console.log("Ha ocurrido un error");
  }
};

llamarApi();
// Actualizar API cada media hora
setInterval(llamarApi, 1800000);
