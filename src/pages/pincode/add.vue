<template>
    <div>
        <GlobalBreadCrumbsVue></GlobalBreadCrumbsVue>
        <VCard title="Add Pincode">
            <VForm ref="formSubmit">
                <VCardText>
                    <VRow>
                        <VCol cols="12" md="6">
                            <label class="custom-label">
                                Pincode <span class="red-asterisk">*</span>
                            </label>
                            <AppTextField :rules="[globalRequire, numberMin, numberMax].flat()" type="number"
                                v-model="insertData.pin_code" :error="!!errors.pin_code"
                                :error-messages="errors.pin_code" />
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
            numberMin: [
                (value) => {
                    if (value?.length >= 6) return true;
                    return "Must be at least 6 characters.";
                },
            ],
            numberMax: [
                (value) => {
                    if (value?.length <= 6) return true;
                    return "Must be at least 6 characters.";
                },
            ],
            insertData: {
                pin_code: "",
            },
            loader: false,
            errors: {},
            isAlertVisible: false,
            requiredFieldsMeta: [
                { label: 'Pincode', path: 'pin_code' },
            ],
        };
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
                .post("/pincode/store", this.insertData)
                .then((res) => {
                    if (res.data.success) {
                        this.$router.push({
                            path: "/pincode/list/",
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