
// Configura el arrastre entre Explorar y Favoritos utilizando SortableJS.

export function setupDragAndDrop(
    usersContainer,
    favoritesContainer,
    onDrop,
    onRemove
) {

    // Configuración de la lista de usuarios.
    Sortable.create(usersContainer, {

        group: {
            name: "favspace",
            pull: "clone",
            put: true
        },

        animation: 200,
        sort: false,

        ghostClass: "sortable-ghost",
        chosenClass: "sortable-chosen",

        // Se ejecuta cuando llega un usuario desde otra lista.
        onAdd: (event) => {

            const userId = Number(event.item.dataset.userId);

            onRemove(userId);
        }
    });

    // Configuración de la lista de favoritos.
    Sortable.create(favoritesContainer, {

        group: {
            name: "favspace",
            pull: true,
            put: true
        },

        animation: 200,
        sort: true,

        ghostClass: "sortable-ghost",
        chosenClass: "sortable-chosen",

        // Se ejecuta cuando llega un usuario desde Explorar.
        onAdd: (event) => {

            const userId = Number(event.item.dataset.userId);

            onDrop(userId);
        }
    });

}
