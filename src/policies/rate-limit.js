// ./src/api/location/policies/rate-limit.js
const { errors } = require("@strapi/utils");
const { PolicyError } = errors;

module.exports = async (policyContext, config, { strapi }) => {
  if (policyContext.state.user.isSubscribed) {
    return true;
  } else {
    const user = policyContext.state.user.username;
    throw new PolicyError(`Hi ${user} Please subscribe to view locations`, {
      policy: "rate-limit",
    });
  }
};
