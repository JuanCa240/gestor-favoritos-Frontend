
// Gestiona los favoritos: agregar, eliminar, validar y consultar.

// Importar las funciones encargadas del almacenamiento.
import { loadFavorites, saveFavorites } from "./storage.js";


/* =========================================
   CONFIGURACIÓN
========================================= */

// Cantidad máxima de favoritos permitidos.
export const MAX_FAVORITES = 6;


/* =========================================
   ESTADO INICIAL
========================================= */

// Recuperar los favoritos guardados al iniciar la aplicación.
let favorites = loadFavorites(MAX_FAVORITES);


/* =========================================
   AGREGAR FAVORITO
========================================= */

export function addFavorite(user) {

    // Validar que el usuario exista.
    if (!user || !user.id) {
        return {
            success: false,
            message: "Usuario no válido."
        };
    }

    // Evitar favoritos duplicados.
    const alreadyExists = favorites.some(
        favorite => favorite.id === user.id
    );

    if (alreadyExists) {
        return {
            success: false,
            message: "Este usuario ya está en tus favoritos."
        };
    }

    // Verificar el límite de favoritos.
    if (favorites.length >= MAX_FAVORITES) {
        return {
            success: false,
            message: "Has alcanzado el límite de " + MAX_FAVORITES + " favoritos."
        };
    }

    // Agregar el usuario y guardar los cambios.
    favorites.push(user);
    saveFavorites(favorites);

    return {
        success: true,
        message: "¡Usuario agregado a favoritos!"
    };
}


/* =========================================
   ELIMINAR FAVORITO
========================================= */

export function removeFavorite(userId) {

    const previousLength = favorites.length;

    // Excluir del arreglo al usuario que queremos eliminar.
    favorites = favorites.filter(
        favorite => favorite.id !== Number(userId)
    );

    const removed = favorites.length < previousLength;

    // Guardar los cambios si se eliminó algún favorito.
    if (removed) {
        saveFavorites(favorites);
    }

    return removed;
}


/* =========================================
   OBTENER TODOS LOS FAVORITOS
========================================= */

export function getFavorites() {

    return [...favorites];
}


/* =========================================
   OBTENER CANTIDAD DE FAVORITOS
========================================= */

export function getFavoritesCount() {

    return favorites.length;
}
