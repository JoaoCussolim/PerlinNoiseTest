class PerlinNoise {
    constructor(initialX, initialY, finalX, finalY, seed, octaves, output) {
        this.initialX = initialX
        this.initialY = initialY
        this.finalX = finalX
        this.finalY = finalY
        this.seed = seed
        this.octaves = octaves
        this.output = output
    }

    generateNoise() {
        for (let x = this.initialX; (x) < this.finalX; x += lineSpace) {
            for (let y = this.initialY; (y) < this.finalY; y += lineSpace) {
                let fNoise = 0;
                let scaleAcc = 0
                let perlinScale = 1
                let nPitch = this.finalX;
                for (let o = 0; o < this.octaves; o++) {
                    nPitch = Math.max(1, Math.floor(nPitch / 2));
                    let nSample1X = Math.floor(x / nPitch) * nPitch;
                    let nSample1Y = Math.floor(y / nPitch) * nPitch;
                    let nSample2X = (nSample1X + nPitch) % this.finalX
                    let nSample2Y = (nSample1Y + nPitch) % this.finalY
                    let fBlendX = (x - nSample1X) / nPitch
                    let fBlendY = (y - nSample1Y) / nPitch

                    let fSampleT = (1 - fBlendX) * this.seed[nSample1Y * this.finalX + nSample1X] + fBlendX * this.seed[nSample1Y * this.finalX + nSample2X]
                    let fSampleB = (1 - fBlendX) * this.seed[nSample2Y * this.finalX + nSample1X] + fBlendX * this.seed[nSample2Y * this.finalX + nSample2X]
                    fNoise += (fBlendY * (fSampleB - fSampleT) + fSampleT) * perlinScale
                    scaleAcc += perlinScale

                    perlinScale /= 2
                }
                this.output[y * this.finalX + x] = fNoise / scaleAcc
            }
        }
    }

    generateSeed() {
        for (let i = 0; i < this.finalX * this.finalY; i++) {
            this.seed[i] = rng.nextFloat(0, 1)
        }
    }

    draw() {
        for (let x = this.initialX; x < this.finalX; x += lineSpace) {
            for (let y = this.initialY; y < this.finalY; y += lineSpace) {
                let pixelBw = Math.floor(this.output[y * this.finalX + x] * 11)
                let bg_col = 'grey'
                switch (pixelBw) {
                    case 0:
                        bg_col = 'black'
                        break;
                    case 1:
                        bg_col = 'white'
                        break;
                    case 2:
                        bg_col = 'blue'
                        break;
                    case 3:
                        bg_col = 'red'
                        break;
                    case 4:
                        bg_col = 'cyan'
                        break;
                    case 5:
                        bg_col = 'yellow'
                        break;
                    case 6:
                        bg_col = 'green'
                        break;
                    case 7:
                        bg_col = 'purple'
                        break;
                    case 8:
                        bg_col = 'brown'
                        break;
                    case 9:
                        bg_col = 'pink'
                        break;
                    case 10:
                        bg_col = 'orange'
                        break;
                }
                ctx.fillStyle = bg_col
                ctx.fillRect(worldToScreenX(x), worldToScreenY(y), lineSpace, lineSpace)
            }
        }
    }
}

class Chunk {
    constructor(chunkSize, initialX, initialY, finalX, finalY, seed, octaves, output) {
        this.chunkSize = chunkSize;
        this.initialX = initialX;
        this.initialY = initialY;
        this.possibleFinalX = finalX
        this.possibleFinalY = finalY
        this.output = output
        this.seed = seed;
        this.octaves = octaves;
        this.chunkValues = output
        this.valid = false;
        this.perlinNoise = new PerlinNoise(
            initialX, initialY, chunkSize, chunkSize, seed, octaves, output
        );
    }

    generate() {
        this.perlinNoise.generateSeed();
        this.perlinNoise.generateNoise();
        this.valid = true;
    }

    updateChunks(Ix, Iy) {
        let fNoise = 0;
        let scaleAcc = 0
        let perlinScale = 1
        let nPitch = this.chunkSize;
        for (let o = 0; o < this.octaves; o++) {
            nPitch = Math.max(1, Math.floor(nPitch / 2));
            let nSample1X = Math.floor(Ix / nPitch) * nPitch;
            let nSample1Y = Math.floor(Iy / nPitch) * nPitch;
            let nSample2X = (nSample1X + nPitch) % this.chunkSize
            let nSample2Y = (nSample1Y + nPitch) % this.chunkSize
            let fBlendX = (Ix - nSample1X) / nPitch
            let fBlendY = (Iy - nSample1Y) / nPitch

            let fSampleT = (1 - fBlendX) * this.seed[nSample1Y * this.chunkSize + nSample1X] + fBlendX * this.seed[nSample1Y * this.chunkSize + nSample2X]
            let fSampleB = (1 - fBlendX) * this.seed[nSample2Y * this.chunkSize + nSample1X] + fBlendX * this.seed[nSample2Y * this.chunkSize + nSample2X]
            fNoise += (fBlendY * (fSampleB - fSampleT) + fSampleT) * perlinScale
            scaleAcc += perlinScale

            perlinScale /= 2
        }
        if (!this.output[Iy * this.chunkSize + Ix]) this.output[Iy * this.chunkSize + Ix] = fNoise / scaleAcc
    }

    updateNegativeSeed(Fx, Fy) {
        for (let i = -(Fx * Fy); i < (Fx * Fy); i++) {
            if (!this.seed[i]) this.seed[i] = rng.nextFloat(0, 1)
        }
    }

    updatePositiveSeed(Fx, Fy) {
        for (let i = 0; i < (Fx * Fy); i++) {
            if (!this.seed[i]) this.seed[i] = rng.nextFloat(0, 1)
        }
    }

    getVisible() {
        const stwChunkx = screenToWorldX(canvas.width) + lineSpace
        const stwChunky = screenToWorldY(canvas.height) + lineSpace

        const visibleSection = [];
        for (let y = this.initialY; y < stwChunky; y += lineSpace) {
            for (let x = this.initialX; x < stwChunkx; x += lineSpace) {
                let outputIndex = y * this.chunkSize + x
                if (!this.output[outputIndex]) {
                    if (!this.seed[outputIndex]) {
                        this.updateNegativeSeed(x, y)
                    }
                    this.updateChunks(x, y)

                }
                visibleSection.push({
                    x: x,
                    y: y,
                    value: this.output[outputIndex]
                });
            }
        }
        return visibleSection;
    }

    draw() {
        const visibleSection = this.getVisible();
        for (const { x, y, value } of visibleSection) {
            let pixelBw = Math.floor(value * 11);
            let bg_col = 'grey';
            switch (pixelBw) {
                case 0: bg_col = 'black'; break;
                case 1: bg_col = 'white'; break;
                case 2: bg_col = 'blue'; break;
                case 3: bg_col = 'red'; break;
                case 4: bg_col = 'cyan'; break;
                case 5: bg_col = 'yellow'; break;
                case 6: bg_col = 'green'; break;
                case 7: bg_col = 'purple'; break;
                case 8: bg_col = 'brown'; break;
                case 9: bg_col = 'pink'; break;
                case 10: bg_col = 'orange'; break;
            }
            ctx.fillStyle = bg_col;
            ctx.fillRect(
                worldToScreenX(x),
                worldToScreenY(y),
                lineSpace,
                lineSpace
            );
        }
    }

    update() {
        this.draw()
    }
}
