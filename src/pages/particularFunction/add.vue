<template>
    <div>
        <GlobalBreadCrumbsVue></GlobalBreadCrumbsVue>
        <VCard title="Add Particular Function Details">
            <VAlert v-if="isAlertVisible" v-model="isAlertVisible" closable close-label="Close Alert" color="error"
                class="mb-4">
                <div class="d-flex flex-wrap" style="gap: 8px;">
                    <span v-for="(msg, index) in errors" :key="index" class="error-chip">
                        • {{ msg }}
                    </span>
                </div>
            </VAlert>
            <VForm ref="formSubmit">
                <VCardText>
                    <VRow>
                        <VCol cols="12" md="4">
                            <AppTextField :rules="[globalRequire, nameMin, nameMax].flat()" v-model="insertData.name"
                                label="Name" />
                        </VCol>
                        <VCol cols="12" md="4">
                            <VRadioGroup v-model="insertData.is_multiple_days" inline label="Select Days">
                                <VRadio label="Single Day" :value="0" density="compact" />
                                <VRadio label="Multiple Day" :value="1" density="compact" />
                            </VRadioGroup>
                        </VCol>
                    </VRow>
                </VCardText>
                <VCardText class="d-flex justify-end flex-wrap gap-3">
                    <VBtn @click="saveData"> Save </VBtn>
                </VCardText>
            </VForm>
        </VCard>
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
// import Vue from "vue";
// import DatetimePicker from "vuetify-datetime-picker";
import http from "../../http-common";
// Vue.use(DatetimePicker);
export default {
    components: {
        GlobalBreadCrumbsVue,
        // DatetimePicker,
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
                    if (value?.length <= 50) return true;
                    return "Must be at least 50 characters.";
                },
            ],
            nameMax: [
                (value) => {
                    if (value?.length >= 3) return true;
                    return "Must be at least 3 characters.";
                },
            ],
            insertData: {
                name: "",
                is_multiple_days: "",
            },
            loader: false,
            errors: {},
            isAlertVisible: false,
        };
    },
    methods: {
        async saveData() {
            const checkValidation = await this.$refs.formSubmit.validate();
            if (checkValidation.valid) {
                this.loader = true;
                http
                    .post("/particular-function/store", this.insertData)
                    .then((res) => {
                        if (res.data.success) {
                            this.$router.push({
                                path: "/particularFunction/list/",
                            });
                            this.$toast.success(res.data.message);
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
                        console.log(e);
                    });
            }
        },
    },
};
</script>