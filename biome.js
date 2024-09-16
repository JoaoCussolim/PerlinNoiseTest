class Biome {
    constructor({ Infinite = Boolean, terrainImages = [], blockRarities = [], treeImages = [], lakeImages = [] }) {
        this.size = lineSpace * scale
        this.Infinite = Infinite
        this.terrainImages = terrainImages
        this.treeImages = treeImages
        this.lakeImages = lakeImages
        this.blockRarities = blockRarities
        this.biomeList = []
        this.treeList = []
    }
    generateBiome(seed, x, y) {
        const rng = new RandomNumberGenerator(seed)
        let image = new Image()
        const treeRarity = 0.999
        let randomItem = rng.nextInt(1, this.terrainImages.length - 1)
        let nextValue = rng.nextFloat(0, 1)
        image.src = this.terrainImages[0]
        const normalFloor = new Image()
        normalFloor.src = this.terrainImages[0]
        if (nextValue > this.blockRarities[randomItem]) {
            image.src = this.terrainImages[randomItem]
        }
        this.biomeList[seed] = {
            image: image,
            position: { x: x, y: y }
        }
        if (image.src === normalFloor.src) {
            let randomValue = rng.nextFloat(0, 1)
            if (randomValue > treeRarity && !this.treeList[seed]) {
                this.lakeGenerate(seed, x, y)
            }
        }
    }

    treeGenerate(seed, x, y) {
        let treeImage = new Image()
        let randomItem = rng.nextInt(0, this.treeImages.length - 1)
        treeImage.src = this.treeImages[randomItem]
        let treeSizeMultiplier = 3
        const realSize = this.size * treeSizeMultiplier
        this.treeList[seed] = {
            image: treeImage,
            position: { x: x - realSize, y: y - realSize },
            treeSize: realSize,
        }
    }

    lakeGenerate(rng, x, y) {
        let actualPosition = {
            x: 0,
            y: 0
        }
        let lakeSize = 8
        const realSize = this.size * lakeSize
        for (let i = x; i < x + realSize; i += this.size) {
            for (let j = y; j < y + realSize; j += this.size) {
                let treeImage = new Image()
                const seed = i * 100000 + j
                let content = false

                // if (actualPosition.y < 1 + lakeSize * actualPosition.x) {
                //     treeImage.src = this.lakeImages[3]
                // }

                // if (actualPosition.y < lakeSize * actualPosition.x - 1 && actualPosition.y > lakeSize * actualPosition.x - lakeSize && !content) {
                //     treeImage.src = this.lakeImages[4]
                //     content = true
                // }

                // if (actualPosition.y < lakeSize && content) {
                //     treeImage.src = this.lakeImages[0]
                // }

                // if (actualPosition.y > lakeSize * (lakeSize - 1) - 1 && content) {
                //     treeImage.src = this.lakeImages[1]

                // }

                // if (actualPosition.y > lakeSize * actualPosition.x - 2) {
                //     treeImage.src = this.lakeImages[2]
                // }

                if (actualPosition.x < lakeSize) {
                    treeImage.src = this.lakeImages[0] // border

                    if (actualPosition.x == 0) { // border corner up
                        treeImage.src = this.lakeImages[1]
                    }

                    if (actualPosition.x > 6 && actualPosition.y < 2) { // border corner down
                        treeImage.src = this.lakeImages[2]
                    }

                }

                if (actualPosition.x > lakeSize * (lakeSize - 1) - 1) {
                    treeImage.src = this.lakeImages[3]
                    if (actualPosition.x == (lakeSize * lakeSize) - 1) { // border corner up
                        treeImage.src = this.lakeImages[5]
                    }

                    if (actualPosition.x == lakeSize * (lakeSize - 1)) { // border corner down
                        treeImage.src = this.lakeImages[4]
                    }

                }

                if (actualPosition.x > lakeSize + (lakeSize * actualPosition.y - 1) && actualPosition.x < lakeSize + (lakeSize * actualPosition.y + 1)) {
                    treeImage.src = this.lakeImages[6]
                }

                this.treeList[seed] = {
                    image: treeImage,
                    position: { x: i, y: j },
                    treeSize: this.size,
                }
                actualPosition.x++
                
            }
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
        if (image.src === this.terrainImages[0]) {
            let randomValue = rng.nextFloat(0, 1)
            if (randomValue > 0.9) {
                let treeImage = new Image()
                treeImage.src = './images/tree1.png'
                this.treeList[seed] = {
                    image: treeImage,
                    position: { x: x, y: y }
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
                if (this.biomeList[seed]) {
                    ctx.drawImage(this.biomeList[seed].image, worldToScreenX(this.biomeList[seed].position.x), worldToScreenY(this.biomeList[seed].position.y), this.size, this.size)
                }
                if (this.treeList[seed]) {
                    ctx.drawImage(this.treeList[seed].image, worldToScreenX(this.treeList[seed].position.x), worldToScreenY(this.treeList[seed].position.y), this.treeList[seed].treeSize, this.treeList[seed].treeSize)
                }
            }
        }
    }

}