export function crearTablero(validarEntrada) {
  const tablero = document.getElementById("tablero");
  const medidaCuadrícula = 9;

  for (let fila = 0; fila < medidaCuadrícula; fila++) {
    const nuevaFila = document.createElement('tr');
    for (let columna = 0; columna < medidaCuadrícula; columna++) {
      const celda = document.createElement('td');
      const input = document.createElement('input');
      input.type = "number";
      input.className = "celda";
      input.id = `celda-${fila}-${columna}`;
      input.addEventListener('input', (event) => validarEntrada(event, fila, columna));

      celda.appendChild(input);
      nuevaFila.appendChild(celda);
    }
    tablero.appendChild(nuevaFila);
  }
}

export function generarBotonesJuegos(juegos) {
  const botonesJuegos = document.getElementById('botonesJuegos');
  juegos.forEach((juego, index) => {
    const juegoDiv = document.createElement('div');
    juegoDiv.classList.add('juego');

    const img = document.createElement('img');
    img.src = `./img/${index + 1}.png`;
    img.alt = `Imagen de Juego ${index + 1}`;
    img.classList.add('imagenJuego');

    const button = document.createElement('button');
    button.textContent = `Juego ${index + 1}`;
    button.classList.add('botonJuego');
    button.addEventListener('click', () => reemplazarJuego(juego));

    juegoDiv.appendChild(img);
    juegoDiv.appendChild(button);
    botonesJuegos.appendChild(juegoDiv);
  });
}



export function reemplazarJuego(datos) {
  const medidaCuadricula = 9;
  for (let fila = 0; fila < medidaCuadricula; fila++) {
    for (let col = 0; col < medidaCuadricula; col++) {
      const celdaId = `celda-${fila}-${col}`;
      const celda = document.getElementById(celdaId);
      celda.value = datos[fila][col] === null ? "" : datos[fila][col];
      celda.classList.remove("entradaUsuario");
      celda.classList.remove("resolverEfecto");
    }
  }
}
