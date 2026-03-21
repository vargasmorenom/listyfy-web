export function sumarTiempo(tiempo: any) {
  const dformat = new Intl.DateTimeFormat('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });

  let tiempooperacion = new Date();
  let tiempoSalida: any = '';

  tiempoSalida = dformat.format(tiempooperacion.setHours(tiempooperacion.getHours() + tiempo));

  function horaNumeros(date: any) {
    let dt = date.replace(/\//g, '');
    dt = dt.replace(' ', '');
    dt = dt.replace(':', '');
    dt = dt.replace(',', '');
    dt = dt.replace('AM', '');
    dt = dt.replace('PM', '');
    return dt;
  }
  return horaNumeros(tiempoSalida);
}
