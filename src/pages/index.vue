<template>
  <VRow no-gutters class="auth-wrapper bg-surface">
    <VCol cols="12" lg="12" class="auth-card-v2 d-flex align-center justify-center">
      <VCard flat :max-width="500" class="mt-12 mt-sm-0 pa-4">
        <VCardText>
          <!-- Logo -->
          <div class="d-flex justify-center mb-4">
            <!-- <VNodeRenderer :nodes="themeConfig.app.logo" /> -->
            <!-- OR use <img> if you have a static image like: -->
            <img src="@/assets/images/Helper_Hub_Round.png" alt="Logo" height="200" width="200" />
          </div>

          <h5 class="text-h5 mb-1">
            Welcome to
            <span class="text-capitalize"> {{ themeConfig.app.title }} </span>!
          </h5>

          <p class="mb-0">
            Please sign-in to your account and start the adventure
          </p>
        </VCardText>
        <VAlert v-if="isAlertVisible" v-model="isAlertVisible" closable close-label="Close Alert" color="error"
          class="mb-4">
          <div class="d-flex flex-wrap" style="gap: 8px;">
            <span v-for="(msg, index) in errors" :key="index" class="error-chip">
              • {{ msg }}
            </span>
          </div>
        </VAlert>

        <VCardText>
          <VForm ref="formSubmit">
            <VRow>
              <!-- email -->
              <VCol cols="12">
                <AppTextField v-model="loginObject.email" label="Email" type="email"
                  :rules="[globalRequire, email].flat()" autofocus />
              </VCol>

              <!-- password -->
              <VCol cols="12">
                <AppTextField v-model="loginObject.password" label="Password"
                  :type="isPasswordVisible ? 'text' : 'password'" :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'
                    " :rules="[globalRequire].flat()" @click:append-inner="isPasswordVisible = !isPasswordVisible" />

                <div class="d-flex align-center flex-wrap justify-space-between mt-2 mb-4">
                  <!-- <VCheckbox v-model="rememberMe" label="Remember me" /> -->
                  <!-- <a class="text-primary ms-2 mb-1" href="#">
                  Forgot Password?
                </a> -->
                </div>

                <VBtn @click="login()" :disabled="isSubmit">
                  <VProgressCircular v-if="isSubmit" :size="30" width="3" color="error" indeterminate />
                  Login
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<script setup>
import { useGenerateImageVariant } from "@core/composable/useGenerateImageVariant";
import authV2LoginIllustrationBorderedDark from "@images/pages/auth-v2-login-illustration-bordered-dark.png";
import authV2LoginIllustrationBorderedLight from "@images/pages/auth-v2-login-illustration-bordered-light.png";
import authV2LoginIllustrationDark from "@images/pages/auth-v2-login-illustration-dark.png";
import authV2LoginIllustrationLight from "@images/pages/auth-v2-login-illustration-light.png";
import authV2MaskDark from "@images/pages/misc-mask-dark.png";
import authV2MaskLight from "@images/pages/misc-mask-light.png";
import { themeConfig } from "@themeConfig";

const authThemeImg = useGenerateImageVariant(
  authV2LoginIllustrationLight,
  authV2LoginIllustrationDark,
  authV2LoginIllustrationBorderedLight,
  authV2LoginIllustrationBorderedDark,
  true
);
const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark);
const isPasswordVisible = ref(false);
const rememberMe = ref(false);
</script>
<script>
import ls from "localstorage-slim";
import { useToast } from "vue-toastification";
import http from "../http-common";
const toast = useToast();
export default {
  name: "login",
  data() {
    return {
      globalRequire: [
        (value) => {
          if (value) return true;
          return "Required.";
        },
      ],
      email: [
        (v) =>
          !v ||
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          "Email must be valid",
      ],
      loginObject: {
        email: "",
        password: "",
      },
      isSubmit: false,
      errors: {},
      isAlertVisible: false,
    };
  },
  methods: {
    async login() {
      const checkValidation = await this.$refs.formSubmit.validate();
      if (checkValidation.valid) {
        this.isSubmit = true;
        http
          .post("/login", this.loginObject)
          .then((res) => {
            if (res.data.success) {
              // this.$store.commit("login", res.data.data);
              ls.set("user-info", res.data.data, { encrypt: true });
              location.reload();
              // this.$router.push({ name: "dashboard" });
            } else {
              toast.error(res.data.message);
              console.log(res.data.data);
              if (res.data.data) {
                this.errors = res.data.data;
                this.isAlertVisible = true;
              }
            }
            this.isSubmit = false;
          })
          .catch((e) => {
            console.log(e);
          });
      }
    },
  },
};
</script>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>

<route lang="yaml">
meta:
  layout: blank
</route>
