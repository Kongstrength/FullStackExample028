<template>
  <div class="q-gutter-md" style="max-width: 400px;">
    <q-form @submit="onSubmit" class="q-gutter-md">
      <q-input v-model="id" label="id" readonly />
      <q-input v-model="title" label="Title" required />
      <q-input v-model="description" label="Description" type="textarea" />

      <q-select
  v-model="status"
  :options="statusOptions"
  label="Status"
  map-options
  emit-value
  required
/>

      <q-input v-model="due_date" label="Due Date" type="date" />
      <q-input v-model="created_at" label="Created At" readonly />
      <q-btn label="Submit" type="submit" color="primary" />
    </q-form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {useRoute, useRouter} from 'vue-router'

const route = useRoute()
const router = useRouter()

const id = ref(route.params.id)
const title = ref("")
const description = ref("")
const status = ref("Pending")
const due_date = ref("")
const created_at = ref("")


const fetchData = () => {
    fetch(`http://localhost:8800/api/V1/tasks/${id.value}`)
    .then(res => res.json())
    .then(result => {
        title.value = result.title
        description.value = result.description
        status.value = result.status
        due_date.value = result.due_date ? result.due_date.split("T")[0] : "";
        created_at.value = result.created_at
    })
}
fetchData()

const onSubmit =  () => {
    const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  title: title.value,
  description: description.value,
  status: status.value,
  due_date: due_date.value
});

const requestOptions = {
  method: "PUT",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("http://localhost:8800/api/V1/tasks/"+ id.value, requestOptions)
  .then((response) => {
    if (!response.ok) {
       return response.json().then((error) => {
         throw new Error(error.message || 'Something went wrong.');
       });
    }
    return response.json();
  })
  .then((result) => {
    alert(result.message);
    if (result.status === "ok") {
      router.push("/");
    }
    fetchData()
  })
  .catch((error) => {
    console.error('error',error);
    alert(`Error: ${error.message}`);   
  });
}
</script>

