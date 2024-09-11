class Biome {
    constructor({ biomeSize = 0, position = { x: 0, y: 0 }}) {
        this.biomeSize = biomeSize;
        this.size = lineSpace * scale
        this.position = position;
        this.seed = this.position.x * 100000 + this.position.y
        this.rng = new RandomNumberGenerator(this.seed)
    }
    generateBiome() {
        let position = { x: x, y: y }
        let size = lineSpace * scale
        let r = rng.nextInt(0, 255);
        let g = rng.nextInt(0, 255);
        let b = rng.nextInt(0, 255);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b})`
        ctx.fillRect(worldToScreenX(position.x), worldToScreenY(position.y), size, size)
    }
    draw() {
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
}