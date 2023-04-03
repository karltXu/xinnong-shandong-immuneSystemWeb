import request from '@/utils/request'

const api = {
  List: '/adminapi/v1/common/ad/get_list',
  Detail: '/adminapi/v1/common/ad/',
  Create: '/adminapi/v1/common/ad/create',
  Update: '/adminapi/v1/common/ad/',
  Delete: '/adminapi/v1/common/ad/'
}

// 获取广告列表
export function getAdList(parameter) {
  return request({
    url: api.List,
    method: 'get',
    params: parameter
  })
}

export function getAdDetail(parameter) {
  return request({
    url: api.Detail + parameter + '/detail',
    method: 'get'
  })
}

export function CreateAd(parameter) {
  return request({
    url: api.Create,
    method: 'post',
    data: parameter
  })
}

export function UpdateAd(parameter) {
  return request({
    url: api.Update + parameter.id + '/update',
    method: 'post',
    data: parameter
  })
}

export function DeleteAd(parameter) {
  return request({
    url: api.Delete + parameter,
    method: 'delete'
  })
}
