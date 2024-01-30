const queryResolvers = require("./plugins/crefinex/server/graphql/resolvers/resolvers.query");
const queriesTypeDefs = require("./plugins/crefinex/server/graphql/typeDefs/queries");
const mutationsTypeDefs = require("./plugins/crefinex/server/graphql/typeDefs/mutations");
const types = require("./plugins/crefinex/server/graphql/typeDefs/types");

const {
  resolvers: lessonsCompletedMutationResolvers,
} = require("./plugins/crefinex/server/graphql/modules/lessonCompletedMutation.module");
const { updateSection } = require("./plugins/crefinex/server/graphql/resolvers/mutations/section.resolvers");
const { updateLesson } = require("./plugins/crefinex/server/graphql/resolvers/mutations/lesson.resolvers");
const { updateExercise } = require("./plugins/crefinex/server/graphql/resolvers/mutations/exercise.resolvers");
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
          ...lessonsCompletedMutationResolvers,
          updateSection, // IMPORTANT This should be the new way to include resolvers
          updateLesson,
          updateExercise,
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
          origin: "http://172.16.0.2:1337",
          methods: ["GET", "POST"],
        },
      });

      io.on("connection", async function (socket) {
        console.log(`a user connected`);
        // send message on user connection
        socket.emit("hello", { message: "Welcome to my website" });

        // listen for user diconnect
        socket.on("disconnect", () => {
          console.log("a user disconnected");
        });
      });
      strapi.io = io; // register socket io inside strapi main object to use it globally anywhere
    });
  },
};
