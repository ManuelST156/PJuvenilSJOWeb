<template>
  <main>
    <div class="card">
      <div class="menu-bar">
        <button
          v-for="(tab, index) in tabs"
          :key="index"
          :class="{ active: activeIndexTab === tab }"
          @click="handleTabClick(tab)"
        >
          Pascua {{ tab }}
        </button>
      </div>

      <div class="card flex justify-content-center">
        <Galleria
          v-model:activeIndex="activeIndex"
          v-model:visible="displayCustom"
          :value="paginatedImages"
          :responsiveOptions="responsiveOptions"
          :numVisible="7"
          containerStyle="max-width: 640px"
          :circular="true"
          :fullScreen="true"
          :showItemNavigators="true"
          :showThumbnails="false"
        >
          <template #item="slotProps">
            <img
              :src="slotProps.item.ImageURL"
              :alt="slotProps.item.alt"
              style="max-height: 700px; max-width: 700px; display: block"
            />
          </template>

          <template #caption="slotProps">
            <div class="text-xl mb-2 font-bold">
              {{ slotProps.item.Nombre }}
            </div>
            <p class="text-white">{{ slotProps.item.Descripcion }}</p>
          </template>
        </Galleria>
      </div>

      <div v-if="images" class="gallery">
        <div
          v-for="(image, index) of paginatedImages"
          :key="index"
          class="columna"
        >
          <img
            :src="image.ImageURL"
            :alt="image.alt"
            style="cursor: pointer"
            @click="imageClick(index)"
          />
        </div>
      </div>
      <!-- <p class="m-0">{{ tab.title }}</p> -->
      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">
          <span class="arrow">◄</span>
        </button>
        <span
          v-for="page in pages"
          :key="page"
          @click="goToPage(page)"
          :class="{ active: currentPage === page }"
          >{{ page }}</span
        >
        <button @click="nextPage" :disabled="currentPage === cantidadPaginas">
          <span class="arrow">►</span>
        </button>
        <!-- <button @click="listImage">Post</button> -->
        <!--             <input type="file" id="foto" name="foto" accept="image/*">
            <button type="button" @click="subirFoto">Subir Foto</button> -->
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { createClient } from "@supabase/supabase-js";
import { uid } from "uid";

/* const subirFoto=async ()=> {
    var formData = new FormData();
    var fileInput = document.getElementById('foto');
    var file = fileInput.files[0];
    
    if (file) {
        formData.append('foto', file);
        var nombreImagen=uid(16).toString();

        console.log(file);
        const { data, error } = await supabase
          .storage
          .from('Imagenes')
          .upload(nombreImagen,file);
      

          
            const urlDescargar = supabase
              .storage
              .from('Imagenes')
              .getPublicUrl(nombreImagen)

          console.log(urlDescargar);
      
      }


  

        
} */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log(supabase);

const images = ref([]);

onMounted(async () => {
  const dataImages = await supabase.from("Imagenes").select("*");

  images.value = dataImages.data;
  console.log(images.value);

  const años = await supabase.from("byyear").select("Año");

  const GetañoMaximo = await supabase.from("bigyear").select("max");

  añoMaximo.value = GetañoMaximo.data[0].max;

  for (let i = 0; i <= años.data.length; i++) {
    tabs.value.push(años.data[i].Año);
    console.log(tabs.value);
  }
});

const añoMaximo = ref();

const imagesa = ref([
  {
    itemImageSrc:
      "https://www.egames.news/__export/1660158141768/sites/debate/img/2022/08/10/ultra_instinct_1.jpg_554688468.jpg",
    thumbnailImageSrc:
      "https://www.egames.news/__export/1660158141768/sites/debate/img/2022/08/10/ultra_instinct_1.jpg_554688468.jpg",
    alt: "Description for Image 1",
    title: "Title 1",
    año: 2024,
  },
  {
    itemImageSrc:
      "https://media.vandalsports.com/i/640x360/9-2023/2023981732_1.jpg",
    thumbnailImageSrc: "https://i.ibb.co/ZHt79SG/2023981732-1-2.jpg",
    alt: "Description for Image 2",
    title: "Title 2",
    año: 2022,
  },
  {
    itemImageSrc:
      "https://primefaces.org/cdn/primevue/images/galleria/galleria3.jpg",
    thumbnailImageSrc:
      "https://primefaces.org/cdn/primevue/images/galleria/galleria3s.jpg",
    alt: "Description for Image 3",
    title: "Title 3",
    año: 2024,
  },
  {
    itemImageSrc:
      "https://primefaces.org/cdn/primevue/images/galleria/galleria4.jpg",
    thumbnailImageSrc:
      "https://primefaces.org/cdn/primevue/images/galleria/galleria4s.jpg",
    alt: "Description for Image 4",
    title: "Title 4",
    año: 2023,
  },
  {
    itemImageSrc:
      "https://primefaces.org/cdn/primevue/images/galleria/galleria5.jpg",
    thumbnailImageSrc:
      "https://primefaces.org/cdn/primevue/images/galleria/galleria5s.jpg",
    alt: "Description for Image 5",
    title: "Title 5",
    año: 2024,
  },
  {
    itemImageSrc:
      "https://primefaces.org/cdn/primevue/images/galleria/galleria6.jpg",
    thumbnailImageSrc:
      "https://primefaces.org/cdn/primevue/images/galleria/galleria6s.jpg",
    alt: "Description for Image 6",
    title: "Title 6",
    año: 2024,
  },
  {
    itemImageSrc:
      "https://primefaces.org/cdn/primevue/images/galleria/galleria7.jpg",
    thumbnailImageSrc:
      "https://primefaces.org/cdn/primevue/images/galleria/galleria7s.jpg",
    alt: "Description for Image 7",
    title: "Title 7",
    año: 2024,
  },
  {
    itemImageSrc:
      "https://primefaces.org/cdn/primevue/images/galleria/galleria8.jpg",
    thumbnailImageSrc:
      "https://primefaces.org/cdn/primevue/images/galleria/galleria8s.jpg",
    alt: "Description for Image 8",
    title: "Title 8",
    año: 2024,
  },
  {
    itemImageSrc:
      "https://primefaces.org/cdn/primevue/images/galleria/galleria9.jpg",
    thumbnailImageSrc:
      "https://primefaces.org/cdn/primevue/images/galleria/galleria9s.jpg",
    alt: "Description for Image 9",
    title: "Title 9",
    año: 2024,
  },
  {
    itemImageSrc:
      "https://primefaces.org/cdn/primevue/images/galleria/galleria10.jpg",
    thumbnailImageSrc:
      "https://primefaces.org/cdn/primevue/images/galleria/galleria10s.jpg",
    alt: "Description for Image 10",
    title: "Title 10",
    año: 2024,
  },
  {
    itemImageSrc:
      "https://primefaces.org/cdn/primevue/images/galleria/galleria11.jpg",
    thumbnailImageSrc:
      "https://primefaces.org/cdn/primevue/images/galleria/galleria11s.jpg",
    alt: "Description for Image 11",
    title: "Title 11",
    año: 2024,
  },
  {
    itemImageSrc:
      "https://primefaces.org/cdn/primevue/images/galleria/galleria12.jpg",
    thumbnailImageSrc:
      "https://primefaces.org/cdn/primevue/images/galleria/galleria12s.jpg",
    alt: "Description for Image 12",
    title: "Title 12",
    año: 2022,
  },
  {
    itemImageSrc:
      "https://primefaces.org/cdn/primevue/images/galleria/galleria13.jpg",
    thumbnailImageSrc:
      "https://primefaces.org/cdn/primevue/images/galleria/galleria13s.jpg",
    alt: "Description for Image 13",
    title: "Title 13",
    año: 2024,
  },
  {
    itemImageSrc:
      "https://primefaces.org/cdn/primevue/images/galleria/galleria14.jpg",
    thumbnailImageSrc:
      "https://primefaces.org/cdn/primevue/images/galleria/galleria14s.jpg",
    alt: "Description for Image 14",
    title: "Title 14",
    año: 2024,
  },
  {
    itemImageSrc:
      "https://primefaces.org/cdn/primevue/images/galleria/galleria12.jpg",
    thumbnailImageSrc:
      "https://primefaces.org/cdn/primevue/images/galleria/galleria12s.jpg",
    alt: "Description for Image 12",
    title: "Title 1",
    año: 2024,
  },
  {
    itemImageSrc:
      "https://primefaces.org/cdn/primevue/images/galleria/galleria13.jpg",
    thumbnailImageSrc:
      "https://primefaces.org/cdn/primevue/images/galleria/galleria13s.jpg",
    alt: "Description for Image 13",
    title: "Title 2",
    año: 2024,
  },
  {
    itemImageSrc:
      "https://primefaces.org/cdn/primevue/images/galleria/galleria14.jpg",
    thumbnailImageSrc:
      "https://primefaces.org/cdn/primevue/images/galleria/galleria14s.jpg",
    alt: "Description for Image 14",
    title: "Title 3",
    año: 0,
  },
]);

const activeIndex = ref(0);

const responsiveOptions = ref([
  {
    breakpoint: "1024px",
    numVisible: 5,
  },
  {
    breakpoint: "768px",
    numVisible: 3,
  },
  {
    breakpoint: "560px",
    numVisible: 1,
  },
]);
const displayCustom = ref(false);

const imageClick = (index) => {
  activeIndex.value = index;
  displayCustom.value = true;
};

const currentPage = ref(1);
const imagesPerPage = ref(12);
const cantidadPaginas = ref(
  Math.ceil(images.value.length / imagesPerPage.value)
);

const paginatedImages = computed(() => {
  const startIndex = (currentPage.value - 1) * imagesPerPage.value;
  const endIndex = startIndex + imagesPerPage.value;
  /*   console.log(activeIndexTab.value); */
  console.log(activeIndexTab.value);
  const añoImagen = añoMaximo.value - activeIndexTab.value;

  const filtradaAño = images.value.filter(
    (image) => image.Año === activeIndexTab.value
  );
  console.log(filtradaAño);
  console.log(activeIndexTab.value);
  cantidadPaginas.value = Math.ceil(filtradaAño.length / imagesPerPage.value);

  return filtradaAño ? filtradaAño.slice(startIndex, endIndex) : [];
});

const tabs = ref([]);
const activeIndexTab = ref(añoMaximo);

const handleTabClick = (index) => {
  activeIndexTab.value = index;
  currentPage.value = 1;
};

const pages = computed(() => {
  const pagesArray = [];
  for (let i = 1; i <= cantidadPaginas.value; i++) {
    pagesArray.push(i);
  }
  console.log(pagesArray);
  return pagesArray;
});

const goToPage = (page) => {
  currentPage.value = page;
};

const nextPage = () => {
  if (currentPage.value < cantidadPaginas.value) {
    currentPage.value++;
    console.log(currentPage.value);
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};
</script>

<style scoped>
.menu-bar {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.menu-bar button {
  cursor: pointer;
  padding: 10px 20px;
  margin: 10px 10px;
  border: none;
  border-radius: 5px;
  background-color: rgb(238, 250, 238);
  color: #333;
  transition: background-color 0.3s ease;
}

.menu-bar button:hover {
  background-color: #f0f0f0;
}

.menu-bar button.active {
  background-color: #007bff;
  color: #fff;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination button {
  cursor: pointer;
  padding: 6px 12px;
  margin: 0 2px;
  border-radius: 4px;
  border: none;
  background-color: transparent;
}

.pagination button:hover {
  background-color: #f0f0f0;
}

.pagination button:disabled {
  cursor: not-allowed;
  color: #ccc;
}

.pagination button .arrow {
  margin-right: 5px;
  font-size: 14px;
}

.pagination span {
  cursor: pointer;
  padding: 6px 12px;
  margin: 0 2px;
  border-radius: 4px;
}

.pagination span.active {
  background-color: #007bff;
  color: #fff;
}

.gallery {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  /*   align-items: center;  */
}

.columna {
  flex: 1 1 30%;
  /* align-self: center; */
  margin: 10px;
  text-align: center;
}

.columna img {
  width: 400px;
  height: 300px;
  display: block;
  border-radius: 5px;
  margin-left: auto; /* Centra la imagen horizontalmente */
  margin-right: auto; /* Centra la imagen horizontalmente */
}

.columna img:hover {
  filter: grayscale(50%);
}
</style>
