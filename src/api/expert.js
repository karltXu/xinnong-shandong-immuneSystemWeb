import request from '@/utils/request'

const api = {
  List: '/adminapi/v1/expert/get_list',
  Detail: '/adminapi/v1/expert/',
  Create: '/adminapi/v1/expert/create',
  Update: '/adminapi/v1/expert/',
  Disable: '/adminapi/v1/expert/',
  Delete: '/adminapi/v1/expert/',
  Options: '/adminapi/v1/expert/get_options'
}

// 获取专家列表
export function getExpertList(parameter) {
  return request({
    url: api.List,
    method: 'get',
    params: parameter
  })
}

export function getExpertOptions() {
  return request({
    url: api.Options,
    method: 'get'
  })
}

export function getExpertDetail(parameter) {
  return request({
    url: api.Detail + parameter + '/detail',
    method: 'get'
  })
}

export function CreateExpert(parameter) {
  return request({
    url: api.Create,
    method: 'post',
    data: parameter
  })
}

export function UpdateExpert(parameter) {
  return request({
    url: api.Update + parameter.id + '/update',
    method: 'post',
    data: parameter
  })
}

export function DisableExpert(parameter) {
  return request({
    url: api.Disable + parameter + '/disable',
    method: 'post'
  })
}

export function DeleteExpert(parameter) {
  return request({
    url: api.Disable + parameter,
    method: 'delete'
  })
}
