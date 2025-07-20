<template>
    <div>
        <GlobalBreadCrumbsVue></GlobalBreadCrumbsVue>
        <VCard title="Update Pincode ">
            <VForm ref="formSubmit">
                <VCardText>
                    <VRow>
                        <VCol cols="12" md="6">
                            <AppTextField :rules="[globalRequire, numberMin, numberMax].flat()"
                                v-model="insertData.pin_code" label="Pincode" />
                        </VCol>
                        <VCol cols="12" md="3">
                            <label class="custom-label">
                                Status <span class="red-asterisk">*</span>
                            </label>
                            <VRadioGroup :rules="[globalRequire].flat()" v-model="insertData.status" inline>
                                <VRadio label="Active" :value="1" density="compact" />
                                <VRadio label="In-Active" :value="0" density="compact" />
                            </VRadioGroup>
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
                status: "",
            },
            loader: false,
            paramsId: this.$route.params.id,
            errors: {},
            isAlertVisible: false,
            requiredFieldsMeta: [
                { label: 'Pincode', path: 'pin_code' },
                { label: 'Status', path: 'status' },
            ],
        };
    },
    created() {
        this.fetchData();
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
        async fetchData() {
            this.loader = true;
            await http
                .get("/pincode/show/" + this.paramsId)
                .then((res) => {
                    if (res.data.success) {
                        const resData = res.data.data;
                        this.insertData.pin_code = resData.pin_code;
                        this.insertData.status = resData.status;
                    }
                })
                .catch((e) => {
                    console.log(e);
                });
            this.loader = false;
        },
        async updateData() {
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
                .post("pincode/update/" + this.paramsId, this.insertData)
                .then((res) => {
                    if (res.data.success) {
                        this.$toast.success(res.data.message);
                        this.$router.push({
                            path: "/pincode/list/",
                        });
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