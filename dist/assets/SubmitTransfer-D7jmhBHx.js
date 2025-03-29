import{a,L as v,c as d,d as c,e as s,f as o,w as n,g as l,t as i,h as J,k as _,p as O,F as k,n as y,i as R,v as W,E as V}from"./index-CrQX_ENc.js";import{_ as X}from"./_plugin-vue_export-helper-DlAUqK2U.js";const G={class:"submit-transfer"},H={class:"steps"},K={class:"product-list"},Q={class:"product-info"},Z={class:"product-detail"},$={class:"product-name"},ss={class:"product-spec"},es={key:0},ts={class:"product-id"},os={class:"delivery-info"},is={class:"address-list"},ns={class:"address-content"},ls={class:"contact"},as={class:"name"},ds={class:"phone"},cs={class:"address"},rs={class:"shipping-method"},us={class:"shipping-content"},_s={class:"method-name"},ps={class:"method-desc"},ms={class:"method-time"},vs={class:"shipping-price"},fs={class:"package-service"},hs={class:"service-content"},gs={class:"service-name"},bs={class:"service-desc"},ks={class:"service-price"},ys={class:"cost-summary"},Vs={class:"cost-items"},Ss={class:"cost-item"},xs={class:"cost-item"},Cs={class:"cost-item"},ws={class:"cost-item total"},Ns={class:"total-amount"},zs={class:"bottom-bar"},As={class:"left"},Bs={class:"total-info"},Us={class:"amount"},qs={class:"right"},Es={__name:"SubmitTransfer",setup(Ls){const S=J(),q=a(1),x=a([{id:"SP231364071519347264",name:"白色衬衫男长袖修身商务休闲正装衬衣",color:"白色",size:"XL",image:"/shirt.jpg",weight:350,size:"30*25*5",quantity:2}]),E=a([{id:1,name:"John Doe",phone:"+1 234 567 8901",fullAddress:"123 Main St, New York, NY 10001, United States"}]),f=a(1),C=a([{id:1,name:"标准快递",description:"适合普通包裹",time:"7-10 工作日",price:99},{id:2,name:"特快专递",description:"适合急需物品",time:"3-5 工作日",price:199}]),p=a(1),w=a([{id:1,name:"标准包装",description:"基础防护",price:10},{id:2,name:"防水包装",description:"加强防水保护",price:20}]),h=a([]),L=v(()=>x.value.reduce((r,e)=>r+e.weight*e.quantity,0)),N=v(()=>{const r=C.value.find(e=>e.id===p.value);return r?r.price:0}),z=v(()=>h.value.reduce((r,e)=>{const u=w.value.find(g=>g.id===e);return r+(u?u.price:0)},0)),A=v(()=>N.value+z.value),M=()=>{},T=()=>{S.back()},D=()=>{if(!f.value){V.warning("请选择收货地址");return}if(!p.value){V.warning("请选择运输方式");return}V.success("订单提交成功"),S.push("/transfer-list")};return(r,e)=>{const u=l("el-step"),g=l("el-steps"),F=l("el-image"),m=l("el-table-column"),P=l("el-table"),B=l("el-radio"),U=l("el-radio-group"),Y=l("el-icon"),b=l("el-button"),j=l("el-checkbox"),I=l("el-checkbox-group");return c(),d("div",G,[s("div",H,[o(g,{active:q.value,"finish-status":"success"},{default:n(()=>[o(u,{title:"选择商品"}),o(u,{title:"确认信息"}),o(u,{title:"提交订单"})]),_:1},8,["active"])]),s("div",K,[e[3]||(e[3]=s("div",{class:"section-title"},"商品清单",-1)),o(P,{data:x.value},{default:n(()=>[o(m,{label:"商品信息","min-width":"400"},{default:n(({row:t})=>[s("div",Q,[o(F,{src:t.image,class:"product-image"},null,8,["src"]),s("div",Z,[s("div",$,i(t.name),1),s("div",ss,[_(" 颜色："+i(t.color)+" ",1),t.size?(c(),d("span",es,"尺码："+i(t.size),1)):O("",!0)]),s("div",ts,i(t.id),1)])])]),_:1}),o(m,{label:"重量(g)",width:"120",align:"center",prop:"weight"}),o(m,{label:"尺寸(cm)",width:"150",prop:"size"}),o(m,{label:"数量",width:"120",align:"center"},{default:n(({row:t})=>[_(" ×"+i(t.quantity),1)]),_:1})]),_:1},8,["data"])]),s("div",os,[e[5]||(e[5]=s("div",{class:"section-title"},"收货地址",-1)),s("div",is,[o(U,{modelValue:f.value,"onUpdate:modelValue":e[0]||(e[0]=t=>f.value=t)},{default:n(()=>[(c(!0),d(k,null,y(E.value,t=>(c(),d("div",{key:t.id,class:"address-item"},[o(B,{label:t.id},{default:n(()=>[s("div",ns,[s("div",ls,[s("span",as,i(t.name),1),s("span",ds,i(t.phone),1)]),s("div",cs,i(t.fullAddress),1)])]),_:2},1032,["label"])]))),128))]),_:1},8,["modelValue"]),o(b,{type:"primary",plain:"",class:"add-address",onClick:M},{default:n(()=>[o(Y,null,{default:n(()=>[o(R(W))]),_:1}),e[4]||(e[4]=_(" 添加新地址 "))]),_:1})])]),s("div",rs,[e[6]||(e[6]=s("div",{class:"section-title"},"运输方式",-1)),o(U,{modelValue:p.value,"onUpdate:modelValue":e[1]||(e[1]=t=>p.value=t)},{default:n(()=>[(c(!0),d(k,null,y(C.value,t=>(c(),d("div",{key:t.id,class:"shipping-item"},[o(B,{label:t.id},{default:n(()=>[s("div",us,[s("div",_s,i(t.name),1),s("div",ps,i(t.description),1),s("div",ms,"预计 "+i(t.time)+" 送达",1)])]),_:2},1032,["label"]),s("div",vs,"¥"+i(t.price),1)]))),128))]),_:1},8,["modelValue"])]),s("div",fs,[e[7]||(e[7]=s("div",{class:"section-title"},"包装服务",-1)),o(I,{modelValue:h.value,"onUpdate:modelValue":e[2]||(e[2]=t=>h.value=t)},{default:n(()=>[(c(!0),d(k,null,y(w.value,t=>(c(),d("div",{key:t.id,class:"service-item"},[o(j,{label:t.id},{default:n(()=>[s("div",hs,[s("div",gs,i(t.name),1),s("div",bs,i(t.description),1)]),s("div",ks,"¥"+i(t.price),1)]),_:2},1032,["label"])]))),128))]),_:1},8,["modelValue"])]),s("div",ys,[e[12]||(e[12]=s("div",{class:"section-title"},"费用明细",-1)),s("div",Vs,[s("div",Ss,[e[8]||(e[8]=s("span",null,"商品总重量",-1)),s("span",null,i(L.value)+"g",1)]),s("div",xs,[e[9]||(e[9]=s("span",null,"运费",-1)),s("span",null,"¥"+i(N.value),1)]),s("div",Cs,[e[10]||(e[10]=s("span",null,"包装费",-1)),s("span",null,"¥"+i(z.value),1)]),s("div",ws,[e[11]||(e[11]=s("span",null,"预估总费用",-1)),s("span",Ns,"¥"+i(A.value),1)])])]),s("div",zs,[s("div",As,[s("div",Bs,[e[13]||(e[13]=s("span",{class:"label"},"预估总费用：",-1)),s("span",Us,"¥"+i(A.value),1)])]),s("div",qs,[o(b,{onClick:T},{default:n(()=>e[14]||(e[14]=[_("返回修改")])),_:1}),o(b,{type:"primary",onClick:D},{default:n(()=>e[15]||(e[15]=[_("提交订单")])),_:1})])])])}}},Ds=X(Es,[["__scopeId","data-v-ace56a64"]]);export{Ds as default};
