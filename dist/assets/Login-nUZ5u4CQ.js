import{r as b,u as C,a as r,o as L,b as S,c as T,d as U,e as o,t as q,f as t,w as s,g as a,h as B,i as D,j as E,k as I,E as M}from"./index-CrQX_ENc.js";import{_ as R}from"./_plugin-vue_export-helper-DlAUqK2U.js";const j={login(g){return b({url:"/admin/user/login",method:"post",data:g})}},z={class:"login-container"},A={class:"login-header"},F={class:"time"},Q={class:"lang-switch"},G={class:"login-content"},H={class:"login-right"},J={__name:"Login",setup(g){const v=B(),w=C(),i=r(null),u=r(!1),p=r(""),l=r({loginName:"",password:""}),h={loginName:[{required:!0,message:"请输入邮箱",trigger:"blur"},{type:"email",message:"请输入正确的邮箱地址",trigger:"blur"}],password:[{required:!0,message:"请输入密码",trigger:"blur"}]},_=()=>{const n=new Date;p.value=n.toLocaleString("zh-CN",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:!1}).replace(/\//g,"-")};let d=null;L(()=>{_(),d=setInterval(_,1e3)}),S(()=>{d&&clearInterval(d)});const y=async()=>{i.value&&await i.value.validate(async n=>{if(n){u.value=!0;try{const e=await j.login(l.value);w.setToken(e.data.token),M.success("登录成功"),v.push("/")}catch(e){console.error("登录失败:",e)}finally{u.value=!1}}})};return(n,e)=>{const N=a("el-icon"),f=a("el-input"),c=a("el-form-item"),V=a("el-button"),k=a("el-form"),x=a("el-card");return U(),T("div",z,[o("div",A,[o("div",F,q(p.value),1),o("div",Q,[e[2]||(e[2]=o("span",null,"中文/USD",-1)),t(N,null,{default:s(()=>[t(D(E))]),_:1})])]),o("div",G,[e[5]||(e[5]=o("div",{class:"login-left"},[o("div",{class:"logo"},"QC elf"),o("div",{class:"slogan"},[o("div",{class:"slogan-text"},"管理后台")])],-1)),o("div",H,[t(x,{class:"login-card"},{default:s(()=>[e[4]||(e[4]=o("h2",{class:"login-title"},"登录",-1)),t(k,{ref_key:"formRef",ref:i,model:l.value,rules:h},{default:s(()=>[t(c,{prop:"loginName"},{default:s(()=>[t(f,{modelValue:l.value.loginName,"onUpdate:modelValue":e[0]||(e[0]=m=>l.value.loginName=m),placeholder:"电子邮箱","prefix-icon":"Message"},null,8,["modelValue"])]),_:1}),t(c,{prop:"password"},{default:s(()=>[t(f,{modelValue:l.value.password,"onUpdate:modelValue":e[1]||(e[1]=m=>l.value.password=m),type:"password",placeholder:"密码","prefix-icon":"Lock","show-password":""},null,8,["modelValue"])]),_:1}),t(c,null,{default:s(()=>[t(V,{type:"primary",class:"login-button",loading:u.value,onClick:y},{default:s(()=>e[3]||(e[3]=[I(" 登录 ")])),_:1},8,["loading"])]),_:1})]),_:1},8,["model"])]),_:1})])])])}}},P=R(J,[["__scopeId","data-v-a9c57701"]]);export{P as default};
