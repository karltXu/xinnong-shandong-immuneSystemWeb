<template>
  <page-header-wrapper :title="false">
    <a-card :bordered="false">
      <a-descriptions title="" :column="column" bordered>
        <a-descriptions-item label="ID">{{ detail.id }}</a-descriptions-item>
        <a-descriptions-item label="广告类型">{{ detail.adType === 'Video' ? '视频' : '图片' }}</a-descriptions-item>

        <a-descriptions-item label="图片/视频">
          <img
            v-if="detail.adType === 'Image'"
            :src="detail.resourceUrl"
            style="width: 300px;cursor: pointer"
            @click="showBig"
          />
          <video
            v-if="detail.adType === 'Video'"
            :src="detail.resourceUrl"
            style="width: 300px"
            controls="controls"
          ></video>
        </a-descriptions-item>

        <a-descriptions-item label="创建修改时间">{{ detail.createdAt }}</a-descriptions-item>
        <a-descriptions-item label="投放状态">
          <a-radio-group v-model="detail.enabled">
            <a-radio :value="true">
              可用
            </a-radio>
            <a-radio :value="false">
              不可用
            </a-radio>
          </a-radio-group></a-descriptions-item
        >
      </a-descriptions>
      <a-divider style="margin-bottom: 20px" />
      <div class="center">
        <a-button type="primary" @click="onSubmit">
          保存
        </a-button>
        <a-button @click="goBack" style="margin-left: 10px;">
          返回
        </a-button>
      </div>
    </a-card>
  </page-header-wrapper>
</template>
<script>
import { getAdDetail, UpdateAd } from '@/api/ad'
import { message } from 'ant-design-vue'

export default {
  name: 'AdDetail',
  data() {
    return {
      detail: {
        enabled: true
      },
      column: 1
    }
  },
  created() {
    getAdDetail(this.$route.params.id).then(res => {
      this.detail = res.data.ad
    })
  },
  methods: {
    goBack() {
      this.$router.push({
        name: 'adManager',
        params: {
          pageNumber: this.$route.params.pageNumber,
          pageSize: this.$route.params.pageSize
        }
      })
    },
    showBig() {
      const url = this.detail.resourceUrl
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
    onSubmit() {
      const param = {
        id: this.detail.id,
        enabled: this.detail.enabled
      }
      UpdateAd(param).then(res => {
        if (res.code === 0) {
          message.success('修改成功')
          this.goBack()
        }
      })
    }
  }
}
</script>
<style lang="less" scoped></style>
