// mutationsTypeDefs.js
const mutations = `
  extend type Mutation {
    createOrUpdateCompletedLesson(user: ID!, lesson: ID!, data: CrefinexLessonCompletedInput): CrefinexLessonCompletedEntity!
    createOrUpdateCompletedWorld(user: ID!, world: ID!, data: CrefinexWorldCompletedInput): CrefinexWorldCompletedEntity!
    updateSection(id: ID!, data: CrefinexSectionInput): CrefinexSectionEntity!
    updateWorld(id: ID!, data: CrefinexWorldInput): CrefinexWorldEntity!
    updateLesson(id: ID!, data: CrefinexLessonInput): CrefinexLessonEntity!
    updateExercise(id: ID!, data: CrefinexExerciseInput): CrefinexExerciseEntity!
  }
  


`;

module.exports = mutations;
