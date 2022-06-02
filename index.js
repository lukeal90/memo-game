import {difficultys} from './difficulty.js'

// Seleccion de dificultad
let selectDifficulty = document.getElementById('difficulty');
let difficulty = 0;

selectDifficulty.addEventListener('change', () => {
    difficulty = parseInt(selectDifficulty.value);
});

window.localStorage.clear();

document.getElementById('startButton').addEventListener('click', function () {
    startGame(difficulty);
})

//Funcion start game
const startGame = async (difficulty) => {
    const player = "Lucas"
    savePlayerData(player,0,0);
    const maxLevel = difficultys[difficulty].props.length;
    let positions = [];
    let difficultySelected = difficultys[difficulty];
    let level = 1;
    let velocity;
    const grilla = document.getElementById('grilla');
    let playerLoose = false;
    // To do :hasta que no termine la secuencia que no continue este paso
    // y no pueda clickear nada
    await lightsGameOn(positions, velocity);

    while(level <= maxLevel && !playerLoose) {
        console.log(`Comienzas el nivel: ${level}` );
        velocity = difficultySelected.props[level-1].speed;
        positions = squareGenerator(difficultySelected.props[level-1].squareCant); 
        console.log(positions)
        await resetGameColor(500);
        await startCounter();   
        await lightsGameOn(positions, velocity);
        while(positions.length > 0 && !playerLoose) {
            let correctPosition = await waitForClicks(positions, grilla);
            !correctPosition ? playerLoose = true : false;
        }
        let score = difficultySelected.props[level-1].score;
        savePlayerData(player,score,1);
        level+= 1;
        
    }
    console.log("Termino el juego")  
    //await resetGameColor(2000);
    console.log("termino de resetear color")
}

const createPlayer = (name,score,level) => {
    return {
        name: name,
        score: score,
        levelsPassed: level
    }
}

const savePlayerData = (playerName, score, level) => {
    let playerSaved = localStorage.getItem('player');

    if(playerSaved == null){
        playerSaved = createPlayer(playerName, score, level);
    }else{
        playerSaved = JSON.parse(playerSaved);
        playerSaved['score'] = playerSaved['score'] + score;
        playerSaved['levelsPassed'] = playerSaved['levelsPassed'] + level;
    }
    window.localStorage.setItem('player', JSON.stringify(playerSaved));
}

const waitForClicks = (positions, grilla) => {
    return new Promise((resolve) =>{
        grilla.onclick = (c) => {
            let positionToCompare = positions.shift();
            let positionClicked = c.target;
            let correctPosition = checkSquareClicked(positionClicked, positionToCompare, positions);
            resolve(correctPosition);
        }
    });
}

const checkSquareClicked = (positionClicked, positionToCompare, positions) => {
    let correctPosition = true;
    if (positionClicked.id == positionToCompare) {
        changeColor(positionClicked)
    } else {
        changeColor(positionClicked, true)
        correctPosition = false;
        console.log("Perdiste! Fin del juego!")
    }
    return correctPosition;
}

// Prende la secuencia de luces del juego y recibe la dificultad de velocidad
const lightsGameOn = async (positions, difficultyTime) => {
        for (const position of positions) {
            await lightsGame(position, difficultyTime);
        }
}

// Logica de cambio de color de los cuadrados
const lightsGame = (index, time) => {
    return new Promise((resolve) => {
        let square = document.getElementById(index);
        setTimeout(changeColor.bind(null, square), 400);
        setTimeout(changeColor.bind(null, square), 500);
        setTimeout(() => {
            resolve();
        }, time);
    })
}

// Cambia el color del cuadradrado
const changeColor = (square, error = false) => {
    if (!error) {
        let audio = document.getElementById("audio");
        square.className = square.className == 'cuadrado' ? 'cuadradoOn' : 'cuadrado';
        square.className == 'cuadradoOn' ? audio.play() : false;
    } else {
        square.className = 'cuadradoError';
        let audio = document.getElementById("audioError");
        audio.play()
    }
}

// Resetea todas las luces cuando se pone Start
const resetGameColor = (time) => {
    return new Promise((resolve) => {
        for (let i = 1; i <= 16; i++) {
            let square = document.getElementById(i);
            square.className = 'cuadrado'
        }
        setTimeout(() => {
            resolve();
        }, time);
    })
}

// Secuencia animada del juego
const lightsSequence = async (time) => {
    let i = 1;

    if (time == 0) {
        return
    }
    while (i <= 16) {
        let index = i.toString();
        await lightsGame(i, time);
        i++
        i > 16 ? lightsSequence(time) : false;
    }
}

// Generador de valores para el juego
const squareGenerator = (cantSquares) => {
    let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
    for (let i = numbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    return numbers.slice(0, cantSquares);
}

//lightsSequence(80);

// To Do:

// Falta que cuando se gane se prenda todas las luces de verde y msj ganador.

// Error raro cuando se vuelve a mandar start no refreshea bien el array
// y consulta por el anterior y el actual CORREGIR.

// Que no se puede apretar cuadrados hasta que termine la secuencia.

const secondsCounter = async (counterModal) => {
    let second = 3;
    return await new Promise(resolve => setInterval(() => {
        if (second > 0) {
            counterModal.textContent = second;
            second--
        } else if (second == 0) {
            counterModal.textContent = "Go!"
            second--;
        } else if (second < 0) {
            clearInterval()
            resolve();
        }
    }, 1000));
}

const startCounter = async () => {
    let counterModal = document.createElement('div');
    counterModal.setAttribute('id', 'counter');
    let modalInside = document.createElement('div');
    modalInside.className = 'counter-inside';
    let seconds = document.createTextNode("");
    modalInside.appendChild(seconds);
    counterModal.appendChild(modalInside);

    document.body.appendChild(counterModal)
    await secondsCounter(modalInside);

    counterModal = document.getElementById('counter')
    counterModal.remove();
    //document.body.removeChild(counterModal)
}
// Agregar limite de tiempo para apretar cuadrado, sino pierde. 

// Secuencia de 3 segundos para arrancar el juego.

// Guardar nombre de la persona y puntaje.

// Si pasa de nivel aumentar la velocidad ( 5 levels por dificultad )