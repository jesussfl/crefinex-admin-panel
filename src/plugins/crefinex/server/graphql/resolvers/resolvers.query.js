const { resolvers: sectionsResolvers } = require("../modules/sections.module");
const { resolvers: lessonsBySectionResolvers } = require("../modules/lessonsBySection.module");
const { resolvers: exerciseResolvers } = require("..//modules/exercise.module");
const { resolvers: lessonsCompletedResolvers } = require("../modules/lessonCompleted.module");
const { resolvers: sectionsCompletedResolvers } = require("../modules/sectionCompleted.module");
const { resolvers: worldsCompletedResolvers } = require("../modules/worldCompleted.module");

const queryResolvers = {
  ...sectionsResolvers,
  ...lessonsBySectionResolvers,
  ...exerciseResolvers,
  ...lessonsCompletedResolvers,
  ...sectionsCompletedResolvers,
  ...worldsCompletedResolvers,
};

module.exports = queryResolvers;
