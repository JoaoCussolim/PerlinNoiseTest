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
    return (x / scale) + offsetX
}

let screenToWorldY = (y)  => {
    return (y / scale) + offsetY
}

let worldToScreenX  = (x) => {
    return (x - offsetX) * scale
}

let worldToScreenY =  (y) => {
    return (y - offsetY) * scale
}

addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') {
        offsetY -= 5;
    }
    if(e.key === 'ArrowDown'){
        offsetY += 5;
    }
    if(e.key === 'ArrowLeft'){
        offsetX -= 5;
    }
    if(e.key === 'ArrowRight'){
        offsetX += 5;
    }
    if(e.key === 'q'){
        if(scale > 0.1) scale -= 0.1;
    }
    if(e.key === 'e'){
        scale += 0.1;
    }
})

let lineSpace = 40;

let width = screenToWorldX(canvas.width) + lineSpace;
let height = screenToWorldY(canvas.height) + lineSpace;


let drawInfiniteGrid = () => {
    //horizontal
    for(let i = -offsetX % lineSpace * scale; i <= width; i += lineSpace * scale){
        drawLine(i, 0, i, canvas.height, 'rgba(255,255,255)')
    }

    //vertical
    for(let j =  -offsetY % lineSpace * scale; j <= height; j += lineSpace * scale){
        drawLine(0, j, canvas.width, j, 'rgba(255,255,255)')
    }
}

let animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawInfiniteGrid()
    requestAnimationFrame(animate);
}

animate()