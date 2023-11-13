// Se espera a que el contenido del DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", function () {
    // Obtención de elementos del DOM
    const guardarDatosButton = document.getElementById("guardarDatos");
    const profileTelInput = document.getElementById("profiletel"); // Debe ser colocado afuera de guardarDatosButton porque de lo contrario no se puede escuchar el evento input.

    // Evento click para el botón "Guardar Datos"
    guardarDatosButton.addEventListener("click", function () {
        // Obténer de valores de los campos de entrada
        const profileName1 = document.getElementById("profilename1").value;
        const profileName2 = document.getElementById("profilename2").value;
        const profileSurname1 = document.getElementById("profilesurname1").value;
        const profileSurname2 = document.getElementById("profilesurname2").value;
        const profileMail = document.getElementById("profilemail").value;
        const profileImageInput = document.getElementById("profileimage");
        const profileImagePreview = document.getElementById("profileimage-preview");

        // Validacion de campos con (*)
        if (profileName1.trim() === "" || profileSurname1.trim() === "" || profileMail.trim() === "") {
            alert("Los campos marcados con (*) son obligatorios. Completa todos los campos.");
            return;
        }

        // Validacion especifica para correo electronico
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailRegex.test(profileMail)) {
            alert("Por favor, ingresar una dirección de correo electrónico válida.");
            return;
        }

        // Restringir el campo de teléfono a números
        const profileTel = profileTelInput.value.replace(/[^0-9+]/g, ""); // Elimina todo lo que no sea un número

        // Actualiza el valor en el campo de teléfono
        profileTelInput.value = profileTel;

        // Creando objeto
        const usuario = {
            profilename: profileName1,
            name2: profileName2,
            surname1: profileSurname1,
            surname2: profileSurname2,
            email: profileMail,
            tel: profileTel
        };

        // Convierte el objeto usuario a cadena JSON
        const usuarioJSON = JSON.stringify(usuario);

        // Elimina el usuario actual
        localStorage.removeItem("usuario");

        // Guardar imagen seleccionada
        const profileImageFile = profileImageInput.files[0];
        if (profileImageFile) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const imageDataURL = e.target.result;
                localStorage.setItem("profileImage", imageDataURL);
                profileImagePreview.src = imageDataURL;
            };
            reader.readAsDataURL(profileImageFile);
        }

        // Almacena en el almacenamiento local
        localStorage.setItem("usuario", usuarioJSON);

        // Notifica al usuario que los datos se han guardado con éxito
        alert("Los datos se han guardado con éxito en el almacenamiento local.");
    });
        // Escucha el evento input en el campo de teléfono para evitar caracteres no numéricos
        profileTelInput.addEventListener("input", function () {
        this.value = this.value.replace(/[^0-9+]/g, ""); // Permite números y el carácter "+", elimina todo lo demás
    });

    //obtiene los datos del usuario logeado y los coloca en sus campos determinados
    const profileNameprecargado = document.getElementById("profilename1");
    const profileMailprecargado = document.getElementById("profilemail");
    const usuarioObj = JSON.parse(localStorage.getItem('usuario'));
    profileNameprecargado.value = usuarioObj.profilename;
    profileMailprecargado.value = usuarioObj.email;

    //obtiene los datos adicionales y los coloca en sus campos determinados
    const profileName2 = document.getElementById("profilename2")
    const profileSurname1 = document.getElementById("profilesurname1");
    const profileSurname2 = document.getElementById("profilesurname2");
    profileName2.value = usuarioObj.name2.replace("undefined", "");
    profileSurname1.value = usuarioObj.surname1;
    profileSurname2.value = usuarioObj.surname2;
    profileTelInput.value = usuarioObj.tel;

    //obtiene la imagen del localstorage y la coloca en su campo determinado
    const imagenPerfil = document.getElementById("profileimage-preview");
    const storedImageDataURL = localStorage.getItem("profileImage");
    if (storedImageDataURL) {
        imagenPerfil.src = storedImageDataURL;
    };
});