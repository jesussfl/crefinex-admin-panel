const { io } = require("socket.io-client");
const SERVER_URL = "http://localhost:1337";
const socket = io(SERVER_URL);

//  wait until socket connects before adding event listeners
socket.on("connect", () => {
  socket.on("message:update", (data) => {
    console.log(data);
  });
});
const config = {
  maxStreakDays: 1,
  maxLives: 6,
  regenerationInterval: 14400000,
  job1Rule: "0 0 * * *",
  job2Rule: "*/10 * * * * *",
};

module.exports = {
  myJob: {
    task: async ({ strapi }) => {
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

            if (diffDays > config.maxStreakDays) {
              user.streak_days = 0;
              user.streak_start_date = null;
            }

            await strapi.entityService.update(UID, user.id, { data: user });
          }
        }
        page++;
      } while (users.length === limit);
    },
    options: {
      rule: config.job1Rule || "0 0 * * *", // Execute every day at midnight or use default
    },
  },

  myJob2: {
    task: async ({ strapi }) => {
      const UID = "plugin::users-permissions.user";
      const limit = 100;
      let page = 1;
      let users;
      do {
        users = await strapi.entityService.findMany(UID, {
          fields: ["id", "lost_life_date", "lives"],
          limit: limit,
          start: (page - 1) * limit,
        });

        for (const user of users) {
          if (user.lost_life_date) {
            console.log("There is a lost life date");
            const date = new Date(user.lost_life_date);
            const now = new Date();
            const calculatedDate = new Date(date.getTime() + config.regenerationInterval);
            console.log(calculatedDate);
            if (calculatedDate < now && user.lives === config.maxLives - 1) {
              console.log("Regenerating the user's life");
              user.lost_life_date = null;
              user.lives++;
              await strapi.entityService.update(UID, user.id, { data: user });
            } else if (calculatedDate < now && user.lives < config.maxLives - 1) {
              console.log("Regenerating the user's life 2");
              user.lost_life_date = new Date();
              user.lives = user.lives + 1;
              await strapi.entityService.update(UID, user.id, { data: user });
            } else if (user.lives < 6) {
              user.lives++;
              console.log("Regenerating the user's life 3");
              await strapi.entityService.update(UID, user.id, { data: user });
              strapi.io.emit("updateLiveBro", user);
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
