<template>
  <div>
    <GlobalBreadCrumbsVue></GlobalBreadCrumbsVue>
    <br />
    <VDivider />
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
          <h3>Update Your Story Image</h3>
          <br />
          <VRow>
            <VCol cols="12" md="6">
              <v-file-input accept="image/*" v-model="image" label="Image 1 (A4 Size Image)" ref="file"></v-file-input>
            </VCol>
            <VCol cols="12" md="6">
              <VResponsive :aspect-ratio="1">
                <VImg :src="`${baseUrl}/quotation_hub/images/yourStory/${fetch_photo}`" class="rounded-square" cover />
              </VResponsive>
              <VBtn class="mt-2" color="error" @click="openDeletePopup('image')">Delete Image 1</VBtn>
            </VCol>
            <VCol cols="12" md="6">
              <v-file-input accept="image/*" v-model="image2" label="Image 2 (A4 Size Image)"
                ref="file1"></v-file-input>
            </VCol>
            <VCol cols="12" md="6">
              <VResponsive :aspect-ratio="1">
                <VImg :src="`${baseUrl}/quotation_hub/images/yourStory/${fetch_photo2}`" class="rounded-square" cover />
              </VResponsive>
              <VBtn class="mt-2" color="error" @click="openDeletePopup('image2')">Delete Image 2</VBtn>
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
    <VDialog v-model="isDeleteDialogVisible" width="500">
      <!-- Dialog close btn -->
      <DialogCloseBtn @click="closeDeletePopup()" />
      <!-- Dialog Content -->
      <VCard title="Are you Sure to delete?">
        <VCardText class="d-flex justify-end">
          <VBtn @click="deleteData()"> Yes </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>

<script>
import GlobalBreadCrumbsVue from "@/components/common/GlobalBreadCrumbs.vue";
import http from "../http-common";
export default {
  components: {
    GlobalBreadCrumbsVue,
  },
  data() {
    return {
      deleteColumn: "",
      baseUrl: import.meta.env.VITE_APP_BASE_URL,
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
      image: "",
      image2: "",
      fetch_photo: "",
      fetch_photo2: "",
      loader: false,
      paramsId: this.$route.params.id,
      errors: {},
      isAlertVisible: false,
      isDeleteDialogVisible: false,
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.loader = true;
      http
        .get("/your-story/show")
        .then((res) => {
          if (res.data.success) {
            this.fetch_photo = res.data.data.image;
            this.fetch_photo2 = res.data.data.image2;
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
        if (this.image2) {
          const imageData = this.$refs.file1.files[0];
          formData.append("image2", imageData);
        } else {
          formData.append("image2", "");
        }
        this.loader = true;
        http
          .post("your-story/update", formData)
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
    openDeletePopup(column) {
      this.deleteColumn = column;
      this.isDeleteDialogVisible = true;
    },
    closeDeletePopup() {
      this.deleteColumn = "";
      this.isDeleteDialogVisible = false;
    },
    deleteData() {
      http
        .post("/your-story/delete", { column: this.deleteColumn })
        .then((res) => {
          if (res.data.success) {
            this.fetchData();
            this.$toast.success(res.data.message);
          } else {
            this.$toast.error(res.data.message);
          }
          this.closeDeletePopup();
        })
        .catch((e) => {
          console.error(e);
          this.closeDeletePopup();
        });
    },
  },
};
</script>