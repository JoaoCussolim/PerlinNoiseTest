class Biome {
    constructor({ biome = { isInfinite, blockRarities, lakeImages, treeImages, terrainImages } }) {
        this.size = lineSpace * scale
        this.Infinite = biome.isInfinite
        this.terrainImages = biome.terrainImages
        this.treeImages = biome.treeImages
        this.lakeImages = biome.lakeImages
        this.blockRarities = biome.blockRarities
        this.biomeList = []
        this.structureList = []
    }
    generateBiome(seed, x, y) {
        const rng = new RandomNumberGenerator(seed)
        let image = new Image()
        const treeRarity = 0.9995
        const lakeRarity = 0.99988
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
            let strucutreGenerated = false
            if (randomValue > lakeRarity && !this.structureList[seed] && !strucutreGenerated) {
                this.lakeGenerate(seed, x, y)
                strucutreGenerated = true
            }

            else if (randomValue > treeRarity && !this.structureList[seed] && !strucutreGenerated) {
                this.treeGenerate(seed, x, y)
                strucutreGenerated = true
            }
        }
    }

    changeBiome(biome = { isInfinite, blockRarities, lakeImages, treeImages, terrainImages }) {
        this.biomeList = []
        this.structureList = []
        this.terrainImages = biome.terrainImages
        this.treeImages = biome.treeImages
        this.lakeImages = biome.lakeImages
        this.blockRarities = biome.blockRarities
        this.isInfinite = biome.isInfinite
        offsetX = 0;
        offsetY = 0;
    }

    treeGenerate(seed, x, y) {
        let treeImage = new Image()
        let randomItem = rng.nextInt(0, this.treeImages.length - 1)
        treeImage.src = this.treeImages[randomItem]
        let treeSizeMultiplier = 3
        const realSize = this.size * treeSizeMultiplier
        this.structureList[seed] = {
            image: treeImage,
            position: { x: x - realSize, y: y - realSize },
            treeSize: realSize,
        }
    }

    lakeGenerate(seed, x, y) {
        let actualPosition = {
            x: 0,
            borderUp: 0,
            borderDown: 1,
        }

        const valueX = rng.nextInt(8, 30)
        const valueY = valueX - rng.nextInt(1, 5)

        let lakeSize = {
            x: valueX,
            y: valueY
        }

        const realSize = {
            x: this.size * lakeSize.x,
            y: this.size * lakeSize.y
        }

        for (let i = x; i < x + realSize.x; i += this.size) {
            for (let j = y; j < y + realSize.y; j += this.size) {
                let treeImage = new Image()
                const seed = i * 100000 + j

                if (actualPosition.x < lakeSize.y) { // border left
                    treeImage.src = this.lakeImages[0] // border

                    if (actualPosition.x == 0) { // border corner up
                        treeImage.src = this.lakeImages[1]
                    }

                    if (actualPosition.x > (lakeSize.y - 2) && actualPosition.borderDown < 2) { // border corner down
                        treeImage.src = this.lakeImages[2]
                    }

                }

                if (actualPosition.x > lakeSize.y * (lakeSize.y - 1) - 1) { // border right
                    treeImage.src = this.lakeImages[3]

                    if (actualPosition.x == (lakeSize.x * lakeSize.y) - 1) { // border corner up
                        treeImage.src = this.lakeImages[5]
                    }

                    if (actualPosition.x == lakeSize.y * (lakeSize.x - 1)) { // border corner down
                        treeImage.src = this.lakeImages[4]
                    }

                }

                if (actualPosition.x > lakeSize.y + (lakeSize.y * (actualPosition.borderUp - 1) + (lakeSize.y - 1)) && actualPosition.x < lakeSize.y + (lakeSize.y * (actualPosition.borderUp - 2) + (lakeSize.y + (lakeSize.y + 1)))) {
                    if (actualPosition.borderUp >= (lakeSize.x - 3)) actualPosition.borderUp = 0
                    else actualPosition.borderUp++

                    treeImage.src = this.lakeImages[6]
                } // border up

                if (actualPosition.x < lakeSize.y + (lakeSize.y * actualPosition.borderDown) && actualPosition.x > lakeSize.y + (lakeSize.y * actualPosition.borderDown) - 2) {
                    if (actualPosition.borderDown >= (lakeSize.x - 2)) actualPosition.borderDown = 1
                    else actualPosition.borderDown++

                    treeImage.src = this.lakeImages[7]
                } // border down

                if (actualPosition.x > lakeSize.y * actualPosition.borderDown && actualPosition.x < lakeSize.y * actualPosition.borderDown + (lakeSize.y - 1)) {
                    treeImage.src = this.lakeImages[8]
                } // water


                this.structureList[seed] = {
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
                this.structureList[seed] = {
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
                if (this.structureList[seed]) {
                    ctx.drawImage(this.structureList[seed].image, worldToScreenX(this.structureList[seed].position.x), worldToScreenY(this.structureList[seed].position.y), this.structureList[seed].treeSize, this.structureList[seed].treeSize)
                }
            }
        }
    }

}