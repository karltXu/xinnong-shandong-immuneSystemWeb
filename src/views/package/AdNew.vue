<template>
  <page-header-wrapper :title="false">
    <a-card :bordered="false">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="广告类型" prop="adType">
          <a-radio-group name="radioGroup" v-model="form.adType">
            <a-radio value="Image">
              图片
            </a-radio>
            <a-radio value="Video">
              视频
            </a-radio>
          </a-radio-group>
        </a-form-model-item>

        <a-form-model-item label="上传广告图/视频" prop="resourceUrl">
          <a-upload-dragger name="file" :customRequest="ossUpload" :showUploadList="false">
            <p class="ant-upload-drag-icon">
              <a-icon type="inbox" />
            </p>
            <p class="ant-upload-text">
              点击或拖拽上传
            </p>
            <div v-if="form.resourceUrl">
              <img v-if="form.adType === 'Image'" :src="form.resourceUrl" />
              <video v-else :src="form.resourceUrl" controls="controls"></video>
            </div>
            <div v-else>
              <a-icon :type="loading ? 'loading' : 'plus'" />
            </div>
          </a-upload-dragger>
        </a-form-model-item>

        <a-form-model-item label="是否开启" prop="enabled">
          <a-switch checked-children="开" un-checked-children="关" v-model="form.enabled" />
        </a-form-model-item>

        <a-form-model-item :wrapper-col="{ span: 10, offset: 8 }">
          <a-button type="primary" @click="onSubmit" :loading="saveLoading">
            保存
          </a-button>
          <a-button style="margin-left: 10px;" @click="resetForm">
            重置
          </a-button>
        </a-form-model-item>
      </a-form-model>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { CreateAd } from '@/api/ad'
import { getStsConfig, clientConstrctor } from '@/api/oss'
import { v4 as uuidv4 } from 'uuid'
import { message } from 'ant-design-vue'

export default {
  name: 'AdNew',
  data() {
    return {
      labelCol: { span: 8 },
      wrapperCol: { span: 10 },
      loading: false,
      form: {
        adType: 'Image',
        enabled: true,
        resourceUrl: ''
      },
      rules: {
        resourceUrl: [{ required: true, message: '请上传资源', trigger: 'blur' }]
      },
      client: {},
      saveLoading: false,
      upUrl: ''
    }
  },
  created() {
    getStsConfig().then(res => {
      const { bucket, region, stsToken } = res.data
      this.client = clientConstrctor(bucket, region, stsToken)
    })
  },
  methods: {
    onSubmit() {
      this.saveLoading = true
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          //  新建
          CreateAd(this.form).then(res => {
            this.saveLoading = false
            if (res.code === 0) {
              this.$router.push({
                name: 'adManager'
              })
            }
          })
        } else {
          this.saveLoading = false
          message.warning('请先填写完整再提交哦！')
          return false
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
        const result = await this.client.put('user-content/apps/ads/' + uuidv4() + '-' + info.file.name, info.file)

        this.form.resourceUrl = 'https://assets.aibcxw.com/' + result.name
        this.loading = false
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>
<style lang="less" scoped>
img,
video {
  width: 300px;
}
</style>
