module.exports = {
  /**
   * Simple example.
   * Every Monday at 1am.
   */

  myJob: {
    userStreaks: async ({ strapi }) => {
      const UID = "plugin::users-permissions.user";
      const limit = 1;
      let page = 1;
      let users;

      do {
        users = await strapi.entityService.findMany(UID, {
          fields: ["id", "last_completed_lesson_date", "streak_days", "streak_start_date"],
          limit: limit,
          start: (page - 1) * limit,
        });
        for (const user of users) {
          if (user.last_completed_lesson_date) {
            const date = new Date(user.last_completed_lesson_date);
            const now = new Date();
            const diff = Math.abs(date.getTime() - now.getTime());
            const diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24));

            if (diffDays > 1) {
              user.streak_days = 0; // Resetea la racha a 0
              user.streak_start_date = null; // Borra la fecha de inicio de la racha
            } else {
            }

            await strapi.entityService.update(UID, user.id, { data: user });
          }
        }
        page++;
      } while (users.length === limit);
    },
    options: {
      rule: "0 0 * * *", // Se ejecutará a las 00:00 todos los días
    },
  },
};
