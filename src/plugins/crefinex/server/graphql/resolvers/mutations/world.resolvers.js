module.exports = {
  updateWorld: async (parent, args) => {
    const data = args.data;
    const UID = "plugin::crefinex.world";

    if (data === undefined) {
      console.log("No data provided");
      return {
        error: "No data provided",
      };
    }

    const world = await strapi.entityService.findOne(UID, args.id);
    if (args.data.order !== undefined) {
      const newOrder = data.order;
      const oldOrder = world.order;

      //This query swaps the values of order for the records with the specified oldOrder and newOrder.
      await strapi.db.connection.raw(
        `UPDATE worlds
        SET \`order\` = \`order\` ${newOrder > oldOrder ? "-" : "+"} 1 
        WHERE \`order\` ${newOrder > oldOrder ? "<=" : ">="} ${newOrder} 
        AND \`order\` ${newOrder > oldOrder ? ">" : "<"} ${oldOrder}
       
        `
      );
    }

    //Important! this should be done after the order swap.
    const updatedWorld = await strapi.entityService.update(UID, args.id, {
      // populate: ["world"],
      data,
    });

    return updatedWorld;
  },
};
