<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { TrashIcon } from "@heroicons/vue/24/outline";
import type { User } from "../stores/useUsersStore";
import { useUsersStore } from "../stores/useUsersStore";
import { EyeSlashIcon, EyeIcon } from "@heroicons/vue/24/solid";

const props = defineProps<{ user: User; index: number }>();

const store = useUsersStore();
const passwordVisible = ref(false);

const deleteRow = (id: number) => store.deleteUser(id);

const toggleVisibility = () => {
  passwordVisible.value = !passwordVisible.value;
};

// Create computed properties for two-way binding
const metaValue = computed({
  get: () => props.user.meta,
  set: (value: string) => {
    store.updateUser(props.user.id, { meta: value });
  },
});

const loginValue = computed({
  get: () => props.user.login,
  set: (value: string) => {
    store.updateUser(props.user.id, { login: value });
  },
});

const passwordValue = computed({
  get: () => props.user.password || "",
  set: (value: string) => {
    store.updateUser(props.user.id, { password: value });
  },
});

const typeValue = computed({
  get: () => props.user.type,
  set: (value: "Локальная" | "LDAP") => {
    if (value === "LDAP") {
      store.updateUser(props.user.id, { type: value, password: null });
    } else {
      store.updateUser(props.user.id, { type: value });
    }
  },
});

// Watch for type changes to handle password field
watch(
  () => props.user.type,
  (newType) => {
    if (newType === "LDAP") {
      store.updateUser(props.user.id, { password: null });
    }
  }
);
</script>

<template>
  <div class="user-row p-2 rounded hover:bg-gray-50">
    <input
      :class="[
        'border rounded px-2 py-1 w-40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
        user.errors.meta ? 'border-red-500' : 'border-gray-200',
      ]"
      v-model="metaValue"
      @blur="store.validateUser(user.id)"
      placeholder="Метки"
      maxlength="50" />
    <select
      :class="[
        'border rounded px-2 py-1 w-40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
        'border-gray-200',
      ]"
      v-model="typeValue">
      <option value="Локальная">Локальная</option>
      <option value="LDAP">LDAP</option>
    </select>
    <input
      :class="[
        user.type === 'LDAP'
          ? 'border rounded px-2 py-1 w-82 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          : 'border rounded px-2 py-1 w-40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
        user.errors.login ? 'border-red-500' : 'border-gray-200',
      ]"
      v-model="loginValue"
      @blur="store.validateUser(user.id)"
      placeholder="Логин"
      maxlength="100" />
    <div class="flex w-40" v-if="user.type === 'Локальная'">
      <input
        :type="passwordVisible ? 'text' : 'password'"
        :class="[
          'border rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          user.errors.password ? 'border-red-500' : 'border-gray-200',
        ]"
        v-model="passwordValue"
        @blur="store.validateUser(user.id)"
        placeholder="Пароль"
        maxlength="100" />
      <button
        class="-ml-6 text-gray-500 hover:text-gray-700 cursor-pointer"
        @click="toggleVisibility">
        <component
          :is="passwordVisible ? EyeSlashIcon : EyeIcon"
          class="w-5 h-5" />
      </button>
    </div>
    <button
      class="text-gray-500 hover:text-red-600 transition-colors cursor-pointer"
      @click="deleteRow(user.id)">
      <TrashIcon class="h-5 w-5" />
    </button>
  </div>
</template>

<style scoped>
.user-row {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}
</style>
