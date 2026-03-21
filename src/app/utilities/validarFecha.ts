export function esFechaValidaYDentroDe24Horas(fechaStr: string): boolean {
  // Validar formato ISO básico con hora: YYYY-MM-DDTHH:mm
  const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
  if (!regex.test(fechaStr)) {
    return false;
  }

  const fecha = new Date(fechaStr);
  if (isNaN(fecha.getTime())) {
    return false; // fecha inválida
  }

  const ahora = new Date();
  const hace24Horas = new Date(ahora.getTime() - 24 * 60 * 60 * 1000);

  return fecha >= hace24Horas && fecha <= ahora;
}
