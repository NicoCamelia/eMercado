let prodID = JSON.parse(localStorage.getItem("prodID")); // Obteniendo prodID de localStorage
let prodCAT = JSON.parse(localStorage.getItem("catID")); // Obteniendo catID de localStorage
let urlPRODUCTS = PRODUCTS_URL + prodCAT + EXT_TYPE; // Generando URL concatenando variables desde init.js y catID desde localStorage
let urlPROD = PRODUCT_INFO_URL+ + prodID + EXT_TYPE; // Generando URL concatenando variables desde init.js y prodID desde localStorage
let urlCOMENTS = PRODUCT_INFO_COMMENTS_URL + prodID + EXT_TYPE; // Generando Url concatenando variables para traer los comentarios independientemente por cada id.
let currentProd; //Se declara la variable que almacena la información del producto mostrado actualmente en la página
let relatedProducts; //Se declara la variable que almacena la información de los productos relacionados


document.addEventListener("DOMContentLoaded", function (e) {
    getJSONData(urlPROD).then(function (resultObj) {
        if (resultObj.status === "ok") {
            currentProd = resultObj.data;
            showProductInfo(); // Muestra la información del producto actual en el HTML
            showImagesHtml(); // Corresponde al carrusel de imagenes del producto actual
            showComments(); 
            getRelatedProducts(); //Obtiene los productos relacionados 
        }
    });
});

function getRelatedProducts() {
    getJSONData(urlPRODUCTS).then(function (resultObj) {
        if (resultObj.status === "ok") {
            let categoryData = resultObj.data;

            if ('products' in categoryData) { // Verifica si la propiedad 'products' existe en el objeto
               
                let products = categoryData.products; // Obtenemos solo los productos de la misma categoría

                relatedProducts = products.filter(product => product.id !== currentProd.id); // Evita que se muestre el producto actual entre los relacionados

                showRelatedProducts(relatedProducts); // Muestra las cards de productos relacionados
            }
        }
    });
}

function showRelatedProducts(relatedProducts) {
    let htmlRelatedProducts = '<h4>Productos Relacionados</h4><div class="row">';

    if (relatedProducts && relatedProducts.length > 0) {
        for (let i = 0; i < relatedProducts.length; i++) {
            let product = relatedProducts[i];

            if (product.image) {
                htmlRelatedProducts += `
                    <div class="col-md-6" id="cardsDiv">
                        <div class="card mb-4 box-shadow cursor-pointer" data-product-id="${product.id}">
                            <img class="card-img-top" src="${product.image}" alt="${product.name}">
                            <div class="card-body">
                                <p class="card-text">${product.name}</p>
                            </div>
                        </div>
                    </div>
                `;
            } else {
                console.error(`El producto ${product.name} no tiene imagen definida.`);
            }
        }

        htmlRelatedProducts += '</div>';
    } else {
        htmlRelatedProducts += '<p>No hay productos relacionados</p>';
    }

    document.getElementById("related-products").innerHTML = htmlRelatedProducts;

 
    let productCards = document.querySelectorAll('#related-products .card'); // Agrega un evento de clic a las tarjetas de productos relacionados

    productCards.forEach(card => {
        card.addEventListener('click', function () {

            let selectedProductID = parseInt(card.getAttribute('data-product-id')); // Obtiene el ID del producto relacionado seleccionado
            
            redirectToProduct(selectedProductID); // Redirige al usuario a la página del producto relacionado
        });
    });
}

function redirectToProduct(productID) {
    
    localStorage.setItem("prodID", productID); // Almacena el ID del producto seleccionado en localStorage
    
    window.location.href = "product-info.html"; // Redirige al usuario a la página de detalles del producto
}



function showProductInfo() {
    let htmlContentToAppend = "";

    htmlContentToAppend += `
            <div><h4>${currentProd.name}</h4></div>
            <div class="input-group mb-3 align-items-center">
              <div class="price-fontstyle">${currentProd.currency}&nbsp;${currentProd.cost}</div>
              <span class="text-muted font-small pl-5">&nbsp;&nbsp;&nbsp;| +${currentProd.soldCount} vendidos</span>
            </div>
            <div class="fs-6 pt-1 pb-3">
                <h6><strong>Descripción</strong></h5>${currentProd.description}
            </div>
            <div class="col-12">
                <input type="button" value="Agregar Carrito" id="agregar-carrito" class="btn btn-outline-dark btn-sm">
            </div>
        `;
         //fs-x es como un hx

    document.getElementById("prod-info").innerHTML = htmlContentToAppend;
};

function showImagesHtml() {
    let htmlImages = `
    <div id="ProductCarousel" class="carousel carousel-dark slide img-thumbnail" data-bs-ride="carousel">
        <div class="carousel-indicators">
        `;

    for (let i = 0; i < currentProd.images.length; i++) {
        if (i === 0) {

            htmlImages += '<button type="button" data-bs-target="#ProductCarousel" data-bs-slide-to="' + i + '" class="active" aria-current="true" aria-label="Slide ' + i + '"></button>';
        } else {
            htmlImages += '<button type="button" data-bs-target="#ProductCarousel" data-bs-slide-to="' + i + '" aria-current="true" aria-label="Slide ' + i + '"></button>';
        }
    }

    htmlImages += '</div>' + 
        '<div class="carousel-inner">';

    for (let i = 0; i < currentProd.images.length; i++) {
        if (i === 0) {
            htmlImages += `
            <div class="carousel-item active" data-bs-interval="10000">
            <img class="d-block w-100" src="${currentProd.images[i]}" alt="${currentProd.id + '-' + i}" ></img></div>
            `;
        } else {
            htmlImages += `
            <div class="carousel-item" data-bs-interval="2000">
            <img class="d-block w-100" src="${currentProd.images[i]}" alt="${currentProd.id + '-' + i}" ></img></div>
            `;
        }
    }

    htmlImages += `
        <button class="carousel-control-prev" type="button" data-bs-target="#ProductCarousel" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Anterior</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#ProductCarousel" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Siguiente</span>
        </button>
        </div>
        </div>
        `;

    document.getElementById("prod-carrousel").innerHTML = htmlImages;
};



function showComments() {

    getJSONData(urlCOMENTS).then(function (resultObj) { // Realiza una solicitud GET a la URL de los comentarios
        if (resultObj.status === "ok") {
            let comments = resultObj.data;

         
            let htmlContentToAppend = '<h4>Comentarios</h4>'; // Construye el HTML para mostrar los comentarios

            for (let i = 0; i < comments.length; i++) {
                let comment = comments[i];

              
                let checkedStars = Math.floor(comment.score); // Calcula la cantidad de estrellas llenas y vacías según el puntaje
                let emptyStars = 5 - checkedStars;

                let starContenedor = '<div class="stars-container">'; // Crea un contenedor para las estrellas

                for (let i = 0; i < checkedStars; i++) { // Agrega las estrellas llenas
                    starContenedor += '<span class="fa fa-star checked"></span>';
                }

                for (let i = 0; i < emptyStars; i++) { // Agrega las estrellas vacías
                    starContenedor += '<span class="fa fa-star"></span>';
                }
      
                starContenedor += '</div>'; // Cierra el contenedor de estrellas

                htmlContentToAppend += `
                    <div class="card mb-3">
                        <div class="card-body">
                            <h6 class="card-title">${comment.user}</h6>
                            ${starContenedor}
                            <small class="text-muted">${comment.dateTime}</small>
                            <p class="card-text">${comment.description}</p>
                        </div>
                    </div>
                `;
            }

            document.getElementById("comments-section").innerHTML = htmlContentToAppend; // Agrega los comentarios al elemento con id "comments-section"
        }
    });
}


document.getElementById('btn-comment').addEventListener('click', function () { // Se le da funcionalidad al boton para sumar el comentario

let htmlContentToAppend = '' // Construye el HTML para mostrar los comentarios

// Se toman los valores necesarios para la construccion del comentario 
let newUser = JSON.parse(localStorage.getItem('usuario') || sessionStorage.getItem('usuario'))
const newDateTime = new Date().toISOString()
const newDescription = document.getElementById('comment-product').value;
let starRate = document.getElementById('rate-star').value;

//Repetimos el codigo de la funcion showComments() para mostrar las estrellas
let starContainer = '<div class="stars-container">';
let checkedStars = Math.floor(starRate);
let emptyStars = 5 - checkedStars;

    for (let i = 0; i < checkedStars; i++) {
        starContainer += '<span class="fa fa-star checked"></span>';
    }
    
    for (let i = 0; i < emptyStars; i++) {
        starContainer += '<span class="fa fa-star"></span>';
    }
    
    starContainer += '</div>';
     //Creamos el contenido del comentario dentro del documento HTML
    htmlContentToAppend += `
    <div class="card mb-3">
        <div class="card-body">
            <h6 class="card-title">${newUser.email}</h6>
            ${starContainer}
            <small class="text-muted">${newDateTime}</small>
            <p class="card-text">${newDescription}</p>
        </div>
    </div>
`;

    document.getElementById('comments-section-new').innerHTML += htmlContentToAppend;
    document.getElementById('comment-product').value = ""
    document.getElementById('rate-star').value = "0"
});