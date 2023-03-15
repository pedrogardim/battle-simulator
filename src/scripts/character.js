class Character {
    constructor(battle, id) {
        this.id = id;
        this.battle = battle;
        //this.pos = getRandomPointsInsideCanvas(battle.ctx);
        this.pos = getRandomPointsInsideDimensions(battle.mapSize);
        this.hp = 50;
        this.maxHp = 50;
        this.mp = 20;
        this.color = generateRandomColor()
        this.class = "Warrior";
        this.target = null;
        this.range = 40;
        this.minimumRange = 20;
        this.direction = 0;
        this.speed = 1;
        this.size = 10
        this.attackPoints = 10;
        this.attackSpeed = 2 * 60;
        this.attackCooldown = this.attackSpeed;
        this.renderer = new CharacterRenderer(this)
        this.dead = false;
        this.retargetCicle = 0;
    }
    lookForTarget() {
        let charactersDistances = this.battle.characters
            .filter(e => e.id !== this.id)
            .filter(e => !e.dead)
            .map(e => distanceBetweenCharacters(this, e));
        let min = charactersDistances.indexOf(Math.min(...charactersDistances));

        let newTarget = this.battle.characters.filter(e => e.id !== this.id)[min];

        this.target = newTarget;
        this.direction = pointsToVector(this.pos.x, this.target.pos.x, this.pos.y, this.target.pos.y).angle;

    }
    walk() {
        //console.log('walk')
        let newPos = vectorToPoint(this.pos.x, this.pos.y, this.direction, this.speed)
        this.pos.x = newPos[0]
        this.pos.y = newPos[1]
    }
    backOff() {
        //console.log('walk')
        let newPos = vectorToPoint(this.pos.x, this.pos.y, this.direction, -this.speed)
        this.pos.x = newPos[0]
        this.pos.y = newPos[1]
    }
    attack() {
        if (this.attackCooldown < this.attackSpeed) {
            this.attackCooldown++;
            return
        }
        this.attackCooldown = 0;
        this.target.hp = this.target.hp - this.attackPoints;
        this.renderer.attAnimFrame = 10;
        console.log(this.id + " attacked " + this.target.id + "," + this.target.hp);

    }
    onDeath() {
        this.dead = true;
        this.battle.characters.filter(e => e !== this.id);
        delete this;
    }
    onTick() {
        if (this.hp <= 0) {
            this.onDeath();
            return
        }
        if (this.target === null || this.target.dead) {
            this.lookForTarget();
            return;
        }
        if (this.target) {
            this.direction = pointsToVector(this.pos.x, this.target.pos.x, this.pos.y, this.target.pos.y).angle;
        }
        if (Math.abs(distanceBetweenCharacters(this, this.target) - this.range) < 5) {
            this.attack();
            return;
        }
        else {
            if (distanceBetweenCharacters(this, this.target) > this.range) {
                this.walk();
                return;
            }
            if (distanceBetweenCharacters(this, this.target) < this.range) {
                this.backOff();
                return;
            }
        }
        if (this.retargetCicle > 30) {
            this.lookForTarget(true);
            this.retargetCicle = 0;

        }
        this.retargetCicle++;

    }
    render(ctx) {
        if (this.dead) return;
        this.onTick();
        this.renderer.render(ctx, this)
    }
}



class CharacterRenderer {
    constructor(char) {
        this.char = char;
        this.attAnimFrame = 0;
    }
    renderHpBar(ctx) {
        let hpBarPos = [this.char.pos.x - 25, this.char.pos.y - 30]

        ctx.beginPath();
        ctx.fillStyle = '#000000';
        ctx.rect(...hpBarPos, 50, 5);
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = '#eb4034';
        ctx.rect(...hpBarPos, 50 * (this.char.hp / this.char.maxHp), 5);
        ctx.fill();
    }

    renderCooldownBar(ctx) {
        let hpBarPos = [this.char.pos.x - 25, this.char.pos.y - 25]

        ctx.beginPath();
        ctx.fillStyle = '#000000';
        ctx.rect(...hpBarPos, 50, 1);
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = 'cyan';
        ctx.rect(...hpBarPos, 50 * (this.char.attackCooldown / this.char.attackSpeed), 1);
        ctx.fill();

    }

    renderDirArrow(ctx) {
        ctx.beginPath();
        ctx.moveTo(...vectorToPoint(this.char.pos.x, this.char.pos.y, this.char.direction, 20));
        ctx.lineTo(...vectorToPoint(this.char.pos.x, this.char.pos.y, this.char.direction + 20, 15));
        ctx.lineTo(...vectorToPoint(this.char.pos.x, this.char.pos.y, this.char.direction - 20, 15));
        ctx.lineTo(...vectorToPoint(this.char.pos.x, this.char.pos.y, this.char.direction, 20));
        ctx.stroke();

    }

    renderAttackEffect(ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(...vectorToPoint(this.char.pos.x, this.char.pos.y, this.char.direction, 20));
        ctx.lineTo(...vectorToPoint(this.char.pos.x, this.char.pos.y, this.char.direction + 50, 15));
        ctx.lineTo(...vectorToPoint(this.char.pos.x, this.char.pos.y, this.char.direction - 50, 15));
        ctx.lineTo(...vectorToPoint(this.char.pos.x, this.char.pos.y, this.char.direction, 20));
        ctx.fill();
        this.attAnimFrame--;
    }

    render(ctx, char) {
        this.char = char;
        ctx.strokeStyle = this.char.color;
        ctx.beginPath();
        ctx.arc(this.char.pos.x, this.char.pos.y, this.char.size, 0, 2 * Math.PI);
        ctx.stroke();
        this.renderHpBar(ctx);
        this.renderCooldownBar(ctx);
        if (this.char.direction) this.renderDirArrow(ctx);
        if (this.attAnimFrame > 0) this.renderAttackEffect(ctx);
    }

}


