<template>
    <div>
        <GlobalBreadCrumbsVue></GlobalBreadCrumbsVue>
        <VCard title="Add Sub Service">
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
                            <AppSelect v-model="insertData.service_id" :items="data_fetch_service"
                                :rules="[globalRequire].flat()" item-title="name" item-value="id"
                                label="Select Service" />
                        </VCol>
                        <VCol cols="12" md="4">
                            <AppSelect v-model="insertData.type_slugs" :items="data_fetch_subservice_type_name_slug"
                                :rules="[globalRequire].flat()" item-title="name" item-value="slug"
                                label="Select Multiple Slug Name" multiple chips />
                        </VCol>
                        <VCol cols="12" md="4">
                            <AppTextField :rules="[globalRequire].flat()" v-model="insertData.name" label="Name" />
                        </VCol>
                        <VCol cols="12" md="6">
                            <v-textarea v-model="insertData.description" label="Description" />
                        </VCol>
                        <VCol cols="12" md="3">
                            <label>Service Image</label>
                            <v-file-input accept="image/*" v-model="image" ref="file"></v-file-input>
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
            nameMin: [
                (value) => {
                    if (value?.length >= 3) return true;
                    return "Must be at least 3 characters.";
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
        };
    },
    created() {
        this.fetch_service();
        this.fetch_sub_service_type_name();
    },
    methods: {
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
            if (checkValidation.valid) {
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
