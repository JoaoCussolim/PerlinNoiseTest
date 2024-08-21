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
    ctx.closePath();
}

addEventListener('keydown', (e) => {
    if (e.key === 'g') {
        
    }
})

let backgroundPosition = {
    x: 0,
    y: 0
}

let drawInfiniteGrid = (gridSize, color) => {
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            //Using backgroundPosition to draw lines
            drawLine(backgroundPosition.x + i * 50, backgroundPosition.y + j * 50
                , backgroundPosition.x + (i + 1) * 50, backgroundPosition.y + j
                * 50, color);
        }}}

let animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(backgroundPosition.x, backgroundPosition.y, canvas.width, canvas.height)
    backgroundPosition.y++
    drawInfiniteGrid(100, 'white')
    requestAnimationFrame(animate);
}

animate()