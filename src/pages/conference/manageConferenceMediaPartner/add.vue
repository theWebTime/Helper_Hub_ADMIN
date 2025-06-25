<template>
  <div>
    <GlobalBreadCrumbsVue></GlobalBreadCrumbsVue>
    <VCard title="Add Conference Media Partner">
      <VAlert
        v-model="isAlertVisible"
        closable
        close-label="Close Alert"
        color="error"
      >
        <ul v-for="(value, key) in errors" :key="key">
          <li v-for="(value1, key1) in value" :key="key1">-> {{ value1 }}</li>
        </ul>
        {{ value }}
      </VAlert>
      <VForm ref="formSubmit">
        <VCardText>
          <VRow>
            <VCol cols="12" md="6">
              <label>Image</label>
              <v-file-input
                accept="image/*"
                v-model="files"
                ref="file"
                multiple
                :rules="[globalRequire].flat()"
              ></v-file-input>
            </VCol>
          </VRow>
        </VCardText>
        <VCardText class="d-flex justify-end flex-wrap gap-3">
          <VBtn @click="saveData"> Save </VBtn>
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
import http from "../../../http-common";
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
          if (value?.length >= 3) return true;
          return "Must be at least 3 characters.";
        },
      ],
      files: {},
      conference_id: this.$route.params.id,
      loader: false,
      errors: {},
      isAlertVisible: false,
    };
  },
  methods: {
    async saveData() {
      const formData = new FormData();
      for (var i = 0; i < this.$refs.file.files.length; i++) {
        let file = this.$refs.file.files[i];
        formData.append("files[" + i + "]", file);
      }
      formData.append("conference_id", this.conference_id);
      this.loader = true;
      http
        .post("conference-media-partner/store", formData)
        .then((res) => {
          if (res.data.success) {
            this.$router.push({
              path: "/conference/list/",
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
        });
    },
  },
};
</script>
