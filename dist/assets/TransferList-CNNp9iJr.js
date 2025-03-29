import{K as A,a as f,o as G,c as M,d as I,e as n,f as a,w as o,g as d,J as j,I as q,m as J,E as C,i as t,k as _,t as s,y as K}from"./index-CrQX_ENc.js";import{_ as Y}from"./_plugin-vue_export-helper-DlAUqK2U.js";const H={class:"transfer-list"},Q={class:"search-area"},W={class:"order-list"},X={class:"product-info"},Z={class:"customer-code"},ee={class:"order-info"},te={class:"order-no"},le={class:"address-info"},ae={class:"remark-info"},se={class:"remark-text"},ne={class:"size-info"},oe={class:"logistics-info"},re={class:"pagination"},ie={__name:"TransferList",setup(de){const{t:e}=A(),b=f(!1),g=f(1),k=f(10),y=f(0),u=f({userCode:"",orderNo:"",tag:"",status:""}),z=f([]),h=async()=>{b.value=!0;try{await new Promise(i=>setTimeout(i,500)),z.value=Array(10).fill(null).map((i,r)=>({id:r+1,userCode:"3730",orderNo:`YT${String(r+1).padStart(10,"0")}`,name:"Alonso González",address:"Calle de Pablo Lastras García 7,3izq",zipCode:"28680",phone:"+34 627333730",email:"alonsogonyu55@gmail.com",country:"西班牙",weight:"100",size:"23.0*26.9*43.9",status:"inStock",trackingNo:"SF1234567890",latestTrack:"包裹已到达目的地仓库",remark:""})),y.value=100}catch(i){console.error(e("transfer.list.messages.getOrdersFailed"),i),C.error(e("transfer.list.messages.getOrdersFailed"))}finally{b.value=!1}},S=()=>{g.value=1,h()},T=()=>{u.value={userCode:"",orderNo:"",tag:"",status:""},S()},x=i=>{k.value=i,h()},U=i=>{g.value=i,h()},$=i=>({pending:"info",inStock:"success",shipping:"warning"})[i]||"info",w=i=>{C.info(`编辑订单 ${i.orderNo} 的备注`)},R=i=>{C.success(`分享订单：${i.orderNo}`)};return G(()=>{h()}),(i,r)=>{const N=d("el-input"),m=d("el-form-item"),c=d("el-option"),V=d("el-select"),v=d("el-button"),B=d("el-form"),D=d("el-icon"),p=d("el-table-column"),F=d("el-tag"),E=d("el-table"),L=d("el-pagination"),O=q("loading");return I(),M("div",H,[n("div",Q,[a(B,{inline:!0,model:u.value},{default:o(()=>[a(m,{label:t(e)("transfer.list.search.customerCode")},{default:o(()=>[a(N,{modelValue:u.value.userCode,"onUpdate:modelValue":r[0]||(r[0]=l=>u.value.userCode=l),placeholder:t(e)("transfer.list.search.placeholder.customerCode")},null,8,["modelValue","placeholder"])]),_:1},8,["label"]),a(m,{label:t(e)("transfer.list.search.orderNo")},{default:o(()=>[a(N,{modelValue:u.value.orderNo,"onUpdate:modelValue":r[1]||(r[1]=l=>u.value.orderNo=l),placeholder:t(e)("transfer.list.search.placeholder.orderNo")},null,8,["modelValue","placeholder"])]),_:1},8,["label"]),a(m,{label:t(e)("transfer.list.search.tag")},{default:o(()=>[a(V,{modelValue:u.value.tag,"onUpdate:modelValue":r[2]||(r[2]=l=>u.value.tag=l),placeholder:t(e)("transfer.list.search.placeholder.tag")},{default:o(()=>[a(c,{label:t(e)("package.status.all"),value:""},null,8,["label"]),a(c,{label:"标签1",value:"tag1"}),a(c,{label:"标签2",value:"tag2"})]),_:1},8,["modelValue","placeholder"])]),_:1},8,["label"]),a(m,{label:t(e)("transfer.list.search.status")},{default:o(()=>[a(V,{modelValue:u.value.status,"onUpdate:modelValue":r[3]||(r[3]=l=>u.value.status=l),placeholder:t(e)("transfer.list.search.placeholder.status")},{default:o(()=>[a(c,{label:t(e)("package.status.all"),value:""},null,8,["label"]),a(c,{label:t(e)("transfer.list.status.pending"),value:"pending"},null,8,["label"]),a(c,{label:t(e)("transfer.list.status.inStock"),value:"inStock"},null,8,["label"]),a(c,{label:t(e)("transfer.list.status.shipping"),value:"shipping"},null,8,["label"])]),_:1},8,["modelValue","placeholder"])]),_:1},8,["label"]),a(m,null,{default:o(()=>[a(v,{type:"default",plain:"",onClick:T},{default:o(()=>[_(s(t(e)("transfer.list.search.reset")),1)]),_:1}),a(v,{type:"primary",onClick:S},{default:o(()=>[_(s(t(e)("transfer.list.search.search")),1)]),_:1})]),_:1})]),_:1},8,["model"])]),n("div",W,[j((I(),J(E,{data:z.value},{default:o(()=>[a(p,{label:t(e)("transfer.list.table.productDetails"),"min-width":"400"},{default:o(({row:l})=>[n("div",X,[n("div",Z,s(t(e)("transfer.list.table.customerCode"))+"："+s(l.userCode),1),n("div",ee,[n("div",te,[_(s(t(e)("transfer.list.table.orderNo"))+"："+s(l.orderNo)+" ",1),a(v,{link:"",type:"primary",class:"copy-btn"},{default:o(()=>[a(D,null,{default:o(()=>[a(t(K))]),_:1})]),_:1})]),n("div",le,[n("div",null,s(t(e)("transfer.list.table.recipientInfo.name"))+"："+s(l.name),1),n("div",null,s(t(e)("transfer.list.table.recipientInfo.address"))+"："+s(l.address),1),n("div",null,s(t(e)("transfer.list.table.recipientInfo.zipCode"))+"："+s(l.zipCode),1),n("div",null,s(t(e)("transfer.list.table.recipientInfo.phone"))+"："+s(l.phone),1),n("div",null,s(t(e)("transfer.list.table.recipientInfo.email"))+"："+s(l.email),1),n("div",null,s(t(e)("transfer.list.table.recipientInfo.country"))+"："+s(l.country),1)])])])]),_:1},8,["label"]),a(p,{label:t(e)("transfer.list.table.productRemark"),"min-width":"200"},{default:o(({row:l})=>[n("div",ae,[a(v,{link:"",type:"primary",onClick:P=>w(l)},{default:o(()=>[_(s(t(e)("transfer.list.table.editRemark")),1)]),_:2},1032,["onClick"]),n("div",se,s(l.remark||t(e)("transfer.list.table.noRemark")),1)])]),_:1},8,["label"]),a(p,{label:t(e)("transfer.list.table.weightSize"),"min-width":"150"},{default:o(({row:l})=>[n("div",ne,[n("div",null,s(l.weight)+"g",1),n("div",null,s(l.size),1)])]),_:1},8,["label"]),a(p,{label:t(e)("transfer.list.table.orderStatus"),width:"120"},{default:o(({row:l})=>[a(F,{type:$(l.status)},{default:o(()=>[_(s(t(e)(`transfer.list.status.${l.status}`)),1)]),_:2},1032,["type"])]),_:1},8,["label"]),a(p,{label:t(e)("transfer.list.table.logisticsStatus"),"min-width":"200"},{default:o(({row:l})=>[n("div",oe,[n("div",null,s(t(e)("transfer.list.table.trackingNo"))+"："+s(l.trackingNo),1),n("div",null,s(l.latestTrack),1)])]),_:1},8,["label"]),a(p,{label:t(e)("transfer.list.table.actions"),width:"100",fixed:"right"},{default:o(({row:l})=>[a(v,{link:"",type:"primary",onClick:P=>R(l)},{default:o(()=>[_(s(t(e)("transfer.list.table.share")),1)]),_:2},1032,["onClick"])]),_:1},8,["label"])]),_:1},8,["data"])),[[O,b.value]]),n("div",re,[a(L,{"current-page":g.value,"onUpdate:currentPage":r[4]||(r[4]=l=>g.value=l),"page-size":k.value,"onUpdate:pageSize":r[5]||(r[5]=l=>k.value=l),total:y.value,"page-sizes":[10,20,50,100],layout:"total, sizes, prev, pager, next, jumper",onSizeChange:x,onCurrentChange:U},null,8,["current-page","page-size","total"])])])])}}},pe=Y(ie,[["__scopeId","data-v-2ec6d634"]]);export{pe as default};
