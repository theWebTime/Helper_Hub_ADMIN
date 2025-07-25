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
                        <AppTextField v-model="options.search" placeholder="Search By Label" density="compact"
                            @keyup="fetchData()" />
                    </div>
                    <router-link to="/subServicePricing/add">
                        <VBtn prepend-icon="tabler-plus"> Add Sub Service Pricing</VBtn>
                    </router-link>
                </div>
            </VCardText>
            <VDivider />
            <v-skeleton-loader type="table" :loading="loader">
                <v-data-table class="text-no-wrap" fixed-header>
                    <thead>
                        <tr>
                            <th class="text-uppercase">ID.</th>
                            <th class="text-uppercase text-center">Service Name</th>
                            <th class="text-uppercase text-center">Slug</th>
                            <th class="text-uppercase text-center">Label</th>
                            <th class="text-uppercase text-center">Price</th>
                            <th class="text-uppercase text-center">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-for="(item, index) in data.data" :key="index">
                            <td>
                                {{ (data.current_page - 1) * data.per_page + index + 1 }}
                            </td>
                            <td class="text-center">
                                {{ item.service_name }}
                            </td>
                            <td class="text-center">
                                {{ item.subservice_type_name_slug }}
                            </td>
                            <td class="text-center">
                                {{ item.label }}
                            </td>
                            <td class="text-center">
                                {{ item.price }}
                            </td>
                            <td class="text-center">
                                <router-link :to="'/subServicePricing/editSubServicePricing/' + item.id">
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
                    "/sub-service-type-detail/index?page=" +
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
                .post("/sub-service-type-detail/delete/" + this.editableId, {})
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
