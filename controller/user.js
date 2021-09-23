const User = require("../model/user");
const encryptionAndDecryption = require("../utils/encryptionAndDecryption");
const JwtUtil = require("../utils/jwt");

// 登录
const login = async (ctx) => {
  const bodyData = ctx.request.body || {};
  const userName = bodyData.userName;
  const passWord = bodyData.passWord;
  if (!userName || !passWord) {
    ctx.body = {
      code: 300,
      msg: "用户名密码不能为空！",
    };
    return false;
  }
  try {
    let result = await User.findAll({
      where: {
        userName: userName,
      },
    });
    if (result.length) {
      result = result[0];
      console.log(result);
      // 密码解密 利用aes
      const aes = encryptionAndDecryption.encrypt(passWord);
      if (result.passWord === aes) {
        // 登陆成功，添加token验证
        const _id = result.id.toString();
        // 将用户id传入并生成token
        const jwt = new JwtUtil(_id);
        const token = jwt.generateToken();
        console.log("login id:" + _id);
        console.log("login token:" + token);
        // 将token存入
        const updateRes = await User.update(
          {
            token,
          },
          {
            where: {
              id: _id,
            },
          }
        );
        console.log("=====" + updateRes);

        // 将 token 返回给客户端
        ctx.body = { status: 200, msg: "登陆成功", token: token };
      } else {
        ctx.body = { status: 500, msg: "账号密码错误" };
        return false;
      }
    } else {
      ctx.body = { status: 500, msg: "账号密码错误" };
    }
  } catch (error) {
    ctx.body = { status: 500, msg: error };
  }
};

// 注册
const register = async (ctx) => {
  const bodyData = ctx.request.body || {};
  const userName = bodyData.userName;
  const passWord = bodyData.passWord;
  if (!userName || !passWord) {
    ctx.body = {
      code: 300,
      msg: "用户名密码不能为空！",
    };
    return false;
  }

  try {
    const result = await User.findAll({
      where: {
        userName: userName,
      },
    });
    if (result.length) {
      ctx.body = {
        code: 300,
        msg: "用户名已存在",
      };
      return false;
    }

    // 更新数据库
    const res = await User.create({
      userName,
      passWord: encryptionAndDecryption.encrypt(passWord),
    });
    // 登陆成功，添加token验证
    const _id = res.dataValues.id.toString();
    // 将用户id传入并生成token
    const jwt = new JwtUtil(_id);
    const token = jwt.generateToken();
    // 将token存入
    await User.update(
      { token },
      {
        where: {
          id: _id,
        },
      }
    );
    ctx.body = {
      code: 100,
      data: "创建成功",
      token: token,
    };
  } catch (err) {
    ctx.body = {
      code: 300,
      data: err,
    };
  }
};

// 注销
const loginOut = async (ctx) => {
  const jwt = new JwtUtil(ctx.headers.token);
  const result = jwt.verifyToken();
  // 将token存入
  const res = await User.update(
    { token: "" },
    {
      where: {
        id: result,
      },
    }
  );
  console.log(res);

  ctx.body = {
    code: 100,
    msg: "登出成功",
  };
};
module.exports = {
  login,
  register,
  loginOut,
};
