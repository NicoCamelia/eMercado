// Arreglo que almacenará la información de los productos actuales
let currentProductsArray = [];
// Obteniendo catID de localStorage
let catID = JSON.parse(localStorage.getItem("catID")); 
// Generando URL concatenando variables desde init.js y catID desde localStorage
let urlCAT = PRODUCTS_URL + catID + EXT_TYPE; 
// Variables para filtrar por rango de precio
let minCount = undefined;
let maxCount = undefined;

/* 
Una vez obtenido el urlCAT utilizamos el getJSONData para traer todos los productos del API y los cargamos
en currentProductArray para poder trabajar con ellos.
Y seteamos el nombre de la categoria para poder mostrarlo.
*/
document.addEventListener("DOMContentLoaded", function (e) {
    getJSONData(urlCAT).then(function (resultObj) {
        if (resultObj.status === "ok") {
            currentProductsArray = resultObj.data.products;
            setCategoryName(resultObj.data.catName);
            showProductsList();
        }
    });
});

// Establece el ID del producto seleccionado en el localStorage y redirige a la página de detalles del producto
function setProductID(id) {
    localStorage.setItem("prodID", id);
    window.location = "product-info.html"
}

// Establece el nombre de la categoría y lo muestra en negrita en el subtitulo
function setCategoryName(newCategoryName) {
    var categoryName = document.getElementById("category-name");
    categoryName.innerHTML = newCategoryName;
    categoryName.style.fontWeight = "bold";

}

// Muestra la lista de productos con filtrado opcional por rango de precio
function showProductsList() {
    let htmlContentToAppend = "";

    for (let i = 0; i < currentProductsArray.length; i++) {
        let product = currentProductsArray[i];

        // Filtra por rango de precio si se han definido minCount y maxCount
        if (((minCount == undefined) || (minCount != undefined && parseInt(product.cost) >= minCount)) &&
            ((maxCount == undefined) || (maxCount != undefined && parseInt(product.cost) <= maxCount))){
        
        // Construye el HTML para mostrar la lista de productos
        htmlContentToAppend += `
        <div onclick="setProductID(${product.id})" class="list-group-item list-group-item-action cursor-active">
            <div class="row">
                <div class="col-3">
                    <img src="${product.image}" alt="${product.description}" class="img-thumbnail">
                </div>
                <div class="col">
                    <div class="d-flex w-100 justify-content-between">
                        <h4 class="mb-1">${product.name} - ${product.currency}&nbsp;${product.cost}</h4>
                        <small class="text-muted">${product.soldCount} vendidos</small>
                    </div>
                    <p class="mb-1">${product.description}</p>
                </div>
            </div>
        </div>
        `;
        }
    document.getElementById("products-list-container").innerHTML = htmlContentToAppend;
    }
}

// Event listeners para los botones de ordenamiento y filtrado
document.getElementById("MayorAMenor").addEventListener('click', () => {
    // Ordena los productos de mayor a menor precio y actualiza la lista
    result = currentProductsArray.sort(function(a, b) {
        if ( a.cost < b.cost ){ return -1; }
        if ( a.cost > b.cost ){ return 1; }
        return 0;
    });
    showProductsList()
    return result;
});

document.getElementById("MenorAMayor").addEventListener('click', () => {
    // Ordena los productos de menor a mayor precio y actualiza la lista
    result = currentProductsArray.sort(function(a, b) {
        if ( a.cost > b.cost ){ return -1; }
        if ( a.cost < b.cost ){ return 1; }
        return 0;
    });
    showProductsList()
    return result;
});

document.getElementById("porCantidad").addEventListener('click', () => {
    // Ordena los productos por cantidad vendida de mayor a menor y actualiza la lista
    result = currentProductsArray.sort(function(a, b) {
        let aCount = parseInt(a.soldCount);
        let bCount = parseInt(b.soldCount);

        if ( aCount > bCount ){ return -1; }
        if ( aCount < bCount ){ return 1; }
        return 0;
    });
    showProductsList()
    return result;
});

document.getElementById("filtroRango").addEventListener('click', () => {
    // Aplica el filtro por rango de precio y actualiza la lista
    minCount = document.getElementById("filtroRangoMin").value;
    maxCount = document.getElementById("filtroRangoMax").value;

    if ((minCount != undefined) && (minCount != "") && (parseInt(minCount)) >= 0){
        minCount = parseInt(minCount);
    }
    else{
        minCount = undefined;
    }

    if ((maxCount != undefined) && (maxCount != "") && (parseInt(maxCount)) >= 0){
        maxCount = parseInt(maxCount);
    }
    else{
        maxCount = undefined;
    }

    showProductsList()
});

document.getElementById("limpiarFiltroRango").addEventListener('click', () => {
    // Limpia los campos de filtro por rango de precio y actualiza la lista
    document.getElementById("filtroRangoMin").value = "";
    document.getElementById("filtroRangoMax").value = "";

    minCount = undefined;
    maxCount = undefined;

    showProductsList()
});

// Event listener para la barra de búsqueda
document.addEventListener('DOMContentLoaded', function() {

    const search_Input = document.getElementById('searchInput');
    const productsList = document.getElementById('products-list-container');

    search_Input.addEventListener('input', function() {

        const searchText = search_Input.value.toLowerCase();
        const products = productsList.querySelectorAll('.list-group-item');

        products.forEach(product => {
            const productName = product.querySelector('h4').textContent.toLowerCase();
            const productDescription = product.getAttribute('data-description').toLowerCase();
            
            if (productName.includes(searchText) || productDescription.includes(searchText)) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });
    });
});