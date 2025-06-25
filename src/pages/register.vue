<template>
  <VContainer class="d-flex justify-center align-center py-10 px-4" style="min-height: 100vh;">
    <VCard class="pa-6" elevation="10" rounded="xl" style="width: 100%; max-width: 1400px;">
      <!-- Logo and Title -->
      <VCardText class="text-center mb-6">
        <div class="d-flex justify-center mb-4">
          <!-- Replace with your logo path or use themeConfig -->
          <img src="@/assets/images/Quotation_Hub.png" alt="Logo" height="200" width="200" />
        </div>
        <h2 class="text-h5 font-weight-bold text-primary mb-1">Register Your Studio</h2>
        <p class="text-subtitle-2 text-grey-darken-1">Fill the form below to create an account</p>
      </VCardText>

      <!-- Error Alert -->
      <VAlert v-model="isAlertVisible" closable close-label="Close Alert" color="error" class="mb-6" border="start"
        variant="tonal">
        <ul v-for="(value, key) in errors" :key="key">
          <li v-for="(value1, key1) in value" :key="key1">→ {{ value1 }}</li>
        </ul>
      </VAlert>

      <!-- Form -->
      <VForm ref="formSubmit">
        <VCardText>
          <VRow dense>
            <!-- Logo Upload -->
            <VCol cols="12" sm="6" md="4">
              <label class="text-subtitle-1 font-weight-medium mb-1">Logo Image</label>
              <v-file-input accept="image/*" v-model="image" show-size prepend-icon="mdi-camera"
                placeholder="Upload Logo" ref="file" density="comfortable" rounded variant="outlined" />
            </VCol>

            <!-- Name -->
            <VCol cols="12" sm="6" md="4">
              <AppTextField v-model="insertData.name" label="Name" :rules="[globalRequire, nameMin, nameMax].flat()" />
            </VCol>

            <!-- Phone -->
            <VCol cols="12" sm="6" md="4">
              <AppTextField v-model="insertData.phone_number" label="Phone Number" type="number"
                :rules="[globalRequire, numberMin, numberMax].flat()" />
            </VCol>

            <!-- Studio -->
            <VCol cols="12" sm="6" md="4">
              <AppTextField v-model="insertData.studio_name" label="Studio Name"
                :rules="[globalRequire, nameMin, nameMax].flat()" />
            </VCol>

            <!-- Address -->
            <VCol cols="12" sm="6" md="4">
              <v-textarea v-model="insertData.address" label="Street Address" :rows="3" :rules="[globalRequire].flat()"
                variant="outlined" rounded />
            </VCol>

            <!-- Email -->
            <VCol cols="12" sm="6" md="4">
              <AppTextField v-model="insertData.email" label="Email" :rules="[email, globalRequire].flat()" />
            </VCol>

            <!-- Password -->
            <VCol cols="12" sm="6" md="4">
              <AppTextField v-model="insertData.password" label="Password" type="password"
                :rules="[passwordMin].flat()" />
            </VCol>
            <VCol cols="12" sm="6" md="4">
              <AppTextField type="password" :rules="[passwordMin].flat()" v-model="insertData.c_password"
                label="Confirm Password" />
            </VCol>
            <!-- Subscription Date -->
            <!--  <VCol cols="12" sm="6" md="4">
              <AppTextField v-model="insertData.subscription_date" label="Subscription Date" type="date"
                :rules="[globalRequire].flat()" />
            </VCol> -->
            <VCol cols="12" sm="6" md="4">
              <AppTextField v-model="insertData.subscription_date" label="Subscription Date" type="date"
                :rules="[globalRequire, futureOrTodayDate].flat()" :min="todayDate" />
            </VCol>

            <!-- Social Links -->
            <VCol cols="12" sm="6" md="4">
              <AppTextField v-model="insertData.instagram_link" label="Instagram Link" />
            </VCol>
            <VCol cols="12" sm="6" md="4">
              <AppTextField v-model="insertData.facebook_link" label="Facebook Link" />
            </VCol>
            <VCol cols="12" sm="6" md="4">
              <AppTextField v-model="insertData.youtube_link" label="YouTube Link" />
            </VCol>
            <VCol cols="12" sm="6" md="4">
              <AppTextField v-model="insertData.website_link" label="Website Link" />
            </VCol>
          </VRow>

          <!-- Buttons -->
          <VCardActions class="d-flex justify-end flex-wrap gap-4 mt-6">
            <VBtn color="primary" @click="saveData" size="large" rounded> Register </VBtn>
            <VBtn to="/" color="secondary" size="large" variant="outlined" rounded> Login </VBtn>
          </VCardActions>
        </VCardText>
      </VForm>

      <!-- Loader -->
      <VDialog v-model="loader" persistent width="300">
        <VCard class="pa-3" color="primary">
          <VCardText class="text-center white--text">
            <div class="mb-2">Saving, please wait...</div>
            <VProgressLinear indeterminate color="white" />
          </VCardText>
        </VCard>
      </VDialog>
    </VCard>
  </VContainer>
</template>


<script>
import GlobalBreadCrumbsVue from "@/components/common/GlobalBreadCrumbs.vue";
// import Vue from "vue";
// import DatetimePicker from "vuetify-datetime-picker";
import http from "../http-common";
// Vue.use(DatetimePicker);
export default {
  components: {
    GlobalBreadCrumbsVue,
    // DatetimePicker,
  },
  data() {
    const today = new Date()
    const formattedToday = today.toISOString().split('T')[0] // yyyy-mm-dd
    return {
      todayDate: formattedToday,
      futureOrTodayDate: [
        value => {
          if (!value) return true
          return value >= formattedToday || 'Date cannot be in the past.'
        },
      ],
      globalRequire: [
        (value) => {
          if (value) return true;
          return "Required.";
        },
      ],
      passwordMin: [
        (value) => {
          if (value?.length > 6) return true;
          return "Must be at least 6 characters.";
        },
      ],
      nameMin: [
        (value) => {
          if (value?.length <= 50) return true;
          return "Must be at least 50 characters.";
        },
      ],
      nameMax: [
        (value) => {
          if (value?.length >= 3) return true;
          return "Must be at least 3 characters.";
        },
      ],
      email: [
        (v) =>
          !v ||
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          "Email must be valid",
      ],
      numberMin: [
        (value) => {
          if (value?.length >= 10) return true;
          return "Must be at least 10 characters.";
        },
      ],
      numberMax: [
        (value) => {
          if (value?.length <= 10) return true;
          return "Must be at least 10 characters.";
        },
      ],
      image: "",
      insertData: {
        name: "",
        phone_number: "",
        studio_name: "",
        address: "",
        email: "",
        password: "",
        c_password: "",
        subscription_date: "",
        instagram_link: "",
        facebook_link: "",
        youtube_link: "",
        website_link: "",
      },
      loader: false,
      errors: {},
      isAlertVisible: false,
    };
  },
  methods: {
    async saveData() {
      const checkValidation = await this.$refs.formSubmit.validate();
      if (checkValidation.valid) {
        const formData = new FormData();
        if (this.image) {
          const imageData = this.$refs.file.files[0];
          formData.append("image", imageData);
        } else {
          formData.append("image", "");
        }
        for (let x in this.insertData) {
          formData.append(x, this.insertData[x]);
        }
        this.loader = true;
        http
          .post("/register-store", formData)
          .then((res) => {
            if (res.data.success) {
              this.$router.push({
                path: "/barcode",
              });
              this.$toast.success(res.data.message);
              this.isAlertVisible = false;
            } else {
              this.$toast.error(res.data.message);
              this.errors = res.data.data;
              this.isAlertVisible = true;
            }
            this.loader = false;
          })
          .catch((e) => {
            this.loader = false;
            console.log(e);
          });
      }
    },
  },
};
</script>

<route lang="yaml">
meta:
  layout: blank
</route>
