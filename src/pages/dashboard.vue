<template>
  <div>
    <GlobalBreadCrumbsVue />

    <!-- Summary Cards -->
    <VRow class="mb-6" dense>
      <VCol v-for="(item, index) in summaryCards" :key="index" cols="12" sm="6" md="3">
        <VCard class="pa-5 d-flex flex-column align-center dashboard-card" :style="{ background: item.bgGradient }"
          elevation="6">
          <div class="icon-circle mb-4" :style="{ backgroundColor: item.iconBg }">
            <VIcon :icon="item.icon" size="28" color="white" />
          </div>
          <div class="text-white text-subtitle-1 font-weight-medium mb-1">
            {{ item.label }}
          </div>
          <div class="text-white text-h5 font-weight-bold">
            {{ item.value }}
          </div>
        </VCard>
      </VCol>
    </VRow>

    <VCard>
      <VCardText class="py-4">
        <VContainer fluid class="pa-0">
          <VRow class="d-flex align-center" dense>
            <!-- Items Per Page -->
            <VCol cols="6" sm="3" md="2">
              <AppSelect v-model="options.itemsPerPage" :items="[
                { value: 10, title: '10' },
                { value: 25, title: '25' },
                { value: 50, title: '50' },
                { value: 100, title: '100' },
                { value: -1, title: 'All' },
              ]" label="Per Page" density="compact" />
            </VCol>

            <!-- Payment Status -->
            <VCol cols="6" sm="3" md="2">
              <AppSelect v-model="options.paymentStatus" :items="[
                { value: '', title: 'All' },
                { value: 1, title: 'Pending' }
              ]" label="Payment Status" @update:model-value="fetchData" density="compact" />
            </VCol>

            <!-- Booking Status -->
            <VCol cols="6" sm="3" md="2">
              <AppSelect v-model="options.bookingStatus" :items="[
                { value: '', title: 'All' },
                { value: 2, title: 'Accepted' }
              ]" label="Booking Status" @update:model-value="fetchData" density="compact" />
            </VCol>

            <!-- Search Field -->
            <VCol cols="12" sm="6" md="4" class="mt-sm-0 mt-3">
              <AppTextField v-model="options.search" label="Search by Booking No/User Name" @input="fetchData" clearable
                density="compact" hide-details placeholder="Ex: #HH20251234 or User1" />
            </VCol>
          </VRow>
        </VContainer>
      </VCardText>

      <VDivider />

      <v-skeleton-loader type="table" :loading="loader">
        <v-data-table class="text-no-wrap" fixed-header>
          <thead>
            <tr>
              <th class="text-uppercase">#</th>
              <th class="text-uppercase text-center">Booking No.</th>
              <th class="text-uppercase text-center">Booking Status</th>
              <th class="text-uppercase text-center">Payment Status</th>
              <th class="text-uppercase text-center">User Name</th>
              <th class="text-uppercase text-center">User Landmark</th>
              <th class="text-uppercase text-center">Service</th>
              <th class="text-uppercase text-center">Sub-Service</th>
              <th class="text-uppercase text-center">Type Details</th>
              <th class="text-uppercase text-center">Total Amount</th>
              <th class="text-uppercase text-center">Schedule Date</th>
              <th class="text-uppercase text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in bookings.data" :key="item.id">
              <td>
                {{ (bookings.current_page - 1) * bookings.per_page + index + 1 }}
              </td>
              <td class="text-center">
                <div class="pa-1 px-2 rounded"
                  style="background: linear-gradient(45deg, #5C6BC0, #8E99F3); color: white; font-weight: bold; display: inline-block;">
                  {{ item.booking_number }}
                </div>
              </td>
              <td class="text-center">
                <VChip :color="getBookingStatusColor(item.booking_status)" size="small" class="text-capitalize"
                  variant="tonal">
                  {{ getStatusLabel(item.booking_status) }}
                </VChip>
              </td>

              <!-- Payment Status Column -->
              <td class="text-center">
                <VChip :color="item.payment_status == 2 ? 'success' : 'error'" size="small" class="text-capitalize"
                  variant="tonal">
                  {{ item.payment_status == 2 ? 'Paid' : 'Pending' }}
                </VChip>
              </td>
              <td class="text-center" style="font-weight: bold;">{{ item.user_name }}</td>
              <td class="text-center">
                <VChip class="landmark-chip" size="small" variant="elevated">
                  <VIcon start icon="mdi-map-marker" />
                  {{ item.user_landmark }}
                </VChip>
              </td>
              <td class="text-center" style="font-weight: bold;">{{ item.service_name }}</td>
              <td class="text-center" style="font-weight: bold;">{{ item.sub_service_name }}</td>
              <td class="text-center">
                <VChip v-for="(type, index) in item.selected_type_details.split(', ')" :key="index" class="ma-1"
                  color="primary" variant="outlined" size="small">
                  {{ type }}
                </VChip>
              </td>
              <td class="text-center" style="font-weight: bold;">₹{{ item.total_amount }}</td>
              <td class="text-center" style="font-weight: bold;">
                {{ formatCustomDate(item.schedule_date) }}
                <template v-if="item.service_id == 2">
                  to {{ formatCustomDate(item.schedule_end_date) }}
                </template>
                at {{ item.schedule_time }}
              </td>
              <td class="text-center">
                <IconBtn @click="openEditDialog(item)"
                  class="text-primary hover:bg-primary/10 rounded-full transition-all duration-300"
                  style="cursor: pointer;">
                  <VIcon icon="tabler-edit-circle" size="24" />
                  <VTooltip activator="parent" location="start">Edit Booking</VTooltip>
                </IconBtn>
              </td>
            </tr>
          </tbody>
          <template #bottom></template>
        </v-data-table>
      </v-skeleton-loader>

      <div class="d-flex align-center justify-sm-space-between justify-center flex-wrap gap-3 pa-5 pt-3">
        <p class="text-sm text-disabled mb-0">
          {{ paginationMeta(options, bookings.total) }}
        </p>
        <VPagination v-model="options.page" :length="Math.ceil(bookings.total / options.itemsPerPage)" :total-visible="$vuetify.display.xs
          ? 1
          : Math.ceil(bookings.total / options.itemsPerPage)
          " @click="changePage()" />
      </div>
    </VCard>

    <!-- Edit Dialog -->
    <VDialog v-model="editDialog" width="500">
      <DialogCloseBtn @click="editDialog = false" />
      <VCard title="Edit Booking Status">
        <VCardText>
          <div><strong>Booking No:</strong> &nbsp;{{ selectedBooking.booking_number }}</div>
          <div><strong>Status:</strong> &nbsp;
            &nbsp; <span :class="selectedBooking.booking_status == 2 ? 'text-warning' : 'text-success'">
              {{ getStatusLabel(selectedBooking.booking_status) }}
            </span>
          </div>
          <div><strong>User Name:</strong> &nbsp;{{ selectedBooking.user_name }}</div>
          <div><strong>User Address:</strong> &nbsp;{{ selectedBooking.user_address }}</div>
          <div><strong>Service:</strong> &nbsp;{{ selectedBooking.service_name }}</div>
          <div><strong>Sub-Service:</strong> &nbsp;{{ selectedBooking.sub_service_name }}</div>
          <div><strong>Service Details:</strong> &nbsp;{{ selectedBooking.selected_type_details }}</div>
          <div><strong>Service Price:</strong> &nbsp;{{ selectedBooking.service_price }}</div>
          <div><strong>Platform Fee:</strong> &nbsp;{{ selectedBooking.platform_fee }}</div>
          <div><strong>Total:</strong> &nbsp;₹{{ selectedBooking.total_amount }}</div>
          <div><strong>Schedule Date:</strong>{&nbsp;{ formatDate(selectedBooking.schedule_date) }}
            <template v-if="selectedBooking.service_id == 2"> to {{ formatDate(selectedBooking.schedule_end_date)
            }}</template>
            at {{ selectedBooking.schedule_time }}
          </div>
          <div><strong>Dog:</strong> &nbsp;{{ selectedBooking.is_dog ? "Yes" : "No" }}</div>
          <div><strong>Special Instructions:</strong> &nbsp;{{ selectedBooking.special_instructions }}</div>
          <div>
            <strong>Payment Status:</strong>
            &nbsp; <span :class="selectedBooking.payment_status == 2 ? 'text-success' : 'text-error'">
              {{ selectedBooking.payment_status == 2 ? 'Paid' : 'Pending' }}
            </span>
          </div>
          <div><strong>Payment ID:</strong> &nbsp;{{ selectedBooking.payment_id }}</div>
          <div><strong>Payment Method:</strong> &nbsp;{{ selectedBooking.payment_method }}</div>
          <div><strong>Payment Order ID:</strong> &nbsp;{{ selectedBooking.payment_order_id }}</div>
          <div><strong>Payment Date:</strong> &nbsp;{{ selectedBooking.payment_date }}</div>
          <div v-if="selectedBooking.cancellation_reason">
            <strong>Cancel Reason:</strong> &nbsp;{{ selectedBooking.cancellation_reason }}
          </div>
          <div class="mt-4">
            <AppSelect v-model="selectedBooking.booking_status" :items="bookingStatusList" label="Booking Status"
              :disabled="selectedBooking.booking_status === 4" />
          </div>
        </VCardText>
        <VCardText>
          <VRow class="justify-end" align="center" no-gutters>
            <VCol cols="12" sm="auto" class="mb-2 mb-sm-0 me-sm-2">
              <VBtn block color="secondary" @click="editDialog = false">
                Cancel
              </VBtn>
            </VCol>

            <VCol cols="12" sm="auto">
              <VBtn block color="primary" @click="updateStatus">
                Save
              </VBtn>
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>

<script>
import GlobalBreadCrumbsVue from "@/components/common/GlobalBreadCrumbs.vue";
import { VDataTable } from "vuetify/labs/VDataTable";
import { VSkeletonLoader } from "vuetify/labs/VSkeletonLoader";
import http from "../http-common";
/* const summaryCards = [
  {
    label: 'Total Booking',
    value: 14,
    icon: 'mdi-calendar-check',
    bgGradient: 'linear-gradient(135deg, #2196F3, #21CBF3)',
    iconBg: '#1976D2',
  },
  {
    label: 'Pending Payment',
    value: 5,
    icon: 'mdi-cash-clock',
    bgGradient: 'linear-gradient(135deg, #FF9800, #FFC107)',
    iconBg: '#F57C00',
  },
  {
    label: "Today's Booking",
    value: 9,
    icon: 'mdi-calendar-today',
    bgGradient: 'linear-gradient(135deg, #4CAF50, #81C784)',
    iconBg: '#388E3C',
  },
  {
    label: 'Cancelled Booking',
    value: 0,
    icon: 'mdi-calendar-remove',
    bgGradient: 'linear-gradient(135deg, #F44336, #E57373)',
    iconBg: '#D32F2F',
  },
] */
export default {
  components: {
    GlobalBreadCrumbsVue,
    VSkeletonLoader,
    VDataTable,
  },
  data() {
    return {
      summaryCards: [
        { label: "Accepted Booking", value: 0 },
        { label: "Confirmed Booking", value: 0 },
        { label: "Today's Booking", value: 0 },
        { label: "Pending Payment", value: 0 },
      ],
      loader: false,
      bookings: {
        data: [],
        total: 0,
        current_page: 1,
        per_page: 10,
      },
      /* options: {
        page: 1,
        itemsPerPage: 10,
        search: "",
      }, */
      options: {
        page: 1,
        itemsPerPage: 10,
        search: "",
        paymentStatus: "",
        bookingStatus: "",
      },
      editDialog: false,
      selectedBooking: {},
      bookingStatusList: [
        { title: "Pending", value: 1 },
        { title: "Accepted", value: 2 },
        { title: "In Progress", value: 3 },
        { title: "Completed", value: 4 },
        // { title: "Cancelled", value: 5 },
      ],
    };
  },
  created() {
    this.fetchStats();
    this.fetchData();
  },
  watch: {
    'options.itemsPerPage'(val) {
      this.options.page = 1
      this.fetchData()
    },
  },
  methods: {
    formatCustomDate(date) {
      if (!date) return ''

      const d = new Date(date)
      const dayName = d.toLocaleDateString('en-US', { weekday: 'long' }) // e.g., Friday

      const day = String(d.getDate()).padStart(2, '0')
      const month = String(d.getMonth() + 1).padStart(2, '0') // Months are 0-based
      const year = d.getFullYear()

      return `${dayName}, ${day}-${month}-${year}`
    },
    getBookingStatusColor(status) {
      switch (status) {
        case 2: return 'warning'     // Accepted
        case 4: return 'success'     // Completed
        case 5: return 'grey'        // Cancelled
        default: return 'primary'    // Pending or others
      }
    },
    formatDate(dateStr) {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    },
    fetchStats() {
      const styleMap = {
        "Accepted Booking": {
          icon: 'mdi-calendar-check',
          bgGradient: 'linear-gradient(135deg, #2196F3, #21CBF3)',
          iconBg: '#1976D2',
        },
        "Confirmed Booking": {
          icon: 'mdi-cash-clock',
          bgGradient: 'linear-gradient(135deg, #FF9800, #FFC107)',
          iconBg: '#F57C00',
        },
        "Today's Booking": {
          icon: 'mdi-calendar-today',
          bgGradient: 'linear-gradient(135deg, #4CAF50, #81C784)',
          iconBg: '#388E3C',
        },
        "Pending Payment": {
          icon: 'mdi-calendar-remove',
          bgGradient: 'linear-gradient(135deg, #F44336, #E57373)',
          iconBg: '#D32F2F',
        },
      }

      http.get("/booking-status-report").then((res) => {
        this.summaryCards = [
          {
            label: "Accepted Booking",
            value: res.data.booking_accepted,
            ...styleMap["Accepted Booking"],
          },
          {
            label: "Confirmed Booking",
            value: res.data.completed_bookings,
            ...styleMap["Confirmed Booking"],
          },
          {
            label: "Today's Booking",
            value: res.data.todays_bookings,
            ...styleMap["Today's Booking"],
          },
          {
            label: "Pending Payment",
            value: res.data.pending_payments,
            ...styleMap["Pending Payment"],
          },
        ];
      });
    },
    changePage() {
      this.fetchData();
    },
    /* fetchData() {
      this.loader = true;
      http
        .get(
          `/admin-booking-report?page=${this.options.page}&itemsPerPage=${this.options.itemsPerPage}&search=${this.options.search}`
        )
        .then((res) => {
          if (res.data.success) {
            this.bookings = res.data.data;
          }
          this.loader = false;
        })
        .catch((e) => {
          this.loader = false;
          console.log(e);
        });
    }, */
    fetchData() {
      this.loader = true;
      http
        .get(
          `/admin-booking-report?page=${this.options.page}&itemsPerPage=${this.options.itemsPerPage}&search=${this.options.search}&payment_status=${this.options.paymentStatus}&booking_status=${this.options.bookingStatus}`
        )
        .then((res) => {
          if (res.data.success) {
            this.bookings = res.data.data;
          }
          this.loader = false;
        })
        .catch((e) => {
          this.loader = false;
          console.log(e);
        });
    },
    openEditDialog(item) {
      this.selectedBooking = { ...item };
      this.editDialog = true;
    },
    updateStatus() {
      http
        .post(`/admin-update-booking-status/${this.selectedBooking.id}`, {
          booking_status: this.selectedBooking.booking_status,
        })
        .then((res) => {
          if (res.data.success) {
            this.fetchData();
            this.$toast.success(res.data.message);
            this.editDialog = false;
          } else {
            this.$toast.error(res.data.message);
          }
        })
        .catch((e) => {
          console.log(e);
          this.$toast.error("Update failed!");
        });
    },
    getStatusLabel(status) {
      const found = this.bookingStatusList.find((s) => s.value === status);
      return found ? found.title : status;
    },
    paginationMeta(options, total) {
      const start = (options.page - 1) * options.itemsPerPage + 1;
      const end = Math.min(options.page * options.itemsPerPage, total);
      return `Showing ${start} to ${end} of ${total} entries`;
    },
  },
};
</script>
<style scoped>
.dashboard-card {
  border-radius: 16px;
  transition: transform 0.25s ease;
}

.dashboard-card:hover {
  transform: translateY(-4px);
}

.icon-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.landmark-chip {
  font-weight: bold;
  background-color: #e3f2fd;
  /* Light blue background */
  color: #0d47a1;
  /* Deep blue text */
}

.theme--dark .landmark-chip {
  background-color: #1976d2;
  /* Primary dark */
  color: #ffffff;
  /* White text */
}
</style>