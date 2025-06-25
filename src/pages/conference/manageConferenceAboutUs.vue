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
            <h3>Update Conference About Us</h3>
            <br />
            <VRow>
                <VCol cols="12" md="6">
              <label>About Us Image</label>
              <v-file-input
                accept="image/*"
                v-model="image"
                ref="file"
              ></v-file-input>
            </VCol>
            <VCol cols="12" md="6">
              <VAvatar size="48">
                <VImg :src="fetch_photo" />
              </VAvatar>
            </VCol>
            <VCol cols="12" md="6">
              <AppTextField
                v-model="insertData.title"
                :rules="[globalRequire, nameMin].flat()"
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
            <VCol cols="12" md="6">
              <AppTextField
                v-model="insertData.international_speaker"
                :rules="[globalRequire, nameMin].flat()"
                type="number"
                label="Internation Speaker"
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
        image: "",
      fetch_photo: "",
      insertData: {
        title: "",
        description: "",
        international_speaker: "",
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
          .post("conference-about-us/show", {
            id: this.$route.params.id,
          })
          .then((res) => {
            if (res.data.success) {
              this.insertData.title = res.data.data.title;
              this.insertData.description =
                res.data.data.description;
              this.insertData.international_speaker = res.data.data.international_speaker;
              this.fetch_photo =
              res.data.data.image == null ? "" : res.data.data.image;
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
            .post("conference-about-us/store", formData)
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