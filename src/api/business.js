import request from '@/utils/request'

const api = {
  List: '/adminapi/v1/merchant/get_list',
  Detail: '/adminapi/v1/merchant/',
  Create: '/adminapi/v1/merchant/create',
  Update: '/adminapi/v1/merchant/',
  Disable: '/adminapi/v1/merchant/',
  Delete: '/adminapi/v1/merchant/'
}

// 获取商家列表
export function getBusinessList(parameter) {
  return request({
    url: api.List,
    method: 'get',
    params: parameter
  })
}

export function getBusinessDetail(parameter) {
  return request({
    url: api.Detail + parameter + '/detail',
    method: 'get'
  })
}

export function CreateBusiness(parameter) {
  return request({
    url: api.Create,
    method: 'post',
    data: parameter
  })
}

export function UpdateBusiness(parameter) {
  return request({
    url: api.Update + parameter.id + '/update',
    method: 'post',
    data: parameter
  })
}

export function DisableBusiness(parameter) {
  return request({
    url: api.Disable + parameter + '/disable',
    method: 'post'
  })
}

export function DeleteBusiness(parameter) {
  return request({
    url: api.Disable + parameter,
    method: 'delete'
  })
}
