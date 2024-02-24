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
  type UpdateSection {
    data: CrefinexSectionEntity
  }
  extend type UsersPermissionsMe{
    currentWorld: Int 
    money: Float
    lives: Int
    streak_start_date: DateTime
    streak_days: Int
    streak_shields: Int
    last_completed_lesson_date: DateTime
    next_life_regeneration: DateTime
    expoPushToken: String
    first_life_lost_date: DateTime

  }
 extend type UsersPermissionsRegisterInput {
   currentWorld: Int
 }
`;

module.exports = types;
