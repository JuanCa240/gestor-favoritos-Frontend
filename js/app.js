// Conectar todos los módulos y coordina la aplicación.

import { getUsers } from "./api.js";

// Obtener el contenedor HTML
const usersContainer = document.querySelector("#users-container");

// Función para mostrar los usuarios
function renderUsers(users) {
    usersContainer.innerHTML = "";

    users.forEach(user => {

        // Creamos los campos necesarios de los usuarios (tarjeta , imagen , nombre, correo , unicacion)
        const card = document.createElement("article");
        card.classList.add("user-card");

        const image = document.createElement("img");
        image.src = user.image;
        image.alt = `Fotografía de ${user.firstName}`;

        const name = document.createElement("h3");
        name.textContent = `${user.firstName} ${user.lastName}`;

        const email = document.createElement("p");
        email.textContent = user.email;

        const location = document.createElement("p");
        location.textContent =
            `${user.address.city}, ${user.address.country}`;

        // Agregar elementos a la tarjeta
        card.append(image, name, email, location);

        // Agregar tarjeta al contenedor
        usersContainer.appendChild(card);

    });

}

// Inicializar aplicación
async function initializeApp() {
    try {
        const users = await getUsers();
        renderUsers(users);
        console.log("Usuarios cargados correctamente:", users);

    } catch (error) {
        usersContainer.textContent ="No fue posible cargar los usuarios. Intenta nuevamente.";
        console.error("Error al iniciar la aplicación:", error);
    }
}

// Ejecutar aplicación
initializeApp();
