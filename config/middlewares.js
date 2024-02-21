module.exports = [
  "strapi::errors",
  "strapi::security",
  // {
  //   name: "strapi::security",
  //   config: {
  //     contentSecurityPolicy: {
  //       useDefaults: true,
  //       directives: {
  //         "connect-src": ["'self'", "https:", "http:"],
  //         upgradeInsecureRequests: null,
  //       },
  //     },
  //     // header: "*",
  //     // origin: "*",
  //   },
  // },
  {
    name: "strapi::cors",
    config: {
      origin: "*",
      header: "*",
    },
  },
  "strapi::poweredBy",
  "strapi::logger",
  "strapi::query",
  "strapi::body",
  "strapi::session",
  "strapi::favicon",
  "strapi::public",
];
