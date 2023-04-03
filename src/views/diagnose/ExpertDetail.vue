<template>
  <page-header-wrapper :title="false">
    <div :style="{display: showDucgIframe ? 'flex' : 'block'}">
      <div>
        <a-card :bordered="false">
          <a-descriptions
            title=""
            :column="column"
            bordered
          >
            <a-descriptions-item
              label="指导编号"
              span="2"
            >
              {{ detail.id }}
              <!-- <router-link :to="{ name: 'userDetail', params: { id: detail.userId } }">{{ detail.userId }}</router-link> -->
            </a-descriptions-item>
            <a-descriptions-item
              v-if="!isExpert"
              label="专家信息"
              span="2"
            >
              <a-row>
                <a-col :span="4">
                  <p>姓名：</p>
                  <p>职称：</p>
                  <p>专业特长：</p>
                  <p>学术成就：</p>
                </a-col>
                <a-col :span="16">
                  <p v-if="hasDetailPermission">
                    <router-link :to="{ name: 'expertsDetail', params: { id: detail.expertId } }">{{ detail.expert.name }}</router-link>
                  </p>
                  <p v-else>{{ detail.expert.name }}</p>
                  <p>{{ detail.expert.title }}</p>
                  <p>{{ detail.expert.major }}</p>
                  <p>{{ detail.expert.achievements }}</p>
                </a-col>
                <a-col :span="4">
                  <img
                    :src="detail.expert.iconUrl"
                    style="width: 100%"
                  />
                </a-col>
              </a-row>
            </a-descriptions-item>
            <a-descriptions-item
              label="动物种类"
              span="2"
            >{{ detail.animal.animalName }}</a-descriptions-item>
            <a-descriptions-item
              label="用户信息"
              span="2"
            >
              <div style="height: 50px;line-height:50px;">
                {{ detail.user.lastName }}{{ detail.user.sex == '男' ? '先生' : '女士' }}
                <b style="font-size: 18px">{{ detail.user.phone }}</b>
                <img
                  :src="detail.user.avatarUrl"
                  style="height: 50px;float: right;"
                />
              </div>
            </a-descriptions-item>
            <a-descriptions-item
              label="关联的智能诊断结果"
              span="2"
            >
              <a-tag
                color="red"
                v-for="(item, index) in detail.ducg.diagnosisResult"
                :key="index"
              >
                {{ item.diseaseName }}-{{ item.probability }}
              </a-tag>
              <br /><br />
              <!-- <a-button v-if="detail.ducgId" type="link" @click="handleAIDetail(detail.ducgId)">
            点击查看详情
          </a-button> -->
              <!-- <a v-if="ducgUrl" :href="ducgUrl" target="_blank">点击查看用户手机端的智能诊断详情</a> -->
              <a v-if="ducgUrl" @click="showDucgIframe = !showDucgIframe">点击查看用户手机端的智能诊断详情</a>
              <br />

            </a-descriptions-item>
            <a-descriptions-item
              label="指导状态"
              span="2"
            >
              <a-badge
                :status="detail.state | resultTypeFilter"
                :text="detail.state | resultFilter"
              />
            </a-descriptions-item>
            <a-descriptions-item
              label="辅诊照片/视频"
              span="2"
            >
              <div style="display:flex; flex-wrap: wrap">
                <div
                  v-for="(item,index) in detail.medias"
                  :key="index"
                >
                  <img
                    v-if="item.mediaType === 'image'"
                    :src="item.url"
                    alt=""
                    style="height: 200px; margin: 10px;"
                    @click="checkBig(item.url)"
                  >
                  <video
                    v-if="item.mediaType === 'video'"
                    width="200"
                    height="200"
                    controls
                    style="margin: 10px;"
                  >
                    <source
                      :src="item.url"
                      type="video/mp4"
                    >
                    <source
                      :src="item.url"
                      type="video/ogg"
                    >
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
            <a-descriptions-item
              label="指导意见"
              span="2"
            >
              <span v-if="detail.state === 'Done'">{{ detail.expertResult }}</span>
              <a-textarea
                v-else
                v-model="detail.expertResult"
                placeholder="请输入您的指导意见"
                :auto-size="{ minRows: 3, maxRows: 6 }"
              />
            </a-descriptions-item>
            <a-descriptions-item label="创建时间">{{ detail.createdAt }}</a-descriptions-item>
          </a-descriptions>
          <a-divider style="margin-bottom: 20px" />
          <a-button
            type="primary"
            @click="handleSave"
            :disabled="detail.state === 'Done'"
          >
            保存
          </a-button>
          <a-button
            @click="goBack"
            style="marginLeft: 12px"
          >
            返回
          </a-button>
        </a-card>
      </div>
      <div v-if="showDucgIframe" class="iframe-wrap">
        <div>
          <iframe :src="ducgUrl" style="width: 100%;height: 100%;border: 0;"></iframe>
        </div>
      </div>
    </div>
  </page-header-wrapper>
</template>
<script>
import { diagnoseResultMap2 } from '@/utils/constant'
import { getExpertDetail2, updateExpert2 } from '@/api/diagnose'
import { message } from 'ant-design-vue'

export default {
    name: 'Detail',
    data() {
        return {
            detail: {
                expertResult: '',
                state: 'InProgress',
                expert: {
                    nickname: ''
                },
                animal: {
                    animalName: ''
                },
                user: {
                    nickname: ''
                },
                ducg: {
                    diagnosisResult: ''
                }
            },
            column: 2,
            ducgUrl: '',
            showDucgIframe: false
        }
    },
    filters: {
        resultFilter(type) {
            return diagnoseResultMap2[type].text
        },
        resultTypeFilter(type) {
            return diagnoseResultMap2[type].status
        }
    },
    created() {
        this.showDucgIframe = false
        this.init()
        console.log('permissionList:', this.$store.state.user.info.permissionList)
    },
    computed: {
        hasDetailPermission() {
            return this.$store.state.user.info.permissionList.includes('experts')
        },
        isExpert() {
            return this.$store.state.user.info.roleCode === 'BUILTIN_EXPERT'
        }
    },
    methods: {
        init() {
          getExpertDetail2(this.$route.params.id).then((res) => {
            this.detail = res.data.expertService
            this.ducgUrl = res.data.ducgUrl
          })
        },
        goBack() {
            this.$router.push({
                name: 'diagnoseExpertList',
                params: {
                    pageNumber: this.$route.params.pageNumber,
                    pageSize: this.$route.params.pageSize
                }
            })
        },
        showBig() {
            const url = this.detail.recognition.imageUrl
            this.$info({
                title: '',
                width: '70%',
                maskClosable: true,
                content: (
                    <div>
                        <img src={url} style="width: 100%" />
                    </div>
                )
            })
        },
        handleAIDetail(id) {
            this.$router.push({
                name: 'diagnoseAIDetail',
                params: { id }
            })
        },
        handleSave() {
            const param = {
                id: this.detail.id,
                expertResult: this.detail.expertResult
            }
            updateExpert2(param).then((res) => {
                if (res.code === 0) {
                    message.success('专家意见提交成功')
                    this.goBack()
                }
            })
        },
        checkBig(url) {
            this.$info({
                title: '',
                width: '50%',
                maskClosable: true,
                content: (
                    <div>
                        <img src={url} style="width: 100%" />
                    </div>
                )
            })
        }
    }
}
</script>
<style lang="less" scoped>
.iframe-wrap {
  margin-left: 20px;
  padding: 24px 28px;
  width: 400px;
  height: 794px;
  background: url('./img/iphone.png') no-repeat top center / contain;
  div {
    width: 344px;
    height: 746px;
    border-radius: 30px;
    overflow: hidden;
    // border: 1px solid red;
  }
}
</style>
