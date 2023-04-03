import request from '@/utils/request'

const api = {
  Overview: '/adminapi/v1/stat/get_overview',
  CropOptions: '/adminapi/v1/stat/plant/get_options',
  CropOverview: '/adminapi/v1/stat/animal/diagnosis',
  DiseaseOptions: '/adminapi/v1/stat/disease/get_options',
  DiseaseOverview: '/adminapi/v1/stat/disease',
  Province: '/adminapi/v1/stat/disease/get_provinces',
  China: '/adminapi/v1/stat/china',
  MapOption: '/adminapi/v1/stat/warning/options',
  MapQuery: '/adminapi/v1/stat/warning/query',
  PromotionChannels: '/adminapi/v1/stat/promotion/get_channels',
  PromotionUser: '/adminapi/v1/stat/promotion/stat/user',
  PromotionOrder: '/adminapi/v1/stat/promotion/stat/order'
}

// 获取dashboard
export function getOverview(parameter) {
  return request({
    url: api.Overview,
    method: 'get',
    params: parameter
  })
}

export function getCropOptions() {
  return request({
    url: api.CropOptions,
    method: 'get'
  })
}

export function getCropOverview(parameter) {
  return request({
    url: api.CropOverview,
    method: 'get',
    params: parameter
  })
}

export function getDiseaseOptions() {
  return request({
    url: api.DiseaseOptions,
    method: 'get'
  })
}

export function getProvinceOptions() {
  return request({
    url: api.Province,
    method: 'get'
  })
}

export function getDiseaseOverview(parameter) {
  return request({
    url: api.DiseaseOverview,
    method: 'get',
    params: parameter
  })
}

export function getChinaOverview(parameter) {
  return request({
    url: api.China,
    method: 'get',
    params: parameter
  })
}

export function getMapWarningOption() {
  return request({
    url: api.MapOption,
    method: 'get'
  })
}

export function getMapWarning(parameter) {
  return request({
    url: api.MapQuery,
    method: 'get',
    params: parameter
  })
}

export function getChannels() {
  return request({
    url: api.PromotionChannels,
    method: 'get'
  })
}

export function promotionUser(parameter) {
  return request({
    url: api.PromotionUser,
    method: 'get',
    params: parameter
  })
}

export function promotionOrder(parameter) {
  return request({
    url: api.PromotionOrder,
    method: 'get',
    params: parameter
  })
}
