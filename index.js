function lightsGame(index){
        return new Promise( (resolve, reject )=>{
            let square = document.getElementById(index);
            setTimeout(changeColor.bind(null, square), 1000);
            setTimeout(changeColor.bind(null, square), 1500);
            setTimeout(() => {
                resolve();
            }, 100);     
        }
        ) 
}

function changeColor(square){
    square.className = square.className == 'cuadrado' ? 'cuadradoOn' : 'cuadrado';
}

async function lightsSequence(){
    let i = 1;
    while(i <= 16){
        let index = i.toString();
        await lightsGame(i);
        i++
    if(i > 16){
        lightsSequence();
    }    
    }
}

lightsSequence();




