<template>
  <page-header-wrapper :title="false">
    <a-card :bordered="false">
      <a-descriptions title="" :column="column" bordered>
        <a-descriptions-item label="用户ID">{{ detail.id }}</a-descriptions-item>
        <a-descriptions-item label="用户昵称">{{ detail.nickname }}</a-descriptions-item>
        <a-descriptions-item label="用户姓氏">{{ detail.lastName }}</a-descriptions-item>
        <a-descriptions-item label="用户性别">{{ detail.sex }}</a-descriptions-item>
        <a-descriptions-item label="手机号">{{ detail.phone }}</a-descriptions-item>
        <a-descriptions-item label="头像">
          <img :src="detail.iconURL" style="height: 100px;cursor: pointer" @click="showBig" />
        </a-descriptions-item>
        <a-descriptions-item label="渠道">{{ detail.channel }}</a-descriptions-item>
        <a-descriptions-item label="当前状态">
          <a-badge :status="detail.status | resultTypeFilter" :text="detail.status | resultFilter" />
        </a-descriptions-item>
        <a-descriptions-item label="用户备注">
          <a-textarea v-model="detail.remarks" :auto-size="{ minRows: 2, maxRows: 6 }" />
        </a-descriptions-item>
        <a-descriptions-item label="创建时间">{{ detail.createdAt }}</a-descriptions-item>
        <a-descriptions-item label="最后修改时间">{{ detail.updatedAt }}</a-descriptions-item>
        <a-descriptions-item label="最后登录时间">{{ detail.lastLogin }}</a-descriptions-item>
        <a-descriptions-item label="登录后的最后活跃时间">{{ detail.lastActiveAfterLogin }}</a-descriptions-item>

        <a-descriptions-item label="会员管理">
          <a-button v-if="detail.userRights.currentServicePlan === 'Free'" type="primary" disabled>
            取消权益
          </a-button>
          <a-popconfirm v-else title="确定要取消此会员的权益吗?" ok-text="确定" cancel-text="取消" @confirm="confirm">
            <a-button type="primary">
              取消权益
            </a-button>
          </a-popconfirm>
        </a-descriptions-item>
        <a-descriptions-item label="专业版到期时间">
          <a-alert :message="detail.userRights.professionalExpireAt || '暂未订阅'" type="success" />
        </a-descriptions-item>
        <a-descriptions-item label="企业版到期时间">
          <a-alert :message="detail.userRights.droneExpireAt || '暂未订阅'" type="success" />
        </a-descriptions-item>
        <a-descriptions-item label="剩余识别次数">
          <a-alert :message="detail.userRights.freeExpertService" type="success" />
        </a-descriptions-item>
      </a-descriptions>
      <a-divider style="margin-bottom: 20px" />
      <div class="center">
        <a-button type="primary" @click="handleSave" style="margin-right: 15px">
          保存
        </a-button>
        <a-button @click="goBack">
          返回
        </a-button>
      </div>
    </a-card>
  </page-header-wrapper>
</template>
<script>
import { userStatusMap } from '@/utils/constant'
import { getUserDetail, updateUserRemarks, cancelUserRight } from '@/api/user'
import { message } from 'ant-design-vue'

export default {
  name: 'UserDetail',
  data() {
    return {
      detail: {
        id: '',
        nickname: '',
        phone: '',
        status: 0,
        remarks: '',
        createdAt: '',
        updatedAt: '',
        lastLogin: '',
        channel: '',
        lastActiveAfterLogin: '',
        userRights: {
          professionalExpireAt: '',
          droneExpireAt: '',
          freeExpertService: 0
        }
      },
      column: 1
    }
  },
  filters: {
    resultFilter(type) {
      return userStatusMap[type].text
    },
    resultTypeFilter(type) {
      return userStatusMap[type].status
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      getUserDetail(this.$route.params.id).then(res => {
        this.detail = res.data.user
      })
    },
    handleSave() {
      const params = {
        id: this.detail.id,
        remarks: this.detail.remarks
      }
      updateUserRemarks(params).then(res => {
        if (res.code === 0) {
          message.success('修改备注成功')
          this.goBack()
        }
      })
    },
    goBack() {
      if (this.$route.params.tag) {
        this.$router.push({
          name: 'userList',
          params: {
            pageNumber: this.$route.params.pageNumber,
            pageSize: this.$route.params.pageSize
          }
        })
      } else {
        this.$router.go(-1)
      }
    },
    showBig() {
      const url = this.detail.iconURL
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
    confirm() {
      cancelUserRight(this.detail.id).then(res => {
        if (res.code === 0) {
          message.success('权益取消成功')
          this.init()
        }
      })
    }
  }
}
</script>
<style lang="less" scoped></style>
