import request from '@/utils/request'

const Api = {
  AiList: '/adminapi/v1/ai_diagnosis/get_list',
  AiDetail: '/adminapi/v1/ai_diagnosis/',
  ExpertList: '/adminapi/v1/expert_service/get_list',
  ExpertDetail: '/adminapi/v1/expert_service/',
  ExpertUpdate: '/adminapi/v1/expert_service/',
  ExpertList2: '/adminapi/v2/expert_service/get_list',
  ExpertDetail2: '/adminapi/v2/expert_service/',
  ExpertUpdate2: '/adminapi/v2/expert_service/',
  AnimalOptions: '/adminapi/v1/animal/get_options',
  ConsultationList: '/adminapi/v1/consultation/get_list',
  Consultation: '/adminapi/v1/consultation/',
  MeetingDisable: '/adminapi/v1/consultation/get_arranges'
}

// 获取AI诊断列表
export function getAiList(parameter) {
  return request({
    url: Api.AiList,
    method: 'get',
    params: parameter
  })
}

export function getAiDetail(parameter) {
  return request({
    url: Api.AiDetail + parameter + '/detail',
    method: 'get'
  })
}

export function getExpertList(parameter) {
  return request({
    url: Api.ExpertList,
    method: 'get',
    params: parameter
  })
}

export function getExpertDetail(parameter) {
  return request({
    url: Api.ExpertDetail + parameter + '/detail',
    method: 'get'
  })
}

export function updateExpert(parameter) {
  return request({
    url: Api.ExpertUpdate + parameter.id + '/update_result',
    method: 'post',
    data: parameter
  })
}

export function getAnimalOptions() {
  return request({
    url: Api.AnimalOptions,
    method: 'get'
  })
}

export function getExpertList2(parameter) {
  return request({
    url: Api.ExpertList2,
    method: 'get',
    params: parameter
  })
}

export function getExpertDetail2(parameter) {
  return request({
    url: Api.ExpertDetail2 + parameter + '/detail',
    method: 'get'
  })
}

export function updateExpert2(parameter) {
  return request({
    url: Api.ExpertUpdate2 + parameter.id + '/update_result',
    method: 'post',
    data: parameter
  })
}

export function getConsultationList(parameter) {
  return request({
    url: Api.ConsultationList,
    method: 'get',
    params: parameter
  })
}

export function getConsultationDetail(parameter) {
  return request({
    url: Api.Consultation + parameter + '/detail',
    method: 'get'
  })
}

// 接受预约
export function ConsultationAccept(parameter) {
  return request({
    url: Api.Consultation + parameter.id + '/accept',
    method: 'post',
    params: parameter
  })
}

// 拒诊
export function ConsultationRefuse(parameter) {
  return request({
    url: Api.Consultation + parameter.id + '/refuse',
    method: 'post',
    params: parameter
  })
}

// 获取会议链接
export function GetMeetingInfo(parameter) {
  return request({
    url: Api.Consultation + parameter.id + '/get_meeting_info',
    method: 'get'
  })
}

// 获取不可用的会议时间段
export function getMeetingDisable(parameter) {
  return request({
    url: Api.MeetingDisable,
    method: 'get',
    params: parameter
  })
}
