const sequelize = require("../utils/sequelize");
const Sequelize = require("sequelize");
const moment = require("moment");

// 定义表结构
const blog = sequelize.define(
  "blog",
  {
    id: {
      type: Sequelize.INTEGER(11), // 设置字段类型
      primaryKey: true, // 设置为主键
      autoIncrement: true, // 自增
    },
    title: {
      type: Sequelize.STRING,
    },
    content: {
      type: Sequelize.TEXT,
    },
    img: {
      type: Sequelize.STRING,
    },
    author: {
      type: Sequelize.STRING,
    },
    likeNum: {
      type: Sequelize.STRING,
      defaultValue: "0",
    },
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
      get() {
        // this.getDataValue 获取当前字段value
        return moment(this.getDataValue("createdAt")).format(
          "YYYY-MM-DD HH:mm"
        );
      },
    },
    updatedAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
      get() {
        return moment(this.getDataValue("updatedAt")).format(
          "YYYY-MM-DD HH:mm"
        );
      },
    },
  },
  {
    // sequelize会自动使用传入的模型名（define的第一个参数）的复数做为表名 设置true取消默认设置
    freezeTableName: true,
  }
);

module.exports = blog;
