<template>
  <div class="q-pa-md">
    <div class="q-py-md">
      <q-btn icon="add" color="primary " @click="onCreate"/>
    </div>
    <q-table
      title="Treats"
      :rows="rows"
      :columns="columns"
      row-key="name"
    >
    <template v-slot:body-cell-actions = "props">
      <q-td :props="props">
        <q-btn
          flat
          dense
          round
          icon="edit"
          color="warning"
          @click="onEdit(props.row.id)"
        />
        <q-btn
        flat
          dense
          round
          icon="delete"
          color="negative"
          @click="onDelete(props.row.id)"
        />
      </q-td>
    </template>
  </q-table>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import router from '../router'

const columns = [
  { name: 'task_id', align: 'center', label: 'Task ID', field: 'id', sortable: true },
  { name: 'title', align: 'center', label: 'Title', field: 'title', sortable: true },
  { name: 'description', align: 'center', label: 'Description', field: 'description', sortable: true },
  { name: 'status', align: 'center', label: 'Status', field: 'status', sortable: true },
  { name: 'due_date', align: 'center', label: 'Due Date', field: 'due_date', sortable: true },
  { name: 'created_at', align: 'center', label: 'Created At', field: 'created_at', sortable: true },
  { name: 'actions', align: 'center', label: 'Actions', field: 'id', sortable: false },
]


const rows = ref([])
const fetchData = async () => {
  fetch('http://localhost:8800/api/V1/tasks')
    .then(res => res.json())
    .then(result => {
      rows.value = result
    })
}
fetchData()

const onCreate = () => {
  router.push('/create')
}

const onEdit = (id) => {
  router.push('update/'+id)
  console.log(id)
}

const onDelete = (id) => {
  const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
  const requestOptions = {
  method: "DELETE",
  redirect: "follow"
};

fetch(`http://localhost:8800/api/V1/tasks/${id}`, requestOptions)
  .then((response) => response.json())
  .then((result) => {
    alert(result.message);
    console.log(result)
    if (result.status === 'ok') {
      router.push('/');
    }
    fetchData()
  })
  .catch((error) => console.error(error));
}


</script>