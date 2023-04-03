<template>
  <page-header-wrapper :title="false">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="专家名字">
                <a-input v-model="queryParam.name" @pressEnter="handleSearch" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="专家职称">
                <a-select style="width: 100%" v-model="queryParam.title" @change="handleSearch">
                  <a-select-option value="all">全部</a-select-option>
                  <a-select-option v-for="item in titleOptions" :value="item" :key="item">
                    {{ item }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="擅长种类">
                <a-select mode="multiple" style="width: 100%" v-model="goodAtAnimalNamesArr" @change="handleSearch">
                  <a-select-option v-for="item in animalNameOptions" :key="item">
                    {{ item }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="从业年限">
                <a-input-number v-model="queryParam.workingAgeMin" :min="0" :max="1000" @change="handleSearch" />-
                <a-input-number v-model="queryParam.workingAgeMax" :min="0" :max="1000" @change="handleSearch" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="展示状态">
                <a-select placeholder="请选择" default-value="all" v-model="queryParam.blocked" @change="handleSearch">
                  <a-select-option value="all">全部</a-select-option>
                  <a-select-option :value="0">正常</a-select-option>
                  <a-select-option :value="1">禁用</a-select-option>
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
      <a-table :data-source="data" :columns="columns" :pagination="isTablePage" rowKey="id" :loading="tableLoading">
        <template slot="expertsId" slot-scope="text">
          <a @click="handleDetail(text)">{{ text }}</a>
        </template>
        <template slot="imgURL" slot-scope="text">
          <img :src="text" alt="head img" style="height: 50px;max-width: 100px;">
        </template>
        <span slot="disabled" slot-scope="text">
          <a-tag :color="text === 0 ? 'green' : ''">
            {{ text === 0 ? '正常' : '禁用' }}
          </a-tag>
        </span>
        <template slot="action" slot-scope="text, record">
          <a @click="handleDetail(record.id)" style="margin-right: 4px">编辑</a>
          <!-- <a-popconfirm title="确定要删除此专家吗？" ok-text="是" cancel-text="否" @confirm="handleDelete(record.id)">
            <a href="#" style="margin-left: 15px">删除</a>
          </a-popconfirm> -->
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
import { getExpertList, DeleteExpert, getExpertOptions } from '@/api/expert'
import { message } from 'ant-design-vue'

const columns = [
  {
    title: '专家ID',
    dataIndex: 'id',
    fixed: 'left',
    scopedSlots: { customRender: 'expertsId' }
  },
  {
    title: '头像',
    dataIndex: 'iconUrl',
    scopedSlots: { customRender: 'imgURL' }
  },
  {
    title: '姓名',
    dataIndex: 'name'
  },
  {
    title: '职称',
    dataIndex: 'title'
  },
  {
    title: '从业年限',
    dataIndex: 'workingAge'
  },
  {
    title: '联系电话',
    dataIndex: 'phone'
  },
  {
    title: '擅长种类',
    dataIndex: 'goodAtAnimalNames'
  },
  {
    title: '展示状态',
    dataIndex: 'blocked',
    scopedSlots: { customRender: 'disabled' }
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
  name: 'UserList',
  data() {
    return {
      isTablePage: false,
      queryParam: {
        pageNumber: 1,
        pageSize: 10,
        name: '',
        title: 'all',
        goodAtAnimalNames: '',
        blocked: 'all',
        workingAgeMin: 0,
        workingAgeMax: 0
      },
      goodAtAnimalNamesArr: [],
      data: [],
      total: 0,
      columns,
      searchLoading: false,
      tableLoading: false,
      titleOptions: [],
      animalNameOptions: []
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
    init() {
      const param = JSON.parse(JSON.stringify(this.queryParam))
      if (this.queryParam.title === 'all') {
        param.title = ''
      }

      getExpertList(param).then(res => {
        this.data = res.data.experts
        this.total = res.data.total
        this.tableLoading = false
        this.searchLoading = false
      })
    },
    getOption() {
        getExpertOptions().then(res => {
        const { animalNameOptions, majorOptions, qualificationsOptions, sexOptions, titleOptions } = res.data
        this.animalNameOptions = animalNameOptions
        this.majorOptions = majorOptions
        this.qualificationsOptions = qualificationsOptions
        this.sexOptions = sexOptions
        this.titleOptions = titleOptions
      })
    },
    handleDetail(id) {
      const { pageNumber, pageSize } = this.queryParam
      this.$router.push({
        name: 'expertsDetail',
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
      this.queryParam.goodAtAnimalNames = this.goodAtAnimalNamesArr.join(',')
      this.queryParam.pageNumber = 1
      this.searchLoading = true
      this.init()
    },
    handleReset() {
      this.queryParam.name = ''
      this.queryParam.title = 'all'
      this.queryParam.goodAtAnimalNames = ''
      this.goodAtAnimalNamesArr = []
      this.queryParam.workingAgeMin = 0
      this.queryParam.workingAgeMax = 0
      this.queryParam.blocked = 'all'
      this.queryParam.pageNumber = 1
      this.tableLoading = true
      this.init()
    },
    handleDelete(id) {
      DeleteExpert(id).then(res => {
        if (res.code === 0) {
          message.success('删除成功')
          this.init()
        }
      })
    }
  }
}
</script>
<style lang="less" scoped></style>
