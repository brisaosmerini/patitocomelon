const game = document.getElementById("game");
const duck = document.getElementById("duck");
const scoreText = document.getElementById("score");
const gameOverText = document.getElementById("gameOver");
const vidasText = document.getElementById("vidas");
const musica = document.getElementById("musica");

let score = 0;
let vidas = 3;
let gameOver = false;

let duckX = window.innerWidth / 2;

let leftPressed = false;
let rightPressed = false;

let musicaIniciada = false;

function iniciarMusica(){
    if(!musicaIniciada){
        musica.play();
        musicaIniciada = true;
    }
}

document.addEventListener("keydown", (e) => {
    if(e.key === "ArrowLeft" || e.key === "ArrowRight"){
        iniciarMusica();
    }

    if(gameOver && e.key.toLowerCase() === "r"){
        location.reload();
    }

    if(e.key === "ArrowLeft"){
        leftPressed = true;
    }

    if(e.key === "ArrowRight"){
        rightPressed = true;
    }
});

document.addEventListener("keyup", (e) => {
    if(e.key === "ArrowLeft"){
        leftPressed = false;
    }

    if(e.key === "ArrowRight"){
        rightPressed = false;
    }
});

function actualizarVidas(){
    if(vidas === 3) vidasText.textContent = "❤️❤️❤️";
    if(vidas === 2) vidasText.textContent = "❤️❤️";
    if(vidas === 1) vidasText.textContent = "❤️";

    if(vidas <= 0){
        gameOver = true;
        gameOverText.innerHTML = `
            <h1>GAME OVER</h1>
            <p>Te quedaste sin vidas</p>
            <p>Presiona R para reiniciar</p>
        `;
        gameOverText.style.display = "block";
    }
}

function moverPato(){
    if(leftPressed){
        duckX -= 15;
    }

    if(rightPressed){
        duckX += 15;
    }

    if(duckX < 0){
        duckX = 0;
    }

    if(duckX > window.innerWidth - duck.offsetWidth){
        duckX = window.innerWidth - duck.offsetWidth;
    }

    duck.style.left = duckX + "px";

    requestAnimationFrame(moverPato);
}

moverPato();

function crearObjeto(){
    if(gameOver) return;

    const item = document.createElement("img");

    const tipo = Math.floor(Math.random() * 3);

    if(tipo === 0){
        item.src = "pez.png";
        item.dataset.tipo = "pez";
    }
    else if(tipo === 1){
        item.src = "impostor.png";
        item.dataset.tipo = "malo";
    }
    else{
        item.src = "impostor2.png";
        item.dataset.tipo = "malo";
    }

    item.classList.add("item");

    let x = Math.random() * (window.innerWidth - 100);

    item.style.left = x + "px";
    item.style.top = "-100px";

    game.appendChild(item);

    let y = -100;

    const caer = setInterval(() => {
        if(gameOver){
            clearInterval(caer);
            return;
        }

        y += 5;
        item.style.top = y + "px";

        const duckRect = duck.getBoundingClientRect();
        const itemRect = item.getBoundingClientRect();

        if(
            duckRect.left < itemRect.right &&
            duckRect.right > itemRect.left &&
            duckRect.top < itemRect.bottom &&
            duckRect.bottom > itemRect.top
        ){
            if(item.dataset.tipo === "pez"){
                score++;
                scoreText.textContent = "Puntos: " + score;
            } else {
                vidas--;
                actualizarVidas();
            }

            item.remove();
            clearInterval(caer);
        }

        if(y > window.innerHeight){
            if(item.dataset.tipo === "pez"){
                vidas--;
                actualizarVidas();
            }

            item.remove();
            clearInterval(caer);
        }

    }, 16);
}

setInterval(crearObjeto, 700);