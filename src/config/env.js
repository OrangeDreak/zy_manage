// 配置编译环境和线上环境之间的切换

let baseUrl = "";
let iconfontVersion = ["567566_pwc3oottzol", "1066523_6bvkeuqao36"];
let iconfontUrl = `//at.alicdn.com/t/font_$key.css`;

const env = process.env;

const devConfig = {
  CHAT_URL: "http://47.96.115.1:10008",
  API_URL: "http://47.96.115.1:10002",
  WS_URL: "ws://47.96.115.1:10001",
  APIS_URL: "https://devimapi.sifubuy.com/api",
  WSS_URL: "wss://devimapi.sifubuy.com/message_gateway",
};

const onlineConfig = {
  CHAT_URL: "http://8.222.211.44:10008",
  API_URL: "http://8.222.211.44:10002",
  WS_URL: "ws://8.222.211.44:10001",
  APIS_URL: "https://imapi.mypoplist.com/api",
  WSS_URL: "wss://imapi.mypoplist.com/message_gateway",
};
// console.log(env);
// baseUrl = `${env.VUE_APP_BASE_API}/api`.replace(/\/\/api/g, '/api'); // 环境地址
// console.log(baseUrl);

// 接口地址管理
const url = location.href;
const domain = url.split(".com")[0];
const domain2 = domain.split("//")[1];
let envConfig = devConfig;
if (domain2 === "admin.sifubuy") {
  // 正式服
  baseUrl = "https://admin.sifubuy.com";
  envConfig = onlineConfig;
} else if (domain2 === "dev-fe-buyadmin.sifubuy") {
  // dev环境
  //baseUrl = 'https://dev-buy.sifubuy.com';
  baseUrl = "https://admin.sifubuy.com";
} else {
  // dev环境
  // baseUrl = "https://admin.sifubuy.com";
  // baseUrl = "/api2";
}
let codeUrl = `${baseUrl}/code`;
baseUrl = baseUrl + "/api";
console.log(baseUrl);
export { baseUrl, iconfontUrl, iconfontVersion, codeUrl, env, envConfig };
