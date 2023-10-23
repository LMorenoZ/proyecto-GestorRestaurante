// Recibe un argumento de tipo Date y devuelve un string formateado de la fecha en español
export const fechaFormateada = fecha => {
    const opciones = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };

    let fechaFormateada = fecha.toLocaleDateString('es-us', opciones);
    fechaFormateada = fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1);
    return fechaFormateada;
}

// formatear fecha en la forma 'dd/mm/aaaa'
export const fechaFormateadaCorta = fecha => {
    const padTo2Digits = num => {
        return num.toString().padStart(2, '0');
      }

    return [
        padTo2Digits(fecha.getDate()),
        padTo2Digits(fecha.getMonth() + 1),
        fecha.getFullYear()
      ].join('/');
};

// formatea un argumento en fecha y devuelve el valor legible de la hora con formato AM / PM de 12 horas
export const horaFormateada = fecha => { // el argumento debe ser de tipo Date
    let hora = fecha.toLocaleString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });
    return hora;
};

// Recibe un string con el email del usuario y devuelve solo el nombre (sin el '@test.com')
export const nombreUsuario = usuarioEmail => {
    let emailLength = usuarioEmail.length;
    let lengthBorrar = 9; // tamanio del string '@test.com'
    let nombre = usuarioEmail.slice(0, emailLength - lengthBorrar);
    nombre = nombre.charAt(0).toUpperCase() + nombre.slice(1);
    return nombre;
}

// formatear un valor que representa dinero en un valor aceptable en USD. Se utiliza asi: USDollar.format(argumento)
export const USDollar = new Intl.NumberFormat('en-US', {  
    style: 'currency',
    currency: 'USD',
});