// Gestiona los favoritos: agregar, eliminar, validar y guardar en LocalStorage.

/* =========================================
   CONFIGURACIÓN
========================================= */

// Cantidad máxima de favoritos permitidos
export const MAX_FAVORITES = 6;

// Clave con la que se guarda la información en LocalStorage
const STORAGE_KEY = "favspace:favorites";


/* =========================================
   LOCALSTORAGE
========================================= */

// Lee los favoritos guardados. Si no hay datos o están dañados, devuelve [].
function loadFavorites() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);

        if (!stored) {
            return [];
        }

        const parsed = JSON.parse(stored);

        if (!Array.isArray(parsed)) {
            return [];
        }

        // Validamos cada usuario y respetamos el límite máximo
        return parsed
            .filter(user => user && user.id)
            .slice(0, MAX_FAVORITES);

    } catch (error) {
        console.error("No fue posible leer los favoritos guardados:", error);
        return [];
    }
}

// Guarda el arreglo actual de favoritos.
function saveFavorites() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
        console.error("No fue posible guardar los favoritos:", error);
    }
}

// Arreglo donde almacenamos los favoritos (se carga al iniciar)
let favorites = loadFavorites();


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

    // Agregar usuario y persistir
    favorites.push(user);
    saveFavorites();

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

    const removed = favorites.length < previousLength;

    if (removed) {
        saveFavorites();
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