import request from '@/utils/request'

const orderApi = {
  OrderList: '/adminapi/v1/order/get_list'
}

// 获取订单列表
export function getOrderList(parameter) {
  return request({
    url: orderApi.OrderList,
    method: 'get',
    params: parameter
  })
}
