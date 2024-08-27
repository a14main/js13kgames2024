window.addEventListener("DOMContentLoaded", loadGame);
window.addEventListener("resize", onResize);

onResize();

let mobs = [];
let mouseOver;


const colors = ["#6df7c1", "#11adc1", "#606c81", "#393457", "#1e8875", "#5bb361", "#a1e55a", "#f7e476", "#f99252", "#cb4d68", "#6a3771", "#c92464", "#f48cb6", "#f7b69e", "#9b9c82"
]

const DIRECTIONS = [[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]];

window.gameRunning = false;

function loadGame() {
    createGrid();
    mouseOver = document.getElementById("mouseOver");
    grid.addEventListener("mouseover", onMouseOverGrid);
    window.level = 1;
    window.room = 1;
    window.moves = 0;
    window.movesInRoom = 0;
    createPlayer();
    setupGame();
    showMessage("Avoid the Number 13 and don't go below 0.");
}

function setupGame() {

    gameOverBar.style.transform = "scaleY(0)";
    mobs = [];
    createMap();
    player.x = 6;
    player.y = 12;
    render();
    window.addEventListener("keydown", onKeyDown);
    gameRunning = true;
    movesInRoom = 0;
}

function createPlayer() {
    window["player"] = {
        x: 6,
        y: 12,
        score: 0,
        attack: 0,
        defense: 0,
        speed: 1,
        element: playerElement,
        name: "you",
    }
    window.playerElement = playerElement;
}

function spawnMob(minLevel=1, maxLevel=level) {
    const x = Math.floor(Math.random() * 11) + 1;
    const y = Math.floor(Math.random() * 6) + 1;
    const score = Math.floor(Math.random() * (maxLevel - minLevel)) + minLevel;
    const attack = 0;
    const defense = 0;
    const speed = 1;
    const name = "a monster"
    gameMap[x][y] = 0;
    element = document.createElement("div");
    element.classList.add('mob');
    element.id = `mob${mobs.length}`;
    mobs.push({ x, y, score, element, attack, defense, speed, name});
}

function createMap() {
    window.gameMap = [];
    for (let i = 0; i < 13; i++) {
        gameMap[i] = [];
        for (let j = 0; j < 13; j++) {
            gameMap[i][j] = 0;
        }
    }
    const tiles = [];

    let tileQuantity = Math.max(1, Math.floor(Math.random() * room));
    let minValue = room * level < 2 ? 1 : -Math.max(1, Math.floor(Math.random() * room));
    let maxValue = Math.max(1, Math.floor(Math.random() * room));

    // const tiles = [1,1,1,1,1,1,1,1,1,1,1,1,1];
    for (let i = 0; i < tileQuantity; i++) {
        for (let j = minValue; j <= maxValue; j++) {
            tiles.push(j);
        }
    }
    if (tiles.length > (13 * 13) - 2) {
        tiles.splice(0, tiles.length - (13 * 13) - 2);
    }
    // tiles.sort(() => Math.random - 0.5);
    for (let i = 0; i < tiles.length; i++) {
        let x = Math.floor(Math.random() * 13);
        let y = Math.floor(Math.random() * 13);
        while (gameMap[x][y] !== 0 && x !== 6 && y !== 12 && y !== 0) {
            x = Math.floor(Math.random() * 13);
            y = Math.floor(Math.random() * 13);
        }
        gameMap[x][y] = tiles[i];
    }
    gameMap[6][12] = 0;
    gameMap[6][0] = -100;
    spawnMobs();
}

function spawnMobs() {
    let quantity = level * room === 1 ? 0 : (level === 1 || level * room < 6) ? Math.floor(Math.random() * 2) : Math.floor(Math.random() * room);
    let minLevel = Math.max(1, Math.floor(Math.random() * level - 6));
    let maxLevel = level === 1 ? 1 : Math.random() < (level / 13) ? 13 : Math.floor(Math.random() * level);

    for (let i = 0; i < quantity; i++) {
        spawnMob(minLevel, maxLevel);
    }
}

function render() {
    for (let y = 0; y < 13; y++) {
        for (let x = 0; x < 13; x++) {
            const element = window["x" + x + "y" + y];
            const num = gameMap[x][y];
            // element.classList.remove("player", "door");
            element.textContent = num ? num : "";
            if (x === 6 && y === 0) {
                element.textContent = room === 13 ? level === 13 ? "✹" : "↥" : "∏";
                element.style.color = "#ffa";
                element.style.backgroundColor = "#ffa2";
                element.classList.add("door");
                continue

            }
            if (num === -99) {
                element.textContent = "X";
                element.style.color = "#404040";
            }

            element.style.color = num <= 0 ? colors[-num] : "#000";
            element.style.outlineColor = num <= 0 ? colors[-num] : colors[num];
            element.style.backgroundColor = num <= 0 ? "#000" : colors[num] + "80";
        }
    }
    const playerCell = window["x" + player.x + "y" + player.y];
    playerElement.remove();
    playerCell.appendChild(playerElement);
    playerElement.textContent = player.score;
    playerElement.style.color = "#000";

    mobs.forEach((mob) => {
        const mobCell = window["x" + mob.x + "y" + mob.y];
        mob.element.remove();
        mobCell.appendChild(mob.element);
        mob.element.textContent = mob.score;
        mob.element.style.color = mob.score > player.score ? "#800" : mob.score < player.score ? "#080" : "#444";
    });

    movesText.textContent = `Moves: ${moves}`;
    levelText.textContent = `${level}:${room}`;
    levelText.style.color = colors[level];
    playerStats.textContent = `ATT:${player.attack + player.score} DEF:${player.defense + player.score}`;
    youName.textContent = `You(${player.score}): `
}

function createGrid() {
    for (let y = 0; y < 13; y++) {
        for (let x = 0; x < 13; x++) {
            const cell = document.createElement("div");
            cell.className = "cell";
            cell.id = "x" + x + "y" + y
            cell.textContent = "";
            grid.appendChild(cell);
        }
    }
}

function onResize() {
    const size = Math.min(innerHeight, innerWidth) / 16;
    grid.style.gridTemplateColumns = `repeat(13,${size}px)`;
    grid.style.gridTemplateRows = `repeat(13,${size}px)`;
    grid.style.fontSize = `${size * 0.4}px`;
}

function handleInput(dx, dy, wait) {
    if (wait) return
    player.x += dx;
    if (player.x < 0) { player.x = 0; return }
    if (player.x > 12) { player.x = 12; return }
    player.y += dy;
    if (player.y < 0) { player.y = 0; return }
    if (player.y > 12) { player.y = 12; return }

    if (gameMap[player.x][player.y] === -99) {
        player.x -= dx;
        player.y -= dy;
        return
    }

    let mob;
    mobs.forEach((m) => {
        if (m.x === player.x && m.y === player.y) mob = m;
    })

    if (mob) {
        if (tryBump(player, mob)) {
            player.x -= dx;
            player.y -= dy;
        }
    }

    moves++;
    movesInRoom++;
    if (movesInRoom > 13) {
        movesInRoom = 0;
        spawnMob();
    }

    if (player.x === 6 && player.y === 0) {
        nextRoom();
        return
    }
    if (gameMap[player.x][player.y] && !mob) {
        player.score += gameMap[player.x][player.y];
        playerElement.style.transform = gameMap[player.x][player.y] > 0 ? "scale(1)" : "scale(0.72)";
        gameMap[player.x][player.y] = 0;
        setTimeout(() => playerElement.style.transform = "scale(0.8)", 100);
    }



    if (gameRunning && (player.score < 0 || player.score >= 13)) {
        player.score = player.score >= 13 ? 13 : player.score;
        gameOver(player.score >= 13 ? "Unlucky 13" : "You died");
    }

    updateMobs();
    updateMap();

    render();
}

function updateMobs() {
    if (!gameRunning) return
    mobs.forEach((mob) => {
        if (mob.dead) return
        let direction = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
        let tx = mob.x + direction[0];
        let ty = mob.y + direction[1];
        if (tx > 12 || tx < 0) {
            return
        }
        if (ty > 12 || ty < 0) {
            return
        }
        if ((tx === 6 && ty === 0) || gameMap[tx][ty] < -13) {
            return
        }
        if (player.x === tx && player.y === ty) {
            tryBump(mob, player);
        } else {
            [mob.x, mob.y] = [tx, ty];
            const diff = 13 - mob.score;
            mob.score += Math.max(-1, Math.min(diff, gameMap[tx][ty]));
            gameMap[tx][ty] = 0;
        }

        if (mob.score < 0) {
            showMessage(`You defeated ${mob.name}.`);
            mob.dead = true;
            mob.element.remove();
            mob.element.style.display = "none";
        }
    });
}

function tryBump(attacker, defender) {
    if (!attacker || !defender || defender.dead || attacker.dead) return false
    if (attacker.score + attacker.attack > defender.score + defender.defense) {
        defender.score--;
        showMessage(`${attacker.name} hit ${defender.name}.`);

        if (player.score < 0) {
            gameOver(`You were killed by the number ${mob.score}`);
        }
        defender.element.style.transform = "scale(0.5)";
        defender.element.style.backgroundColor = "#f00";
        setTimeout(() => {
            defender.element.style.transform = "scale(0.8)";
            defender.element.style.backgroundColor = "#fff";
        }, 50);
    } else {
        showMessage(`${attacker.name} missed ${defender.name}.`);
    }
    return true
}

function updateMap() {
    gameMap[6][0] = -100;
    for (let y = 0; y < 13; y++) {
        for (let x = 0; x < 13; x++) {
            if (x === 6 && y === 0) continue
            if (x === player.x && y === player.y) continue
            let mob = false;
            for (let i = 0; i < mobs.length; i++) {
                if (mobs[i].x === x && mobs[i].y === y) {
                    mob = true;
                }
            }
            if (mob) continue;
            const value = gameMap[x][y];
            if (value >= 13 || value <= -13) {
                getNeighbours(x, y).forEach(([xx, yy]) => {
                    if (gameMap[xx]?.[yy] === undefined || Math.random() >= 0.13) return
                    if (xx === player.x && yy === player.y) return
                    gameMap[xx][yy] = value;
                });
                gameMap[x][y] = Math.random() < 0.13 ? -13 : Math.random() < 0.13 ? 13 : 0;
            }
            if (Math.random() < 0.13 && gameMap[x][y] > -99) {
                gameMap[x][y] += averageSignOfNeighbours(x, y);
            }
        }
    }
}

function getNeighbours(x, y) {
    return [[-1, 0], [1, 0], [0, -1], [-0, 1]].map(([i, j]) => [x + i, y + j]);
}

function averageSignOfNeighbours(x, y) {
    let sum = 0;
    let count = 0;
    for ([i, j] of [[-1, 0], [1, 0], [0, -1], [-0, 1]]) {
        if (x + i === 6 && y + j === 0) continue
        if (gameMap[x + i]?.[y + j]) {
            sum += gameMap[x + i][y + j];
            count++;
        }
    }
    sum /= count;
    return sum ? sum / Math.abs(sum) : 0;
}

function nextRoom() {
    if (room === 13) {
        return nextLevel();
    }
    room++;
    showMessage(`You have entered Room ${room}`);
    setupGame();
}

function nextLevel() {
    if (level === 13) {
        winGame();
        return
    }
    room = 1;
    showMessage(`You have cleared level ${level}!`);
    level++;
    setupGame();
}

function winGame() {
    gameRunning = false;

    gameOverText.textContent = "WIN! WIN! WIN!"
    gameOverMessage.textContent = `You defeated the number 13 in ${moves} moves!`;
    gameOverBar.style.transform = "scaleY(1)";
    window.removeEventListener("keydown", onKeyDown);
    window.addEventListener("keydown", onMenuKeyDown);
}

function gameOver(str) {
    gameRunning = false;

    gameOverText.textContent = "GAME OVER"

    showMessage(str + " on level " + level + ".");
    gameOverBar.style.transform = "scaleY(1)";
    gameOverMessage.textContent = str + " on level " + level + ".";
    window.removeEventListener("keydown", onKeyDown);
    window.addEventListener("keydown", onMenuKeyDown);
}

function onMenuKeyDown(event) {
    if (event.key === " ") {
        restart();
        event.preventDefault();
    }
}

function restart() {
    window.removeEventListener("keydown", onMenuKeyDown);
    createPlayer();
    room = 1;
    level = 1;
    moves = 0;
    setupGame();



}

function onKeyDown(event) {
    const {key} = event;
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(key)) {
        const dy = (key === "ArrowDown") - (key === "ArrowUp");
        const dx = (key === "ArrowRight") - (key === "ArrowLeft");
        const wait = (key === " ");
        handleInput(dx, dy, wait);
        event.preventDefault();
    }
}

function onMouseOverGrid(event) {
    const {target} = event;
    if ([...target.classList].includes("mob")) {
        const mob = mobs.find((m) => m.element === target);
        if (mob) {
            monsterName.textContent = mob.name[0].toUpperCase() + mob.name.substring(1) + `(${mob.score})`;
            monsterStats.textContent = `ATT:${mob.attack + mob.score} DEF:${mob.defense + mob.score}`;
        }
        return true;
    }
    monsterName.textContent = "";
    monsterStats.textContent = "";
       
}

function showText(str, target) {
    mouseOver.textContent = str;
    mouseOver.style.display = str ? "block" : "none";
    target?.appendChild(mouseOver);
}

function showMessage(str) {
    const message = document.createElement("li");
    message.classList.add("message");
    message.textContent = str[0].toUpperCase() + str.substring(1);
    messages.insertBefore(message, messages.firstChild);
    messages.scrollTop = 0;
}







