<template>
  <page-header-wrapper :title="false">
    <a-card :bordered="false">
      <a-descriptions title="" :column="column" bordered>
        <a-descriptions-item label="记录ID" span="2">{{ detail.id }}</a-descriptions-item>
        <a-descriptions-item label="用户ID" span="2">
          <router-link :to="{ name: 'userDetail', params: { id: detail.userId } }">{{ detail.userId }}</router-link>
        </a-descriptions-item>
        <a-descriptions-item label="诊断地址" span="2">
          <span v-if="detail.province === null && detail.city === null && detail.district === null">无</span>
          <span v-else>{{ detail.province }}{{ detail.city }}{{ detail.district }}</span>
        </a-descriptions-item>
        <a-descriptions-item label="经度">{{ detail.longitude }}</a-descriptions-item>
        <a-descriptions-item label="纬度">{{ detail.latitude }}</a-descriptions-item>
        <a-descriptions-item label="地图位置" span="2">
          <Map :lng="detail.longitude" :lat="detail.latitude" :hideSearch="true"></Map>
        </a-descriptions-item>
        <a-descriptions-item label="主诉症状" span="2">
          {{ detail.chiefComplaint }}
        </a-descriptions-item>
        <a-descriptions-item label="一般症状" span="2">
          {{ detail.generalInformation }}
        </a-descriptions-item>
        <a-descriptions-item label="异常症状" span="2">
          {{ detail.medicalRecord }}
        </a-descriptions-item>
        <a-descriptions-item label="诊断结果" span="2">
          <span v-for="(item, index) in detail.diagnosisResult" :key="item.diseaseName">
            <a>{{ index + 1 }}.{{ item.diseaseName }}({{ item.probability }})<span
              v-html="'\u00a0\u00a0\u00a0\u00a0'"></span></a>
          </span>
        </a-descriptions-item>
        <!--        <a-descriptions-item label="识别套餐" span="2">-->
        <!--          <a-tag v-if="detail.servicePlan === 'Drone'" color="purple">-->
        <!--            飞手版-->
        <!--          </a-tag>-->
        <!--          <a-tag v-else-if="detail.servicePlan === 'Free'" color="#2db7f5">-->
        <!--            普通版-->
        <!--          </a-tag>-->
        <!--          <a-tag v-else-if="detail.servicePlan === 'Professional'" color="cyan">-->
        <!--            专业版-->
        <!--          </a-tag>-->
        <!--          <a-tag v-else color="orange">-->
        <!--            暂无(历史数据)-->
        <!--          </a-tag>-->
        <!--        </a-descriptions-item>-->
        <!--        <a-descriptions-item label="识别结果" span="2">-->
        <!--          &lt;!&ndash; <span>{{ detail.result ? (detail.result.disease ? detail.result.disease : detail.result) : ''
        }}</span> &ndash;&gt;-->
        <!--          <a :href="detail.detailUrl" target="_blank"> {{ detail.detailUrl }}</a>-->
        <!--        </a-descriptions-item>-->
        <!--        <a-descriptions-item label="用户对识别结果的反馈" span="2">{{ detail.feedback }}</a-descriptions-item>-->
        <a-descriptions-item label="创建时间">{{ detail.createdAt }}</a-descriptions-item>
        <a-descriptions-item label="最后修改时间">{{ detail.updatedAt }}</a-descriptions-item>
      </a-descriptions>
      <a-divider style="margin-bottom: 20px"/>
      <a-button type="primary" @click="goBack">
        返回
      </a-button>
    </a-card>
  </page-header-wrapper>
</template>
<script>
import { getAiDetail } from '@/api/diagnose'
import { diagnoseResultMap } from '@/utils/constant'
import Map from '@/components/MapContainer'

export default {
  name: 'AIDetail',
  data() {
    return {
      detail: {
        state: 'DoneSuccess'
      },
      column: 2
    }
  },
  components: {
    Map
  },
  filters: {
    resultFilter(type) {
      return diagnoseResultMap[type].text
    },
    resultTypeFilter(type) {
      return diagnoseResultMap[type].status
    }
  },
  created() {
  },
  mounted() {
    getAiDetail(this.$route.params.id).then(res => {
      const result = res.data.recognition
      // DUCG 这边应该是把病历中某些变量的状态描述默认为“有”、“阳性”这两种情况时，自动去掉了变量状态。
      result.medicalRecord = result.medicalRecord.split('，').filter(value => {
        if (!value.includes('-有') && !value.includes('-无')) return true
        return value.includes('-有')
      }).join('； ')
      this.detail = result
    })
  },
  methods: {
    goBack() {
      if (this.$route.params.tag) {
        this.$router.push({
          name: 'diagnoseAIList',
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
      const url = this.detail.imageUrl
      this.$info({
        title: '',
        width: '70%',
        maskClosable: true,
        content: (
          <div style="text-align: center">
            <img src={url} style="max-width: 100%;max-height: 500px; "/>
          </div>
        )
      })
    }
  }
}
</script>
<style lang="less" scoped>
#map {
  width: 100%;
  height: 400px;
}
</style>
