import request from '@/utils/request'

const api = {
  List: '/adminapi/v1/common/app_channel/get_list',
  Detail: '/adminapi/v1/common/app_channel/',
  Update: '/adminapi/v1/common/app_channel/',
  PromoterList: '/adminapi/v1/account/get_promoters',
  ChannelList: '/adminapi/v1/common/app_channel/get_all'
}

// 获取渠道列表
export function getChannelList(parameter) {
  return request({
    url: api.List,
    method: 'get',
    params: parameter
  })
}

export function getChannelDetail(parameter) {
  return request({
    url: api.Detail + parameter + '/detail',
    method: 'get'
  })
}

export function UpdateChannel(parameter) {
  return request({
    url: api.Update + parameter.id + '/update',
    method: 'post',
    data: parameter
  })
}

// 推广商户列表

export function getPromoterList() {
  return request({
    url: api.PromoterList,
    method: 'get'
  })
}

//  渠道列表

export function getChannels() {
  return request({
    url: api.ChannelList,
    method: 'get'
  })
}
