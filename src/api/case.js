import request from '@/utils/request'

const api = {
  List: '/adminapi/v1/case/get_list',
  Detail: '/adminapi/v1/case/',
  Create: '/adminapi/v1/case/create',
  Update: '/adminapi/v1/case/',
  Delete: '/adminapi/v1/case/',
  Options: '/adminapi/v1/case/get_options'
}

// 获取专家列表
export function getCaseList(parameter) {
  return request({
    url: api.List,
    method: 'get',
    params: parameter
  })
}

export function getCaseOptions() {
  return request({
    url: api.Options,
    method: 'get'
  })
}

export function getCaseDetail(parameter) {
  return request({
    url: api.Detail + parameter + '/detail',
    method: 'get'
  })
}

export function CreateCase(parameter) {
  return request({
    url: api.Create,
    method: 'post',
    data: parameter
  })
}

export function UpdateCase(parameter) {
  return request({
    url: api.Update + parameter.id + '/update',
    method: 'post',
    data: parameter
  })
}

export function DeleteCase(parameter) {
  return request({
    url: api.Delete + parameter,
    method: 'delete'
  })
}
