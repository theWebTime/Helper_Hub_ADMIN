<template>
  <div>
    <GlobalBreadCrumbsVue></GlobalBreadCrumbsVue>
    <VCard>
      <VCardText class="d-flex flex-wrap py-4 gap-4">
        <div class="me-3 d-flex gap-3">
          <AppSelect
            v-model="options.itemsPerPage"
            :items="[
              { value: 10, title: '10' },
              { value: 25, title: '25' },
              { value: 50, title: '50' },
              { value: 100, title: '100' },
              { value: -1, title: 'All' },
            ]"
            disabled
            style="width: 6.25rem"
          />
        </div>
        <VSpacer />
      </VCardText>
      <VDivider />
      <v-skeleton-loader type="table" :loading="loader">
        <v-data-table class="text-no-wrap" fixed-header>
          <thead>
            <tr>
              <th class="text-uppercase">ID.</th>
              <th class="text-uppercase text-center" v-if="userData.role == 1">
                Domain
              </th>
              <th class="text-uppercase text-center">Name</th>
              <th class="text-uppercase text-center">Email</th>
              <th class="text-uppercase text-center">Phone Number</th>
              <th class="text-uppercase text-center">Message</th>
              <th class="text-uppercase text-center">Country Name</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(item, index) in data.data" :key="index">
              <td>
                {{ (data.current_page - 1) * data.per_page + index + 1 }}
              </td>
              <td class="text-center" v-if="userData.role == 1">
                {{ item.domain }}
              </td>
              <td class="text-center">
                {{ item.name }}
              </td>
              <td class="text-center">
                {{ item.email }}
              </td>
              <td class="text-center">
                {{ item.phone_number }}
              </td>
              <td class="text-center">
                {{ item.message }}
              </td>
              <td class="text-center">
                {{ item.country_name }}
              </td>
            </tr>
          </tbody>
          <template #bottom></template>
        </v-data-table>
      </v-skeleton-loader>
      <div
        class="d-flex align-center justify-sm-space-between justify-center flex-wrap gap-3 pa-5 pt-3"
      >
        <p class="text-sm text-disabled mb-0">
          {{ paginationMeta(options, data.total) }}
        </p>
        <VPagination
          v-model="options.page"
          :length="Math.ceil(this.data.total / options.itemsPerPage)"
          :total-visible="
            $vuetify.display.xs
              ? 1
              : Math.ceil(this.data.total / options.itemsPerPage)
          "
          @click="changePage()"
        >
        </VPagination>
      </div>
    </VCard>
  </div>
</template>
<script>
import GlobalBreadCrumbsVue from "@/components/common/GlobalBreadCrumbs.vue";
import ls from "localstorage-slim";
import { VDataTable } from "vuetify/labs/VDataTable";
import { VSkeletonLoader } from "vuetify/labs/VSkeletonLoader";
import http from "../http-common";
export default {
  components: {
    GlobalBreadCrumbsVue,
    VSkeletonLoader,
    VDataTable,
  },
  data() {
    return {
      userData: ls.get("user-info", { decrypt: true }),
      globalRequire: [
        (value) => {
          if (value) return true;
          return "Required.";
        },
      ],
      data: {},
      loader: false,
      isDeleteDialogVisible: false,
      options: {
        page: 1,
        itemsPerPage: 50,
        search: "",
      },
      rules: {
        required: (value) => !!value || "Required.",
      },
      editableId: null,
      errors: {},
      isAlertVisible: false,
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    changePage() {
      this.options.page = this.options.page;
      this.fetchData();
    },
    async fetchData() {
      this.loader = true;
      await http
        .get("/contact-us/index/")
        .then((res) => {
          if (res.data.success) {
            const resData = res.data.data;
            this.data = resData;
          }
        })
        .catch((e) => {
          console.log(e);
        });
      this.loader = false;
    },
    paginationMeta(options, total) {
      const start = (options.page - 1) * options.itemsPerPage + 1;
      const end = Math.min(options.page * options.itemsPerPage, total);

      return `Showing ${start} to ${end} of ${total} entries`;
    },
  },
};
</script>
