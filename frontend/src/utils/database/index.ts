import { type AjaxResponse, prefix_url } from '@/api'
import { reject } from 'lodash-es'
import _ from 'lodash'
import { Message } from '@arco-design/web-vue'
import type { LogRecord } from '@/api/list'

export interface BackupRecord {
  id: number
  name: string
  path: string
  createTime: string
}

export interface BackupRecordRaw {
  id: number
  name: string
  path: string
  create_time: string
}

export const getDbBackup = () =>
  new Promise<BackupRecord[]>((resolve) => {
    fetch(prefix_url.concat('database/get/backup'), {
      method: 'GET'
    })
      .then((res) => {
        if (res.ok) {
          res.json().then((data: BackupRecordRaw[]) => {
            const results: BackupRecord[] = []
            for (const rawRecord of data) {
              const record: BackupRecord = {
                createTime: rawRecord.create_time,
                id: rawRecord.id,
                name: rawRecord.name,
                path: rawRecord.path
              }
              results.push(record)
            }
            resolve(results)
          })
        } else {
          reject(res.statusText)
        }
      })
      .catch((e) => {
        reject(e.message)
      })
  })

export const resetDatabase = () =>
  new Promise<void>((resolve, reject) => {
    fetch(prefix_url.concat('database/force/rollback'), {
      method: 'POST'
    })
      .then((res) => {
        if (res.ok) {
          res.json().then((ajaxData: AjaxResponse) => {
            if (ajaxData.ajax_ok) {
              Message.success(ajaxData.ajax_msg)
              resolve()
            } else {
              reject(ajaxData.ajax_msg)
            }
          })
        } else {
          reject(res.statusText)
        }
      })
      .catch((e) => {
        reject(e.message)
      })
  })

export const rollBackDatabase = async (name: string) =>
  new Promise<void>((resolve, reject) => {
    fetch(prefix_url.concat(`database/rollback?name=${name}`))
      .then((res) => {
        if (res.ok) {
          res.json().then((ajaxData: AjaxResponse) => {
            if (ajaxData.ajax_ok) {
              Message.success(ajaxData.ajax_msg)
              resolve()
            } else {
              reject(ajaxData.ajax_msg)
            }
          })
        } else {
          reject(res.statusText)
        }
      })
      .catch((e) => {
        reject(e.message)
      })
  })

export const deleteBackup = async (name: string) =>
  new Promise<void>((resolve, reject) => {
    fetch(prefix_url.concat(`database/delete?name=${name}`))
      .then((res) => {
        if (res.ok) {
          res.json().then((ajaxData: AjaxResponse) => {
            if (ajaxData.ajax_ok) {
              Message.success(ajaxData.ajax_msg)
              resolve()
            } else {
              reject(ajaxData.ajax_msg)
            }
          })
        } else {
          reject(res.statusText)
        }
      })
      .catch((e) => {
        reject(e.message)
      })
  })

export const createBackup = async (name: string) =>
  new Promise<void>((resolve, reject) => {
    fetch(prefix_url.concat(`database/create?name=${name}`))
      .then((res) => {
        if (res.ok) {
          res.json().then((ajaxData: AjaxResponse) => {
            if (ajaxData.ajax_ok) {
              Message.success(ajaxData.ajax_msg)
              resolve()
            } else {
              reject(ajaxData.ajax_msg)
            }
          })
        } else {
          reject(res.statusText)
        }
      })
      .catch((e) => {
        reject(e.message)
      })
  })

interface LogRecordRaw {
  id: number
  operation: string
  target: string
  record_value: string
  timestamp: string
}

export const getDbLog = () =>
  new Promise<LogRecord[]>((resolve) => {
    fetch(prefix_url.concat('database/logs'), {
      method: 'GET'
    })
      .then((res) => {
        if (res.ok) {
          res.json().then((data: LogRecordRaw[]) => {
            const results: LogRecord[] = []
            for (const rawRecord of data) {
              const record: LogRecord = {
                timestamp: rawRecord.timestamp,
                id: rawRecord.id,
                operation: rawRecord.operation,
                target: rawRecord.target,
                recordValue: parseRecordValue(rawRecord.record_value)
              }
              results.push(record)
            }
            resolve(results.reverse())
          })
        } else {
          reject(res.statusText)
        }
      })
      .catch((e) => {
        reject(e.message)
      })
  })

export const deleteAllLogs = () =>
  new Promise<void>((resolve, reject) => {
    fetch(prefix_url.concat(`database/delete/logs`), {
      method: 'POST'
    })
      .then((res) => {
        if (res.ok) {
          res.json().then((ajaxData: AjaxResponse) => {
            if (ajaxData.ajax_ok) {
              Message.success({
                id: 'deleteLog',
                content: ajaxData.ajax_msg
              })
              resolve()
            } else {
              reject(ajaxData.ajax_msg)
            }
          })
        } else {
          reject(res.statusText)
        }
      })
      .catch((e) => {
        reject(e.message)
      })
  })

export const parseRecordValue = (rawValue: string): string => {
  // 将字符串中的单引号替换为双引号，以便进行 JSON 解析
  // const jsonString = rawValue.replace(/'/g, '"')
  // console.log(jsonString)
  // 解析 JSON 字符串
  const parsedObject = JSON.parse(rawValue)

  // 构建按行显示每个属性的字符串
  let resultString = '(属性名: 记录值)\n'
  for (const [key, value] of Object.entries(parsedObject)) {
    resultString += `${key}: ${value}\n`
  }

  return resultString

  // return JSON.stringify(parsedObject, null, 2)
}
