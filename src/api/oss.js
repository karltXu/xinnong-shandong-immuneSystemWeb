import request from '@/utils/request'
import OSS from 'ali-oss'

const api = {
  Config: '/adminapi/v1/common/get_sts'
}

// 获取oss配置信息
export function getStsConfig() {
  return request({
    url: api.Config,
    method: 'post'
  })
}

export function clientConstrctor(bucket, region, stsToken) {
  const oss = new OSS({
    region,
    accessKeyId: stsToken.AccessKeyId,
    accessKeySecret: stsToken.AccessKeySecret,
    bucket,
    stsToken: stsToken.SecurityToken
  })
  return oss
}
