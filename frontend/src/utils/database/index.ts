import { type AjaxResponse, prefix_url } from '@/api'
import { reject } from 'lodash-es'
import _ from 'lodash'
import { Message } from '@arco-design/web-vue'

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
