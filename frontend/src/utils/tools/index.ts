import dayjs, { Dayjs } from 'dayjs'
import type { NotificationData } from '@/types'
import { range, rest } from 'lodash-es'

const THOUSAND = Math.pow(10, 3)
const WAN = Math.pow(10, 4)
const MILLION = Math.pow(10, 6)
const YI = Math.pow(10, 8)
const BILLION = Math.pow(10, 9)

// export const debounce = (func: Function, delay: number) => {
//   let timerId: any
//
//   return function () {
//     clearTimeout(timerId)
//
//     timerId = setTimeout(() => {
//       func.apply(rest)
//       console.log(rest)
//     }, delay)
//   }
// }
export const simplifyNumber = (value: number, unit = 'EN') => {
  let prefix = ''
  if (value < 0) {
    value = Math.abs(value)
    prefix = '-'
  }
  if (unit === 'CN') {
    if (value >= YI * WAN) {
      return {
        value: prefix.concat('9999+'),
        unit: '亿',
        string: prefix.concat('9999+亿')
      }
    } else if (value >= YI) {
      return {
        value: prefix.concat((value / YI).toFixed(1)),
        unit: '亿',
        string: prefix.concat((value / YI).toFixed(1) + '亿')
      }
    } else if (value >= WAN) {
      return {
        value: prefix.concat((value / WAN).toFixed(1)),
        unit: '万',
        string: prefix.concat((value / WAN).toFixed(1) + '万')
      }
    } else {
      return {
        value: prefix.concat(value.toFixed(1)),
        unit: '',
        string: prefix.concat(value.toFixed(1) + '')
      }
    }
  } else {
    if (value >= BILLION * WAN) {
      return {
        value: prefix.concat('9999+'),
        unit: 'B',
        string: prefix.concat('9999+B')
      }
    } else if (value >= BILLION) {
      return {
        value: prefix.concat((value / BILLION).toFixed(1)),
        unit: 'B',
        string: prefix.concat((value / BILLION).toFixed(1) + 'B')
      }
    } else if (value >= MILLION) {
      return {
        value: prefix.concat((value / MILLION).toFixed(1)),
        unit: 'M',
        string: prefix.concat((value / MILLION).toFixed(1) + 'M')
      }
    } else if (value >= THOUSAND) {
      return {
        value: prefix.concat((value / THOUSAND).toFixed(1)),
        unit: 'K',
        string: prefix.concat((value / THOUSAND).toFixed(1) + 'K')
      }
    } else {
      return {
        value: prefix.concat(value.toFixed(1)),
        unit: '',
        string: prefix.concat(value.toFixed(1) + '')
      }
    }
  }
}

export const getTimeDiffUntilNow = (datetimeString: string) => {
  // 将日期时间字符串转换为日期对象
  const datetime = new Date(datetimeString)

  // 获取当前时间
  const now = new Date()

  // 计算时间差（以毫秒为单位）
  const timeDiff = now.getTime() - datetime.getTime()

  // 计算时间差对应的年、月、天、小时、分钟和秒数
  const seconds = Math.floor(timeDiff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  // 根据时间差返回相应的描述
  // if (years > 0) {
  //   return `${years}年前`
  // } else if (months > 0) {
  //   return `${months}个月前`
  // }
  if (days > 7) {
    return datetimeString
  } else if (days > 0) {
    return `${days}天前`
  } else if (hours > 0) {
    return `${hours}小时前`
  } else if (minutes > 0) {
    return `${minutes}分钟前`
  } else {
    return `${seconds}秒前`
  }
}

export const newNotificationData = (title: string): NotificationData => {
  return {
    title: title,
    time: dayjs(Date()),
    svg: `<svg width="20" height="20" viewBox="0 0 107 107" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
					<title>logo-spotify</title>
					<g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
						<g id="logo-spotify" fill="#2EBD59" fill-rule="nonzero">
							<path d="M53.5,0 C23.9517912,0 0,23.9517912 0,53.5 C0,83.0482088 23.9517912,107 53.5,107 C83.0482088,107 107,83.0482088 107,53.5 C107,23.9554418 83.0482088,0.00365063118 53.5,0 Z M78.0358922,77.1597407 C77.0757762,78.7368134 75.0204708,79.2296486 73.4506994,78.2695326 C60.8888775,70.5922552 45.0743432,68.8582054 26.4524736,73.1111907 C24.656363,73.523712 22.8675537,72.3993176 22.458683,70.6032071 C22.0461617,68.8070966 23.1669055,67.0182873 24.9666667,66.6094166 C45.3444899,61.9548618 62.8273627,63.9590583 76.9297509,72.5745479 C78.4995223,73.5419652 78.9996588,75.5899693 78.0358922,77.1597407 L78.0358922,77.1597407 Z M84.5814739,62.5973729 C83.373115,64.5614125 80.8030706,65.1747185 78.8426817,63.9700102 C64.4664961,55.1318321 42.5408052,52.5727397 25.5325145,57.7347322 C23.3275333,58.4027977 20.9984306,57.1579324 20.3267144,54.9566018 C19.6622996,52.7516206 20.9071648,50.4261685 23.1084954,49.7544524 C42.5371546,43.858683 66.6933811,46.7134766 83.2051859,56.8622313 C85.1692255,58.0705902 85.7898328,60.636984 84.5814739,62.5973729 Z M85.1436711,47.4253497 C67.8980894,37.1853292 39.4523712,36.2434664 22.9880246,41.2375299 C20.3449676,42.0406687 17.5485841,40.5475606 16.7490959,37.9045036 C15.9496076,35.2614466 17.4390652,32.4650631 20.0857728,31.6619243 C38.9850904,25.9267827 70.3987718,27.0329239 90.2509041,38.8171614 C92.627465,40.2299556 93.4087001,43.3001365 91.9995565,45.6730467 C90.5940635,48.0532583 87.5165814,48.838144 85.1436711,47.4253497 Z" id="Shape"></path>
						</g>
					</g>
				</svg>`
  }
}

// 禁止选择当时之后的时刻
export const disabledDateTime = (dates: Dayjs) => {
  const hours = dayjs().hour()
  const minutes = dayjs().minute()
  const seconds = dayjs().second()
  // 当日只能选择当前时间之后的时间点
  if (dates && dayjs(dates).date() === dayjs().date()) {
    if (dayjs(dates).hour() === dayjs().hour()) {
      return {
        disabledHours: () => range(hours + 1, 24),
        disabledMinutes: () => range(minutes + 1, 60),
        disabledSeconds: () => range(seconds + 1, 60)
      }
    } else {
      return {
        disabledHours: () => range(hours + 1, 24),
        disabledMinutes: () => [],
        disabledSeconds: () => []
      }
    }
  } else {
    return {
      disabledHours: () => [],
      disabledMinutes: () => [],
      disabledSeconds: () => []
    }
  }
}
