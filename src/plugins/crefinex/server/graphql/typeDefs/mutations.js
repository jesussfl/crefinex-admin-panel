// mutationsTypeDefs.js
const mutations = `
  extend type Mutation {
    createOrUpdateLessonCompleted(user: ID!, lesson: ID!, data: CrefinexLessonCompletedInput): CreateOrUpdateLessonCompleted!
  }
`;

module.exports = mutations;
