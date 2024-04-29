<template>
  <div>
    <button @click="goToPrestamo">Mostrar Información de Préstamo</button>
    <button @click="goToCertificados">Mostrar Información de Certificados</button>

    <div>
      <h1 v-if="infoType === 'prestamo'">Información de Préstamo</h1>
      <h1 v-else-if="infoType === 'certificados'">Información de Certificados</h1>
      <!-- Agrega aquí el contenido dinámico para cada tipo de información -->
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const infoType = ref(router.currentRoute.value.params.infoType);

const goToPrestamo = () => {
  
};

const goToCertificados = () => {
  infoType.value = 'certificados';
  router.push('/info/certificados');
};
</script>
