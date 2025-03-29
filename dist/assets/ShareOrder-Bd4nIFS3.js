import{a as m,o as w,b as N,c as f,d as r,e as s,t,f as o,w as i,g as n,x as T,F as x,n as C,i as d,j as B,y as S,k as g,z as j,m as D,A as z}from"./index-CrQX_ENc.js";import{_ as I}from"./_plugin-vue_export-helper-DlAUqK2U.js";const U={class:"share-order"},V={class:"header"},F={class:"time"},L={class:"lang-switch"},M={class:"content"},O={class:"order-card"},A={class:"order-info"},E={class:"customer-info"},Y={class:"info-item"},q={class:"value"},G={class:"info-item"},H={class:"value"},J={class:"info-item"},K={class:"value"},P={class:"receiver-info"},Q={class:"info-group"},R={class:"info-item"},W={class:"value"},X={class:"info-item"},Z={class:"value"},$={class:"info-item"},ss={class:"value"},es={class:"info-item"},as={class:"value"},ts={class:"info-item"},os={class:"value"},is={class:"info-item"},ls={class:"value"},ns={class:"info-item"},ds={class:"value"},cs={class:"logistics-info"},rs={class:"tracking-no"},vs={class:"value"},_s={class:"time"},us={class:"package-info"},ps={class:"package-images"},ms={__name:"ShareOrder",setup(fs){const v=m(""),_=()=>{const u=new Date;v.value=u.toLocaleString("zh-CN",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:!1}).replace(/\//g,"-")};let c=null;w(()=>{_(),c=setInterval(_,1e3)}),N(()=>{c&&clearInterval(c)});const a=m({customerCode:"9252BB",orderNo:"7887981564176",createTime:"2025-02-20 19:11:16",receiver:{name:"Dominic Migliorini",address:"164 Tumbleweed Drive",city:"New York",zipCode:"14534",phone:"(585)643-9252",email:"rhlaxman164@gmail.com",country:"美国"},trackingNo:"921449036271881100162025",lastUpdateTime:"2025-03-07 13:24:00 包裹离开始发地",images:["path/to/image1.jpg","path/to/image2.jpg","path/to/image3.jpg","path/to/image4.jpg"]});return(u,e)=>{const l=n("el-icon"),p=n("el-button"),b=n("el-link"),h=n("el-image");return r(),f("div",U,[s("div",V,[s("div",F,t(v.value),1),s("div",L,[e[0]||(e[0]=s("span",null,"中文/USD",-1)),o(l,null,{default:i(()=>[o(d(B))]),_:1})])]),s("div",M,[s("div",O,[e[14]||(e[14]=T('<div class="card-header" data-v-2d5cb9a2><div class="header-tabs" data-v-2d5cb9a2><div class="tab active" data-v-2d5cb9a2>商品详情</div><div class="tab" data-v-2d5cb9a2>商品备注信息</div><div class="tab" data-v-2d5cb9a2>订单状态</div></div></div>',1)),s("div",A,[s("div",E,[s("div",Y,[e[1]||(e[1]=s("span",{class:"label"},"客户编号：",-1)),s("span",q,t(a.value.customerCode),1)]),s("div",G,[e[2]||(e[2]=s("span",{class:"label"},"订单编号：",-1)),s("span",H,t(a.value.orderNo),1),o(p,{link:"",type:"primary",class:"copy-btn"},{default:i(()=>[o(l,null,{default:i(()=>[o(d(S))]),_:1})]),_:1})]),s("div",J,[e[3]||(e[3]=s("span",{class:"label"},"创建时间：",-1)),s("span",K,t(a.value.createTime),1)])]),s("div",P,[s("div",Q,[s("div",R,[e[4]||(e[4]=s("span",{class:"label"},"姓名：",-1)),s("span",W,t(a.value.receiver.name),1)]),s("div",X,[e[6]||(e[6]=s("span",{class:"label"},"地址：",-1)),s("span",Z,t(a.value.receiver.address),1),o(b,{type:"primary",class:"edit-link"},{default:i(()=>e[5]||(e[5]=[g("编辑地址")])),_:1})]),s("div",$,[e[7]||(e[7]=s("span",{class:"label"},"城市：",-1)),s("span",ss,t(a.value.receiver.city),1)]),s("div",es,[e[8]||(e[8]=s("span",{class:"label"},"邮编：",-1)),s("span",as,t(a.value.receiver.zipCode),1)]),s("div",ts,[e[9]||(e[9]=s("span",{class:"label"},"手机号：",-1)),s("span",os,t(a.value.receiver.phone),1)]),s("div",is,[e[10]||(e[10]=s("span",{class:"label"},"邮箱：",-1)),s("span",ls,t(a.value.receiver.email),1)]),s("div",ns,[e[11]||(e[11]=s("span",{class:"label"},"国家：",-1)),s("span",ds,t(a.value.receiver.country),1)])])]),s("div",cs,[s("div",rs,[e[12]||(e[12]=s("span",{class:"label"},"物流单号：",-1)),s("span",vs,t(a.value.trackingNo),1),o(l,{class:"location-icon"},{default:i(()=>[o(d(j))]),_:1}),s("span",_s,t(a.value.lastUpdateTime),1)]),s("div",us,[s("div",ps,[(r(!0),f(x,null,C(a.value.images,(y,k)=>(r(),D(h,{key:k,src:y,fit:"cover",class:"package-image"},null,8,["src"]))),128))]),o(p,{type:"primary",class:"download-btn"},{default:i(()=>[o(l,null,{default:i(()=>[o(d(z))]),_:1}),e[13]||(e[13]=g(" 下载全部图片 "))]),_:1})])])])])])])}}},hs=I(ms,[["__scopeId","data-v-2d5cb9a2"]]);export{hs as default};
