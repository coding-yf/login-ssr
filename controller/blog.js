const Blog = require("../model/blog");

const list = async (ctx) => {
  const query = ctx.query;
  const { rows: data, count: total } = await Blog.findAndCountAll({
    offset: (+query.page - 1) * +query.pageSize,
    limit: +query.pageSize,
    order: [["createdAt"]],
  });
  ctx.body = {
    data,
    total,
  };
};

const details = async (ctx) => {
  const query = ctx.query;
  if (!query.id) {
    ctx.body = {
      code: 300,
      msg: "id不能为空",
    };
    return false;
  }
  const res = await Blog.findOne({
    where: { id: Number(query.id) },
  });
  ctx.body = res;
};

const create = async (ctx) => {
  const params = ctx.request.body;

  if (!params.title) {
    ctx.body = {
      code: 1003,
      msg: "标题不能为空",
    };
    return false;
  }
  try {
    await Blog.create(params);
    ctx.body = {
      code: 100,
      data: "创建成功",
    };
  } catch (err) {
    ctx.body = {
      code: 300,
      data: err,
    };
  }
};

const update = async (ctx) => {
  const params = ctx.request.body;
  if (!params.id) {
    ctx.body = {
      code: 1003,
      msg: "id不能为空",
    };
    return false;
  }
  await Blog.update(params, {
    where: { id: params.id },
  });
  ctx.body = {
    code: 100,
    msg: "修改成功",
  };
};

const destroy = async (ctx) => {
  await Blog.destroy({ where: ctx.request.body });
  ctx.body = {
    code: 100,
    msg: "删除成功",
  };
};

module.exports = {
  list,
  create,
  destroy,
  details,
  update,
};
