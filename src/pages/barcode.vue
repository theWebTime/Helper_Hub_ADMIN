<template>
  <VContainer class="d-flex justify-center align-center px-4 py-10" style="min-height: 100vh;">
    <VCard class="pa-6" elevation="10" max-width="500" width="100%" rounded="2xl">

      <!-- 🎉 Success Title -->
      <VCardTitle class="text-h5 text-primary font-weight-bold text-center mb-4">
        🎉 Registration Successful!
      </VCardTitle>

      <!-- Success Message -->
      <VCardText class="text-center text-body-1 mb-6">
        Please complete the payment using any of the methods below and contact our admin to confirm your payment. <br />
        Once confirmed, your account will be activated and you can log in. <br />
        <strong class="d-block mt-3">Thank you!</strong>
        <div class="text-primary font-weight-bold mt-2 mb-3 text-h6">Contact Here : +91 9662961868</div>
      </VCardText>

      <!-- Payment Info -->
      <VCard class="pa-4 mb-6 bg-grey-lighten-4" flat>
        <!-- Price -->
        <div class="text-subtitle-1 font-weight-medium text-center mb-2">
          <span class="text-decoration-line-through text-grey-darken-1 me-2">₹2499</span>
          <span class="text-h6 text-success">Now ₹1999</span>
        </div>

        <!-- UPI with Copy -->
        <div class="d-flex flex-column flex-sm-row align-center justify-center text-center text-sm-start">
          <div class="me-sm-2 font-weight-bold text-primary">{{ upiId }}</div>
          <VTooltip text="Copy UPI ID">
            <template #activator="{ props }">
              <VIcon v-bind="props" icon="mdi-content-copy" class="cursor-pointer mt-2 mt-sm-0" @click="copyUpiId" />
            </template>
          </VTooltip>
        </div>
      </VCard>

      <!-- Error Alert -->
      <VAlert v-if="isAlertVisible" v-model="isAlertVisible" closable close-label="Close Alert" color="error"
        border="start" variant="tonal" class="mb-6">
        <ul v-for="(value, key) in errors" :key="key" class="pl-2 mb-0">
          <li v-for="(value1, key1) in value" :key="key1">→ {{ value1 }}</li>
        </ul>
      </VAlert>

      <!-- Actions -->
      <VCardActions class="d-flex flex-column flex-sm-row justify-center ga-3 mt-2">
        <VRow>
          <VBtn color="secondary" size="large" rounded class="w-100 w-sm-auto" @click="downloadQRCode">
            📥 Download QR Code
          </VBtn>
          <VBtn to="/" color="primary" size="large" rounded class="w-100 w-sm-auto">
            Go to Login
          </VBtn>
        </VRow>
      </VCardActions>
    </VCard>

    <!-- Loader -->
    <VDialog v-model="loader" persistent width="300">
      <VCard class="pa-3" color="primary">
        <VCardText class="text-center text-white">
          <div class="mb-2">Saving, please wait...</div>
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
      upiId: 'pateldarshak0891-1@okhdfcbank',
    };
  },
  methods: {
    downloadQRCode() {
      const link = document.createElement('a')
      link.href = '/images/payment_scanner.png' // Replace with actual path
      link.download = 'UPI_QR_Code.png'
      link.click()
    },
    copyUpiId() {
      navigator.clipboard.writeText(this.upiId).then(() => {
        this.$toast?.success('UPI ID copied!') || alert('UPI ID copied!')
      }).catch(() => {
        this.$toast?.error('Failed to copy!') || alert('Copy failed!')
      })
    },
  },
};
</script>




<route lang="yaml">
meta:
  layout: blank
</route>

<style scoped>
@media (max-width: 600px) {
  .text-h5 {
    font-size: 1.3rem !important;
  }

  .text-body-1 {
    font-size: 0.95rem !important;
  }
}
</style>
