<template>
  <page-header-wrapper :title="false">
    <a-card :bordered="false">
      <a-table :data-source="data" :columns="columns" :pagination="isTablePage" rowKey="id" :loading="tableLoading">
        <template slot="price" slot-scope="text">
          <span :style="{ color: '#33cccc' }">{{ text | priceFilter }}</span>
        </template>
        <span slot="pageUrl" slot-scope="text">
          <a :href="text" target="_blank">预览</a>
        </span>
        <template slot="action" slot-scope="text, record">
          <a type="link" a @click="handleCopy(record.pageUrl)">复制推广链接</a>
          <a-button type="link" @click="checkQrcode(record.pageUrl, text)">查看二维码</a-button>
        </template>
      </a-table>
      <br />
    </a-card>
    <a-modal :visible="visible" @ok="handleOk" @cancel="handleOk">
      <h3>ID: {{ id }}</h3>
      <canvas id="qrcode" style="margin: 1px auto"></canvas>
    </a-modal>
  </page-header-wrapper>
</template>

<script>
import { getChannels } from '@/api/channel'
const QRCode = require('qrcode')

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    fixed: 'left'
  },
  {
    title: '渠道名称',
    dataIndex: 'channel'
  },
  {
    title: '推广商户',
    dataIndex: 'promoter.nickname'
  },
  {
    title: '推广链接',
    dataIndex: 'pageUrl',
    scopedSlots: { customRender: 'pageUrl' }
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt'
  },
  {
    title: '操作',
    dataIndex: 'id',
    key: 'id2',
    fixed: 'right',
    width: '250px',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'LandingPage',
  data() {
    return {
      isTablePage: false,
      queryParam: {
        pageNumber: 1,
        pageSize: 10,
        used: '1',
        channelId: '0',
        promoterId: '0'
      },
      data: [],
      total: 0,
      columns,
      tableLoading: false,
      visible: false,
      id: ''
    }
  },
  filters: {
    priceFilter(type) {
      const interger = parseInt(type / 100)
      const float = type % 100
      return '¥ ' + interger + '.' + (float < 10 ? '0' + float : float)
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      getChannels().then(res => {
        this.data = res.data.channels
        this.total = res.data.total
        // this.visible = false
        this.data.forEach(item => {
          item.visible = false
        })
      })
    },
    handleCopy(url) {
      const input = document.createElement('input')
      input.setAttribute('readonly', 'readonly') // 防止手机上弹出软键盘
      input.setAttribute('value', url)
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      this.$message.success('复制成功')
    },
    checkQrcode(url, id) {
      this.visible = true
      this.id = id
      setTimeout(() => {
        QRCode.toCanvas(document.getElementById('qrcode'), url, function(error) {
          if (error) {
            console.error(error)
          }
        })
      }, 10)
    },
    handleOk() {
      this.visible = false
    }
  }
}
</script>
<style lang="less" scoped></style>
