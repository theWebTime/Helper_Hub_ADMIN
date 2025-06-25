<script setup>
import qh12 from "@images/avatars/qh12.png";
</script>

<template>
  <VBadge dot location="bottom right" offset-x="3" offset-y="3" bordered color="success">
    <VAvatar class="cursor-pointer" color="primary" variant="tonal">
      <!-- <VAvatar size="48" v-if="fetch_photo">
        <VImg :src="fetch_photo" />
      </VAvatar> -->
      <VAvatar size="48">
        <VImg :src="qh12" />
      </VAvatar>
      <!-- SECTION Menu -->
      <VMenu activator="parent" width="230" location="bottom end" offset="14px">
        <VList>
          <!-- 👉 User Avatar & Name -->
          <VListItem>
            <template #prepend>
              <VListItemAction start>
                <VBadge dot location="bottom right" offset-x="3" offset-y="3" color="success">
                  <!-- <VAvatar color="primary" variant="tonal" v-if="fetch_photo">
                    <VImg :src="fetch_photo" />
                  </VAvatar> -->
                  <VAvatar color="primary" variant="tonal">
                    <VImg :src="qh12" />
                  </VAvatar>
                </VBadge>
              </VListItemAction>
            </template>

            <VListItemTitle class="font-weight-semibold">
              {{ userData.name }}
            </VListItemTitle>
            <!-- <VListItemSubtitle>Admin</VListItemSubtitle> -->
          </VListItem>

          <VDivider class="my-2" />

          <!-- 👉 Profile -->
          <VListItem>
            <template #prepend>
              <VIcon class="me-2" icon="tabler-user" size="22" />
            </template>
            <router-link :to="'/profile'">
              <VListItemTitle> Profile </VListItemTitle>
            </router-link>
          </VListItem>

          <!-- 👉 Settings -->
          <!-- <VListItem link>
            <template #prepend>
              <VIcon class="me-2" icon="tabler-settings" size="22" />
            </template>

            <VListItemTitle>Settings</VListItemTitle>
          </VListItem> -->

          <!-- 👉 Pricing -->
          <!-- <VListItem link>
            <template #prepend>
              <VIcon class="me-2" icon="tabler-currency-dollar" size="22" />
            </template>

            <VListItemTitle>Pricing</VListItemTitle>
          </VListItem> -->

          <!-- 👉 FAQ -->
          <!-- <VListItem link>
            <template #prepend>
              <VIcon class="me-2" icon="tabler-help" size="22" />
            </template>

            <VListItemTitle>FAQ</VListItemTitle>
          </VListItem> -->

          <!-- Divider -->
          <VDivider class="my-2" />

          <!-- 👉 Logout -->
          <VListItem @click="logoutFunction()">
            <template #prepend>
              <VIcon class="me-2" icon="tabler-logout" size="22" />
            </template>

            <VListItemTitle>Logout</VListItemTitle>
          </VListItem>
        </VList>
      </VMenu>
      <!-- !SECTION -->
    </VAvatar>
  </VBadge>
</template>

<script>
import ls from "localstorage-slim";
import http from "../../http-common";
export default {
  data() {
    return {
      userData: ls.get("user-info", { decrypt: true }),
      fetch_photo: "",
      photo: "",
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.loader = true;
      http
        .get("/profile")
        .then((res) => {
          if (res.data.success) {
            const resData = res.data.data;
            this.fetch_photo = resData.image;
          }
          this.loader = false;
        })
        .catch((e) => {
          this.loader = false;
          console.log(e);
        });
    },
    logoutFunction() {
      http
        .post("/logout")
        .then((res) => {
          if (res.data.success) {
            this.$store.commit("logout");
            this.$router.push({ name: "index" });
          } else {
            // this.isError = true;
          }
        })
        .catch((e) => { });
    },
  },
};
</script>
