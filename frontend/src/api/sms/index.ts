// http://youlanjihua.com/youlanApi/v1/phonecode/send.php?secret={your secret}&phone={phone}
// http://youlanjihua.com/youlanApi/v1/phonecode/validate.php?secret={your secret}&requestId={requestId}&code={短信验证码}
import { reject } from 'lodash-es'

const SECRET_KEY = 'rlj3r210'

interface GetCaptchaResponse {
  data: {
    requestId: string
  }
  success: boolean
  code: number
  msg: string
}

interface ValidateCaptchaResponse {
  success: boolean
  code: number
  msg: string
}

const getCaptchaCode = (phone: number) =>
  new Promise<GetCaptchaResponse>((resolve, reject) => {
    fetch(
      `http://youlanjihua.com/youlanApi/v1/phonecode/send.php?secret=${SECRET_KEY}&phone=${phone}`,
      {
        method: 'GET'
      }
    ).then((res) => {
      if (res.ok) {
        res.json().then((resData: GetCaptchaResponse) => {
          if (resData.success) {
            resolve(resData)
          } else {
            reject(resData.msg)
          }
        })
      }
    })
  })

const validateCaptchaCode = (requestId: number, code: number) =>
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
