<template>
    <div>
        <GlobalBreadCrumbsVue></GlobalBreadCrumbsVue>
        <br />
        <VDivider />
        <VCard>
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
                    <h3>Update Privacy Policy</h3>
                    <br />
                    <VRow>
                        <VCol cols="12" md="12">
                            <VTextarea v-model="insertData.privacy_policy" label="Privacy Policy" />
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
import http from "../http-common";
export default {
    components: {
        GlobalBreadCrumbsVue,
    },
    data() {
        return {
            baseUrl: import.meta.env.VITE_APP_BASE_URL,
            insertData: {
                privacy_policy: "",
            },
            loader: false,
            paramsId: this.$route.params.id,
            errors: {},
            isAlertVisible: false,
        };
    },
    created() {
        this.fetchData();
    },
    methods: {
        fetchData() {
            this.loader = true;
            http
                .get("/privacy-policy/show")
                .then((res) => {
                    if (res.data.success) {
                        this.insertData.privacy_policy = res.data.data.privacy_policy;
                    }
                    this.loader = false;
                })
                .catch((e) => {
                    this.loader = false;
                    console.log(e);
                });
        },
        async updateData() {
            const checkValidation = await this.$refs.formSubmit.validate();
            if (checkValidation.valid) {
                this.loader = true;
                http
                    .post("privacy-policy/update", this.insertData)
                    .then((res) => {
                        if (res.data.success) {
                            this.fetchData();
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
                    });
            }
        },
    },
};
</script>