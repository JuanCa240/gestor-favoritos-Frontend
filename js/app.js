// Conectar todos los módulos y coordina la aplicación.
import { getUsers } from "./api.js";
import { setupDragAndDrop } from "./dragdrop.js";
import { addFavorite,getFavorites,removeFavorite } from "./favorites.js";

// Obtener el contenedor HTML
const usersContainer = document.querySelector("#users-container");
const favoritesContainer = document.querySelector("#favorites-container");

// crea las tarjetas
let users = [];

// Función para mostrar los usuarios
function renderUsers(users) {
    usersContainer.innerHTML = "";

    users.forEach(user => {

        // Creamos los campos necesarios de los usuarios (tarjeta , imagen , nombre, correo , unicacion)
        const card = document.createElement("article");
        card.classList.add("user-card");

        // Identificador del usuario para reconocerlo durante el arrastre.
        card.dataset.userId = user.id;

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

// Mostrar los usuarios agregados a favoritos.
function renderFavorites() {

    favoritesContainer.innerHTML = "";

    const favorites = getFavorites();

    if (favorites.length === 0) {
        favoritesContainer.textContent =
            "Arrastra aquí los usuarios que quieras guardar.";
        return;
    }

    favorites.forEach(user => {

        const card = document.createElement("article");
        card.classList.add("user-card");

        // Identificar el usuario durante el arrastre.
        card.dataset.userId = user.id;

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

        card.append(image, name, email, location);

        favoritesContainer.appendChild(card);

    });
}

// Procesar el usuario que llega a favoritos.
function handleDrop(userId) {
    const user = users.find(user => user.id === userId);

    if (!user) {
        renderFavorites();
        return;
    }

    const result = addFavorite(user);

    if (result.success) {
        showToast("¡Usuario agregado a favoritos!", "success");
    } else {
        showToast(result.message, "warning");
    }

    renderFavorites();
}

// Eliminar un usuario de favoritos.
function handleRemove(userId) {
    const removed = removeFavorite(userId);

    if (removed) {
        showToast("Usuario eliminado de favoritos.", "info");
    }

    renderUsers(users);
    renderFavorites();
}

// Muestra notificaciones temporales en pantalla sin interrumpir la navegación del usuario.

function showToast(message, type = "success") {
    const container = document.getElementById("toast-container");

    const toast = document.createElement("div");

    toast.className = `toast ${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("ocultar");

        toast.addEventListener("animationend", () => {
            toast.remove();
        }, { once: true });

    }, 2500);
}


// Inicializar aplicación
async function initializeApp() {
    try {
        users = await getUsers();
        renderUsers(users);
        
        renderFavorites();

        setupDragAndDrop(
            usersContainer,
            favoritesContainer,
            handleDrop,
            handleRemove
        );

        console.log("Usuarios cargados correctamente:", users);

    } catch (error) {
        usersContainer.textContent ="No fue posible cargar los usuarios. Intenta nuevamente.";
        console.error("Error al iniciar la aplicación:", error);
    }
}

// Ejecutar aplicación
initializeApp();
