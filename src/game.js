
const createGame = () => {
    const mainBattle = new Battle();
    drawBattle(mainBattle)
}

const drawBattle = (battle) => {
    const canvas = document.getElementById('main-view');
    const ctx = canvas.getContext('2d');
    canvas.height = canvas.getBoundingClientRect().height;
    canvas.width = canvas.getBoundingClientRect().width;
    ctx.strokeStyle = '#96948c';
    const animate = () => {
        setTimeout(() => {
            battle.render(ctx);
            window.requestAnimationFrame(animate)
        }, 1000 / 60);
        ;
    }

    animate();
}

createGame();