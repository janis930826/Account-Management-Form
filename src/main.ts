import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";

import { createPinia } from "pinia";
import { useUsersStore } from "./stores/useUsersStore";

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);

// Initialize store and load data from localStorage
const usersStore = useUsersStore();
usersStore.loadFromStorage();

app.mount("#app");
