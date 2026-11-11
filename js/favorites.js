// Gestiona los favoritos agregando, eliminando y validación


/* =========================================
   MÓDULO DE FAVORITOS
========================================= */

// Arreglo donde almacenaremos los favoritos
let favorites = [];

// Cantidad máxima de favoritos permitidos
const MAX_FAVORITES = 6;


/* =========================================
   AGREGAR FAVORITO
========================================= */

export function addFavorite(user) {

    // Validar que el usuario exista
    if (!user || !user.id) {
        return {
            success: false,
            message: "Usuario no válido."
        };
    }

    // Evitamos favoritos duplicados
    const alreadyExists = favorites.some(
        favorite => favorite.id === user.id
    );

    if (alreadyExists) {
        return {
            success: false,
            message: "Este usuario ya está en tus favoritos."
        };
    }

    // Verificar límite de favoritos
    if (favorites.length >= MAX_FAVORITES) {
        return {
            success: false,
            message: "Has alcanzado el límite de " + MAX_FAVORITES + " favoritos."
        };
    }

    // Agregar usuario
    favorites.push(user);

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

    // .filter: Crea un nuevo arreglo excluyendo al usuario que queremos eliminar.
    favorites = favorites.filter(favorite => favorite.id !== Number(userId));
    return favorites.length < previousLength;

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
