// Gestiona el almacenamiento y recuperación de favoritos mediante LocalStorage.

// Clave utilizada para identificar los favoritos guardados.
const STORAGE_KEY = "favspace:favorites";

/* =========================================
   RECUPERAR FAVORITOS
========================================= */

// Obtiene los favoritos guardados en el navegador.
export function loadFavorites(maxFavorites) {

    try {
        const stored = localStorage.getItem(STORAGE_KEY);

        // Si no existen favoritos guardados, devuelve un arreglo vacío.
        if (!stored) {
            return [];
        }

        const parsed = JSON.parse(stored);

        // Verificar que los datos recuperados sean un arreglo.
        if (!Array.isArray(parsed)) {
            return [];
        }

        // Validar los usuarios y respetar el límite permitido.
        return parsed
            .filter(user => user && user.id)
            .slice(0, maxFavorites);

    } catch (error) {
        console.error("No fue posible recuperar los favoritos:", error);
        return [];
    }
}


/* =========================================
   GUARDAR FAVORITOS
========================================= */

// Guarda el arreglo de favoritos en el almacenamiento del navegador.
export function saveFavorites(favorites) {

    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(favorites)
        );

        return true;

    } catch (error) {
        console.error("No fue posible guardar los favoritos:", error);
        return false;
    }
}
