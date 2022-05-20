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

const changeColor = (square) => {
    let audio = document.getElementById("audio");
    square.className = square.className == 'cuadrado' ? 'cuadradoOn' : 'cuadrado';
    square.className == 'cuadradoOn' ? audio.play() : false;
}

// Secuencia animada del juego

const lightsSequence = async (time) =>{
    let i = 1;

    if(time == 0){
        return
    }
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

// Prende la secuencia de luces del juego y recibe la dificultad de velocidad

const lightsGameOn = async (positions, difficultyTime) => {
    for(const position of positions){
        await lightsGame(position, difficultyTime);        
    }
}

let select = document.getElementById('difficulty');
let difficulty = 5;

const opcionCambiada = () => {
    difficulty = parseInt(select.value);
  };
  
  select.addEventListener('change', opcionCambiada);

//lightsSequence(80);

// Funcion start game
// Esto no queda asi es solo para el desafio que puedan elegir y 
// ver el cambio. facil son 5 reps. normal 8 reps y dificil 12 reps.
// despues va a avanzar por nivel la velocidad tbn.

const startGame = () => {
    lightsGameOn(squareGenerator(difficulty), 500);
}

//lightsGameOn(squareGenerator(10), 1000);





