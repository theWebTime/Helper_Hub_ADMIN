<template>
    <div>
        <GlobalBreadCrumbsVue />

        <VCard title="Add Client Details">
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
                        <!-- Basic Info -->
                        <VCol cols="12" md="4">
                            <AppTextField v-model="insertData.name" :rules="[globalRequire, nameMin, nameMax].flat()"
                                label="Client Name" />
                        </VCol>

                        <VCol cols="12" md="4">
                            <AppTextField v-model="insertData.phone_number"
                                :rules="[globalRequire, numberMin, numberMax].flat()" type="number"
                                label="Phone Number" />
                        </VCol>

                        <VCol cols="12" md="4">
                            <VTextarea v-model="insertData.address" :rules="[globalRequire, nameMin, nameMax].flat()"
                                label="Address" />
                        </VCol>

                        <VCol cols="12" md="4">
                            <AppTextField v-model="insertData.starting_date" :rules="[globalRequire].flat()" type="date"
                                label="Starting Date" />
                        </VCol>

                        <!-- Dropdowns -->
                        <VCol cols="12" md="4">
                            <AppSelect v-model="insertData.particular_function_id"
                                :items="data_fetch_particular_function" :rules="[globalRequire].flat()"
                                item-title="name" item-value="id" label="Select Particular Function" />
                        </VCol>

                        <VCol cols="12" md="4">
                            <AppSelect v-model="insertData.compliment_service_ids"
                                :items="data_fetch_compliment_service" :rules="[globalRequire].flat()" item-title="name"
                                item-value="id" label="Select Compliment Services" multiple chips />
                        </VCol>

                        <!-- Client Functions -->
                        <VCol cols="12">
                            <h3 class="text-lg font-semibold mb-3">Client Functions</h3>

                            <div v-for="(func, index) in insertData.parts" :key="index"
                                class="pa-4 mb-6 border rounded">
                                <VRow dense>
                                    <VCol cols="12" md="4">
                                        <VTextField v-model="func.date" type="date" label="Function Date" required />
                                    </VCol>
                                    <VCol cols="12" md="4">
                                        <VTextField v-model="func.day_label" label="Day Label" required />
                                    </VCol>
                                    <VCol cols="12" md="4">
                                        <VTextField v-model="func.function_name" label="Function Name" required />
                                    </VCol>
                                </VRow>

                                <!-- <div class="ml-2 mt-4">
                                    <h4 class="font-medium mb-2">Categories</h4>
                                    <div v-for="(cat, catIndex) in func.categories" :key="catIndex"
                                        class="d-flex align-center gap-3 mb-3">
                                        <VSelect v-model="cat.category_management_id" :items="data_fetch_categories"
                                            item-title="category_role" item-value="id" label="Category"
                                            class="flex-grow-1" required />
                                        <VTextField v-model="cat.category_quantity" type="number" label="Quantity"
                                            class="w-25" required />
                                        <VBtn icon color="error" variant="text"
                                            @click="removeCategory(index, catIndex)">
                                            <VIcon>mdi-delete</VIcon>
                                        </VBtn>
                                    </div>

                                    <VBtn size="small" color="primary" variant="tonal" @click="addCategory(index)">
                                        + Add Category
                                    </VBtn>
                                </div> -->

                                <!-- Categories per Function -->
                                <div class="ml-2 mt-4">
                                    <h4 class="font-medium mb-2">Categories</h4>
                                    <div v-for="(cat, catIndex) in func.categories" :key="catIndex" class="mb-3">
                                        <!-- Responsive Row (Desktop: Row | Mobile: Column) -->
                                        <v-row>
                                            <!-- Category (Full width on mobile, 8 columns on desktop) -->
                                            <v-col cols="12" sm="8" md="8" lg="8">
                                                <VSelect v-model="cat.category_management_id"
                                                    :items="data_fetch_categories" item-title="category_role"
                                                    item-value="id" label="Category" density="compact" required />
                                            </v-col>

                                            <!-- Quantity (Full width on mobile, 3 columns on desktop) -->
                                            <v-col cols="12" sm="3" md="3" lg="3">
                                                <VTextField v-model="cat.category_quantity" type="number"
                                                    label="Quantity" density="compact" required />
                                            </v-col>

                                            <!-- Delete Button (Fixed width, aligned center) -->
                                            <v-col cols="12" sm="1" md="1" lg="1"
                                                class="d-flex align-center justify-center">
                                                <VBtn icon color="error" variant="text"
                                                    @click="removeCategory(index, catIndex)">
                                                    <VIcon>mdi-delete</VIcon>
                                                </VBtn>
                                            </v-col>
                                        </v-row>
                                    </div>

                                    <VBtn size="small" color="primary" variant="tonal" @click="addCategory(index)">
                                        + Add Category
                                    </VBtn>
                                </div>

                                <div class="text-right mt-4">
                                    <VBtn color="error" variant="outlined" @click="removeFunction(index)"
                                        :disabled="!allowMultipleFunctions && insertData.parts.length === 1">
                                        Remove Function
                                    </VBtn>
                                </div>
                            </div>

                            <VBtn v-if="allowMultipleFunctions || insertData.parts.length === 0" color="success"
                                variant="flat" @click="addFunction">
                                + Add Function
                            </VBtn>
                        </VCol>
                    </VRow>
                </VCardText>

                <VCardText class="d-flex justify-end gap-4">
                    <VBtn color="primary" @click="saveData">Save</VBtn>
                </VCardText>
            </VForm>
        </VCard>

        <!-- Loader -->
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
                name: '',
                phone_number: '',
                address: '',
                starting_date: '',
                particular_function_id: '',
                compliment_service_ids: [],
                parts: [
                    {
                        function_name: '',
                        date: '',
                        day_label: '',
                        categories: [
                            {
                                category_management_id: '',
                                category_quantity: '',
                            },
                        ],
                    },
                ],
            },
            globalRequire: [
                value => !!value || "Required.",
            ],
            nameMin: [
                value => value?.length >= 3 || "Must be at least 3 characters.",
            ],
            nameMax: [
                value => value?.length <= 50 || "Must be no more than 50 characters.",
            ],
            numberMin: [
                value => value?.length >= 10 || "Must be at least 10 characters.",
            ],
            numberMax: [
                value => value?.length <= 10 || "Must be no more than 10 characters.",
            ],
            data_fetch_particular_function: [],
            data_fetch_compliment_service: [],
            data_fetch_categories: [],
            loader: false,
            errors: {},
            isAlertVisible: false,
        };
    },
    created() {
        this.fetch_particularFunction();
        this.fetch_complimentService();
        this.fetch_category();
    },
    computed: {
        allowMultipleFunctions() {
            const selectedFunc = this.data_fetch_particular_function.find(
                f => f.id === this.insertData.particular_function_id
            );
            return selectedFunc ? selectedFunc.is_multiple_days : false;
        }
    },
    watch: {
        'insertData.particular_function_id'(newVal) {
            const selectedFunc = this.data_fetch_particular_function.find(f => f.id === newVal);
            const isMultiple = selectedFunc ? selectedFunc.is_multiple_days : false;

            if (!isMultiple && this.insertData.parts.length > 1) {
                // If switching to single day, keep only the first function
                this.insertData.parts = [this.insertData.parts[0]];
            }

            // Optional: Auto-fill function name from particular function
            /* if (this.insertData.parts.length > 0 && selectedFunc) {
                this.insertData.parts[0].function_name = selectedFunc.name;
            } */
        }
    },
    methods: {
        fetch_particularFunction() {
            http.get("/particular-function-index")
                .then(res => {
                    if (res.data.success) {
                        this.data_fetch_particular_function = res.data.data.map(func => ({
                            ...func,
                            // Ensure is_multiple_days is boolean
                            is_multiple_days: Boolean(func.is_multiple_days)
                        }));
                    }
                });
        },
        fetch_complimentService() {
            http.get("/compliment-service-index")
                .then(res => {
                    if (res.data.success) {
                        this.data_fetch_compliment_service = res.data.data;
                    }
                });
        },
        fetch_category() {
            http.get("/category-index")
                .then(res => {
                    if (res.data.success) {
                        this.data_fetch_categories = res.data.data;
                    }
                });
        },
        addFunction() {
            if (this.allowMultipleFunctions || this.insertData.parts.length === 0) {
                this.insertData.parts.push({
                    id: '',
                    function_name: '',
                    date: '',
                    day_label: '',
                    categories: [{
                        id: '',
                        category_management_id: '',
                        category_quantity: ''
                    }]
                });
            }
        },
        removeFunction(index) {
            this.insertData.parts.splice(index, 1);
        },
        addCategory(funcIndex) {
            this.insertData.parts[funcIndex].categories.push({
                category_management_id: '',
                category_quantity: '',
            });
        },
        removeCategory(funcIndex, catIndex) {
            this.insertData.parts[funcIndex].categories.splice(catIndex, 1);
        },
        async saveData() {
            this.loader = true;
            try {
                // Convert category_quantity to Number before submission
                this.insertData.parts.forEach(part => {
                    part.categories.forEach(cat => {
                        cat.category_quantity = Number(cat.category_quantity);
                    });
                });

                const res = await http.post("/client/store", this.insertData);
                if (res.data.success) {
                    this.$toast.success("Client saved successfully");
                    this.$router.push("/client/list");
                } else {
                    this.$toast.error("Something went wrong");
                }
            } catch (error) {
                if (error.response?.data?.errors) {
                    this.errors = error.response.data.errors;
                    this.isAlertVisible = true;
                } else {
                    this.$toast.error("An unexpected error occurred.");
                }
            } finally {
                this.loader = false;
            }
        }

    },
};
</script>


<style scoped>
.border {
    border: 1px solid #ccc;
}
</style>