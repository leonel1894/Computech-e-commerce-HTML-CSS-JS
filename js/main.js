let productos = [];

fetch("./js/productos.json")
    .then(response => response.json())
    .then(data => {
        productos = data;
        cargarProductos(productos)
    })


// a traves de querySelector traje archivos del HTML
const contenedorProductos = document.querySelector("#contenedorProductos");
const botonesCategorias = document.querySelectorAll(".boton-categoria");
const tituloPrincipal = document.querySelector("#titulo-principal");
let botonesAgregar = document.querySelectorAll(".producto-agregar");
const numerito = document.querySelector("#numerito");


// Cree una funcion que cuando se ejecute:
//  1)vacie el contenedor 
// 2)hace forEach de los productos elegidos 
// 3)se crea array con filter y se ejecuta cargarProductos(productosBoton) 
// 4)se cargan los div y se envian a contenedorProductos
function cargarProductos(productosElegidos) {

    contenedorProductos.innerHTML = " ";

    productosElegidos.forEach(producto => {

        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
        <img class="producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
        <div class="producto-detalles">
            <h3 class="producto-titulo">${producto.titulo}</h3>
            <p class="producto-precio">$${producto.precio}</p>
            <button class="producto-agregar" id="${producto.id}">Agregar</button>
        </div>
        `

        contenedorProductos.append(div);
        // Con .append envie el div creado al contenedor que traje del html
    })
    actualizarBotonesAgregar()
}


// traje boton-categoria de mi html, cree un evento que primero elimina la categoria active y luego otro para devolver la clase.
botonesCategorias.forEach(boton => {
    boton.addEventListener("click", (e) => {
        botonesCategorias.forEach(boton => boton.classList.remove("active"));
        e.currentTarget.classList.add("active");

        // Use un condicional que si el id no es igual a todos se ejecute el metodo filter para crear un array y traer los productos que coincidan con la condicion.
        // Use find para traer el nombre de producto al titulo principal de mi html.
        if (e.currentTarget.id != "todos") {
            const productoCategoria = productos.find(producto => producto.categoria.id === e.currentTarget.id);
            tituloPrincipal.innerText = productoCategoria.categoria.nombre;
            const productosBoton = productos.filter(producto => producto.categoria.id === e.currentTarget.id);
            cargarProductos(productosBoton);
        } else {
            tituloPrincipal.innerText = "Todos los productos"
            cargarProductos(productos)
        }

    })
})

// cree una funcion de actualizar botones y la llamo dentro de cargar productos, para que se actualizen los botones
function actualizarBotonesAgregar() {
    botonesAgregar = document.querySelectorAll(".producto-agregar");

    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito)
    })
}


// traje lo guardado en el localstorage para cuando se actualize no se pierdan los productos dentro del carrito

let productoEnCarrito;

let productoEnCarritoLS = localStorage.getItem("productos-en-carrito");


// lo que hace el condicional es que si hay algo en el localstorage sea igual a prductosEnCarrito y sino que este vacio
if (productoEnCarritoLS) {
    productoEnCarrito = JSON.parse(productoEnCarritoLS);
    actualizarNumerito()

} else {
    productoEnCarrito = [];
}




// funcion agregarAlcarrito;
// idboton trae el id de cada producto
// producto.find devuelve el primer elemento que coincida
// con el condicional lo que hice fue crear la propiedad cantidad, para que los productos no se repitan y aumente su cantidad
// productoEnCarrito.push envia productoAgregado dentro de productoEnCarrito
function agregarAlCarrito(e) {

    Toastify({
        text: "Producto agregado",
        duration: 2000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
            background: "linear-gradient(to right, #06060A, #7B7890)",
            borderRadius: "2rem",
            textTransform: "uppercase",
            fontSize: ".75rem"
        },
        offset: {
            x: '1.5rem',
            y: '1.5rem'
        },
        onClick: function () { } // Callback after click
    }).showToast();

    const idboton = e.currentTarget.id;
    const productoAgregado = productos.find(producto => producto.id === idboton);

    if (productoEnCarrito.some(producto => producto.id === idboton)) {
        const index = productoEnCarrito.findIndex(producto => producto.id === idboton);
        productoEnCarrito[index].cantidad++;

    } else {
        productoAgregado.cantidad = 1;
        productoEnCarrito.push(productoAgregado);
    }

    actualizarNumerito()

    localStorage.setItem("productos-en-carrito", JSON.stringify(productoEnCarrito))

}


// funcion para actualizar el numero de los productos del carrito
// lo que hace es sumar el acumular con las cantidades de productos que hay
function actualizarNumerito() {
    let nuevoNumerito = productoEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0)
    numerito.innerText = nuevoNumerito
}