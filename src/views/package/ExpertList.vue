<template>
  <page-header-wrapper :title="false">
    <a-card :bordered="false">
      <a-table :data-source="data" :columns="columns" :pagination="isTablePage" rowKey="itemId" :loading="tableLoading">
        <template slot="price" slot-scope="text">
          <span :style="{ color: '#33cccc' }">{{ text | priceFilter }}</span>
        </template>
        <span slot="enabled" slot-scope="text">
          <a-tag :color="text === 1 ? 'green' : ''">
            {{ text === 1 ? '可用' : '不可用' }}
          </a-tag>
        </span>
        <template slot="action" slot-scope="text, record">
          <a @click="handleDetail(record.itemId)">详情</a>
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
import { getExpertServiceList } from '@/api/package'

const columns = [
  {
    title: 'ID',
    dataIndex: 'itemId',
    fixed: 'left'
  },
  {
    title: '套餐名称',
    dataIndex: 'title'
  },
  {
    title: '套餐价格',
    dataIndex: 'price',
    scopedSlots: { customRender: 'price' }
  },
  {
    title: '是否可用',
    dataIndex: 'enabled',
    scopedSlots: { customRender: 'enabled' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    fixed: 'right',
    width: '80px',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'ExpertList',
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
      getExpertServiceList(this.queryParam).then(res => {
        this.data = res.data.expertServices
        this.total = res.data.total
        this.tableLoading = false
        this.searchLoading = false
      })
    },
    handleDetail(id) {
      console.log('id: ', id)
      const { pageNumber, pageSize } = this.queryParam
      this.$router.push({
        name: 'packageExpertDetail',
        params: { id, pageNumber, pageSize }
      })
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
    }
  }
}
</script>
<style lang="less" scoped></style>
