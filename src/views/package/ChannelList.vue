<template>
  <page-header-wrapper :title="false">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="6" :sm="24">
              <a-form-item label="渠道名称">
                <a-select
                  v-model="queryParam.channelId"
                  show-search
                  placeholder="请选择一个渠道名称"
                  option-filter-prop="children"
                  style="width: 100%"
                  :filter-option="filterOption"
                  @change="handleSearch"
                >
                  <a-select-option value="0">
                    全部
                  </a-select-option>
                  <a-select-option v-for="item in channels" :value="item.id" :key="item.id">
                    {{ item.channel }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="推广商户">
                <a-select
                  v-model="queryParam.promoterId"
                  show-search
                  placeholder="请选择一个推广商户"
                  option-filter-prop="children"
                  style="width: 100%"
                  :filter-option="filterOption"
                  @change="handleSearch"
                >
                  <a-select-option value="0">
                    全部
                  </a-select-option>
                  <a-select-option v-for="item in promoters" :value="item.id" :key="item.id">
                    {{ item.nickname }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="5" :sm="24">
              <a-form-item label="是否占用">
                <a-select v-model="queryParam.used" style="width: 100%" @change="handleSearch">
                  <a-select-option value="-1">
                    全部
                  </a-select-option>
                  <a-select-option value="1">
                    占用
                  </a-select-option>
                  <a-select-option value="0">
                    未占用
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="5" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button type="primary" @click="handleSearch" :loading="searchLoading">查询</a-button>
                <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <a-table :data-source="data" :columns="columns" :pagination="isTablePage" rowKey="id" :loading="tableLoading">
        <template slot="price" slot-scope="text">
          <span :style="{ color: '#33cccc' }">{{ text | priceFilter }}</span>
        </template>
        <span slot="used" slot-scope="text">
          <a-tag :color="text === 0 ? 'green' : ''">
            {{ text === 1 ? '占用' : '未占用' }}
          </a-tag>
        </span>
        <template slot="action" slot-scope="text, record">
          <a @click="handleDetail(record.id)">详情</a>
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
import { getChannelList, getChannels, getPromoterList } from '@/api/channel'

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
    title: '渠道用途',
    dataIndex: 'desc'
  },
  {
    title: '是否占用',
    dataIndex: 'used',
    scopedSlots: { customRender: 'used' }
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt'
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
        pageSize: 10,
        used: '1',
        channelId: '0',
        promoterId: '0'
      },
      data: [],
      total: 0,
      columns,
      searchLoading: false,
      tableLoading: false,
      channels: [],
      promoters: []
    }
  },
  filters: {
    priceFilter(type) {
      const interger = parseInt(type / 100)
      const float = type % 100
      return '¥ ' + interger + '.' + (float < 10 ? '0' + float : float)
    }
  },
  beforeMount() {
    getChannels().then(res => {
      this.channels = res.data.channels
    })
    getPromoterList().then(res => {
      this.promoters = res.data.promoters
    })
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
      getChannelList(this.queryParam).then(res => {
        this.data = res.data.channels
        this.total = res.data.total
        this.tableLoading = false
        this.searchLoading = false
      })
    },
    handleDetail(id) {
      const { pageNumber, pageSize } = this.queryParam
      this.$router.push({
        name: 'channelDetail',
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
    },
    handleSearch() {
      this.queryParam.pageNumber = 1
      this.searchLoading = true
      this.init()
    },
    handleReset() {
      this.queryParam.pageNumber = 1
      this.queryParam.promoterId = '0'
      this.queryParam.used = '-1'
      this.queryParam.channelId = '0'
      this.tableLoading = true
      this.init()
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }
  }
}
</script>
<style lang="less" scoped></style>
