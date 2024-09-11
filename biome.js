class Biome {
    constructor({ biomeSize = 0, position = { x: 0, y: 0 }}) {
        this.biomeSize = biomeSize * biomeSize;
        this.size = lineSpace * scale
        this.position = position
        this.biomeValues = 10
    }
    generateBiome(x, y) {
        const seed = x * 100000 + y
        const rng = new RandomNumberGenerator(seed)
        let r
        let g
        let b
        if(rng.nextInt(0, 500) < 350){
            r = 0
            g = 100
            b = 0
        }else{
            r = 0
            g = 0
            b = 100
        }
        ctx.fillStyle = `rgba(${r}, ${g}, ${b})`
        ctx.fillRect(worldToScreenX(x), worldToScreenY(y), this.size, this.size)
    }
    updateBiome(x,y){
        if(Math.abs(x * y) <= this.biomeSize){
            this.generateBiome(x, y)
        }
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
                this.updateBiome(x, y);
            }
        }
    }
}