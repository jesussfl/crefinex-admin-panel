module.exports = {
  updateExercise: async (parent, args, context) => {
    const data = args.data;
    const UID = "plugin::crefinex.exercise";

    if (data === undefined) {
      console.log("No data provided");
      return {
        error: "No data provided",
      };
    }

    const exercise = await strapi.entityService.findOne(UID, args.id);
    if (args.data.order !== undefined) {
      const newOrder = data.order;
      const oldOrder = exercise.order;

      //This query swaps the values of order for the records with the specified oldOrder and newOrder.
      await strapi.db.connection.raw(`
                UPDATE exercises 
                SET \`order\` = 
                CASE
                WHEN \`order\` = ${oldOrder} THEN ${newOrder}
                WHEN \`order\` = ${newOrder} THEN ${oldOrder}
                ELSE \`order\`
                END
                WHERE \`order\` IN (${oldOrder}, ${newOrder})
                `);
    }

    //IMPORTANT this should be done after the order swap.
    const updatedSection = await strapi.entityService.update(UID, args.id, {
      populate: ["lesson"],
      data,
    });

    return updatedSection;
  },
};
