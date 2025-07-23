<template>
    <div>
        <GlobalBreadCrumbsVue></GlobalBreadCrumbsVue>
        <VCard title="Add Sub Service Pricing">
            <VForm ref="formSubmit">
                <VCardText>
                    <VRow>
                        <VCol cols="12" md="6">
                            <label class="custom-label">
                                Select Service <span class="red-asterisk">*</span>
                            </label>
                            <AppSelect v-model="insertData.service_id" :items="data_fetch_service"
                                :rules="[globalRequire].flat()" item-title="name" item-value="id" />
                        </VCol>
                        <VCol cols="12" md="6">
                            <label class="custom-label">
                                Select Sub Service Slug Name <span class="red-asterisk">*</span>
                            </label>
                            <AppSelect v-model="insertData.subservice_type_name_slug"
                                :items="data_fetch_subservice_type_name_slug" :rules="[globalRequire].flat()"
                                item-title="name" item-value="slug" />
                        </VCol>
                        <VCol cols="12" md="6">
                            <label class="custom-label">
                                Label <span class="red-asterisk">*</span>
                            </label>
                            <AppTextField :rules="[globalRequire].flat()" v-model="insertData.label"
                                placeholder="Ex: 1 BHK, 2 BHK" />
                        </VCol>
                        <VCol cols="12" md="6">
                            <label class="custom-label">
                                Price <span class="red-asterisk">*</span>
                            </label>
                            <AppTextField v-model="insertData.price" :rules="[globalRequire].flat()" type="number" />
                        </VCol>
                    </VRow>
                </VCardText>
                <VAlert v-if="isAlertVisible && summaryErrors.length" v-model="isAlertVisible" closable
                    close-label="Close Alert" color="error" class="mb-4">
                    <div class="d-flex flex-wrap" style="gap: 8px;">
                        <span v-for="(msg, index) in summaryErrors" :key="index" class="error-chip">
                            {{ msg }}
                        </span>
                    </div>
                </VAlert>
                <VCardText class="d-flex justify-end flex-wrap gap-3">
                    <VBtn @click="saveData"> Save </VBtn>
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
                service_id: "",
                subservice_type_name_slug: "",
                label: "",
                price: "",
            },
            data_fetch_service: "",
            data_fetch_subservice_type_name_slug: "",
            loader: false,
            errors: {},
            isAlertVisible: false,
            requiredFieldsMeta: [
                { label: 'Service', path: 'service_id' },
                { label: 'Sub Service Slug Name', path: 'subservice_type_name_slug' },
                { label: 'Label', path: 'label' },
                { label: 'Price', path: 'price' },
            ],
        };
    },
    created() {
        this.fetch_service();
        this.fetch_sub_service_type_name();
    },
    methods: {
        collectMissingFields() {
            const missing = [];
            this.requiredFieldsMeta.forEach(field => {
                const value = this.insertData[field.path];
                if (
                    value === null || // null or undefined
                    value === undefined ||
                    value === '' ||
                    (Array.isArray(value) && value.length === 0)
                ) {
                    missing.push(field.label);
                }
            });
            return missing;
        },
        fetch_service() {
            http
                .get("/sub-service/service-name-list")
                .then((res) => {
                    if (res.data.success) {
                        this.data_fetch_service = res.data.data;
                    }
                })
                .catch((e) => {
                    this.$toast.error("Something went wrong");
                });
        },
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
        async saveData() {
            const checkValidation = await this.$refs.formSubmit.validate();
            // Collect missing fields for summary
            const missingFields = this.collectMissingFields();

            if (!checkValidation.valid || missingFields.length > 0) {
                this.summaryErrors = missingFields.map(f => `${f} is required.`);
                this.isAlertVisible = true;
                // Optionally scroll to alert
                return;
            } else {
                this.summaryErrors = [];
            }
            this.loader = true;
            http
                .post("/sub-service-type-detail/store", this.insertData)
                .then((res) => {
                    if (res.data.success) {
                        this.$router.push({
                            path: "/subServicePricing/list/",
                        });
                        this.$toast.success(res.data.message);
                        this.isAlertVisible = false;
                        this.summaryErrors = [];
                    } else {
                        this.$toast.error(res.data.message);
                        this.errors = res.data.data;
                        this.isAlertVisible = true;
                    }
                    this.loader = false;
                })
                .catch((e) => {
                    this.loader = false;
                    console.log(e);
                });
        },
    },
};
</script>
<style scoped>
.custom-label {
    display: block;
    margin-bottom: 4px;
    font-size: 14px;
    color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
}

.red-asterisk {
    color: red;
}
</style>