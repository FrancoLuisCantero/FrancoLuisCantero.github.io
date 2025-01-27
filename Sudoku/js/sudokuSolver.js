import { juegos } from "./juegos.js";

export function obtenerJuegos() {
  return juegos;
}

export async function resolverJuego() {
  const medidaCuadricula = 9;
  const listaSudoku = obtenerDatosTablero(medidaCuadricula);

  marcarEntradasUsuario(listaSudoku);

  if (maestroSudoku(listaSudoku)) {
    await mostrarSolucion(listaSudoku);
  }
}


export function reiniciarJuego() {
  const medidaCuadricula = 9;
  for (let fila = 0; fila < medidaCuadricula; fila++) {
    for (let col = 0; col < medidaCuadricula; col++) {
      const celdaId = `celda-${fila}-${col}`;
      const celda = document.getElementById(celdaId);
      celda.value = "";
      celda.classList.remove("entradaUsuario");
      celda.classList.remove("resolverEfecto");
    }
  }
}

function obtenerDatosTablero(medidaCuadricula) {
  const listaSudoku = [];

  for (let fila = 0; fila < medidaCuadricula; fila++) {
    listaSudoku[fila] = [];
    for (let col = 0; col < medidaCuadricula; col++) {
      const celdaId = `celda-${fila}-${col}`;
      const celdaValor = document.getElementById(celdaId).value;
      listaSudoku[fila][col] = celdaValor === "" ? 0 : parseInt(celdaValor);
    }
  }

  return listaSudoku;
}

function marcarEntradasUsuario(listaSudoku) {
  const medidaCuadricula = 9;

  for (let fila = 0; fila < medidaCuadricula; fila++) {
    for (let col = 0; col < medidaCuadricula; col++) {
      const celdaId = `celda-${fila}-${col}`;
      const celda = document.getElementById(celdaId);

      if (listaSudoku[fila][col] != 0) {
        celda.classList.add("entradaUsuario");
      }
    }
  }
}

async function mostrarSolucion(listaSudoku) {
  const medidaCuadricula = 9;

  for (let fila = 0; fila < medidaCuadricula; fila++) {
    for (let col = 0; col < medidaCuadricula; col++) {
      const celdaId = `celda-${fila}-${col}`;
      const celda = document.getElementById(celdaId);

      if (!celda.classList.contains("entradaUsuario")) {
        celda.value = listaSudoku[fila][col] === 0 ? "" : listaSudoku[fila][col];
        celda.classList.add("resolverEfecto");
        await efectoRetraso(20);
      }
    }
  }
}

function maestroSudoku(tablero) {
  const medidaCuadricula = 9;

  for (let fila = 0; fila < medidaCuadricula; fila++) {
    for (let col = 0; col < medidaCuadricula; col++) {
      if (tablero[fila][col] == 0) {
        for (let num = 1; num <= 9; num++) {
          if (verificarConflictos(tablero, fila, col, num)) {
            tablero[fila][col] = num;

            if (maestroSudoku(tablero)) {
              return true;
            }

            tablero[fila][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function verificarConflictos(tablero, fila, col, num) {
  const medidaCuadricula = 9;

  for (let i = 0; i < medidaCuadricula; i++) {
    if (tablero[fila][i] === num || tablero[i][col] === num) {
      return false;
    }
  }

  const filaInicio = Math.floor(fila / 3) * 3;
  const colInicio = Math.floor(col / 3) * 3;

  for (let i = filaInicio; i < filaInicio + 3; i++) {
    for (let j = colInicio; j < colInicio + 3; j++) {
      if (tablero[i][j] === num) {
        return false;
      }
    }
  }
  return true;
}

function efectoRetraso(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
