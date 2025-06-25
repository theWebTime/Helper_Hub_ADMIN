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
          <h3>Update About Us</h3>
          <br />
          <VRow>
            <VCol cols="12" md="6">
              <AppTextField
                v-model="insertData.title"
                :rules="[globalRequire].flat()"
                label="Title"
              />
            </VCol>
            <VCol cols="12" md="6" class="editor-layout">
              <label>Description</label>
              <QuillEditor
                theme="snow"
                v-model:content="insertData.description"
                contentType="html"
                label="Description"
                :options="options"
              />
            </VCol>
            <VCol cols="12" md="6" class="editor-layout">
              <label>Our Mission</label>
              <QuillEditor
                theme="snow"
                v-model:content="insertData.our_mission"
                contentType="html"
                label="Our Mission"
                :options="options"
              />
            </VCol>
            <VCol cols="12" md="6" class="editor-layout">
              <label>Our Vision</label>
              <QuillEditor
                theme="snow"
                v-model:content="insertData.our_vision"
                contentType="html"
                label="Our Vision"
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
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import http from "../http-common";
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
      insertData: {
        title: "",
        description: "",
        our_mission: "",
        our_vision: "",
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
        .get("/user-side/about-us-show")
        .then((res) => {
          if (res.data.success) {
            this.insertData.title = res.data.data.title;
            this.insertData.description = res.data.data.description;
            this.insertData.our_mission = res.data.data.our_mission;
            this.insertData.our_vision = res.data.data.our_vision;
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
        this.loader = true;
        http
          .post("about-us/store", this.insertData)
          .then((res) => {
            if (res.data.success) {
              this.fetchData();
              this.$toast.success(res.data.message);
              this.isAlertVisible = false;
            } else {
              this.$toast.error(res.data.message);
              this.errors = res.data.data;
              console.log(this.errors);
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
