<script setup>
// importaciones de vue
import { ref } from 'vue';
import { useRouter } from 'vue-router';

// stores de pinia
import { useUserStore } from '../../stores/users';
import { useMensajesStore } from '../../stores/mensajes';

// utilidades
import { uploadFile } from '../../utilidades';

// componentes de UI
import ModalConfirmacion from '../../components/ModalConfirmacion.vue';

// inicializando importaciones
const userStore = useUserStore()
const mensajesStore = useMensajesStore()
const router = useRouter()

// variables reactivas de la informacion del empleado
const nombre = ref(null)
const apellido = ref(null)
const email = ref(null)
const direccion = ref(null)
const dui = ref(null)
const tel = ref(null) // telefono de contacto
const puesto = ref(null)
const password = ref(null)

const selectedFile = ref(null) // referencia al archivo de la imagen que se selecciona, por defecto es nulo. Es el archivo que se subira a Storage de Firebase
const previewImage = ref(null) // la imagen como tal para ser mostrada en el div, por defecto nulo
const clasesFormulario = ref('') // clases de bootstrap para formulario, para validacion
const desactivarBoton = ref(false)

// funcion que muestra la imagen seleccionada en el div
const handleFileUpload = e => {
    const file = e.target.files[0]
    selectedFile.value = file

    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            previewImage.value = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

// funcion para crear el usuario, recopila los valores y lo delega a la funcion correspondiente de userStore
const crearNuevoEmpleado = async () => {

    if(!validacionInputs()) {
        clasesFormulario.value = 'was-validated'
        mensajesStore.crearMensaje({
            titulo: 'Rellene los campos correctamente',
            texto: `Rellene todos los campos. La contraseña de al menos 6 caracteres.`,
            color: 'secondary',
            id: 'mensajeFeedbackCrearEmpleado',
            autoEliminar: true
        })
        return;
    }
    clasesFormulario.value = ''

    try {
        desactivarBoton.value = true;

        // Primer paso, subir la foto de perfil del nuevo empleado a Storage y obtener la URL 
        const urlImagen = await uploadFile(selectedFile.value, 'usuarios')

        // se crea el objeto con la informacion
        const objUsuario = {
            nombre: nombre.value,
            apellido: apellido.value,
            foto: urlImagen,
            email: email.value,
            direccion: direccion.value,
            dui: dui.value,
            tel: tel.value,
            puesto: puesto.value,
        }

        // delegando la creacion del usuario empleado al store de los usuarios
        await userStore.createUser(email.value, password.value, objUsuario)

        // mensaje de creacion exitosa
        mensajesStore.crearMensaje({
            titulo: 'Usuario creado exitosamente',
            texto: `El usuario para el empleado ${nombre.value} ${apellido.value} ha sido creado exitosamente. Comunicar la contraseña ${password.value}`,
            color: 'success',
            id: 'NuevoEmpleadoCreado',
            autoEliminar: true
        })

        // resetear el formulario
        limpiarInputs()
    } catch (error) {
        mensajesStore.crearError({
            id: 'ErrorCrearEmpleado',
            texto: 'No se creó el empleado. El email ya existe o'
        })
        console.log(error)
    } finally {
        desactivarBoton.value = false;
    }

}

// formula que devuele un booleano dependiendo si todos los inputs estan rellenados o no
const validacionInputs = () => {
    const formularioValidado = nombre.value && apellido.value && selectedFile.value && email.value && direccion.value && dui.value && tel.value && puesto.value && password.value && password.value.length >= 6

    return formularioValidado;
}

// funcion para "limpiar" los inputs poniendo valores nulos a los v-models
const limpiarInputs = () => {
        nombre.value = ''
        apellido.value = ''
        email.value = ''
        direccion.value = ''
        dui.value = ''
        tel.value = ''
        puesto.value = ''
        password.value = ''
        selectedFile.value = null
        previewImage.value = null
}
</script>

<template>
    <!-- Formulario provisional para crear un nuevo usuario trabajador -->
    <div class="container text-left">
        <h3 class="text-center my-4" >Crear nuevo usuario empleado:</h3>

        <div class="row align-items-start">
            <form :class="clasesFormulario" @submit.prevent>
                <div class="row">
                    <div class="col-sm-12 col-md-6">
                        <div class="imagePreviewWrapper border" :style="{ 'background-image': `url(${previewImage})` }"></div>
                        <input class="form-control" type="file" id="seleccionarImagen" accept=".jpg, .jpeg, .png" @change="handleFileUpload" required> 
                    </div>
                    <div class="col-sm-12 col-md-6">

                        <div class="input-group my-3">
                            <label class="input-group-text" for="txtNombreUsuario">Nombre:</label>
                            <input type="text" class="form-control" id="txtNombreUsuario" required aria-describedby="basic-addon3 basic-addon4" placeholder="Nombre del empleado" v-model.trim="nombre" pattern="[a-zA-ZÑñáéíóúÁÉÍÓÚ\s]+">
                            <div class="invalid-feedback">
                                Por favor escriba el nombre.
                            </div>
                        </div>    

                        <div class="input-group my-3">
                            <label class="input-group-text" for="txtApellidoUsuario">Apellido:</label>
                            <input type="text" class="form-control" id="txtApellidoUsuario" required aria-describedby="basic-addon3 basic-addon4" placeholder="Apellido del empleado" v-model.trim="apellido" pattern="[a-zA-ZÑñáéíóúÁÉÍÓÚ\s]+">
                            <div class="invalid-feedback">
                                Por favor escriba el apellido.
                            </div>
                        </div>    

                        <div class="input-group my-3">
                            <label class="input-group-text" for="txtDuiUsuario">DUI:</label>
                            <input type="text" class="form-control" id="txtDuiUsuario" required aria-describedby="basic-addon3 basic-addon4" placeholder="DUI del empleado" v-model.trim="dui" pattern="^\d{8}-\d$">
                            <div class="invalid-feedback">
                                Por favor escriba el DUI.
                            </div>
                        </div>   

                        <div class="input-group my-3">
                            <label class="input-group-text" for="txtDireccionUsuario">Direccion:</label>
                            <input type="text" class="form-control" id="txtDireccionUsuario" required aria-describedby="basic-addon3 basic-addon4" placeholder="Dirección del empleado" v-model.trim="direccion" pattern="^[a-zA-Z0-9-#]+$">
                            <div class="invalid-feedback">
                                Por favor escriba el direccion.
                            </div>
                        </div>    
                        
                        <div class="input-group my-3">
                            <label class="input-group-text" for="txtCorreoUsuario">Correo electrónico:</label>
                            <input type="email" class="form-control" id="txtCorreoUsuario" required aria-describedby="basic-addon3 basic-addon4" placeholder="Correo del empleado" v-model.trim="email" pattern="^([a-zA-Z0-9_\.]+)@([a-z]+)\.[a-z]+$">
                            <div class="invalid-feedback">
                                Por favor escriba el correo electrónico.
                            </div>
                        </div>    

                        <div class="input-group my-3">
                            <label class="input-group-text" for="telUsuario">Teléfono de contacto:</label>
                            <input type="text" class="form-control" id="telUsuario" required aria-describedby="basic-addon3 basic-addon4" placeholder="Ingrese el Número de contacto" v-model.trim="tel" pattern="^[0-9]{4}-[0-9]{4}$">
                            <div class="invalid-feedback">
                                Por favor escriba el teléfono.
                            </div>
                        </div>       

                        <div class="input-group my-3">
                            <label class="input-group-text" for="inputGroupSelect01">Puesto:</label>
                            <select class="form-select" id="inputGroupSelect01" v-model="puesto" required>
                                <option disabled value="" selected>Elija el puesto que ocupará</option>
                                <option value="Mesero">Mesero</option>
                                <option value="Cocina">Cocina</option>
                                <option value="Cajero">Cajero</option>
                            </select>
                            <div class="invalid-feedback">
                                Debe elegir un puesto.
                            </div>
                        </div>

                        <div class="input-group my-3">
                            <label class="input-group-text" for="contraUsuario">Contraseña: </label>
                            <input type="password" class="form-control" id="contraUsuario" aria-describedby="basic-addon3 basic-addon4" placeholder="Mínimo de 6 caracters"  minlength="6" v-model.trim="password" required>
                            <div class="invalid-feedback">
                                Por favor escriba la contraseña. Mínimo 6 caracterers.
                            </div>
                        </div> 

                        <div class="d-flex justify-content-center ">
                            <!-- <button type="submit" id="btnCrearRegistro" class="btn btn-outline-success"
                            data-bs-toggle="modal" data-bs-target="#modalCrearEmpleado">
                                Crear Registro
                            </button> -->
                            <button type="submit" id="btnCrearRegistro" class="btn  btn-outline-success"
                                :disabled="desactivarBoton"
                                @click="crearNuevoEmpleado"
                            >
                                Crear Registro
                            </button>
                        </div>
                    
                        <div class="text-center mt-2" v-if="desactivarBoton">
                            <p class="fw-bold">Creando usuario, por favor espere...</p>
                        </div>
                
                    </div>
                </div>
            </form>

            <ModalConfirmacion
                id="modalCrearEmpleado"
                :titulo="`Creación de empleado con contraseña: ${password}`"
                :cuerpo="`Comunique al empleado la contraseña para iniciar sesion, esta no se puede consultar posteriormente, y si se pierde el empleado tendrá que enviar su correo para crear una nueva en la pantalla de login.`"
                color="primary"
                textoBoton="Crear nuevo empleado"
                @accion="crearNuevoEmpleado"
            />

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
