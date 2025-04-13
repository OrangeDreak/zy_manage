import{r as S,c as m,d as u,e as p,w as s,f as g,h as o,m as h,p as b,k as c,F as y,n as D,t as f}from"./index-v6VglziA.js";import{g as R}from"./user-CljmtHWM.js";import{p as L}from"./date-CHAm-pjJ.js";import{a as U,f as _}from"./commonUtil-CzRWkOk-.js";/* empty css                    *//* empty css              */import{_ as B}from"./_plugin-vue_export-helper-DlAUqK2U.js";const E=a=>S({url:"/admin/balance/apply/list",method:"post",data:a}),z=a=>S({url:"/admin/balance/apply/save",method:"post",data:a}),Y=a=>S({url:"/admin/balance/apply/apply",method:"post",data:a}),q={data(){const a=this;return{rowData:{},form:{},search:{},pickerOptions:L,loading:!0,searchLoading:!1,query:{},userList:[],selectUserInfo:{},currencyList:[{label:"CNY",value:"CNY",code:"CNY",currency:"CNY"},{label:"USD",value:"USD",code:"USD",currency:"USD"}],page:{pageSize:10,currentPage:1,total:0},maxAmount:void 0,option:{calcHeight:210,labelWidth:120,searchShow:!0,searchGutter:10,searchLabelPosition:"left",searchMenuPosition:"right",searchSpan:8,menuWidth:120,searchMenuSpan:24,searchLabelWidth:90,span:24,tip:!1,dialogWidth:"60%",editTitle:"余额充值审核",saveBtnText:"确定",viewBtn:!0,viewBtnIcon:"a",addBtn:!0,addBtnText:"创建充值申请",editBtn:!1,cancelBtn:!1,updateBtn:!1,delBtn:!1,column:[{label:"ID",prop:"id",order:1,addDisplay:!1,editDisplay:!1,search:!0},{label:"申请时间",prop:"gmtCreated",search:!0,addDisplay:!1,editDisplay:!1,searchRange:!0,format:"YYYY-MM-DD HH:mm:ss",valueFormat:"YYYY-MM-DD HH:mm:ss",type:"daterange",pickerOptions:L,order:0,width:95,formatter:e=>e.gmtCreated},{label:"用户ID",prop:"userId",order:1,editDisabled:!0,search:!0,hide:!0},{label:"用户信息",prop:"userInfo",addDisplay:!1,editDisplay:!1,viewDisplay:!1},{label:"转账银行",prop:"transfer",addDisplay:!1,editDisplay:!0},{label:"充值类型",prop:"rechargeType",type:"select",editDisabled:!0,search:!0,order:1,rules:[{required:!0,message:"请选择充值类型",trigger:"change"}],value:1,dicData:[{label:"银行转账",value:1},{label:"PayPal转账",value:2}]},{label:"申请人",prop:"creatorRealName",disabled:!0,editDisplay:!1,search:!0,order:1,hide:!0,value:""},{label:"充值币种",prop:"currency",type:"select",viewDisplay:!1,addDisplay:!1,editDisplay:!1,hide:!0,dicData:[{label:"CNY",value:"CNY"},{label:"USD",value:"USD"}]},{label:"充值金额",prop:"amount",rules:[{required:!0,message:"请输入充值金额",trigger:"blur"}],formatter:e=>(e.currencySign?e.currencySign:e.currency)+" "+_(e.amount)},{label:"到账金额",prop:"realAmount",addDisplay:!1,editDisplay:!1,formatter:e=>e.applyStatus===1?(e.currencySign?e.currencySign:e.currency)+" "+_(e.realAmount):"--"},{label:"汇率",prop:"amountRate",addDisplay:!1,editDisplay:!1,formatter:e=>e.amountRate},{label:"充值凭证",prop:"paymentEvidenceImg",align:"left",multiple:!0,editDisabled:!0,type:"upload",accept:".png,.jpg,.jpeg",listType:"picture-card",limit:5,action:"https://qcelf.com/tp/admin/resource/oss/upload",tip:"支持jpg、png格式，单张图片不超过2M，最多5张",propsHttp:{url:"url",res:"data"},uploadBefore:(e,d,n)=>{var r=e.size/1024/1024<2;r?d():(a.$message.error("上传图片大小不能超过2MB!"),n())},rules:[{required:!1,message:"请上传充值凭证",trigger:"blur"}]},{label:"申请备注",prop:"rechargePurpose",editDisabled:!0,type:"textarea",overHidden:!0,rules:[{required:!1,message:"请输入备注",trigger:"blur"}]},{label:"审核备注",prop:"applyRemarks",addDisplay:!1,editDisplay:!0,type:"textarea",overHidden:!0,rules:[{required:!1,message:"请输入审核备注",trigger:"blur"}]},{label:"驳回原因",prop:"rejectReason",addDisplay:!1,type:"textarea",overHidden:!0,rules:[{required:!1,message:"请输入",trigger:"blur"}]},{label:"审核状态",prop:"applyStatus",search:!0,addDisplay:!1,editDisplay:!1,order:2,align:"center",type:"select",showColumn:!0,rules:[{required:!0,message:"审核状态不能为空",trigger:"blur"}],dicData:[{label:"审核通过",value:1},{label:"审核驳回",value:-1},{label:"待审核",value:0}]}]},subLoading:!1,data:[]}},created(){},methods:{remoteMethod(a){a!==""?(this.searchLoading=!0,R({id:a,current:1,size:10}).then(e=>{this.userList=e.data}).finally(()=>{this.searchLoading=!1})):this.options=[]},userChange(){this.form.userId&&(this.selectUserInfo=this.userList.find(a=>a.id===this.form.userId))},searchReset(){this.search={},this.query={},this.page.currentPage=1,this.page.pageSize=10,this.onLoad(this.page)},searchChange(a,e){this.query=a,this.page.currentPage=1,this.onLoad(this.page,a),e()},currentChange(a){this.page.currentPage=a},sizeChange(a){this.page.pageSize=a},refreshChange(){this.onLoad(this.page,this.query)},onLoad(a,e={}){this.loading=!0;const d={pageNo:a.currentPage,pageSize:a.pageSize,...Object.assign(e,this.query)};if(e.gmtCreated&&e.gmtCreated.length){const n=e.gmtCreated.split(",");d.gmtCreatedStart=n[0],d.gmtCreatedEnd=n[1]}else delete e.gmtCreatedStart,delete e.gmtCreatedEnd;E(d).then(n=>{n.data.forEach(r=>{r.paymentEvidenceImg&&(r.paymentEvidenceImg=r.paymentEvidenceImg.split(","))}),this.page.total=Number(n.total),this.data=n.data}).finally(()=>{this.loading=!1})},beforeOpen(a,e){e==="add"?(this.maxAmount=void 0,this.form.currency="CNY",this.option.column.forEach(d=>{var n;d.prop==="creatorRealName"&&(d.value=((n=this.userInfo)==null?void 0:n.account)||"--")})):e==="edit"?(this.form=this.rowData,this.maxAmount=this.form.amount):(this.userList=[],this.form.amount&&(this.form.amount=this.form.amount/100),this.form.realAmount&&(this.form.realAmount=this.form.realAmount/100),this.selectUserInfo={avatar:this.form.avatar,nickname:this.form.nickname}),a()},rowSave(a,e,d){const n={...a};n.paymentEvidenceImg=n.paymentEvidenceImg.join(),n.amount=U(n.amount),z(n).then(()=>{e(),this.refreshChange(),this.$message.success("创建成功")},r=>{d()})},async handleAudit(a){if(a===-1&&!this.form.rejectReason){this.$message.error("请输入驳回原因");return}this.subLoading=!0;try{await Y({id:this.form.id,applyStatus:a,amount:(this.form.amount*100).toFixed(0),applyRemarks:this.form.applyRemarks||void 0,rejectReason:this.form.rejectReason||void 0}),this.closeDialog(),this.subLoading=!1,this.refreshChange()}catch{this.subLoading=!1}},async handleToExamine(a){this.rowData={...a},this.rowData.amount=(this.rowData.amount/100).toFixed(2),this.userList=[{id:this.rowData.userId,nickname:this.rowData.nickname}],this.selectUserInfo={avatar:this.rowData.avatar,nickname:this.rowData.nickname},this.$refs.crud.rowEdit()},closeDialog(){this.$refs.crud.closeDialog()}}},M={class:"basic-container"},P={class:"recharge-application"},T={class:"foreign-amount-form"},j={key:0,class:"foreign-amount-form"},H={class:"user-box"},O={class:"left"},F={class:"right"};function W(a,e,d,n,r,i){const x=g("el-image"),C=g("el-tag"),I=g("el-input-number"),w=g("el-option"),k=g("el-select"),V=g("el-avatar"),v=g("el-button"),N=g("avue-crud");return o(),m("div",M,[u("div",P,[p(N,{option:r.option,"table-loading":r.loading,data:r.data,ref:"crud",modelValue:r.form,"onUpdate:modelValue":e[7]||(e[7]=l=>r.form=l),search:r.search,page:r.page,onRowSave:i.rowSave,"before-open":i.beforeOpen,onSearchChange:i.searchChange,onSearchReset:i.searchReset,onCurrentChange:i.currentChange,onSizeChange:i.sizeChange,onRefreshChange:i.refreshChange,onOnLoad:i.onLoad},{userInfo:s(l=>[u("div",null,"ID："+f(l.row.userId),1),u("div",null,"昵称："+f(l.row.nickname),1)]),paymentEvidenceImg:s(l=>[(o(!0),m(y,null,D(l.row.paymentEvidenceImg,(t,A)=>(o(),h(x,{style:{height:"50px"},key:t,src:t,fit:"cover","preview-src-list":l.row.paymentEvidenceImg},null,8,["src","preview-src-list"]))),128))]),transfer:s(l=>[l.row.rechargeType===1?(o(),m(y,{key:0},[u("div",null,"转账人姓名："+f(l.row.remitterName),1),u("div",null,"转账银行："+f(l.row.remittingBank),1),u("div",null,"汇款凭证号："+f(l.row.referenceNo),1)],64)):b("",!0)]),applyStatus:s(l=>[l.row.applyStatus===0?(o(),h(C,{key:0},{default:s(()=>e[8]||(e[8]=[c("待审核")])),_:1})):l.row.applyStatus===1?(o(),h(C,{key:1,type:"success"},{default:s(()=>e[9]||(e[9]=[c("审核通过")])),_:1})):l.row.applyStatus===-1?(o(),h(C,{key:2,type:"danger"},{default:s(()=>e[10]||(e[10]=[c("审核驳回")])),_:1})):b("",!0)]),"transfer-form":s(({type:l})=>[r.form.remitterName?(o(),m(y,{key:0},[u("div",null,"转账人姓名："+f(r.form.remitterName),1),u("div",null,"转账银行："+f(r.form.remittingBank),1),u("div",null,"汇款凭证号："+f(r.form.referenceNo),1)],64)):(o(),m(y,{key:1},[c("--")],64))]),"amount-form":s(({type:l})=>[u("div",T,[p(I,{modelValue:r.form.amount,"onUpdate:modelValue":e[0]||(e[0]=t=>r.form.amount=t),precision:2,class:"foreign-amount",style:{width:"100%"},min:0,max:r.maxAmount,controls:!1},null,8,["modelValue","max"]),p(k,{modelValue:r.form.currency,"onUpdate:modelValue":e[1]||(e[1]=t=>r.form.currency=t),class:"currency",disabled:l==="edit"||l==="view",clearable:!1},{default:s(()=>[(o(!0),m(y,null,D(r.currencyList,t=>(o(),h(w,{key:t.value,label:t.currency,value:t.code},null,8,["label","value"]))),128))]),_:2},1032,["modelValue","disabled"])])]),"realAmount-form":s(({type:l})=>[r.form.realAmount?(o(),m("div",j,[p(I,{modelValue:r.form.realAmount,"onUpdate:modelValue":e[2]||(e[2]=t=>r.form.realAmount=t),precision:2,class:"foreign-amount",style:{width:"100%"},min:0,max:r.maxAmount,controls:!1},null,8,["modelValue","max"]),p(k,{modelValue:r.form.currency,"onUpdate:modelValue":e[3]||(e[3]=t=>r.form.currency=t),class:"currency",disabled:"",clearable:!1},{default:s(()=>[(o(!0),m(y,null,D(r.currencyList,t=>(o(),h(w,{key:t.value,label:t.currency,value:t.code},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])])):b("",!0)]),"userId-form":s(({type:l})=>[u("div",H,[u("div",O,[p(k,{modelValue:r.form.userId,"onUpdate:modelValue":e[4]||(e[4]=t=>r.form.userId=t),filterable:"",remote:"",disabled:l==="edit","reserve-keyword":"",placeholder:"请输入用户ID搜索","remote-method":i.remoteMethod,loading:r.searchLoading,onChange:i.userChange},{default:s(()=>[(o(!0),m(y,null,D(r.userList,t=>(o(),h(w,{key:t.id,disabled:t.status!==0,label:"ID:"+t.id+" / 昵称:"+t.nickname,value:t.id},null,8,["disabled","label","value"]))),128))]),_:2},1032,["modelValue","disabled","remote-method","loading","onChange"]),c(" 用户昵称："+f(r.selectUserInfo.nickname||"--"),1)]),u("div",F,[p(V,{shape:"square",size:80,src:r.selectUserInfo.avatar},{default:s(()=>e[11]||(e[11]=[u("img",{src:"https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png"},null,-1)])),_:1},8,["src"])])])]),"menu-form":s(({type:l})=>[l==="edit"?(o(),m(y,{key:0},[p(v,{type:"primary",loading:r.subLoading,size:"small",onClick:e[5]||(e[5]=t=>i.handleAudit(1))},{default:s(()=>e[12]||(e[12]=[c("审核通过")])),_:1},8,["loading"]),p(v,{type:"primary",loading:r.subLoading,size:"small",onClick:e[6]||(e[6]=t=>i.handleAudit(-1))},{default:s(()=>e[13]||(e[13]=[c("驳回")])),_:1},8,["loading"])],64)):b("",!0),p(v,{type:"pain",size:"small",onClick:i.closeDialog},{default:s(()=>e[14]||(e[14]=[c("取消")])),_:1},8,["onClick"])]),menu:s((l,t)=>[l.row.applyStatus===0?(o(),h(v,{key:0,onClick:A=>i.handleToExamine(l.row),type:"text"},{default:s(()=>e[15]||(e[15]=[c("审核")])),_:2},1032,["onClick"])):b("",!0)]),_:1},8,["option","table-loading","data","modelValue","search","page","onRowSave","before-open","onSearchChange","onSearchReset","onCurrentChange","onSizeChange","onRefreshChange","onOnLoad"])])])}const ee=B(q,[["render",W],["__scopeId","data-v-f28387c9"]]);export{ee as default};
