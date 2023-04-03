<template>
  <page-header-wrapper :title="false">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="所属分类">
                <a-select placeholder="请选择" default-value="0" v-model="queryParam.categoryId">
                  <a-select-option value="0">全部</a-select-option>
                  <a-select-option value="1">兽类</a-select-option>
                  <a-select-option value="2">禽类</a-select-option>
                  <a-select-option value="3">水产</a-select-option>
                  <a-select-option value="4">宠物</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button type="primary" @click="handleSearch" :loading="searchLoading">查询</a-button>
                <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <a-table :data-source="data" :columns="columns" :pagination="isTablePage" rowKey="plantID" :loadig="tableLoading">
        <span slot="isDrone" slot-scope="text">
          <a-tag :color="text === 0 ? '' : 'green'">
            {{ text === 0 ? '不支持' : '支持' }}
          </a-tag>
        </span>
      </a-table>
      <br />
      <div class="right">
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
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { getCropList } from '@/api/crops'

const columns = [
  {
    title: '动物ID',
    dataIndex: 'plantID',
    fixed: 'left'
  },
  {
    title: '动物名称',
    dataIndex: 'plantName'
  },
  {
    title: '所属分类',
    dataIndex: 'categoryName'
  }
  // ,
  // {
  //   title: '是否支持飞手版',
  //   dataIndex: 'isDrone',
  //   scopedSlots: { customRender: 'isDrone' }
  // }
]

export default {
  name: 'AIList',
  data() {
    return {
      isTablePage: false,
      queryParam: {
        pageNumber: 1,
        pageSize: 10,
        categoryId: '0'
      },
      data: [],
      total: 0,
      columns,
      searchLoading: false,
      tableLoading: false
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      getCropList(this.queryParam).then(res => {
        this.data = res.data.plants
        this.total = res.data.total
        this.tableLoading = false
        this.searchLoading = false
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
      this.queryParam.categoryId = '0'
      this.tableLoading = true
      this.init()
    }
  }
}
</script>
<style lang="less" scoped></style>
