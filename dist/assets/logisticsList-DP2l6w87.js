import{Y as q,Z as z,_ as F,m as w,w as n,f as p,h as L,e as l,d as a,c as D,p as S,k as d,t as x,$ as N,a0 as O,a1 as B,a2 as W,a3 as H,a4 as E,a5 as M,a6 as j,a7 as G,I as k,F as Y,n as Z}from"./index-v6VglziA.js";import{c as v,a as T}from"./commonUtil-CzRWkOk-.js";/* empty css                    */import{_ as P}from"./_plugin-vue_export-helper-DlAUqK2U.js";/* empty css              */const J={components:{},props:{showPop:{type:Boolean,default:!1},logisticsLineId:{type:[String,Number],default:null}},data(){return{form:{},rules:{areaLibraryIdList:[{required:!0,message:"请选择国家地区",trigger:["blur","change"]}],weight:[{required:!0,message:"请输入重量",trigger:["blur","change"]}],length:[{required:!0,message:"请输入长度",trigger:["blur","change"]}],width:[{required:!0,message:"请输入宽度",trigger:["blur","change"]}],height:[{required:!0,message:"请输入高度",trigger:["blur","change"]}]},loading:!1,freightPrice:null,areaList:[]}},computed:{},mounted(){this.getAreaList()},methods:{async getAreaList(){const{logisticsLineId:i}=this;try{const{data:e={}}=await F({logisticsLineId:i});let s=e;s.forEach(o=>{o.children&&o.children.length?o.children.forEach(t=>{t.children&&t.children.length||delete t.children}):delete o.children}),this.areaList=s||[]}catch(e){console.log(e)}},onClean(){this.$refs.form.resetFields(),this.freightPrice=null},closePop(){this.$emit("close")},onSubmit(){this.$refs.form.validate(async i=>{if(i){this.loading=!0;const e=this.handleData();try{const{data:s={}}=await z(e);this.loading=!1;const{freightPrice:o}=s;this.freightPrice=v(o,{sign:"￥"})}catch{this.loading=!1}}})},handleData(){const{logisticsLineId:i,form:e}=this,{areaLibraryIdList:s}=e,o=q(e);return s&&s.length&&(o.areaLibraryId=s[s.length-1],delete o.areaLibraryIdList),{logisticsLineId:i,...o}}},filters:{}},K={key:0,class:"fs18 fw6 mt20"},Q={class:"dialog-footer"};function X(i,e,s,o,t,u){const h=p("el-cascader"),f=p("el-form-item"),b=p("el-input"),y=p("el-button"),V=p("el-form"),m=p("el-dialog");return L(),w(m,{title:"运费测算","close-on-click-modal":!1,"model-value":"showPop",width:"50%","before-close":u.closePop},{footer:n(()=>[a("div",Q,[l(y,{onClick:u.closePop},{default:n(()=>e[10]||(e[10]=[d("取消")])),_:1},8,["onClick"]),l(y,{disabled:t.loading,type:"primary",onClick:u.onSubmit},{default:n(()=>[d(x(t.freightPrice?"重新测算":"开始测算"),1)]),_:1},8,["disabled","onClick"])])]),default:n(()=>[l(V,{ref:"form",inline:!0,model:t.form,rules:t.rules,"label-width":"100px",disabled:t.loading},{default:n(()=>[l(f,{label:"国家/地区",prop:"areaLibraryIdList"},{default:n(()=>[l(h,{modelValue:t.form.areaLibraryIdList,"onUpdate:modelValue":e[0]||(e[0]=g=>t.form.areaLibraryIdList=g),placeholder:"请选择",options:t.areaList,props:{checkStrictly:!0,value:"id",label:"areaName"},filterable:"",clearable:""},null,8,["modelValue","options"])]),_:1}),l(f,{label:"重量",prop:"weight"},{default:n(()=>[l(b,{modelValue:t.form.weight,"onUpdate:modelValue":e[1]||(e[1]=g=>t.form.weight=g),placeholder:"请输入",clearable:"",style:{width:"180px"}},{default:n(()=>e[5]||(e[5]=[a("template",{slot:"append"},[d("g")],-1)])),_:1},8,["modelValue"])]),_:1}),l(f,{label:"长",prop:"length"},{default:n(()=>[l(b,{modelValue:t.form.length,"onUpdate:modelValue":e[2]||(e[2]=g=>t.form.length=g),placeholder:"请输入",clearable:"",style:{width:"180px"}},{default:n(()=>e[6]||(e[6]=[a("template",{slot:"append"},[d("cm")],-1)])),_:1},8,["modelValue"])]),_:1}),l(f,{label:"宽",prop:"width"},{default:n(()=>[l(b,{modelValue:t.form.width,"onUpdate:modelValue":e[3]||(e[3]=g=>t.form.width=g),placeholder:"请输入",clearable:"",style:{width:"180px"}},{default:n(()=>e[7]||(e[7]=[a("template",{slot:"append"},[d("cm")],-1)])),_:1},8,["modelValue"])]),_:1}),l(f,{label:"高",prop:"height"},{default:n(()=>[l(b,{modelValue:t.form.height,"onUpdate:modelValue":e[4]||(e[4]=g=>t.form.height=g),placeholder:"请输入",clearable:"",style:{width:"180px"}},{default:n(()=>e[8]||(e[8]=[a("template",{slot:"append"},[d("cm")],-1)])),_:1},8,["modelValue"])]),_:1}),l(f,{label:" "},{default:n(()=>[l(y,{onClick:u.onClean},{default:n(()=>e[9]||(e[9]=[d("一键重置")])),_:1},8,["onClick"])]),_:1})]),_:1},8,["model","rules","disabled"]),e[11]||(e[11]=a("div",{class:"fs12"},"运费计算规则：运费=首重费用+（包裹重量-首重）/ 续重单位重量*单价+服务费",-1)),t.freightPrice?(L(),D("div",K,"测算结果："+x(t.freightPrice),1)):S("",!0)]),_:1},8,["before-close"])}const $=P(J,[["render",X]]),ee={data(){return{visible:!1,loading:!1,title:"",orderForm:{id:"",outLineId:""},transferMethodList:[{label:"Air Transport",value:"air"},{label:"Shipping",value:"sea"},{label:"Land Transport",value:"land"}]}},methods:{show(i){this.visible=!0,this.title=i.title,this.orderForm.id=i.logisticsLineId,this.orderForm.outLineId=i.outLineId},close(){this.$nextTick(()=>{this.$refs.refOrderForm.resetFields()})},handleOk(){this.$refs.refOrderForm.validate(i=>{i&&(this.loading=!0,N({outLineId:this.orderForm.outLineId,logisticsLineId:this.orderForm.id}).then(()=>{this.$message.success("绑定成功"),this.visible=!1,this.$emit("finish")}).finally(()=>{this.loading=!1}))})}}},te={class:"dialog-footer"};function ie(i,e,s,o,t,u){const h=p("el-form-item"),f=p("el-input"),b=p("el-form"),y=p("el-button"),V=p("el-dialog");return L(),w(V,{width:"50%",modelValue:t.visible,"onUpdate:modelValue":e[2]||(e[2]=m=>t.visible=m),"close-on-click-modal":!1,title:t.title,onClose:u.close},{footer:n(()=>[a("div",te,[l(y,{onClick:e[1]||(e[1]=m=>t.visible=!1)},{default:n(()=>e[3]||(e[3]=[d("取 消")])),_:1}),l(y,{type:"primary",loading:t.loading,onClick:u.handleOk},{default:n(()=>e[4]||(e[4]=[d("确 定")])),_:1},8,["loading","onClick"])])]),default:n(()=>[l(b,{ref:"refOrderForm",model:t.orderForm,"label-width":"100px"},{default:n(()=>[l(h,{label:"",prop:"id",style:{display:"none"}}),l(h,{label:"干线ID：",prop:"outLineId",rules:[{required:!0,message:"请输入干线ID",trigger:"blur"}]},{default:n(()=>[l(f,{modelValue:t.orderForm.outLineId,"onUpdate:modelValue":e[0]||(e[0]=m=>t.orderForm.outLineId=m),style:{width:"100%"},size:"small",placeholder:"请输入干线ID"},null,8,["modelValue"])]),_:1})]),_:1},8,["model"])]),_:1},8,["modelValue","title","onClose"])}const oe=P(ee,[["render",ie]]),le={name:"LogisticsList",components:{FreightCalculation:$,BindLineDialog:oe},data(){return{baseURL:"https://qcelf.com/tp",form:{},query:{},search:{},loading:!0,data:[],option:{searchShow:!0,tip:!1,tree:!0,border:!0,selection:!1,viewBtn:!0,menuWidth:300,searchMenuSpan:8,labelWidth:190,span:24,searchSpan:8,searchLabelWidth:120,searchMenuPosition:"right",column:[{label:"ID",addDisplay:!1,editDisplay:!1,prop:"logisticsLineId"},{label:"物流干线名称",prop:"logisticsLineName",width:120,search:!0,overHidden:!0,rules:[{required:!0,message:"请输入物流干线名称",trigger:"blur"}]},{label:"物流干线英文名称",prop:"logisticsLineNameEn",width:120,rules:[{required:!0,message:"请输入物流干线英文名称",trigger:"blur"}]},{label:"物流干线icon",prop:"logisticsLineIcon",type:"upload",accept:".png,.jpg,.jpeg",listType:"picture-img",action:"https://qcelf.com/tp/admin/resource/oss/upload",tip:"支持jpg、png格式，建议尺寸：px，不超过2M",propsHttp:{url:"url",res:"data"},uploadBefore:(i,e,s)=>{var o=i.size/1024/1024<2;o?e():(this.$message.error("文件大小不能超过2MB"),s())},rules:[{required:!0,message:"请上传物流干线icon",trigger:"blur"}]},{label:"覆盖区域",prop:"areaLibraryNameListDesc",width:120,overHidden:!0,addDisplay:!1,editDisplay:!1},{label:"支持包裹类型",prop:"logisticsLineType",hide:!0,dicData:[],html:!0,multiple:!0,type:"select",disabled:!0,addDisplay:!1,editDisplay:!0,placeholder:"请 绑定外部物流干线",rules:[{required:!1,message:"请选择支持包裹类型",trigger:"change"}]},{label:"不支持包裹类型",prop:"nonsupportProductTypeList",width:120,type:"cascader",overHidden:!0,multiple:!0,emitPath:!0,rules:[{required:!0,message:"请选择干线不支持包裹类型",trigger:"change"}],dicData:[],formatter:i=>i.nonsupportProductTypeListDesc},{label:"归属仓库",prop:"warehouseId",type:"select",dicData:[],html:!0,formatter:i=>i.warehouseName,rules:[{required:!0,message:"请选择归属苍库",trigger:"change"}]},{label:"运输时效",prop:"logisticsTime",html:!0,formatter:i=>`${i.logisticsTimeMin||0}-${i.logisticsTimeMax||0}天`,rules:[{required:!0,trigger:"blur",validator:(i,e,s)=>{const{logisticsTimeMin:o,logisticsTimeMax:t}=this.form;!Number(o)||!Number(t)?s(new Error("请设置运输时效")):Number(o)>=Number(t)?s(new Error("结束时间必须大于开始时间")):s()}}]},{label:"排序",prop:"logisticsLineSort",rules:[{required:!0,message:"请输入物流干线名称",trigger:"blur"}]},{label:"包裹限制",prop:"packageLimit",hide:!0,rules:[{required:!0,trigger:"change",validator:(i,e,s)=>{const{packageWeightMin:o,packageWeightMax:t,sizeLimit:u,volumeChargeLimit:h}=this.form;!o||!t||!u||!h?s(new Error("请输入完整包裹限制数据")):Number(o)>=Number(t)&&s(new Error("最高限制重量必须大于最低限制重量")),s()}}]},{label:"包裹体积限制",prop:"volumeLimit",hide:!0},{label:"状态",prop:"logisticsLineStatus",type:"select",search:!0,editDisplay:!1,addDisplay:!1,dicData:[{label:"已停用",value:0},{label:"使用中",value:1}]},{label:"是否免税",prop:"includeTaxes",hide:!0,type:"checkbox",dicData:[{label:"",value:1}],control:(i,e)=>i.length?{isPrepaidTax:{display:!1},taxReportingRatio:{display:!1}}:{isPrepaidTax:{display:!0},taxReportingRatio:{display:!0}}},{label:"是否预收税",prop:"isPrepaidTax",display:!0,hide:!0,type:"switch",value:0,dicData:[{label:"关",value:0},{label:"开",value:1}]},{label:"报税比例",prop:"taxReportingRatio",type:"number",display:!0,hide:!0,rules:[{required:!1,message:"请输入报税比例",trigger:"blur"}],formatter:i=>i.taxReportingRatio?`${i.taxReportingRatio}%`:""},{label:"系统货值申报比例",prop:"cargoValueRatio",type:"number",hide:!0,rules:[{required:!1,message:"请输入系统货值申报比例",trigger:"blur"}],formatter:i=>i.cargoValueRatio?`${i.cargoValueRatio}%`:""},{label:"申报金额限制",prop:"declarationAmountLimit",type:"number",hide:!0,rules:[{required:!1,trigger:"blur",validator:(i,e,s)=>{const{declarationAmountMinLimit:o,declarationAmountMaxLimit:t}=this.form;Number(o)>=Number(t)?s(new Error("最大申报金额必须大于最小申报金额")):s()}}]},{label:"是否允许使用转运商家折扣",prop:"useTransportDiscount",hide:!0,type:"checkbox",dicData:[{label:"",value:1}]},{label:"计费方式说明",prop:"volumeWeightDesc",hide:!0,overHidden:!0,type:"textarea",rules:[{required:!0,message:"请输入计费方式说明",trigger:"blur"}]},{label:"干线说明",prop:"logisticsLineDesc",overHidden:!0,type:"textarea",rules:[{required:!0,message:"请输入干线说明",trigger:"blur"}]},{label:"是否配置保险",prop:"configureInsurance",hide:!0,type:"checkbox",dicData:[{label:"",value:1}]},{label:"干线保险说明",prop:"insuranceDesc",overHidden:!0,type:"textarea",rules:[{required:!0,message:"请输入干线保险说明",trigger:"blur"}]}]},page:{pageSize:10,currentPage:1,total:0},outLineIdList:[],outLineInfo:{title:"",code:""},logisticsLineId:null,showPop:!1}},computed:{...B({areaList:i=>i.logistics.areaList,warehouseList:i=>i.logistics.warehouseList,productTypeList:i=>i.logistics.productTypeList})},watch:{"warehouseList.length":{handler(){this.findObject(this.option.column,"warehouseId").dicData=this.warehouseList},deep:!0,immediate:!0},"productTypeList.length":{handler(){this.findObject(this.option.column,"nonsupportProductTypeList").dicData=this.productTypeList},deep:!0,immediate:!0}},created(){},mounted(){this.getLogustucsIds(),this.getAreaList(),this.getWarehouseList(),this.getProductTypeList()},methods:{...O(["getAreaList","getWarehouseList","getProductTypeList"]),getLogustucsIds(){G().then(i=>{this.outLineIdList=i.data||[]})},outLineIdChange(){this.form.outLineId?this.outLineIdList.some(i=>{if(i.channelId===this.form.outLineId){this.outLineInfo=i;const e=(i.packageTypeVOList||[]).map(s=>s.id);return this.findObject(this.option.column,"logisticsLineType").dicData=i.packageTypeVOList.map(s=>({label:s.title,value:s.id})),this.form.logisticsLineType=e,!0}}):this.form.logisticsLineType=[]},searchChange(i,e){this.query=i,this.page.currentPage=1,this.onLoad(this.page,i),e()},searchReset(){this.search={},this.query={},this.onLoad(this.page)},currentChange(i){this.page.currentPage=i},sizeChange(i){this.page.pageSize=i},refreshChange(){this.onLoad(this.page,this.query)},onLoad(i,e={}){this.loading=!0;const s={pageNo:i.currentPage,pageSize:i.pageSize,...Object.assign(e,this.query)};j(s).then(o=>{if(o&&o.data){const t=o.data;this.page.total=o.total,this.data=(t||[]).map(u=>this.handleData(u)),this.loading=!1}})},handleData(i={}){if(i.productSizeDesc="",i.productSize){const{weight:e,length:s,width:o,height:t}=i.productSize;e&&(i.productSizeDesc=`重量：${e}克；`),s&&(i.productSizeDesc=`${i.productSizeDesc}长度：${s}CM；`),o&&(i.productSizeDesc=`${i.productSizeDesc}宽度：${o}CM；`),t&&(i.productSizeDesc=`${i.productSizeDesc}高度：${t}CM；`)}else i.productSize={};return i.isPrepaidTax=i.isPrepaidTax??0,i.packageLengthLimit=i.packageLengthLimit||void 0,i.packageWidthLimit=i.packageWidthLimit||void 0,i.packageHeightLimit=i.packageHeightLimit||void 0,i.packageSideLengthSumLimit=i.packageSideLengthSumLimit||void 0,i.packageGirthLimit=i.packageGirthLimit||void 0,i.productPriceHandled=v(i.productPrice,{sign:"￥"}),i.productOriginalPriceHandled=v(i.productOriginalPrice,{sign:"￥"}),i.declarationAmountMinLimit=i.declarationAmountMinLimit?(i.declarationAmountMinLimit/100).toFixed(2):void 0,i.declarationAmountMaxLimit=i.declarationAmountMaxLimit?(i.declarationAmountMaxLimit/100).toFixed(2):void 0,i.configureInsurance?i.configureInsurance=[1]:i.configureInsurance=[],i.includeTaxes?i.includeTaxes=[1]:i.includeTaxes=[],i.useTransportDiscount?i.useTransportDiscount=[1]:i.useTransportDiscount=[],i},rowSave(i,e,s){this.loading=!0;const o={...i};if(o.nonsupportProductTypeList||delete o.nonsupportProductTypeList,delete o.outLineId,o.configureInsurance.length?o.configureInsurance=1:o.configureInsurance=0,o.includeTaxes.length?o.includeTaxes=1:o.includeTaxes=0,o.useTransportDiscount.length?o.useTransportDiscount=1:o.useTransportDiscount=0,o.declarationAmountMinLimit&&(o.declarationAmountMinLimit=T(o.declarationAmountMinLimit)),o.declarationAmountMaxLimit&&(o.declarationAmountMaxLimit=T(o.declarationAmountMaxLimit)),!o.includeTaxes&&!o.taxReportingRatio){this.$message.error("请填写报税比例"),this.loading=!1,s();return}M(o).then(()=>{e(),this.onLoad(this.page),this.$message.success("操作成功!")}).finally(()=>{s()})},rowUpdate(i,e,s,o){this.loading=!0;const t={...i};if(t.editCanEmpty=!0,t.nonsupportProductTypeList||delete t.nonsupportProductTypeList,delete t.outLineId,t.configureInsurance.length?t.configureInsurance=1:t.configureInsurance=0,t.includeTaxes.length?t.includeTaxes=1:t.includeTaxes=0,t.useTransportDiscount.length?t.useTransportDiscount=1:t.useTransportDiscount=0,!t.includeTaxes&&!t.taxReportingRatio){this.$message.error("请填写报税比例"),this.loading=!1,o();return}t.includeTaxes&&(t.taxReportingRatio=0),t.declarationAmountMinLimit&&(t.declarationAmountMinLimit=T(t.declarationAmountMinLimit)),t.declarationAmountMaxLimit&&(t.declarationAmountMaxLimit=T(t.declarationAmountMaxLimit)),M(t).then(()=>{s(),this.onLoad(this.page),this.$message.success("操作成功!")}).finally(()=>{o()})},rowDel(i){this.$confirm("确定将选择数据删除?",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(()=>{const e={logisticsLineId:i.logisticsLineId};return E(e)}).then(()=>{this.onLoad(this.page),this.$message.success("操作成功!")})},toUpdateStatus(i){const{logisticsLineStatus:e}=i;this.$confirm(`是否确认${e?"停用":"启用"}该物流干线？`,{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(async()=>{const s={...i,logisticsLineStatus:e===1?0:1},{data:o={}}=await H(s);this.onLoad(this.page),this.$message.success("操作成功!")}).catch(()=>{})},beforeOpen(i,e){if(["edit","view"].includes(e)){const s={logisticsLineId:this.form.logisticsLineId};W(s).then(o=>{this.form=this.handleData(o.data),this.outLineIdChange()})}i()},bindLine(i){let e="绑定外部干线";i.outLineId&&(e="编辑外部干线"),this.$refs.refBindLineDialog.show({title:e,...i})},toSetCost(i){this.$router.push(`/logisticsCost?id=${i}`)},closeFreightCalculationPop(){this.showPop=!1}}},re={class:"basic-container"},se={class:"package-limit"},ne={class:"package-limit"},ae={class:"package-limit"},ue={class:"package-limit package-limit2"},de={class:"package-limit package-limit2"},pe={class:"package-limit package-limit2"},me={class:"package-limit package-limit2"},ce={class:"package-limit package-limit2"},ge={class:"label"};function fe(i,e,s,o,t,u){const h=p("el-cascader"),f=p("el-form-item"),b=p("el-form"),y=p("el-option"),V=p("el-select"),m=p("el-input-number"),g=p("el-input"),R=p("el-tooltip"),I=p("el-button"),U=p("avue-crud"),_=p("FreightCalculation"),A=p("BindLineDialog");return L(),D("div",re,[l(U,{option:t.option,"table-loading":t.loading,data:t.data,search:t.search,modelValue:t.form,"onUpdate:modelValue":e[18]||(e[18]=r=>t.form=r),page:t.page,"before-open":u.beforeOpen,onRowDel:u.rowDel,onRowUpdate:u.rowUpdate,onRowSave:u.rowSave,onSearchChange:u.searchChange,onSearchReset:u.searchReset,onCurrentChange:u.currentChange,onSizeChange:u.sizeChange,onRefreshChange:u.refreshChange,onOnLoad:u.onLoad},{search:n(({size:r})=>[l(b,{model:t.search,size:r,"label-width":"120px"},{default:n(()=>[(L(),w(f,{label:"覆盖区域:",key:1},{default:n(()=>[l(h,{modelValue:t.search.areaLibraryIdList,"onUpdate:modelValue":e[0]||(e[0]=c=>t.search.areaLibraryIdList=c),placeholder:"请选择",options:i.areaList,props:{multiple:!0,value:"id",label:"areaName"},filterable:"",clearable:"",style:{width:"100%"}},null,8,["modelValue","options"])]),_:1}))]),_:2},1032,["model","size"])]),"outLineId-form":n(()=>[l(V,{placeholder:"请选择 外部物流干线",modelValue:t.form.outLineId,"onUpdate:modelValue":e[1]||(e[1]=r=>t.form.outLineId=r),onChange:u.outLineIdChange},{default:n(()=>[(L(!0),D(Y,null,Z(t.outLineIdList,r=>(L(),w(y,{key:r.channelId,label:r.title,value:r.channelId},null,8,["label","value"]))),128))]),_:1},8,["modelValue","onChange"]),a("span",null,"线路code："+x(t.outLineInfo.code||"--"),1)]),"packageLimit-form":n(()=>[a("div",se,[e[19]||(e[19]=a("div",{class:"label"},"最低限制",-1)),l(m,{modelValue:t.form.packageWeightMin,"onUpdate:modelValue":e[2]||(e[2]=r=>t.form.packageWeightMin=r),precision:0,controls:!1,placeholder:"请输入"},null,8,["modelValue"]),e[20]||(e[20]=d("  g，最高限制  ")),l(m,{modelValue:t.form.packageWeightMax,"onUpdate:modelValue":e[3]||(e[3]=r=>t.form.packageWeightMax=r),precision:0,controls:!1,placeholder:"请输入"},null,8,["modelValue"]),e[21]||(e[21]=d("  g "))]),a("div",ne,[e[22]||(e[22]=a("div",{class:"label"},"尺寸限制",-1)),l(g,{modelValue:t.form.sizeLimit,"onUpdate:modelValue":e[4]||(e[4]=r=>t.form.sizeLimit=r),type:"textarea",rows:2,resize:"nono",placeholder:"请输入"},null,8,["modelValue"])]),a("div",ae,[e[23]||(e[23]=a("div",{class:"label"},"体积计费限制",-1)),l(g,{modelValue:t.form.volumeChargeLimit,"onUpdate:modelValue":e[5]||(e[5]=r=>t.form.volumeChargeLimit=r),type:"textarea",rows:2,resize:"nono",placeholder:"请输入"},null,8,["modelValue"])])]),"volumeLimit-form":n(()=>[a("div",ue,[e[24]||(e[24]=a("div",{class:"label"},"第一长边最大限制 ",-1)),l(m,{modelValue:t.form.packageLengthLimit,"onUpdate:modelValue":e[6]||(e[6]=r=>t.form.packageLengthLimit=r),precision:0,controls:!1,placeholder:"请输入"},null,8,["modelValue"]),e[25]||(e[25]=d("  cm "))]),a("div",de,[e[26]||(e[26]=a("div",{class:"label"},"第二长边最大限制 ",-1)),l(m,{modelValue:t.form.packageWidthLimit,"onUpdate:modelValue":e[7]||(e[7]=r=>t.form.packageWidthLimit=r),precision:0,controls:!1,placeholder:"请输入"},null,8,["modelValue"]),e[27]||(e[27]=d("  cm "))]),a("div",pe,[e[28]||(e[28]=a("div",{class:"label"},"第三长边最大限制 ",-1)),l(m,{modelValue:t.form.packageHeightLimit,"onUpdate:modelValue":e[8]||(e[8]=r=>t.form.packageHeightLimit=r),precision:0,controls:!1,placeholder:"请输入"},null,8,["modelValue"]),e[29]||(e[29]=d("  cm "))]),a("div",me,[e[30]||(e[30]=a("div",{class:"label"},"三边长最大限制 ",-1)),l(m,{modelValue:t.form.packageSideLengthSumLimit,"onUpdate:modelValue":e[9]||(e[9]=r=>t.form.packageSideLengthSumLimit=r),precision:0,controls:!1,placeholder:"请输入"},null,8,["modelValue"]),e[31]||(e[31]=d("  cm "))]),a("div",ce,[a("div",ge,[e[33]||(e[33]=d(" 围长最大限制 ")),l(R,{class:"item",effect:"dark",content:"长+（宽+高）*2",placement:"top"},{default:n(()=>e[32]||(e[32]=[a("i",{class:"el-icon-question"},null,-1)])),_:1}),e[34]||(e[34]=d("  "))]),l(m,{modelValue:t.form.packageGirthLimit,"onUpdate:modelValue":e[10]||(e[10]=r=>t.form.packageGirthLimit=r),precision:0,controls:!1,placeholder:"请输入"},null,8,["modelValue"]),e[35]||(e[35]=d("  cm "))])]),"cargoValueRatio-form":n(({type:r})=>[l(m,{modelValue:t.form.cargoValueRatio,"onUpdate:modelValue":e[11]||(e[11]=c=>t.form.cargoValueRatio=c),min:0,precision:2,disabled:r==="view",class:"my-el-input-number",style:{width:"50%"},controls:!1,"data-unit":"%"},null,8,["modelValue","disabled"])]),"taxReportingRatio-form":n(({type:r})=>[l(m,{modelValue:t.form.taxReportingRatio,"onUpdate:modelValue":e[12]||(e[12]=c=>t.form.taxReportingRatio=c),min:0,precision:2,disabled:r==="view",class:"my-el-input-number",style:{width:"50%"},controls:!1,"data-unit":"%"},null,8,["modelValue","disabled"])]),"nonsupportProductTypeList11-form":n(({type:r})=>[l(h,{disabled:r==="view"||t.loading,modelValue:t.form.nonsupportProductTypeList,"onUpdate:modelValue":e[13]||(e[13]=c=>t.form.nonsupportProductTypeList=c),placeholder:"请选择",options:i.productTypeList,filterable:"",clearable:""},null,8,["disabled","modelValue","options"])]),"logisticsTime-form":n(({type:r})=>[l(g,{disabled:r==="view"||t.loading,modelValue:t.form.logisticsTimeMin,"onUpdate:modelValue":e[14]||(e[14]=c=>t.form.logisticsTimeMin=c),class:"w40b"},{default:n(()=>e[36]||(e[36]=[a("template",{slot:"append"},[d("天")],-1)])),_:2},1032,["disabled","modelValue"]),e[38]||(e[38]=a("span",null," —— ",-1)),l(g,{disabled:r==="view"||t.loading,modelValue:t.form.logisticsTimeMax,"onUpdate:modelValue":e[15]||(e[15]=c=>t.form.logisticsTimeMax=c),class:"w40b"},{default:n(()=>e[37]||(e[37]=[a("template",{slot:"append"},[d("天")],-1)])),_:2},1032,["disabled","modelValue"])]),"declarationAmountLimit-form":n(({type:r})=>[l(m,{modelValue:t.form.declarationAmountMinLimit,"onUpdate:modelValue":e[16]||(e[16]=c=>t.form.declarationAmountMinLimit=c),precision:2,class:"w40b my-el-input-number","data-unit":"USD",controls:!1,placeholder:"请输入最小申报金额"},null,8,["modelValue"]),e[39]||(e[39]=a("span",null," —— ",-1)),l(m,{modelValue:t.form.declarationAmountMaxLimit,"onUpdate:modelValue":e[17]||(e[17]=c=>t.form.declarationAmountMaxLimit=c),precision:2,class:"w40b my-el-input-number","data-unit":"USD",controls:!1,placeholder:"请输入最大申报金额"},null,8,["modelValue"])]),menu:n((r,c)=>[l(I,{type:"text",icon:"el-icon-refresh",onClick:k(C=>u.toUpdateStatus(r.row),["stop"])},{default:n(()=>[d(x(r.row.logisticsLineStatus?"停用":"启用"),1)]),_:2},1032,["onClick"]),l(I,{type:"text",icon:"el-icon-collection-tag",onClick:k(C=>u.bindLine(r.row),["stop"])},{default:n(()=>[d(x(r.row.outLineId?"编辑":"绑定")+"外部干线",1)]),_:2},1032,["onClick"]),l(I,{type:"text",icon:"el-icon-edit-outline",onClick:k(C=>u.toSetCost(r.row.logisticsLineId),["stop"])},{default:n(()=>e[40]||(e[40]=[d("费用设置")])),_:2},1032,["onClick"]),r.row.areaLibraryNameListDesc?(L(),w(I,{key:0,type:"text",icon:"el-icon-truck",onClick:k(C=>{t.showPop=!0,t.logisticsLineId=r.row.logisticsLineId},["stop"])},{default:n(()=>e[41]||(e[41]=[d("运费测算")])),_:2},1032,["onClick"])):S("",!0)]),_:1},8,["option","table-loading","data","search","modelValue","page","before-open","onRowDel","onRowUpdate","onRowSave","onSearchChange","onSearchReset","onCurrentChange","onSizeChange","onRefreshChange","onOnLoad"]),t.showPop?(L(),w(_,{key:0,showPop:t.showPop,logisticsLineId:t.logisticsLineId,onOnSubmit:u.refreshChange,onClose:u.closeFreightCalculationPop},null,8,["showPop","logisticsLineId","onOnSubmit","onClose"])):S("",!0),l(A,{ref:"refBindLineDialog"},null,512)])}const Ve=P(le,[["render",fe],["__scopeId","data-v-e1c597bd"]]);export{Ve as default};
