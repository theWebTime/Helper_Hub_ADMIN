<template>
  <div>
    <GlobalBreadCrumbsVue></GlobalBreadCrumbsVue>
    <VCard title="Add User Details">
      <!-- <VAlert v-model="isAlertVisible" closable close-label="Close Alert" color="error">
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
              <label>Logo Image</label>
              <v-file-input accept="image/*" v-model="image" :rules="[globalRequire].flat()" ref="file"></v-file-input>
            </VCol>
            <VCol cols="12" md="3">
              <AppTextField :rules="[globalRequire, nameMin, nameMax].flat()" v-model="insertData.name" label="Name" />
            </VCol>
            <VCol cols="12" md="3">
              <AppTextField v-model="insertData.phone_number" :rules="[globalRequire, numberMin, numberMax].flat()"
                type="number" label="Phone Number" />
            </VCol>
            <VCol cols="12" md="3">
              <AppTextField :rules="[globalRequire, nameMin, nameMax].flat()" v-model="insertData.studio_name"
                label="Studio Name" />
            </VCol>
            <VCol cols="12" md="3">
              <v-textarea v-model="insertData.address" :rules="[globalRequire].flat()" label="Street Address" />
            </VCol>
            <VCol cols="12" md="3">
              <AppTextField v-model="insertData.email" :rules="[email, globalRequire].flat()" label="Email" />
            </VCol>
            <VCol cols="12" md="3">
              <AppTextField type="password" :rules="[passwordMin].flat()" v-model="insertData.password"
                label="Password" />
            </VCol>
            <VCol cols="12" md="3">
              <AppTextField type="password" :rules="[passwordMin].flat()" v-model="insertData.c_password"
                label="Confirm Password" />
            </VCol>
            <VCol cols="12" sm="6" md="3">
              <AppTextField v-model="insertData.subscription_date" label="Subscription Date" type="date"
                :rules="[globalRequire, futureOrTodayDate].flat()" :min="todayDate" />
            </VCol>

            <VCol cols="12" md="3">
              <AppTextField v-model="insertData.instagram_link" label="Instagram Link" />
            </VCol>
            <VCol cols="12" sm="6" md="3">
              <AppTextField v-model="insertData.facebook_link" label="Facebook Link" />
            </VCol>
            <VCol cols="12" sm="6" md="3">
              <AppTextField v-model="insertData.youtube_link" label="YouTube Link" />
            </VCol>
            <VCol cols="12" sm="6" md="3">
              <AppTextField v-model="insertData.website_link" label="Website Link" />
            </VCol>
          </VRow>
        </VCardText>
        <VCardText class="d-flex justify-end flex-wrap gap-3">
          <VBtn @click="saveData"> Save </VBtn>
        </VCardText>
      </VForm>
    </VCard>
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
// import Vue from "vue";
// import DatetimePicker from "vuetify-datetime-picker";
import http from "../../http-common";
// Vue.use(DatetimePicker);
export default {
  components: {
    GlobalBreadCrumbsVue,
    // DatetimePicker,
  },
  data() {
    const today = new Date()
    const formattedToday = today.toISOString().split('T')[0] // yyyy-mm-dd
    return {
      todayDate: formattedToday,
      futureOrTodayDate: [
        value => {
          if (!value) return true
          return value >= formattedToday || 'Date cannot be in the past.'
        },
      ],
      globalRequire: [
        (value) => {
          if (value) return true;
          return "Required.";
        },
      ],
      passwordMin: [
        (value) => {
          if (value?.length > 6) return true;
          return "Must be at least 6 characters.";
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
      image: "",
      insertData: {
        name: "",
        phone_number: "",
        studio_name: "",
        address: "",
        email: "",
        password: "",
        c_password: "",
        subscription_date: "",
        instagram_link: "",
        facebook_link: "",
        youtube_link: "",
        website_link: "",
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
          .post("/user/store", formData)
          .then((res) => {
            if (res.data.success) {
              this.$router.push({
                path: "/user/list/",
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