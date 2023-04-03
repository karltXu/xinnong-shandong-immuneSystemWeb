import request from '@/utils/request'

const api = {
  List: '/adminapi/v1/agency/get_list',
  Detail: '/adminapi/v1/agency/',
  Create: '/adminapi/v1/agency/create',
  Update: '/adminapi/v1/agency/',
  Disable: '/adminapi/v1/agency/',
  Delete: '/adminapi/v1/agency/',
  Options: '/adminapi/v1/agency/get_options',
  ItemCreate: '/adminapi/v1/agency_examination/create',
  ItemListAll: '/adminapi/v1/agency_examination/get_list',
  Item: '/adminapi/v1/agency_examination/',
  Options2: '/adminapi/v1/agency_examination/get_options',
  ItemList: '/adminapi/v1/examination/get_list'
}

// 获取专家列表
export function getAgencyList(parameter) {
  return request({
    url: api.List,
    method: 'get',
    params: parameter
  })
}

export function getAgencyOptions() {
  return request({
    url: api.Options,
    method: 'get'
  })
}

export function getAgencyExamOptions() {
  return request({
    url: api.Options2,
    method: 'get'
  })
}

export function getAgencyDetail(parameter) {
  return request({
    url: api.Detail + parameter + '/detail',
    method: 'get'
  })
}

export function CreateAgency(parameter) {
  return request({
    url: api.Create,
    method: 'post',
    data: parameter
  })
}

export function UpdateAgency(parameter) {
  return request({
    url: api.Update + parameter.id + '/update',
    method: 'post',
    data: parameter
  })
}

export function DisableAgency(parameter) {
  return request({
    url: api.Disable + parameter + '/disable',
    method: 'post'
  })
}

export function DeleteAgency(parameter) {
  return request({
    url: api.Disable + parameter,
    method: 'delete'
  })
}

export function ForbiddenAgency(parameter) {
  return request({
    url: api.Disable + parameter + '/block',
    method: 'post'
  })
}

// 创建检测项目
export function CreateItem(parameter) {
  return request({
    url: api.ItemCreate,
    method: 'post',
    data: parameter
  })
}

export function getItemList(parameter) {
  return request({
    url: api.ItemListAll,
    method: 'get',
    params: parameter
  })
}

export function DeleteItem(parameter) {
  return request({
    url: api.Item + parameter,
    method: 'delete'
  })
}

export function UpdateItem(parameter) {
  return request({
    url: api.Item + parameter.id + '/update',
    method: 'post',
    data: parameter
  })
}

// 获取检测项目列表
export function getExaminationList(parameter) {
  return request({
    url: api.ItemList,
    method: 'get',
    params: parameter
  })
}
