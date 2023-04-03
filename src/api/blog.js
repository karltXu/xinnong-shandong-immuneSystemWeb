import request from '@/utils/request'

const api = {
  List: '/adminapi/v1/blog/get_list',
  Options: '/adminapi/v1/blog_category/get_options',
  Detail: '/adminapi/v1/blog/',
  Create: '/adminapi/v1/blog/create',
  Update: '/adminapi/v1/blog/',
  Archive: '/adminapi/v1/blog/',
  Delete: '/adminapi/v1/blog/'
}

// 获取博客列表
export function getBlogList(parameter) {
  return request({
    url: api.List,
    method: 'get',
    params: parameter
  })
}

export function getBlogOptions(parameter) {
  return request({
    url: api.Options,
    method: 'get',
    params: parameter
  })
}

export function getBlogDetail(parameter) {
  return request({
    url: api.Detail + parameter + '/detail',
    method: 'get'
  })
}

export function CreateBlog(parameter) {
  return request({
    url: api.Create,
    method: 'post',
    data: parameter
  })
}

export function UpdateBlog(parameter) {
  return request({
    url: api.Update + parameter.id + '/update',
    method: 'post',
    data: parameter
  })
}

export function ArchiveBlog(parameter) {
  return request({
    url: api.Archive + parameter + '/archive',
    method: 'post'
  })
}

export function DeleteBlog(parameter) {
  return request({
    url: api.Delete + parameter,
    method: 'delete'
  })
}
