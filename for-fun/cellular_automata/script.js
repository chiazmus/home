let simulationTypes = ['Game of Life', 'Brians Brain', 'Langtons Ant'];
let mySim = 0;
const simElement = document.getElementById('simulationType');
const switchSim = document.getElementById('switchSim');
const myCanvas = document.querySelector('canvas');
const ctx = myCanvas.getContext('2d');
const startSim = document.getElementById('startSim');
const ruleInput = document.getElementById('customRule');
const applyRule = document.getElementById('applyNew');
const ruleDiv = document.getElementById('ruleIn');

let intr = null;
let bornRule = [3];
let liveRule = [3,2];
let color1 = 'lightgreen';
let color2 = 'blue';
let ant = {
    x: 25,
    y: 25,
    dir: 0
};

simElement.innerHTML = simulationTypes[mySim];
switchSim.setAttribute("onclick", "changeSimulation()");
myCanvas.style.imageRendering = 'pixelated';
// Grid parameters
const cellSize = 8;
const gridWidth = 70; // Number of cells horizontally
const gridHeight = 70; // Number of cells vertically
myCanvas.width = gridWidth * cellSize;
myCanvas.height = gridHeight * cellSize;

// Initialize the grid (2D array)
let grid = createGrid(gridWidth, gridHeight);

function createGrid(width, height) {
    const newGrid = [];
    for (let y = 0; y < height; y++) {
        newGrid[y] = [];
        for (let x = 0; x < width; x++) {
            newGrid[y][x] = Math.random() < 0.1 ? 1 : 0; // Initialize all cells as "dead" (0)
        }
    }
    return newGrid;
}

function changeSimulation() {
    if (mySim < simulationTypes.length - 1) {
        mySim++;
        simElement.innerHTML = simulationTypes[mySim];
        switchSim.setAttribute("onclick", "changeSimulation()");
    } else {
        mySim = 0;
        simElement.innerHTML = simulationTypes[mySim];
        switchSim.setAttribute("onclick", "changeSimulation()");
    }

    if (simulationTypes[mySim] == "Game of Life") {
        bornRule = [3];
        liveRule = [2,3];
        ruleDiv.style.display = "flex";
        color1 = 'lightgreen'

    } else if (simulationTypes[mySim] == "Brians Brain") {
        bornRule = [2];
        liveRule = [];
        ruleDiv.style.display = "flex";
        color1 = 'lightblue'

    } else {
        ant.x = 25;
        ant.y = 25;
        ant.dir = 0;
        ruleDiv.style.display = "none";
        color1 = 'pink'

    }

    // Reset the grid when changing simulations
    grid = createGrid(gridWidth, gridHeight);
    drawGrid();
}

function drawGrid() {
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height); // Clear the canvas

    for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
            const cellState = grid[y][x];
            ctx.fillStyle = cellState === 1 ? color1 : cellState === 2 ? color2 : 'black'; // Alive: green, Dead: black
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
    }
}

function aliveNeighbors(grid, x, y) {
    let aliveNeighbors = 0; // Initialize the count of alive neighbors
    for (let i = -1; i <= 1; i++) { // Check neighbors in the range of -1 to 1
        for (let j = -1; j <= 1; j++) { // Check neighbors in the range of -1 to 1
            if (i === 0 && j === 0) continue; // Skip checking the current cell itself
            if (x+i < 0 || x+i >= gridWidth || y+j < 0 || y+j >= gridHeight) continue; // Skip out-of-bounds neighbors
            if (grid[y + j][x + i] === 1) aliveNeighbors++; // Increment the count for each alive neighbor found
        }
    }
    return aliveNeighbors;
}

function changeRule(){
    let rule = ruleInput.value.trim();
    //Regex matching to make sure the rule format is valid, including a bornrule/liverule
    //If the rule is valid then set the live and born rules to the rule given by the user
    const ruleMatch = /^([0-8]*)\/([0-8]*)$/
    if (ruleMatch.test(rule)){
        simElement.textContent = `${simElement.textContent.split('-')[0]} - ${rule}`; // Update the text content

        // Split the rule into born and live parts
        const [bornPart, livePart] = rule.split('/');

        // Convert the born part to an array of numbers
        bornRule = bornPart.split('').map(Number);

        // Convert the live part to an array of numbers
        liveRule = livePart.split('').map(Number);
   
    }


}

function runSimulation() {
    //Game of life
    if (simulationTypes[mySim] === 'Game of Life') {
        // Game of Life code here
        let new_world = createGrid(gridWidth, gridHeight); 

        for (let y = 0; y < gridHeight; y++) {
            for (let x = 0; x < gridWidth; x++) {
                new_world[y][x] = 0;
                let myNeighbors = aliveNeighbors(grid, x, y);
                if ((bornRule.includes(myNeighbors) && grid[y][x] === 0) || (liveRule.includes(myNeighbors) && grid[y][x] === 1)) new_world[y][x] = 1;
            }
        }

        grid = new_world
        drawGrid();
    } else if (simulationTypes[mySim] == 'Brians Brain') {
        let new_world = createGrid(gridWidth, gridHeight); 
        for (let y = 0; y < gridHeight; y++) {
            for (let x = 0; x < gridWidth; x++) {
                new_world[y][x] = 0;
                let myNeighbors = aliveNeighbors(grid, x, y);
                if ((bornRule.includes(myNeighbors) && grid[y][x] === 0) || (liveRule.includes(myNeighbors) && grid[y][x] === 1)) new_world[y][x] = 1;
                if (grid[y][x] == 1 && new_world[y][x] == 0) new_world[y][x] = 2;
            }
        }

        grid = new_world
        drawGrid();
    } else if (simulationTypes[mySim] == 'Langtons Ant') {
        // Choose which way to turn the ant
        if (grid[ant.y][ant.x] == 0) ant.dir += 1;
        else ant.dir -= 1;
        if (ant.dir < 0) ant.dir = 3
        if (ant.dir > 3) ant.dir = 0

        // Flip the tile under the ant
        grid[ant.y][ant.x] = (grid[ant.y][ant.x] === 1) ? 0 : 1;

        // Move forward
        switch (ant.dir) {
            case 0:
                ant.y -= 1;
                break;
            case 1:
                ant.x += 1;
                break;
            case 2:
                ant.y += 1;
                break;
            case 3:
                ant.x -= 1;
        }

        // Correct if on the edge of the grid
        if (ant.x < 0) ant.x += grid.width;
        if (ant.x > grid.width - 1) ant.x -= grid.width;
        if (ant.y < 0) ant.y += grid.height;
        if (ant.y > grid.height - 1) ant.y -= grid.height;

        // Display the change
        drawGrid();        
    }
}

// Initial draw
drawGrid();

// Event listener for clicking on cells
myCanvas.addEventListener('click', (event) => {
    const rect = myCanvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const cellX = Math.floor(mouseX / cellSize);
    const cellY = Math.floor(mouseY / cellSize);

    if (cellX >= 0 && cellX < gridWidth && cellY >= 0 && cellY < gridHeight) {
        // Toggle the cell state
        grid[cellY][cellX] = grid[cellY][cellX] === 0 ? 1 : 0;
        drawGrid(); // Redraw the grid to show the change
    }
});

startSim.addEventListener('click', () => {
    if (startSim.textContent == 'start') {
        startSim.textContent = 'stop';
        intr = setInterval(runSimulation, 100);
    } else {
        startSim.textContent = 'start';
        if (intr) clearInterval(intr);
    }
});

applyRule.addEventListener('click', changeRule);

