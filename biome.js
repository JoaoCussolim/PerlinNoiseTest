class Biome {
    constructor({ biomeSize = 0, biomeImages = []}) {
        this.biomeSize = biomeSize * biomeSize;
        this.size = lineSpace * scale
        this.biomeImages = biomeImages
    }
    generateBiome(x, y) {
        const seed = x * 100000 + y
        const rng = new RandomNumberGenerator(seed)
        let image = new Image()
        let nextIntValue = rng.nextInt(0, 500)
        if (nextIntValue < 200) {
            image.src = this.biomeImages[0]
        } else if (nextIntValue < 300) {
            image.src = this.biomeImages[1]
        } else {
            image.src = this.biomeImages[2]
        }
        ctx.drawImage(image, worldToScreenX(x), worldToScreenY(y), this.size, this.size)
    }
    updateBiome(x, y) {
        const halfSize = this.biomeSize / 2
        if (Math.abs(x) <= halfSize && Math.abs(y) <= halfSize) {
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