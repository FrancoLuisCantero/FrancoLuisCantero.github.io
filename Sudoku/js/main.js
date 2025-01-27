import { crearTablero, generarBotonesJuegos, reemplazarJuego } from './tablero.js';
import { validarEntrada } from './validaciones.js';
import { resolverJuego, reiniciarJuego, obtenerJuegos } from './sudokuSolver.js';

document.addEventListener('DOMContentLoaded', () => {
  inicializarJuego();
});

function inicializarJuego() {
  const juegos = obtenerJuegos();

  const btnResolver = document.getElementById('btnResolver');
  btnResolver.addEventListener('click', resolverJuego);

  const btnReiniciar = document.getElementById('btnReiniciar');
  btnReiniciar.addEventListener('click', reiniciarJuego);

  generarBotonesJuegos(juegos);

  crearTablero(validarEntrada);
}
