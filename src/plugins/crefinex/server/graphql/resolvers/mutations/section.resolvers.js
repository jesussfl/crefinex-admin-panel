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

      //Refactor this code to order

      await strapi.db.connection.raw(
        `UPDATE sections
        SET \`order\` = \`order\` ${newOrder > oldOrder ? "-" : "+"} 1 
        WHERE \`order\` ${newOrder > oldOrder ? "<=" : ">="} ${newOrder} 
        AND \`order\` ${newOrder > oldOrder ? ">" : "<"} ${oldOrder}
       
        `
      );
    }

    //Important! this should be done after the order swap.
    const updatedSection = await strapi.entityService.update(UID, args.id, {
      populate: ["world"],
      data,
    });

    return updatedSection;
  },
};
