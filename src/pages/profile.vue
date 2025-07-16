<template>
  <div>
    <VCard>
      <VAlert v-if="isAlertVisible" v-model="isAlertVisible" closable close-label="Close Alert" color="error"
        class="mb-4">
        <div class="d-flex flex-wrap" style="gap: 8px;">
          <span v-for="(msg, index) in errors" :key="index" class="error-chip">
            • {{ msg }}
          </span>
        </div>
      </VAlert>
      <VForm ref="formSubmit">
        <VCardText>
          <h3>Profile</h3>
          <br />
          <VRow>
            <VCol cols="12" md="6">
              <AppTextField :rules="[globalRequire, nameMin].flat()" v-model="insertData.name" label="Name" />
            </VCol>
            <VCol cols="12" md="6">
              <AppTextField type="number" v-model="insertData.mobile" label="Phone Number" />
            </VCol>
            <VCol cols="12" md="6">
              <AppTextField v-model="insertData.email" label="Email" />
            </VCol>
            <VCol cols="12" md="6">
              <AppTextField type="password" v-model="insertData.password"
                label="Password (make it empty if you don't want to update)" />
            </VCol>
          </VRow>
        </VCardText>
        <VCardText class="d-flex justify-end flex-wrap gap-3">
          <VBtn @click="updateData"> Update </VBtn>
        </VCardText>
      </VForm>
    </VCard>
    <!-- global loader modal -->
    <VDialog v-model="loader" width="300">
      <VCard color="primary" width="300">
        <VCardText class="pt-3">
          loading.........
          <VProgressLinear indeterminate class="mb-0" />
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>
<script>
import { useToast } from "vue-toastification";
import http from "../http-common";
const toast = useToast();
export default {
  data() {
    return {
      baseUrl: import.meta.env.VITE_APP_BASE_URL,
      globalRequire: [
        (value) => {
          if (value) return true;
          return "Required.";
        },
      ],
      nameMin: [
        (value) => {
          if (value?.length >= 3) return true;
          return "Must be at least 3 characters.";
        },
      ],
      passwordMin: [
        (value) => {
          if (value?.length > 6) return true;
          return "Must be at least 6 characters.";
        },
      ],
      image: "",
      fetch_photo: "",
      insertData: {
        name: "",
        email: "",
        mobile: "",
        password: "",
      },
      loader: false,
      paramsId: this.$route.params.id,
      errors: {},
      isAlertVisible: false,
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    resetValues() {
      this.insertData.password = "";
    },
    fetchData() {
      this.loader = true;
      http
        .get("/profile")
        .then((res) => {
          if (res.data.success) {
            const resData = res.data.data;
            this.insertData.name = resData.name;
            this.insertData.email = resData.email;
            this.insertData.mobile = resData.mobile;
          }
          this.loader = false;
        })
        .catch((e) => {
          this.loader = false;
          console.log(e);
        });
    },
    async updateData() {
      const checkValidation = await this.$refs.formSubmit.validate();
      this.loader = true;
      http
        .post("profile/update", this.insertData)
        .then((res) => {
          if (res.data.success) {
            this.resetValues();
            this.fetchData();
            toast.success(res.data.message);
            this.isAlertVisible = false;
          } else {
            toast.error(res.data.message);
            this.errors = res.data.data;
            this.isAlertVisible = true;
          }
          this.loader = false;
        })
        .catch((e) => {
          this.loader = false;
        });
    },
  },
};
</script>
