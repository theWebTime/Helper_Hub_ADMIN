import router from "@/router";
import ls from "localstorage-slim";

const auth = ls.get("user-info", { decrypt: true });
if (!auth) {
  router.push("/");
}

var route = [
    {
      title: "Dashboard",
      to: { name: "dashboard" },
      icon: { icon: "tabler-smart-home" },
    },
  ];

const managePrivacyPolicy = {
  title: "Privacy Policy",
  to: null,
  icon: { icon: "tabler-clipboard-text" },
  children: [
    {
      title: "Add",
       to: { name: "privacyPolicy-add" },
    },
    {
      title: "List",
      to: { name: "privacyPolicy-list" },
    },
  ],
};

route.push(managePrivacyPolicy);

export default route;
