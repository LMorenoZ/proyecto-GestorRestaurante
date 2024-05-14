<script setup>
    // Importaciones de Vue
    import { computed, ref } from 'vue';
    import { useRoute, useRouter } from 'vue-router';

    // Importaciones de stores y demas
    import { useUserStore } from '../../stores/users';
    import { useMensajesStore } from '../../stores/mensajes';

    import { deleteObject, ref as firebaseRef } from 'firebase/storage';
    import { storage } from '../../firebaseConfig';
    import { isEmptyObject, uploadFile } from '../../utilidades';

    // Inicializaciones de las importaciones
    const userStore = useUserStore()
    const mensajesStore = useMensajesStore()
    const route = useRoute()
    const router = useRouter()

    
    // variables reactivas 
    const usuarioNoExiste = ref(false)
    const fotoActualizada = ref(false) 
    const fotoOriginal = ref() 
    const bloquearBoton = ref(false)
    const clasesFormulario = ref('')
    const editandoRegistro = ref(false)
    // const selectedFile = ref(null)
    const previewImage = ref()

    const nombre = ref()
    const apellido = ref()
    const dui = ref()
    const direccion = ref()
    const email = ref()
    const tel = ref()
    const puesto = ref()
    const foto = ref()

    // copias de las variables reactivas del usuario, se usaran para el proceso de actualizacion
    const nombreCopia = ref()
    const apellidoCopia = ref()
    const duiCopia = ref()
    const direccionCopia = ref()
    const emailCopia = ref()
    const telCopia = ref()
    const puestoCopia = ref()
    const fotoCopia = ref()

    // comprobar que el usuario exista antes de hacer cualquier cosa
    let intentos = 0
    const usuario = computed(() => {
        let infoUsuario = userStore.userInfo(route.params.id)

        if(!infoUsuario) {
            intentos++

            if (intentos > 1) {
                usuarioNoExiste.value = true;
            }

            return;
        }

        // rellenar los v-model con la informacion del usuario
        nombreCopia.value = nombre.value = infoUsuario.nombre
        apellidoCopia.value = apellido.value = infoUsuario.apellido
        duiCopia.value = dui.value = infoUsuario.dui
        direccionCopia.value = direccion.value = infoUsuario.direccion
        emailCopia.value = email.value = infoUsuario.email
        telCopia.value = tel.value = infoUsuario.tel
        puestoCopia.value = puesto.value = infoUsuario.puesto
        emailCopia.value = email.value = infoUsuario.email
        fotoCopia.value = foto.value = infoUsuario.foto

        // rellando otras variables reactivas que se usaran
        previewImage.value = fotoOriginal.value = infoUsuario.foto

        return infoUsuario
    })


    // Funcion de actualizar
    const editarInfoEmpleado = async () => {
        editandoRegistro.value = true

        // validaciones
        if(!validacionInputs()) {
            clasesFormulario.value = 'was-validated'
            mensajesStore.crearMensaje({
                titulo: 'Rellene los campos correctamente',
                texto: `Los campos deben estar completos para actualizar.`,
                color: 'secondary',
                id: 'mensajeFeedbackEditarEmpleado',
                autoEliminar: true
            })
            editandoRegistro.value = false
            return;
        }
        clasesFormulario.value = ''

        let fotoActualizarURL = foto.value

        // proceso de actualizar 
        try {
            // Comprobar si se ha cambiado la foto, y si es el caso, eliminarla de Storage y subir la nueva imagen
            if (fotoActualizada.value) {
                // crear referencia a la foto existente del usuario en base a su URI 
                const refFotoVieja = firebaseRef(storage, fotoOriginal.value)

                // se elimina la foto existente
                await deleteObject(refFotoVieja)

                // se sube la foto nueva en la carpeta 'usuarios' y se obtiene el nuevo URI
                fotoActualizarURL = await uploadFile(foto.value, 'usuarios')
            }

            // los campos que no se actualizan en el formulario no se actualizaran tampoco en firestore
            // este objeto es temporal, se deberan filtrar los campos que no se actualizaran con la funcion 'generateUpdateObjetct'
            const usuarioActualizadoTemp = {
                nombre: nombre.value === nombreCopia.value ? undefined : nombre.value,
                apellido: apellido.value === apellidoCopia.value ? undefined : apellido.value,
                dui: dui.value === duiCopia.value ? undefined : dui.value,
                direccion: direccion.value === direccionCopia.value ? undefined : direccion.value,
                email: email.value === emailCopia.value ? undefined : email.value,
                tel: tel.value === telCopia.value ? undefined : tel.value,
                puesto: puesto.value === puestoCopia.value ? undefined : puesto.value,
                foto: fotoActualizarURL === fotoCopia.value ? undefined : fotoActualizarURL
            }
            // el objeto resultante deberia tener solo los campos cuya informacion no sea 'undefined', de hacer esto se encarga la siguiente funcion, que devuelve el mismo objeto 'limpio'
            const usuarioActualizado = generateUpdateObject(usuarioActualizadoTemp)

            // se comprueba que el objeto a actualizar no sea vacio, para no hacer nada mas en la funcion
            if (isEmptyObject(usuarioActualizado)) {
                mensajesStore.crearMensaje({
                    titulo: 'Nada que actualizar',
                    texto: 'No ocurrión actualización porque los datos a actualizar son exactamente los mismos que existen en la base de datos',
                    color: 'secondary',
                    id: 'nadaQueActualizarUsuario',
                    autoEliminar: true
                })

                editandoRegistro.value = false
                return
            } else {
                // Se manda el objeto a actualizar al store de pinia, donde se realiza el proceso de actualizacion en firestore 
                await userStore.actualizarUsuario(usuarioActualizado, usuario.value.uid)

                mensajesStore.crearMensaje({
                    titulo: 'Información actualizada',
                    texto: 'La información del usuario se actualizó exitosamente',
                    color: 'success',
                    id: 'usuarioInfoActualizado',
                    autoEliminar: true
                })

                // finalmente se reasignan los valores de copia con los nuevos valores
                nombreCopia.value = nombre.value
                apellidoCopia.value = apellido.value
                duiCopia.value = dui.value
                direccionCopia.value = direccion.value
                emailCopia.value = email.value
                telCopia.value = tel.value
                puestoCopia.value = puesto.value
                // fotoCopia.value = foto.value = null
                fotoCopia.value = foto.value 
                fotoActualizada.value = false
            }

        } catch (error) {
            mensajesStore.crearError(
                'ErrorEditarEmpleado',
                'No se pudo actualizar la información del empleado correctamente'
            )
            console.log(error)
        } finally {
            bloquearBoton.value = false
            editandoRegistro.value = false
        }
    }

    /****  funciones de utilidad para este componente ****/
    // funcion que muestra la imagen seleccionada en el div
    const handleFileUpload = e => {
        const file = e.target.files[0]
        // selectedFile.value = file

        
        if (file) {
            foto.value = file
            const reader = new FileReader();
            reader.onload = (e) => {
                previewImage.value = e.target.result;
                fotoActualizada.value = true
            };
            reader.readAsDataURL(file);
        }
    }


    // funcion que devuele un booleano dependiendo si todos los inputs estan rellenados o no
    const validacionInputs = () => {
        const formularioValidado = nombre.value && apellido.value && email.value && direccion.value && dui.value && tel.value && puesto.value && foto.value

        return formularioValidado;
    }

    // Función para generar el objeto de actualización dinámico, para no actualizar todo el objeto innecesariamente si solo se modifican algunos campos
    const generateUpdateObject = administradorActualizaciones => {
        const updateObject = {};
        for (const [campo, valor] of Object.entries(administradorActualizaciones)) {
            if (valor !== undefined) {
                updateObject[campo] = valor;
            }
        }
        return updateObject;
    }
</script>

<template>
    <div class="mt-4" v-if="usuario">
        <h1 class="text-center my-3">Editar información del usuario </h1> 
        <h3 class="text-danger text-center" v-if="usuario.logeado">¡No puedo editar información de un usuario activo!</h3>

        <div class="row align-items-start">
            <form :class="clasesFormulario" @submit.prevent="editarInfoEmpleado">
                <div class="row">
                    <div class="col-sm-12 col-md-6">
                        <div class="imagePreviewWrapper border" :style="{ 'background-image': `url(${previewImage})` }"></div>
                        <input class="form-control" type="file" accept="image/*" id="seleccionarImagen" @change="handleFileUpload" :disabled="usuario.logeado"> 
                    </div>
                    <div class="col-sm-12 col-md-6">

                        <div class="input-group my-3">
                            <label class="input-group-text" for="txtNombreUsuario">Nombre:</label>
                            <input type="text" class="form-control" id="txtNombreUsuario" required aria-describedby="basic-addon3 basic-addon4" placeholder="Nombre del empleado" pattern="[a-zA-ZÑñáéíóúÁÉÍÓÚ\s]+" :disabled="usuario.logeado" v-model.trim="nombre">
                            <div class="invalid-feedback">
                                Por favor escriba el nombre.
                            </div>
                        </div>    

                        <div class="input-group my-3">
                            <label class="input-group-text" for="txtApellidoUsuario">Apellido:</label>
                            <input type="text" class="form-control" id="txtApellidoUsuario" required aria-describedby="basic-addon3 basic-addon4" placeholder="Apellido del empleado" pattern="[a-zA-ZÑñáéíóúÁÉÍÓÚ\s]+" :disabled="usuario.logeado" v-model.trim="apellido">
                            <div class="invalid-feedback">
                                Por favor escriba el apellido.
                            </div>
                        </div>    

                        <div class="input-group my-3">
                            <label class="input-group-text" for="txtDuiUsuario"><abbr title="Documento Unico de Identidad">DUI:</abbr></label>
                            <input type="text" class="form-control" id="txtDuiUsuario" required aria-describedby="basic-addon3 basic-addon4" placeholder="XXXXXXXX-X" pattern="^\d{8}-\d$" maxlength="10" :disabled="usuario.logeado" v-model.trim="dui">
                            <div class="invalid-feedback">
                                Por favor escriba el DUI con el formato XXXXXXXX-X.
                            </div>
                        </div>   

                        <div class="input-group my-3">
                            <label class="input-group-text" for="txtDireccionUsuario">Direccion:</label>
                            <input type="text" class="form-control" id="txtDireccionUsuario" required aria-describedby="basic-addon3 basic-addon4" placeholder="Dirección del empleado" :disabled="usuario.logeado" v-model.trim="direccion">
                            <div class="invalid-feedback">
                                Por favor escriba la direccion.
                            </div>
                        </div>    
                        
                        <div class="input-group my-3">
                            <label class="input-group-text" for="txtCorreoUsuario">Correo electrónico:</label>
                            <input type="email" class="form-control" id="txtCorreoUsuario" required aria-describedby="basic-addon3 basic-addon4" placeholder="Correo del empleado" :disabled="usuario.logeado" v-model.trim="email">
                            <div class="invalid-feedback">
                                Por favor escriba el correo electrónico.
                            </div>
                        </div>    

                        <div class="input-group my-3">
                            <label class="input-group-text" for="telUsuario">Teléfono de contacto:</label>
                            <input type="text" class="form-control" id="telUsuario" required aria-describedby="basic-addon3 basic-addon4" pattern="^\d{4}-\d{4}$" placeholder="XXXX-XXXX" maxlength="9" :disabled="usuario.logeado" v-model.trim="tel">
                            <div class="invalid-feedback">
                                Por favor escriba el teléfono con el formato XXXX-XXXX.
                            </div>
                        </div>       

                        <div class="input-group my-3">
                            <label class="input-group-text" for="inputGroupSelect01">Puesto:</label>
                            <select class="form-select" id="inputGroupSelect01" :disabled="usuario.logeado" v-model="puesto" required>
                                <option disabled value="" selected>Elija el puesto que ocupará</option>
                                <option value="Mesero" :selected="'Mesero' === usuario.puesto">Mesero</option>
                                <option value="Cocina" :selected="'Cocina' === usuario.puesto">Cocina</option>
                                <option value="Cajero" :selected="'Cajero' === usuario.puesto">Cajero</option>
                            </select>
                            <div class="invalid-feedback">
                                Debe elegir un puesto.
                            </div>
                        </div>

                        <div class="d-flex justify-content-center ">
                            <button type="submit" id="btnCrearRegistro" class="btn  btn-outline-success" title="Click para crear registro"
                                :disabled="bloquearBoton || usuario.logeado"
                                
                                v-if="!editandoRegistro"
                            >
                                Editar información
                            </button>
                            <!-- <button type="submit" id="btnCrearRegistro" class="btn  btn-outline-success" title="Click para crear registro"
                                :disabled="bloquearBoton"
                                @click="editarInfoEmpleado"
                                v-if="!editandoRegistro"
                            >
                                Editar información
                            </button> -->
                            <button id="btnCrearRegistro" class="btn  btn-outline-success" v-else disabled>
                                <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
                                <span role="status"> Actualizando...</span>
                            </button>
                        </div>
            
                    </div>
                </div>
            </form>

            <div class="container text-center my-5">
                <div class="row align-items-start">
                    <div class="col">
                        <div class="col">
                            <button type="button" id="btnRegresar" class="btn btn-outline-secondary"
                            @click="router.push('/administracion/empleados')"   >
                                Regresar a lista de empleados
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>

   </div>

   <!-- Elementos que aparece mientras se busca la informacion del usuario -->
   <div v-else-if="!usuarioNoExiste">
    <div class="mt-4 d-flex justify-content-center">
        <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
   </div>
   <!-- Mensaje que aparece cuando el usuario buscado no existe -->
   <h3 class="text-center mt-4" v-if="usuarioNoExiste">El usuario no existe</h3>
</template>


<!-- CSS de este componente -->
<style scoped>
/* CSS de la clase del div de la imagen */
.imagePreviewWrapper {
    width: 250px;
    height: 250px;
    display: block;
    cursor: pointer;
    margin: 0 auto 30px;
    background-size: cover;
    background-position: center center;
}
</style>