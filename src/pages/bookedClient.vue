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
                        <AppTextField v-model="options.search" placeholder="Function Name" density="compact"
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
                            <th class="text-uppercase text-center">Client Name</th>
                            <th class="text-uppercase text-center">Client Phone Number</th>
                            <th class="text-uppercase text-center">Client Starting Date</th>
                            <th class="text-uppercase text-center">Function Name</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-for="(item, index) in data.data" :key="index">
                            <td>
                                {{ (data.current_page - 1) * data.per_page + index + 1 }}
                            </td>
                            <td class="text-center">
                                {{ item.client_name }}
                            </td>
                            <td class="text-center">
                                {{ item.phone_number }}
                            </td>
                            <td class="text-center">
                                {{ formatDate(item.starting_date) }}
                            </td>
                            <td class="text-center">
                                {{ item.function_name }}
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
            editableId: null,
            errors: {},
            isAlertVisible: false,
        };
    },
    created() {
        this.fetchData();
    },
    methods: {
        formatDate(date) {
            if (!date) return '';
            const d = new Date(date);
            const day = String(d.getDate()).padStart(2, '0');
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const year = d.getFullYear();
            return `${day}-${month}-${year}`;
        },
        changePage() {
            this.options.page = this.options.page;
            this.fetchData();
        },
        fetchData() {
            this.loader = true;
            http
                .get("/booked-client-index?page=" +
                    this.options.page +
                    "&itemsPerPage=" +
                    this.options.itemsPerPage +
                    "&search=" +
                    this.options.search)
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

        paginationMeta(options, total) {
            const start = (options.page - 1) * options.itemsPerPage + 1;
            const end = Math.min(options.page * options.itemsPerPage, total);

            return `Showing ${start} to ${end} of ${total} entries`;
        },
    },
};
</script>