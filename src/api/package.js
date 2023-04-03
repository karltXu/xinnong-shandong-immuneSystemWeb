import request from '@/utils/request'

const api = {
  VIPList: '/adminapi/v1/commodity/service_plan/get_list',
  VIPDetail: '/adminapi/v1/commodity/service_plan/',
  VIPUpdate: '/adminapi/v1/commodity/service_plan/',
  ExpertList: '/adminapi/v1/commodity/expert_service/get_list',
  ExpertDetail: '/adminapi/v1/commodity/expert_service/',
  ExpertUpdate: '/adminapi/v1/commodity/expert_service/',
  CommodityList: '/adminapi/v1/commodity/get_list',
  Commodity: '/adminapi/v1/commodity/'
}

// 获取vip套餐列表
export function getVIPList(parameter) {
  return request({
    url: api.VIPList,
    method: 'get',
    params: parameter
  })
}

export function getVIPDetail(parameter) {
  return request({
    url: api.VIPDetail + parameter + '/detail',
    method: 'get'
  })
}

export function VIPUpdate(parameter) {
  return request({
    url: api.VIPUpdate + parameter.itemId + '/update',
    method: 'post',
    data: parameter
  })
}

export function getExpertServiceList(parameter) {
  return request({
    url: api.ExpertList,
    method: 'get',
    params: parameter
  })
}

export function getExpertDetail(parameter) {
  return request({
    url: api.ExpertDetail + parameter + '/detail',
    method: 'get'
  })
}

export function ExpertUpdate(parameter) {
  return request({
    url: api.ExpertUpdate + parameter.itemId + '/update',
    method: 'post',
    data: parameter
  })
}

export function getCommodityList(parameter) {
  return request({
    url: api.CommodityList,
    method: 'get',
    params: parameter
  })
}

export function getCommodityDetail(parameter) {
  return request({
    url: api.Commodity + parameter + '/detail',
    method: 'get'
  })
}

export function CommodityUpdate(parameter) {
  return request({
    url: api.Commodity + parameter.itemId + '/update',
    method: 'post',
    data: parameter
  })
}
