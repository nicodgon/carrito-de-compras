"use strict";

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
  },
];
const urlApi = `https://api.bluelytics.com.ar/v2/latest`;
let carrito = [];
const contenedorCotización = document.getElementById("cotización");
const contenedorZapatillas = document.getElementById("contenedor__prod");
const contenedorCarrito = document.getElementById("contenedor__carrito");
const carritoVacío = document.getElementById("carrito__vacío");
const contenedorTotalTexto = document.getElementById("total__texto");
const contenedorTotalNum = document.getElementById("total__num");
const btnCompra = document.getElementById("botón__comprar");

function escapeHTML(valor) {
  return valor.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

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
    const cantInput = document.getElementById(`cantidad${prod.id}`).value;
    const cantidad = parseInt(escapeHTML(cantInput));
    if (!isNaN(cantidad) && cantidad > 0) {
      agregarZapatilla(prod.id, cantidad);
    } else {
      alert("Por favor ingrese una cantidad válida.");
    }
  });
});

// Texto inicial del modal
carritoVacío.textContent = `El carrito está vacío`;

// Agregar los productos al modal del carrito
function sumarAlCarrito() {
  const totalNum = carrito.reduce(
    (acc, prod) => acc + prod.precio * prod.cant,
    0
  );
  carritoVacío.textContent = "";
  contenedorCarrito.textContent = "";
  contenedorTotalTexto.textContent = "Total:";

  // Agregar o eliminar los productos al modal
  carrito.forEach((prod) => {
    const subtotal = prod.cant * prod.precio;
    const elemento = `
        <div class='contenedor__elemento'>
          <img src="./imagenes/iconos/tacho.svg" class='basura' id='basura(${prod.id})'>
          <p class='nombre'>${prod.nombre}</p>
          <p class='cantidad'>x${prod.cant}</p>
          <p class='subtotal'>U$S ${subtotal}</p>
        </div>`;
    const elementoTotal = `U$S ${totalNum}`;

    contenedorCarrito.insertAdjacentHTML("beforeend", elemento);
    contenedorTotalTexto.textContent = "Total:";
    contenedorTotalNum.textContent = elementoTotal;

    const btnBasura = document.getElementById(`basura(${prod.id})`);
    btnBasura.addEventListener("click", () => {
      eliminarZapatilla(prod.id);
    });
  });

  // borrar el total cuando el carrito se vacía y mostrar texto
  function vacío() {
    carritoVacío.textContent = `El carrito está vacío`;
    contenedorCarrito.textContent = "";
    contenedorTotalNum.textContent = "";
    contenedorTotalTexto.textContent = "";
  }
  carrito.length === 0 && vacío();

  // traer la información del storage
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Agregar una zapatilla a la lista carrito
function agregarZapatilla(id, cantidad) {
  // Buscar el producto por id
  const encontrar = carrito.some((product) => product.id === id);
  if (encontrar) {
    // Sumar cantidad en la lista carrito
    const encontrarProd = carrito.find((prod) => prod.id === id);
    if (encontrarProd) {
      encontrarProd.cant += cantidad;
    }
  } else {
    // Agregar la zapatilla a la lista carrito por primera vez
    const agregarProd = productos.find((product) => product.id === id);
    agregarProd.cant = cantidad;
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
  if (carrito.length !== 0) {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "¡Su compra ha sido realizada con exito!",
      showConfirmButton: false,
      timer: 3000,
    });
    carritoVacío.textContent = `El carrito está vacío`;
    contenedorCarrito.textContent = "";
    contenedorTotalNum.textContent = "";
    contenedorTotalTexto.textContent = "";
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
    contenedorCotización.textContent = `U$S 1 = $ ${cotEnPesos}`;
  } catch (error) {
    console.log("Ha ocurrido un error");
  }
};

llamarApi();
// Actualizar API cada media hora
setInterval(llamarApi, 1800000);
