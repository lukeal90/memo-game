import {difficultys} from './difficulty.js'

// Limpiamos el estorage
window.localStorage.clear();
// Seleccion de dificultad
let selectDifficulty = document.getElementById('difficulty');
let difficulty = 0;
// Seleccion nombre del jugador
let playerName = "";

selectDifficulty.addEventListener('change', () => {
    difficulty = parseInt(selectDifficulty.value);
});

document.getElementById('startButton').addEventListener('click', function () {
    if(playerName === "") {
        alertNoNamed();
        return;
    }
    startGame(difficulty);
})

document.getElementById('playerFormButton').addEventListener('click', function () {
    let selectPlayerName = document.getElementById('playerName');
    playerName = selectPlayerName.value;
    createPlayer(playerName,0,0);
    changePlayerInfoTable(playerName,0,0);
    hideInputName(playerName);
})

//Funcion start game
const startGame = async (difficulty) => {
    const maxLevel = difficultys[difficulty].props.length;
    //let player = localStorage.getItem('player');
    let positions = [];
    let difficultySelected = difficultys[difficulty];
    let level = 1;
    let velocity;
    const grilla = document.getElementById('grilla');
    let playerLoose = false;

    await lightsGameOn(positions, velocity);

    while(level <= maxLevel && !playerLoose) {
        console.log(`Comienzas el nivel: ${level}` );
        velocity = difficultySelected.props[level-1].speed;
        positions = squareGenerator(difficultySelected.props[level-1].squareCant); 
        console.log(positions)
        await resetGameColor(500);
        await startCounter(level);   
        await lightsGameOn(positions, velocity);
        while(positions.length > 0 && !playerLoose) {
            let correctPosition = await waitForClicks(positions, grilla);
            !correctPosition ? playerLoose = true : false;
        }
        let score = difficultySelected.props[level-1].score;
        
        if(!playerLoose) {
            savePlayerData(score,level);
            level+= 1;
            showToast(score)
        }
    }

    if(!playerLoose) {
        alertStageClear();
    }else{
        resetPlayerScore();
        alertLoose();
    }
    await resetGameColor(2000);
    return;
}

// Crea al usuario
const createPlayer = (name,score,level) => {
    let player = {
        name: name,
        score: score,
        levelsPassed: level
    }
    window.localStorage.setItem('player', JSON.stringify(player));
}


// Salva la data del usuario
const savePlayerData = (score, level) => {
    let playerSaved = localStorage.getItem('player');
    playerSaved = JSON.parse(playerSaved);
    playerSaved['score'] = playerSaved['score'] + score;
    playerSaved['levelsPassed'] = level;

    changePlayerInfoTable(
        playerSaved['name'],
        playerSaved['score'],
        playerSaved['levelsPassed']
        );
    
    window.localStorage.setItem('player', JSON.stringify(playerSaved));    
}


// Resetea la tabla de valores del juego
const resetPlayerScore = () => {
    let playerSaved = localStorage.getItem('player');
    playerSaved = JSON.parse(playerSaved);
    playerSaved['score'] = 0;
    playerSaved['levelsPassed'] = 0;

    changePlayerInfoTable(
        playerSaved['name'],        
        playerSaved['score'],
        playerSaved['levelsPassed']
        );

    window.localStorage.setItem('player', JSON.stringify(playerSaved));    
}

// Cambia valores en la tabla del juego
const changePlayerInfoTable =  (player, score, level) => {
    let playerName = document.getElementById('playerInfoName');
    let playerScore = document.getElementById('playerInfoScore');
    let playerLevel = document.getElementById('playerInfoLevel');

    playerName.textContent = player;
    playerScore.textContent = score;
    playerLevel.textContent = level;
}

// Espera al click para que luego continue el juego
const waitForClicks = (positions, grilla) => {
    return new Promise((resolve) =>{
        grilla.onclick = (c) => {
            let positionClicked = c.target;
            if(positionClicked.className == 'cuadrado'){
                let positionToCompare = positions.shift();
                let correctPosition = checkSquareClicked(positionClicked, positionToCompare, positions);
                resolve(correctPosition);
            }
        }
    });
}

// Verifica si el cuadrado que se toco es el correcto
const checkSquareClicked = (positionClicked, positionToCompare, positions) => {
    let correctPosition = true;
    if (positionClicked.id == positionToCompare) {
        changeColor(positionClicked)
    } else {
        changeColor(positionClicked, true)
        correctPosition = false;
    }
    return correctPosition;
}

// Prende la secuencia de luces del juego y recibe la dificultad de velocidad
const lightsGameOn = async (positions, difficultyTime) => {
        for (const position of positions) {
            await lightsGame(position, difficultyTime);
        }
}

// Toma la secuencia de cuadrados y cambiar el color con un tiempo a cada uno
const lightsGame = (index, time, sound = "on") => {
    return new Promise((resolve) => {
        let square = document.getElementById(index);
        setTimeout(changeColor.bind(null, square, false,sound), 400);
        setTimeout(changeColor.bind(null, square, false, sound), 500);
        setTimeout(() => {
            resolve();
        }, time);
    })
}

// Cambia el color del cuadradrado
const changeColor = (square, error = false, sound = "on") => {
    if (!error) {
        let audio = document.getElementById("audio");
        square.className = square.className == 'cuadrado' ? 'cuadradoOn' : 'cuadrado';
        (square.className == 'cuadradoOn' && sound == "on") ? audio.play() : false;
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

// Generador de valores para el juego
const squareGenerator = (cantSquares) => {
    let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
    for (let i = numbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    return numbers.slice(0, cantSquares);
}

// Cuenta regresiva 3,2,1..
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

// Crea modal del contador
const startCounter = async (level) => {
    let counterModal = document.createElement('div');
    counterModal.setAttribute('id', 'counter');
    let modalInside = document.createElement('div');
    modalInside.className = 'counter-inside';
    let seconds = document.createTextNode(`Lv ${level}`);
    modalInside.appendChild(seconds);
    counterModal.appendChild(modalInside);

    document.body.appendChild(counterModal)
    await secondsCounter(modalInside);

    counterModal = document.getElementById('counter')
    counterModal.remove();
}

// Esconde el nombre luego de que lo pone.
const hideInputName = (playerName) => {
    let form = document.getElementById('playerForm');
    playerName.trim().length !== 0 ? form.style.display = "none" : false;
}

// Muestra puntaje por level
const showToast = (puntos) => {
    Toastify({
        text: "Ganaste! Sumaste " + puntos + " puntos!",
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
        onClick: function(){} 
      }).showToast();
}

// Alerta que falta nombre
const alertNoNamed = () => {
    Swal.fire({
        title: 'Tenes que ponerte un nombre antes de arrancar el juego!',
        icon: 'warning',
        confirmButtonText: 'Ok!'
      })
}

// Alerta paso de nivel
const alertStageClear = () => {
    Swal.fire({
        title: `Lo lograste! Pasaste la dificultad!`,
        icon: 'success',
        confirmButtonText: 'Ok!'
      })
}

// Alerta perdio
const alertLoose = () => {
    Swal.fire({
        title: `Perdiste! Volve a intentarlo!`,
        icon: 'error',
        confirmButtonText: 'Ok!'
      })
}
// Secuencia de juego animada a futuro. 
// const lightsSequence = async () => {
//     let i = 1;
//     while (i <= 16) {
//         let index = i.toString();
//         await lightsGame(i, 100, "off");
//         i++
//         i > 16 ? lightsSequence(100) : false;
//     }
// }