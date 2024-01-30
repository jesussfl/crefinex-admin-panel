// mutationsTypeDefs.js
const mutations = `
  extend type Mutation {
    createOrUpdateLessonCompleted(user: ID!, lesson: ID!, data: CrefinexLessonCompletedInput): CreateOrUpdateLessonCompleted!
    updateSection(id: ID!, data: CrefinexSectionInput): CrefinexSectionEntity!
    
  }


`;

module.exports = mutations;
