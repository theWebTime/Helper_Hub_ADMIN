<template>
    <VContainer class="d-flex justify-center align-center py-10 px-4" style="min-height: 100vh;">
        <VCard class="pa-6" elevation="10" max-width="1000" width="100%" rounded="xl">
            <div class="d-flex justify-center mb-4">
                <!-- <VNodeRenderer :nodes="themeConfig.app.logo" /> -->
                <!-- OR use <img> if you have a static image like: -->
                <img src="@/assets/images/Quotation_Hub.png" alt="Logo" height="200" width="200" />
            </div>
            <VCardTitle class="text-h5 font-weight-bold text-primary mb-6 text-center">
                For More Inquiry
            </VCardTitle>

            <!-- Alert -->
            <VAlert v-if="Object.keys(errors).length" v-model="isAlertVisible" closable close-label="Close Alert"
                color="error" class="mb-6" border="start" variant="tonal">
                <ul class="ma-0 pl-4">
                    <li v-for="(messages, field) in errors" :key="field">
                        <span v-for="(message, idx) in messages" :key="idx">→ {{ message }}</span>
                    </li>
                </ul>
            </VAlert>

            <VForm ref="formSubmit">
                <VCardText>
                    <VRow dense>
                        <VCol cols="12" sm="6" md="4">
                            <AppTextField v-model="insertData.name" label="Full Name"
                                :rules="[globalRequire, nameMin, nameMax].flat()" />
                        </VCol>

                        <VCol cols="12" sm="6" md="4">
                            <AppTextField v-model="insertData.phone_number" label="Phone Number" type="tel"
                                :rules="[globalRequire, numberMin, numberMax].flat()" />
                        </VCol>

                        <VCol cols="12" sm="6" md="4">
                            <AppTextField v-model="insertData.email" label="Email Address"
                                :rules="[email, globalRequire].flat()" />
                        </VCol>
                    </VRow>

                    <!-- Buttons -->
                    <div class="d-flex justify-end mt-8 flex-wrap gap-4">
                        <VBtn color="primary" size="large" rounded @click="saveData">
                            Save
                        </VBtn>
                        <VBtn to="/" color="secondary" size="large" variant="outlined" rounded>
                            Login
                        </VBtn>
                    </div>
                </VCardText>
            </VForm>
        </VCard>

        <!-- Loader -->
        <VDialog v-model="loader" persistent width="300">
            <VCard class="pa-4" color="primary">
                <VCardText class="text-center white--text">
                    <div class="mb-2">Saving, please wait...</div>
                    <VProgressLinear indeterminate color="white" />
                </VCardText>
            </VCard>
        </VDialog>
    </VContainer>
</template>

<script>
import http from "../http-common";

export default {
    data() {
        return {
            insertData: {
                name: "",
                phone_number: "",
                email: "",
            },
            loader: false,
            errors: {},
            isAlertVisible: false,

            globalRequire: [
                (value) => !!value || "Required.",
            ],
            nameMin: [
                (value) => value?.length >= 3 || "Name must be at least 3 characters.",
            ],
            nameMax: [
                (value) => value?.length <= 50 || "Name must be less than 50 characters.",
            ],
            email: [
                (v) =>
                    !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || "Enter a valid email.",
            ],
            numberMin: [
                (value) => value?.length >= 10 || "Phone must be 10 digits.",
            ],
            numberMax: [
                (value) => value?.length <= 10 || "Phone must be 10 digits.",
            ],
        };
    },
    methods: {
        async saveData() {
            const validation = await this.$refs.formSubmit.validate();
            if (!validation.valid) return;

            this.loader = true;
            http
                .post("/booking-store", this.insertData)
                .then((res) => {
                    this.loader = false;
                    if (res.data.success) {
                        this.$router.push({ path: "/booking" });
                        this.$toast.success(res.data.message);
                        this.isAlertVisible = false;
                    } else {
                        this.$toast.error(res.data.message);
                        this.errors = res.data.data || {};
                        this.isAlertVisible = true;
                    }
                })
                .catch((error) => {
                    this.loader = false;
                    this.errors = { error: ["Something went wrong. Please try again."] };
                    this.isAlertVisible = true;
                    console.error(error);
                });
        },
    },
};
</script>

<route lang="yaml">
meta:
  layout: blank
</route>

<style scoped>
ul {
    padding-left: 1rem;
}
</style>
