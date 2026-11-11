// Consultar los usuarios externos

const API_URL = "https://dummyjson.com/users?limit=12";

// Obtener usuarios desde la API
export async function getUsers() {

    try {

        const response = await fetch(API_URL);

        // Verificar que la petición haya sido exitosa
        if (!response.ok) {
            throw new Error("No fue posible obtener los usuarios");
        }

        // Convertir la respuesta a JSON
        const data = await response.json();

        // Retornar solamente el arreglo de usuarios
        return data.users;

    } catch (error) {
        console.error("Error al consultar la API:", error);
        throw error;
    }
}
