<template>
  <page-header-wrapper :title="false">
    <a-card :bordered="false">
      <a-button type="primary" icon="plus" @click="createNew">
        添加新广告
      </a-button>
      <br />
      <br />
      <a-table :data-source="data" :columns="columns" :pagination="isTablePage" rowKey="id" :loading="tableLoading">
        <span slot="enabled" slot-scope="text">
          <a-tag :color="text === true ? 'green' : 'red'">
            {{ text === true ? '可用' : '不可用' }}
          </a-tag>
        </span>
        <span slot="adType" slot-scope="text">
          <span>
            {{ text === 'Video' ? '视频' : '图片' }}
          </span>
        </span>
        <span slot="resourceUrl" slot-scope="text, record">
          <img v-if="record.adType === 'Image'" :src="text" style="height: 100px" />
          <video v-if="record.adType === 'Video'" :src="text" style="height: 100px" controls="controls"></video>
        </span>
        <template slot="action" slot-scope="text, record">
          <a @click="handleDetail(record.id)">详情 </a>
          <a-popconfirm
            title="确定要永久删除此广告吗?"
            ok-text="是"
            cancel-text="否"
            @confirm="confirmDelete(record.id)"
          >
            <a style="margin-left: 13px"> 删除</a>
          </a-popconfirm>
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
import { getAdList, DeleteAd } from '@/api/ad'
import { message } from 'ant-design-vue'

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    fixed: 'left'
  },
  {
    title: '广告类型',
    dataIndex: 'adType',
    scopedSlots: { customRender: 'adType' }
  },
  {
    title: '图片/视频',
    dataIndex: 'resourceUrl',
    scopedSlots: { customRender: 'resourceUrl' }
  },
  {
    title: '投放状态',
    dataIndex: 'enabled',
    scopedSlots: { customRender: 'enabled' }
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt'
  },
  {
    title: '操作',
    dataIndex: 'action',
    fixed: 'right',
    width: '120px',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'AdList',
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
      getAdList(this.queryParam).then(res => {
        this.data = res.data.ads
        this.total = res.data.total
        this.tableLoading = false
        this.searchLoading = false
      })
    },
    handleDetail(id) {
      const { pageNumber, pageSize } = this.queryParam
      this.$router.push({
        name: 'adDetail',
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
    createNew() {
      this.$router.push({
        name: 'adNew'
      })
    },
    confirmDelete(id) {
      DeleteAd(id).then(res => {
        if (res.code === 0) {
          message.success('删除成功')
          this.queryParam.pageNumber = 1
          this.init()
        }
      })
    }
  }
}
</script>
<style lang="less" scoped></style>
