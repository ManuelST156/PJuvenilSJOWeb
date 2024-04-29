<template>

    <div class="conteinerCards" >

    <Card style="width: 25rem; overflow: hidden" v-for="group in groups" :key="group"  class="m-1">
        <template #header>
            <img alt="user header" src="https://primefaces.org/cdn/primevue/images/usercard.png" />
        </template>
        <template #title>{{ group.NombreGrupo }}</template>
        <template #subtitle>{{ group.SubTituloGrupo }}</template>
        <template #content>
            <p class="m-0">
               {{ group.Descripcion }}
            </p>

            <a :href="group.InstagramLink" target="_blank"><i id="links" class="pi pi-instagram"></i></a>
        </template>
    </Card>

    

    </div>
    
    
</template>

<style>
.conteinerCards{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 20px;
    

}

#links{
    color: gray;
    font-size: 20px;
}

#links:hover{
    color: brown;
}

</style>

<script setup>
import { ref, onMounted } from "vue";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const groups=ref([]);

onMounted(async () => {

    const dataGroups= await supabase
    .from("Grupo")
    .select("*");


    groups.value=dataGroups.data;
    console.log(groups.value);

});


</script>