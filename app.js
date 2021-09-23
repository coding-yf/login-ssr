const Koa = require("koa");
const app = new Koa();
const router = require("./router/index");
const bodyParser = require("koa-bodyparser");
const User = require("./model/user");
app.use(bodyParser());

// 权限
// 引入jwt token工具
const JwtUtil = require("./utils/jwt");
const passUrl = ["/user/login", "/user/register", "/404", "/user/loginout"];
app.use(async (ctx, next) => {
  // 我这里知识把登陆和注册请求去掉了，其他的多有请求都需要进行token校验
  if (!~passUrl.findIndex((item) => ctx.request.url === item)) {
    const token = ctx.headers.token;
    if (!token) {
      ctx.body = { status: 403, msg: "token不能为空" };
    }
    const jwt = new JwtUtil(token);
    const result = jwt.verifyToken();
    console.log("app:" + result);

    // 如果考验通过就next，否则就返回登陆信息不正确
    if (result == "err" || !result) {
      ctx.body = { status: 403, msg: "登录已过期,请重新登录" };
      return false;
    } else {
      // 可解析出用户id
      console.log(result);
      // 查询Id 再验证token
      const res = await User.findOne({
        where: { id: Number(result) },
      });
      if (res.token !== token || !res.token) {
        ctx.body = { status: 403, msg: "登录已过期,请重新登录" };
        return false;
      }
    }
  }
  await next();
});
app.use(router.routes()); // 作用：启动路由
app.use(router.allowedMethods()); // 作用： 这是官方文档的推荐用法,我们可以看到router.allowedMethods()用在了路由匹配router.routes()之后,所以在当所有路由中间件最后调用.此时根据ctx.status设置response响应头

const port = process.env.PORT || 8181;
app.listen(port, () => {
  console.log("serve run port: " + port);
});
