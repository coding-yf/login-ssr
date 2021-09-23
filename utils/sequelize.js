/* 数据库配置 */

const Sequelize = require("sequelize");
// 传入参数 数据库名，用户名，密码
const sequelize = new Sequelize("test", "root", "password", {
  host: "111.111.111.111", //数据库IP地址
  dialect: "mysql",
  operatorsAliases: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});
sequelize
  .authenticate()
  .then(() => {
    console.log("MYSQL 连接成功......");
  })
  .catch((err) => {
    console.error("链接失败:", err);
  });
// 根据模型自动创建表
sequelize.sync();
module.exports = sequelize;
