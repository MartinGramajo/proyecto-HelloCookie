const formularioForm = document.getElementById("Formulario");
const userInput = document.getElementById("inputUser");
const passInput = document.getElementById("inputPass");
const tablaUsuario = document.getElementById("tablaUser");
const cardProducto = document.getElementById("mostrarElemento");

const json = localStorage.getItem("productos");
let productos = JSON.parse(json) || [ ];

const admin = {
    username: "admin",
    pass: "admin",
    nombre: "Admin",
};

/*Logueo del admin*/
formularioForm.onsubmit = (e) => {
    e.preventDefault();
    const coincideUsername = admin.username === userInput.value;
    const coincidePass = admin.pass === passInput.value;
    if (coincideUsername && coincidePass) {
        alert("Bienvenido Don Galletadmin");
        window.location.href = "./admin.html";
    } else {
        alert("datos incorretos");
    }
};

/*mostrar producto*/
function mostrarProducto() {
    const productosMap = productos.map(function (producto) {
        return `
        <div class="col-3 col-sm-6">
                <div class=" card item shadow bg-primary text-white">
                    <h5 class="card-title item-title text-center text-dark">${producto.nombre}</h5>
                    <img class="card-img-top item-image" src="${producto.imagen}" alt="...">
                        <div class="card-body item-details">
                            <p class="card-text text-center item-price"> $ ${producto.precio}</p>
                            <button class="item-button btn btn-success d-flex m-auto addToCart ">Agregar al carrito </button>
                        </div>
                </div>
        </div> 
        `;
    });
    cardProducto.innerHTML = productosMap.join("");
}
mostrarProducto();

const addToShoppingCartButtons = document.querySelectorAll(".addToCart");
addToShoppingCartButtons.forEach((addToCartButton) => {
    addToCartButton.addEventListener("click", addToCartClicked);
});

const comprarButton = document.querySelector(".comprarButton");
comprarButton.addEventListener("click", comprarButtonClicked);

const shoppingCartItemsContainer = document.querySelector(
    ".shoppingCartItemsContainer"
);

function addToCartClicked(event) {
    const button = event.target;
    const item = button.closest(".item");

    const itemTitle = item.querySelector(".item-title").textContent;
    const itemPrice = item.querySelector(".item-price").textContent;
    const itemImage = item.querySelector(".item-image").src;

    addItemToShoppingCart(itemTitle, itemPrice, itemImage);
}

function addItemToShoppingCart(itemTitle, itemPrice, itemImage) {
    const elementsTitle = shoppingCartItemsContainer.getElementsByClassName(
        "shoppingCartItemTitle"
    );
    for (let i = 0; i < elementsTitle.length; i++) {
        if (elementsTitle[i].innerText === itemTitle) {
            let elementQuantity = elementsTitle[
                i
            ].parentElement.parentElement.parentElement.querySelector(
                ".shoppingCartItemQuantity"
            );
            elementQuantity.value++;
            $(".toast").toast("show");
            updateShoppingCartTotal();
            return;
        }
    }

    const shoppingCartRow = document.createElement("div");
    const shoppingCartContent = `
  <div class="row shoppingCartItem">
        <div class="col-6">
            <div class="shopping-cart-item d-flex align-items-center h-100 border-bottom pb-2 pt-3">
                <img src=${itemImage} class="shopping-cart-image">
                <h6 class="shopping-cart-item-title shoppingCartItemTitle text-truncate ml-3 mb-0">${itemTitle}</h6>
            </div>
        </div>
        <div class="col-2">
            <div class="shopping-cart-price d-flex align-items-center h-100 border-bottom pb-2 pt-3">
                <p class="item-price mb-0 shoppingCartItemPrice">${itemPrice}</p>
            </div>
        </div>
        <div class="col-4">
            <div
                class="shopping-cart-quantity d-flex justify-content-between align-items-center h-100 border-bottom pb-2 pt-3">
                <input class="shopping-cart-quantity-input shoppingCartItemQuantity" type="number"
                    value="1">
                <button class="btn btn-danger buttonDelete" type="button">X</button>
            </div>
        </div>
    </div>`;
    shoppingCartRow.innerHTML = shoppingCartContent;
    shoppingCartItemsContainer.append(shoppingCartRow);

    shoppingCartRow
        .querySelector(".buttonDelete")
        .addEventListener("click", removeShoppingCartItem);

    shoppingCartRow
        .querySelector(".shoppingCartItemQuantity")
        .addEventListener("change", quantityChanged);

    updateShoppingCartTotal();
}

function updateShoppingCartTotal() {
    let total = 0;
    const shoppingCartTotal = document.querySelector(".shoppingCartTotal");

    const shoppingCartItems = document.querySelectorAll(".shoppingCartItem");

    shoppingCartItems.forEach((shoppingCartItem) => {
        const shoppingCartItemPriceElement = shoppingCartItem.querySelector(
            ".shoppingCartItemPrice"
        );
        const shoppingCartItemPrice = Number(
            shoppingCartItemPriceElement.textContent.replace("$", "")
        );
        const shoppingCartItemQuantityElement = shoppingCartItem.querySelector(
            ".shoppingCartItemQuantity"
        );
        const shoppingCartItemQuantity = Number(
            shoppingCartItemQuantityElement.value
        );
        total = total + shoppingCartItemPrice * shoppingCartItemQuantity;
    });
    shoppingCartTotal.innerHTML = `${total.toFixed(2)}€`;
}

function removeShoppingCartItem(event) {
    const buttonClicked = event.target;
    buttonClicked.closest(".shoppingCartItem").remove();
    updateShoppingCartTotal();
}

function quantityChanged(event) {
    const input = event.target;
    input.value <= 0 ? (input.value = 1) : null;
    updateShoppingCartTotal();
}

function comprarButtonClicked() {
    shoppingCartItemsContainer.innerHTML = "";
    updateShoppingCartTotal();
}
