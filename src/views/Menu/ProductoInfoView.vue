<script setup>
import { useRoute } from 'vue-router';
const route = useRoute()

</script>

<template>
    <h1>Info de {{ $route.params.id }}</h1>
</template>


<!-- <script setup>
    import { ref } from 'vue';
    import { ref as firebaseRef, uploadBytes, getDownloadURL } from 'firebase/storage';
    import { storage } from '../../firebaseConfig';

    const selectedFile = ref(null)
    const previewImage = ref(null)
    const isUploading = ref(false)

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

    const uploadFile = async () => {
        if (selectedFile.value) {
            try {   
                // crea una referencia al nombre del archivo con su extension
                const imgRef = firebaseRef(storage, selectedFile.value.name)

                // sube el archivo a la referencia establecida, se sube la imagen y se guarda la respuesta
                 const snapshot = await uploadBytes(imgRef, selectedFile.value)  

                // obtiene la URL de la imagen subida
                const imgURL = await getDownloadURL(snapshot.ref)
                console.log('Image URL:', imgURL );
                console.log('File uploaded successfully')
            } catch (error) {
                console.log(error)
            }
        }
    }

</script>

<template>
    <div>
        <div
            class="imagePreviewWrapper"
            :style="{ 'background-image': `url(${previewImage})` }"
            >
        </div>
        <input type="file" @change="handleFileUpload">
        <button @click="uploadFile">Upload</button>
    </div>
</template> 

<style scoped>
.imagePreviewWrapper {
  width: 250px;
  height: 250px;
  display: block;
  cursor: pointer;
  margin: 0 auto 30px;
  background-size: cover;
  background-position: center center;
}
</style> -->