let productoEnCarrito = localStorage.getItem("productos-en-carrito");
productoEnCarrito = JSON.parse(productoEnCarrito);


const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
const contenedorCarritoProductos = document.querySelector("#carrito-productos");
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
const contenedorCarritoComprado = document.querySelector("#carrito-comprado");
let botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");
const botonesVaciar = document.querySelector("#carrito-acciones-vaciar");
const contenedorTotal = document.querySelector("#total");
const botonesComprar = document.querySelector("#carrito-acciones-comprar");


function cargarProductosCarrito() {

    // este condicional muestra el producto en el carrito y si el carrito no tiene productos devuelve el mensaje de carrito vacio
    if (productoEnCarrito && productoEnCarrito.length > 0) {


        contenedorCarritoVacio.classList.add("disable");
        contenedorCarritoProductos.classList.remove("disable");
        contenedorCarritoAcciones.classList.remove("disable");
        contenedorCarritoComprado.classList.add("disable");

        contenedorCarritoProductos.innerHTML = " ";

        productoEnCarrito.forEach(producto => {
            const div = document.createElement("div");
            div.classList.add("carrito-producto");
            div.innerHTML = `
            <img class="carrito-producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
            <div class="carrito-producto-titulo">
                <small>Titulo</small>
                <h3>${producto.titulo}</h3>
            </div>
            <div class="carrito-producto-cantidad">
                <small>Cantidad</small>
                <p>${producto.cantidad}</p>
            </div>
            <div class="carrito-producto-precio">
                <small>Precio</small>
                <p>$${producto.precio}</p>
            </div>
            <div class="carrito-producto-subtotal">
                <small>subtotal</small>
                <p>$${producto.precio * producto.cantidad}</p>
            </div>
            <button class="carrito-producto-eliminar" id="${producto.id}"><i class="bi bi-trash-fill"></i></button>
            `;

            contenedorCarritoProductos.append(div);
        })

    } else {
        contenedorCarritoVacio.classList.remove("disable");
        contenedorCarritoProductos.classList.add("disable");
        contenedorCarritoAcciones.classList.add("disable");
        contenedorCarritoComprado.classList.add("disable");

    }
    actualizarBotonesEliminar();
    actualizarTotal()
}

cargarProductosCarrito();


function actualizarBotonesEliminar() {
    botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");

    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", eliminarDelCarrito);
    });
}

function eliminarDelCarrito(e) {

    Toastify({
        text: "Producto eliminado",
        duration: 2000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: "linear-gradient(to right, #06060A, #7B7890)",
            borderRadius: "2rem",
            textTransform: "uppercase",
            fontSize: ".75rem"
        },
        offset: {
            x: '1.5rem', // horizontal axis - can be a number or a string indicating unity. eg: '2em'
            y: '1.5rem' // vertical axis - can be a number or a string indicating unity. eg: '2em'
        },
        onClick: function () { } // Callback after click
    }).showToast();

    const idBoton = e.currentTarget.id;
    const index = productoEnCarrito.findIndex(producto => producto.id === idBoton);

    productoEnCarrito.splice(index, 1);
    cargarProductosCarrito()

    localStorage.setItem("productos-en-carrito", JSON.stringify(productoEnCarrito));
}


// funcion para vaciar el carrito y tambien lo vacia en el localStorage
botonesVaciar.addEventListener("click", vaciarCarrito);

function vaciarCarrito() {

    Swal.fire({
        title: '¿Estas seguro?',
        icon: 'question',
        html:
            'Se van a borrar todos tus productos ',
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText:
            'Si',
        cancelButtonText:
            'No',
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire('Saved!', '', 'success')
            productoEnCarrito.length = 0;
            localStorage.setItem("productos-en-carrito", JSON.stringify(productoEnCarrito));
            cargarProductosCarrito();
        }

    })


}

// funcion actualiza el total cada vez que se carguen/eliminen productos
function actualizarTotal() {
    const totalCalculado = productoEnCarrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0)
    total.innerText = `$${totalCalculado}`;
}


// funcion para comprar y mostrar mensaje de que se realizo con exito
botonesComprar.addEventListener("click", comprarCarrito);
function comprarCarrito() {
    productoEnCarrito.length = 0;
    localStorage.setItem("productos-en-carrito", JSON.stringify(productoEnCarrito));

    contenedorCarritoVacio.classList.add("disable");
    contenedorCarritoProductos.classList.add("disable");
    contenedorCarritoAcciones.classList.add("disable");
    contenedorCarritoComprado.classList.remove("disable");
}
