<template>
  <page-header-wrapper :title="false">
    <div :style="{display: showDucgIframe ? 'flex' : 'block'}">
      <div>
        <a-card :bordered="false">
          <a-descriptions
            title=""
            :column="1"
            bordered
          >
            <a-descriptions-item label="会诊编号">
              {{ detail.id }}
            </a-descriptions-item>

            <a-descriptions-item label="会诊状态">
              <a-tag :color="detail.state | resultTypeFilter">
                {{ detail.state | resultFilter }}
              </a-tag>
            </a-descriptions-item>

            <a-descriptions-item label="日期时间">
              {{ detail.createdAt }}
            </a-descriptions-item>

            <a-descriptions-item label="就诊动物">
              {{ detail.animal.animalName }}
            </a-descriptions-item>

            <a-descriptions-item label="辅诊照片/视频">
              <div style="display: flex;flex-wrap: wrap;">
                <div v-for="(item, index) in detail.medias" :key="index">
                  <img v-if="item.mediaType === 'image'" :src="item.url" style="height: 240px; margin-right: 10px;" />
                  <video v-else width="320" height="240" controls>
                    <source :src="item.url" type="video/mp4">
                    您的浏览器不支持 video 标签。
                  </video>
                </div>
              </div>
              <div>
                <a-button type="primary" @click="init">
                  刷新
                </a-button>
              </div>
            </a-descriptions-item>

            <a-descriptions-item label="关联的智能诊断结果" v-if="detail.ducg">
              <a-tag
                color="red"
                v-for="(item, index) in detail.ducg.diagnosisResult"
                :key="index"
              >
                {{ item.diseaseName }}-{{ item.probability }}
              </a-tag>
              <div v-if="ducgUrl && hasUpdateCase">
                <br />
                <a @click="showDucgIframe = !showDucgIframe">点击查看用户手机端的智能诊断详情</a>
                <br />
              </div>
            </a-descriptions-item>

            <a-descriptions-item label="接诊专家">
              {{ detail.expert.name }}
            </a-descriptions-item>

            <a-descriptions-item label="会诊名称" v-if="detail.state !== 'Created' && detail.state !== 'Refused'">
              <div v-if="detail.title">{{ detail.title }}</div>
              <div v-else>
                <a-input v-model="title" />
              </div>
            </a-descriptions-item>

            <a-descriptions-item label="会诊时段" v-if="detail.state !== 'Created' && detail.state !== 'Refused' && detail.state !== 'Canceled'">
              <div v-if="meetingStart">
                {{ meetingStart }} 至 {{ meetingEnd }}
                <a-button
                  type="primary"
                  ghost
                  @click="handleShowMeeting"
                >
                  修改会诊时段
                </a-button>
              </div>
              <div v-else-if="detail.meetingStart">{{ moment(detail.meetingStart * 1000).format('YYYY-MM-DD HH:mm') }} 至 {{ moment(detail.meetingEnd * 1000).format('YYYY-MM-DD HH:mm') }}</div>
              <a-button
                v-else
                type="primary"
                ghost
                @click="handleShowMeeting"
                :disabled="!hasUpdateCase"
              >
                添加会诊时段
              </a-button>
            </a-descriptions-item>

            <a-descriptions-item label="查看回放" v-if="(detail.state === 'Consulted' || detail.state === 'Done') && isAdmin">
              <p v-for="(item,index) in detail.videos" :key="index">
                <a :href="item.downUrl" target="_blank">{{ item.fileName }}</a>
                <a-button
                  type="primary"
                  shape="circle"
                  size="small"
                  style="margin-left: 10px;"
                  icon="caret-right"
                  @click="handleShowVideo(item.downUrl)">
                </a-button>
              </p>
            </a-descriptions-item>

            <a-descriptions-item label="诊断结果（病历）" v-if="detail.state === 'Consulted'">
              <a-button
                v-if="!showCaseDetail"
                type="primary"
                ghost
                @click="addCase"
                :disabled="!hasUpdateCase"
              >
                添加病历
              </a-button>
              <router-link v-if="showCaseDetail" :to="'/case/detail/'+caseId+'?from=other'"> 查看病历详情</router-link>
            </a-descriptions-item>

            <a-descriptions-item label="诊断结果（病历）" v-if="detail.state === 'Done'">
              <router-link :to="'/case/detail/'+detail.case.id+'?from=other'"> 查看病历详情</router-link>
            </a-descriptions-item>

            <a-descriptions-item label="结果反馈" v-if="detail.state === 'Done'">
              {{ detail.resultState === 'Yes' ? '已解决' : detail.resultState === 'No' ? '未解决' : '未评价' }}
            </a-descriptions-item>
            <a-descriptions-item label="用户评价" v-if="detail.state === 'Done'">
              {{ detail.resultReview }}
            </a-descriptions-item>

          </a-descriptions>
          <a-divider style="margin-bottom: 20px" />
          <a-button
            v-if="detail.state === 'Paid'"
            type="primary"
            @click="handleSave"
            :loading="btnLoading"
            :disabled="!hasUpdateCase"
          >
            接受预约
          </a-button>
          <a-button
            v-if="detail.state === 'Accepted' || detail.state === 'Consulting'"
            type="primary"
            @click="handleVideo"
            :disabled="!detail.entryable"
          >
            发起远程视频会诊
          </a-button>
          <a-button
            v-if="detail.state === 'Paid'"
            type="danger"
            @click="handleCancle"
            style="marginLeft: 12px"
            :disabled="!hasUpdateCase"
          >
            拒诊
          </a-button>
          <a-button
            @click="goBack"
            style="marginLeft: 12px"
          >
            返回
          </a-button>
        </a-card>
      </div>
      <div
        v-if="showDucgIframe"
        class="iframe-wrap"
      >
        <div>
          <iframe
            :src="ducgUrl"
            style="width: 100%;height: 100%;border: 0;"
          ></iframe>
        </div>
      </div>
    </div>
    <a-modal
      title="添加病历"
      width="90%"
      class="special"
      :visible="showNewCase"
      @ok="handleOk"
      @cancel="handleOk"
    >
      <template slot="footer">
        <a-button key="submit" type="primary" :loading="loading" @click="handleSaveCase">
          保存病历
        </a-button>
      </template>
      <NewCase
        ref="case"
        :id="detail.id"
        :ducg="detail.ducg"
        @close="handleOk"
      >
      </NewCase>
    </a-modal>
    <a-modal
      title="添加会诊时段"
      width="90%"
      class="special"
      :visible="showMeeting"
      :footer="null"
      @ok="handleOk2"
      @cancel="handleOk2"
    >
      <Meeting
        :title="title"
        @close="handleOk2"
      ></Meeting>
    </a-modal>
    <a-modal v-model="showVideo" title="查看回放" @ok="handleVideoOk" :closable="false" :width="800">
      <video width="750" height="430" controls>
        <source :src="videoSrc" type="video/mp4">
      </video>
    </a-modal>
  </page-header-wrapper>
</template>
<script>
import moment from 'moment'
import { ConsultationMap } from '@/utils/constant'
import { getConsultationDetail, ConsultationAccept, ConsultationRefuse, GetMeetingInfo } from '@/api/diagnose'
import { message } from 'ant-design-vue'
import NewCase from './component/NewCase.vue'
import Meeting from './component/Meeting.vue'

export default {
    name: 'ConsultationDetail',
    data() {
        return {
            detail: {
                expertResult: '',
                state: 'Created',
                expert: {
                    nickname: ''
                },
                animal: {
                    animalName: ''
                },
                ducg: {
                    diagnosisResult: ''
                },
                meetingStart: '',
                meetingEnd: '',
                entryable: false
            },
            title: '',
            meetingStart: '',
            meetingEnd: '',
            ducgUrl: '',
            showDucgIframe: false,
            showNewCase: false,
            showMeeting: false,
            showCaseDetail: false,
            caseId: '',
            btnLoading: false,
            loading: false,
            showVideo: false,
            videoSrc: ''
        }
    },
    components: {
        NewCase,
        Meeting
    },
    filters: {
        resultFilter(type) {
            return ConsultationMap[type].text
        },
        resultTypeFilter(type) {
            return ConsultationMap[type].status
        }
    },
    created() {
        this.showDucgIframe = false
        this.init()
    },
    computed: {
        hasDetailPermission() {
            return this.$store.getters.hasPermission('blogs', 'update')
        },
        hasUpdateCase() {
            return this.$store.getters.hasPermission('consultationRecord', 'update')
        },
        isExpert() {
            return this.$store.state.user.info.roleCode === 'BUILTIN_EXPERT'
        },
        isAdmin() {
            return this.$store.state.user.info.roleCode === 'BUILTIN_SYSTEM_ADMIN'
        }
    },
    methods: {
        moment,
        init() {
            getConsultationDetail(this.$route.params.id).then((res) => {
                this.detail = res.data.consultation
                this.ducgUrl = res.data.consultation.ducgUrl
            })
        },
        goBack() {
            this.$router.push({
                name: 'consultationList',
                params: {
                    pageNumber: this.$route.params.pageNumber,
                    pageSize: this.$route.params.pageSize
                }
            })
        },
        // 接受预约
        handleSave() {
            if (!this.title && !this.detail.title) {
                message.warning('会诊名称不能为空哟～')
                return
            } else if (!this.meetingStart) {
                message.warning('会诊时间段不能为空哟～')
                return
            }
            const param = {
                id: this.detail.id,
                state: 'Accepted',
                title: this.title || this.detail.title,
                meetingStart: new Date(this.meetingStart).getTime() / 1000,
                meetingEnd: new Date(this.meetingEnd).getTime() / 1000
            }
            this.btnLoading = true
            ConsultationAccept(param).then((res) => {
                if (res.code === 0) {
                    message.success('预约成功')
                    this.goBack()
                }
            }).finally(() => {
              this.btnLoading = false
            })
        },
        // 取消预约
        handleCancle() {
            const _this = this
            this.$confirm({
                title: '真的要拒诊吗?',
                content: (h) => <div style="color:red;">拒绝之后不可以再更改哟～</div>,
                onOk() {
                    const param = {
                        id: _this.detail.id,
                        state: 'Refused'
                    }
                    ConsultationRefuse(param).then(() => {
                        message.success('已拒绝')
                        _this.goBack()
                    })
                },
                class: 'test'
            })
        },
        // 打开增加病历弹窗
        addCase() {
            this.showNewCase = true
        },
        // 关闭增加病历弹窗
        handleOk(val) {
          if (typeof val === 'number') {
            this.caseId = val
            this.showCaseDetail = true
          } else {
            this.showCaseDetail = false
          }
          this.showNewCase = false
        },
        // 关闭选择会议时间弹窗
        handleOk2(start, end) {
            this.showMeeting = false
            this.meetingStart = typeof start === 'string' ? start : ''
            this.meetingEnd = end
        },
        // 打开选择会议时间弹窗
        handleShowMeeting() {
            this.showMeeting = !this.showMeeting
        },
        // 进入远程视频会议
        handleVideo() {
          const id = this.detail.id
          GetMeetingInfo({ id }).then(res => {
            window.open(res.data.meetingLink, '_blank')
          })
        },
        handleSaveCase() {
          this.$refs.case.onSubmit()
        },
        handleShowVideo(url) {
          this.videoSrc = url
          this.showVideo = true
        },
        handleVideoOk() {
          this.showVideo = false
        }
    }
}
</script>
<style lang="less" scoped>
.iframe-wrap {
    margin-left: 20px;
    padding: 25px 28px 20px;
    width: 400px;
    height: 794px;
    background: url('./img/iphone.png') no-repeat top center / contain;
    div {
        width: 344px;
        height: 734px;
        border-radius: 30px;
        overflow: hidden;
        // border: 1px solid red;
    }
}
.special /deep/ .ant-modal {
  position: fixed;
  left: 5%;
  top: 10px;
  // bottom: -10px;
  // overflow: hidden;
}
</style>
