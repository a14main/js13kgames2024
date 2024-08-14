window.addEventListener("DOMContentLoaded", loadGame);
window.addEventListener("resize", onResize);
window.addEventListener("keydown", onKeyDown);
onResize();

function loadGame() {
    const displayGrid = [];
    for (let i = 0; i < 13; i++) {
        const row = [];
        for (let j = 0; j < 13; j++) {
            const cell = document.createElement("div");
            cell.className = "cell";
            cell.textContent = "" + Math.floor(Math.random() * 52 - 26);
            grid.appendChild(cell);
            row[j] = cell;
        }
        displayGrid[i] = row;
    }
}

function onResize() {
    const size = Math.min(innerHeight, innerWidth) / 14;
    grid.style.gridTemplateColumns = `repeat(13,${size}px)`;
    grid.style.gridTemplateRows = `repeat(13,${size}px)`;
    grid.style.fontSize = `${size * 0.4}px`;
}

function onKeyDown(event) {
    if (event.key === " ") {

    }
}





