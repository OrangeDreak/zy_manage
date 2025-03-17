// 格式化传参，当参数为"",undefined,null时，就删除该参数，并且将类型为String的参数纱窗空格
// editCanEmpty: 当有值可以传空时需要传该参数为true
const filterNull = (o) => {
  o = o || {};
  if (o.editCanEmpty) {
    for (const key in o) {
      if (o[key] === null || o[key] === undefined || key == "editCanEmpty") {
        delete o[key];
      }
      if (toType(o[key]) === "string") {
        o[key] = o[key].trim();
      }
    }
  } else {
    for (const key in o) {
      if (o[key] === null || o[key] === undefined || o[key] === "") {
        delete o[key];
      }
      if (toType(o[key]) === "string") {
        o[key] = o[key].trim();
      }
    }
  }
  return o;
};
const toType = (obj) => {
  return {}.toString
    .call(obj)
    .match(/\s([a-zA-Z]+)/)[1]
    .toLowerCase();
};

export default filterNull;
