const { resolvers: sectionsResolvers } = require("./plugins/crefinex/server/graphql/modules/sections.module");
const { resolvers: lessonsBySectionResolvers } = require("./plugins/crefinex/server/graphql/modules/lessonsBySection");
const { resolvers: exerciseResolvers } = require("./plugins/crefinex/server/graphql/modules/exercise.module");
const { resolvers: lessonsCompletedResolvers } = require("./plugins/crefinex/server/graphql/modules/lessonCompleted.module");
const { resolvers: sectionsCompletedResolvers } = require("./plugins/crefinex/server/graphql/modules/sectionCompleted.module");
const { resolvers: worldsCompletedResolvers } = require("./plugins/crefinex/server/graphql/modules/worldCompleted.module");
const {
  resolvers: lessonsCompletedMutationResolvers,
} = require("./plugins/crefinex/server/graphql/modules/lessonCompletedMutation.module");
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
    type Query {
      lessonsBySection(id:ID!, start:Int, limit:Int): LessonsBySection!
    }
    extend type Query {
      sections(start:Int, limit:Int): CrefinexSectionEntityResponseCollection!
    }
    extend type Query {
      exercisesByLesson(id:ID!, start:Int, limit:Int): ExercisesByLesson!
    }
    extend type Query {
      sectionsByWorld(id:ID!, start:Int, limit:Int): SectionsByWorld!
    }
    extend type Query {
      lessonsCompletedByUser(id:ID!, start:Int, limit:Int): LessonsCompletedByUser!
    }
    extend type Query {
      sectionsCompletedByUser(id:ID!, start:Int, limit:Int): SectionsCompletedByUser!
    }
    extend type Query {
      worldsCompletedByUser(id:ID!, start:Int, limit:Int): WorldsCompletedByUser!
    }
    extend type Mutation {
      createOrUpdateLessonCompleted(user:ID!, lesson:ID!, data:CrefinexLessonCompletedInput): CreateOrUpdateLessonCompleted!
    }
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
    extensionService.use(({ strapi }) => ({
      typeDefs: Query,
      resolvers: {
        Query: {
          ...lessonsBySectionResolvers,
          ...sectionsResolvers,
          ...exerciseResolvers,
          ...lessonsCompletedResolvers,
          ...sectionsCompletedResolvers,
          ...worldsCompletedResolvers,
        },
        Mutation: {
          ...lessonsCompletedMutationResolvers,
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
  bootstrap(/* { strapi } */) {},
};
