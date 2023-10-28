// types.js
const types = `
type LessonsBySection {
    lessons: [CrefinexLessonEntity]
    pagination: Pagination
    section: CrefinexSection
  }
  type ExercisesByLesson {
    exercises: [CrefinexExerciseEntity]
    pagination: Pagination
    lesson: CrefinexLesson
  }
  type SectionsByWorld {
    sections: [CrefinexSectionEntity]
    pagination: Pagination
    world: CrefinexWorld
  }
  type LessonsCompletedByUser {
    lessonsCompleted: [CrefinexLessonCompletedEntity]
    pagination: Pagination
  }
  type SectionsCompletedByUser {
    sectionsCompleted: [CrefinexSectionCompletedEntity]
    pagination: Pagination
  }
  type WorldsCompletedByUser {
    worldsCompleted: [CrefinexWorldCompletedEntity]
    pagination: Pagination
  }
  type CreateOrUpdateLessonCompleted {
    data: CrefinexLessonCompletedEntity
  }
`;

module.exports = types;
