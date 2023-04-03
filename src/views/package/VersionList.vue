<template>
  <page-header-wrapper :title="false">
    <a-card :bordered="false">
      <!-- <a-button type="primary" icon="plus" @click="createNew">
        添加新版本
      </a-button>
      <br />
      <br />-->
      <a-table :data-source="data" :columns="columns" :pagination="isTablePage" rowKey="id" :loading="tableLoading">
        <span slot="enabled" slot-scope="text">
          <a-tag :color="text === true ? 'green' : 'red'">
            {{ text === true ? '可用' : '不可用' }}
          </a-tag>
        </span>
        <span slot="forceUpdate" slot-scope="text">
          <a-tag :color="text === true ? '#2db7f5' : ''">
            {{ text === true ? '是' : '否' }}
          </a-tag>
        </span>
        <template slot="action" slot-scope="text, record">
          <a @click="handleDetail(record.id)">详情</a>
          <!-- <a @click="handleDownload(record.downloadUrl)"> 查看渠道包</a> -->
        </template>
      </a-table>
      <br />
      <div class="right">
        <a-pagination
          show-quick-jumper
          show-size-changer
          :pageSizeOptions="['2', '10', '20', '50']"
          :show-total="(total, range) => `${range[0]}-${range[1]} / 共 ${total} 条`"
          :current="queryParam.pageNumber"
          :pageSize="queryParam.pageSize"
          :total="total"
          @change="onPageChange"
          @showSizeChange="onShowSizeChange"
        />
      </div>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { getVersionList } from '@/api/version'

const columns = [
  {
    title: '版本号',
    dataIndex: 'vercode',
    fixed: 'left'
  },
  {
    title: '版本名称',
    dataIndex: 'vername'
  },
  {
    title: '是否开启',
    dataIndex: 'enabled',
    scopedSlots: { customRender: 'enabled' }
  },
  {
    title: '是否强制更新',
    dataIndex: 'forceUpdate',
    scopedSlots: { customRender: 'forceUpdate' }
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt'
  },
  {
    title: '操作',
    dataIndex: 'action',
    fixed: 'right',
    width: '100px',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'VIPList',
  data() {
    return {
      isTablePage: false,
      queryParam: {
        pageNumber: 1,
        pageSize: 10
      },
      data: [],
      total: 0,
      columns,
      searchLoading: false,
      tableLoading: false
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
    if (this.$route.params.pageNumber) {
      this.queryParam.pageNumber = this.$route.params.pageNumber
      this.queryParam.pageSize = this.$route.params.pageSize
    }
    this.tableLoading = true
    this.init()
  },
  methods: {
    init() {
      console.log('init')
      getVersionList(this.queryParam).then(res => {
        this.data = res.data.versions
        this.total = res.data.total
        this.tableLoading = false
        this.searchLoading = false
      })
    },
    handleDetail(id) {
      console.log('id: ', id)
      const { pageNumber, pageSize } = this.queryParam
      this.$router.push({
        name: 'versionDetail',
        params: { id, pageNumber, pageSize }
      })
    },
    handleDownload(url) {
      window.open(url)
    },
    onPageChange(pageNumber) {
      this.tableLoading = true
      this.queryParam.pageNumber = pageNumber
      this.init()
    },
    onShowSizeChange(current, pageSize) {
      this.tableLoading = true
      this.queryParam.pageSize = pageSize
      this.queryParam.pageNumber = current
      this.init()
    },
    createNew() {
      this.$router.push({
        name: 'versionNew'
      })
    }
  }
}
</script>
<style lang="less" scoped></style>
