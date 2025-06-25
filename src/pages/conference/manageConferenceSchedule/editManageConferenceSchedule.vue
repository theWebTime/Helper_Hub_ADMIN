<template>
    <div>
      <GlobalBreadCrumbsVue></GlobalBreadCrumbsVue>
    
      <VCard title="Update Data of this Conference Schedule">
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
                <AppTextField
                  :rules="[globalRequire].flat()"
                  v-model="insertData.title"
                  label="Title"
                />
              </VCol>
              <VCol cols="12" md="4">
                <AppDateTimePicker
                  v-model="insertData.date"
                  :rules="[globalRequire].flat()"
                  label="Date"
                />
              </VCol>
            </VRow>
            <v-container>
              <v-row
                v-for="(item, index) in insertData.data"
                :key="index"
                class="mb-2"
              >
                <v-col cols="12" md="3">
                  <v-text-field
                    v-model="item.title"
                    label="Title"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="3">
                  <v-text-field
                    v-model="item.description"
                    label="Description"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="2" class="d-flex align-center justify-end">
                  <!-- Conditionally show delete button only if more than one row -->
                  <v-btn v-if="insertData.data.length > 1" icon @click="removeRow(index)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" class="d-flex justify-center">
                  <v-btn @click="addRow">Add Row</v-btn>
                </v-col>
              </v-row>
            </v-container>
          </VCardText>
          <VCardText class="d-flex justify-end flex-wrap gap-3">
            <VBtn @click="updateData">Save</VBtn>
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
        insertData: {
          title: "",
          date: "",
          data: [
            { title: '', description: '' },
          ],
          conference_id: this.$route.params.id,
        },
        loader: false,
        errors: {},
        isAlertVisible: false,
      };
    },
    created() {
      this.fetchData();
    },
    methods: {
      addRow() {
        this.insertData.data.push({ title: '', description: '' });
      },
      removeRow(index) {
        if (this.insertData.data.length > 1) {
          this.insertData.data.splice(index, 1);
        } else {
          this.$toast.warning('At least one row must be present.');
        }
      },
      async fetchData() {
        this.loader = true;
        try {
          const res = await http.post("/conference-schedule/show", {
            id: this.insertData.conference_id,
          });
          if (res.data.success) {
            const resData = res.data.data;
            this.insertData.title = resData.title;
            this.insertData.date = resData.date;
            this.insertData.data = resData.data;
          }
        } catch (e) {
          console.log(e);
        }
        this.loader = false;
      },
      async updateData() {
        const checkValidation = await this.$refs.formSubmit.validate();
        if (checkValidation && this.validateRows()) {
          this.loader = true;
          try {
            const res = await http.post("conference-schedule/update", this.insertData);
            if (res.data.success) {
              this.$toast.success(res.data.message);
              this.$router.push({ path: "/conferenceTag/list/" });
              this.isAlertVisible = false;
            } else {
              this.$toast.error(res.data.message);
              this.errors = res.data.data;
              this.isAlertVisible = true;
            }
          } catch (e) {
            this.$toast.error('An error occurred while updating the data.');
            console.log(e);
          }
          this.loader = false;
        }
      },
      validateRows() {
        for (const item of this.insertData.data) {
          if (item.title.trim() || item.description.trim()) {
            return true;
          }
        }
        this.errors = { data: ['At least one row must be filled out.'] };
        this.isAlertVisible = true;
        return false;
      },
    },
  };
  </script>
  