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
                    ]" label="Per Page" style="width: 6.25rem" />
                </div>
                <VSpacer />

                <div class="app-user-search-filter d-flex align-center flex-wrap gap-4">
                    <!-- 👉 Search  -->
                    <div style="inline-size: 10rem">
                        <AppTextField v-model="options.search" placeholder="Search By Pincode" density="compact"
                            @keyup="fetchData()" />
                    </div>
                </div>
                <div class="app-user-search-filter d-flex align-center flex-wrap gap-4">
                    <router-link to="/pincode/add">
                        <VBtn prepend-icon="tabler-plus"> Add Pincode </VBtn>
                    </router-link>
                </div>
            </VCardText>
            <VDivider />
            <v-skeleton-loader type="table" :loading="loader">
                <v-data-table class="text-no-wrap" fixed-header>
                    <thead>
                        <tr>
                            <th class="text-uppercase">ID.</th>
                            <th class="text-uppercase text-center">Pincode</th>
                            <th class="text-uppercase text-center">Status</th>
                            <th class="text-uppercase text-center">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-for="(item, index) in data.data" :key="index">
                            <td>
                                {{ (data.current_page - 1) * data.per_page + index + 1 }}
                            </td>
                            <td class="text-center">
                                {{ item.pin_code }}
                            </td>
                            <td class="text-center">
                                {{ item.status == 1 ? "Active" : "In-Active" }}
                            </td>
                            <td class="text-center">
                                <router-link :to="'/pincode/editPincode/' + item.id">
                                    <IconBtn>
                                        <VIcon :icon="'tabler-edit-circle'" />

                                        <VTooltip activator="parent" location="start">
                                            Edit Data
                                        </VTooltip>
                                    </IconBtn>
                                </router-link>
                                |
                                <IconBtn>
                                    <VIcon class="text-primary" :icon="'tabler-trash-filled'"
                                        @click="openDeletePopup(item.id)" />
                                    <VTooltip activator="parent" location="start">
                                        Delete Data
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
                <VPagination v-model="options.page" :length="Math.ceil(data.total / options.itemsPerPage)"
                    :total-visible="$vuetify.display.xs
                        ? 1
                        : Math.ceil(data.total / options.itemsPerPage)
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
import http from "../../http-common";
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
            data: {
                data: [],
                total: 0,
                current_page: 1,
                per_page: 10,
            },
            loader: false,
            isDeleteDialogVisible: false,
            options: {
                page: 1,
                itemsPerPage: 10,
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
    watch: {
        'options.itemsPerPage'(val) {
            this.options.page = 1
            this.fetchData()
        },
    },
    methods: {
        changePage() {
            this.fetchData();
        },
        fetchData() {
            this.loader = true;
            http
                .get(
                    "/pincode/index?page=" +
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

        deleteData() {
            http
                .post("/pincode/delete/" + this.editableId, {})
                .then((res) => {
                    if (res.data.success) {
                        this.fetchData();
                        this.$toast.success(res.data.message);
                    } else {
                        this.$toast.error(res.data.message);
                    }
                    this.editableId = "";
                    this.isDeleteDialogVisible = false;
                })
                .catch((e) => {
                    console.log(e);
                    this.isDeleteDialogVisible = false;
                });
        },
    },
};
</script>