<template>
  <div>
    <GlobalBreadCrumbsVue></GlobalBreadCrumbsVue>
    <VCard title="Add Conference Important Date">
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
            <!-- <VCol cols="12" md="6">
              <VRadioGroup
                v-model="insertData.category"
                inline
                label="Category"
              >
                <VRadio label="Conference Dates" :value="1" density="compact" />
                <VRadio
                  label="Abstract Deadline"
                  :value="2"
                  density="compact"
                />
                <VRadio
                  label="Registration Deadline"
                  :value="3"
                  density="compact"
                />
              </VRadioGroup>
            </VCol> -->
            <VCol cols="12" md="6">
              <AppSelect
                v-model="insertData.category"
                :items="data_of_category"
                label="Category"
                :rules="[globalRequire].flat()"
              />
            </VCol>
            <VCol cols="12" md="6">
              <AppTextField
                :rules="[globalRequire, nameMin, nameMax].flat()"
                v-model="insertData.title"
                label="Title"
              />
            </VCol>
            <VCol cols="12" md="6">
              <AppDateTimePicker
                v-model="insertData.date"
                :rules="[globalRequire].flat()"
                label="Date"
                :config="{ enableTime: true, dateFormat: 'Y-m-d H:i' }"
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
      data_of_category: [
        { value: "1", title: "Conference Dates" },
        { value: "2", title: "Abstract Deadline" },
        { value: "3", title: "Registration Deadline" },
      ],
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
      insertData: {
        category: "",
        title: "",
        date: "",
        conference_id: this.$route.params.id,
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
        this.loader = true;
        http
          .post("/conference-important-date/store", this.insertData)
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
            console.log(e);
          });
      }
    },
  },
};
</script>
