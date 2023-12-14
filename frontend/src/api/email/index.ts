// http://youlanjihua.com/youlanApi/v1/emailcode/send.php?secret={your secret}&email={email}
// http://youlanjihua.com/youlanApi/v1/emailcode/validate.php?secret={your secret}&requestId={requestId}&code={短信验证码}
import { reject } from 'lodash-es'

const SECRET_KEY = 'rlj3r210'

export interface GetCaptchaResponse {
  data: {
    requestId: string
  }
  success: boolean
  code: number
  msg: string
}

export interface ValidateCaptchaResponse {
  success: boolean
  code: number
  msg: string
}

export const getCaptchaCode = (email: number) =>
  new Promise<GetCaptchaResponse>((resolve, reject) => {
    console.log('start send')
    // TODO
    fetch(
      `http://youlanjihua.com/youlanApi/v1/emailcode/send.php?secret=${SECRET_KEY}&email=${email}`,
      {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        }
      }
    ).then((res) => {
      console.log('send end')
      console.log(res)
      if (res.ok) {
        res.json().then((resData: GetCaptchaResponse) => {
          if (resData.success) {
            console.log('resData', resData)
            resolve(resData)
          } else {
            reject(resData.msg)
          }
        })
      }
    })
  })

export const validateCaptchaCode = (requestId: number, code: number) =>
  new Promise<string>((resolve, reject) => {
    fetch(
      `http://youlanjihua.com/youlanApi/v1/emailcode/validate.php?secret=${SECRET_KEY}&requestId=${requestId}&code=${code}`,
      {
        method: 'GET'
      }
    ).then((res) => {
      if (res.ok) {
        res.json().then((resData: ValidateCaptchaResponse) => {
          if (resData.success) {
            resolve(resData.msg)
          } else {
            reject(resData.msg)
          }
        })
      }
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
