class RandomNumberGenerator {
    constructor(seed = 0xdeadbeef) {
        this.state = seed
    }

    next() {
        this.state ^= (this.state >> 13)
        this.state ^= (this.state << 17)
        this.state ^= (this.state >> 19)
        return this.state
    }

    nextFloat(min, max) {
        const randomFloat = (this.next() >>> 0) / 0xFFFFFFFF * 2;
        return min + (max - min) * randomFloat;
    }

    nextInt(min, max) {
        const range = max - min + 1;
        const randomInt = (this.next() >>> 0) % range;
        return min + randomInt;
    }

    static randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}