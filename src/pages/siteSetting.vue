<template>
    <div>
        <GlobalBreadCrumbsVue></GlobalBreadCrumbsVue>
        <br />
        <VDivider />
        <VCard>
            <VForm ref="formSubmit">
                <VCardText>
                    <h3>Update Site Setting</h3>
                    <br />
                    <VRow>
                        <VCol cols="12" md="6">
                            <label class="custom-label">
                                Logo
                            </label>
                            <v-file-input accept="image/*" v-model="logo" ref="file"></v-file-input>
                        </VCol>
                        <VCol cols="12" md="6">
                            <VAvatar size="100">
                                <VImg :src="`${baseUrl}/images/siteSetting/${fetch_photo}`" />
                            </VAvatar>
                        </VCol>
                        <VCol cols="12" md="4">
                            <label class="custom-label">
                                Razor Pay Key <span class="red-asterisk">*</span>
                            </label>
                            <AppTextField v-model="insertData.razorpay_key_id" :rules="[globalRequire].flat()" />
                        </VCol>
                        <VCol cols="12" md="4">
                            <label class="custom-label">
                                Razor Pay Key Secret <span class="red-asterisk">*</span>
                            </label>
                            <AppTextField v-model="insertData.razorpay_key_secret" :rules="[globalRequire].flat()" />
                        </VCol>
                        <VCol cols="12" md="4">
                            <label class="custom-label">
                                Platform Fee <span class="red-asterisk">*</span>
                            </label>
                            <AppTextField v-model="insertData.platform_fee_value" type="number"
                                :rules="[globalRequire].flat()" />
                        </VCol>
                        <VCol cols="12" md="4">
                            <label class="custom-label">
                                Cancellation Charge <span class="red-asterisk">*</span>
                            </label>
                            <AppTextField v-model="insertData.cancellation_charges" type="number"
                                :rules="[globalRequire].flat()" />
                        </VCol>
                        <VCol cols="12" md="4">
                            <label class="custom-label">
                                Company Name <span class="red-asterisk">*</span>
                            </label>
                            <AppTextField v-model="insertData.company_name" :rules="[globalRequire].flat()" />
                        </VCol>
                        <VCol cols="12" md="4">
                            <label class="custom-label">
                                Address <span class="red-asterisk">*</span>
                            </label>
                            <v-textarea v-model="insertData.address" :rules="[globalRequire].flat()" />
                        </VCol>
                        <VCol cols="12" md="4">
                            <label class="custom-label">
                                Phone Number <span class="red-asterisk">*</span>
                            </label>
                            <AppTextField v-model="insertData.phone" :rules="[globalRequire].flat()" type="number" />
                        </VCol>
                        <VCol cols="12" md="4">
                            <label class="custom-label">
                                Email <span class="red-asterisk">*</span>
                            </label>
                            <AppTextField v-model="insertData.email" :rules="[globalRequire, email].flat()" />
                        </VCol>
                        <VCol cols="12" md="4">
                            <label class="custom-label">
                                About US <span class="red-asterisk">*</span>
                            </label>
                            <AppTextField v-model="insertData.about_us" :rules="[globalRequire].flat()" />
                        </VCol>
                        <!-- <VCol cols="12" md="4">
                            <AppTextField v-model="insertData.terms_conditions" label="Terms & Conditions" />
                        </VCol>
                        <VCol cols="12" md="4">
                            <AppTextField v-model="insertData.privacy_policy" label="Privacy Policy" />
                        </VCol> -->
                        <VCol cols="12" md="4">
                            <label class="custom-label">
                                Refund Policy <span class="red-asterisk">*</span>
                            </label>
                            <AppTextField v-model="insertData.refund_policy" :rules="[globalRequire].flat()" />
                        </VCol>
                        <VCol cols="12" md="4">
                            <label class="custom-label">
                                Support Email <span class="red-asterisk">*</span>
                            </label>
                            <AppTextField v-model="insertData.support_email" :rules="[globalRequire, email].flat()" />
                        </VCol>
                        <VCol cols="12" md="4">
                            <label class="custom-label">
                                Support Phone Number <span class="red-asterisk">*</span>
                            </label>
                            <AppTextField v-model="insertData.support_phone" :rules="[globalRequire].flat()"
                                typee="number" />
                        </VCol>
                        <VCol cols="12" md="4">
                            <label class="custom-label">
                                Whatsapp Number <span class="red-asterisk">*</span>
                            </label>
                            <AppTextField v-model="insertData.whatsapp_number" :rules="[globalRequire].flat()"
                                type="number" />
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
import http from "../http-common";
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
            requiredFieldsMeta: [
                { label: 'Razor Key', path: 'razorpay_key_id' },
                { label: 'Razor Secret Key', path: 'razorpay_key_secret' },
                { label: 'Platform Fee', path: 'platform_fee_value' },
                { label: 'Cancellation Charge', path: 'cancellation_charges' },
                { label: 'Company Name', path: 'company_name' },
                { label: 'Address', path: 'address' },
                { label: 'Email', path: 'email' },
                { label: 'Phone', path: 'phone' },
                { label: 'About Us', path: 'about_us' },
                { label: 'Refund Policy', path: 'refund_policy' },
                { label: 'Support Email', path: 'support_email' },
                { label: 'Support Phone Number', path: 'support_phone' },
                { label: 'Whatsapp Number', path: 'whatsapp_number' },
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