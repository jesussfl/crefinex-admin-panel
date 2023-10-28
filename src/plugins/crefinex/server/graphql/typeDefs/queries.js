// queriesTypeDefs.js
const queries = `
  type Query {
    lessonsBySection(id: ID!, start: Int, limit: Int): LessonsBySection!
    sections(start: Int, limit: Int): CrefinexSectionEntityResponseCollection!
    exercisesByLesson(id: ID!, start: Int, limit: Int): ExercisesByLesson!
    sectionsByWorld(id: ID!, start: Int, limit: Int): SectionsByWorld!
    lessonsCompletedByUser(id: ID!, start: Int, limit: Int): LessonsCompletedByUser!
    sectionsCompletedByUser(id: ID!, start: Int, limit: Int): SectionsCompletedByUser!
    worldsCompletedByUser(id: ID!, start: Int, limit: Int): WorldsCompletedByUser!
  }
`;

module.exports = queries;
