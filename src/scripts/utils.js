
const getRandomPointsInsideCanvas = (ctx) => {
    const canvasDimensions = [ctx.canvas.getBoundingClientRect().width, ctx.canvas.getBoundingClientRect().height];
    let generatedPos = canvasDimensions.map(m => Math.floor(Math.random() * m));
    return { x: generatedPos[0], y: generatedPos[1] }
}


const getRandomPointsInsideDimensions = (dim) => {
    let generatedPos = dim.map(m => Math.floor(Math.random() * m));
    return { x: generatedPos[0], y: generatedPos[1] }
}

const distanceBetweenPoints = (x1, x2, y1, y2) => Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2))

const distanceBetweenCharacters = (c1, c2) => distanceBetweenPoints(c1.pos.x, c2.pos.x, c1.pos.y, c2.pos.y)


const generateRandomColor = () => '#' + Math.floor(Math.random() * 16777215).toString(16);

const pointsToVector = (x1, x2, y1, y2) => {
    var dist = Math.ceil(Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2)));
    var angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    angle = angle < 0 ? 360 + angle : angle;
    return { dist, angle };
}


const vectorToPoint = (x, y, angle, distance) => {
    let newPointX = Math.round(Math.cos(angle * Math.PI / 180) * distance + x);
    let newPointY = Math.round(Math.sin(angle * Math.PI / 180) * distance + y);
    return [newPointX, newPointY]
}
