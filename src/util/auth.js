import Cookies from "js-cookie";
import { setStore, getStore, removeStore } from "@/util/store";
const TokenKey = "sifibuy-access-token";
const RefreshTokenKey = "sifibuy-refresh-token";
export function getToken() {
  return getStore({ name: "token" });
  // return Cookies.get(TokenKey)
}

export function setToken(token) {
  setStore({ name: "token", token });
  // return Cookies.set(TokenKey, token)
}

export function getRefreshToken() {
  return Cookies.get(RefreshTokenKey);
}

export function setRefreshToken(token) {
  return Cookies.set(RefreshTokenKey, token);
}

export function removeToken() {
  removeStore({ name: "token" });
  // return Cookies.remove(TokenKey)
}

export function removeRefreshToken() {
  return Cookies.remove(RefreshTokenKey);
}
