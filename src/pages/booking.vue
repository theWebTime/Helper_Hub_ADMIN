<template>
    <VContainer class="d-flex justify-center align-center py-8 px-4" style="min-height: 100vh;">
        <VCard elevation="10" class="pa-6 d-flex flex-column justify-space-between text-center"
            style="width: 100%; max-width: 600px;" rounded="2xl">
            <VCardText>
                <VIcon size="70" color="primary" class="mb-4">mdi-check-circle-outline</VIcon>
                <h2 class="text-h5 font-weight-bold mb-2 text-primary">Thank You for Booking a Demo!</h2>
                <p class="text-body-1 text-grey-darken-2">
                    Our team will contact you shortly. We appreciate your interest and look forward to speaking with
                    you.
                </p>
            </VCardText>

            <!-- Alert for Errors if any -->
            <VAlert v-if="Object.keys(errors).length" v-model="isAlertVisible" closable close-label="Close"
                color="error" class="my-4 text-left" border="start" variant="tonal">
                <ul v-for="(value, key) in errors" :key="key">
                    <li v-for="(value1, key1) in value" :key="key1">→ {{ value1 }}</li>
                </ul>
            </VAlert>

            <!-- Actions -->
            <VCardActions class="justify-center mt-6">
                <VBtn to="/" color="primary" size="large" rounded class="px-6">
                    Go to Login
                </VBtn>
            </VCardActions>
        </VCard>

        <!-- Loader -->
        <VDialog v-model="loader" persistent width="300">
            <VCard class="pa-4" color="primary">
                <VCardText class="text-center white--text">
                    <div class="mb-2">Please wait...</div>
                    <VProgressLinear indeterminate color="white" />
                </VCardText>
            </VCard>
        </VDialog>
    </VContainer>
</template>

<script>
export default {
    data() {
        return {
            loader: false,
            errors: {},
            isAlertVisible: false,
        };
    },
};
</script>

<route lang="yaml">
meta:
  layout: blank
</route>
