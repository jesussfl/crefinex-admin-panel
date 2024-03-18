module.exports = ({ env }) => [
  "strapi::errors",
  {
    name: "strapi::security",
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          "connect-src": ["'self'", "https:"],
          "img-src": ["'self'", "data:", "blob:", "market-assets.strapi.io", "res.cloudinary.com"],
          "media-src": ["'self'", "data:", "blob:", "market-assets.strapi.io", "res.cloudinary.com"],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
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
