const ORDER_ASC_BY_NAME = "AZ";
const ORDER_DESC_BY_NAME = "ZA";
const ORDER_BY_PROD_COUNT = "Cant.";
let currentCategoriesArray = [];
let currentSortCriteria = undefined;
let minCount = undefined;
let maxCount = undefined;

// Ordena las categorías según el criterio especificado.
function sortCategories(criteria, array){
    let result = [];

    // Ordena por nombre de forma ascendente
    if (criteria === ORDER_ASC_BY_NAME) {
        result = array.sort(function(a, b) {
            if (a.name < b.name) { return -1; }
            if (a.name > b.name) { return 1; }
            return 0;
        });
    }
    // Ordena por nombre de forma descendente
    else if (criteria === ORDER_DESC_BY_NAME) {
        result = array.sort(function(a, b) {
            if (a.name > b.name) { return -1; }
            if (a.name < b.name) { return 1; }
            return 0;
        });
    }
    // Ordena por cantidad de productos en forma ascendente
    else if (criteria === ORDER_BY_PROD_COUNT) {
        result = array.sort(function(a, b) {
            let aCount = parseInt(a.productCount);
            let bCount = parseInt(b.productCount);

            if (aCount > bCount) { return -1; }
            if (aCount < bCount) { return 1; }
            return 0;
        });
    }

    return result;
}

// Se almacena el id de la categoría en el local storage y redirige a la página de productos
function setCatID(id) {
    localStorage.setItem("catID", id);
    window.location = "products.html";
}

// Se muestra la lista de categorías en la página
function showCategoriesList() {
    let htmlContentToAppend = "";

    // Itera sobre las categorías y genera el HTML correspondiente
    for (let i = 0; i < currentCategoriesArray.length; i++) {
        let category = currentCategoriesArray[i];

        // Verifica si la categoría cumple con los criterios de cantidad de productos
        if (((minCount == undefined) || (minCount != undefined && parseInt(category.productCount) >= minCount)) &&
            ((maxCount == undefined) || (maxCount != undefined && parseInt(category.productCount) <= maxCount))) {

            // Se genera el HTML para mostrar cada categoría
            htmlContentToAppend += `
            <div onclick="setCatID(${category.id})" class="list-group-item list-group-item-action cursor-active">
                <div class="row">
                    <div class="col-2">
                        <img src="${category.imgSrc}" alt="${category.description}" class="img-thumbnail">
                    </div>
                    <div class="col">
                        <div class="d-flex w-100 justify-content-between">
                            <h4 class="mb-1">${category.name}</h4>
                            <small class="text-muted">${category.productCount} artículos</small>
                        </div>
                        <p class="mb-1">${category.description}</p>
                    </div>
                </div>
            </div>
            `;
        }
    }

    // Actualiza el contenido en el contenedor HTML de la lista de categorías
    document.getElementById("cat-list-container").innerHTML = htmlContentToAppend;
}

// Ordena y muestra las categorías
function sortAndShowCategories(sortCriteria, categoriesArray) {
    currentSortCriteria = sortCriteria;

    // Verifica si existen las categorías
    if (categoriesArray != undefined) {
        currentCategoriesArray = categoriesArray;
    }

    // Ordena las categorías según el criterio 
    currentCategoriesArray = sortCategories(currentSortCriteria, currentCategoriesArray);

    // Muestra la lista de categorías ordenadas
    showCategoriesList();
}



document.addEventListener("DOMContentLoaded", function(e){
    
    // Se obtienen las categorías del JSON y se muestran
    getJSONData(CATEGORIES_URL).then(function(resultObj){
        if (resultObj.status === "ok"){
            // Se actualiza el conjunto actual de categorías con los datos obtenidos del JSON
            currentCategoriesArray = resultObj.data
            // Se muestran las categorías 
            showCategoriesList()
        }
    });

     // Se ordenan categorías en forma ascendente por nombre
     document.getElementById("sortAsc").addEventListener("click", function(){
        sortAndShowCategories(ORDER_ASC_BY_NAME);
    });

    // Se ordenan categorías en forma descendente por nombre
    document.getElementById("sortDesc").addEventListener("click", function(){
        sortAndShowCategories(ORDER_DESC_BY_NAME);
    });

    // Se ordenan categorías por cantidad de productos
    document.getElementById("sortByCount").addEventListener("click", function(){
        sortAndShowCategories(ORDER_BY_PROD_COUNT);
    });

    // Se limpian los filtros de rango de cantidad de productos
    document.getElementById("clearRangeFilter").addEventListener("click", function(){
    
        document.getElementById("rangeFilterCountMin").value = "";
        document.getElementById("rangeFilterCountMax").value = "";

        minCount = undefined;
        maxCount = undefined;

        // Mostrar la lista de categorías actualizada
        showCategoriesList();
    });

    // Filtro de rango de cantidad de productos
    document.getElementById("rangeFilterCount").addEventListener("click", function(){
        // Obtener los valores mínimo y máximo del filtro de rango
        minCount = document.getElementById("rangeFilterCountMin").value;
        maxCount = document.getElementById("rangeFilterCountMax").value;

        // Validar y convertir los valores a números enteros si son válidos
        if ((minCount != undefined) && (minCount != "") && (parseInt(minCount)) >= 0){
            minCount = parseInt(minCount);
        } else {
            minCount = undefined;
        }

        if ((maxCount != undefined) && (maxCount != "") && (parseInt(maxCount)) >= 0){
            maxCount = parseInt(maxCount);
        } else {
            maxCount = undefined;
        }

        // Mostrar la lista de categorías actualizada con el filtro aplicado
        showCategoriesList();
    });
});

//Campo de Busqueda.
document.addEventListener('DOMContentLoaded', function() {
    // Se definen las variables.
    const search_Input = document.getElementById('searchInput');
    const categoryList = document.getElementById('cat-list-container');

    // Se agrega un evento al campo de texto (search_Input).
    search_Input.addEventListener('input', function() {

        // Se definen dos nuevas variables, una para obtener el valor actual y pasarlo a minúsculas,
        // y la segunda para seleccionar todas las categorías con esa clase en CSS.
        const searchText = search_Input.value.toLowerCase();
        const categories = categoryList.querySelectorAll('.list-group-item');

        // Se itera sobre cada elemento y ejecuta la función.
        categories.forEach(category => {
            const categoryName = category.querySelector('h4').textContent.toLowerCase();
            // Se hace una comparación del nombre de la categoría con el cuadro de búsqueda,
            // si es true, se muestra; si es false, se oculta.
            if (categoryName.includes(searchText)) {
                category.style.display = 'block';
            } else {
                category.style.display = 'none';
            }
        });
    });
});