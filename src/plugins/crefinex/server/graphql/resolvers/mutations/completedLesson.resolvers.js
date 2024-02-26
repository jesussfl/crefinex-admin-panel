module.exports = {
  createOrUpdateCompletedLesson: async (parent, args, context) => {
    const UID = "plugin::crefinex.lesson-completed";

    const existingCompletedLesson = await strapi.entityService.findMany(UID, {
      filters: {
        user: args.user,
        lesson: args.lesson,
      },
    });

    if (existingCompletedLesson.length > 0) {
      const completedLessonUpdated = await strapi.entityService.update(UID, existingCompletedLesson[0].id, {
        data: args.data,
      });
      console.log(completedLessonUpdated, "completedLessonUpdated");
      return completedLessonUpdated;
    }

    const completedLessonCreated = await strapi.entityService.create(UID, {
      data: args.data,
    });

    console.log(completedLessonCreated, "completedLessonCreated");

    return completedLessonCreated;
  },
};
