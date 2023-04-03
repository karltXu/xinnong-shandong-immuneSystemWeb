<template>
  <page-header-wrapper :title="false">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="课程名字">
                <a-input v-model="queryParam.title" @pressEnter="handleSearch" />
              </a-form-item>
            </a-col>
            <a-col :md="16" :sm="24">
              <a-form-item label="创建时间">
                <a-range-picker
                  @change="onDateChange"
                  v-model="date"
                  :ranges="{
                    本周: [moment().startOf('week'), moment()],
                    本月: [moment().startOf('month'), moment()],
                    本年: [moment().startOf('year'), moment()]
                  }"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="课程讲师">
                <a-select style="width: 100%" v-model="queryParam.expertId" @change="handleSearch">
                  <a-select-option :value="0">全部</a-select-option>
                  <a-select-option v-for="item in expertOptions" :value="item.expertId" :key="item.expertId">
                    {{ item.expertName }}
                  </a-select-option>
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
      <div style="display: flex;flex-wrap: wrap;">
        <a-card
          class="card"
          hoverable
          style="width: 300px"
          v-for="item in data"
          :key="item.id"
          @click="handleDetail(item.id)">
          <img
            slot="cover"
            alt="example"
            :src="item.coverUrl"
          />
          <template slot="actions" class="ant-card-actions">
            <span><a-icon key="setting" type="eye" />&nbsp;{{ item.views }}</span>
            <span>{{ item.createdAt }}</span>
            <!-- <a-icon key="ellipsis" type="file-search" /> -->
          </template>
          <a-card-meta :title="item.title" :description="descriptionNew(item.description)">
            <a-avatar
              slot="avatar"
              :src="item.expert.iconUrl"
            />
          </a-card-meta>
        </a-card>
      </div>
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
import moment from 'moment'
import { getCourseList, getCourseOptions } from '@/api/course'
// import { message } from 'ant-design-vue'

export default {
  name: 'CourseList',
  data() {
    return {
      isTablePage: false,
      queryParam: {
        pageNumber: 1,
        pageSize: 10,
        expertId: 0,
        title: ''
      },
      data: [],
      total: 0,
      searchLoading: false,
      tableLoading: false,
      expertOptions: [],
      date: [null, null]
    }
  },
  created() {
    if (this.$route.params.pageNumber) {
      this.queryParam.pageNumber = this.$route.params.pageNumber
      this.queryParam.pageSize = this.$route.params.pageSize
    }
    this.tableLoading = true
    this.init()
    this.getOption()
  },
  methods: {
    moment,
    init() {
      const param = JSON.parse(JSON.stringify(this.queryParam))
      if (this.queryParam.title === 'all') {
        param.title = ''
      }
      getCourseList(param).then(res => {
        this.data = res.data.courses
        this.total = res.data.total
        this.tableLoading = false
        this.searchLoading = false
      })
    },
    getOption() {
      getCourseOptions().then(res => {
          const { expertOptions, courseCategoryOptions } = res.data
          this.courseCategoryOptions = courseCategoryOptions
          this.expertOptions = expertOptions
      })
    },
    handleDetail(id) {
      const { pageNumber, pageSize } = this.queryParam
      this.$router.push({
        name: 'courseDetail',
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
      this.queryParam.title = ''
      this.queryParam.expertId = 0
      this.queryParam.createdAtStart = null
      this.queryParam.createdAtEnd = null
      this.queryParam.pageNumber = 1
      this.tableLoading = true
      this.init()
    },
    descriptionNew(val) {
      if (val.length > 26) {
        return val.substring(0, 26) + '...'
      } else {
        return val
      }
    },
    onDateChange(date, dateString) {
      this.date = date
      this.queryParam.createdAtStart = dateString[0]
      this.queryParam.createdAtEnd = dateString[1]
      this.init()
    }
  }
}
</script>
<style lang="less" scoped>
.card {
  margin: 0 20px 20px 0;
  .ant-card-cover img {
    width: 100%;
    height: 420px;
  }
  /deep/ .ant-card-meta-description {
    height: 42px;
  }
  /deep/ ul.ant-card-actions li:first-child {
    width: 40% !important;
  }
  /deep/ ul.ant-card-actions li:last-child {
    width: 60% !important;
  }
}
</style>
