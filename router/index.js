const nginxApi = "/api";
const router = require("koa-router")();
// login
const User = require("../controller/user");
router.post("/user/login", User.login);
router.post("/user/register", User.register);
router.get("/user/loginout", User.loginOut);
// blog
const Blog = require("../controller/blog");
router.get(`${nginxApi}/blog/list`, Blog.list);
router.post(`${nginxApi}/blog/create`, Blog.create);
router.post(`${nginxApi}/blog/destroy`, Blog.destroy);
router.get(`${nginxApi}/blog/details`, Blog.details);
router.post(`${nginxApi}/blog/update`, Blog.update);

// 404
router.get("/404", (ctx, next) => {
  ctx.body = {
    status: "404",
    msg: "Page Not Found",
  };
});

module.exports = router;
