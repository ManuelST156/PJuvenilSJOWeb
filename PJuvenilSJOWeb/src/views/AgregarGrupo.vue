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
            :disabled="!selectedGroups || !selectedGroups.length"
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
        :value="groups"
        v-model:selection="selectedGroups"
        dataKey="idGrupo"
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
            <h4 class="m-0">Tabla de Grupos</h4>
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
          field="NombreGrupo"
          header="Nombre Grupo"
          sortable
          style="min-width: 10rem"
        ></Column>
        <Column
          field="SubTituloGrupo"
          header="SubTitulo Grupo"
          sortable
          style="min-width: 16rem"
        ></Column>
        <Column
          field="DescripcionGrupo"
          header="Descripcion Grupo"
          sortable
          style="min-width: 10rem"
        ></Column>
        <Column
          field="InstagramLink"
          header="Instagram Link"
          sortable
          style="min-width: 10rem"
        ></Column>
        <Column
          field="FacebookLink"
          header="Facebook Link"
          sortable
          style="min-width: 10rem"
        ></Column>
        <Column
          field="TiktokLink"
          header="Tiktok Link"
          sortable
          style="min-width: 10rem"
        ></Column>
        <Column
          field="OtroLink"
          header="Otro Link"
          sortable
          style="min-width: 8rem"
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
      v-model:visible="groupDialog"
      :style="{ width: '450px' }"
      header="Detalle de los Grupos"
      :modal="true"
      class="p-fluid"
    >
      
      <div class="field">
        <label for="name">Nombre</label>
        <InputText
          id="name"
          v-model.trim="group.NombreGrupo"
          required="true"
          autofocus
          :class="{ 'p-invalid': submitted && !group.NombreGrupo }"
        />
        <small class="p-error" v-if="submitted && !group.NombreGrupo"
          >Nombre es requerido.</small
        >
      </div>

      <div class="field">
        <label for="subtitule">Subtitulo</label>
        <InputText
          id="subtitule"
          v-model.trim="group.SubTituloGrupo"
          required="true"
          autofocus
          :class="{ 'p-invalid': submitted && !group.SubTituloGrupo }"
        />
        <small class="p-error" v-if="submitted && !group.SubTituloGrupo"
          >Subtitulo es requerido.</small
        >
      </div>

      <div class="field">
        <label for="description">Descripcion Grupo</label>
        <Textarea
          id="description"
          v-model="group.DescripcionGrupo"
          required="true"
          rows="3"
          cols="20"
        />
      </div>

      <div class="field">
        <label for="instagram">Instagram Link</label>
        <InputText
          id="instagram"
          v-model.trim="group.InstagramLink"
          required="false"
          autofocus
        />
      </div>

      <div class="field">
        <label for="facebook">Facebook Link</label>
        <InputText
          id="facebook"
          v-model.trim="group.FacebookLink"
          required="false"
          autofocus
        />
      </div>

      <div class="field">
        <label for="tiktok">Tiktok Link</label>
        <InputText
          id="tiktok"
          v-model.trim="group.TiktokLink"
          required="false"
          autofocus
        />
      </div>

      <div class="field">
        <label for="otro">Otro Link</label>
        <InputText
          id="otro"
          v-model.trim="group.OtroLink"
          required="false"
          autofocus
        />
      </div>
      
      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" text @click="hideDialog" />
        <Button
          label="Guardar"
          icon="pi pi-check"
          :loading="loading"
          text
          @click="saveGroup"
        />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="deleteGroupDialog"
      :style="{ width: '450px' }"
      header="Confirmar"
      :modal="true"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span v-if="group"
          >Estas seguro de querer borrar este grupo? <b>{{ group.NombreGrupo }}</b
          >?</span
        >
      </div>
      <template #footer>
        <Button
          label="No"
          icon="pi pi-times"
          text
          @click="deleteGroupDialog = false"
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
      v-model:visible="deleteGroupsDialog"
      :style="{ width: '450px' }"
      header="Confirmar"
      :modal="true"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span v-if="group">Estas seguro de querer borrar estos Grupos?</span>
      </div>
      <template #footer>
        <Button
          label="No"
          icon="pi pi-times"
          text
          @click="deleteGroupsDialog = false"
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

  const dataGroups= await supabase
  .from("Grupo")
  .select("*");


  groups.value=dataGroups.data;
  console.log(groups.value);

});

const toast = useToast();
const dt = ref();
const groups = ref();
const groupDialog = ref(false);
const deleteGroupDialog = ref(false);
const deleteGroupsDialog = ref(false);
const group = ref({});
const selectedGroups = ref();
const editState = ref(false);
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const submitted = ref(false);
const loading = ref(false);

const openNew = () => {
  group.value = {};
  submitted.value = false;
  groupDialog.value = true;
};
const hideDialog = () => {
  groupDialog.value = false;
  submitted.value = false;
};




const saveGroup = async () => {
  submitted.value = true;
  loading.value = true;

  if (editState.value !== true) {
    try {


      if (group.value.NombreGrupo == undefined) {
        toast.add({
          severity: "error",
          summary: "El campo nombre no puede estar vacio",
          detail: "Grupo No Agregado",
          life: 3000,
        });
        return;
      } 

    

      const subirGroup = await supabase
        .from("Grupo")
        .insert([group.value])
        .select();
      
      loading.value = false;

      toast.add({
        severity: "success",
        summary: "Registrado Correctamente",
        detail: "Grupo Agregado",
        life: 3000,
      });

      groupDialog.value = false;
      group.value = {};

      const dataGroups = await supabase.from("Grupo").select("*");

      groups.value = dataGroups.data;
    } catch (error) {
      toast.add({
        severity: "error",
        summary: "Error al registra Grupo",
        detail: "Grupo No Agregada",
        life: 3000,
      });
    }
  } else {
    try {
      

      if (group.value.NombreGrupo == undefined) {
        toast.add({
          severity: "error",
          summary: "El campo nombre no puede estar vacio",
          detail: "Grupo No Agregado",
          life: 3000,
        });
        return;
      } 
     
      const { data, error } = await supabase
        .from("Grupo")
        .upsert(group.value)
        .select();
        
      loading.value = false;
      groups.value[findIndexById(group.value.idGrupo)] = group.value;
      console.log(groups.value);

      toast.add({
        severity: "success",
        summary: "Registrado Correctamente",
        detail: "Grupo Actualizado",
        life: 3000,
      });

      editState.value = false;
      groupDialog.value = false;
      group.value = {};

      const dataActivities = await supabase.from("Grupo").select("*");

      groups.value = dataActivities.data;
    } catch (error) {
      toast.add({
        severity: "error",
        summary: "Error al registrar Grupo",
        detail: "Grupo No Actualizado",
        life: 3000,
      });
    }
  }
};

const editProduct = (prod) => {
  console.log("Error");
  group.value = { ...prod };
  
  editState.value = true;
  groupDialog.value = true;
  console.log(groupDialog.value);
};

const confirmDeleteProduct = (prod) => {
  group.value = prod;
  deleteGroupDialog.value = true;
};

var groupForDelete;
const deleteProduct = async () => {
  groupForDelete = groups.value.filter((val) => val.idGrupo == group.value.idGrupo);
  console.log(groupForDelete[0].idGrupo);
  loading.value = true;

  const { error } = await supabase
    .from("Grupo")
    .delete()
    .eq("idGrupo", groupForDelete[0].idGrupo);
  
  loading.value = false;

  const dataGroups = await supabase.from("Grupo").select("*");

  groups.value = dataGroups.data;
  console.log(groups.value);

  deleteGroupDialog.value = false;
  group.value = {};

  toast.add({
    severity: "success",
    summary: "Grupo Borrado Exitosamente",
    detail: "Grupo Borrado",
    life: 3000,
  });
};

const findIndexById = (id) => {
  let index = -1;
  for (let i = 0; i < groups.value.length; i++) {
    if (groups.value[i].id === id) {
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
  deleteGroupsDialog.value = true;
};

var groupsForDelete = {};
const deleteSelectedProducts = async () => {
  groupsForDelete = groups.value.filter((val) =>
    selectedGroups.value.includes(val)
  );

  loading.value = true;
  const deleteOperations = groupsForDelete.map(async (element) => {
    const { error } = await supabase
      .from("Grupo")
      .delete()
      .eq("idGrupo", element.idGrupo);

  });

  await Promise.all(deleteOperations);
  loading.value = false;
  toast.add({
    severity: "success",
    summary: "Grupos Borrados Correctamente",
    detail: "Grupos Eliminados",
    life: 3000,
  });

  const dataActivities = await supabase.from("Grupo").select("*");
  groups.value = dataActivities.data;

  deleteGroupsDialog.value = false;

  selectedGroups.value = null;
};
</script>
