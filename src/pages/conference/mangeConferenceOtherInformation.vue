<template>
  <div>
    <GlobalBreadCrumbsVue></GlobalBreadCrumbsVue>
    <br />
    <VDivider />
    <VCard>
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
          <h3>Update Conference Other Information</h3>
          <br />
          <VRow>
            <VCol cols="12" md="6">
              <v-file-input
                accept="file/*"
                v-model="brochures"
                label="Brochure"
                ref="file"
              ></v-file-input>
            </VCol>
            <VCol cols="12" md="6"> {{ this.fetch_file }} </VCol>
            <VCol cols="12" md="6" class="editor-layout">
              <label>Venue Description</label>
              <QuillEditor
                theme="snow"
                v-model:content="insertData.venue_description"
                contentType="html"
                :options="options"
              />
            </VCol>
            <VCol cols="12" md="6" class="editor-layout">
              <label>Guideline Description</label>
              <QuillEditor
                theme="snow"
                v-model:content="insertData.guidelines_description"
                contentType="html"
                :options="options"
              />
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
import { QuillEditor } from "@vueup/vue-quill";
import http from "../../http-common";
export default {
  components: {
    QuillEditor,
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
      options: {
        placeholder: "Enter text",
      },
      brochures: "",
      fetch_file: "",
      insertData: {
        venue_description: "",
        guidelines_description: "",
        conference_id: this.$route.params.id,
        conf_id: this.$route.params.id,
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
    fetchData() {
      this.loader = true;
      http
        .post("conference-other-information/show", {
          id: this.$route.params.id,
        })
        .then((res) => {
          if (res.data.success) {
            this.insertData.venue_description = res.data.data.venue_description;
            this.insertData.guidelines_description =
              res.data.data.guidelines_description;
            this.fetch_file =
              res.data.data.brochures == null ? "" : res.data.data.brochures;
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
      if (checkValidation.valid) {
        const formData = new FormData();
        if (this.brochures) {
          const imageData = this.$refs.file.files[0];
          formData.append("brochures", imageData);
        } else {
          formData.append("brochures", "");
        }
        for (let x in this.insertData) {
          formData.append(x, this.insertData[x]);
        }
        this.loader = true;
        http
          .post("conference-other-information/store", formData)
          .then((res) => {
            if (res.data.success) {
              this.fetchData();
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
      }
    },
  },
};
</script>
<style scoped>
.editor-layout {
  width: 100%;
  height: 100%;
}
</style>