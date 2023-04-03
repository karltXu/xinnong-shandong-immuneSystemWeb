<template>
  <page-header-wrapper :title="false">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <!-- <a-row :gutter="48">
            <a-col :md="12" :sm="24">
              <a-form-item label="id">
                <a-input v-model="form.id" disabled />
              </a-form-item>
            </a-col>
          </a-row> -->
          <a-row :gutter="48">
            <a-col :md="12" :sm="24">
              <a-form-item label="标题">
                <a-input v-model="form.title" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="48">
            <a-col :md="16" :sm="24">
              <a-form-item label="上传封面图片">
                <div v-for="(item, index) in fileList" :key="index" class="div-img">
                  <img :src="item" class="image" @click="handlePreview(item)" />
                  <div class="delete" @click="handleDelete(index)"><span>×</span></div>
                </div>
                <a-upload
                  list-type="picture-card"
                  :show-upload-list="false"
                  :before-upload="beforeUpload"
                  :customRequest="ossUpload"
                  style="float: left"
                >
                  <div v-if="fileList.length < 8">
                    <a-icon type="plus" />
                    <div class="ant-upload-text">
                      Upload
                    </div>
                  </div>
                </a-upload>
                <a-modal :visible="previewVisible" :footer="null" @cancel="handleHide">
                  <img alt="example" style="width: 100%" :src="previewImage" />
                </a-modal>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="48">
            <a-col :md="12" :sm="24">
              <a-form-item label="类别">
                <a-select placeholder="请选择" v-model="form.categoryId">
                  <a-select-option v-for="item in options" :value="item.id" :key="item.id">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="48">
            <a-col :md="12" :sm="24">
              <a-form-item label="描述">
                <a-textarea :auto-size="{ minRows: 2, maxRows: 2 }" v-model="form.description" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <a-row :gutter="48">
        <a-col :md="24" :sm="24">
          <a-form-item label="正文：">
            <TEditor v-model="content"></TEditor>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col class="center">
          <span class="table-page-search-submitButtons">
            <a-button type="primary" @click="handleSave" :loading="loading">保存</a-button>
            <a-button type="danger" style="margin-left: 8px" @click="handleCancel">取消</a-button>
          </span>
        </a-col>
      </a-row>
    </a-card>
  </page-header-wrapper>
</template>
<script>
import { v4 as uuidv4 } from 'uuid'
import { getBlogOptions, getBlogDetail, UpdateBlog } from '@/api/blog'
import { getStsConfig, clientConstrctor } from '@/api/oss'
import TEditor from '@/components/Editor/TinyMceEditor'

var optionsMap = {}

export default {
  name: 'BlogNew',
  components: {
    TEditor
  },
  data() {
    return {
      form: {
        id: '',
        title: '',
        categoryId: '',
        description: ''
      },
      content: '',
      options: [],
      loading: false,
      client: {},
      fileList: [],
      previewVisible: false,
      previewImage: ''
    }
  },
  created() {
    getStsConfig().then(res => {
      const { bucket, region, stsToken } = res.data
      this.client = clientConstrctor(bucket, region, stsToken)
    })

    getBlogOptions().then(res => {
      this.options = res.data.options
      for (const item of res.data.options) {
        optionsMap[item.id] = item.name
      }
    })
  },
  mounted() {
    getBlogDetail(this.$route.params.id).then(res => {
      this.form = res.data.blog
      this.content = res.data.blog.content
      this.fileList = res.data.blog.imageUrls
    })
  },
  methods: {
    handleSave() {
      this.loading = true
      const params = {
        ...this.form,
        content: this.content,
        imageUrls: this.fileList.join(',')
      }
      UpdateBlog(params).then(res => {
        this.loading = false
        if (res.code === 0) {
          this.handleCancel()
        }
      })
    },
    handleCancel() {
      this.$router.push({
        name: 'blogList',
        params: {
          pageNumber: this.$route.params.pageNumber,
          pageSize: this.$route.params.pageSize
        }
      })
    },
    handleHide() {
      this.previewVisible = false
    },
    async handlePreview(url) {
      this.previewImage = url
      this.previewVisible = true
    },
    handleDelete(index) {
      this.fileList.splice(index, 1)
    },
    async ossUpload(info) {
      try {
        const result = await this.client.put('user-content/ops/' + uuidv4() + '-' + info.file.name, info.file)
        const imageUrl = 'https://assets.aibcxw.com/' + result.name
        this.fileList.push(imageUrl)
      } catch (e) {
        console.log(e)
      }
    },
    beforeUpload(file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJpgOrPng) {
        this.$message.error('You can only upload JPG/PNG file!')
      }
      const isLt2M = file.size / 1024 / 1024 < 20
      if (!isLt2M) {
        this.$message.error('Image must smaller than 20MB!')
      }
      return isJpgOrPng && isLt2M
    }
  }
}
</script>

<style lang="less">
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
.div-img {
  float: left;
  width: 104px;
  height: 104px;
  padding: 4px;
  margin: 8px;
}
.image {
  width: 100px;
  height: 100px;
}
.delete {
  display: inline-block;
  position: relative;
  top: -105px;
  left: 93px;
  cursor: pointer;
  width: 15px;
  height: 15px;
  border: 1px solid #ff0000;
  color: #ff0000;
  border-radius: 50%;
  span {
    color: #ff0000;
    position: relative;
    top: -10px;
    left: 2px;
  }
}
</style>
