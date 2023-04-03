import request from '@/utils/request'

const api = {
  PermissionList: '/adminapi/v1/permission/get_list',
  RoleList: '/adminapi/v1/role/get_list',
  RoleDelete: '/adminapi/v1/role/delete',
  UpdateRoleStatus: '/adminapi/v1/role/update_status',
  AllPermissions: '/adminapi/v1/role/get_all_permissions',
  RoleCreate: '/adminapi/v1/role/create',
  RoleUpdate: '/adminapi/v1/role/update',
  RoleInfo: '/adminapi/v1/role/get_info',
  AllAsOptions: '/adminapi/v1/role/get_all_as_options',
  UserList: '/adminapi/v1/account/get_list',
  UserDetail: '/adminapi/v1/account/',
  UserDelete: '/adminapi/v1/account/',
  UserUpdateStatus: '/adminapi/v1/account/',
  UserUpdate: '/adminapi/v1/account/',
  UserCreate: '/adminapi/v1/account/create'
}

// 权限管理
export function getPermissionList(parameter) {
  return request({
    url: api.PermissionList,
    method: 'get',
    params: parameter
  })
}

export function getRoleList(parameter) {
  return request({
    url: api.RoleList,
    method: 'get',
    params: parameter
  })
}

export function deleteRole(parameter) {
  return request({
    url: api.RoleDelete,
    method: 'post',
    data: parameter
  })
}

export function createRole(parameter) {
  return request({
    url: api.RoleCreate,
    method: 'post',
    data: parameter
  })
}

export function updateRoleStatus(parameter) {
  return request({
    url: api.UpdateRoleStatus,
    method: 'post',
    data: parameter
  })
}

export function updateRole(parameter) {
  return request({
    url: api.RoleUpdate,
    method: 'post',
    data: parameter
  })
}

export function getRoleInfo(parameter) {
  return request({
    url: api.RoleInfo,
    method: 'get',
    params: parameter
  })
}

export function getAllPermissions() {
  return request({
    url: api.AllPermissions,
    method: 'get'
  })
}

export function getAllAsOptions() {
  return request({
    url: api.AllAsOptions,
    method: 'get'
  })
}

export function getUserList(parameter) {
  return request({
    url: api.UserList,
    method: 'get',
    params: parameter
  })
}

export function getUserDetail(parameter) {
  return request({
    url: api.UserDetail + parameter + '/get_detail',
    method: 'get'
  })
}

export function deleteUser(parameter) {
  return request({
    url: api.UserDelete + parameter + '/delete',
    method: 'post'
  })
}

export function updateUserStatus(parameter) {
  return request({
    url: api.UserUpdateStatus + parameter + '/update_status',
    method: 'post'
  })
}

export function createUser(parameter) {
  return request({
    url: api.UserCreate,
    method: 'post',
    data: parameter
  })
}

export function updateUser(id, parameter) {
  return request({
    url: api.UserUpdate + id + '/update',
    method: 'post',
    data: parameter
  })
}
