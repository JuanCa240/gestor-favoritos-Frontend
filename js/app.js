// Conectar todos los módulos y coordina la aplicación.
import { getUsers } from "./api.js";
import { setupDragAndDrop } from "./dragdrop.js";
import { addFavorite,getFavorites,removeFavorite } from "./favorites.js";

// Obtener el contenedor HTML
const usersContainer = document.querySelector("#users-container");
const favoritesContainer = document.querySelector("#favorites-container");

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

        // Permitir arrastrar la tarjeta.
        card.draggable = true;

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

        // Permitir arrastrar el favorito.
        card.draggable = true;

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

// Procesar el usuario que soltamos en favoritos.
function handleDrop(userId) {

    const user = users.find(user => user.id === userId);

    if (!user) return;

    const result = addFavorite(user);

    alert(result.message);

    if (result.success) {
        renderFavorites();
    }
}

// Eliminar un usuario de favoritos al devolverlo a Explorar.
function handleRemove(userId) {

    const removed = removeFavorite(userId);

    if (removed) {
        renderFavorites();
        alert("Usuario eliminado de favoritos.");
    }
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
