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

export default route;
