import request from '@/utils/request'

const userApi = {
  UserList: '/adminapi/v1/user/get_list',
  UserDetail: '/adminapi/v1/user/',
  UserUpdateStatus: '/adminapi/v1/user/',
  UserUpdateRemarks: '/adminapi/v1/user/',
  FeedbackList: '/adminapi/v1/common/feedback/get_list',
  FeedbackDetail: '/adminapi/v1/common/feedback/',
  CancelRight: '/adminapi/v1/user/'
}

// 获取用户列表
export function getUserList(parameter) {
  return request({
    url: userApi.UserList,
    method: 'get',
    params: parameter
  })
}

// 获取一个用户详情
export function getUserDetail(parameter) {
  return request({
    url: userApi.UserDetail + parameter + '/detail',
    method: 'get'
  })
}

export function updateUserStatus(parameter) {
  return request({
    url: userApi.UserUpdateStatus + parameter + '/update_status',
    method: 'post'
  })
}

export function updateUserRemarks(parameter) {
  return request({
    url: userApi.UserUpdateStatus + parameter.id + '/update_remarks',
    method: 'post',
    data: { remarks: parameter.remarks }
  })
}

export function getFeedbackList(parameter) {
  return request({
    url: userApi.FeedbackList,
    method: 'get',
    params: parameter
  })
}

export function getFeedbackDetail(parameter) {
  return request({
    url: userApi.FeedbackDetail + parameter + '/get_detail',
    method: 'get'
  })
}

export function cancelUserRight(parameter) {
  return request({
    url: userApi.UserUpdateStatus + parameter + '/cancel_rights',
    method: 'post'
  })
}
