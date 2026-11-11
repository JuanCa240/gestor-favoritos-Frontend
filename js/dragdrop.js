
// Configura el comportamiento de arrastrar y soltar.

export function setupDragAndDrop(
    usersContainer,
    favoritesContainer,
    onDrop,
    onRemove
) {

    // Permite arrastrar tarjetas desde Explorar.
    usersContainer.addEventListener("dragstart", (event) => {
        const card = event.target.closest(".user-card");

        if (!card) return;

        event.dataTransfer.setData("text/plain", card.dataset.userId);
        event.dataTransfer.effectAllowed = "move";

        card.classList.add("dragging");
    });

    // Permite arrastrar tarjetas desde Favoritos.
    favoritesContainer.addEventListener("dragstart", (event) => {
        const card = event.target.closest(".user-card");

        if (!card) return;

        event.dataTransfer.setData("text/plain", card.dataset.userId);
        event.dataTransfer.effectAllowed = "move";

        card.classList.add("dragging");
    });

    // Quita el efecto visual al terminar el arrastre.
    [usersContainer, favoritesContainer].forEach(container => {
        container.addEventListener("dragend", (event) => {
            const card = event.target.closest(".user-card");

            if (card) {
                card.classList.remove("dragging");
            }
        });
    });

    // Permite soltar elementos en ambas zonas.
    [usersContainer, favoritesContainer].forEach(container => {

        container.addEventListener("dragover", (event) => {
            event.preventDefault();

            event.dataTransfer.dropEffect = "move";
            container.classList.add("drag-over");
        });

        container.addEventListener("dragleave", (event) => {
            if (!container.contains(event.relatedTarget)) {
                container.classList.remove("drag-over");
            }
        });
    });

    // Soltar un usuario en Favoritos.
    favoritesContainer.addEventListener("drop", (event) => {
        event.preventDefault();

        favoritesContainer.classList.remove("drag-over");

        const userId = event.dataTransfer.getData("text/plain");

        if (userId) {
            onDrop(Number(userId));
        }
    });

    // Soltar un favorito de regreso a Explorar.
    usersContainer.addEventListener("drop", (event) => {
        event.preventDefault();

        usersContainer.classList.remove("drag-over");

        const userId = event.dataTransfer.getData("text/plain");

        if (userId) {
            onRemove(Number(userId));
        }
    });
}
