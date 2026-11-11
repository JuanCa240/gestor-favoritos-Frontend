// Maneja la Geolocation API y los cálculos de distancia con los usuarios.

/* =========================================
   OBTENER UBICACIÓN DEL NAVEGADOR
========================================= */

// Convierte getCurrentPosition (callbacks) en una promesa.
export function getUserPosition() {
    return new Promise((resolve, reject) => {

        if (!("geolocation" in navigator)) {
            reject(new Error("GEOLOCATION_UNSUPPORTED"));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    accuracy: position.coords.accuracy
                });
            },
            (error) => reject(error),
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000
            }
        );
    });
}


/* =========================================
   DISTANCIA ENTRE DOS PUNTOS (HAVERSINE)
========================================= */

function toRadians(degrees) {
    return degrees * Math.PI / 180;
}

// Recibe dos objetos { lat, lng } y devuelve la distancia en kilómetros.
export function getDistanceKm(pointA, pointB) {
    const EARTH_RADIUS_KM = 6371;

    const dLat = toRadians(pointB.lat - pointA.lat);
    const dLng = toRadians(pointB.lng - pointA.lng);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRadians(pointA.lat)) *
        Math.cos(toRadians(pointB.lat)) *
        Math.sin(dLng / 2) ** 2;

    return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}


/* =========================================
   USUARIO MÁS CERCANO
========================================= */

// Devuelve { user, distance } o null si ningún usuario tiene coordenadas.
export function findNearestUser(position, users) {
    let nearest = null;

    users.forEach(user => {
        const coordinates = user.address?.coordinates;

        if (!coordinates) {
            return;
        }

        const distance = getDistanceKm(position, coordinates);

        if (!nearest || distance < nearest.distance) {
            nearest = { user, distance };
        }
    });

    return nearest;
}


/* =========================================
   MENSAJES DE ERROR
========================================= */

export function getLocationErrorMessage(error) {
    switch (error.code) {
        case 1: // PERMISSION_DENIED
            return "Permiso de ubicación denegado.";
        case 2: // POSITION_UNAVAILABLE
            return "No fue posible determinar tu ubicación.";
        case 3: // TIMEOUT
            return "La solicitud de ubicación tardó demasiado.";
        default:
            return "Tu navegador no soporta geolocalización.";
    }
}