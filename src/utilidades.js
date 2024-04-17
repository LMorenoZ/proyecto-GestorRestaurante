// las importaciones relacionadas con firebase son para la funcion para subir imagenes en 'storage'
import { storage } from './firebaseConfig';
import { ref as firebaseRef, uploadBytes, getDownloadURL } from 'firebase/storage';


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

// mostrar en consola formato de JSON 
export const printf = mensajeJSON => {
    return console.log(JSON.parse(JSON.stringify(mensajeJSON)))
}

// encontrar el producto identificado por su id, debe enviarse el array de productos tambien
export const encontrarProducto = (productos, id) => {
   const productoEncontrado = productos.find(producto => producto.id === id)
   return productoEncontrado
}

// subir imagen en formato archivo ('jpg', 'png', etc) a Storage de Firebase
export const uploadFile = async (archivo, carpetaString) => {  // carpetaString: 'productos', 'usuarios'
    let imgURL = null

    if (archivo) {
        try {
            // crea una referencia al nombre del archivo con su extension
            const imgRef = firebaseRef(storage, `${carpetaString}/${archivo.name}`)   // ubicacion en storage: carpetaString/archivo

            // sube el archivo a la referencia establecida, se sube la imagen y se guarda la respuesta
            const snapshot = await uploadBytes(imgRef, archivo)

            // obtiene la URL de la imagen subida
            imgURL = await getDownloadURL(snapshot.ref)
        } catch (error) {
            console.log(error)
        }
    }

    return imgURL
}

// reduce un array de objetos proporcionado para que los elementos no se repitan y se sumen sus iteraciones,
// el objeto del array debe tener la forma '{  idProducto, cantidad }' para que la funcion pueda reducirla
// y devuelve un array con los nuevos objetos
export const reducirArray = arrayDuplicado => {
    const arrayReducido = arrayDuplicado.reduce((acumulador, producto) => {
        const productoEncontrado = acumulador.find(
          (productoAcumulado) => productoAcumulado.idProducto === producto.idProducto
        );
      
        if (productoEncontrado) {
          productoEncontrado.cantidad += producto.cantidad;
        } else {
          acumulador.push({ idProducto: producto.idProducto, cantidad: producto.cantidad });
        }
      
        return acumulador;
      }, []);

    return arrayReducido
}
