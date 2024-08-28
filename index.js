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

let drawSquares = (x, y) => {
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

let drawGrid  = () => {
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

const rng = new RandomNumberGenerator()

let nOutputSize = screenToWorldX(canvas.width);
let noiseSeed1D = new Array(nOutputSize)
let perlinNoise1D = new Array(nOutputSize)
for(let i = 0; i < nOutputSize; i++){
    noiseSeed1D[i] = rng.nextFloat(0, 1)
}

let noiseSeed2D = new Array(canvas.width * canvas.height)
let perlinNoise2D = new Array(canvas.width * canvas.height)
let nOutputWidth = screenToWorldX(canvas.width)
let nOutputHeight = screenToWorldY(canvas.height)
let mode = 2

for(let i = 0; i < canvas.width * canvas.height; i++){
    noiseSeed2D[i] = rng.nextFloat(0, 1)
}

let octaveCount = 5

let drawPerlinNoise1D = (nCount, seed, nOctaves, fOutput) => {
    for(let x = 0; x < nCount; x++){
        let fNoise = 0;
        let scaleAcc = 0
        let perlinScale = 1
        let nPitch = nCount;
        for(let o = 0; o < nOctaves; o++){
            nPitch = Math.max(1, Math.floor(nPitch / 2));
            let nSample1 = Math.floor(x / nPitch) * nPitch;
            let nSample2 = (nSample1 + nPitch) % nCount
            let fBlend = (x - nSample1) / nPitch
            let fSample = (1 - fBlend) * seed[nSample1] + fBlend * seed[nSample2]
            fNoise += fSample * perlinScale
            scaleAcc += perlinScale

            perlinScale /= 2
        }
        fOutput[x] = fNoise / scaleAcc
    }
}

let drawPerlinNoise2D = (nWidth, nHeight, seed, nOctaves, fOutput) => {
    for(let x = 0; x < nWidth; x++){
        for(let y = 0; y < nHeight; y++){
            let fNoise = 0;
            let scaleAcc = 0
            let perlinScale = 1
            let nPitch = nWidth;
            for(let o = 0; o < nOctaves; o++){
                nPitch = Math.max(1, Math.floor(nPitch / 2));
                let nSample1X = Math.floor(x / nPitch) * nPitch;
                let nSample1Y = Math.floor(y / nPitch) * nPitch;
                let nSample2X = (nSample1X + nPitch) % nWidth
                let nSample2Y = (nSample1Y + nPitch) % nHeight
                let fBlendX = (x - nSample1X) / nPitch
                let fBlendY = (y - nSample1Y) / nPitch

                let fSampleT = (1 - fBlendX) * seed[nSample1Y * nWidth + nSample1X] + fBlendX * seed[nSample1Y * nWidth + nSample2X ]
                let fSampleB = (1 - fBlendX) * seed[nSample2Y * nWidth + nSample1X] + fBlendX * seed[nSample2Y * nWidth + nSample2X ]
                fNoise += (fBlendY * (fSampleB - fSampleT) + fSampleT) * perlinScale
                scaleAcc += perlinScale

                perlinScale /= 2
            }
            fOutput[y * nWidth + x] = fNoise / scaleAcc
            }
        }
}

let animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //drawPixels();
    //drawGrid();

    if(mode === 1){    
        drawPerlinNoise1D(nOutputSize, noiseSeed1D, octaveCount, perlinNoise1D);


        for(let x = 0; x < nOutputSize; x++){
            let y = -(perlinNoise1D[x] * screenToWorldY(canvas.height)/2 + (screenToWorldY(canvas.height)/2))
            for(let f = y; f < screenToWorldY(canvas.height) / 2; f += lineSpace){
                drawLine(x, y, x, 50, 'white')
            }
        }
    }

    if(mode === 2){    
        drawPerlinNoise2D(nOutputWidth, nOutputHeight, noiseSeed2D, octaveCount, perlinNoise2D);


        for(let x = 0; x < nOutputWidth; x++){
            for(let y = 0; y < nOutputHeight; y++){
                let pixelBw = perlinNoise2D[y * nOutputWidth + x] * 4
                let bg_col = 'white'
                switch(pixelBw){
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
                }
                ctx.fillStyle= bg_col;
                ctx.fillrect(x, y, 50, 50);
            }
        }
    }

    requestAnimationFrame(animate);
}

addEventListener("resize", (event) => { canvasResize(window) });

animate();