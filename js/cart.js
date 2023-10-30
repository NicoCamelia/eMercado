const USER_ID = 25801;
const CART_URL = `${CART_INFO_URL}${USER_ID}${EXT_TYPE}`;

const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Comprueba si el carrito ya contiene el producto precargado
const peugeot208 = carrito.find(product => product.name === "Peugeot 208");

if (!peugeot208) {
  // Si no existe, se agrega
  const product = {
    id: 50924,
    name: "Peugeot 208",
    count: 1,
    unitCost: 15200,
    currency: "USD",
    image: "img/prod50924_1.jpg",
  };

  carrito.push(product);

  // Actualiza el carrito en el Local Storage
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

document.addEventListener('DOMContentLoaded', async function () {
  try {
    const response = await fetch(CART_URL);

    if (!response.ok) {
      throw new Error(`Error en la petición: ${response.status}`);
    }

    const cartData = await response.json();

    displayCart(cartData);
  } catch (error) {
    console.error('Error al obtener el carrito:', error);
  }
  
  displayCart();
});

function displayCart(cartData) {
  const cartTable = document.getElementById('cart-table-body');
  cartTable.innerHTML = ''; // Limpia contenido previo

  // Se obtienen los datos del carrito desde el localStorage
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

  // Itera sobre los productos en el carrito y se muestran en la tabla
  carrito.forEach(product => {
    let currencySymbol = product.currency;

    if (product.currency === 'UYU') {
      currencySymbol = 'USD';
    }
    const unitCost = product.currency === 'UYU' ? (product.unitCost / 39).toFixed(1) : product.unitCost.toFixed(1);
    const subtotal = (product.count * unitCost).toFixed(1);
  
    const rowHtml = `
      <tr>
        <td id="logo"><img src="${product.image}" alt="Producto" style="max-width: 110px;"></td>
        <td id="nombre">${product.name}</td>
        <td id="precio">${currencySymbol + ' '}<span class="precio">${unitCost}</span></td>
        <td><input type="number" class="form-control cantidad" style="width: 10vh;" min="1" value="${product.count}" onchange="recalcular();"></td>
        <td><b>${currencySymbol + ' '}<span class="subtotal">${subtotal}</span></b></td>
        <td>
          <a href="#" class="eliminar-articulo" data-product-id="${product.id}">
            <i class="fas fa-trash-alt text-danger"></i>
          </a>
        </td>
      </tr>
    `;
  
    cartTable.innerHTML += rowHtml;
  });
  

  // Agrega de nuevo los manejadores de eventos para los botones de eliminar
  const eliminarBotones = document.querySelectorAll('.eliminar-articulo');
  eliminarBotones.forEach(boton => {
    boton.addEventListener('click', function() {
      eliminarProducto(this);
    });
  });
}

function eliminarProducto(botonEliminar) {
  const fila = botonEliminar.parentElement.parentElement; // Obtiene la fila
  const nombreProducto = fila.querySelector('#nombre').innerText; // Obtiene el nombre del producto

  // Encuentra y elimina el producto del carrito
  const indice = carrito.findIndex(producto => producto.name === nombreProducto);
  if (indice !== -1) {
    carrito.splice(indice, 1);
  }

  // Actualiza el carrito en el Local Storage
  localStorage.setItem('carrito', JSON.stringify(carrito));

  // Actualiza la vista del carrito
  displayCart();
  recalcular();
}

function recalcular() {
  let cantidad = document.getElementsByClassName('cantidad');
  let resultado = document.getElementsByClassName('subtotal');
  let precio = document.getElementsByClassName('precio');

  for (let i = 0; i < precio.length; i++) {
    let cantidadValue = parseFloat(cantidad[i].value);
    let precioValue = parseFloat(precio[i].innerHTML);
    if (isNaN(cantidadValue)) {
      cantidadValue = 1;
    }
    resultado[i].innerHTML = (cantidadValue * precioValue).toFixed(2);
  }
}

// funcion que calcula el subtotal final sumando el precio de todos los articulos en el carrito
function calcularSubTotalFinal() {
  const subtotales = document.getElementsByClassName('subtotal');
  let finalSubTotal = 0;

  for (let i = 0; i < subtotales.length; i++) {
    finalSubTotal += parseFloat(subtotales[i].textContent);
  }

  const subTotalFinal = document.getElementById('subTotalFinal');
  subTotalFinal.textContent = `USD ${finalSubTotal.toFixed(2)}`;
};

// funcion para calcular el porcentaje agregado segun el tipo de envio seleccionado
function calcularEnvio() {
  const envioPremium = document.getElementById('premiumEnvio');
  const envioExpress = document.getElementById('expressEnvio');
  const envioStandard = document.getElementById('standardEnvio');
  const finalSubTotal = document.getElementById('subTotalFinal').textContent.replace('USD', '').trim();
  let envioPorcentaje = 0;
  
  if (envioPremium.checked) {
    envioPorcentaje = 15;
  } else if (envioExpress.checked) {
    envioPorcentaje = 7;
  } else if (envioStandard.checked) {
    envioPorcentaje = 5;
  }
  
    const envioCosto = (finalSubTotal * envioPorcentaje) / 100;
    const costoEnvio = document.getElementById('costoEnvio');
    costoEnvio.textContent = `USD ${envioCosto.toFixed(2)}`;
};

function precioFinal() {
  const precioFinalElement = document.getElementById('precioFinal');
  const finalSubTotal = parseFloat(document.getElementById('subTotalFinal').textContent.replace('USD', '').trim());
  const costoEnvio = parseFloat(document.getElementById('costoEnvio').textContent.replace('USD', '').trim());

  const total = finalSubTotal + costoEnvio;
  precioFinalElement.textContent = `USD ${total.toFixed(2)}`;
}

const creditCardCheckbox = document.getElementById("creditCardRadio");
const bankTransferCheckbox = document.getElementById("bankTransferRadio");
const creditCardFields = document.getElementById("creditCardFields");
const bankTransferFields = document.getElementById("bankTransferFields");
const saveButton = document.getElementById("saveButton");

creditCardCheckbox.addEventListener("change", function () {
  if (creditCardCheckbox.checked) {
    // Habilitar los campos de tarjeta de crédito
    enablePaymentFields(creditCardFields);
    // Deshabilitar los campos de transferencia bancaria
    disablePaymentFields(bankTransferFields);
  } else {
    // Si el checkbox no está marcado, deshabilitar los campos de tarjeta de crédito
    disablePaymentFields(creditCardFields);
  }
});

// Escuchar el evento 'change' del checkbox de transferencia bancaria
bankTransferCheckbox.addEventListener("change", function () {
  // Si el checkbox está marcado
  if (bankTransferCheckbox.checked) {
    // Habilitar los campos de transferencia bancaria
    enablePaymentFields(bankTransferFields);
    // Deshabilitar los campos de tarjeta de crédito
    disablePaymentFields(creditCardFields);
  } else {
    // Si el checkbox no está marcado, deshabilitar los campos de transferencia bancaria
    disablePaymentFields(bankTransferFields);
  }
});

saveButton.addEventListener("click", function () {
  // Obtiene la opción de pago seleccionada
  const selectedOption = document.querySelector('input[name="paymentOption"]:checked');

  if (selectedOption) {
    if (selectedOption.value === "creditCard") {
      // Verifica la validez del formulario de pago
      if (paymentForm.checkValidity()) {
        // Mostrar texto de tarjeta de crédito seleccionada
        selectedPaymentText.textContent = "Tarjeta de Crédito";
      } else {
        // Mostrar mensajes de error del formulario
        paymentForm.reportValidity();
        return;
      }
    } 
    else if (selectedOption.value === "bankTransfer") {
      const accountNumberInput = document.getElementById("accountNumber");
      const accountNumber = accountNumberInput.value;

      // Validar si el número de cuenta está vacío
      if (accountNumber.trim() === "") {
        // Mostrar mensaje de error y detener el proceso
        accountNumberInput.setCustomValidity("Completa este campo");
        accountNumberInput.reportValidity();
        return;
      } else {
        // Mostrar texto de transferencia bancaria seleccionada
        selectedPaymentText.textContent = "Transferencia Bancaria";
      }
    }

    // Ocultar el modal de pago y eliminar el fondo de pantalla modal
    document.getElementById("paymentModal").style.display = "none";
    document.querySelector(".modal-backdrop").remove();

    // Deshabilitar todos los campos de pago
    disablePaymentFields();
  } else {
    // Si no se ha seleccionado ninguna opción de pago, mostrar mensaje de alerta
    const alertElement = document.createElement("div");
    alertElement.className = "alert alert-danger";
    alertElement.textContent = "Seleccione una opción de pago";
    const modalBody = document.querySelector(".modal-body");
    modalBody.appendChild(alertElement);
    setTimeout(function () {
      modalBody.removeChild(alertElement);
    }, 2000);
  }
});

// Función para habilitar campos de pago
function enablePaymentFields(fieldGroup) {
  // Iterar sobre los campos y remover el atributo 'disabled'
  fieldGroup.querySelectorAll(".payment-field").forEach(function (field) {
    field.removeAttribute("disabled");
  });
}

// Función para deshabilitar campos de pago
function disablePaymentFields(fieldGroup) {
  // Itera sobre los campos y agregar el atributo 'disabled'
  fieldGroup.querySelectorAll(".payment-field").forEach(function (field) {
    field.setAttribute("disabled", true);
  });
}

  // Obtén el elemento de entrada
  const expirationDateInput = document.getElementById("expirationDate");

  // Agrega un event listener para el evento "input"
  expirationDateInput.addEventListener("input", function() {
    // Elimina cualquier carácter que no sea un dígito
    this.value = this.value.replace(/\D/g, "");

    // Asegúrate de que no haya más de 4 caracteres
    if (this.value.length > 4) {
      this.value = this.value.slice(0, 4);
    }

    // Agrega la barra "/" después de los primeros 2 caracteres del mes
    if (this.value.length >= 2) {
      this.value = this.value.slice(0, 2) + "/" + this.value.slice(2);
    }
  });

  // Agrega un event listener para el evento "change"
  expirationDateInput.addEventListener("change", function() {
    // Verifica si el campo tiene exactamente 4 caracteres
    if (this.value.length !== 5) {
      Swal.fire(
        'Error',
        'El campo debe tener 4 caracteres (MM/AA).',
        'error'
    );
      this.value = "";
    }
  });



setInterval(precioFinal, 100);
setInterval(calcularEnvio, 100);
setInterval(calcularSubTotalFinal, 100);

document.addEventListener('DOMContentLoaded', function () {
  const checkoutForm = document.getElementById('checkoutForm');

  checkoutForm.addEventListener('submit', event => { // Agrega un evento submit al formulario
    event.preventDefault(); // Evita el envío automático del formulario

// Realiza la validación utilizando checkValidity() en los elementos del formulario
    const formElements = checkoutForm.elements;
    let validity = true;

    for (const element of formElements) {
      if (element.type !== 'submit') {
        if (!element.checkValidity()) {
          validity = false;
          break; // Para la validación si se encuentra un campo inválido
        }
      }
    }
    
// Verifica la forma de pago, los campos de radio no pueden estar sin seleccionar
    const formaPago = document.querySelector('input[name="paymentOption"]:checked');
    if (!formaPago) {
      validity = false;
      Swal.fire(
        'Error',
        'Por favor, complete todos los campos de la forma de pago.',
        'error'
    )};

    if (validity) { // Si el formulario es válido, puedes proceder con la compra
      Swal.fire(
        'Compra exitosa',
        'Hemos recibido su pedido. Le enviaremos una confirmación por correo electrónico con los detalles de envío en breve',
        'success'
      );
    }
  });

});