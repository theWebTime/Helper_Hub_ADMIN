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

const managePincode = {
  title: "Pincode",
  to: { name: "pincode-list" },
  icon: { icon: "tabler-number-123" },
};

route.push(managePincode); 

const manageService = {
  title: "Service",
  to: { name: "service-list" },
  icon: { icon: "tabler-category" },
};

route.push(manageService); 

const manageSubServiceTypeName = {
  title: "Sub Service Types",
  to: { name: "subServiceTypeName" },
  icon: { icon: "tabler-list-details" },
};

route.push(manageSubServiceTypeName); 

const manageSubServicePricing = {
  title: "Sub Service Pricing",
  to: null,
  icon: { icon: "tabler-currency-rupee" },
  children: [
    {
      title: "Add",
      to: { name: "subServicePricing-add" },
    },
    {
      title: "List",
      to: { name: "subServicePricing-list" },
    },
  ],
};

route.push(manageSubServicePricing);

const manageSubService = {
  title: "Sub Service",
  to: null,
  icon: { icon: "tabler-category-plus" },
  children: [
    {
      title: "Add",
       to: { name: "subService-add" },
    },
    {
      title: "List",
      to: { name: "subService-list" },
    },
  ],
};

route.push(manageSubService);

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

const managePrivacyPolicy = {
  title: "Privacy Policy",
  to: null,
  icon: { icon: "tabler-list-check" },
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

const manageTermsCondition = {
  title: "Terms & Condition",
  to: null,
  icon: { icon: "tabler-list-numbers" },
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

const manageUserAddress = {
  title: "User Address",
  to: { name: "userAddress" },
  icon: { icon: "tabler-address-book" },
};

route.push(manageUserAddress);

const manageContactUs = {
  title: "Contact Us",
  to: { name: "contactUs" },
  icon: { icon: "tabler-article" },
};

route.push(manageContactUs); 

const manageSiteSetting = {
  title: "Site Setting",
  to: { name: "siteSetting" },
  icon: { icon: "tabler-settings" },
};

route.push(manageSiteSetting); 

export default route;
