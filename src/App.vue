<script setup>
import ScrollToTop from "@core/components/ScrollToTop.vue";
import { useThemeConfig } from "@core/composable/useThemeConfig";
import { hexToRgb } from "@layouts/utils";
import { useTheme } from "vuetify";

const {
  syncInitialLoaderTheme,
  syncVuetifyThemeWithTheme: syncConfigThemeWithVuetifyTheme,
  isAppRtl,
  handleSkinChanges,
} = useThemeConfig();

const { global } = useTheme();

// ℹ️ Sync current theme with initial loader theme
syncInitialLoaderTheme();
syncConfigThemeWithVuetifyTheme();
handleSkinChanges();
</script>

<script>
import ls from "localstorage-slim";
import http from "../src/http-common";
export default {
  data() {
    return {
      inactivityTimer: null,
      userData: ls.get("user-info", { decrypt: true }),
    };
  },
  created() {},
  mounted() {
    if (this.userData) {
      this.startInactivityTimer();
      window.addEventListener("mousemove", this.handleActivity);
    }
  },
  beforeUnmount() {
    if (this.userData) {
      window.removeEventListener("mousemove", this.handleActivity);
      this.clearInactivityTimer();
    }
  },
  methods: {
    startInactivityTimer() {
      this.inactivityTimer = setTimeout(() => {
        // Perform logout or other actions here
        this.logoutUser();
      }, 10 * 60 * 1000); // 10 minutes
    },
    clearInactivityTimer() {
      clearTimeout(this.inactivityTimer);
    },
    handleActivity() {
      // Reset the inactivity timer on user activity
      this.clearInactivityTimer();
      this.startInactivityTimer();
    },
    resetTimer() {
      this.handleActivity();
    },
    logoutUser() {
      http
        .post("/logout")
        .then((res) => {
          if (res.data.success) {
            this.$store.commit("logout");
            this.$router.push({ name: "index" });
          } else {
            // this.isError = true;
          }
        })
        .catch((e) => {});
    },
  },
};
</script>

<template>
  <VLocaleProvider :rtl="isAppRtl">
    <!-- ℹ️ This is required to set the background color of active nav link based on currently active global theme's primary -->
    <VApp
      :style="`--v-global-theme-primary: ${hexToRgb(
        global.current.value.colors.primary
      )}`"
    >
      <RouterView />
      <ScrollToTop />
      <div style="display: none">
        <div @mousemove="resetTimer"></div>
      </div>
    </VApp>
  </VLocaleProvider>
</template>
