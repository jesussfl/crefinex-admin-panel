module.exports = {
  // ...
  crefinex: {
    enabled: true,
    resolve: "./src/plugins/crefinex",
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
  // Step 1: Configure the redis connection
  // @see https://github.com/strapi-community/strapi-plugin-redis
  redis: {
    config: {
      connections: {
        default: {
          connection: {
            host: "127.0.0.1",
            port: 6379,
            db: 0,
          },
          settings: {
            debug: false,
          },
        },
      },
    },
  },
  // Step 2: Configure the redis cache plugin
  "rest-cache": {
    config: {
      provider: {
        name: "redis",
        options: {
          max: 32767,
          connection: "default",
        },
      },
      strategy: {
        enableEtagSupport: true,
        logs: true,
        clearRelatedCache: true,
        maxAge: 3600000,
      },
    },
  },
  // ...
  io: {
    enabled: true,
    config: {
      IOServerOptions: {
        cors: { origin: "http://localhost:1337", methods: ["GET"] },
      },
      contentTypes: {
        user: "*",
        lesson: "*",
      },
      events: [
        {
          name: "connection",
          handler: ({ strapi }, socket) => {
            strapi.log.info(`[io] new connection with id ${socket.id}`);
          },
        },
        {
          name: "updateUserLives",
          handler: ({ strapi }, socket) => {
            console.log(socket);
            strapi.log.info(`[io] new user update with ${socket}`);
          },
        },
      ],
    },
  },
};
