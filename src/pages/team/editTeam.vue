<template>
  <div>
    <GlobalBreadCrumbsVue></GlobalBreadCrumbsVue>

    <VCard title="Update Team Member Details">
      <!--  <VAlert v-model="isAlertVisible" closable close-label="Close Alert" color="error">
        <ul v-for="(value, key) in errors" :key="key">
          <li v-for="(value1, key1) in value" :key="key1">-> {{ value1 }}</li>
        </ul>
        {{ value }}
      </VAlert> -->

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
          <VRow>
            <VCol cols="12" md="3">
              <AppTextField :rules="[globalRequire, nameMin, nameMax].flat()" v-model="insertData.name" label="Name" />
            </VCol>
            <VCol cols="12" md="3">
              <AppTextField v-model="insertData.phone_number" :rules="[globalRequire, numberMin, numberMax].flat()"
                type="number" label="Phone Number" />
            </VCol>
            <VCol cols="12" md="3">
              <AppTextField v-model="insertData.email" :rules="[email].flat()" label="Email" />
            </VCol>
            <VCol cols="12" md="3">
              <AppSelect v-model="insertData.category_role_id" :items="data_fetch_categories"
                :rules="[globalRequire].flat()" item-title="category_role" item-value="id" label="Select Category" />
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
import GlobalBreadCrumbsVue from "@/components/common/GlobalBreadCrumbs.vue";
import ls from "localstorage-slim";
import http from "../../http-common";

export default {
  components: {
    GlobalBreadCrumbsVue,
  },
  data() {
    return {
      globalRequire: [
        (value) => {
          if (value) return true;
          return "Required.";
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
      insertData: {
        category_role_id: "",
        name: "",
        phone_number: "",
        email: "",
      },
      data_fetch_categories: "",
      loader: false,
      paramsId: this.$route.params.id,
      errors: {},
      isAlertVisible: false,
      data_fetch_sub_services: "",
      auth: ls.get("user-info", { decrypt: true }),
    };
  },
  created() {
    this.fetchData();
    this.fetch_category();
  },
  methods: {
    fetch_category() {
      http
        .get("/category-index")
        .then((res) => {
          if (res.data.success) {
            this.data_fetch_categories = res.data.data;
          }
        })
        .catch((e) => {
          this.$toast.error("Something went wrong");
        });
    },
    async fetchData() {
      this.loader = true;
      await http
        .get("/staff/show/" + this.paramsId)
        .then((res) => {
          if (res.data.success) {
            const resData = res.data.data;
            this.insertData.name = resData.name;
            this.insertData.phone_number = resData.phone_number;
            this.insertData.email = resData.email;
            this.insertData.category_role_id = resData.category_role_id;
          }
        })
        .catch((e) => {
          console.log(e);
        });
      this.loader = false;
    },
    async updateData() {
      const checkValidation = await this.$refs.formSubmit.validate();
      if (checkValidation.valid) {
        this.loader = true;
        http
          .post("staff/update/" + this.paramsId, this.insertData)
          .then((res) => {
            if (res.data.success) {
              this.$toast.success(res.data.message);
              this.$router.push({
                path: "/team/list/",
              });
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
          });
      }
    },
  },
};
</script>