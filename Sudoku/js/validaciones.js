export function validarEntrada(event, fila, col) {
  const celdaId = `celda-${fila}-${col}`;
  const celda = document.getElementById(celdaId);
  const valor = celda.value;

  if (!/^[1-9]$/.test(valor)) {
    mostrarAdvertencia(`El número ${valor} no es válido, ingrese un valor del 1-9`);
    celda.value = "";
    return;
  }

  if (esValorDuplicadoEnFila(fila, col, valor) || esValorDuplicadoEnColumna(fila, col, valor) || esValorDuplicadoEnSubcuadricula(fila, col, valor)) {
    celda.value = "";
  }
}

function mostrarAdvertencia(mensaje) {
  Swal.fire({
    icon: 'warning',
    title: mensaje,
    showConfirmButton: false,
    timer: 2500
  });
}

function esValorDuplicadoEnFila(fila, col, valor) {
  for (let i = 0; i < 9; i++) {
    if (i !== col && document.getElementById(`celda-${fila}-${i}`).value === valor) {
      mostrarAdvertencia(`El número ${valor} ya está presente en la fila ${fila + 1}`);
      return true;
    }
  }
  return false;
}

function esValorDuplicadoEnColumna(fila, col, valor) {
  for (let i = 0; i < 9; i++) {
    if (i !== fila && document.getElementById(`celda-${i}-${col}`).value === valor) {
      mostrarAdvertencia(`El número ${valor} ya está presente en la columna ${col + 1}`);
      return true;
    }
  }
  return false;
}

function esValorDuplicadoEnSubcuadricula(fila, col, valor) {
  const filaInicio = Math.floor(fila / 3) * 3;
  const colInicio = Math.floor(col / 3) * 3;
  for (let i = filaInicio; i < filaInicio + 3; i++) {
    for (let j = colInicio; j < colInicio + 3; j++) {
      if ((i !== fila || j !== col) && document.getElementById(`celda-${i}-${j}`).value === valor) {
        mostrarAdvertencia(`El número ${valor} ya está presente en la subcuadrícula`);
        return true;
      }
    }
  }
  return false;
}
