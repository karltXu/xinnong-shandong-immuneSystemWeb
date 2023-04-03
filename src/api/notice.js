import request from '@/utils/request'

const api = {
  List: '/adminapi/v1/notification/get_list',
  Detail: '/adminapi/v1/notification/'
}

// 获取专家列表
export function getNoticeList(parameter) {
  return request({
    url: api.List,
    method: 'get',
    params: parameter
  })
}

export function setNoticeDoread(parameter) {
  return request({
    url: api.Detail + parameter + '/do_read',
    method: 'post'
  })
}
