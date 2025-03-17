export const pointsTypeMap = [
  { label: "普通会员积分", value: 0, instructions: '每笔消费都可以获得对应积分' },
  { label: "活动会员积分", value: 1, instructions: '活动期间，每笔消费可以获得对应积' },
  { label: "会员成长值", value: 2, instructions: '用户寄送包裹获得成长值' },
  { label: "推广积分", value: 3, instructions: '推广下线寄送包裹获得推广佣金对应积分' },
];

export const calculatePriceTypeMap = [
  { label: "按首重续重计费", value: 1, instructions: '运费=首重费用+（包裹重量-首重）/ 续重单位重量*单价+服务费' },
];
