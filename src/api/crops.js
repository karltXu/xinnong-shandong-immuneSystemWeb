import request from '@/utils/request'

const api = {
  List: '/adminapi/v1/plant/get_list'
}

// 获取农作物列表
export function getCropList(parameter) {
  return request({
    url: api.List,
    method: 'get',
    params: parameter
  })
}
