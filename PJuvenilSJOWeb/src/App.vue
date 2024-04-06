 
<template>

  <MenuBar/>

  

  <RouterView />
  <FooterPage />
</template>



<script setup>

import { useRouter } from 'vue-router';
import FooterPage from '@/components/Footer.vue';
import MenuBar from '@/components/MenuBar.vue';

</script>


<style>


body{
    margin: 0;
    padding: 0;
}



</style>

