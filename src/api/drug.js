import request from '@/utils/request'

const api = {
  List: '/adminapi/v1/drug/get_list',
  Detail: '/adminapi/v1/drug/',
  Create: '/adminapi/v1/drug/create',
  Update: '/adminapi/v1/drug/',
  Delete: '/adminapi/v1/drug/',
  Options: '/adminapi/v1/drug/get_options'
}

// 获取专家列表
export function getDrugList(parameter) {
  return request({
    url: api.List,
    method: 'get',
    params: parameter
  })
}

export function getDrugOptions() {
  return request({
    url: api.Options,
    method: 'get'
  })
}

export function getDrugDetail(parameter) {
  return request({
    url: api.Detail + parameter + '/detail',
    method: 'get'
  })
}

export function CreateDrug(parameter) {
  return request({
    url: api.Create,
    method: 'post',
    data: parameter
  })
}

export function UpdateDrug(parameter) {
  return request({
    url: api.Update + parameter.id + '/update',
    method: 'post',
    data: parameter
  })
}

export function DeleteDrug(parameter) {
  return request({
    url: api.Delete + parameter,
    method: 'delete'
  })
}

export function DisableDrug(parameter) {
  return request({
    url: api.Update + parameter.id + '/disable',
    method: 'post',
    data: parameter
  })
}
