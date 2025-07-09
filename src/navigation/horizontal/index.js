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
  title: "Sub Service Name",
  to: { name: "subServiceTypeName" },
  icon: { icon: "tabler-list-details" },
};

route.push(manageSubServiceTypeName);

const manageSubServiceTypeDetail = {
  title: "Sub Service Detail",
  to: null,
  icon: { icon: "tabler-book" },
  children: [
    {
      title: "Add",
      to: { name: "subServiceTypeDetail-add" },
    },
    {
      title: "List",
      to: { name: "subServiceTypeDetail-list" },
    },
  ],
};

route.push(manageSubServiceTypeDetail);

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

route.push(manageUserAddress); 

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

const manageSiteSetting = {
  title: "Site Setting",
  to: { name: "siteSetting" },
  icon: { icon: "tabler-settings" },
};

route.push(manageSiteSetting); 

const manageUserAddress = {
  title: "User Address",
  to: { name: "userAddress" },
  icon: { icon: "tabler-address-book" },
};

export default route;
