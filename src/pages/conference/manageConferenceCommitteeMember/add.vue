<template>
  <div>
    <GlobalBreadCrumbsVue></GlobalBreadCrumbsVue>
    <VCard title="Add Conference Committee Member">
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
                v-model="image"
                ref="file"
                :rules="[globalRequire].flat()"
              ></v-file-input>
            </VCol>
            <VCol cols="12" md="6">
              <AppTextField
                :rules="[globalRequire, nameMin, nameMax].flat()"
                v-model="insertData.name"
                label="Name"
              />
            </VCol>
            <VCol cols="12" md="6">
              <AppTextField
                :rules="[globalRequire, nameMin, nameMax].flat()"
                v-model="insertData.designation"
                label="Designation"
              />
            </VCol>
            <VCol cols="12" md="6">
              <AppTextField
                v-model="insertData.facebook_link"
                label="Facebook Link"
              />
            </VCol>
            <VCol cols="12" md="6">
              <AppTextField v-model="insertData.x_link" label="Twitter Link" />
            </VCol>
            <VCol cols="12" md="6">
              <AppTextField
                v-model="insertData.linkedin_link"
                label="LinkedIn Link"
              />
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
          if (value?.length <= 20) return true;
          return "Must be at least 20 characters.";
        },
      ],
      nameMax: [
        (value) => {
          if (value?.length >= 3) return true;
          return "Must be at least 3 characters.";
        },
      ],
      image: "",
      insertData: {
        name: "",
        designation: "",
        facebook_link: "",
        x_link: "",
        linkedin_link: "",
      },
      conference_id: this.$route.params.id,
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
        formData.append("conference_id", this.conference_id);
        formData.append("name", this.insertData.name);
        formData.append("designation", this.insertData.designation);
        formData.append("facebook_link", this.insertData.facebook_link);
        formData.append("x_link", this.insertData.x_link);
        formData.append("linkedin_link", this.insertData.linkedin_link);
        this.loader = true;
        http
          .post("conference-committee-member/store", formData)
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
      }
    },
  },
};
</script>
