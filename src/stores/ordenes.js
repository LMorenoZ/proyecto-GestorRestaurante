import { defineStore } from 'pinia';
import {
  Timestamp,
  query,
  collection,
  doc,
  getDocs,
  addDoc,
  orderBy,
  deleteDoc,
  getDoc,
  updateDoc,
  setDoc,
} from 'firebase/firestore/lite';
import { db } from '../firebaseConfig';
import { useMensajesStore } from './mensajes';

export const useOrdenesStore = defineStore('ordenesStore', {
  state: () => ({
    ordenes: [],
    cargando: false,
  }),
  getters: {
    // Propiedades computadas, no cambian el valor del estado, siempre retornan algo
    cantidadOrdenes(state) {
      return state.ordenes.length;
    },
    ordenesPreparacion(state) {
      return state.ordenes.filter((orden) => orden.estado == 'preparacion')
        .length;
    },
    ordenesTardadas(state) {
      return state.ordenes.filter((orden) => orden.estado == 'tardada').length;
    },
    ordenesCompletadas(state) {
      return state.ordenes.filter((orden) => orden.estado == 'completada')
        .length;
    },
    ordenesCanceladas(state) {
      return state.ordenes.filter((orden) => orden.estado == 'cancelada')
        .length;
    },
    ordenesActivas(state) {
      // en preparacion y tardadas
      return this.ordenesPreparacion + this.ordenesTardadas;
    },
  },
  actions: {
    // metodos que mutan el valor del estado
    async traerOrdenes() {
      this.cargando = true;
      const mensajesStore = useMensajesStore();
      try {
        const q = query(
          collection(db, 'orden'),
          orderBy('fechaCreacion', 'desc')
        );
        const querySnapshot = await getDocs(q);

        this.ordenes = []; // se borran todas las ordenes
        await querySnapshot.forEach((orden) => {
          this.ordenes.push({ ...orden.data(), id: orden.id });
        });
      } catch (error) {
        mensajesStore.crearError(
          'noSePudoTraerOrdenes',
          `No se pueden mostrar las órdenes`
        );
        console.log(error);
      } finally {
        this.cargando = false;
      }
    },
    async agregarOrden(orden) {
      const mensajesStore = useMensajesStore();
      const ordenNueva = orden;
      ordenNueva.fechaCreacion = Timestamp.now();
      ordenNueva.cronometro = false; // para llevar el tiempo hasta cuando esta retrasada
      try {
        const { id } = await addDoc(collection(db, 'orden'), ordenNueva);
        mensajesStore.crearMensaje({
          titulo: 'Órden añadida',
          texto: `Órden de mesa ${orden.mesaNum} aceptada y movida a etapa de preparación`,
          color: 'success',
          id: 'mensajeOrdenCreada',
          autoEliminar: true,
        });

        // actualizar store
        ordenNueva.id = id
        this.ordenes.push(ordenNueva)
        this.ordenes.sort((ordenA, ordenB) => ordenB.fechaCreacion - ordenA.fechaCreacion)
      } catch (error) {
        mensajesStore.crearError('ordenNoSeCrea', `No se pudo crear la órden`);
        console.log(error);
      }
    },
    async actualizarOrden(ordenModificada) {
      const mensajesStore = useMensajesStore();

      // para determinar si la orden es completada por primera vez, y no se ha regresado a preparacion y vuelta a completar
      const seCompletaPrimeraVez =
        ordenModificada.estado === 'completada' &&
        (ordenModificada.fechaCompletada == null ||
          ordenModificada.fechaCompletada == undefined);

      try {
        const docRef = doc(db, 'orden', ordenModificada.id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          throw new Error('No existe el documento');
        }

        // la fecha de finalizacion solo se debe crear cuando se completa la orden una unica vez
        let dateFinalizacion = Timestamp.now()
        if (seCompletaPrimeraVez) {
          await updateDoc(docRef, {
            estado: ordenModificada.estado,
            fechaFinalizacion: dateFinalizacion,
            // cronometro: false,    // TODO: para programar que la orden se vaya a 'retrasadas'
          });
        } else {
          await updateDoc(docRef, {
            estado: ordenModificada.estado,
            cronometro: false,
          });
        }

        mensajesStore.crearMensaje({
          titulo: 'Órden actualizada',
          texto: `Órden de la mesa ${ordenModificada.mesaNum} movida a estado ${ordenModificada.estado}`,
          color: 'success',
          id: `mensajeOrdenModificada${ordenModificada.id}`,
          autoEliminar: true,
        });

        // actualizar store
        ordenModificada.fechaFinalizacion = dateFinalizacion
        const indiceModificar = this.ordenes.findIndex(orden => orden.id === ordenModificada.id)
        this.ordenes[indiceModificar] = ordenModificada

      } catch (error) {
        mensajesStore.crearError(
          'noSePudoActualizarOrden',
          `La órden no se pudo actualizar`
        );
        console.log(error);
      }
    },
    // async activarCronometro(orden, valor) {
    //   const mensajesStore = useMensajesStore();

    //   try {
    //     const docRef = doc(db, 'orden', orden.id);
    //     const docSnap = await getDoc(docRef);

    //     if (!docSnap.exists()) {
    //       throw new Error('No existe el documento');
    //     }

    //     await updateDoc(docRef, {
    //       cronometro: valor,
    //     });

    //     this.traerOrdenes();
    //   } catch (error) {
    //     mensajesStore.crearError(
    //       'noSePudoCambiarCronometro',
    //       `El cronómetro de la orden no se pudo cambiar`
    //     );
    //     console.log(error);
    //   }
    // },
  },
});
