const config = {
  maxStreakDays: 1,
  maxLives: 6,
  regenerationInterval: 14400000,
  job1Rule: "0 0 * * *",
  job2Rule: "* * * * *",
};
const USERS_UID = "plugin::users-permissions.user";

module.exports = {
  checkUserStreaks: {
    task: async ({ strapi }) => {
      const limit = 1;
      let page = 1;
      let users;
      do {
        users = await strapi.entityService.findMany(USERS_UID, {
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

            if (diffDays > config.maxStreakDays) {
              user.streak_days = 0;
              user.streak_start_date = null;
            }

            await strapi.entityService.update(USERS_UID, user.id, { data: user });
          }
        }
        page++;
      } while (users.length === limit);
    },
    options: {
      rule: config.job1Rule || "0 0 * * *", // Execute every day at midnight or use default
    },
  },

  regenerateLives: {
    task: async ({ strapi }) => {
      const limit = 100;
      let page = 1;
      let users;

      strapi.log.info("Checking user next life regeneration dates...");
      do {
        users = await strapi.entityService.findMany(USERS_UID, {
          fields: ["id", "next_life_regeneration", "lives"],
          limit: limit,
          start: (page - 1) * limit,
        });

        for (const user of users) {
          if (user.next_life_regeneration) {
            const nextRegenerationTime = new Date(user.next_life_regeneration);
            const now = new Date();

            if (nextRegenerationTime < now && user.lives === config.maxLives - 1) {
              // Regenerate the user's lives and reset the next regeneration date
              user.next_life_regeneration = null;
              user.lives++;
              await strapi.entityService.update(USERS_UID, user.id, { data: user });
              strapi.io.emit("updateLives", { lives: user.lives, next_life_regeneration: user.next_life_regeneration });

              strapi.log.info(`User ${user.id} has regenerated their lives.`);
            } else if (nextRegenerationTime < now && user.lives < config.maxLives - 1) {
              // If the user has many lost lives, regenerate the user and a new next regeneration date
              user.next_life_regeneration = new Date(new Date().getTime() + config.regenerationInterval);
              user.lives++;
              await strapi.entityService.update(USERS_UID, user.id, { data: user });
              strapi.io.emit("updateLives", { lives: user.lives, next_life_regeneration: user.next_life_regeneration });
              strapi.log.info(`User ${user.id} has regenerated one of their lives.`);
            }
          }
        }
        page++;
      } while (users.length === limit);
    },
    options: {
      rule: config.job2Rule || "*/10 * * * * *", // Execute every 50 seconds or use default
    },
  },
};
