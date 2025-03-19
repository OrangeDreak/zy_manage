export const notAvatar = "https://cdn.webuy.ai/static/lib/image/crm/xiaoer/icons/empty_avatar.png";

// 两位小数
export const isTwoDecimalPlaces = (num) => {
  let _result = false;
  const parseNumber = /^(([1-9]{1}\d*)|(0{1}))(\.\d{0,2})?$/;
  if (num !== "" && num !== null) {
    _result = parseNumber.test(num);
  }
  return _result;
};

// 非负浮点数
export const isPositivePointNum = (num) => {
  let _result = false;
  const parseNumber = /^\d+(\.\d+)?$/;
  if (num !== "" && num !== null) {
    _result = parseNumber.test(num);
  }
  return _result;
};

// 千分位格式化数值，每3位数加一个逗号
export const formatterThousands = (num) => {
  if (!isNaN(num)) {
    const str = String(num);
    const reg = str.indexOf(".") > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g;
    return str.replace(reg, "$1,");
  } else {
    return num;
  }
};

/**
 * 计算金额
 * 四舍五入，最多保留2位小数
 */
export function calAsset(asset) {
  return Math.round(asset) / 100;
}

/**
 *
 * @param {金额} num
 * @returns 返回带有千分符的金额
 */
export function formatNum(num, sign = "") {
  if (typeof num !== "number") {
    if (!num) return `-`;
    // eslint-disable-next-line no-param-reassign
    num = Number(num);
  }
  const num2 = (num * 100) / 100;
  return `${sign}${num2.toLocaleString("en-US")}`;
  // return `${sign} ${num2.toLocaleString('en-US')}`;
}

export function formatNum2(num, sign = "") {
  if (typeof num !== "number") {
    if (!num) return `-`;
    // eslint-disable-next-line no-param-reassign
    num = Number(num);
  }
  let result = calAsset(num);
  result = (result * 100) / 100;
  return `${sign}${result.toLocaleString("en-US")}`;
}

/**
 * 处理价格，将数值由分变成元
 * @param {*} val 需要处理的值
 * @param {*} fixed 保留的小数点，默认为2
 * @param {*} sign 金额前的符号
 * @param {*} hasPlusMinus 是否显示金额正负
 * @param {*} thousands 千分位分隔符
 * @return {string} 返回结果，如果val为NAN，返回val原值
 */
export const convertFenToYuan = (
  val,
  { fixed = 2, sign = "", hasPlusMinus = false, thousands = false } = {},
) => {
  if (!val) {
    const _val = (0 / 100).toFixed(fixed);
    return sign ? `${sign}${_val}` : _val;
  }
  if (isNaN(val)) {
    return val;
  }
  const _val = (val / 100).toFixed(fixed);
  const __val = thousands ? formatterThousands(_val) : _val;
  const num = sign ? `${sign}${__val}` : __val;
  const reg = new RegExp("-");
  const _num = num.toString().replace(reg, "");
  return hasPlusMinus ? `${val > 0 ? "+" : "-"}${_num}` : num;
};

/**
 * 处理价格，将数值由元变成分
 * @param {*} val 需要处理的值
 * @return {string} 返回结果
 */
export const convertYuanToFen = (val) => {
  if (val === null || val === "" || isNaN(val)) {
    if (val.indexOf(",") > -1) {
      val = val.replace(/,/g, "");
      return +(val * 100).toFixed(0);
    }
    return val;
  } else {
    // console.log(val);
    // if (val.indexOf(",") > -1) {
    //   console.log(val);
    //   val = val.replace(/,/g, "");
    // }

    return +(val * 100).toFixed(0);
  }
};

//  获取路由对应键的值
export const getUrlParamJs = (paramName) => {
  const queryString = window.location.search;
  if (queryString) {
    const params = new URLSearchParams(queryString);
    return params.get(paramName);
  }

  return null;
};

// 第三方商详跳转
export function goPlatformProductDetail(platform, id) {
  const domainList = [
    { link: "https://item.taobao.com/item.htm?id=", platform: 2 },
    { link: "https://detail.1688.com/offer/", platform: 1 },
    { link: "https://weidian.com/item.html?itemId=", platform: 4 },
  ];
  const item = domainList.find((a) => a.platform === platform);
  if (item) {
    if (item.platform === 2) {
      if (id.length <= 12) {
        window.open(item.link + id);
      }
    } else if (item.platform === 1) {
      window.open(`${item.link + id}.html`);
    } else if (item.platform === 4) {
      window.open(`${item.link + id}&vc_cps_track=1459920903_0_0`);
    }
  }
}
