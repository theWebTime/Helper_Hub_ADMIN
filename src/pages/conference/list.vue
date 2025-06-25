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

        <div class="app-user-search-filter d-flex align-center flex-wrap gap-4">
          <!-- 👉 Search  -->
          <div style="inline-size: 10rem">
            <AppTextField
              v-model="options.search"
              placeholder="Search"
              density="compact"
              @keyup="fetchData()"
            />
          </div>
          <router-link to="/conference/add" v-if="userData.role == 1">
            <VBtn prepend-icon="tabler-plus"> Add Conference </VBtn>
          </router-link>
        </div>
      </VCardText>
      <VDivider />
      <v-skeleton-loader type="table" :loading="loader">
        <v-data-table class="text-no-wrap" fixed-header>
          <thead>
            <tr>
              <th class="text-uppercase">ID.</th>
              <th class="text-uppercase text-center">Domain</th>
              <th class="text-uppercase text-center">Title</th>
              <th class="text-uppercase text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(item, index) in data.data" :key="index">
              <td>
                {{ (data.current_page - 1) * data.per_page + index + 1 }}
              </td>
              <td class="text-center">
                {{ item.domain }}
              </td>
              <td class="text-center">
                {{ item.title }}
              </td>
              <td class="text-center">
                <router-link :to="'/conference/editConference/' + item.id">
                  <IconBtn>
                    <VIcon :icon="'tabler-edit-circle'" />

                    <VTooltip activator="parent" location="start">
                      Edit Conference
                    </VTooltip>
                  </IconBtn>
                </router-link>
                |
                <router-link
                  :to="'/conference/manageConferenceAboutUs/' + item.id"
                >
                  <IconBtn>
                    <VIcon :icon="'tabler-file-description'" />

                    <VTooltip activator="parent" location="start">
                      Manage Conference About Us
                    </VTooltip>
                  </IconBtn>
                </router-link>
                |
                <router-link
                  :to="'/conference/manageConferenceSchedule/list/' + item.id"
                >
                  <IconBtn>
                    <VIcon :icon="'tabler-list-details'" />

                    <VTooltip activator="parent" location="start">
                      Manage Conference Schedule
                    </VTooltip>
                  </IconBtn>
                </router-link>
                |
                <router-link
                  :to="'/conference/manageConferenceGallery/list/' + item.id"
                >
                  <IconBtn>
                    <VIcon :icon="'tabler-brand-google-photos'" />

                    <VTooltip activator="parent" location="start">
                      Manage Conference Gallery
                    </VTooltip>
                  </IconBtn>
                </router-link>
                |
                <router-link
                  :to="
                    '/conference/manageConferenceTestimonial/list/' + item.id
                  "
                >
                  <IconBtn>
                    <VIcon :icon="'tabler-letter-t-small'" />

                    <VTooltip activator="parent" location="start">
                      Manage Conference Testimonial
                    </VTooltip>
                  </IconBtn>
                </router-link>
                |
                <router-link
                  :to="
                    '/conference/manageConferenceMediaPartner/list/' + item.id
                  "
                >
                  <IconBtn>
                    <VIcon :icon="'tabler-camera'" />

                    <VTooltip activator="parent" location="start">
                      Manage Conference Media Partner
                    </VTooltip>
                  </IconBtn>
                </router-link>
                |
                <router-link
                  :to="'/conference/manageConferenceProgram/list/' + item.id"
                >
                  <IconBtn>
                    <VIcon :icon="'tabler-progress'" />

                    <VTooltip activator="parent" location="start">
                      Manage Conference Program
                    </VTooltip>
                  </IconBtn>
                </router-link>
                |
                <router-link
                  :to="'/conference/manageConferenceSpeaker/list/' + item.id"
                >
                  <IconBtn>
                    <VIcon :icon="'tabler-speakerphone'" />

                    <VTooltip activator="parent" location="start">
                      Manage Conference Speaker
                    </VTooltip>
                  </IconBtn>
                </router-link>
                |
                <router-link
                  :to="
                    '/conference/manageConferenceCommitteeMember/list/' +
                    item.id
                  "
                >
                  <IconBtn>
                    <VIcon :icon="'tabler-users-group'" />

                    <VTooltip activator="parent" location="start">
                      Manage Conference Committee Member
                    </VTooltip>
                  </IconBtn>
                </router-link>
                |
                <router-link
                  :to="
                    '/conference/manageConferenceImportantDate/list/' + item.id
                  "
                >
                  <IconBtn>
                    <VIcon :icon="'tabler-calendar'" />

                    <VTooltip activator="parent" location="start">
                      Manage Conference Important Date
                    </VTooltip>
                  </IconBtn>
                </router-link>
                |
                <router-link
                  :to="'/conference/mangeConferenceFaq/list/' + item.id"
                >
                  <IconBtn>
                    <VIcon :icon="'tabler-question-mark'" />

                    <VTooltip activator="parent" location="start">
                      Manage Conference FAQ
                    </VTooltip>
                  </IconBtn>
                </router-link>
                |
                <router-link
                  :to="'/conference/mangeConferenceOtherInformation/' + item.id"
                >
                  <IconBtn>
                    <VIcon :icon="'tabler-info-circle'" />

                    <VTooltip activator="parent" location="start">
                      Manage Conference Other Information
                    </VTooltip>
                  </IconBtn>
                </router-link>
                |
                <router-link
                  :to="'/conference/manageConferencePlan/list/' + item.id"
                >
                  <IconBtn>
                    <VIcon :icon="'tabler-timeline'" />

                    <VTooltip activator="parent" location="start">
                      Manage Conference Plan
                    </VTooltip>
                  </IconBtn>
                </router-link>
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
import ls from "localstorage-slim";
import { VDataTable } from "vuetify/labs/VDataTable";
import { VSkeletonLoader } from "vuetify/labs/VSkeletonLoader";
import http from "../../http-common";
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
        itemsPerPage: 5,
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
    fetchData() {
      this.loader = true;
      http
        .get(
          "/conference/index?page=" +
            this.options.page +
            "&itemsPerPage=" +
            this.options.itemsPerPage +
            "&search=" +
            this.options.search
        )
        .then((res) => {
          if (res.data.success) {
            this.data = res.data.data;
          }
          this.loader = false;
        })
        .catch((e) => {
          this.loader = false;
          console.log(e);
        });
    },

    openDeletePopup(val) {
      this.editableId = val;
      this.isDeleteDialogVisible = true;
    },

    closeDeletePopup() {
      this.editableId = "";
      this.isDeleteDialogVisible = false;
    },

    paginationMeta(options, total) {
      const start = (options.page - 1) * options.itemsPerPage + 1;
      const end = Math.min(options.page * options.itemsPerPage, total);

      return `Showing ${start} to ${end} of ${total} entries`;
    },
  },
};
</script>
