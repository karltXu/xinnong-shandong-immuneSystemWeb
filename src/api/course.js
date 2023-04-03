import request from '@/utils/request'

const api = {
  List: '/adminapi/v1/course/get_list',
  Detail: '/adminapi/v1/course/',
  Create: '/adminapi/v1/course/create',
  Update: '/adminapi/v1/course/',
  Disable: '/adminapi/v1/course/',
  Delete: '/adminapi/v1/course/',
  Options: '/adminapi/v1/course/get_options'
}

// 获取专家列表
export function getCourseList(parameter) {
  return request({
    url: api.List,
    method: 'get',
    params: parameter
  })
}

export function getCourseOptions() {
  return request({
    url: api.Options,
    method: 'get'
  })
}

export function getCourseDetail(parameter) {
  return request({
    url: api.Detail + parameter + '/detail',
    method: 'get'
  })
}

export function CreateCourse(parameter) {
  return request({
    url: api.Create,
    method: 'post',
    data: parameter
  })
}

export function UpdateCourse(parameter) {
  return request({
    url: api.Update + parameter.id + '/update',
    method: 'post',
    data: parameter
  })
}

export function DisableCourse(parameter) {
  return request({
    url: api.Disable + parameter + '/disable',
    method: 'post'
  })
}

export function DeleteCourse(parameter) {
  return request({
    url: api.Disable + parameter,
    method: 'delete'
  })
}
