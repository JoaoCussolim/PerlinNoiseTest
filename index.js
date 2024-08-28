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
        if (octaveCount < 9) octaveCount++;
    }
    if (e.key === 'e') {
        if (octaveCount > 1) octaveCount--;
    }
    if (e.key === '1') {
        mode = 1;
    }
    if (e.key === '2') {
        mode = 2;
    }
})

let lineSpace = 50;


let canvasResize = (window) => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
}

let drawSquares = (x, y) => {
    const seed = x * 100000 + y;
    let rng = new RandomNumberGenerator(seed)
    let position = { x: x, y: y }
    let size = lineSpace * scale
    // let center = {
    //     x: position.x - size / 2,
    //     y: position.y - size / 2
    // }
    let r = rng.nextInt(0, 255);
    let g = rng.nextInt(0, 255);
    let b = rng.nextInt(0, 255);
    ctx.fillStyle = `rgba(${r}, ${g}, ${b})`
    ctx.fillRect(worldToScreenX(position.x), worldToScreenY(position.y), size, size)
}

let drawGrid = () => {
    const stw0x = screenToWorldX(0);
    const stw0y = screenToWorldY(0);

    const initialX = Math.floor(stw0x / lineSpace) * lineSpace;
    const initialY = Math.floor(stw0y / lineSpace) * lineSpace;

    const stw1x = screenToWorldX(canvas.width);
    const stw1y = screenToWorldY(canvas.height);

    const finalX = Math.ceil(stw1x / lineSpace) * lineSpace;
    const finalY = Math.ceil(stw1y / lineSpace) * lineSpace;

    for (let y = initialY; y < finalY; y += lineSpace) {
        drawLine(0, worldToScreenY(y), canvas.width, worldToScreenY(y), 'white')
    }

    for (let x = initialX; x < finalX; x += lineSpace) {
        drawLine(worldToScreenX(x), 0, worldToScreenX(x), canvas.height, 'white')
    }
}

let drawPixels = () => {
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
            drawSquares(x, y);
        }
    }
}

let noiseGenerated = false
const rng = new RandomNumberGenerator()

let noiseSeed2D = new Array((canvas.width) * (canvas.height))
let perlinNoise2D = new Array((canvas.width) * (canvas.height))
let nOutputWidth = (canvas.width)
let nOutputHeight = (canvas.height)

for (let i = 0; i < (canvas.width) * (canvas.height); i++) {
    noiseSeed2D[i] = rng.nextFloat(0, 1)
}

let octaveCount = 2

let createPerlinNoise2D = (initialX, initialY, nWidth, nHeight, seed, nOctaves, fOutput) => {
    for (let x = initialX; (x) < nWidth; x += lineSpace) {
        for (let y = initialY; (y) < nHeight; y += lineSpace) {
            let fNoise = 0;
            let scaleAcc = 0
            let perlinScale = 1
            let nPitch = nWidth;
            for (let o = 0; o < nOctaves; o++) {
                nPitch = Math.max(1, Math.floor(nPitch / 2));
                let nSample1X = Math.floor(x / nPitch) * nPitch;
                let nSample1Y = Math.floor(y / nPitch) * nPitch;
                let nSample2X = (nSample1X + nPitch) % nWidth
                let nSample2Y = (nSample1Y + nPitch) % nHeight
                let fBlendX = (x - nSample1X) / nPitch
                let fBlendY = (y - nSample1Y) / nPitch

                let fSampleT = (1 - fBlendX) * seed[nSample1Y * nWidth + nSample1X] + fBlendX * seed[nSample1Y * nWidth + nSample2X]
                let fSampleB = (1 - fBlendX) * seed[nSample2Y * nWidth + nSample1X] + fBlendX * seed[nSample2Y * nWidth + nSample2X]
                fNoise += (fBlendY * (fSampleB - fSampleT) + fSampleT) * perlinScale
                scaleAcc += perlinScale

                perlinScale /= 2
            }
            fOutput[y * nWidth + x] = fNoise / scaleAcc
        }
    }
}

let drawNoise = () => {

    const stw0x = screenToWorldX(0);
    const stw0y = screenToWorldY(0);

    const initialX = Math.floor(stw0x / lineSpace) * lineSpace;
    const initialY = Math.floor(stw0y / lineSpace) * lineSpace;

    nOutputWidth = screenToWorldX(canvas.width)
    nOutputHeight = screenToWorldY(canvas.height)

    const finalX = Math.ceil(nOutputWidth / lineSpace) * lineSpace;
    const finalY = Math.ceil(nOutputHeight / lineSpace) * lineSpace;

    if(!noiseGenerated){
        createPerlinNoise2D(initialX, initialY, finalX, finalY, noiseSeed2D, octaveCount, perlinNoise2D);
        noiseGenerated = true
    }


    for (let x = initialX; x < finalX; x += lineSpace) {
        for (let y = initialY; y < finalY; y += lineSpace) {
            let pixelBw = Math.floor(perlinNoise2D[y * nOutputWidth + x] * 12)
            let bg_col = 'grey'
            switch (pixelBw) {
                case 0:
                    bg_col = 'black'
                    break;
                case 1:
                    bg_col = 'white'
                    break;
                case 2:
                    bg_col = 'blue'
                    break;
                case 3:
                    bg_col = 'red'
                    break;
                case 4:
                    bg_col = 'cyan'
                    break;
                case 5:
                    bg_col = 'yellow'
                    break;
                case 6:
                    bg_col = 'green'
                    break;
                case 7:
                    bg_col = 'purple'
                    break;
                case 8:
                    bg_col = 'brown'
                    break;
                case 9:
                    bg_col = 'pink'
                    break;
                case 10:
                    bg_col = 'orange'
                    break;
            }
            ctx.fillStyle = bg_col
            ctx.fillRect(worldToScreenX(x), worldToScreenY(y), lineSpace, lineSpace)
            console.log(`Normal X and Y: ${x}, ${y}. WorldPoints X and Y: ${worldToScreenX(x)}, ${worldToScreenY(y)}`)
        }
    }
}

let animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //drawPixels();
    drawNoise();
    drawGrid();
    
    requestAnimationFrame(animate);
}

addEventListener("resize", (event) => { canvasResize(window) });

animate();

// for (let i = noiseSeed2D.length - 1; i < nOutputWidth * nOutputHeight; i--) {
//     if(!noiseSeed2D[i]) noiseSeed2D[i] = rng.nextFloat(0, 1)
// }