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
              :disabled="!selectedActivities || !selectedActivities.length"
            />
          </template>
  
          <template #end>
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
          :value="activities"
          v-model:selection="selectedActivities"
          dataKey="idActividad"
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
              <h4 class="m-0">Tabla de Actividades</h4>
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
            field="NombreActividad"
            header="Nombre Actividad"
            sortable
            style="min-width: 16rem"
          ></Column>
          <Column
            field="DescripcionActividad"
            header="Descripcion Actividad"
            sortable
            style="min-width: 10rem"
          ></Column>
          
        
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
        v-model:visible="activityDialog"
        :style="{ width: '450px' }"
        header="Detalle de las Actividades"
        :modal="true"
        class="p-fluid"
      >
        
        <div class="field">
          <label for="name">Nombre</label>
          <InputText
            id="name"
            v-model.trim="activity.NombreActividad"
            required="true"
            autofocus
            :class="{ 'p-invalid': submitted && !activity.NombreActividad }"
          />
          <small class="p-error" v-if="submitted && !activity.NombreActividad"
            >Nombre es requerido.</small
          >
        </div>
        <div class="field">
          <label for="description">Descripcion Actividad</label>
          <Textarea
            id="description"
            v-model="activity.DescripcionActividad"
            required="true"
            rows="3"
            cols="20"
          />
        </div>
        
        <template #footer>
          <Button label="Cancelar" icon="pi pi-times" text @click="hideDialog" />
          <Button
            label="Guardar"
            icon="pi pi-check"
            :loading="loading"
            text
            @click="saveActivity"
          />
        </template>
      </Dialog>
  
      <Dialog
        v-model:visible="deleteActivityDialog"
        :style="{ width: '450px' }"
        header="Confirmar"
        :modal="true"
      >
        <div class="confirmation-content">
          <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
          <span v-if="activity"
            >Estas seguro de querer borrar esta actividad? <b>{{ activity.NombreActividad }}</b
            >?</span
          >
        </div>
        <template #footer>
          <Button
            label="No"
            icon="pi pi-times"
            text
            @click="deleteActivityDialog = false"
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
        v-model:visible="deleteActivitiesDialog"
        :style="{ width: '450px' }"
        header="Confirmar"
        :modal="true"
      >
        <div class="confirmation-content">
          <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
          <span v-if="activity">Estas seguro de querer borrar estas actividades?</span>
        </div>
        <template #footer>
          <Button
            label="No"
            icon="pi pi-times"
            text
            @click="deleteActivitiesDialog = false"
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
  
    const dataActivities= await supabase
    .from("Actividad")
    .select("*");
  

    activities.value=dataActivities.data;
    console.log(activities.value);
  
  });
  
  const toast = useToast();
  const dt = ref();
  const activities = ref();
  const activityDialog = ref(false);
  const deleteActivityDialog = ref(false);
  const deleteActivitiesDialog = ref(false);
  const activity = ref({});
  const selectedActivities = ref();
  const editState = ref(false);
  const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const submitted = ref(false);
  const loading = ref(false);
  
  const openNew = () => {
    activity.value = {};
    submitted.value = false;
    activityDialog.value = true;
  };
  const hideDialog = () => {
    activityDialog.value = false;
    submitted.value = false;
  };
  

 
  
  const saveActivity = async () => {
    submitted.value = true;
    loading.value = true;
  
    if (editState.value !== true) {
      try {

  
        if (activity.value.NombreActividad == undefined) {
          toast.add({
            severity: "error",
            summary: "El campo nombre no puede estar vacio",
            detail: "Actividad No Agregada",
            life: 3000,
          });
          return;
        } 
  
      

        const subirActividad = await supabase
          .from("Actividad")
          .insert([activity.value])
          .select();
        
        loading.value = false;
  
        toast.add({
          severity: "success",
          summary: "Registrado Correctamente",
          detail: "Actividad Agregada",
          life: 3000,
        });
  
        activityDialog.value = false;
        activity.value = {};
  
        const dataActivities = await supabase.from("Actividad").select("*");
  
        activities.value = dataActivities.data;
      } catch (error) {
        toast.add({
          severity: "error",
          summary: "Error al registrar actividad",
          detail: "Actividad No Agregada",
          life: 3000,
        });
      }
    } else {
      try {
        
  
        if (activity.value.NombreActividad == undefined) {
          toast.add({
            severity: "error",
            summary: "El campo nombre no puede estar vacio",
            detail: "Actividad No Agregada",
            life: 3000,
          });
          return;
        } 
       
        const { data, error } = await supabase
          .from("Actividad")
          .upsert(activity.value)
          .select();
          
        loading.value = false;
        activities.value[findIndexById(activity.value.idActividad)] = activity.value;
        console.log(activities.value);
  
        toast.add({
          severity: "success",
          summary: "Registrado Correctamente",
          detail: "Actividad Actualizada",
          life: 3000,
        });
  
        editState.value = false;
        activityDialog.value = false;
        activity.value = {};

        const dataActivities = await supabase.from("Actividad").select("*");
  
        activities.value = dataActivities.data;
      } catch (error) {
        toast.add({
          severity: "error",
          summary: "Error al registrar Actividad",
          detail: "Actividad No Actualizada",
          life: 3000,
        });
      }
    }
  };
  
  const editProduct = (prod) => {
    console.log("Error");
    activity.value = { ...prod };
    
    editState.value = true;
    activityDialog.value = true;
    console.log(activityDialog.value);
  };
  
  const confirmDeleteProduct = (prod) => {
    activity.value = prod;
    deleteActivityDialog.value = true;
  };
  
  var activityForDelete;
  const deleteProduct = async () => {
    activityForDelete = activities.value.filter((val) => val.idActividad == activity.value.idActividad);
    console.log(activityForDelete[0].idActividad);
    loading.value = true;
  
    const { error } = await supabase
      .from("Actividad")
      .delete()
      .eq("idActividad", activityForDelete[0].idActividad);
    
    loading.value = false;
  
    const dataActivities = await supabase.from("Actividad").select("*");
  
    activities.value = dataActivities.data;
    console.log(activities.value);
  
    deleteActivityDialog.value = false;
    activity.value = {};
  
    toast.add({
      severity: "success",
      summary: "Actividad Borrada Exitosamente",
      detail: "Actividad Borrada",
      life: 3000,
    });
  };
  
  const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < activities.value.length; i++) {
      if (activities.value[i].id === id) {
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
    deleteActivitiesDialog.value = true;
  };
  
  var activitiesForDelete = {};
  const deleteSelectedProducts = async () => {
    activitiesForDelete = activities.value.filter((val) =>
      selectedActivities.value.includes(val)
    );
  
    loading.value = true;
    const deleteOperations = activitiesForDelete.map(async (element) => {
      const { error } = await supabase
        .from("Actividad")
        .delete()
        .eq("idActividad", element.idActividad);
  
    });
  
    await Promise.all(deleteOperations);
    loading.value = false;
    toast.add({
      severity: "success",
      summary: "Actividades Borradas Correctamente",
      detail: "Actividades Eliminadas",
      life: 3000,
    });
  
    const dataActivities = await supabase.from("Actividad").select("*");
    activities.value = dataActivities.data;
  
    deleteActivitiesDialog.value = false;
  
    selectedActivities.value = null;
  };
  </script>
  