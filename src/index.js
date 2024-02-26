const queryResolvers = require("./plugins/crefinex/server/graphql/resolvers/resolvers.query");
const queriesTypeDefs = require("./plugins/crefinex/server/graphql/typeDefs/queries");
const mutationsTypeDefs = require("./plugins/crefinex/server/graphql/typeDefs/mutations");
const types = require("./plugins/crefinex/server/graphql/typeDefs/types");

const { updateSection } = require("./plugins/crefinex/server/graphql/resolvers/mutations/section.resolvers");
const { updateLesson } = require("./plugins/crefinex/server/graphql/resolvers/mutations/lesson.resolvers");
const { updateExercise } = require("./plugins/crefinex/server/graphql/resolvers/mutations/exercise.resolvers");
const { createOrUpdateCompletedLesson } = require("./plugins/crefinex/server/graphql/resolvers/mutations/completedLesson.resolvers");
const { createOrUpdateCompletedWorld } = require("./plugins/crefinex/server/graphql/resolvers/mutations/completedWorld.resolvers");
const onlineUsers = new Map();
let isEmitting = false;
let sendOnlineUsers;
module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi } */) {
    const extensionService = strapi.plugin("graphql").service("extension");
    const Query = `
    ${queriesTypeDefs}
    ${mutationsTypeDefs}
    ${types}
    
    `;
    extensionService.use(({ strapi }) => ({
      typeDefs: Query,
      resolvers: {
        Query: queryResolvers,
        Mutation: {
          updateSection, // IMPORTANT This should be the new way to include resolvers
          updateLesson,
          updateExercise,
          createOrUpdateCompletedLesson,
          createOrUpdateCompletedWorld,
        },
      },
    }));
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }) {
    process.nextTick(() => {
      var io = require("socket.io")(strapi.server.httpServer, {
        cors: {
          origin: "*",
          methods: ["GET", "POST"],
        },
      });
      io.on("connection", async function (socket) {
        socket.on("join", (data) => {
          const { socketId, name = socketId } = data;
          onlineUsers.set(socketId, name);

          console.log("MOCK SERVER: user joined, online user count:", "socketId: ", socketId, "name: ", name);
        });
        socket.on("broadcast", (broadcast, callback) => {
          console.log("MOCK SERVER: Broadcast ", broadcast);
          io.emit("broadcast", broadcast);
          if (callback) {
            callback({
              ok: true,
            });
          }
        });

        socket.on("disconnect", () => {
          onlineUsers.delete(socket.id);
          console.log("MOCK SERVER: user disconnected, online user count:", onlineUsers.size);
          if (isEmitting && onlineUsers.size === 0) {
            clearInterval(sendOnlineUsers);
            isEmitting = false;
          }
        });

        if (!isEmitting) {
          sendOnlineUsers = setInterval(() => io.emit("online_user", Object.fromEntries(onlineUsers)), 5000);
          isEmitting = true;
        }
      });
      strapi.io = io; // register socket io inside strapi main object to use it globally anywhere
    });
  },
};
