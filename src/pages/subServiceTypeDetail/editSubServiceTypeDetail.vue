<template>
    <div>
        <GlobalBreadCrumbsVue></GlobalBreadCrumbsVue>

        <VCard title="Update Data of Sub Service Type Detail">
            <VAlert v-model="isAlertVisible" closable close-label="Close Alert" color="error">
                <ul v-for="(value, key) in errors" :key="key">
                    <li v-for="(value1, key1) in value" :key="key1">-> {{ value1 }}</li>
                </ul>
                {{ value }}
            </VAlert>
            <VForm ref="formSubmit">
                <VCardText>
                    <VRow>
                        <VCol cols="12" md="4">
                            <AppSelect v-model="insertData.subservice_type_name_slug"
                                :items="data_fetch_subservice_type_name_slug" :rules="[globalRequire].flat()"
                                item-title="name" item-value="slug" label="Sub Service Slug Name" />
                        </VCol>
                        <VCol cols="12" md="4">
                            <AppTextField :rules="[globalRequire].flat()" v-model="insertData.label" label="Label" />
                        </VCol>
                        <VCol cols="12" md="4">
                            <AppTextField v-model="insertData.price" :rules="[globalRequire].flat()" typee="number"
                                label="Price" />
                        </VCol>
                    </VRow>
                </VCardText>
                <VCardText class="d-flex justify-end flex-wrap gap-3">
                    <VBtn @click="updateData"> Update </VBtn>
                </VCardText>
            </VForm>
        </VCard>
        <!-- global loader modal -->
        <VDialog v-model="loader" width="300">
            <VCard color="primary" width="300">
                <VCardText class="pt-3">
                    loading.........
                    <VProgressLinear indeterminate class="mb-0" />
                </VCardText>
            </VCard>
        </VDialog>
    </div>
</template>

<script>
import GlobalBreadCrumbsVue from "@/components/common/GlobalBreadCrumbs.vue";
import http from "../../http-common";
export default {
    components: {
        GlobalBreadCrumbsVue,
    },
    data() {
        return {
            globalRequire: [
                (value) => {
                    if (value) return true;
                    return "Required.";
                },
            ],
            nameMin: [
                (value) => {
                    if (value?.length >= 3) return true;
                    return "Must be at least 3 characters.";
                },
            ],
            insertData: {
                subservice_type_name_slug: "",
                label: "",
                price: "",
            },
            data_fetch_subservice_type_name_slug: "",
            loader: false,
            paramsId: this.$route.params.id,
            errors: {},
            isAlertVisible: false,
        };
    },
    created() {
        this.fetchData();
        this.fetch_sub_service_type_name();
    },
    methods: {
        fetch_sub_service_type_name() {
            http
                .get("/sub-service-type-detail/sub-service-type-name-list")
                .then((res) => {
                    if (res.data.success) {
                        this.data_fetch_subservice_type_name_slug = res.data.data;
                    }
                })
                .catch((e) => {
                    this.$toast.error("Something went wrong");
                });
        },
        async fetchData() {
            this.loader = true;
            await http
                .get("/sub-service-type-detail/show/" + this.paramsId)
                .then((res) => {
                    if (res.data.success) {
                        const resData = res.data.data;
                        this.insertData.subservice_type_name_slug = resData.subservice_type_name_slug;
                        this.insertData.label = resData.label;
                        this.insertData.price = resData.price;
                    }
                })
                .catch((e) => {
                    console.log(e);
                });
            this.loader = false;
        },
        async updateData() {

            this.loader = true;
            http
                .post("sub-service-type-detail/update/" + this.paramsId, this.insertData)
                .then((res) => {
                    if (res.data.success) {
                        this.fetchData();
                        this.$toast.success(res.data.message);
                        this.$router.push({
                            path: "/subServiceTypeDetail/list/",
                        });
                        this.isAlertVisible = false;
                    } else {
                        this.$toast.error(res.data.message);
                        this.errors = res.data.data;
                        this.isAlertVisible = true;
                    }
                    this.loader = false;
                })
                .catch((e) => {
                    this.loader = false;
                });
        },
    },
};
</script>
