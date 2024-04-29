 
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
  background-color:#f3d1a7 ;
  margin: 0;
  padding: 0;
}



</style>

