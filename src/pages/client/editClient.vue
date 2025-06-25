<template>
    <div>
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
                            :rules="[globalRequire, numberMin, numberMax].flat()" type="number" label="Phone Number" />
                    </VCol>

                    <VCol cols="12" md="4">
                        <VTextarea v-model="insertData.address" :rules="[globalRequire, nameMin, nameMax].flat()"
                            label="Address" />
                    </VCol>

                    <VCol cols="12" md="2">
                        <AppTextField v-model="insertData.starting_date" :rules="[globalRequire].flat()" type="date"
                            label="Starting Date" />
                    </VCol>

                    <!-- Dropdowns -->
                    <VCol cols="12" md="2">
                        <AppSelect v-model="insertData.particular_function_id" :items="data_fetch_particular_function"
                            :rules="[globalRequire].flat()" item-title="name" item-value="id"
                            label="Select Particular Function" />
                    </VCol>

                    <VCol cols="12" md="4">
                        <AppSelect v-model="insertData.compliment_service_ids" :items="data_fetch_compliment_service"
                            :rules="[globalRequire].flat()" item-title="name" item-value="id"
                            label="Select Compliment Services" multiple chips />
                    </VCol>

                    <VCol cols="12" md="2">
                        <AppTextField v-model="insertData.discount_percentage" label="Discount Percentage" suffix="%" />
                    </VCol>

                    <VCol cols="12" md="2">
                        <VRadioGroup v-model="insertData.is_booked" inline label="Client Booked">
                            <VRadio label="Yes" :value="1" density="compact" />
                            <VRadio label="No" :value="0" density="compact" />
                        </VRadioGroup>
                    </VCol>

                    <!-- Client Functions -->
                    <VCol cols="12">
                        <h3 class="text-lg font-semibold mb-3">Client Functions</h3>

                        <div v-for="(func, funcIndex) in insertData.parts" :key="func.id || `new-${funcIndex}`"
                            class="pa-4 mb-6 border rounded">
                            <VRow dense>
                                <VCol cols="12" md="3">
                                    <VTextField v-model="func.date" type="date" label="Function Date"
                                        :rules="[globalRequire].flat()" required />
                                </VCol>

                                <VCol cols="12" md="3">
                                    <VTextField v-model="func.function_time" type="time" label="Function Time" />
                                </VCol>

                                <VCol cols="12" md="3">
                                    <VTextField v-model="func.day_label" label="Day Label"
                                        :rules="[globalRequire].flat()" required />
                                </VCol>
                                <VCol cols="12" md="3">
                                    <VTextField v-model="func.function_name" label="Function Name"
                                        :rules="[globalRequire].flat()" required />
                                </VCol>
                            </VRow>
                            <VRow>


                                <VCol cols="12" md="12">
                                    <VTextarea v-model="func.venue" label="Venue" />
                                </VCol>
                            </VRow>

                            <!-- Categories per Function -->
                            <div class="ml-2 mt-4">
                                <h4 class="font-medium mb-2">Categories</h4>

                                <div v-for="(cat, catIndex) in func.categories" :key="cat.id || `new-${catIndex}`"
                                    class="d-flex flex-wrap align-center gap-3 mb-3">
                                    <VSelect v-model="cat.category_management_id" :items="data_fetch_categories"
                                        item-title="category_role" item-value="id" label="Category"
                                        class="flex-grow-1 min-w-200" :rules="[globalRequire].flat()"
                                        @update:modelValue="onCategoryChange($event, funcIndex, catIndex, func.id)" />

                                    <VTextField v-model="cat.category_quantity" type="number" label="Quantity"
                                        class="flex-shrink-0" style="width: 120px;" :rules="[globalRequire].flat()"
                                        min="1" @input="limitStaffSelection(funcIndex, catIndex)" />

                                    <VSelect v-model="cat.selected_staff_ids" :items="cat.available_staff || []"
                                        item-title="name" item-value="id" label="Select Staff" class="flex-grow-1"
                                        multiple chips :rules="[globalRequire].flat()"
                                        :menu-props="{ maxHeight: '300px' }"
                                        @update:model-value="() => limitStaffSelection(funcIndex, catIndex)" />


                                    <!--  <VSelect v-model="cat.selected_staff_ids" :items="cat.available_staff || []"
                                    item-title="name" item-value="id" label="Select Staff" class="flex-grow-1" multiple
                                    chips :rules="[globalRequire].flat()" required
                                    :menu-props="{ maxHeight: '300px' }" /> -->

                                    <VBtn icon color="error" variant="text" @click="removeCategory(funcIndex, catIndex)"
                                        class="flex-shrink-0">
                                        <VIcon>mdi-delete</VIcon>
                                    </VBtn>
                                </div>

                                <VBtn size="small" color="primary" variant="tonal" @click="addCategory(funcIndex)">
                                    + Add Category
                                </VBtn>
                            </div>

                            <!-- Remove Function Button -->
                            <div class="text-right mt-4">
                                <VBtn color="error" variant="outlined" @click="removeFunction(funcIndex)">
                                    Remove Function
                                </VBtn>
                            </div>
                        </div>

                        <!-- Add Function Button -->
                        <VBtn color="success" variant="flat" @click="addFunction">
                            + Add Function
                        </VBtn>
                    </VCol>
                </VRow>
            </VCardText>

            <VCardText class="d-flex justify-end gap-4">
                <VBtn @click="updateData"> Update </VBtn>
            </VCardText>
        </VForm>
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
            deletedFunctionIds: [],
            deletedCategoryIds: [],
            insertData: {
                name: '',
                phone_number: '',
                address: '',
                starting_date: '',
                particular_function_id: '',
                is_booked: '',
                compliment_service_ids: [],
                discount_percentage: '',
                parts: []
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
                value => value?.length >= 10 || "Must be at least 10 digits.",
            ],
            numberMax: [
                value => value?.length <= 10 || "Must be exactly 10 digits.",
            ],
            data_fetch_particular_function: [],
            data_fetch_compliment_service: [],
            data_fetch_categories: [],
            loader: false,
            errors: {},
            isAlertVisible: false,
            paramsId: this.$route.params.id,
        };
    },
    created() {
        this.fetchData();
        this.fetch_particularFunction();
        this.fetch_complimentService();
        this.fetch_category();
    },
    methods: {
        /* async onCategoryChange(selectedCategoryId, functionIndex, categoryIndex) {
            try {
                const res = await http.get(`/staff-by-category/${selectedCategoryId}`);
                if (res.data.success) {
                    this.insertData.parts[functionIndex].categories[categoryIndex].available_staff = res.data.data;
                    // Reset selected staff when category changes
                    this.insertData.parts[functionIndex].categories[categoryIndex].selected_staff_ids = [];
                }
            } catch (error) {
                console.error('Error fetching staff:', error);
                this.$toast.error('Failed to load staff for this category');
            }
        }, */
        async onCategoryChange(selectedCategoryId, functionIndex, categoryIndex, clientFunctionId) {
            try {
                const res = await http.get(`/available-staff/${selectedCategoryId}/${clientFunctionId}`);
                if (res.data.success) {
                    this.insertData.parts[functionIndex].categories[categoryIndex].available_staff = res.data.data;
                    this.insertData.parts[functionIndex].categories[categoryIndex].selected_staff_ids = [];
                }
            } catch (error) {
                console.error('Error fetching staff:', error);
                // this.$toast.error('Failed to load available staff');
            }
        },

        async fetch_particularFunction() {
            try {
                const res = await http.get("/particular-function-index");
                if (res.data.success) {
                    this.data_fetch_particular_function = res.data.data;
                }
            } catch (error) {
                console.error('Error fetching particular functions:', error);
            }
        },

        async fetch_complimentService() {
            try {
                const res = await http.get("/compliment-service-index");
                if (res.data.success) {
                    this.data_fetch_compliment_service = res.data.data;
                }
            } catch (error) {
                console.error('Error fetching compliment services:', error);
            }
        },

        async fetch_category() {
            try {
                const res = await http.get("/category-index");
                if (res.data.success) {
                    this.data_fetch_categories = res.data.data;
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        },

        addFunction() {
            this.insertData.parts.push({
                id: null,
                date: '',
                day_label: '',
                function_name: '',
                function_time: '',
                venue: '',
                categories: [],
            });
        },

        removeFunction(index) {
            const part = this.insertData.parts[index];
            if (part.id) {
                this.deletedFunctionIds.push(part.id);
            }
            this.insertData.parts.splice(index, 1);
        },

        addCategory(funcIndex) {
            this.insertData.parts[funcIndex].categories.push({
                id: null,
                category_management_id: '',
                category_quantity: '',
                selected_staff_ids: [],
                available_staff: []
            });
        },

        removeCategory(funcIndex, catIndex) {
            const category = this.insertData.parts[funcIndex].categories[catIndex];
            if (category.id) {
                this.deletedCategoryIds.push(category.id);
            }
            this.insertData.parts[funcIndex].categories.splice(catIndex, 1);
        },

        limitStaffSelection(funcIndex, catIndex) {
            const category = this.insertData.parts[funcIndex].categories[catIndex];
            const allowedQty = parseInt(category.category_quantity) || 0;

            if (category.selected_staff_ids?.length > allowedQty) {
                this.$toast.warning(`You can only select ${allowedQty} staff members.`);
                category.selected_staff_ids = category.selected_staff_ids.slice(0, allowedQty);
            }
        },

        async fetchData() {
            try {
                this.loader = true;
                const res = await http.get("/client/show/" + this.paramsId);

                if (res.data.success) {
                    const clientData = res.data.data.client;

                    // Set basic client fields
                    this.insertData = {
                        ...this.insertData,
                        name: clientData.name,
                        phone_number: clientData.phone_number,
                        address: clientData.address,
                        starting_date: clientData.starting_date,
                        is_booked: clientData.is_booked,
                        particular_function_id: clientData.particular_function?.id || '',
                        compliment_service_ids: clientData.compliment_services?.map(s => s.id) || [],
                        discount_percentage: clientData.generate_bill?.discount_percentage || '',
                        parts: []
                    };

                    // Process client functions
                    if (clientData.client_functions?.length) {
                        this.insertData.parts = clientData.client_functions.map(func => {
                            // Initialize variables for time and venue
                            let time = '';
                            let venue = '';

                            // Find the first department with time and venue
                            for (const cat of func.categories || []) {
                                if (cat.organized_departments?.length > 0) {
                                    const dept = cat.organized_departments[0];
                                    time = dept.function_time || '';
                                    venue = dept.venue || '';
                                    break;
                                }
                            }

                            return {
                                id: func.id,
                                function_name: func.function_name,
                                function_time: func.function_time,
                                venue: func.venue,
                                date: func.date,
                                day_label: func.day_label,
                                categories: func.categories.map(cat => {
                                    // Get all staff assignments for this category
                                    //const staffAssignments = cat.organized_departments
                                    //    ?.filter(dept => dept.staff_management)
                                    //   ?.map(dept => dept.staff_management.id) || [];

                                    return {
                                        id: cat.id,
                                        category_management_id: cat.category_management_id,
                                        category_quantity: cat.category_quantity,
                                        selected_staff_ids: cat.selected_staff_ids,
                                        available_staff: []
                                    };
                                })
                            };
                        });

                        // Now fetch available staff for each category
                        for (let funcIndex = 0; funcIndex < this.insertData.parts.length; funcIndex++) {
                            const func = this.insertData.parts[funcIndex];

                            for (let catIndex = 0; catIndex < func.categories.length; catIndex++) {
                                const cat = func.categories[catIndex];

                                if (cat.category_management_id) {
                                    try {
                                        const staffRes = await http.get(`/available-staff/${cat.category_management_id}/${func.id}`);
                                        if (staffRes.data.success) {
                                            this.insertData.parts[funcIndex].categories[catIndex].available_staff = staffRes.data.data;

                                            const availableStaffIds = staffRes.data.data.map(s => s.id);
                                            this.insertData.parts[funcIndex].categories[catIndex].selected_staff_ids =
                                                cat.selected_staff_ids.filter(id => availableStaffIds.includes(id));
                                        }
                                    } catch (error) {
                                        console.error(`Error fetching staff for category ${cat.category_management_id}:`, error);
                                    }
                                }

                                /*  if (cat.category_management_id) {
                                     try {
                                         // Fetch available staff for this category
                                         const staffRes = await http.get(`/staff-by-category/${cat.category_management_id}`);
                                         if (staffRes.data.success) {
                                             // Update available staff
                                             this.insertData.parts[funcIndex].categories[catIndex].available_staff = staffRes.data.data;
 
                                             // Ensure selected staff IDs are from the available staff
                                             const availableStaffIds = staffRes.data.data.map(s => s.id);
                                             this.insertData.parts[funcIndex].categories[catIndex].selected_staff_ids =
                                                 cat.selected_staff_ids.filter(id => availableStaffIds.includes(id));
                                         }
                                     } catch (error) {
                                         console.error(`Error fetching staff for category ${cat.category_management_id}:`, error);
                                     }
                                 } */
                            }
                        }
                    }

                    // Add empty function if none exist
                    if (this.insertData.parts.length === 0) {
                        this.addFunction();
                    }
                }
            } catch (e) {
                console.error("Error fetching data", e);
                this.$toast.error("Failed to load client data");
            } finally {
                this.loader = false;
            }
        },

        async updateData() {
            const isValid = await this.$refs.formSubmit.validate();
            if (!isValid.valid) {
                this.$toast.warning("Please fill all required fields correctly");
                return;
            }

            this.loader = true;

            try {
                // Prepare the payload
                const payload = {
                    ...this.insertData,
                    deleted_function_ids: this.deletedFunctionIds,
                    deleted_category_ids: this.deletedCategoryIds,
                    parts: this.insertData.parts.map(part => ({
                        ...part,
                        categories: part.categories.map(cat => ({
                            ...cat,
                            selected_staff_ids: cat.selected_staff_ids || []
                        }))
                    }))
                };

                const res = await http.post("client/update/" + this.paramsId, payload);

                if (res.data.success) {
                    this.$toast.success(res.data.message);
                    this.deletedFunctionIds = [];
                    this.deletedCategoryIds = [];
                    // this.$router.push("/client/list/");
                    this.$router.push({
                        path: "/client/list/",
                    });
                    this.isAlertVisible = false;
                    // this.fetchData();
                } else {
                    this.$toast.error(res.data.message || "Update failed");
                }
            } catch (e) {
                console.error("Update error:", e);
                if (e.response?.data?.errors) {
                    this.errors = e.response.data.errors;
                    this.isAlertVisible = true;
                }
                this.$toast.error(e.response?.data?.message || "Update failed");
            } finally {
                this.loader = false;
            }
        },
    },
};
</script>