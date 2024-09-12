class Biome {
    constructor({ Infinite = Boolean, biomeImages = [], blockProbabilities = []}) {
        this.size = lineSpace * scale
        this.Infinite = Infinite
        this.biomeImages = biomeImages
        this.blockProbabilities = blockProbabilities
    }
    generateBiome(x, y) {
        const seed = x * 100000 + y
        const rng = new RandomNumberGenerator(seed)
        let image = new Image()
        const probability = 0
        let nextValue = rng.nextInt(0, this.blockProbabilities somadas)
        image.src = this.biomeImages[0]
        if(nextValue < this.blockProbabilities[0]){
            image.src = this.biomeImages[1]
        }
        else if (nextValue < this.blockProbabilities[1])

        ctx.drawImage(image, worldToScreenX(x), worldToScreenY(y), this.size, this.size)
    }
    updateBiome(x, y) {
        if (this.Infinite) {
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

        this.size = lineSpace * scale

        for (let y = initialY; y < finalY; y += lineSpace) {
            for (let x = initialX; x < finalX; x += lineSpace) {
                this.updateBiome(x, y);
            }
        }
    }
}