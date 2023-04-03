<template>
  <page-header-wrapper :title="false">
    <div>
      <div>
        <a-card :bordered="false">
          <a-descriptions
            title=""
            bordered
            :column="1"
          >
            <a-descriptions-item label="标题">{{ detail.title }}</a-descriptions-item>

            <a-descriptions-item label="类型">{{ detail.notificationTypeText }}</a-descriptions-item>
            <a-descriptions-item label="状态">
              <a-tag color="pink">{{ detail.read ? '已读' : '未读' }}</a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="内容">
              {{ detail.desc }}
              <div style="margin-top: 10px;">
                <a-button type="danger" ghost @click="gotoLink">
                  {{ MAP[detail.notificationType] }}
                </a-button>
              </div>
            </a-descriptions-item>
            <a-descriptions-item label="发布日期">
              {{ detail.createdAt }}
            </a-descriptions-item>
          </a-descriptions>
          <a-divider style="margin-bottom: 20px" />
          <a-button
            @click="goBack"
          >
            返回
          </a-button>
        </a-card>
      </div>
    </div>
  </page-header-wrapper>
</template>
<script>
import { setNoticeDoread } from '@/api/notice'
const MAP = {
    NTExpertDiagnosisCreated: '查看专家指导详情',
    NTExpertDiagnosisDone: '查看专家指导详情',
    NTExaminationRecordCreated: '查看检测记录详情',
    NTExaminationRecordDone: '查看检测记录详情',
    NTConsultationPaid: '查看专家会诊详情',
    NTConsultationRefused: '查看专家会诊详情',
    NTConsultationAccepted: '查看专家会诊详情',
    NTConsultationRemind: '查看远程会诊室',
    NTConsultationDone: '查看专家会诊详情',
    NTConsultationReview: '查看专家会诊详情',
    NTConsultationRemindDone: '查看专家会诊详情'
}

export default {
    name: 'Detail',
    props: {
      // detail: {
      //   type: Object,
      //   default: () => {}
      // }
    },
    data() {
        return {
          detail: {
            btnTxt: ''
          },
          MAP
        }
    },
    created() {
        this.init()
    },
    methods: {
        init() {
          this.detail = this.$route.params.detail
          if (this.detail.read === 0) {
            setNoticeDoread(this.detail.id).then((res) => {
                console.log('已读')
            })
          }
        },
        goBack() {
            if (this.$route.query.from === 'other') {
              this.$router.go(-1)
            } else {
              this.$router.push({
                  name: 'noticeList',
                  params: {
                      pageNumber: this.$route.params.pageNumber,
                      pageSize: this.$route.params.pageSize
                  }
              })
            }
        },
        gotoLink() {
          const item = this.detail
          let url = ''
          switch (item.notificationType) {
            case 'NTExpertDiagnosisCreated':
            case 'NTExpertDiagnosisDone':
              url = `/diagnose/expert-detail/` + item.payload.es_id
              break

            case 'NTExaminationRecordCreated':
            case 'NTExaminationRecordDone':
              url = `/test/detail/` + item.payload.record_id
              break

            case 'NTConsultationPaid':
            case 'NTConsultationDone':
            case 'NTConsultationRefused':
            case 'NTConsultationAccepted':
            case 'NTConsultationReview':
            case 'NTConsultationRemindDone':
              url = `/diagnose/consultation-detail/` + item.payload.consultation_id
              break

            case 'NTConsultationRemind':
              url = `/diagnose/meetingroom`
              break
          }
          this.$router.push(url)
        }

    }
}
</script>
<style lang="less" scoped>

</style>
