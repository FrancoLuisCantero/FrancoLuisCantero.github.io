// Inicialización de variables
let tarjetasDestapadas = 0;
let tarjeta1 = null;
let tarjeta2 = null;
let primerResultado = null;
let segundoResultado = null;
let movimientos = 0;
let aciertos = 0;
let temporizador = false;
let timer = 30;
let timerInicial = 30;
let tiempoRegresivoId = null;

// Variables de audios
// let winAudio = new Audio('./sounds/win.wav');
let winAudio = new Audio('./sounds/win.ogg');
let loseAudio = new Audio('./sounds/lose.wav');
let clickAudio = new Audio('./sounds/click.wav');
let rightAudio = new Audio('./sounds/right.wav');
let wrongAudio = new Audio('./sounds/wrong.wav');
let initAudio = new Audio('./sounds/init.wav');

// Apuntando a documento HTML
let mostrarMovimientos = document.getElementById('movimientos')
let mostrarAciertos = document.getElementById('aciertos')
let mostrarTiempo = document.getElementById('tiempo-restante')

// Generación de números aleatorios
let numeros = [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8];
numeros = numeros.sort(()=>{return Math.random() - 0.5})

// Función del temporizador
function contarTiempo() {
  tiempoRegresivoId = setInterval(() => {
    timer--;
    mostrarTiempo.innerHTML = `Tiempo: ${timer} segundos`;
    if (timer == 0) {
      clearInterval(tiempoRegresivoId);
      bloquearTarjetas();
      loseAudio.play();
    }
  }, 1000);
}

// Función bloquear tarjetas

function bloquearTarjetas() {
  for (let i = 0; i <= 15; i++) {
    let tarjetaBloqueada = document.getElementById(i);
    tarjetaBloqueada.innerHTML = `<img src=./images/${numeros[i]}.png>`;
    tarjetaBloqueada.disabled = true;
  }
}


// Función principal
function destapar(id) {
  if (movimientos == 0 && tarjetasDestapadas != 2){
    initAudio.play()
  }

  if(temporizador == false){
    contarTiempo();
    temporizador = true;
  }

  tarjetasDestapadas++;

  if (tarjetasDestapadas == 1){
    // Mostrar primer número
    tarjeta1 = document.getElementById(id)
    primerResultado = numeros[id]
    tarjeta1.innerHTML = `<img src=./images/${primerResultado}.png>`;
    clickAudio.play();

    // Deshabilitar segundo botón
    tarjeta1.disabled = true
    
  } else if (tarjetasDestapadas == 2){
    // Mostrar segundo número
    tarjeta2 = document.getElementById(id)
    segundoResultado = numeros[id]
    tarjeta2.innerHTML = `<img src=./images/${segundoResultado}.png>`
    
    // Deshabilitar segundo botón
    tarjeta2.disabled = true

    // Incrementar movimientos
    movimientos++;
    mostrarMovimientos.innerHTML = `Movimientos: ${movimientos}`;
    
    if (primerResultado == segundoResultado) {
      // Limpiar contador de tarjetas destapadas
      tarjetasDestapadas = 0;
      
      rightAudio.play();
      //Aumentar aciertos
      aciertos++;
      mostrarAciertos.innerHTML = `Aciertos: ${aciertos}`
      
      if(aciertos == 8) {
        clearInterval(tiempoRegresivoId)
        mostrarAciertos.innerHTML = `Aciertos: ${aciertos} 🥳🥳`;
        mostrarTiempo.innerHTML = `Fantástico! 🎉 Sólo demoraste ${timerInicial - timer} segundos`;
        mostrarMovimientos.innerHTML = `Movimientos: ${movimientos} 🤟😎`;
        winAudio.play()
      }

    } else {
      wrongAudio.play()
      // Mostrar valores y volver a tapar
      setTimeout(()=>{
        tarjeta1.innerHTML = ' ';
        tarjeta2.innerHTML = ' ';
        tarjeta1.disabled = false;
        tarjeta2.disabled = false;
        tarjetasDestapadas = 0;
      }, 800)
    }
  }
}