
var swiper1 = new Swiper(".mySwiper-1", {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    }
});

var swiper2 = new Swiper(".mySwiper-2", {
    slidesPerView: 3,
    spaceBetween: 30,
    loop: true,
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    breakpoints: {
        0: {
            slidesPerView: 1
        },
        520: {
            slidesPerView: 2
        },
        950: {
            slidesPerView: 3
        },
    }
});

// CARRITO
const carrito = document.getElementById('carrito');
const elementos1 = document.getElementById('lista-1');
const elementos2 = document.getElementById('lista-2');
const elementos3 = document.getElementById('lista-3');
const lista = document.querySelector('#lista-carrito');
const vaciarCarritoBtn = document.getElementById('vaciar-carrito');
let totalCantidad = 0;
let totalPrecio = 0;
const contadorCantidad = document.getElementById('contador-cantidad');
const contadorPrecio = document.getElementById('contador-precio');
cargarEventListeners();

function cargarEventListeners() {
    elementos1.addEventListener('click', comprarElemento);
    elementos2.addEventListener('click', comprarElemento);
    elementos3.addEventListener('click', comprarElemento);
    carrito.addEventListener('click', eliminarElemento); 

    vaciarCarritoBtn.addEventListener('click', vaciarCarrito);
}

function comprarElemento(e) {
    e.preventDefault();
    if (e.target.classList.contains('agregar-carrito')) {
        const elemento = e.target.parentElement.parentElement;
        leerDatosElemento(elemento);
    }
}

function leerDatosElemento(elemento) {
    const infoElemento = {
        imagen: elemento.querySelector('img').src,
        titulo: elemento.querySelector('h3').textContent,
        precio: parseFloat(elemento.querySelector('.precio').textContent.replace('$', '')),
        id: elemento.querySelector('a').getAttribute('data-ic'),
        categoria: elemento.getAttribute('data-categoria') // Asumiendo que cada elemento tiene un atributo data-categoria
    };
    insertarCarrito(infoElemento);
}

function insertarCarrito(elemento) {
    let row = document.querySelector(`tr[data-id="${elemento.id}"]`);
    let categoriaRow = document.querySelector(`tr[data-categoria="${elemento.categoria}"]`);

    if (categoriaRow) {
        const cantidadTd = categoriaRow.querySelector('.cantidad');
        const precioTd = categoriaRow.querySelector('.precio');

        let cantidad = parseInt(cantidadTd.textContent) + 1;
        cantidadTd.textContent = cantidad;
        precioTd.textContent = `$${(elemento.precio * cantidad).toFixed(2)}`;
        
        totalCantidad++;
        totalPrecio += elemento.precio;
    } else {
        row = document.createElement('tr');
        row.setAttribute('data-id', elemento.id);
        row.setAttribute('data-categoria', elemento.categoria);
        row.innerHTML = `
            <td class="cantidad">1</td>    
            <td><img src="${elemento.imagen}" width="100" alt="${elemento.titulo}"></td>
            <td>${elemento.titulo}</td>
            <td class="precio">$${elemento.precio.toFixed(2)}</td>
            <td><a href="#" class="borrar" data-id="${elemento.id}">--X--</a></td>
        `;
        lista.appendChild(row);

        totalCantidad++;
        totalPrecio += elemento.precio;
    }
    actualizarContadores();
}

function eliminarElemento(e) {
    e.preventDefault(); 
    if (e.target.classList.contains('borrar')) {
        const elemento = e.target.closest('tr');
        const precioElemento = parseFloat(elemento.querySelector('.precio').textContent.replace('$', ''));
        const cantidad = parseInt(elemento.querySelector('.cantidad').textContent);

        elemento.remove();
        totalCantidad -= cantidad;
        totalPrecio -= precioElemento;

        actualizarContadores();
    }
}

function vaciarCarrito() {
    while (lista.firstChild) {
        lista.removeChild(lista.firstChild);
    }
    totalCantidad = 0;
    totalPrecio = 0;
    actualizarContadores();
}

function actualizarContadores() {
    contadorCantidad.textContent = totalCantidad;
    contadorPrecio.textContent = `$${totalPrecio.toFixed(2)}`;
    document.getElementById('total-precio').textContent = `Total: $${totalPrecio.toFixed(2)}`;
}