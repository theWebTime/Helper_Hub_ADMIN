<template>
  <div>
    <GlobalBreadCrumbsVue></GlobalBreadCrumbsVue>

    <VCard title="Update Privacy Policy Details">
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
            <VCol cols="12" md="6">
              <v-textarea :rules="[globalRequire, nameMin].flat()" v-model="insertData.title"
                label="Title" />
            </VCol>
            <VCol cols="12" md="6">
              <v-textarea :rules="[globalRequire, nameMin].flat()" v-model="insertData.description"
                label="Description" />
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
          if (!value) return "Required.";
          if (value.length < 3) return "Must be at least 3 characters.";
          return true;
        },
      ],
      nameMax: [
        (value) => {
          if (!value) return "Required.";
          if (value.length > 50) return "Must not exceed 50 characters.";
          return true;
        },
      ],
      insertData: {
        title: "",
        description: "",
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
    async fetchData() {
      this.loader = true;
      await http
        .get("/privacy-policy/show/" + this.paramsId)
        .then((res) => {
          if (res.data.success) {
            const resData = res.data.data;
            this.insertData.title = resData.title;
            this.insertData.description = resData.description;
          }
        })
        .catch((e) => {
          console.log(e);
        });
      this.loader = false;
    },
    async updateData() {
        this.loader = true;
        http
          .post("privacy-policy/update/" + this.paramsId, this.insertData)
          .then((res) => {
            if (res.data.success) {
              this.$toast.success(res.data.message);
              this.$router.push({
                path: "/privacyPolicy/list/",
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
    },
  },
};
</script>