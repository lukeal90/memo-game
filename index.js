// Seleccion de dificultad
let selectDifficulty = document.getElementById('difficulty');
let difficulty = 5;

selectDifficulty.addEventListener('change', () => {
    difficulty = parseInt(selectDifficulty.value);
});

// Funcion start game
const startGame = () => {
    resetGameColor();
    // Genera los cuadrados en base a la dificultad
    let positions = [];
    positions = squareGenerator(difficulty);
    const grilla = document.getElementById('grilla');

    console.log(positions);
    // To do : Aca agregar un conteo 3,2,1 Start!
    // Arranca el juego prende las luces
    lightsGameOn(positions, 500);
    // To do :hasta que no termine la secuencia que no continue este paso
    // y no pueda clickear nada

    grilla.addEventListener('click', (c) => {
        let positionToCompare = positions.shift();
        console.log("Es esta posicion " , positionToCompare)
        let positionClicked = c.target;
        console.log("Aprete esta " ,c.target.id)
        console.log("Quedan " ,positions)
        if(positionClicked.id == positionToCompare){
            changeColor(positionClicked)
        }else{
            changeColor(positionClicked, true)
            console.log("Perdiste! Volve a intentar!")
        }        
    });
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
        return new Promise( (resolve, reject )=>{
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

//lightsSequence(80);

// To Do:

// Si se repite la misma luz volver a repetir sonido.

// Falta que cuando se gane se prenda todas las luces de verde y msj ganador.

// Intentos por si falla. 3 vidas.

// Error raro cuando se vuelve a mandar start no refreshea bien el array
// y consulta por el anterior y el actual CORREGIR.

// Que no se puede apretar cuadrados hasta que termine la secuencia.

// Agregar limite de tiempo para apretar cuadrado, sino pierde. 

// Secuencia de 3 segundos para arrancar el juego.

// Guardar nombre de la persona y puntaje.

// Si pasa de nivel aumentar la velocidad ( 5 levels por dificultad )