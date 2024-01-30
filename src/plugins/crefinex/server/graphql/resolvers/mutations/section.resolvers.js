module.exports = {
  updateSection: async (parent, args) => {
    const data = args.data;
    const UID = "plugin::crefinex.section";

    if (data === undefined) {
      console.log("No data provided");
      return {
        error: "No data provided",
      };
    }

    const section = await strapi.entityService.findOne(UID, args.id);
    if (args.data.order !== undefined) {
      const newOrder = data.order;
      const oldOrder = section.order;

      //This query swaps the values of order for the records with the specified oldOrder and newOrder.
      await strapi.db.connection.raw(`
          UPDATE sections 
          SET \`order\` = 
          CASE
          WHEN \`order\` = ${oldOrder} THEN ${newOrder}
          WHEN \`order\` = ${newOrder} THEN ${oldOrder}
          ELSE \`order\`
          END
          WHERE \`order\` IN (${oldOrder}, ${newOrder})
          `);
    }

    //Important! this should be done after the order swap.
    const updatedSection = await strapi.entityService.update(UID, args.id, {
      populate: ["world"],
      data,
    });

    return updatedSection;
  },
};
