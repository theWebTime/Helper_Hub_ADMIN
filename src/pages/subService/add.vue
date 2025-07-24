<template>
    <div>
        <GlobalBreadCrumbsVue></GlobalBreadCrumbsVue>
        <VCard title="Add Sub Service">
            <VForm ref="formSubmit">
                <VCardText>
                    <VRow>
                        <VCol cols="12" md="4">
                            <label class="custom-label">
                                Select Service <span class="red-asterisk">*</span>
                            </label>
                            <AppSelect v-model="insertData.service_id" :items="data_fetch_service"
                                :rules="[globalRequire].flat()" item-title="name" item-value="id" />
                        </VCol>
                        <VCol cols="12" md="4">
                            <label class="custom-label">
                                Select Multiple Slug Name <span class="red-asterisk">*</span>
                            </label>
                            <AppSelect v-model="insertData.type_slugs" :rules="[globalRequire].flat()"
                                :items="data_fetch_subservice_type_name_slug" item-title="name" item-value="slug"
                                multiple chips />
                        </VCol>
                        <VCol cols="12" md="4">
                            <label class="custom-label">
                                Sub Service Name <span class="red-asterisk">*</span>
                            </label>
                            <AppTextField :rules="[globalRequire].flat()" v-model="insertData.name" />
                        </VCol>
                        <VCol cols="12" md="6">
                            <label class="custom-label">
                                Description <span class="red-asterisk">*</span>
                            </label>
                            <v-textarea v-model="insertData.description" :rules="[globalRequire].flat()" />
                        </VCol>
                        <VCol cols="12" md="6">
                            <label class="custom-label">
                                Sub Service Image <span class="red-asterisk">*</span>
                            </label>
                            <v-file-input accept="image/*" v-model="image" :rules="[globalRequire].flat()"
                                ref="file"></v-file-input>
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
            image: "",
            insertData: {
                service_id: "",
                type_slugs: [],
                name: "",
                description: "",
            },
            data_fetch_service: "",
            data_fetch_subservice_type_name_slug: "",
            loader: false,
            errors: {},
            isAlertVisible: false,
            requiredFieldsMeta: [
                { label: 'Service', path: 'service_id' },
                { label: 'Slug Name', path: 'type_slugs' },
                { label: 'Sub Service', path: 'name' },
                { label: 'Description', path: 'description' },
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
                .get("/sub-service/sub-service-type-name-list")
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
            const formData = new FormData();
            if (this.image) {
                const imageData = this.$refs.file.files[0];
                formData.append("image", imageData);
            } else {
                formData.append("image", "");
            }
            for (let x in this.insertData) {
                formData.append(x, this.insertData[x]);
            }
            this.loader = true;
            http
                .post("/sub-service/store", formData)
                .then((res) => {
                    if (res.data.success) {
                        this.$router.push({
                            path: "/subService/list/",
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