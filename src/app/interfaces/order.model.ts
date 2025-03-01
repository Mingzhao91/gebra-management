import { Customer } from './customer.model';
import { DocUser } from './user.model';

export interface Order {
  id?: string;
  customer: Customer;
  orderSerialNumber: string; // 订单序列号
  quantity: number;
  products: {
    productModel: string; // 产品型号
    quantity: number;
    price: number;
  }[];
  total: number;
  packagingRequirements: string; // 包装要求
  bareMachineRequirements: string; // 裸机要求
  cartonRequirements: string; // 装箱要求
  plannedShippingDate: Date; // 计划发货日期
  actualShippingDate: Date; // 实际发货日期
  shippingChannel: string; // 运输渠道
  internationalLogistics: string; // 国际物流
  collectedShippingFee: number; // 收取运费
  actualShippingFee: number; // 实际运费
  notes: string; // 备注
  createdDate: Date;
  modifiedDate: Date;
  createdBy?: DocUser;
}
