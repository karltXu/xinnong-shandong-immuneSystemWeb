import request from '@/utils/request'

const api = {
  List: '/adminapi/v1/examination_record/get_list',
  Detail: '/adminapi/v1/examination_record/',
  Create: '/adminapi/v1/examination_record/create',
  Update: '/adminapi/v1/examination_record/',
  Disable: '/adminapi/v1/examination_record/',
  Delete: '/adminapi/v1/examination_record/',
  Options: '/adminapi/v1/examination_record/get_options'
}

// 获取专家列表
export function getTestList(parameter) {
  return request({
    url: api.List,
    method: 'get',
    params: parameter
  })
}

export function getTestOptions() {
  return request({
    url: api.Options,
    method: 'get'
  })
}

export function getTestDetail(parameter) {
  return request({
    url: api.Detail + parameter + '/detail',
    method: 'get'
  })
}

export function CreateTest(parameter) {
  return request({
    url: api.Create,
    method: 'post',
    data: parameter
  })
}

export function UpdateTest(parameter) {
  return request({
    url: api.Update + parameter.id + '/update',
    method: 'post',
    data: parameter
  })
}

export function ArchivedTest(parameter) {
  return request({
    url: api.Disable + parameter + '/update_archived',
    method: 'post'
  })
}

export function DeleteTest(parameter) {
  return request({
    url: api.Disable + parameter,
    method: 'delete'
  })
}
