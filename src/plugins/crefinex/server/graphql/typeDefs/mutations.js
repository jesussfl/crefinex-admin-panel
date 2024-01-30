// mutationsTypeDefs.js
const mutations = `
  extend type Mutation {
    createOrUpdateLessonCompleted(user: ID!, lesson: ID!, data: CrefinexLessonCompletedInput): CreateOrUpdateLessonCompleted!
    updateSection(id: ID!, data: CrefinexSectionInput): CrefinexSectionEntity!
    updateLesson(id: ID!, data: CrefinexLessonInput): CrefinexLessonEntity!
    updateExercise(id: ID!, data: CrefinexExerciseInput): CrefinexExerciseEntity!
  }
  


`;

module.exports = mutations;
