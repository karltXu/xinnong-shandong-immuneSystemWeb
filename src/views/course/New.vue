<template>
  <page-header-wrapper :title="false">
    <a-card :bordered="false">
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item
          label="课程名称"
          prop="title"
        >
          <a-input v-model="form.title" />
        </a-form-model-item>
        <a-form-model-item
          label="课程讲师"
          prop="expertId"
        >
          <a-select style="width: 300px" v-model="form.expertId">
            <a-select-option v-for="item in expertOptions" :value="item.expertId" :key="item.expertId">
              {{ item.expertName }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="课程视频">
          <a-upload
            name="videowurl"
            list-type="picture-card"
            class="avatar-uploader"
            :show-upload-list="false"
            :before-upload="beforeUpload2"
            :customRequest="ossUpload2"
          >
            <video v-if="form.videoUrl" :src="form.videoUrl" controls="controls" width="200">
              您的浏览器不支持 video 标签。
            </video>
            <div v-else>
              <a-icon :type="loading2 ? 'loading' : 'plus'" />
              <div class="ant-upload-text">
                上传
              </div>
            </div>
          </a-upload>
        </a-form-model-item>
        <a-form-model-item label="课程宣传图">
          <a-upload
            name="avatar"
            list-type="picture-card"
            class="avatar-uploader"
            :show-upload-list="false"
            :before-upload="beforeUpload"
            :customRequest="ossUpload"
          >
            <img
              v-if="form.coverUrl"
              :src="form.coverUrl"
              alt="logo"
              class="img"
            />
            <div v-else>
              <a-icon :type="loading ? 'loading' : 'plus'" />
              <div class="ant-upload-text">
                上传
              </div>
            </div>
          </a-upload>
          <a @click="checkBig(1)">放大查看</a>
        </a-form-model-item>

        <a-form-model-item
          label="课程分类"
          prop="categoryId"
        >
          <a-select style="width: 300px" v-model="form.categoryId">
            <a-select-option v-for="item in courseCategoryOptions" :value="item.id" :key="item.id">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>

        <a-form-model-item
          label="课程简介"
          prop="description"
        >
          <a-textarea
            :auto-size="{ minRows: 2, maxRows: 10 }"
            v-model="form.description"
          />
        </a-form-model-item>

        <a-form-model-item :wrapper-col="{ span: 10, offset: 8 }">
          <a-button
            type="primary"
            @click="onSubmit"
            :loading="saveLoading"
          >
            保存
          </a-button>
          <a-button
            style="margin-left: 10px;"
            @click="resetForm"
          >
            重置
          </a-button>
        </a-form-model-item>
      </a-form-model>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { v4 as uuidv4 } from 'uuid'
import { CreateCourse, getCourseOptions } from '@/api/course'
import { getStsConfig, clientConstrctor } from '@/api/oss'
import { message } from 'ant-design-vue'

export default {
    name: 'ExpertNew',
    data() {
        return {
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
            loading: false,
            loading2: false,
            form: {
            },
            rules: {
                title: [{ required: true, message: '请输入课程名字', trigger: 'blur' }],
                categoryId: [{ required: true, message: '请输入课程分类', trigger: 'blur' }],
                expertId: [{ required: true, message: '请输入课程讲师', trigger: 'blur' }],
                description: [{ required: true, message: '请输入课程简介', trigger: 'blur' }]
            },
            client: {},
            saveLoading: false,
            expertOptions: [],
            courseCategoryOptions: []
        }
    },
    created() {
        // 获取oss参数
        getStsConfig().then((res) => {
            const { bucket, region, stsToken } = res.data
            this.client = clientConstrctor(bucket, region, stsToken)
        })
        this.getOption()
    },
    mounted() {},
    methods: {
        getOption() {
          getCourseOptions().then(res => {
              const { expertOptions, courseCategoryOptions } = res.data
              this.courseCategoryOptions = courseCategoryOptions
              this.expertOptions = expertOptions
          })
        },
        onSubmit() {
            this.saveLoading = true
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    //  新建
                    const param = {
                        ...this.form
                    }

                    CreateCourse(param).then((res) => {
                        if (res.code === 0) {
                            message.success('新建课程成功')
                            this.$router.push({
                                name: 'coursesList'
                            })
                        }
                    }).catch(res => {
                      this.saveLoading = false
                    })
                } else {
                    this.saveLoading = false
                    message.warning('请先填写完整再提交哦！')
                }
            })
        },
        resetForm() {
            this.saveLoading = false
            this.$refs.ruleForm.resetFields()
        },
        async ossUpload(info) {
            try {
                this.loading = true
                const result = await this.client.put('user-content/ops/' + uuidv4() + '-' + info.file.name, info.file)
                const imageUrl = 'https://assets.aibcxw.com/' + result.name
                this.form.coverUrl = imageUrl
                this.loading = false
            } catch (e) {
                console.log(e)
            }
        },
        async ossUpload2(info) {
            try {
                this.loading2 = true
                const result = await this.client.put('user-content/ops/' + uuidv4() + '-' + info.file.name, info.file)
                const imageUrl = 'https://assets.aibcxw.com/' + result.name
                this.form.videoUrl = imageUrl
                this.loading2 = false
            } catch (e) {
                console.log(e)
            }
        },
        beforeUpload(file) {
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
            if (!isJpgOrPng) {
                this.$message.error('You can only upload JPG/PNG file!')
            }
            const isLt20M = file.size / 1024 / 1024 < 20
            if (!isLt20M) {
                this.$message.error('Image must smaller than 20MB!')
            }
            return isJpgOrPng && isLt20M
        },
        beforeUpload2(file) {
            const isVideoType = file.type === 'video/mp4' || file.type === 'video/webm' || file.type === 'video/ogg'
            if (!isVideoType) {
                this.$message.error('You can only upload mp4/webm/ogg file!')
            }

            return isVideoType
        },
        checkBig() {
            const url = this.form.coverUrl
            this.$info({
                title: '',
                width: '50%',
                maskClosable: true,
                content: (
                    <div>
                        <img src={url} style="width: 100%" />
                    </div>
                )
            })
        },
        filterOption(input, option) {
          console.log(11, input, option)
          return (
            option.componentOptions.children[0].text.indexOf(input) >= 0
          )
        }
    }
}
</script>
<style lang="less">
.avatar-uploader .ant-upload.ant-upload-select-picture-card {
    height: 100px;
}
.img {
    width: 100px;
}
.city_content_medium {
    line-height: normal;
}
.citylist_popup_main .city_content_top {
    line-height: normal;
    height: 41px !important;
}
</style>
