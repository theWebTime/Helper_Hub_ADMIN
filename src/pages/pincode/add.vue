<template>
    <div>
        <GlobalBreadCrumbsVue></GlobalBreadCrumbsVue>
        <VCard title="Add Pincode">
            <VAlert v-model="isAlertVisible" closable close-label="Close Alert" color="error">
                <ul v-for="(value, key) in errors" :key="key">
                    <li v-for="(value1, key1) in value" :key="key1">-> {{ value1 }}</li>
                </ul>
                {{ value }}
            </VAlert>
            <VForm ref="formSubmit">
                <VCardText>
                    <VRow>
                        <VCol cols="12" md="6">
                            <AppTextField :rules="[globalRequire, numberMin, numberMax].flat()" type="number"
                                v-model="insertData.pin_code" label="Pincode" />
                        </VCol>
                    </VRow>
                </VCardText>
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
        };
    },
    methods: {
        async saveData() {
            const checkValidation = await this.$refs.formSubmit.validate();
            if (checkValidation.valid) {
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
