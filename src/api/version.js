import request from '@/utils/request'

const api = {
  List: '/adminapi/v1/common/app_version/get_list',
  Detail: '/adminapi/v1/common/app_version/',
  Create: '/adminapi/v1/common/app_version/create',
  Update: '/adminapi/v1/common/app_version/'
}

// 获取版本列表
export function getVersionList(parameter) {
  return request({
    url: api.List,
    method: 'get',
    params: parameter
  })
}

export function getVersionDetail(parameter) {
  return request({
    url: api.Detail + parameter + '/detail',
    method: 'get'
  })
}

export function CreateVersion(parameter) {
  return request({
    url: api.Create,
    method: 'post',
    data: parameter
  })
}

export function UpdateVersion(parameter) {
  return request({
    url: api.Update + parameter.id + '/update',
    method: 'post',
    data: parameter
  })
}
