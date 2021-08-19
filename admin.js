const formularioAlta = document.getElementById('formularioAlta');
const nombreInputProducto = document.getElementById('inputNombre');
const marcaInput = document.getElementById('inputMarca');
const precioInput = document.getElementById('inputPrecio');
const imagenInput = document.getElementById('formImagen');
const descripcionInput = document.getElementById('inputDescripcion');
const productosTabla = document.getElementById('tabla');

const editarForm = document.getElementById('formularioEditar');
const editarNombreInput = document.getElementById('editarNombre');
const editarMarcaInput = document.getElementById('editarMarca');
const editarPrecioInput = document.getElementById('editarPrecio');
const editarImagenInput = document.getElementById('editarFormImagen');
const editarDescripcionInput = document.getElementById('editarInputDescripcion');

const busquedaForm = document.getElementById('formBusqueda');

const productoPaginaPrincipal = document.getElementById('agregarProducto');

const json = localStorage.getItem('productos');
let productos = JSON.parse(json) || [];
let productoId = '';


// Funcion generar ID del producto 
function generarID() {
    return '_' + Math.random().toString(36).substr(2, 9);
};

// Funcion Alta producto 
const submitAlta = (e) => {
    e.preventDefault();
    const producto = {
        id: generarID(),
        nombre: nombreInputProducto.value,
        marca: marcaInput.value,
        precio: precioInput.value,
        imagen: imagenInput.value,
        detalle: descripcionInput.value,
        registro: Date.now(),
    };
    productos.push(producto);
    const json = JSON.stringify(productos);
    localStorage.setItem('productos', json);
    mostrarProductos();
    formularioAlta.reset();
};

//Funcion listar productos
function mostrarProductos() {
    const productosMap = productos.map(function (producto) {
        return `
            <tr>
                <td>${producto.nombre}</td>
                <td>${producto.marca}</td>
                <td>${producto.precio}</td>
                <td>${producto.imagen}</td>
                <td>${producto.detalle}</td>
                <td>
                <button onclick="mostrarDetalle('${producto.id}')" type="button" class="btn btn-info btn-sm text-white" data-bs-toggle="modal" data-bs-target="#modalDetalle">Ver detalle</button>
                <button onclick="cargarModalEditar('${producto.id}')" type="button" class=" text-white btn btn-warning btn-sm p-2" data-bs-toggle="modal" data-bs-target="#modalEditar"> Editar </button>
                <button onclick="eliminarProducto('${producto.id}')" class="btn btn-danger btn-sm p-2" >Eliminar producto</button>
                </td>
            </tr>
        `
    })
    productosTabla.innerHTML = productosMap.join('');
}

// funcion para mostrar detalle. 
function mostrarDetalle(id) {
    const productoEncontrado = productos.find((producto) => producto.id === id);
    const detallesDiv = document.getElementById('detalleProducto');
    const fecha = new Date(productoEncontrado.registro);
    const detallesProducto = `
    <p>Nombre: ${productoEncontrado.nombre}</p>
    <p>Marca: ${productoEncontrado.marca}</p>
    <p>Precio: ${productoEncontrado.precio}</p>
    <p>imagen del producto: <img style="max-width: fit-content; height: 200px; " src="${productoEncontrado.imagen}" alt=""></p>
    <p>detalles: ${productoEncontrado.detalle}</p>
    <p>Fecha de registro: ${fecha.toLocaleString()}</p>
    `
    detallesDiv.innerHTML = detallesProducto;
}

// Funcion eliminar Producto. 
function eliminarProducto(id) {
    const confirmar = confirm('Confirmar para eliminar el producto');
    if (!confirmar) {
        return
    }
    const productosLocal = JSON.parse(localStorage.getItem('productos'));
    const productosFiltrados = productosLocal.filter((producto) => producto.id !== id);
    const json = JSON.stringify(productosFiltrados);
    localStorage.setItem('productos', json);
    productos = productosFiltrados;
    mostrarProductos();
}

// funcion para precargar el modal con los datos previamente ingresado del producto. 
function cargarModalEditar(id) {
    const productoEncontrado = productos.find((producto) => producto.id === id);
    editarNombreInput.value = productoEncontrado.nombre;
    editarMarcaInput.value = productoEncontrado.marca;
    editarPrecioInput.value = productoEncontrado.precio;
    editarImagenInput.value = productoEncontrado.imagen;
    editarDescripcionInput.value = productoEncontrado.detalle;
    productoId = productoEncontrado.id;
}

// funcion para editar el producto. 
function editarProducto(e) {
    e.preventDefault();
    const productosModificados = productos.map((producto) => {
        if (producto.id === productoId) {
            const productoModificado = {
                ...producto,
                nombre: editarNombreInput.value,
                marca: editarMarcaInput.value,
                precio: editarPrecioInput.value,
                imagen: editarImagenInput.value,
                detalle: editarDescripcionInput.value,
            };
            return productoModificado;
        } else {
            return producto;
        }
    })
    const json = JSON.stringify(productosModificados);
    localStorage.setItem('productos', json);
    productos = productosModificados;
    console.log('Se modificó exitosamente un usuario. 👨‍💻');
    mostrarProductos();
    const modalDiv = document.getElementById('modalEditar');
    const modalBootstrap = bootstrap.Modal.getInstance(modalDiv);
    modalBootstrap.hide();
}

//funcion  busqueda producto 
const submitBusqueda = (e) => {
    e.preventDefault();
    const productosLocal = JSON.parse(localStorage.getItem('productos') || []);
    const busquedaInput = document.getElementById('busqueda');
    const termino = busquedaInput.value.toLowerCase();
    const productosFiltrados = productosLocal.filter((producto) => {
        const nombreEnMinuscula = producto.nombre.toLowerCase();
        const marcaEnMinuscula = producto.marca.toLowerCase();
        const detallesEnMinuscula = producto.detalle.toLowerCase();
        return nombreEnMinuscula.includes(termino) || marcaEnMinuscula.includes(termino) || detallesEnMinuscula.includes(termino);
    });
    productos = productosFiltrados;
    mostrarProductos();
    const alerta = document.getElementById('alertaBusqueda');
    if (productosFiltrados.length === 0) {
        alerta.classList.remove('d-none');
    } else {
        alerta.classList.add('d-none');
    }
}

//funcion para limpiar el historial de busqueda. 
const limpiarFiltro = () => {
    productos = JSON.parse(localStorage.getItem('productos')) || [];
    busquedaForm.reset();
    mostrarProductos();
    const alerta = document.getElementById('alertaBusqueda');
    alerta.classList.add('d-none')
}



mostrarProductos();
formularioAlta.onsubmit = submitAlta;
editarForm.onsubmit = editarProducto;
busquedaForm.onsubmit = submitBusqueda;

