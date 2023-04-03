import request from '@/utils/request'

const api = {
  List: '/adminapi/v1/prescription/get_list',
  Detail: '/adminapi/v1/prescription/',
  Create: '/adminapi/v1/prescription/create',
  Update: '/adminapi/v1/prescription/',
  Delete: '/adminapi/v1/prescription/',
  Options: '/adminapi/v1/prescription/get_options',
  Batch: '/adminapi/v1/prescription/batch_create'
}

// 获取专家列表
export function getPrescriptionList(parameter) {
  return request({
    url: api.List,
    method: 'get',
    params: parameter
  })
}

export function getPrescriptionOptions() {
  return request({
    url: api.Options,
    method: 'get'
  })
}

export function getPrescriptionDetail(parameter) {
  return request({
    url: api.Detail + parameter + '/detail',
    method: 'get'
  })
}

export function CreatePrescription(parameter) {
  return request({
    url: api.Create,
    method: 'post',
    data: parameter
  })
}

export function CreatePrescriptionBatch(parameter) {
  return request({
    url: api.Batch,
    method: 'post',
    data: parameter
  })
}

export function UpdatePrescription(parameter) {
  return request({
    url: api.Update + parameter.id + '/update',
    method: 'post',
    data: parameter
  })
}

export function DeletePrescription(parameter) {
  return request({
    url: api.Delete + parameter,
    method: 'delete'
  })
}
