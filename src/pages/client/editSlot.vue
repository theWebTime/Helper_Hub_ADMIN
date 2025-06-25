<template>
    <div>
        <VCard title="Manage Slot Details">
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
                            <AppTextField v-model="insertData.grand_total" label="Total" disabled />
                        </VCol>
                        <VCol cols="12" md="2">
                            <AppTextField v-model="insertData.discount_percentage" label="Discount Percentage" disabled
                                suffix="%" />
                        </VCol>
                        <VCol cols="12" md="2">
                            <AppTextField v-model="insertData.discount_amount" label="Discount Amount" disabled />
                        </VCol>
                        <VCol cols="12" md="2">
                            <AppTextField v-model="insertData.final_total" label="Final Amount" disabled />
                        </VCol>

                    </VRow><br><br>
                    <v-row v-for="(row, index) in rows" :key="index">
                        <v-col cols="12" md="2">
                            <v-text-field v-model="row.slot_name" label="Slot Name" dense />
                        </v-col>

                        <v-col cols="12" md="2">
                            <v-text-field v-model="row.slot_percentage" label="Slot Amount" dense />
                        </v-col>

                        <v-col cols="12" md="2">
                            <VRadioGroup v-model="row.payment" inline label="Payment Received">
                                <VRadio label="Yes" :value="1" density="compact" />
                                <VRadio label="No" :value="0" density="compact" />
                            </VRadioGroup>
                        </v-col>

                        <v-col cols="12" md="2">
                            <v-text-field v-model="row.date" type="date" label="Date" />
                        </v-col>

                        <v-col cols="12" md="2">
                            <v-btn @click="removeSlot(index)" color="red" icon>
                                <v-icon>mdi-delete</v-icon>
                            </v-btn>
                        </v-col>

                        <v-col cols="12" md="2">
                            <IconBtn>
                                <VIcon class="text-primary" :icon="'tabler-download'" @click="downloadPDF" />
                                <VTooltip activator="parent" location="start">
                                    Download Receipt
                                </VTooltip>
                            </IconBtn>
                            |
                            <IconBtn>
                                <VIcon class="text-primary" :icon="'tabler-brand-whatsapp'"
                                    @click="sendReceiptToWhatsapp(row.client_id)" />
                                <VTooltip activator="parent" location="start">
                                    Send Receipt via WhatsApp
                                </VTooltip>
                            </IconBtn>
                        </v-col>
                    </v-row>
                    <v-btn @click="addSlot">Add Row</v-btn>
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
import http from "../../http-common";
export default {
    data() {
        return {
            insertData: {
                grand_total: '',
                discount_percentage: '',
                discount_amount: '',
                final_total: '',
            },
            rows: [], // Array to hold rows data
            paramsId: this.$route.params.id,
            loader: false,
            errors: {},
            isAlertVisible: false,
        };
    },
    created() {
        this.fetchData();
    },
    methods: {
        addSlot() {
            this.rows.push({ slot_name: '', slot_percentage: '', payment: 0, date: '' });
        },
        removeSlot(index) {
            this.rows.splice(index, 1);
        },
        toggleSelection(index, value) {
            if (this.rows[index].payment === value) {
                this.rows[index].payment = 0;
            } else {
                this.rows[index].payment = value;
            }
        },
        async fetchData() {
            this.loader = true;
            try {
                const res = await http.get("/generate-bill/slots-show/" + this.paramsId);

                if (res.data && res.data.data) {
                    // Always assign totals
                    this.insertData.grand_total = res.data.data.grand_total;
                    this.insertData.discount_percentage = res.data.data.discount_percentage || 0;
                    this.insertData.discount_amount = res.data.data.discount_amount || 0;
                    this.insertData.final_total = res.data.data.final_total;

                    // Store client data for later use
                    this.client = res.data.data.client;

                    // Set rows only if slots exist
                    if (res.data.data.slots) {
                        this.rows = res.data.data.slots.map((row) => ({
                            ...row,
                            payment: row.payment === 1 ? 1 : 0,
                            client_id: res.data.data.client.id,
                            client: res.data.data.client
                        }));
                    } else {
                        this.rows = [];
                    }
                }
            } catch (e) {
                console.log(e);
            } finally {
                this.loader = false;
            }
        },

        async updateData() {
            const checkValidation = await this.$refs.formSubmit.validate();
            if (checkValidation.valid) {
                const formData = { slots: this.rows };
                this.loader = true;
                http
                    .post("/generate-bill/slots-update/" + this.paramsId, formData)
                    .then((res) => {
                        if (res.data.success) {
                            this.$router.push({
                                path: "/client/list/",
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

        downloadPDF() {
            this.isLoading = true;
            const clientId = this.paramsId;

            http.get(`/clients/download-receipt/${clientId}`, {
                responseType: 'blob'
            })
                .then(response => {
                    const blob = new Blob([response.data], { type: 'application/pdf' });
                    const link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    link.download = `receipt_${clientId}_${new Date().getTime()}.pdf`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(link.href);
                })
                .catch(error => {
                    console.error('Error downloading receipt:', error);
                    this.$toast.error('Failed to download receipt');
                })
                .finally(() => {
                    this.isLoading = false;
                });
        },

        sendReceiptToWhatsapp(clientId) {
            this.isLoading = true;

            // Find client data (alternative approach)
            const client = this.rows.find(row => row.client_id === clientId) ||
                this.clientData ||
                { client: {} };

            if (!client.client || !client.client.phone_number) {
                this.$toast.error('Client phone number is required');
                this.isLoading = false;
                return;
            }

            let phoneNumber = client.client.phone_number.replace(/\D/g, '');
            if (phoneNumber.length === 10) {
                phoneNumber = '91' + phoneNumber;
            }

            http.get(`/clients/generate-receipt/${clientId}`)
                .then((res) => {
                    if (res.data.success) {
                        const receiptUrl = res.data.url;
                        const clientName = client.client.name || 'there';

                        const message = `Hello ${clientName}, here is your receipt: ${receiptUrl}`;
                        const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

                        window.open(whatsappLink, '_blank');
                    } else {
                        this.$toast.error(res.data.message || 'Failed to generate receipt.');
                    }
                })
                .catch((e) => {
                    console.error(e);
                    this.$toast.error('Failed to generate receipt URL');
                })
                .finally(() => {
                    this.isLoading = false;
                });
        }

        /* downloadPDF() {
            this.isLoading = true;
            const clientId = this.paramsId; // Use the client ID from route params

            http.get(`/clients/download-receipt/${clientId}`, { responseType: 'blob' })
                .then(response => {
                    // Create a blob from the PDF stream
                    const blob = new Blob([response.data], { type: 'application/pdf' });
                    // Create a link element
                    const link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    // Set the filename
                    link.download = `receipt_${clientId}.pdf`;
                    // Append to the DOM
                    document.body.appendChild(link);
                    // Trigger the download
                    link.click();
                    // Clean up
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(link.href);
                })
                .catch(error => {
                    console.error('Error downloading receipt:', error);
                    this.$toast.error('Failed to download receipt');
                })
                .finally(() => {
                    this.isLoading = false;
                });
        },

        sendReceiptToWhatsapp(clientId) {
            this.isLoading = true;

            // Ensure client data is available before using it
            const client = this.rows.find(row => row.client_id === clientId); // Find the client in rows

            if (!client || !client.client || !client.client.name || !client.client.phone_number) {
                this.$toast.error('Client data is missing or incomplete.');
                this.isLoading = false;
                return;
            }

            let phoneNumber = client.client.phone_number || ''; // Get phone number
            phoneNumber = phoneNumber.replace(/\D/g, ''); // Remove non-digits
            if (phoneNumber.length === 10) {
                phoneNumber = '91' + phoneNumber; // Add country code if needed
            }

            // 2. API call to generate receipt PDF and get URL
            http
                .get(`/clients/generate-receipt/${clientId}`)
                .then((res) => {
                    if (res.data.success) {
                        const receiptUrl = res.data.url;

                        // 3. Prepare the WhatsApp message
                        const message = `Hello ${client.client.name}, here is your receipt: ${receiptUrl}`;

                        // Create the WhatsApp link
                        const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

                        // 4. Open the WhatsApp link in a new tab
                        window.open(whatsappLink, '_blank');
                    } else {
                        this.$toast.error(res.data.message || 'Failed to generate receipt.');
                    }
                })
                .catch((e) => {
                    console.error(e);
                    this.$toast.error('Something went wrong while sending receipt.');
                })
                .finally(() => {
                    this.isLoading = false;
                });
        } */
    },
};
</script>
