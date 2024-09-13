class Biome {
    constructor({ Infinite = Boolean, terrainImages = [], blockRarities = [] }) {
        this.size = lineSpace * scale
        this.Infinite = Infinite
        this.terrainImages = terrainImages
        this.blockRarities = blockRarities
        this.listLimit = terrainImages.length
        this.biomeList = []
    }
    generateBiome(seed, x, y) {
        const rng = new RandomNumberGenerator(seed)
        let image = new Image()
        let randomItem = rng.nextInt(1, this.listLimit - 1)
        let nextValue = rng.nextFloat(0, 1)
        image.src = this.terrainImages[0]
        if (nextValue > this.blockRarities[randomItem]) {
            image.src = this.terrainImages[randomItem]
        }
        this.biomeList[seed] = {
            image: image,
            position: { x: x, y: y }
        }
    }
    stableBiome(seed, x, y) {
        const rng = new RandomNumberGenerator(seed)
        let image = new Image()
        let randomItem = rng.nextInt(1, this.listLimit - 1)
        let nextValue = rng.nextFloat(0, 1)
        image.src = this.terrainImages[0]
        if (nextValue > this.blockRarities[randomItem]) {
            image.src = this.terrainImages[randomItem]
        }

        if (offsetX == 0) {
            this.lake(x, y)
        }
        else {
            this.biomeList[seed] = {
                image: image,
                position: { x: x, y: y }
            }
        }
        //ctx.drawImage(image, x, y, this.size, this.size)
    }
    updateBiome(seed, x, y) {
        if (this.Infinite && !this.biomeList[seed]) {
            this.generateBiome(seed, x, y)
        } else if (!this.Infinite && !this.biomeList[seed]) {
            this.stableBiome(seed, x, y)
        }
    }
    lake(x, y) {
        const lakeSize = 100
        let image = new Image()
        image.src = './images/stones.png'
        for (let i = x; i < x + lakeSize; i++) {
            for (let j = y; j < y + lakeSize; j++) {
                const seed = i * 100000 + j
                this.biomeList[seed] = {
                    image: image,
                    position: { x: i, y: j }
                }
            }
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
                const seed = x * 100000 + y
                this.updateBiome(seed, x, y);
                ctx.drawImage(this.biomeList[seed].image, worldToScreenX(this.biomeList[seed].position.x), worldToScreenY(this.biomeList[seed].position.y), this.size, this.size)
            }
        }
    }
}