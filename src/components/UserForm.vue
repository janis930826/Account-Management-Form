<script setup lang="ts">
import { useUsersStore } from "../stores/useUsersStore";
import UserRow from "./UserRow.vue";

const store = useUsersStore();
const add = () => store.addUser();
</script>

<template>
  <div class="max-w-4xl mx-auto p-6">
    <div class="flex items-center flex-row gap-2 mb-4">
      <h2 class="text-xl text-gray-800 font-bold">Учетные записи</h2>
      <button
        class="border border-gray-500 text-gray-700 px-4 py-1 rounded cursor-pointer hover:bg-gray-50"
        @click="add">
        +
      </button>
    </div>

    <div
      class="w-full bg-gray-50 border border-gray-200 rounded p-3 mb-6 flex items-center">
      <div
        class="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
        <span class="text-white text-sm font-bold">?</span>
      </div>
      <p class="text-sm text-gray-800">
        Для указания нескольких меток для одной пары логин/пароль используйте
        разделитель ;
      </p>
    </div>

    <div class="space-y-2">
      <div class="user-row text-left px-2 pl-2">
        <p class="text-sm text-gray-800 w-40">Метки</p>
        <p class="text-sm text-gray-800 w-40">Тип записи</p>
        <p class="text-sm text-gray-800 w-40">Логин</p>
        <p class="text-sm text-gray-800 w-40">Пароль</p>
      </div>
      <UserRow
        v-for="(user, i) in store.users"
        :key="user.id"
        :user="user"
        :index="i" />
    </div>
  </div>
</template>
<style scoped>
.user-row {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}
</style>
