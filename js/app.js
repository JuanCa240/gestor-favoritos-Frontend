// Conectar todos los módulos y coordina la aplicación.
import { getUsers } from "./api.js";
import { setupDragAndDrop } from "./dragdrop.js";
import {
    addFavorite,
    getFavorites,
    getFavoritesCount,
    removeFavorite,
    MAX_FAVORITES
} from "./favorites.js";
import {
    getUserPosition,
    getDistanceKm,
    findNearestUser,
    getLocationErrorMessage
} from "./location.js";
import { drawFavoritesChart } from "./canvas.js";

// Obtener los elementos HTML
const usersContainer = document.querySelector("#users-container");
const favoritesContainer = document.querySelector("#favorites-container");
const locationBtn = document.querySelector("#get-location-btn");
const userLocation = document.querySelector("#user-location");
const locationStatus = document.querySelector("#location-status");
const favoritesCount = document.querySelector("#favorites-count");
const favoritesChart = document.querySelector("#favorites-chart");

// Estado de la aplicación
let users = [];
let currentPosition = null;


/* =========================================
   TARJETAS
========================================= */

// Crea una tarjeta de usuario (se reutiliza en Explorar y Favoritos).
function createUserCard(user) {

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
    location.textContent = `${user.address.city}, ${user.address.country}`;

    card.append(image, name, email, location);

    // Si ya conocemos la ubicación del visitante, mostramos la distancia.
    if (currentPosition && user.address.coordinates) {
        const km = getDistanceKm(currentPosition, user.address.coordinates);

        const distance = document.createElement("p");
        distance.classList.add("distance");
        distance.textContent =
            `A ${Math.round(km).toLocaleString("es-CO")} km de ti`;

        card.append(distance);
    }

    return card;
}

// Mostrar los usuarios disponibles.
function renderUsers(users) {
    usersContainer.innerHTML = "";

    users.forEach(user => {
        usersContainer.appendChild(createUserCard(user));
    });
}

// Mostrar los usuarios agregados a favoritos.
function renderFavorites() {

    favoritesContainer.innerHTML = "";

    // Cada vez que cambian los favoritos, actualizamos contador y gráfico.
    updateStatistics();

    const favorites = getFavorites();

    if (favorites.length === 0) {
        const message = document.createElement("p");
        message.classList.add("empty-message");
        message.textContent = "Arrastra aquí los usuarios que quieras guardar.";
        favoritesContainer.appendChild(message);
        return;
    }

    favorites.forEach(user => {
        favoritesContainer.appendChild(createUserCard(user));
    });
}


/* =========================================
   ESTADÍSTICAS (CANVAS)
========================================= */

function updateStatistics() {
    favoritesCount.textContent = getFavoritesCount();

    drawFavoritesChart(favoritesChart, getFavorites(), MAX_FAVORITES);
}


/* =========================================
   DRAG AND DROP
========================================= */

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


/* =========================================
   UBICACIÓN (GEOLOCATION API)
========================================= */

// Muestra las coordenadas y el usuario más cercano.
function renderLocation() {

    userLocation.innerHTML = "";

    const lines = [
        `Latitud: ${currentPosition.lat.toFixed(5)}`,
        `Longitud: ${currentPosition.lng.toFixed(5)}`,
        `Precisión aproximada: ${Math.round(currentPosition.accuracy)} m`
    ];

    const nearest = findNearestUser(currentPosition, users);

    if (nearest) {
        const { user, distance } = nearest;

        lines.push(
            `Usuario más cercano: ${user.firstName} ${user.lastName} ` +
            `(${user.address.city}, a ${Math.round(distance).toLocaleString("es-CO")} km)`
        );
    }

    lines.forEach(text => {
        const paragraph = document.createElement("p");
        paragraph.textContent = text;
        userLocation.appendChild(paragraph);
    });

    locationStatus.textContent = "Ubicación: activa";
}

// Pide la ubicación al navegador y actualiza la interfaz.
async function handleGetLocation() {

    locationBtn.disabled = true;
    locationBtn.textContent = "Obteniendo ubicación...";

    try {
        currentPosition = await getUserPosition();

        renderLocation();

        // Volvemos a dibujar las tarjetas para mostrar las distancias.
        renderUsers(users);
        renderFavorites();

        showToast("¡Ubicación obtenida correctamente!", "success");

    } catch (error) {
        const message = getLocationErrorMessage(error);

        locationStatus.textContent = "Ubicación: no disponible";
        userLocation.textContent = message;

        showToast(message, "warning");
        console.error("Error de geolocalización:", error);

    } finally {
        locationBtn.disabled = false;
        locationBtn.textContent = "Obtener mi ubicación";
    }
}


/* =========================================
   NOTIFICACIONES
========================================= */

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


/* =========================================
   INICIALIZACIÓN
========================================= */

async function initializeApp() {

    // El botón de ubicación funciona aunque falle la API.
    locationBtn.addEventListener("click", handleGetLocation);

    try {
        users = await getUsers();
        renderUsers(users);

        // Los favoritos se cargan desde LocalStorage (módulo favorites.js).
        renderFavorites();

        setupDragAndDrop(
            usersContainer,
            favoritesContainer,
            handleDrop,
            handleRemove
        );

        console.log("Usuarios cargados correctamente:", users);

    } catch (error) {
        usersContainer.textContent = "No fue posible cargar los usuarios. Intenta nuevamente.";
        console.error("Error al iniciar la aplicación:", error);
    }
}

// Ejecutar aplicación
initializeApp();