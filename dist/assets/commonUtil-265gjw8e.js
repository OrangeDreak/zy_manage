const f="https://cdn.webuy.ai/static/lib/image/crm/xiaoer/icons/empty_avatar.png",g=t=>{if(isNaN(t))return t;{const e=String(t),r=e.indexOf(".")>-1?/(\d)(?=(\d{3})+\.)/g:/(\d)(?=(?:\d{3})+$)/g;return e.replace(r,"$1,")}},p=(t,{fixed:e=2,sign:r="",hasPlusMinus:c=!1,thousands:i=!1}={})=>{if(!t){const a=0 .toFixed(e);return r?`${r}${a}`:a}if(isNaN(t))return t;const n=(t/100).toFixed(e),s=i?g(n):n,o=r?`${r}${s}`:s,u=new RegExp("-"),d=o.toString().replace(u,"");return c?`${t>0?"+":"-"}${d}`:o},m=t=>t===null||t===""||isNaN(t)?t.indexOf(",")>-1?(t=t.replace(/,/g,""),+(t*100).toFixed(0)):t:+(t*100).toFixed(0),x=t=>{const e=window.location.search;return e?new URLSearchParams(e).get(t):null};export{m as a,p as c,x as g,f as n};
