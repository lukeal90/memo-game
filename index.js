// Seleccion de dificultad
let selectDifficulty = document.getElementById('difficulty');
let difficulty = 5;

selectDifficulty.addEventListener('change', () => {
    difficulty = parseInt(selectDifficulty.value);
});

// Funcion start game
const startGame = async () => {
    resetGameColor();
    await startCounter();
    let positions = [];
    // Genera los cuadrados en base a la dificultad
    positions = squareGenerator(difficulty);
    const grilla = document.getElementById('grilla');

    console.log(positions);
    // To do : Aca agregar un conteo 3,2,1 Start!
    // Arranca el juego prende las luces
    lightsGameOn(positions, 500);
    // To do :hasta que no termine la secuencia que no continue este paso
    // y no pueda clickear nada

    // Cambiar por onClick
    grilla.onclick = (c) => {
        let positionToCompare = positions.shift();
        console.log("Es esta posicion " , positionToCompare)
        let positionClicked = c.target;
        console.log("Aprete esta " ,c.target.id)
        console.log("Quedan " ,positions)
        if(positionClicked.id == positionToCompare){
            changeColor(positionClicked)
            positions.length == 0 ? console.log('Ganaste!') : false;
        }else{
            changeColor(positionClicked, true)
            console.log("Perdiste! Volve a intentar!")
        }        
    };
}

// No funca ERROR RARO ver mañana. 

// const checkSquareClicked = ( position, clicked ) => {
//     if(position == clicked){
//         changeColor(position);
//     }else{
//         changeColor(position, true);
//         console.log("Perdiste! Volve a intentar!");
//     }
// }

// Prende la secuencia de luces del juego y recibe la dificultad de velocidad
const lightsGameOn = async (positions, difficultyTime) => {
    for(const position of positions){
        await lightsGame(position, difficultyTime);        
    }
}

// Logica de cambio de color de los cuadrados

const lightsGame = (index, time) => {
        return new Promise( (resolve)=>{
            let square = document.getElementById(index);
            setTimeout(changeColor.bind(null, square), 1000);
            setTimeout(changeColor.bind(null, square), 1100);
            setTimeout(() => {
                resolve();
            }, time);     
        }
    ) 
}

// Cambia el color del cuadradrado
const changeColor = (square, error = false) => {
    if(!error){
       let audio = document.getElementById("audio");
        square.className = square.className == 'cuadrado' ? 'cuadradoOn' : 'cuadrado';
        square.className == 'cuadradoOn' ? audio.play() : false;
    }else{
        square.className = 'cuadradoError';
        let audio = document.getElementById("audioError");
        audio.play()
    }

}

// Resetea todas las luces cuando se pone Start
const resetGameColor = () => {
    for (let i = 1; i < 16; i++) {
        let square = document.getElementById(i);
        square.className = 'cuadrado'
    }
}

// Secuencia animada del juego

const lightsSequence = async (time) =>{
    let i = 1;
    while(i <= 16){
        let index = i.toString();
        await lightsGame(i, time);
        i++
    i > 16 ? lightsSequence(time) : false ;    
    }
}


// Generador de valores para el juego

const squareGenerator = (cantSquares) => {
    return Array.from({length: cantSquares}, () => Math.floor(Math.random() * 16 + 1));
}

lightsGameOn(squareGenerator(10), 1000);

//lightsSequence(80);

// Si pasa de nivel aumentar la velocidad ( 5 levels por dificultad )

const secondsCounter = async (counterModal) => {
    let second = 3;
    return await new Promise(resolve => setInterval(() => {
        if(second > 0){
            counterModal.textContent = second;
            second--
        }else{
            clearInterval()
            resolve();
        }        
    },1000));
}

const startCounter = async () => {
    let counterModal = document.createElement('div');
    counterModal.className = 'counter';
    let modalInside = document.createElement('div');
    modalInside.className = 'counter-inside';
    let seconds = document.createTextNode("");
    modalInside.appendChild(seconds);
    counterModal.appendChild(modalInside);

    document.body.appendChild(counterModal)
    await secondsCounter(modalInside);

    counterModal = document.getElementsByClassName('counter')
    console.log(counterModal)
    document.body.removeChild(counterModal)
}
