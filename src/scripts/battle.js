class Battle {
    constructor(ctx) {
        this.mapSize = [1920, 1080];
        this.characters = this.spawnCharacters(100);
    }
    spawnCharacters(num) {
        return Array(num).fill(0).map((e, id) => new Character(this, id))
    }
    render(ctx) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        this.characters.map(e => e.render(ctx))
    }

}