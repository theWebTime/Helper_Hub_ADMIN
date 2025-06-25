<template>
  <div>
    <GlobalBreadCrumbsVue />

    <!-- SUPER ADMIN DASHBOARD -->
    <VCard v-if="userRole === 1" class="mb-6" elevation="2">
      <VCardText>
        <h2 class="text-h5 font-weight-bold mb-4">👑 Super Admin Dashboard</h2>

        <VRow dense>
          <!-- Total Admin Users Card -->
          <VCol cols="12" md="4">
            <VCard class="pa-4 text-center" elevation="3" color="deep-purple lighten-5">
              <VIcon size="36" color="deep-purple">mdi-account-multiple</VIcon>
              <h3 class="text-h6 font-weight-medium mt-2">Total Users</h3>
              <div class="text-h4 font-weight-bold mt-1 text-deep-purple">
                {{ totalAdmins }}
              </div>
            </VCard>
          </VCol>
          <VCol cols="12" md="4">
            <VCard class="pa-4 text-center" elevation="3" color="deep-purple lighten-5">
              <VIcon size="36" color="deep-purple">mdi-account-multiple</VIcon>
              <h3 class="text-h6 font-weight-medium mt-2">Total Activate Users</h3>
              <div class="text-h4 font-weight-bold mt-1 text-deep-purple">
                {{ activateAdmins }}
              </div>
            </VCard>
          </VCol>
          <VCol cols="12" md="4">
            <VCard class="pa-4 text-center" elevation="3" color="deep-purple lighten-5">
              <VIcon size="36" color="deep-purple">mdi-account-multiple</VIcon>
              <h3 class="text-h6 font-weight-medium mt-2">Total In Activate Users</h3>
              <div class="text-h4 font-weight-bold mt-1 text-deep-purple">
                {{ inActivateAdmins }}
              </div>
            </VCard>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>

    <!-- ADMIN: Function-wise Order Count -->
    <VCard v-if="userRole === 2" title="Function-wise Order Count">
      <VCardText>
        <VRow>
          <VCol cols="12" md="4" v-for="(item, index) in orderStats" :key="index">
            <VCard elevation="2" class="pa-4 text-center" color="indigo lighten-5">
              <h3 class="text-h6 font-weight-medium">{{ item.name }}</h3>
              <div class="text-h5 font-weight-bold mt-2 text-primary">
                Total: {{ item.total }}
              </div>
              <div class="text-body-1 font-weight-medium mt-1 text-success">
                Booked: {{ item.booked }}
              </div>
              <VProgressLinear :model-value="getPercentage(item.booked, item.total)" height="8" color="primary"
                class="mt-3" />
              <div class="text-caption mt-1 grey--text">
                {{ getPercentage(item.booked, item.total) }}% booked
              </div>
            </VCard>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>

    <!-- Loader Dialog -->
    <VDialog v-model="loader" width="300">
      <VCard color="primary">
        <VCardText class="pt-3">
          Fetching data...
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
      userRole: null,
      totalAdmins: 0,
      activateAdmins: 0,
      inActivateAdmins: 0,
      orderStats: [],
      loader: false,
    };
  },
  created() {
    this.fetchDashboardData();
  },
  methods: {
    async fetchDashboardData() {
      this.loader = true;
      try {
        const res = await http.get("/dashboard-data");

        if (res.data.success) {
          this.userRole = res.data.role;

          if (this.userRole === 1) {
            this.totalAdmins = res.data.data.total_admins;
            this.activateAdmins = res.data.data.activate_admins;
            this.inActivateAdmins = res.data.data.in_activate_admins;
          } else if (this.userRole === 2) {
            this.orderStats = res.data.data;
          }
        } else {
          this.$toast.error("Failed to load dashboard data.");
        }
      } catch (error) {
        console.error(error);
        this.$toast.error("Something went wrong.");
      } finally {
        this.loader = false;
      }
    },
    getPercentage(booked, total) {
      if (!total) return 0;
      return Math.round((booked / total) * 100);
    },
  },
};
</script>
