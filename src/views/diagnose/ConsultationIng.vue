<template>
  <page-header-wrapper :title="false">
    <div v-if="!data || data.length === 0">
      <a-result status="403" title="当前没有即将进行的会诊哦～" sub-title="">
      </a-result>
    </div>
    <div v-else>

      <a-alert message="本页面每隔5秒自动刷新一次，会诊时间到了，按钮会自动置为可点击的绿色状态，请您耐心等待" type="info" show-icon />

      <div class="card-wrap">
        <div v-for="item in data" :key="item.id" class="card">
          <div class="pic">
            <img :src="item.expert.iconUrl" alt="avatar" />
          </div>
          <div class="content">
            <div class="row">
              <div class="title">会诊编号：</div>
              <div class="txt">{{ item.id }}</div>
            </div>
            <div class="row">
              <div class="title">会诊名称：</div>
              <div class="txt">{{ item.title }}</div>
            </div>
            <div class="row">
              <div class="title">会诊日期：</div>
              <div class="txt">{{ item.date }}</div>
            </div>
            <div class="row">
              <div class="title">会诊时间：</div>
              <div class="txt">{{ item.time }}</div>
            </div>
            <div class="row">
              <div class="title">参会人员：</div>
              <div class="txt">
                {{ item.expert ? item.expert.name : '-' }} <br/>
                {{ item.user ? item.user.nickname : '-' }} <br/>
                {{ item.agency ? item.agency.name : '-' }}
              </div>
            </div>
            <div class="btn">
              <a-button type="primary" block @click="getLink(item.id)" :disabled="!item.entryable">
                进入会诊室
              </a-button>
              <div style="text-align: center;">
                <small v-if="!item.entryable">距离会诊开始还有{{ item.last }}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="right" style="margin-top: 20px;">
        <a-pagination
          show-quick-jumper
          show-size-changer
          :pageSizeOptions="['5', '10', '20', '50']"
          :show-total="(total, range) => `${range[0]}-${range[1]} / 共 ${total} 条`"
          :current="queryParam.pageNumber"
          :pageSize="queryParam.pageSize"
          :total="total"
          @change="onPageChange"
          @showSizeChange="onShowSizeChange"
        />
      </div>
    </div>
  </page-header-wrapper>
</template>

<script>
import { getConsultationList, GetMeetingInfo } from '@/api/diagnose'

export default {
  name: 'ConsultationIng',
  data() {
    return {
      data: [],
      total: 0,
      queryParam: {
        pageNumber: 1,
        pageSize: 10,
        animalId: 0,
        state: 'room'
      }
    }
  },
  created() {
    this.init()
    this.timer = setInterval(() => {
      this.init()
    }, 5000)
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    init() {
      const param = JSON.parse(JSON.stringify(this.queryParam))

      getConsultationList(param).then(res => {
        this.data = res.data.consultations
        this.total = res.data.total

        res.data.consultations.forEach(item => {
          const now = Math.floor(new Date().getTime() / 1000)
          const d = new Date(item.meetingStart * 1000)
          const e = new Date(item.meetingEnd * 1000)
          const y = d.getFullYear()
          const m = d.getMonth() + 1
          const dd = d.getDate()

          const t1 = d.getHours()
          const t2 = d.getMinutes() || '00'
          const e1 = e.getHours()
          const e2 = e.getMinutes() || '00'

          const l = item.meetingStart - now
          const lastDay = Math.floor(l / 86400)
          const lastHour = Math.floor((l - lastDay * 86400) / 3600)
          const lastMinute = Math.floor((l - lastDay * 86400 - lastHour * 3600) / 60)

          item.date = y + '-' + m + '-' + dd
          item.time = t1 + ':' + t2 + '~' + e1 + ':' + e2
          item.last = `${lastDay}天${lastHour}小时${lastMinute}分`
        })
      })
    },
    getLink(id) {
      GetMeetingInfo({ id }).then(res => {
        window.open(res.data.meetingLink, '_blank')
      })
    },
    handleDetail(record) {
      const { pageNumber, pageSize } = this.queryParam
      this.$router.push({
        name: 'consultationDetail',
        params: { ...record, pageNumber, pageSize }
      })
    },
    onPageChange(pageNumber) {
      this.queryParam.pageNumber = pageNumber
      this.init()
    },
    onShowSizeChange(current, pageSize) {
      this.queryParam.pageSize = pageSize
      this.queryParam.pageNumber = current
      this.init()
    }
  }
}
</script>
<style lang="less" scoped>
.card-wrap {
  display: flex;
  flex-wrap: wrap;
  .card {
    position: relative;
    display: flex;
    flex-direction: row;
    border: 1px solid #e8e8e8;
    background: #fff;
    cursor: pointer;
    border-radius: 2px;
    width: 420px;
    height: 236px;
    margin: 10px;
    box-shadow: 2px 2px 2px #e8e8e8;

    .pic {
      img {
        width: 170px;
        height: 234px;
      }
    }
    .content {
      width: 250px;
      height: 236px;
      padding: 14px 20px;
    }
    .row {
      display: flex;
      flex-direction: row;
      .title {
        width: 75px;
        font-weight: 600;
      }
      .txt {
        flex: 1;
      }
    }
    .btn {
      position: absolute;
      bottom: 14px;
      width: 208px;
    }
  }

}
</style>
