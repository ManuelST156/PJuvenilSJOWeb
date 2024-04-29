 

<template>
    
    <div class="card">
        <Carousel :value="products" :numVisible="1" :numScroll="1" :responsiveOptions="responsiveOptions" circular :autoplayInterval="7000" id="my-carousel"
        class="flex flex-column sm:flex-row">
            <template #item="slotProps">
                <div class="div1">
                    <div class="mb-3">
                        <div class="relative mx-auto">
                            <img :src="slotProps.data.img" :alt="slotProps.data.name" class="w-full border-round" />
                        </div>
                    </div>
                    <!-- <div class="mb-3 font-medium">{{ slotProps.data.name }}</div> -->
                </div>
            </template>
        </Carousel>
    </div>

    
</template>

<script setup>
import { ref, onMounted } from "vue";
import { ProductService } from '@/service/ProductService';

onMounted(() => {
    /* ProductService.getProductsSmall().then((data) => (products.value = data.slice(0, 9))); */
})

const products = ref(

[{
    name:'prueba1',
    img: 'https://elcomercio.pe/resizer/gj5JbwxkmqRAa4HSpfOHEIUBf7k=/580x330/smart/filters:format(jpeg):quality(75)/cloudfront-us-east-1.images.arcpublishing.com/elcomercio/6FUBT6XQXNHHNFOMCHIT7I34NA.jpg'
    
    },
    {
    name:'prueba1',
    img: 'https://elcomercio.pe/resizer/gj5JbwxkmqRAa4HSpfOHEIUBf7k=/580x330/smart/filters:format(jpeg):quality(75)/cloudfront-us-east-1.images.arcpublishing.com/elcomercio/6FUBT6XQXNHHNFOMCHIT7I34NA.jpg'
    
    }    
]


);
const responsiveOptions = ref([
    {
        breakpoint: '1400px',
        numVisible: 1,
        numScroll: 1
    },
    {
        breakpoint: '1199px',
        numVisible: 1,
        numScroll: 1
    },
    {
        breakpoint: '767px',
        numVisible: 1,
        numScroll: 1
    },
    {
        breakpoint: '575px',
        numVisible: 1,
        numScroll: 1
    }
]);



</script>

<style lang="scss" scoped>

/* @media screen and (max-width:480px) {
    
    
    .div1 {
        border-width: 1px;
        border-radius: 100px;
        margin: 0.75rem;
        padding: 0.75rem;
        box-shadow: 0 2px 4px rgba(18, 109, 54, 0.1);
        border-color: rgba(104, 224, 77, 0.427);
    }
}

@media screen and (min-width: 768px) and (max-width: 1024px){

}

@media screen and (min-width: 1024px){

} */


img{
    height: 350px;
    width: 100%;
}

.div1{
    border-width: 1px;
    border-style:solid; 
    border-radius: 20px; 
    margin: 0.5rem; 
    padding: 0.75rem; 
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); 
    border-color: rgba(20, 72, 21, 0.427);

}
::v-deep(.p-carousel)
{
    .p-carousel-next{
        color:rgb(124, 0, 0);
    }

    .p-carousel-prev{
        color:rgb(124, 0, 0);
    }

    .p-carousel-indicators .p-carousel-indicator.p-highlight button{
        background-color: rgb(124, 0, 0);
    }

   
    

}

</style>


