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
    square.className = square.className == 'cuadrado' ? 'cuadradoOn' : 'cuadrado';
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

// Prende la secuencia de luces del juego y recibe la dificultad de velocidad

const lightsGameOn = async (positions, difficultyTime) =>{
    for(const position of positions){
        await lightsGame(position, difficultyTime);        
    }
}

// Funcion start game

const startGame = () => {
    lightsGameOn(squareGenerator(5), 500);
}

//lightsGameOn(squareGenerator(10), 1000);

//lightsSequence(80);

