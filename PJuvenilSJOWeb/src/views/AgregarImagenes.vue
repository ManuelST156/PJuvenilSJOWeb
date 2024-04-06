<template>
  <Toast />
  <div>
    <div class="card">
      <Toolbar class="mb-4">
        <template #start>
          <Button
            label="Agregar"
            icon="pi pi-plus"
            severity="success"
            class="mr-2"
            @click="openNew"
          />
          <Button
            label="Eliminar"
            icon="pi pi-trash"
            severity="danger"
            @click="confirmDeleteSelected"
            :disabled="!selectedImages || !selectedImages.length"
          />
        </template>

        <template #end>
          <Button label="Subir Imagenes" @click="imagesDialog = true" />
          <Button
            label="Exportar Excel"
            icon="pi pi-upload"
            severity="help"
            @click="exportCSV($event)"
          />
        </template>
      </Toolbar>

      <DataTable
        ref="dt"
        :value="images"
        v-model:selection="selectedImages"
        dataKey="id"
        :paginator="true"
        :rows="10"
        :filters="filters"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 25]"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
      >
        <template #header>
          <div
            class="flex flex-wrap gap-2 align-items-center justify-content-between"
          >
            <h4 class="m-0">Tabla de Imagenes</h4>
            <IconField iconPosition="left">
              <InputIcon>
                <i class="pi pi-search" />
              </InputIcon>
              <InputText
                v-model="filters['global'].value"
                placeholder="Search..."
              />
            </IconField>
          </div>
        </template>

        <Column
          selectionMode="multiple"
          style="width: 3rem"
          :exportable="false"
        ></Column>
        <Column
          field="CodigoImagen"
          header="Codigo"
          sortable
          style="min-width: 16rem"
        ></Column>
        <Column
          field="Nombre"
          header="Nombre"
          sortable
          style="min-width: 16rem"
        ></Column>
        <Column
          field="Descripcion"
          header="Descripcion"
          sortable
          style="min-width: 10rem"
        ></Column>
        <Column
          field="Año"
          header="Año"
          sortable
          style="min-width: 10rem"
        ></Column>

        <Column header="Imagenes">
          <template #body="slotProps">
            <img
              :src="slotProps.data.ImageURL"
              :alt="slotProps.data.image"
              class="border-round"
              style="width: 64px"
            />
          </template>
        </Column>

        <Column :exportable="false" style="min-width: 8rem">
          <template #body="slotProps">
            <Button
              icon="pi pi-pencil"
              outlined
              rounded
              class="mr-2"
              @click="editProduct(slotProps.data)"
            />
            <Button
              icon="pi pi-trash"
              outlined
              rounded
              severity="danger"
              @click="confirmDeleteProduct(slotProps.data)"
            />
          </template>
        </Column>
      </DataTable>
    </div>

    <Dialog
      v-model:visible="imageDialog"
      :style="{ width: '450px' }"
      header="Detalle de la Imagen"
      :modal="true"
      class="p-fluid"
    >
      <img
        :src="image.ImageURL"
        :alt="image.image"
        class="block m-auto pb-3"
        style="max-height: 25%; max-width: 25%"
      />
      <div class="field">
        <label for="name">Nombre</label>
        <InputText
          id="name"
          v-model.trim="image.Nombre"
          required="true"
          autofocus
          :class="{ 'p-invalid': submitted && !image.Nombre }"
        />
        <small class="p-error" v-if="submitted && !image.Nombre"
          >Nombre es requerido.</small
        >
      </div>
      <div class="field">
        <label for="description">Descripcion</label>
        <Textarea
          id="description"
          v-model="image.Descripcion"
          required="true"
          rows="3"
          cols="20"
        />
      </div>
      <div class="field">
        <label for="year">Año</label>
        <InputText
          id="year"
          v-model.trim="image.Año"
          required="true"
          autofocus
          :class="{ 'p-invalid': submitted && !image.Año }"
        />
        <small class="p-error" v-if="submitted && !image.Año"
          >Año es requerido.</small
        >
      </div>

      <div class="card">
        <!-- <Toast /> -->
        <FileUpload
          :showUploadButton="false"
          :show-cancel-button="false"
          choose-label="Subir Imagen"
          ref="fileUpload"
          @upload="onAdvancedUpload($event)"
          accept="image/*,video/*"
          :maxFileSize="314572800"
        >
          <template #empty>
            <p>Arrastra y suelta una imagen o Escoge una local.</p>
          </template>
        </FileUpload>
      </div>

      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" text @click="hideDialog" />
        <Button
          label="Guardar"
          icon="pi pi-check"
          :loading="loading"
          text
          @click="saveImage"
        />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="deleteImageDialog"
      :style="{ width: '450px' }"
      header="Confirmar"
      :modal="true"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span v-if="image"
          >Estas seguro de querer borrar esta imagen? <b>{{ image.name }}</b
          >?</span
        >
      </div>
      <template #footer>
        <Button
          label="No"
          icon="pi pi-times"
          text
          @click="deleteImageDialog = false"
        />
        <Button
          label="Si"
          icon="pi pi-check"
          :loading="loading"
          text
          @click="deleteProduct"
        />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="deleteImagesDialog"
      :style="{ width: '450px' }"
      header="Confirmar"
      :modal="true"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span v-if="image">Estas seguro de querer borrar estas imagenes?</span>
      </div>
      <template #footer>
        <Button
          label="No"
          icon="pi pi-times"
          text
          @click="deleteImagesDialog = false"
        />
        <Button
          label="Si"
          icon="pi pi-check"
          :loading="loading"
          text
          @click="deleteSelectedProducts"
        />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="imagesDialog"
      :style="{ width: '450px' }"
      header="Detalle de la Imagen"
      :modal="true"
      class="p-fluid"
    >
      <div class="card">
        <!-- <Toast /> -->
        <FileUpload
          :showUploadButton="false"
          :show-cancel-button="false"
          choose-label="Subir Imagen"
          ref="fileUpload"
          @upload="onAdvancedUpload($event)"
          :multiple="true"
          accept="image/*"
          :maxFileSize="314572800"
        >
          <template #empty>
            <p>Arrastra y suelta una imagen o Escoge una local.</p>
          </template>
        </FileUpload>
      </div>

      <template #footer>
        <Button
          label="Cancelar"
          icon="pi pi-times"
          text
          @click="imagesDialog = false"
        />
        <Button
          label="Guardar"
          icon="pi pi-check"
          :loading="loading"
          text
          @click="saveMuchImages"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { FilterMatchMode } from "primevue/api";
import { useToast } from "primevue/usetoast";
import { createClient } from "@supabase/supabase-js";
import { uid } from "uid";
import { useRouter } from "vue-router";

const router = useRouter();
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

onMounted(async () => {
  if (localStorage.getItem("token") == null) {
    router.push({ name: "home" });
  }

  const dataImages = await supabase.from("Imagenes").select("*");

  images.value = dataImages.data;
  console.log(images.value);
});

const toast = useToast();
const dt = ref();
const images = ref();
const imageDialog = ref(false);
const deleteImageDialog = ref(false);
const deleteImagesDialog = ref(false);
const imagesDialog = ref(false);
const image = ref({});
const selectedImages = ref();
const editState = ref(false);
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const submitted = ref(false);
const loading = ref(false);

const openNew = () => {
  image.value = {};
  submitted.value = false;
  imageDialog.value = true;
};
const hideDialog = () => {
  imageDialog.value = false;
  submitted.value = false;
};

const fileUpload = ref(null);
/* const imagenCargada= ref(null); */

const imagenes = [];

const saveMuchImages = async () => {
  loading.value = true;
  const Upload = fileUpload.value;

  for (let i = 0; i < Upload.files.length; i++) {
    var nombreImagen = uid(16).toString();

    const subirStorage = await supabase.storage
      .from("Imagenes")
      .upload(nombreImagen, Upload.files[i]);

    const urlDescargar = supabase.storage
      .from("Imagenes")
      .getPublicUrl(nombreImagen);

    image.value.Nombre = nombreImagen;
    image.value.CodigoImagen = nombreImagen;

    const today = new Date();
    image.value.Año = today.getFullYear();
    image.value.ImageURL = urlDescargar.data.publicUrl;

    imagenes.push({ ...image.value });
  }

  const { data, error } = await supabase.from("Imagenes").insert(imagenes);

  loading.value = false;
  const dataImages = await supabase.from("Imagenes").select("*");

  images.value = dataImages.data;

  imagesDialog.value = false;
};

const saveImage = async () => {
  submitted.value = true;
  loading.value = true;

  if (editState.value !== true) {
    try {
      const Upload = fileUpload.value;

      if (image.value.Nombre == undefined) {
        toast.add({
          severity: "error",
          summary: "El campo nombre no puede estar vacio",
          detail: "Imagen No Agregada",
          life: 3000,
        });
        return;
      } else if (image.value.Año == undefined) {
        toast.add({
          severity: "error",
          summary: "El campo Año no puede estar vacio",
          detail: "Imagen No Agregada",
          life: 3000,
        });
        return;
      } else if (Upload.files[0] == undefined) {
        toast.add({
          severity: "error",
          summary: "El campo Imagen no puede estar vacio",
          detail: "Imagen No Agregada",
          life: 3000,
        });
        return;
      }

      if (Upload.files.length > 0) {
        const imagen = Upload.files[0];

        var nombreImagen = uid(16).toString();

        const subirStorage = await supabase.storage
          .from("Imagenes")
          .upload(nombreImagen, imagen);

        const urlDescargar = supabase.storage
          .from("Imagenes")
          .getPublicUrl(nombreImagen);

        image.value.CodigoImagen = nombreImagen;
        image.value.ImageURL = urlDescargar.data.publicUrl;
      }

      const subirImagen = await supabase
        .from("Imagenes")
        .insert([image.value])
        .select();

      loading.value = false;

      toast.add({
        severity: "success",
        summary: "Registrado Correctamente",
        detail: "Imagen Agregada",
        life: 3000,
      });

      imageDialog.value = false;
      image.value = {};

      const dataImages = await supabase.from("Imagenes").select("*");

      images.value = dataImages.data;
    } catch (error) {
      toast.add({
        severity: "error",
        summary: "Error al registrar imagen",
        detail: "Imagen No Agregada",
        life: 3000,
      });
    }
  } else {
    try {
      const Upload = fileUpload.value;

      if (image.value.Nombre == undefined) {
        toast.add({
          severity: "error",
          summary: "El campo nombre no puede estar vacio",
          detail: "Imagen No Agregada",
          life: 3000,
        });
        return;
      } else if (image.value.Año == undefined) {
        toast.add({
          severity: "error",
          summary: "El campo Año no puede estar vacio",
          detail: "Imagen No Agregada",
          life: 3000,
        });
        return;
      }

      if (Upload.files[0] !== undefined) {
        if (Upload.files.length > 0) {
          const imagen = Upload.files[0];

          var nombreImagen = uid(16).toString();

          const subirStorage = await supabase.storage
            .from("Imagenes")
            .upload(nombreImagen, imagen);

          const urlDescargar = supabase.storage
            .from("Imagenes")
            .getPublicUrl(nombreImagen);

          image.value.ImageURL = urlDescargar.data.publicUrl;
        }
      }

      const { data, error } = await supabase
        .from("Imagenes")
        .upsert(image.value)
        .select();
      loading.value = false;
      images.value[findIndexById(image.value.id)] = image.value;
      console.log(images.value);

      toast.add({
        severity: "success",
        summary: "Registrado Correctamente",
        detail: "Imagen Actualizada",
        life: 3000,
      });

      editState.value = false;
      imageDialog.value = false;
      image.value = {};
    } catch (error) {
      toast.add({
        severity: "error",
        summary: "Error al registrar imagen",
        detail: "Imagen No Actualizada",
        life: 3000,
      });
    }
  }
};

const editProduct = (prod) => {
  image.value = { ...prod };
  editState.value = true;
  imageDialog.value = true;
};

const confirmDeleteProduct = (prod) => {
  image.value = prod;
  deleteImageDialog.value = true;
};

var imageForDelete;
const deleteProduct = async () => {
  imageForDelete = images.value.filter((val) => val.id == image.value.id);
  console.log(imageForDelete[0].id);
  loading.value = true;

  const { error } = await supabase
    .from("Imagenes")
    .delete()
    .eq("id", imageForDelete[0].id);

  const deleteFromBucket = await supabase.storage
    .from("Imagenes")
    .remove([images.value[0].CodigoImagen]);

  loading.value = false;

  const dataImages = await supabase.from("Imagenes").select("*");

  images.value = dataImages.data;
  console.log(images.value);

  deleteImageDialog.value = false;
  image.value = {};

  toast.add({
    severity: "success",
    summary: "Imagen Borrada Exitosamente",
    detail: "Imagen Borrada",
    life: 3000,
  });
};

const findIndexById = (id) => {
  let index = -1;
  for (let i = 0; i < images.value.length; i++) {
    if (images.value[i].id === id) {
      index = i;
      break;
    }
  }

  return index;
};

const exportCSV = () => {
  dt.value.exportCSV();
};

const confirmDeleteSelected = () => {
  deleteImagesDialog.value = true;
};

var imagesForDelete = {};
const deleteSelectedProducts = async () => {
  imagesForDelete = images.value.filter((val) =>
    selectedImages.value.includes(val)
  );

  loading.value = true;
  const deleteOperations = imagesForDelete.map(async (element) => {
    const { error } = await supabase
      .from("Imagenes")
      .delete()
      .eq("id", element.id);

    const deleteFromBucket = await supabase.storage
      .from("Imagenes")
      .remove([element.CodigoImagen]);
  });

  await Promise.all(deleteOperations);
  loading.value = false;
  toast.add({
    severity: "success",
    summary: "Imagenes Borradas Correctamente",
    detail: "Imagenes Eliminadas",
    life: 3000,
  });

  const dataImages = await supabase.from("Imagenes").select("*");
  images.value = dataImages.data;

  deleteImagesDialog.value = false;

  selectedImages.value = null;
};
</script>
