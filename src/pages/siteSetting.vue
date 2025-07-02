<template>
    <div>
        <GlobalBreadCrumbsVue></GlobalBreadCrumbsVue>
        <br />
        <VDivider />
        <VCard>
            <VAlert v-model="isAlertVisible" closable close-label="Close Alert" color="error">
                <ul v-for="(value, key) in errors" :key="key">
                    <li v-for="(value1, key1) in value" :key="key1">-> {{ value1 }}</li>
                </ul>
                {{ value }}
            </VAlert>
            <VForm ref="formSubmit">
                <VCardText>
                    <h3>Update Site Setting</h3>
                    <br />
                    <VRow>
                        <VCol cols="12" md="6">
                            <v-file-input accept="image/*" v-model="logo" label="Logo" ref="file"></v-file-input>
                        </VCol>
                        <VCol cols="12" md="6">
                            <VAvatar size="48">
                                <VImg :src="fetch_photo" />
                            </VAvatar>
                        </VCol>
                        <VCol cols="12" md="4">
                            <AppTextField v-model="insertData.razorpay_key_id" label="Razor Pay Key" />
                        </VCol>
                        <VCol cols="12" md="4">
                            <AppTextField v-model="insertData.razorpay_key_secret" label="Razor Par Key Secret" />
                        </VCol>
                        <VCol cols="12" md="4">
                            <AppTextField v-model="insertData.platform_fee_value" label="Platform Fee Value" />
                        </VCol>
                        <VCol cols="12" md="4">
                            <AppTextField v-model="insertData.cancellation_charges" label="Cancellation Charge" />
                        </VCol>
                        <VCol cols="12" md="4">
                            <AppTextField v-model="insertData.company_name" label="Company Name" />
                        </VCol>
                        <VCol cols="12" md="4">
                            <v-textarea v-model="insertData.address" label="Address" />
                        </VCol>
                        <VCol cols="12" md="4">
                            <AppTextField v-model="insertData.phone" typee="number" label="Phone" />
                        </VCol>
                        <VCol cols="12" md="4">
                            <AppTextField v-model="insertData.email" :rules="[email].flat()" label="Email" />
                        </VCol>
                        <VCol cols="12" md="4">
                            <AppTextField v-model="insertData.about_us" label="About Us" />
                        </VCol>
                        <VCol cols="12" md="4">
                            <AppTextField v-model="insertData.terms_conditions" label="Terms & Conditions" />
                        </VCol>
                        <VCol cols="12" md="4">
                            <AppTextField v-model="insertData.privacy_policy" label="Privacy Policy" />
                        </VCol>
                        <VCol cols="12" md="4">
                            <AppTextField v-model="insertData.refund_policy" label="Refund Policy" />
                        </VCol>
                        <VCol cols="12" md="4">
                            <AppTextField v-model="insertData.support_email" :rules="[email].flat()"
                                label="Support Email" />
                        </VCol>
                        <VCol cols="12" md="4">
                            <AppTextField v-model="insertData.support_phone" typee="number" label="Support Phone" />
                        </VCol>
                        <VCol cols="12" md="4">
                            <AppTextField v-model="insertData.whatsapp_number" typee="number" label="Whatsapp Number" />
                        </VCol>
                        <VCol cols="12" md="4">
                            <AppTextField v-model="insertData.facebook_url" label="Facebook URL" />
                        </VCol>
                        <VCol cols="12" md="4">
                            <AppTextField v-model="insertData.instagram_url" label="Instagram URL" />
                        </VCol>
                        <VCol cols="12" md="4">
                            <AppTextField v-model="insertData.twitter_url" label="Twitter URL" />
                        </VCol>
                        <VCol cols="12" md="4">
                            <AppTextField v-model="insertData.linkedin_url" label="LinkedIn URL" />
                        </VCol>
                        <VCol cols="12" md="4">
                            <AppTextField v-model="insertData.youtube_url" label="Youtube URL" />
                        </VCol>
                        <VCol cols="12" md="4">
                            <AppTextField v-model="insertData.telegram_url" label="Telegram URL" />
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
            globalRequire: [
                (value) => {
                    if (value) return true;
                    return "Required.";
                },
            ],
            email: [
                (v) =>
                    !v ||
                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
                    "Email must be valid",
            ],
            logo: "",
            fetch_photo: "",
            insertData: {
                razorpay_key_id: "",
                razorpay_key_secret: "",
                platform_fee_value: "",
                cancellation_charges: "",
                company_name: "",
                address: "",
                phone: "",
                email: "",
                about_us: "",
                terms_conditions: "",
                privacy_policy: "",
                refund_policy: "",
                support_email: "",
                support_phone: "",
                facebook_url: "",
                instagram_url: "",
                twitter_url: "",
                linkedin_url: "",
                youtube_url: "",
                whatsapp_number: "",
                telegram_url: "",
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
                .get("/site-setting-show")
                .then((res) => {
                    if (res.data.success) {
                        this.insertData.razorpay_key_id = res.data.data.razorpay_key_id;
                        this.insertData.razorpay_key_secret = res.data.data.razorpay_key_secret;
                        this.insertData.platform_fee_value = res.data.data.platform_fee_value;
                        this.insertData.cancellation_charges = res.data.data.cancellation_charges;
                        this.insertData.company_name = res.data.data.address;
                        this.insertData.address = res.data.data.address;
                        this.insertData.phone = res.data.data.phone;
                        this.insertData.email = res.data.data.email;
                        this.insertData.about_us = res.data.data.about_us;
                        this.insertData.terms_conditions = res.data.data.terms_conditions;
                        this.insertData.privacy_policy = res.data.data.privacy_policy;
                        this.insertData.refund_policy = res.data.data.refund_policy;
                        this.insertData.support_email = res.data.data.support_email;
                        this.insertData.support_phone = res.data.data.support_phone;
                        this.insertData.facebook_url = res.data.data.facebook_url;
                        this.insertData.instagram_url = res.data.data.instagram_url;
                        this.insertData.twitter_url = res.data.data.twitter_url;
                        this.insertData.linkedin_url = res.data.data.linkedin_url;
                        this.insertData.youtube_url = res.data.data.youtube_url;
                        this.insertData.whatsapp_number = res.data.data.whatsapp_number;
                        this.insertData.telegram_url = res.data.data.telegram_url;
                        this.fetch_photo = res.data.data.logo;
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
                const formData = new FormData();
                if (this.logo) {
                    const imageData = this.$refs.file.files[0];
                    formData.append("logo", imageData);
                } else {
                    formData.append("logo", "");
                }
                for (let x in this.insertData) {
                    formData.append(x, this.insertData[x]);
                }
                this.loader = true;
                http
                    .post("site-setting/store", formData)
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
