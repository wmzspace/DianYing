import { createApp } from "vue";
import { createPinia } from "pinia";
const pinia = createPinia();
import App from "./App.vue";
import router from "./router";

createApp(App).use(router).use(pinia).mount("#app");
