<template>
  <VCard class="mb-6">
    <v-breadcrumbs class="text-uppercase" :items="items">
      <template v-slot:divider>
        <v-icon icon="mdi-chevron-right"></v-icon>
      </template>
    </v-breadcrumbs>
  </VCard>
</template>

<script>
export default {
  data() {
    return {
      items: "",
    };
  },
  created() {
    let pathArray = this.$route.path.split("/");
    this.items = pathArray.slice(1, pathArray.length);
  },
};
</script>
