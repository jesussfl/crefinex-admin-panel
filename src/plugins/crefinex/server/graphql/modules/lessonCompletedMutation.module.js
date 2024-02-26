// DEPRECATED
const resolvers = {
  createOrUpdateLessonCompleted: {
    resolve: async (parent, args, context) => {
      // Verificar si ya existe una lección completada con la misma lección
      const UID = "plugin::crefinex.lesson-completed";
      const existingLessonCompleted = await strapi.services[UID].find({
        filters: {
          user: args.user,
          lesson: args.lesson,
        },
      });
      console.log("existingLessonCompleted", existingLessonCompleted);
      if (existingLessonCompleted.results.length > 0) {
        // Si ya existe, editar la lección completada existente
        const updatedLessonCompleted = await strapi.services[UID].update(existingLessonCompleted.results[0].id, { data: args.data });

        return { data: updatedLessonCompleted };
      } else {
        // Si no existe, crear una nueva lección completada
        const newLessonCompleted = await strapi.services[UID].create({ data: args.data });

        return { data: newLessonCompleted };
      }
    },
  },
};
module.exports = {
  resolvers,
};
