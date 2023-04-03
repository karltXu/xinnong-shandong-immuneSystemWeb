<template>
  <page-header-wrapper :title="false">
    <a-card :bordered="false">
      <a-descriptions
        title=""
        :column="1"
        bordered
      >
        <a-descriptions-item label="检测编号">
          {{ detail.seqNo }}
        </a-descriptions-item>
        <a-descriptions-item label="检测状态">
          <a-tag :color="detail.state | stateFilterColor ">
            {{ detail.state | stateFilterName }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="检测时间">
          {{ detail.createdAt }}
        </a-descriptions-item>
        <a-descriptions-item label="检测动物">
          <a-tag color="cyan" style="font-size: 22px; font-weight: bold; padding: 10px;">
            {{ detail.animal.animalName }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="检测项目">
          <span v-if="getExamination(detail.agencyExaminations) === '-'">-</span>
          <span v-else>
            <a-tag color="#2db7f5" v-for="(item,index) in getExamination(detail.agencyExaminations)" :key="index">
              {{ item }}
            </a-tag>
          </span>
        </a-descriptions-item>
        <a-descriptions-item label="检测单位">
          {{ detail.agency.name }}
        </a-descriptions-item>
        <!-- <a-descriptions-item label="是否归档">
          <a-tag :color="detail.archived ? '#f50' : '#2db7f5'">
            {{ detail.archived ? '是' : '否' }}
          </a-tag>
        </a-descriptions-item> -->
        <a-descriptions-item label="检测报告上传" v-if="hasPermission">
          <div style="position: relative;">
            <small class="note">注意，文件名不要重复哟～</small>
            <a-upload
              name="file"
              :multiple="true"
              :customRequest="ossUploadFile"
              :remove="handleRemove"
              :fileList="fileList"
              @change="handleFileChange"
            >
              <a-button> <a-icon type="upload" /> 点此上传 </a-button>
            </a-upload>
          </div>
        </a-descriptions-item>
        <a-descriptions-item label="检测报告下载">
          <div v-for="(item, index) in uploadFiles" :key="index">
            <a :href="item.url" target="_blank" rel="noopener noreferrer">{{ item.name }}</a>
          </div>
        </a-descriptions-item>
      </a-descriptions>
      <a-divider style="margin-bottom: 20px" />
      <a-button
        type="primary"
        @click="handleSave"
        :disabled="detail.state === 'Done'"
      >
        保存
      </a-button>
      <a-button
        @click="goBack"
        style="marginLeft: 12px"
      >
        返回
      </a-button>
    </a-card>
  </page-header-wrapper>
</template>
<script>
import { v4 as uuidv4 } from 'uuid'
import { getTestDetail, UpdateTest, getTestOptions } from '@/api/labtest'
import { getStsConfig, clientConstrctor } from '@/api/oss'
import { TestRecordMap } from '@/utils/constant'
import { message } from 'ant-design-vue'

export default {
  name: 'TestDetail',
  data() {
    return {
      detail: {
        seqNo: '',
        state: 'Done',
        animal: {
          animalName: ''
        },
        testCategoryNames: [],
        createdAt: '',
        agency: {
          name: ''
        }
      },
      fileList: [],
      uploadFiles: []
    }
  },
  created() {
    // 获取oss参数
    getStsConfig().then(res => {
      const { bucket, region, stsToken } = res.data
      this.client = clientConstrctor(bucket, region, stsToken)
    })
    this.getOption()
  },
  filters: {
    stateFilterName(val) {
      return TestRecordMap[val].text
    },
    stateFilterColor(val) {
      return TestRecordMap[val].status
    }
  },
  mounted() {
    this.init()
  },
  computed: {
    hasPermission() {
      return this.$store.getters.hasPermission('reportUpload')
    }
  },
  methods: {
    init() {
      getTestDetail(this.$route.params.id).then(res => {
        this.detail = res.data.testRecord
        const files = res.data.testRecord.reportUrls
        this.uploadFiles = files
        files.forEach(item => {
          const obj = {
            uid: Math.random(),
            status: 'done',
            name: item.name
          }
          this.fileList.push(obj)
        })
      })
    },
    getOption() {
      getTestOptions().then(res => {
        const { testCategoryOptions } = res.data
        this.testCategoryOptions = testCategoryOptions
      })
    },
    goBack() {
      this.$router.push({
        name: 'testList',
        params: {
          pageNumber: this.$route.params.pageNumber,
          pageSize: this.$route.params.pageSize
        }
      })
    },
    handleSave() {
       const param = {
            id: this.detail.id,
            reportUrls: this.uploadFiles
        }
        UpdateTest(param).then((res) => {
            if (res.code === 0) {
                message.success('修改成功')
                this.goBack()
            }
        })
    },
    handleFileChange(info) {
        this.fileList = info.fileList
    },
    async ossUploadFile(info) {
      try {
        const result = await this.client.put('user-content/ops/' + uuidv4() + '-' + info.file.name, info.file)
        const url = 'https://assets.aibcxw.com/' + result.name
        this.uploadFiles.push({
          name: info.file.name,
          url
        })
        this.fileList.forEach(item => {
          if (item.name === info.file.name) {
            item.status = 'done'
            this.$message.success(`${info.file.name} 文件上传成功`)
          }
        })
      } catch (e) {
        console.log(e)
      }
    },
    handleRemove(info) {
      let i = 0
      this.uploadFiles.forEach((item, index) => {
          if (item.name === info.name) {
            i = index
          }
      })
      this.uploadFiles.splice(i, 1)
    },
    getExamination(val) {
      if (val) {
        const arr = val.map(item => item.name)
        return arr
      } else {
        return '-'
      }
    }
  }
}
</script>
<style lang="less" scoped>
.avatar-uploader .ant-upload.ant-upload-select-picture-card {
  height: 100px;
}
.img {
  width: 100px;
}
.note {
  position: absolute;
  top: 6px;
  left: 180px;
  color: #c41d7f;
}
</style>
