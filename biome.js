class Biome {
    constructor({ Infinite = Boolean, biomeImages = [], blockRarities = [] }) {
        this.size = lineSpace * scale
        this.Infinite = Infinite
        this.biomeImages = biomeImages
        this.blockRarities = blockRarities
        this.listLimit = biomeImages.length
    }
    generateBiome(x, y) {
        const seed = x * 100000 + y
        const rng = new RandomNumberGenerator(seed)
        let image = new Image()
        let randomItem = rng.nextInt(1, this.listLimit-1)
        let nextValue = rng.nextFloat(0, 1)
        image.src = this.biomeImages[0]
        if(nextValue > this.blockRarities[randomItem]){
            image.src = this.biomeImages[randomItem]
        }
        ctx.drawImage(image, worldToScreenX(x), worldToScreenY(y), this.size, this.size)
    }
    stableBiome(x, y){
        const seed = x * 100000 + y
        const rng = new RandomNumberGenerator(seed)
        let image = new Image()
        let randomItem = rng.nextInt(1, this.listLimit-1)
        let nextValue = rng.nextFloat(0, 1)
        image.src = this.biomeImages[0]
        if(nextValue > this.blockRarities[randomItem]){
            image.src = this.biomeImages[randomItem]
        }
        ctx.drawImage(image, x, y, this.size, this.size)
    }
    updateBiome(x, y) {
        if (this.Infinite) {
            this.generateBiome(x, y)
        }else{
            this.stableBiome(x, y)
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