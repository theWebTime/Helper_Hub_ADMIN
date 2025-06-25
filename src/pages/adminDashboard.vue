<template>
  <div>
    <GlobalBreadCrumbsVue />

    <VCard title="Super Admin Dashboard">
      <VCardText>
        <VRow>
          <VCol cols="12" md="4">
            <VCard elevation="2" class="pa-4 text-center" color="green lighten-5">
              <h3 class="text-h6 font-weight-medium">Total Registered Admins</h3>
              <div class="text-h4 font-weight-bold mt-2 text-success">
                {{ totalAdmins }}
              </div>
            </VCard>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>

    <!-- Loader -->
    <VDialog v-model="loader" width="300">
      <VCard color="primary">
        <VCardText class="pt-3">
          Loading data...
          <VProgressLinear indeterminate class="mb-0" />
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>

<script>
import GlobalBreadCrumbsVue from "@/components/common/GlobalBreadCrumbs.vue";
import http from "../http-common";

export default {
  components: { GlobalBreadCrumbsVue },
  data() {
    return {
      totalAdmins: 0,
      loader: false,
    };
  },
  created() {
    this.fetchTotalAdmins();
  },
  methods: {
    async fetchTotalAdmins() {
      this.loader = true;
      try {
        const res = await http.get("/total-registered-admins");
        if (res.data.success) {
          this.totalAdmins = res.data.data;
        } else {
          this.$toast.error("Failed to fetch admin count.");
        }
      } catch (error) {
        console.error(error);
        this.$toast.error("Something went wrong.");
      } finally {
        this.loader = false;
      }
    },
  },
};
</script>
