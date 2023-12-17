// import Mock from 'mockjs'
// import setupMock, { successResponseWrap } from '@/utils/setup-mock'
//
// setupMock({
//   setup() {
//     Mock.mock(new RegExp('/api/user/save-info'), () => {
//       return successResponseWrap('ok')
//     })
//     Mock.mock(new RegExp('/api/user/certification'), () => {
//       return successResponseWrap({
//         enterpriseInfo: {
//           accountType: '企业账号',
//           status: 0,
//           time: '2018-10-22 14:53:12',
//           legalPerson: '李**',
//           certificateType: '中国身份证',
//           authenticationNumber: '130************123',
//           enterpriseName: '低调有实力的企业',
//           enterpriseCertificateType: '企业营业执照',
//           organizationCode: '7*******9'
//         },
//         record: [
//           {
//             certificationType: 1,
//             certificationContent: '企业实名认证，法人姓名：李**',
//             status: 0,
//             time: '2021-02-28 10:30:50'
//           },
//           {
//             certificationType: 1,
//             certificationContent: '企业实名认证，法人姓名：李**',
//             status: 1,
//             time: '2020-05-13 08:00:00'
//           }
//         ]
//       })
//     })
//     Mock.mock(new RegExp('/api/user/upload'), () => {
//       return successResponseWrap('ok')
//     })
//   }
// })

export const areas = [
  {
    label: '中国',
    value: 'China',
    children: [
      { label: '北京', value: '北京' },
      { label: '天津', value: '天津' },
      { label: '上海', value: '上海' },
      { label: '重庆', value: '重庆' },
      { label: '河北', value: '河北' },
      { label: '山西', value: '山西' },
      { label: '内蒙古', value: '内蒙古' },
      { label: '辽宁', value: '辽宁' },
      { label: '吉林', value: '吉林' },
      { label: '黑龙江', value: '黑龙江' },
      { label: '江苏', value: '江苏' },
      { label: '浙江', value: '浙江' },
      { label: '安徽', value: '安徽' },
      { label: '福建', value: '福建' },
      { label: '江西', value: '江西' },
      { label: '山东', value: '山东' },
      { label: '河南', value: '河南' },
      { label: '湖北', value: '湖北' },
      { label: '湖南', value: '湖南' },
      { label: '广东', value: '广东' },
      { label: '广西', value: '广西' },
      { label: '海南', value: '海南' },
      { label: '四川', value: '四川' },
      { label: '贵州', value: '贵州' },
      { label: '云南', value: '云南' },
      { label: '西藏', value: '西藏' },
      { label: '陕西', value: '陕西' },
      { label: '甘肃', value: '甘肃' },
      { label: '青海', value: '青海' },
      { label: '宁夏', value: '宁夏' },
      { label: '新疆', value: '新疆' },
      { label: '台湾', value: '台湾' },
      { label: '香港', value: '香港' },
      { label: '澳门', value: '澳门' }
    ]
  }
]
