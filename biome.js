class Biome {
    constructor({ Infinite = Boolean, terrainImages = [], blockRarities = [] }) {
        this.size = lineSpace * scale
        this.Infinite = Infinite
        this.terrainImages = terrainImages
        this.blockRarities = blockRarities
        this.listLimit = terrainImages.length
        this.biomeList = []
        this.treeList = []
    }
    generateBiome(seed, x, y) {
        const rng = new RandomNumberGenerator(seed)
        let image = new Image()
        let randomItem = rng.nextInt(1, this.listLimit - 1)
        let nextValue = rng.nextFloat(0, 1)
        image.src = this.terrainImages[0]
        const normalFloor = new Image()
        normalFloor.src = this.terrainImages[0]
            if (nextValue > this.blockRarities[randomItem]) {
                image.src = this.terrainImages[randomItem]
            }
            if(image.src === normalFloor.src){
                let randomValue = rng.nextFloat(0, 1)
                if(randomValue > 0.9){
                    let treeImage = new Image()
                    treeImage.src = './images/tree1.png'
                    this.treeList[seed] = {
                        image: treeImage,
                        position: {x: x, y: y}
                    }
                }
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
        if(image.src === this.terrainImages[0]){
            let randomValue = rng.nextFloat(0, 1)
            if(randomValue > 0.9){
                let treeImage = new Image()
                treeImage.src = './images/tree1.png'
                this.treeList[seed] = {
                    image: treeImage,
                    position: {x: x, y: y}
                }
            }
        }
        this.biomeList[seed] = {
            image: image,
            position: { x: x, y: y }
        }
    }
    updateBiome(seed, x, y) {
        if (this.Infinite && !this.biomeList[seed]) {
            this.generateBiome(seed, x, y)
        } else if (!this.Infinite && !this.biomeList[seed]) {
            this.stableBiome(seed, x, y)
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
                if(this.treeList.length > 4) ctx.drawImage(this.treeList[seed].image, worldToScreenX(this.treeList[seed].position.x), worldToScreenY(this.treeList[seed].position.y), this.size, this.size)
            }
        }
    }
}