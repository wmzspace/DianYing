import { Dayjs } from 'dayjs'

export type Income = Transaction

export type Expenditure = Transaction

interface Transaction {
  id: number
  name: string
  amount: number
  type: number
  time: string
}

export interface TransactionType {
  id: number
  name: string
}

// export interface Expenditure {
//   id: number;
//   name: string;
//   amount: number;
// }

export interface AddTypeDataItem {
  type: string
  name: string
}

export interface DataItem {
  id: number // not unique
  key: string // is unique
  name: string
  type: TransactionType
  amount: number
  time: Dayjs
}

export interface BalanceGoal {
  id?: number
  name: string
  value: number
}

export interface ajaxResponse {
  ajax_data: object
  ajax_msg: string
  ajax_ok: boolean
}

export interface NotificationData {
  title: string
  time: Dayjs
  svg: any
  // img?: unknown;
}
