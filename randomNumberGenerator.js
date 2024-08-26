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
        // Generate a float between 0 (inclusive) and 1 (exclusive)
        const randomFloat = (this.next() >>> 0) / 0xFFFFFFFF * 2;
        // Scale to the range [min, max]
        return min + (max - min) * randomFloat;
    }

    nextInt(min, max) {
        // Generate a random integer within the range [0, 2^32 - 1]
        const range = max - min + 1;
        const randomInt = (this.next() >>> 0) % range;
        // Scale to the range [min, max]
        return min + randomInt;
    }

    static randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}