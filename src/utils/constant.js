const diagnoseResultMap = {
  Failed: {
    status: 'default',
    text: '识别失败'
  },
  InProgress: {
    status: 'processing',
    text: '识别中'
  },
  Rejected: {
    status: 'warning',
    text: '未订阅已拒绝'
  },
  DoneSuccess: {
    status: 'success',
    text: '识别完成-有识别结果'
  },
  DoneFailed: {
    status: 'error',
    text: '识别完成-无识别结果'
  },
  DoneNoResult: {
    status: 'warning',
    text: '识别完成-图片不能识别'
  }
}

const diagnoseResultMap2 = {
  InProgress: {
    status: 'warning',
    text: '诊断中'
  },
  Done: {
    status: 'success',
    text: '诊断完成'
  }
}

const userStatusMap = {
  0: {
    status: 'success',
    text: '正常'
  },
  1: {
    status: 'default',
    text: '禁用'
  }
}

const orderStatusMap = {
  Created: {
    status: 'processing',
    text: '已创建'
  },
  Paid: {
    status: 'success',
    text: '已支付'
  },
  Aborted: {
    status: 'default',
    text: '已取消'
  }
}
const orderStatusMap2 = {
  Created: {
    color: 'orange',
    text: '已创建'
  },
  Paid: {
    color: 'green',
    text: '已支付'
  },
  Aborted: {
    color: 'red',
    text: '已取消'
  }
}

const productTypeMap = {
  ServicePlan: '订阅套餐',
  ExpertService: '专家服务',
  CODE_CORP: '企业会员',
  CODE_CONSUL: '专家会诊'
}

const TestRecordMap = {
  Created: {
    status: 'pink',
    text: '待检测'
  },
  InProgress: {
    status: 'orange',
    text: '检测中'
  },
  Done: {
    status: 'blue',
    text: '检测完成'
  }
}

const ConsultationMap = {
  Created: {
    status: 'red',
    text: '待支付'
  },
  Paid: {
    status: 'purple',
    text: '待应诊'
  },
  Refused: {
    status: 'orange',
    text: '已拒诊'
  },
  Canceled: {
    status: 'orange',
    text: '已取消'
  },
  Accepted: {
    status: 'cyan',
    text: '待会诊'
  },
  Consulting: {
    status: '#2db7f5',
    text: '会诊中'
  },
  Consulted: {
    status: '#87d068',
    text: '待结诊'
  },
  Done: {
    status: '#108ee9',
    text: '已结诊'
  }
}

export { ConsultationMap, diagnoseResultMap, diagnoseResultMap2, userStatusMap, orderStatusMap, productTypeMap, orderStatusMap2, TestRecordMap }
