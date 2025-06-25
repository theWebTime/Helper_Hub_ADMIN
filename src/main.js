/* eslint-disable import/order */
import "@/@fake-db/db";
import "@/@iconify/icons-bundle";
import App from "@/App.vue";
import layoutsPlugin from "@/plugins/layouts";
import vuetify from "@/plugins/vuetify";
import { loadFonts } from "@/plugins/webfontloader";
import router from "@/router";
import "@core/scss/template/index.scss";
import "@styles/styles.scss";
import { createPinia } from "pinia";
import 'sweetalert2/dist/sweetalert2.min.css';
import { createApp } from "vue";
import VueSweetalert2 from 'vue-sweetalert2';
import Toast, { useToast } from "vue-toastification";
import "vue-toastification/dist/index.css";
import store from "./store";
loadFonts();

const options = {
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33'
  };
  

const toast = useToast();
// Create vue app
const app = createApp(App);

// Use plugins
app.use(vuetify);
app.use(createPinia());
app.use(router);
app.use(Toast);
app.use(store);
app.use(layoutsPlugin);
app.use(VueSweetalert2, options);

app.config.globalProperties.$toast = toast;
// Mount vue app
app.mount("#app");
