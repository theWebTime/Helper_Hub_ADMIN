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

const manageUser = {
  title: "User",
  to: { name: "user-list" },
  icon: { icon: "tabler-user" },
};

route.push(manageUser); 

const manageService = {
  title: "Service",
  to: { name: "service-list" },
  icon: { icon: "tabler-category" },
};

route.push(manageService); 

const managePincode = {
  title: "Pincode",
  to: { name: "pincode-list" },
  icon: { icon: "tabler-number-123" },
};

route.push(managePincode); 

const manageUserAddress = {
  title: "User Address",
  to: { name: "userAddress" },
  icon: { icon: "tabler-address-book" },
};

route.push(manageUserAddress); 

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

const manageFaq = {
  title: "FAQ",
  to: null,
  icon: { icon: "tabler-help-hexagon" },
  children: [
    {
      title: "Add",
       to: { name: "faq-add" },
    },
    {
      title: "List",
      to: { name: "faq-list" },
    },
  ],
};

route.push(manageFaq);

const manageTermsCondition = {
  title: "Terms & Condition",
  to: null,
  icon: { icon: "tabler-list" },
  children: [
    {
      title: "Add",
       to: { name: "termsCondition-add" },
    },
    {
      title: "List",
      to: { name: "termsCondition-list" },
    },
  ],
};

route.push(manageTermsCondition);

const manageSiteSetting = {
  title: "Site Setting",
  to: { name: "siteSetting" },
  icon: { icon: "tabler-settings" },
};

route.push(manageSiteSetting); 

export default route;
