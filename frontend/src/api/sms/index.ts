// http://youlanjihua.com/youlanApi/v1/phonecode/send.php?secret={your secret}&phone={phone}
// http://youlanjihua.com/youlanApi/v1/phonecode/validate.php?secret={your secret}&requestId={requestId}&code={短信验证码}
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

export const getCaptchaCode = (phone: number) =>
  new Promise<GetCaptchaResponse>((resolve, reject) => {
    console.log('start send')
    // TODO
    fetch(
      `http://youlanjihua.com/youlanApi/v1/phonecode/send.php?secret=${SECRET_KEY}&phone=${phone}`,
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
      `http://youlanjihua.com/youlanApi/v1/phonecode/validate.php?secret=${SECRET_KEY}&requestId=${requestId}&code=${code}`,
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

export const checkTelephone = (telephone: number | string | undefined) => {
  if (telephone === undefined) {
    return false
  }
  if (typeof telephone === 'number') {
    telephone = telephone.toString()
  }
  if (telephone.length != 11) {
    return false
  }
  const reg = /^[1][3,4,5,7,8][0-9]{9}$/
  return reg.test(telephone)
}
