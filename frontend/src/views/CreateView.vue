<template>
  <div class="q-gutter-md" style="max-width: 400px;">
    <q-form @submit="onSubmit" class="q-gutter-md">
      <q-input v-model="title" label="Title" required />
      <q-input v-model="description" label="Description" type="textarea" />

      <q-select
        v-model="status"
        :options="statusOptions"
        label="Status"
        required
      />

      <q-input v-model="due_date" label="Due Date" type="date" />

      <q-btn label="Submit" type="submit" color="primary" />
    </q-form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import router from "../router";

const title = ref("");
const description = ref("");
const status = ref("Pending"); // ค่าเริ่มต้น
const due_date = ref("");

const statusOptions = ["Pending", "InProgress", "Completed"]; // ตัวเลือก Status

const onSubmit = () => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    title: title.value,
    description: description.value,
    status: status.value,
    due_date: due_date.value
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };

  fetch("http://localhost:8800/api/v1/tasks", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      alert(result.message);
      if (result.status === "ok") {
        
        title.value = "";
        description.value = "";
        status.value = "Pending";
        due_date.value = "";

        router.push("/"); // กลับไปหน้าแรก
      }
    })
    .catch((error) => console.error(error));
};
</script>
