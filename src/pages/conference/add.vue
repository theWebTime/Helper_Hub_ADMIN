<template>
  <div>
    <GlobalBreadCrumbsVue></GlobalBreadCrumbsVue>
    <VCard title="Add Conference">
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
              <label>Logo Image</label>
              <v-file-input
                accept="image/*"
                v-model="logo"
                :rules="[globalRequire].flat()"
                ref="file"
              ></v-file-input>
            </VCol>
            <VCol cols="12" md="6">
              <AppTextField
                :rules="[globalRequire, nameMin, nameMax].flat()"
                v-model="insertData.title"
                label="Title"
              />
            </VCol>
            <VCol cols="12" md="6">
              <AppTextField
                v-model="insertData.domain"
                :rules="[globalRequire, nameMin, nameMax].flat()"
                label="Domain"
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
            <VCol cols="12" md="6">
              <AppTextField
                v-model="insertData.primary_color"
                :rules="[globalRequire].flat()"
                label="Primary Color"
              />
            </VCol>
            <VCol cols="12" md="6">
              <AppTextField
                v-model="insertData.secondary_color"
                :rules="[globalRequire].flat()"
                label="Secondary Color"
              />
            </VCol>
            <VCol cols="12" md="6">
              <v-textarea
                v-model="insertData.address"
                :rules="[globalRequire].flat()"
                label="Street Address"
              />
            </VCol>
            <VCol cols="12" md="6">
              <v-textarea
                v-model="insertData.iframe"
                :rules="[globalRequire].flat()"
                label="Iframe"
              />
            </VCol>
            <VCol cols="12" md="4">
              <AppTextField
                v-model="insertData.contact_number1"
                :rules="[globalRequire, numberMin, numberMax].flat()"
                type="number"
                label="Phone Number"
              />
            </VCol>
            <VCol cols="12" md="4">
              <AppTextField
                v-model="insertData.contact_number2"
                type="number"
                :rules="[globalRequire, numberMin, numberMax].flat()"
                label="Second Phone Number"
              />
            </VCol>
            <VCol cols="12" md="4">
              <AppTextField
                v-model="insertData.wp_number"
                type="number"
                :rules="[globalRequire, numberMin, numberMax].flat()"
                label="Whatsapp Number"
              />
            </VCol>
            <VCol cols="12" md="4">
              <AppTextField
                v-model="insertData.email"
                :rules="[email, globalRequire].flat()"
                label="Email"
              />
            </VCol>
            <VCol cols="12" md="4">
              <AppTextField
                type="password"
                :rules="[passwordMin].flat()"
                v-model="insertData.password"
                label="Password"
              />
            </VCol>
            <VCol cols="12" md="4">
              <label>Abstract File Sample</label>
              <v-file-input
                accept="file/*"
                v-model="abstract_file_sample"
                :rules="[globalRequire].flat()"
                ref="file1"
              ></v-file-input>
            </VCol>
            <VCol cols="12" md="4">
              <label>Conference Brochure</label>
              <v-file-input
                accept="file/*"
                v-model="brochure"
                :rules="[globalRequire].flat()"
                ref="file2"
              ></v-file-input>
            </VCol>
            <VCol cols="12" md="4">
              <AppSelect
                v-model="insertData.conference_tags_id"
                :items="data_fetch_conference_tag"
                :rules="[globalRequire].flat()"
                item-title="title"
                item-value="id"
                label="Conference Tag"
              />
            </VCol>
            <VCol cols="12" md="4">
              <AppSelect
                v-model="insertData.conference_types_id"
                :items="data_fetch_conference_type"
                :rules="[globalRequire].flat()"
                item-title="title"
                item-value="id"
                label="Conference Type"
              />
            </VCol>
            <VCol cols="12" md="4">
              <AppSelect
                v-model="fetchingState"
                :items="data_fetch_countries"
                :rules="[globalRequire].flat()"
                item-title="name"
                item-value="id"
                label="Country"
              />
            </VCol>
            <VCol cols="12" md="4">
              <AppSelect
                v-model="fetchingCity"
                :items="data_fetch_states"
                :rules="[globalRequire].flat()"
                item-title="name"
                item-value="id"
                label="State"
              />
            </VCol>
            <VCol cols="12" md="4">
              <AppSelect
                v-model="insertData.city_id"
                :items="data_fetch_cities"
                :rules="[globalRequire].flat()"
                item-title="name"
                item-value="id"
                label="City"
              />
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
    return {
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
      abstract_file_sample: "",
      brochure: "",
      logo: "",
      insertData: {
        user_id: "",
        primary_color: "",
        secondary_color: "",
        domain: "",
        title: "",
        date: "",
        address: "",
        iframe: "",
        contact_number1: "",
        contact_number2: "",
        wp_number: "",
        email: "",
        password: "",
        conference_tags_id: "",
        conference_types_id: "",
        country_id: "",
        state_id: "",
        city_id: "",
      },
      fetchingState: "",
      fetchingCity: "",
      data_fetch_conference_tag: "",
      data_fetch_conference_type: "",
      data_fetch_countries: "",
      data_fetch_states: "",
      data_fetch_cities: "",
      loader: false,
      errors: {},
      isAlertVisible: false,
    };
  },
  created() {
    this.fetch_conference_tag();
    this.fetch_conference_type();
    this.fetch_countries();
  },
  watch: {
    fetchingState: function (newValue) {
      this.insertData.country_id = newValue;
      this.fetch_states();
    },
    fetchingCity: function (newValue) {
      this.insertData.state_id = newValue;
      this.fetch_cities();
    },
  },
  methods: {
    fetch_conference_tag() {
      http
        .get("/user-side/conference-tag-listing")
        .then((res) => {
          if (res.data.success) {
            this.data_fetch_conference_tag = res.data.data;
          }
        })
        .catch((e) => {
          this.$toast.error("Something went wrong");
        });
    },
    fetch_conference_type() {
      http
        .get("/user-side/conference-type-listing")
        .then((res) => {
          if (res.data.success) {
            this.data_fetch_conference_type = res.data.data;
          }
        })
        .catch((e) => {
          this.$toast.error("Something went wrong");
        });
    },
    fetch_countries() {
      http
        .get("/user-side/country-listing")
        .then((res) => {
          if (res.data.success) {
            this.data_fetch_countries = res.data.data;
          }
        })
        .catch((e) => {
          this.$toast.error("Something went wrong");
        });
    },
    fetch_states() {
      http
        .get("/user-side/state-listing/" + this.insertData.country_id)
        .then((res) => {
          if (res.data.success) {
            this.data_fetch_states = res.data.data;
          }
        })
        .catch((e) => {
          this.$toast.error("Something went wrong");
        });
    },
    fetch_cities() {
      http
        .get("/user-side/city-listing/" + this.insertData.state_id)
        .then((res) => {
          if (res.data.success) {
            this.data_fetch_cities = res.data.data;
          }
        })
        .catch((e) => {
          this.$toast.error("Something went wrong");
        });
    },
    async saveData() {
      const checkValidation = await this.$refs.formSubmit.validate();
      if (checkValidation.valid) {
        const formData = new FormData();
        if (this.logo) {
          const imageData = this.$refs.file.files[0];
          formData.append("logo", imageData);
        } else {
          formData.append("logo", "");
        }
        if (this.abstract_file_sample) {
          const imageData1 = this.$refs.file1.files[0];
          formData.append("abstract_file_sample", imageData1);
        } else {
          formData.append("abstract_file_sample", "");
        }
        if (this.brochure) {
          const imageData1 = this.$refs.file2.files[0];
          formData.append("brochure", imageData1);
        } else {
          formData.append("brochure", "");
        }
        for (let x in this.insertData) {
          formData.append(x, this.insertData[x]);
        }
        this.loader = true;
        http
          .post("/conference/store", formData)
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
