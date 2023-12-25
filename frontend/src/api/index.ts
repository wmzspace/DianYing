import { Message } from '@arco-design/web-vue'
import { reject } from 'lodash-es'

// export const prefix_url = 'http://127.0.0.1:5000/'
// export const prefix_url = 'http://192.168.1.104:5000/'
export const prefix_url = 'http://wmzspace.space/'
// export const prefix_url = './'
// export const prefix_url = 'http://192.168.1.104:5000/'
// export const prefix_url = 'http://server.wmzspace.space:5000/'
// export const prefix_url = 'https://www.wmzspace.space/web2_cwk2/'

export interface AjaxResponse {
  ajax_data: object
  ajax_msg: string
  ajax_ok: boolean
}
