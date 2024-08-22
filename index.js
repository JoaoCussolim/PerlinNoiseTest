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

class RNG {
    constructor(seed) {
        this.m = 0x80000000;
        this.a = 1103515245;
        this.c = 12345;

        this.state = seed ? seed : Math.floor(Math.random() * (this.m - 1));
    }

    nextInt() {
        this.state = (this.a * this.state + this.c) % this.m;
        return this.state;
    }

    nextFloat() {
        return this.nextInt() / (this.m - 1)
    }

    nextRange(start, end) {
        let rangeSize = end - start
        let randomUnder1 = this.nextInt() / this.m
        return start + Math.floor(randomUnder1 * rangeSize)
    }

    static randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

let canvasResize = (window) => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    width = screenToWorldX(canvas.width) + lineSpace;
    height = screenToWorldY(canvas.height) + lineSpace;
}

let drawPoints = (x, y) => {
    let rng = new RNG(x * 10000 + y);
    let position = { x: x, y: y }
    let size = lineSpace * scale
    let center = {
        x: position.x - size / 2,
        y: position.y - size / 2
    }
    let color = rng.nextRange(0, 80)
    let rng2 = new RNG(color);
    let color2 = rng2.nextRange(0, 80)
    let rng3 = new RNG(color2);
    let color3 = rng3.nextRange(0, 80)
    ctx.fillStyle = `rgba(${color}, ${color2}, ${color3})`
    ctx.fillRect(position.x - size, position.y - size, size, size)
    for (let i = 0; i < 10; i++) {
        let chunk = {
            x: position.x,
            y: position.y
        }
        chunks.push(chunk)
    }
}

let chunks = []

let createChunks = (x, y) => {
    let rng = new RNG(x * 10000 + y);
    let size = lineSpace * scale
    let color = rng.nextRange(0, 80)
    let rng2 = new RNG(color);
    let color2 = rng2.nextRange(0, 80)
    let rng3 = new RNG(color2);
    let color3 = rng3.nextRange(0, 80)
    for (let i = 0; i <= width; i++) {
        let chunk = {
            position: {
                x: x - size,
                y: y - size
            },
            size: size,
            color: `rgba(${color}, ${color2}, ${color3})`,
        }
        chunks.push(chunk)
    }
}

let drawChunks = (x) => {
    let chunk = chunks[x];
    ctx.fillStyle = chunk.color
    ctx.fillRect(chunk.position.x, chunk.position.y, chunk.size, chunk.size)
}


updateChunks = (x, y) => {
    //checking if chunk is not created
    console.log(chunks)
    drawChunks(x)
}

let drawInfiniteGrid = () => {
    //horizontal
    for (let i = -offsetX % (lineSpace * scale); i <= width; i += lineSpace * scale) {
        //vertical
        for (let j = -offsetY % (lineSpace * scale); j <= height; j += lineSpace * scale) {
            if(chunks.length < 1) createChunks(i, j)
            updateChunks(i, j)
            drawLine(i, 0, i, canvas.height, 'rgba(255, 255, 255)');
            drawLine(0, j, canvas.width, j, 'rgba(255, 255, 255)');
        };
    };
}

let animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawInfiniteGrid();
    requestAnimationFrame(animate);
}

addEventListener("resize", (event) => { canvasResize(window) });

animate();