module.exports = ({ env }) => ({
  // ...
  crefinex: {
    enabled: true,
    resolve: "./src/plugins/crefinex",
  },
  email: {
    config: {
      provider: "strapi-provider-email-resend",
      providerOptions: {
        apiKey: env("RESEND_API_KEY"), // Required
      },
      settings: {
        defaultFrom: "noreply@crefinex.com",
        defaultReplyTo: "noreply@crefinex.com",
      },
    },
  },
  upload: {
    config: {
      provider: "cloudinary",
      providerOptions: {
        cloud_name: env("CLOUDINARY_NAME"),
        api_key: env("CLOUDINARY_KEY"),
        api_secret: env("CLOUDINARY_SECRET"),
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },
  graphql: {
    enabled: true,

    config: {
      playgroundAlways: false,
      defaultLimit: 10,
      maxLimit: 20,
      apolloServer: {
        tracing: true,
      },
      shadowCRUD: true,
    },
  },
  "expo-notifications": {
    enabled: false,
  },
});
