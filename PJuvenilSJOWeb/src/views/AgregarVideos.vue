<!-- <template>
    <div>
      <progress id="progressBar" value="0" max="100" style="width:300px;"></progress><br>
      <input type="file" id="file1" @change="uploadFile">
      <progress id="progressBar" max="100" :value="progress" :style="{ backgroundColor: progressBarColor }"></progress>
      <span id="status">{{ status }}</span>
      <span id="loaded_n_total">{{ loadedBytes }} of {{ totalBytes }}</span>
    </div>
  </template>
  
  <script>
  import { createClient } from '@supabase/supabase-js';
  
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  console.log(supabase);
  
  export default {
    data() {
      return {
        progress: 0,
        status: 'Upload file',
        loadedBytes: '',
        totalBytes: '',
        progressBarColor: 'blue' // Color inicial de la barra de progreso
      };
    },
    methods: {
      async uploadFile() {
        const file = document.getElementById('file1').files[0];
        const nombreImagen = file.name;
  
        try {
          const { data, error } = await supabase
            .storage
            .from('Imagenes')
            .upload(nombreImagen, file, {
              onUploadProgress: (progress) => {
                this.progress = (progress.loaded / progress.total) * 100;
                this.loadedBytes = progress.loaded;
                this.totalBytes = progress.total;
                this.status = `${this.progress.toFixed(0)}% uploaded... please wait`;
                // Cambiar el color de la barra de progreso en función del progreso
                this.progressBarColor = this.getProgressBarColor(this.progress);
              },
            });
  
          if (error) {
            throw error;
          }
  
          console.log('File uploaded successfully:', data);
          this.status = 'Upload complete!';
          this.progress = 0;
          // Restaurar el color de la barra de progreso después de completar la carga
          this.progressBarColor = 'blue';
        } catch (error) {
          console.error('Upload error:', error);
          this.status = 'Upload failed';
          // Restaurar el color de la barra de progreso en caso de error
          this.progressBarColor = 'red';
        }
      },
      // Función para determinar el color de la barra de progreso en función del progreso
      getProgressBarColor(progress) {
        if (progress < 50) {
          return 'blue'; // Cambia a azul si el progreso es inferior al 50%
        } else if (progress < 80) {
          return 'yellow'; // Cambia a amarillo si el progreso es inferior al 80%
        } else {
          return 'green'; // Cambia a verde si el progreso es superior al 80%
        }
      }
    },
  };
  </script>
  
  <style>
  /* Estilo básico para la barra de progreso */
  #progressBar {
    width: 100%;
  }
  </style>
   -->

<template>
  <div>
    <h1>Otra Vista</h1>
    <button @click="redirectToHome">Ir a Inicio</button>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const redirectToHome = () => {
  router.push({ name: "home" }); // Asegúrate de tener un nombre de ruta para tu página de inicio en tu archivo de rutas
};
</script>
