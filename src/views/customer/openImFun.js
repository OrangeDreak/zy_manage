import { getSDK } from "@/util/lib";
import { CbEvents } from "@/util/lib/constant";

import { openIMLoginApi } from "../../api/customer/session";

// const IMSDK = getSDK();
import { IMSDK } from "../../util/imCommon";

export async function getIMToken() {
  // const res = await openIMLoginApi();
  // console.log(res, "res");
  return (
    window.localStorage.getItem(SifuBuy - userInfo.content.accessToken) ||
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJpc3N1c2VyIiwiYXVkIjoiYXVkaWVuY2UiLCJ0ZW5hbnRfaWQiOiIwMDAwMDAiLCJyb2xlX25hbWUiOiJhZG1pbmlzdHJhdG9yLHVzZXIsbnVsbCIsInVzZXJfaWQiOiIxMTIzNTk4ODIxNzM4Njc1MjAxIiwicm9sZV9pZCI6IjExMjM1OTg4MTY3Mzg2NzUyMDEsMTEyMzU5ODgxNjczODY3NTIwMiwxNzQ3NTQxNTc4NzE1MzQ0ODk3IiwidXNlcl9uYW1lIjoiYWRtaW4iLCJ0b2tlbl90eXBlIjoiYWNjZXNzX3Rva2VuIiwiZGVwdF9pZCI6IjExMjM1OTg4MTM3Mzg2NzUyMDEiLCJhY2NvdW50IjoiYWRtaW4iLCJjbGllbnRfaWQiOiJzYWJlciIsImV4cCI6MTcwNTU3ODI2NCwibmJmIjoxNzA1NTc0NjY0fQ.Ipbv689ZBc3w8YGXQHmlVaPKS4yxZuuIw_s1ZsSOUgU"
  );
}

// export async function onSendMessage(options) {
//   try {
//     console.log(
//       {
//         recvID: "100026",
//         groupID: "",
//         ...options,
//       },
//       "99"
//     );
//     const { data } = await IMSDK.sendMessage({
//       recvID: "100026",
//       groupID: "",
//       ...options,
//     });
//     return data;
//   } catch (e) {
//     console.log(e);
//   }
// }
