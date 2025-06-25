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

if (auth.role == 1) {

/*  const manageAdminDashbaord = {
    title: "Dashboard",
    to: { name: "adminDashboard" },
    icon: { icon: "tabler-smart-home" },
  };
  route.push(manageAdminDashbaord); */

  const manageUser = {
    title: "User",
    to: null,
    icon: { icon: "tabler-user" },
    children: [
      {
        title: "Add",
        to: { name: "user-add" },
      },
      {
        title: "List",
        to: { name: "user-list" },
      },
    ],
  };

  route.push(manageUser);
  
  const manageBookDemo = {
    title: "Booking For Demo",
    to: null,
    icon: { icon: "tabler-user" },
    children: [
      {
        title: "List Of Booking Demo",
        to: { name: "demo-list" },
      },
    ],
  };
  
  route.push(manageBookDemo);
} 

if (auth.role == 2) {

/*   */
  const manageCategory = {
    title: "Category",
    to: null,
    icon: { icon: "tabler-category" },
    children: [
      {
        title: "Add",
        to: { name: "category-add" },
      },
      {
        title: "List",
        to: { name: "category-list" },
      },
    ],
  };

  route.push(manageCategory);

  const manageTeam = {
    title: "Team",
    to: null,
    icon: { icon: "tabler-users-group" },
    children: [
      {
        title: "Add",
        to: { name: "team-add" },
      },
      {
        title: "List",
        to: { name: "team-list" },
      },
    ],
  };

  route.push(manageTeam);

  const manageParticularFunction = {
    title: "Particular Function",
    to: null,
    icon: { icon: "tabler-circle-dotted-letter-f" },
    children: [
      {
        title: "Add",
        to: { name: "particularFunction-add" },
      },
      {
        title: "List",
        to: { name: "particularFunction-list" },
      },
    ],
  };

  route.push(manageParticularFunction);

  const manageComplimentService = {
    title: "Compliment Service",
    to: null,
    icon: { icon: "tabler-list-details" },
    children: [
      {
        title: "Add",
        to: { name: "complimentService-add" },
      },
      {
        title: "List",
        to: { name: "complimentService-list" },
      },
    ],
  };

  route.push(manageComplimentService);

  const manageClient = {
    title: "Client Management",
    to: null,
    icon: { icon: "tabler-user" },
    children: [
      {
        title: "Add",
        to: { name: "client-add" },
      },
      {
        title: "List",
        to: { name: "client-list" },
      },
    ],
  };

  route.push(manageClient);

  const manageExternalService = {
    title: "External Service",
    to: null,
    icon: { icon: "tabler-list-numbers" },
    children: [
      {
        title: "Add",
        to: { name: "externalService-add" },
      },
      {
        title: "List",
        to: { name: "externalService-list" },
      },
    ],
  };

  route.push(manageExternalService);

  const manageYourStory = {
    title: "Your Story",
    to: { name: "yourStory" },
    icon: { icon: "tabler-photo" },
  };
  route.push(manageYourStory);

  const manageOrganizeTeam = {
    title: "Organized Team",
    to: { name: "organizeTeam" },
    icon: { icon: "tabler-sitemap" },
  };
  route.push(manageOrganizeTeam);

  const managePrivacyPolicy = {
    title: "Privacy Policy",
    to: { name: "privacyPolicy" },
    icon: { icon: "tabler-file-description" },
  };
  route.push(managePrivacyPolicy);

  const manageBokedClient = {
    title: "Booked Client",
    to: { name: "bookedClient" },
    icon: { icon: "tabler-bookmark" },
  };
  route.push(manageBokedClient);
} 

  /* var manageConference = {
    title: "Conference",
    to: null,
    icon: { icon: "tabler-user" },
    children: [
      {
        title: "Add",
        to: { name: "conference-add" },
      },
      {
        title: "List",
        to: { name: "conference-list" },
      },
    ],
  }; */

/* const manageUserContactUs = {
  title: "User Contact Us",
  to: { name: "userContactUs" },
  icon: { icon: "tabler-smart-home" },
};

route.push(manageUserContactUs);

const manageContactUs = {
  title: "Domain Contact Us",
  to: { name: "domainContactUs" },
  icon: { icon: "tabler-smart-home" },
};

route.push(manageContactUs);

const manageSubmitAbstract = {
  title: "Submit Abstract",
  to: { name: "submitAbstract" },
  icon: { icon: "tabler-smart-home" },
};

route.push(manageSubmitAbstract);

const manageRegister = {
  title: "Register",
  to: { name: "register" },
  icon: { icon: "tabler-smart-home" },
};

route.push(manageRegister);

const managePayment = {
  title: "Payment",
  to: { name: "payment" },
  icon: { icon: "tabler-smart-home" },
};

route.push(managePayment); */

/* if (auth.role == 1) {
  const manageConferenceTag = {
    title: "Conference Tag",
    to: null,
    icon: { icon: "tabler-user" },
    children: [
      {
        title: "Add",
        to: { name: "conferenceTag-add" },
      },
      {
        title: "List",
        to: { name: "conferenceTag-list" },
      },
    ],
  };

  route.push(manageConferenceTag);

  const manageConferenceType = {
    title: "Conference Type",
    to: null,
    icon: { icon: "tabler-user" },
    children: [
      {
        title: "Add",
        to: { name: "conferenceType-add" },
      },
      {
        title: "List",
        to: { name: "conferenceType-list" },
      },
    ],
  };

  route.push(manageConferenceType);
  const manageSiteSetting = {
    title: "Site Setting",
    to: { name: "siteSetting" },
    icon: { icon: "tabler-settings" },
  };
  route.push(manageSiteSetting);

  const manageAboutUs = {
    title: "About Us",
    to: { name: "aboutUs" },
    icon: { icon: "tabler-info-circle" },
  };
  route.push(manageAboutUs);



  const manageGallery = {
    title: "Gallery",
    to: null,
    icon: { icon: "tabler-photo" },
    children: [
      {
        title: "Add",
        to: { name: "gallery-add" },
      },
      {
        title: "List",
        to: { name: "gallery-list" },
      },
    ],
  };
  route.push(manageGallery);
} */

export default route;
