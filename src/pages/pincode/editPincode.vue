<template>
    <div>
        <GlobalBreadCrumbsVue></GlobalBreadCrumbsVue>

        <VCard title="Update Pincode ">
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
                        <VCol cols="12" md="6">
                            <AppTextField :rules="[globalRequire, numberMin, numberMax].flat()"
                                v-model="insertData.pin_code" label="Pincode" />
                        </VCol>
                        <VCol cols="12" md="3">
                            <VRadioGroup v-model="insertData.status" inline label="Status">
                                <VRadio label="Active" :value="1" density="compact" />
                                <VRadio label="In-Active" :value="0" density="compact" />
                            </VRadioGroup>
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
        };
    },
    created() {
        this.fetchData();
    },
    methods: {
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