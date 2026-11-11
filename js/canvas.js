// Dibuja con la Canvas API un gráfico de barras con la edad de cada favorito.

const FONT = "'Segoe UI', Arial, sans-serif";

export function drawFavoritesChart(canvas, favorites, maxFavorites) {

    const ctx = canvas.getContext("2d");
    const { width, height } = canvas;

    // Limpiar el lienzo antes de volver a dibujar
    ctx.clearRect(0, 0, width, height);

    // Estado vacío
    if (favorites.length === 0) {
        ctx.fillStyle = "#837aa3";
        ctx.font = `14px ${FONT}`;
        ctx.textAlign = "center";
        ctx.fillText(
            "Agrega favoritos para ver el gráfico",
            width / 2,
            height / 2
        );
        return;
    }

    // Área útil del gráfico
    const padding = { top: 40, right: 20, bottom: 36, left: 20 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    const baseY = padding.top + chartHeight;

    // Cada favorito ocupa un "espacio"; hay tantos como el máximo permitido
    const slotWidth = chartWidth / maxFavorites;
    const barWidth = slotWidth * 0.6;
    const maxAge = Math.max(...favorites.map(user => user.age || 0), 1);

    // Título
    ctx.fillStyle = "#2d2645";
    ctx.font = `bold 14px ${FONT}`;
    ctx.textAlign = "center";
    ctx.fillText("Edad de tus favoritos", width / 2, 20);

    // Espacios libres (borde punteado)
    ctx.strokeStyle = "#b9a4ff";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);

    for (let i = favorites.length; i < maxFavorites; i++) {
        const x = padding.left + i * slotWidth + (slotWidth - barWidth) / 2;
        ctx.strokeRect(x, baseY - chartHeight * 0.25, barWidth, chartHeight * 0.25);
    }

    ctx.setLineDash([]);

    // Línea base
    ctx.strokeStyle = "#e8e3fa";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding.left, baseY);
    ctx.lineTo(width - padding.right, baseY);
    ctx.stroke();

    // Barras
    favorites.forEach((user, index) => {
        const barHeight = ((user.age || 0) / maxAge) * chartHeight;
        const x = padding.left + index * slotWidth + (slotWidth - barWidth) / 2;
        const y = baseY - barHeight;
        const centerX = x + barWidth / 2;

        ctx.fillStyle = "#7555e8";
        ctx.fillRect(x, y, barWidth, barHeight);

        // Valor sobre la barra
        ctx.fillStyle = "#2d2645";
        ctx.font = `bold 12px ${FONT}`;
        ctx.textAlign = "center";
        ctx.fillText(String(user.age ?? "?"), centerX, y - 6);

        // Nombre bajo la barra (recortado para que quepa)
        ctx.font = `11px ${FONT}`;
        ctx.fillText(user.firstName.slice(0, 8), centerX, baseY + 18);
    });
}