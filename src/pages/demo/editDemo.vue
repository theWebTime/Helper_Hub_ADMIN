<template>
    <div>
        <GlobalBreadCrumbsVue></GlobalBreadCrumbsVue>

        <VCard title="Update Booked Demo Status">
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
                            <VRadioGroup v-model="insertData.demo_status" inline label="Status">
                                <VRadio label="Finished" :value="1" density="compact" />
                                <VRadio label="Pending" :value="0" density="compact" />
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
            insertData: {
                demo_status: "",
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
                .get("/booking-demo/show/" + this.paramsId)
                .then((res) => {
                    if (res.data.success) {
                        const resData = res.data.data;
                        this.insertData.demo_status = resData.demo_status;
                    }
                })
                .catch((e) => {
                    console.log(e);
                });
            this.loader = false;
        },
        async updateData() {
            const checkValidation = await this.$refs.formSubmit.validate();
            if (checkValidation.valid) {
                this.loader = true;
                http
                    .post("booking-demo/update/" + this.paramsId, this.insertData)
                    .then((res) => {
                        if (res.data.success) {
                            this.$toast.success(res.data.message);
                            this.$router.push({
                                path: "/demo/list/",
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
            }
        },
    },
};
</script>
