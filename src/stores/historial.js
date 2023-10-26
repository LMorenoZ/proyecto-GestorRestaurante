import { defineStore } from "pinia";
import { Timestamp, query, collection, doc, getDocs, addDoc, orderBy, deleteDoc, getDoc, updateDoc, setDoc, where } from 'firebase/firestore/lite';
import { db } from '../firebaseConfig';
import { useMensajesStore } from "./mensajes";

export const useHistorialStore = defineStore('historial', {
    state: () => ({
        historialOrdenes: []
    }),
    actions: {
        async filtrarPorFechas (dateRango, dateDesde, dateHasta) {
            // if (this.historialOrdenes.length > 0) { return; }  // no ejecuta el codigo si ya se ha recuperado la informacion

            const mensajesStore = useMensajesStore();

            let q; // query 

            // se establece la query correspondiente al valor de las fechas introducidas
            if (dateRango == null) {
                mensajesStore.crearMensaje({
                    titulo: 'Información',
                    texto: 'Debe ingresar un rango de fechas válido para poder filtrar por período',
                    color: 'warning',
                    id: 'intentarFiltrar',
                    autoEliminar: true
                });
                q = collection(db, 'historialOrdenes'); // consulta por todas las entradas en el historial
            } else {
                // estas variables contendran valores en Timestamp de Firestore correspondiente a los objetos Date de Js.
                let fechaDesde, fechaHasta;
                Date.prototype.addDays = function (days) {  // funcion para sumar una cantidad de dias a un valor de tipo Date
                    let date = new Date(this.valueOf());
                    date.setDate(date.getDate() + days);
                    return date;
                }
                
                if (dateHasta == null) {  // se busca filtrar un solo dia, por lo que no hay segundo parametro
                    // para buscar documentos de un solo dia, primero se setea la hora a las 00:00 del dia en cuestion y luego
                    // se suma 1 dia (24 horas), para que firestore busque los documentos con timestamp en ese periodo de 24 horas
                    fechaDesde = Timestamp.fromDate(new Date(dateDesde.setHours(0, 0, 0)));  // setea la fecha a las 0 horas
                    fechaHasta = Timestamp.fromDate((new Date(dateDesde.valueOf())).addDays(1));  // agrega 24 horas
                } else {
                    fechaDesde = Timestamp.fromDate(dateDesde);
                    fechaHasta = Timestamp.fromDate(dateHasta.addDays(1));
                }
                q = query(collection(db, 'historialOrdenes'),    // la consulta filtrara por las fechas introducidas
                    where('jornadaFecha', '>=', fechaDesde),
                    where('jornadaFecha', '<=', fechaHasta));
            }

            // se hace la consulta a la base de datos para traer los documentos
            try {
                const querySnapshot = await getDocs(q);

                this.historialOrdenes = []; // limpiar el historial para no aniadir entradas repetidas
                let historialTemp = []; // array temporal

                querySnapshot.forEach(jornada => {
                    let objHistorial = {
                        id: jornada.id, // se coloca el id
                        ...jornada.data(), // todos los demas datos de la jornada
                        jornadaFecha: jornada.data().jornadaFecha.toDate()  // se reemplaza el timestamp de firebase por un tipo Date de js
                    };
                    historialTemp.push(objHistorial);
                });

                // se ordena el historial por fecha, de mas reciente a mas antiguo
                this.historialOrdenes = historialTemp.toSorted((date1, date2) => date2.jornadaFecha - date1.jornadaFecha);
            } catch (error) {
                mensajesStore.crearError('errorTraerHistorial', 'No se puede mostrar el historial');
                console.log(error);
            }
        }
    }
});