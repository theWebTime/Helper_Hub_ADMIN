<template>
    <div>
        <GlobalBreadCrumbsVue></GlobalBreadCrumbsVue>

        <VCard title="Update Sub Service Details">

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
                        <VCol cols="12" md="3">
                            <label>Service Image</label>
                            <v-file-input accept="image/*" v-model="image" ref="file"></v-file-input>
                        </VCol>
                        <VCol cols="12" md="3">
                            <VAvatar size="48">
                                <VImg :src="`${baseUrl}/images/subService/${fetch_photo}`" class="rounded-square"
                                    cover />
                            </VAvatar>
                        </VCol>
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
            baseUrl: import.meta.env.VITE_APP_BASE_URL,
            globalRequire: [
                (value) => {
                    if (value) return true;
                    return "Required.";
                },
            ],
            nameMin: [
                (value) => {
                    if (!value) return "Required.";
                    if (value.length < 3) return "Must be at least 3 characters.";
                    return true;
                },
            ],
            nameMax: [
                (value) => {
                    if (!value) return "Required.";
                    if (value.length > 50) return "Must not exceed 50 characters.";
                    return true;
                },
            ],
            email: [
                (v) =>
                    !v ||
                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
                    "Email must be valid",
            ],
            passwordMin: [
                (value) => {
                    if (value?.length > 6) return true;
                    return "Must be at least 6 characters.";
                },
            ],
            image: "",
            fetch_photo: "",
            insertData: {
                service_id: "",
                type_slugs: [],
                name: "",
                description: "",
                status: "",
            },
            data_fetch_service: "",
            data_fetch_subservice_type_name_slug: "",
            loader: false,
            paramsId: this.$route.params.id,
            errors: {},
            isAlertVisible: false,
        };
    },
    created() {
        this.fetchData();
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
        async fetchData() {
            this.loader = true;
            await http
                .get("/sub-service/show/" + this.paramsId)
                .then((res) => {
                    if (res.data.success) {
                        const resData = res.data.data;
                        this.insertData.service_id = resData.service_id;
                        this.insertData.type_slugs = resData.type_slugs.split(",");
                        this.insertData.name = resData.name;
                        this.insertData.description = resData.description;
                        this.insertData.status = resData.status;
                        this.fetch_photo = resData.image == null ? "" : resData.image;
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
                    .post("sub-service/update/" + this.paramsId, formData)
                    .then((res) => {
                        if (res.data.success) {
                            this.$toast.success(res.data.message);
                            this.fetchData();
                            this.$router.push({
                                path: "/subService/list/",
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
