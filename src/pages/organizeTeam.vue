<template>
    <div>
        <GlobalBreadCrumbsVue></GlobalBreadCrumbsVue>
        <VCard>
            <VCardText class="d-flex flex-wrap py-4 gap-4">
                <div class="me-3 d-flex gap-3">
                    <AppSelect v-model="options.itemsPerPage" :items="[
                        { value: 10, title: '10' },
                        { value: 25, title: '25' },
                        { value: 50, title: '50' },
                        { value: 100, title: '100' },
                        { value: -1, title: 'All' },
                    ]" disabled style="width: 6.25rem" />
                </div>
                <VSpacer />

                <div class="app-user-search-filter d-flex align-center flex-wrap gap-4">
                    <!-- 👉 Search  -->
                    <div style="inline-size: 10rem">
                        <AppTextField v-model="options.search" placeholder="Search" density="compact"
                            @keyup="fetchData()" />
                    </div>
                </div>
            </VCardText>
            <VDivider />
            <v-skeleton-loader type="table" :loading="loader">
                <v-data-table class="text-no-wrap" fixed-header>
                    <thead>
                        <tr>
                            <th class="text-uppercase">ID.</th>
                            <th class="text-uppercase text-center">Staff Name</th>
                            <th class="text-uppercase text-center">Phone Number</th>
                            <th class="text-uppercase text-center">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-for="(item, index) in data.data" :key="index">
                            <td>
                                {{ (data.current_page - 1) * data.per_page + index + 1 }}
                            </td>
                            <td class="text-center">
                                {{ item.staff_name }}
                            </td>
                            <td class="text-center">
                                {{ item.phone_number }}
                            </td>
                            <td class="text-center">
                                <IconBtn>
                                    <VIcon class="text-primary" :icon="'tabler-download'" @click="downloadPDF(item)" />
                                    <VTooltip activator="parent" location="start">
                                        Download Invoice
                                    </VTooltip>
                                </IconBtn>
                                |
                                <IconBtn>
                                    <VIcon class="text-primary" :icon="'tabler-brand-whatsapp'"
                                        @click="sendStaffDetailsToWhatsapp(item.staff_id)" />
                                    <VTooltip activator="parent" location="start">
                                        Whatsapp
                                    </VTooltip>
                                </IconBtn>
                            </td>
                        </tr>
                    </tbody>
                    <template #bottom></template>
                </v-data-table>
            </v-skeleton-loader>
            <div class="d-flex align-center justify-sm-space-between justify-center flex-wrap gap-3 pa-5 pt-3">
                <p class="text-sm text-disabled mb-0">
                    {{ paginationMeta(options, data.total) }}
                </p>
                <VPagination v-model="options.page" :length="Math.ceil(this.data.total / options.itemsPerPage)"
                    :total-visible="$vuetify.display.xs
                        ? 1
                        : Math.ceil(this.data.total / options.itemsPerPage)
                        " @click="changePage()">
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
import 'jspdf-autotable';
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
        fetchData() {
            this.loader = true;
            http
                .get(
                    "/staff/staff-functions-grouped?page=" +
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

        downloadPDF(item) {
            this.isLoading = true;
            http.get(`/staff/download-pdf/${item.staff_id}`, { responseType: 'blob' })
                .then(response => {
                    // Create a blob from the PDF stream
                    const blob = new Blob([response.data], { type: 'application/pdf' });
                    // Create a link element
                    const link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    // Set the filename
                    link.download = `staff_details_${item.staff_id}.pdf`;
                    // Append to the DOM
                    document.body.appendChild(link);
                    // Trigger the download
                    link.click();
                    // Clean up
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(link.href);
                })
                .catch(error => {
                    console.error('Error downloading PDF:', error);
                    this.$toast.error('Failed to download PDF');
                })
                .finally(() => {
                    this.isLoading = false;
                });
        },

        sendStaffDetailsToWhatsapp(staffId) {
            this.isLoading = true;
            http
                .get(`/staff/generate-pdf/${staffId}`)
                .then((res) => {
                    if (res.data.success) {
                        const staffPdfUrl = res.data.url;
                        let phoneNumber = res.data.phone_number || '';

                        if (!phoneNumber) {
                            this.$toast.error('Phone number not available for this staff.');
                            return;
                        }

                        // Clean the phone number
                        phoneNumber = phoneNumber.replace(/\D/g, ''); // remove non-digits
                        if (phoneNumber.length === 10) {
                            phoneNumber = '91' + phoneNumber; // add Indian country code if only 10 digits
                        }

                        // Prepare WhatsApp message
                        const message = `Hello! Here are your assigned functions: ${staffPdfUrl}`;
                        const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

                        // Open WhatsApp link
                        window.open(whatsappLink, '_blank');
                    } else {
                        this.$toast.error(res.data.message || 'Failed to generate PDF.');
                    }
                })
                .catch((e) => {
                    console.error(e);
                    this.$toast.error('Something went wrong while sending staff details.');
                })
                .finally(() => {
                    this.isLoading = false;
                });
        },

    },
};
</script>