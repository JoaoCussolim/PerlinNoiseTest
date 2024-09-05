let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let drawLine = (x1, y1, x2, y2, color) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.stroke();
}

let offsetX = 0;
let offsetY = 0;
let scale = 1;

let screenToWorldX = (x) => {
    return (x / scale) + offsetX;
};

let screenToWorldY = (y) => {
    return (y / scale) + offsetY;
};

let worldToScreenX = (x) => {
    return (x - offsetX) * scale;
};

let worldToScreenY = (y) => {
    return (y - offsetY) * scale;
};

addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') {
        offsetY -= 5;
    }
    if (e.key === 'ArrowDown') {
        offsetY += 5;
    }
    if (e.key === 'ArrowLeft') {
        offsetX -= 5;
    }
    if (e.key === 'ArrowRight') {
        offsetX += 5;
    }
    if (e.key === 'q') {
        if (scale > 0.5) scale -= 0.1;
    }
    if (e.key === 'e') {
        scale += 0.1;
    }
})

let lineSpace = 50;

let width = screenToWorldX(canvas.width) + lineSpace;
let height = screenToWorldY(canvas.height) + lineSpace;

let canvasResize = (window) => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    width = screenToWorldX(canvas.width) + lineSpace;
    height = screenToWorldY(canvas.height) + lineSpace;
}

let drawPoints = (x, y) => {
    const seed = x * 100000 + y;
    let rng = new RandomNumberGenerator(seed)
    let position = { x: x, y: y }
    let size = lineSpace * scale
    let center = {
        x: position.x - size / 2,
        y: position.y - size / 2
    }
    let r = rng.nextInt(0, 255);
    let g = rng.nextInt(0, 255);
    let b = rng.nextInt(0, 255);
    ctx.fillStyle = `rgba(${r}, ${g}, ${b})`
    ctx.fillRect(worldToScreenX(position.x), worldToScreenY(position.y), size, size)
}

let drawInfiniteGrid = () => {
    const stw0x = screenToWorldX(0);
    const stw0y = screenToWorldY(0);

    const initialX = Math.floor(stw0x / lineSpace) * lineSpace;
    const initialY = Math.floor(stw0y / lineSpace) * lineSpace;

    const stw1x = screenToWorldX(canvas.width);
    const stw1y = screenToWorldY(canvas.height);

    const finalX = Math.ceil(stw1x / lineSpace) * lineSpace;
    const finalY = Math.ceil(stw1y / lineSpace) * lineSpace;

    for (let y = initialY; y < finalY; y += lineSpace) {
        for (let x = initialX; x < finalX; x += lineSpace) {
            drawPoints(x, y);
        }
    }

<<<<<<< Updated upstream
    for (let y = initialY; y < finalY; y += lineSpace) {
        drawLine(0, worldToScreenY(y), canvas.width, worldToScreenY(y), 'white')
    }

    for (let x = initialX; x < finalX; x += lineSpace) {
        drawLine(worldToScreenX(x), 0, worldToScreenX(x), canvas.height, 'white')
    }
=======
let noiseGenerated = false
const rng = new RandomNumberGenerator()

let noiseSeed2D = []
let perlinNoise2D = []
let nOutputWidth = screenToWorldX(canvas.width)
let nOutputHeight = screenToWorldY(canvas.height)
let octaveCount = 2


let drawNoise = () => {

    const stw0x = screenToWorldX(0);
    const stw0y = screenToWorldY(0);

    const initialX = Math.floor(stw0x / lineSpace) * lineSpace;
    const initialY = Math.floor(stw0y / lineSpace) * lineSpace;

    nOutputWidth = screenToWorldX(canvas.width)
    nOutputHeight = screenToWorldY(canvas.height)

    const finalX = Math.ceil(nOutputWidth / lineSpace) * lineSpace;
    const finalY = Math.ceil(nOutputHeight / lineSpace) * lineSpace;

    const noise = new Chunk(680, initialX, initialY, finalX, finalY, noiseSeed2D, octaveCount, perlinNoise2D)

    if (!noiseGenerated) {
        noiseGenerated = true
        noise.generate()
    }

    noise.update(offsetX, offsetY)
>>>>>>> Stashed changes
}

const rng = new RandomNumberGenerator()

let animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
<<<<<<< Updated upstream
    drawInfiniteGrid();
=======
    //drawPixels();
    drawNoise();
    drawGrid();

>>>>>>> Stashed changes
    requestAnimationFrame(animate);
}

addEventListener("resize", (event) => { canvasResize(window) });

animate();