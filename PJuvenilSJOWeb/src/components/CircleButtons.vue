<template>
  <div class="containerPrincipal">
    <div class="buttonsContainer">
      
        <button v-for="item of items" :key="item" class="button" @click="irPagina(item.NombreActividad)">
          {{ item.NombreActividad }}
        </button>
    
    </div>
  </div>
</template>

<script setup>

import { ref, onMounted } from "vue";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "vue-router";

const router = useRouter();
const infoType = ref(router.currentRoute.value.params.infoType);

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const items=ref([]);

onMounted(async () => {

  const Actividad= await supabase.from("Actividad").select("*");

  items.value= Actividad.data;

  console.log(infoType.value);


});

const irPagina=(data)=>{

  localStorage.setItem('ActividadPage',data);
  infoType.value = data;
  router.push({ name: 'imagenesView', params: { infoType:infoType.value } });

}



</script>

<style>
.buttonsContainer {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  width: 70%;
  
}

.button {
  position: relative;
  padding: 16px 30px;
  font-size: 0.8rem;
  color: blue;
  font-weight: bold;
  border: 2px solid rgba(0, 0, 0, 0.5);
  border-radius: 50%;
/*   text-shadow: 0 0 15px green; */
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.1rem;
  transition: 0.5s;
  z-index: 1;
}

.containerPrincipal {
  width: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
    
}

.button:hover {
  color:rgb(124, 0, 0);
  border: 2px solid #D94A4A;;
  box-shadow: 0 0 0px blue;
  transform: scale(1.2);
}

@media screen and (max-width:480px) {
  
  .buttonsContainer {
    display: flex;
    flex-direction: column;
    flex: wrap;
    width: initial;
  
  }

  .button {
    position: relative;
    font-size: 0.6rem;
    width: 7rem;
    height:4rem ;
    padding: 8px;
    margin: 5px;
  }


}
@media screen and (min-width: 480px) and (max-width: 1024px) {
  
  .buttonsContainer {
    display: flex;
    flex-direction: column;
    flex: wrap;
    width: initial;
  
  }

  .button {
    position: relative;
    font-size: 0.6rem;
    width: 7rem;
    height:4rem ;
    padding: 8px;
    margin: 5px;
  }


}
</style>
