// http://youlanjihua.com/youlanApi/v1/emailcode/send.php?secret={your secret}&email={email}
// http://youlanjihua.com/youlanApi/v1/emailcode/validate.php?secret={your secret}&requestId={requestId}&code={短信验证码}
import { reject } from 'lodash-es'
import { prefix_url } from '@/api'
import type { AjaxResponse } from '@/api'
import { Message } from '@arco-design/web-vue'
const SECRET_KEY = 'rlj3r210'

export interface GetCaptchaResponse {
  data: {
    requestId: string
  }
  success: boolean
  code: number
  msg: string
}

export const getCaptchaCode = (email: string) =>
  new Promise<void>((resolve, reject) => {
    fetch(prefix_url + `/email/send?email=${email}`, {
      method: 'POST'
    }).then((res) => {
      if (res.ok) {
        res.json().then((ajaxData: AjaxResponse) => {
          if (ajaxData.ajax_ok) {
            Message.success({
              id: 'loginRes',
              content: ajaxData.ajax_msg
            })
            resolve()
          } else {
            reject(ajaxData.ajax_msg)
          }
        })
      }
    })
  })

export interface ValidateCaptchaResponse {
  isNew: boolean
  id: number
}
export const validateCaptchaCode = (email: string, code: number | string) =>
  new Promise<number>((resolve, reject) => {
    fetch(prefix_url + `/email/validate?email=${email}&code=${code}`, {
      method: 'POST'
    })
      .then((res) => {
        if (res.ok) {
          res.json().then((ajaxData: AjaxResponse) => {
            if (ajaxData.ajax_ok) {
              const resData = ajaxData.ajax_data as ValidateCaptchaResponse
              if (resData.isNew) {
                Message.success(`恭喜注册成功，并成为第${resData.id}名点映成员~`)
              } else {
                Message.success(`登录成功`)
              }
              resolve(resData.id)
            } else {
              reject(ajaxData.ajax_msg)
            }
          })
        }
      })
      .catch((e) => {
        Message.error({
          id: 'loginRes',
          content: e.message
        })
      })
  })

export const checkEmail = (email: string | undefined) => {
  if (email === undefined) {
    return false
  }

  if (email.length == 0) {
    return false
  }
  const reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
  return reg.test(email)
}
export const checkCaptchaCode = (code: number | string | undefined) => {
  if (code === undefined) {
    return false
  }
  if (typeof code === 'number') {
    code = code.toString()
  }
  if (code.length == 0) {
    return false
  }
  const reg = /^\d{6}$/
  return reg.test(code)
}
