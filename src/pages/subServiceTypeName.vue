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
                        <AppTextField v-model="options.search" placeholder="Search By Name" density="compact"
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
                            <th class="text-uppercase text-center">Name</th>
                            <th class="text-uppercase text-center">Slug</th>
                            <th class="text-uppercase text-center">Unit Label</th>
                            <th class="text-uppercase text-center">Example</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-for="(item, index) in data.data" :key="index">
                            <td>
                                {{ (data.current_page - 1) * data.per_page + index + 1 }}
                            </td>
                            <td class="text-center">
                                {{ item.name }}
                            </td>
                            <td class="text-center">
                                {{ item.slug }}
                            </td>
                            <td class="text-center">
                                {{ item.unit_label }}
                            </td>
                            <td class="text-center">
                                {{ item.example }}
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
                    "/sub-service-type-name-list?page=" +
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

        paginationMeta(options, total) {
            const start = (options.page - 1) * options.itemsPerPage + 1;
            const end = Math.min(options.page * options.itemsPerPage, total);

            return `Showing ${start} to ${end} of ${total} entries`;
        },
    },
};
</script>