<template>
  <page-header-wrapper :title="false">
    <a-card :bordered="false">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="版本名称" prop="vername">
          <a-input v-model="form.vername" />
        </a-form-model-item>
        <a-form-model-item label="版本号" prop="vercode">
          <a-input-number v-model="form.vercode" :min="1" />
        </a-form-model-item>
        <a-form-model-item label="更新文案" prop="updateDesc">
          <a-input v-model="form.updateDesc" type="textarea" />
        </a-form-model-item>
        <a-form-model-item label="上传下载包" prop="downloadUrl">
          <a-upload-dragger
            name="file"
            :before-upload="beforeUpload"
            :customRequest="ossUpload"
            :showUploadList="false"
          >
            <p class="ant-upload-drag-icon">
              <a-icon type="inbox" />
            </p>
            <p class="ant-upload-text">
              点击或拖拽上传
            </p>
            <div v-if="form.downloadUrl">{{ apkName }}</div>
            <div v-else>
              <a-icon :type="loading ? 'loading' : 'plus'" />
            </div>
          </a-upload-dragger>
        </a-form-model-item>

        <a-form-model-item label="apk包的md5" prop="fileMD5">
          <a-input v-model="form.fileMD5" disabled />
        </a-form-model-item>
        <a-form-model-item label="是否开启" prop="enabled">
          <a-switch checked-children="开" un-checked-children="关" v-model="form.enabled" />
        </a-form-model-item>
        <a-form-model-item label="是否强制更新" prop="forceUpdate">
          <a-switch checked-children="是" un-checked-children="否" v-model="form.forceUpdate" />
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
import SparkMD5 from 'spark-md5'
import { CreateVersion } from '@/api/version'
import { getStsConfig, clientConstrctor } from '@/api/oss'
import { v4 as uuidv4 } from 'uuid'
import { message } from 'ant-design-vue'

export default {
  name: 'VersionNew',
  data() {
    return {
      labelCol: { span: 8 },
      wrapperCol: { span: 10 },
      loading: false,
      form: {
        vercode: 1,
        enabled: true,
        vername: '',
        downloadUrl: '',
        updateDesc: '',
        forceUpdate: true,
        fileMD5: ''
      },
      rules: {
        vercode: [{ required: true, message: '请输入版本号', trigger: 'blur' }],
        vername: [{ required: true, message: '请输入版本名称', trigger: 'blur' }],
        downloadUrl: [{ required: true, message: '请上传app包', trigger: ['change', 'blur'] }],
        fileMD5: [{ required: true, message: '请输入文件的md5值', trigger: ['change', 'blur'] }]
      },
      client: {},
      saveLoading: false,
      apkName: ''
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
          CreateVersion(this.form).then(res => {
            this.saveLoading = false
            if (res.code === 0) {
              this.$router.push({
                name: 'versionManager'
              })
            }
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
      const reader = new FileReader()
      reader.readAsBinaryString(info.file)
      const _this = this
      reader.onload = function() {
        _this.form.fileMD5 = SparkMD5.hashBinary(this.result)
      }
      try {
        this.loading = true
        const result = await this.client.put('user-content/apps/apks/' + uuidv4() + '-' + info.file.name, info.file)
        this.apkName = info.file.name
        const downloadUrl = 'https://assets.aibcxw.com/' + result.name
        this.form.downloadUrl = downloadUrl
        this.loading = false
      } catch (e) {
        console.log(e)
      }
    },

    beforeUpload(file) {
      console.log('file: ', file)
      const isAPK = file.type === 'application/vnd.android.package-archive'
      if (!isAPK) {
        this.$message.error('你只能上传 .apk 类型的文件哦!')
      }
      return isAPK
    }
  }
}
</script>
<style lang="less">
#map {
  width: 100%;
  height: 300px;
}
.avatar-uploader .ant-upload.ant-upload-select-picture-card {
  width: 50%;
}
.img {
  width: 100%;
}
</style>
