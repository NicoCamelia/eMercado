const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
const PRODUCT_INFO_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/";
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
const EXT_TYPE = ".json";

let showSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "none";
}

let getJSONData = function (url) {
  let result = {};
  showSpinner();
  return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw Error(response.statusText);
      }
    })
    .then(function (response) {
      result.status = 'ok';
      result.data = response;
      hideSpinner();
      return result;
    })
    .catch(function (error) {
      result.status = 'error';
      result.data = error;
      hideSpinner();
      return result;
    });
}

function verificarAutenticacion() {
  // Verifica si el usuario está logeado
  if (!localStorage.getItem("usuario") && !sessionStorage.getItem("usuario")) {
    // Si no lo está, redirige al login
    window.location.href = "login.html";
  }
}


document.addEventListener("DOMContentLoaded", function () {

  verificarAutenticacion();

  // Se obtiene el nombre de usuario almacenado
  let userName = "";
  if (!localStorage.getItem("usuario")) {
    userName = JSON.parse(sessionStorage.getItem('usuario'));
  } else {
    userName = JSON.parse(localStorage.getItem('usuario'));
  }

  // Se crea el contenido HTML del menú desplegable 
  document.getElementById('dropmenu').innerHTML = `<div class="dropdown">
                                                 <button class="btn btn-secondary dropdown-toggle nav-link" type="button" data-bs-toggle="dropdown" aria-expanded="false" id="emailMenu">
                                                 <img class="userIcon" src="icons/user-regular.svg" alt="Usuario"></i>${userName.email}
                                                 </button>
                                                   <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                                     <li><a class="dropdown-item" href="my-profile.html">Mi perfil</a></li>
                                                     <li><a class="dropdown-item" href="cart.html">Mi carrito</a></li>
                                                    <li><a class="dropdown-item" id="logout" href="#">Cerrar sesión</a></li>
                                                    <li><div class="dropdown-item"><label id="switch">
                                                    <input type="checkbox">
                                                    <span class="slider round"></span>
                                                </label></div></li>
                                                   </ul>
                                                </div>`;

  // Evento para cerrar sesión
  document.getElementById('logout').addEventListener('click', () => {
    let swalScript = document.createElement('script');
    swalScript.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11';
    document.body.appendChild(swalScript);

    swalScript.onload = function () {
      Swal.fire({
        title: 'Cerrar sesión',
        text: '¿Estás seguro de que deseas cerrar sesión?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
        // En caso de confirmar el cierre de sesión se borran los datos de local/session storage y redirige al login
          localStorage.removeItem('usuario') || sessionStorage.removeItem('usuario');
          location.href = 'login.html';
        }
      });
    };
  });

  // Configuración del interruptor de modo oscuro
  const colorSwitch = document.querySelector('#switch input[type="checkbox"]');
  function cambiaTema(ev){
      if(ev.target.checked){
          document.documentElement.setAttribute('tema', 'dark');
          // Guarda la preferencia en localStorage cuando se active el modo oscuro
          localStorage.setItem('modoNoche', 'true');
      } else {
          document.documentElement.setAttribute('tema', 'light');
          // Guarda la preferencia en localStorage cuando se desactive el modo oscuro
          localStorage.setItem('modoNoche', 'false');
      }
  }

  // Verifica la preferencia almacenada en localStorage
  const modoNocheGuardado = localStorage.getItem('modoNoche');

  // Aplica el modo oscuro si está activo
  if (modoNocheGuardado === 'true') {
    document.documentElement.setAttribute('tema', 'dark');
    // Asegura que el interruptor esté marcado
    colorSwitch.checked = true;
  }

  // Evento para cambiar el tema al activar/desactivar el interruptor
  colorSwitch.addEventListener('change', cambiaTema);
});
