export interface ExpenseCategoryType {
  id: string;
  icon: any;
  name: string;
  color?: string;
}

export interface IncomeCategoryType {
  id: string;
  icon: any;
  name: string;
  color?: string;
}

export interface PaymentModeType {
  id: string;
  type: "bank" | "cash";
  name?: string;
  balance?: string;
}

export interface BankType {
  id: string;
  category: "bank";
  name: string;
  balance: string;
}

export type AddExpenseParams = {
  amount: number;
  categoryId: string;
  paymentModeId: string;
  date: Date;
  time: Date;
  note?: string;
  type?: string;
};

export type trxType = {
  id: number | string;
  amount: number | string;
  label?: string;
  date: string | Date;
  time: string | Date;
  note?: string;
  type?: string;
  category_id?: string;
  payment_mode_id?: number | string;
  categoryId?: string;
  paymentModeId?: string;
};
