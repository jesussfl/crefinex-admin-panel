/**
 * `rate-limit` middleware (settings based on koa 2 documentation)
 */

module.exports =
  (config, { strapi }) =>
  async (ctx, next) => {
    strapi.log.info("In rate-limit middleware.");

    const ratelimit = require("koa2-ratelimit").RateLimit;

    const message = [
      {
        messages: [
          {
            id: "Auth.form.error.ratelimit",
            message: "Too many attempts, please try again in a minute.",
          },
        ],
      },
    ];
    // rate-limit settings for restaurant endpoint
    if (ctx.request.url.toLowerCase().includes("/auth/forgot-password-mobile")) {
      return ratelimit.middleware({
        interval: { min: 1 }, // time where requests are being kept in memory (use milliseconds or time type syntax)
        delayAfter: 10, // after x requests during interval, following requests are slowed down by timeWait amount
        timeWait: { ms: 100 }, // slow down by x miliseconds
        max: 2, // starts blocking after x amount of requests
        // request limit set per path and username when logged in
        // request limit set per path and ip when not logged in
        prefixKey: `1m:${
          ctx.state && ctx.state.user && ctx.state.user.username
            ? ctx.request.path + ":" + ctx.state.user.username.toUpperCase()
            : ctx.request.path + ":" + ctx.request.ip
        }`,
        message,
        ...config,
      })(ctx, next);
    }
  };
