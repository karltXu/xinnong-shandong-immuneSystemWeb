<template>
  <page-header-wrapper :title="false">
    <a-card :bordered="false">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="ID" prop="id">
          <a-input v-model="form.id" disabled />
        </a-form-model-item>
        <a-form-model-item label="版本名称" prop="vername">
          <a-input v-model="form.vername" disabled />
        </a-form-model-item>
        <a-form-model-item label="版本号" prop="vercode">
          <a-input-number v-model="form.vercode" :min="1" disabled />
        </a-form-model-item>
        <a-form-model-item label="更新文案" prop="updateDesc">
          <a-input v-model="form.updateDesc" type="textarea" />
        </a-form-model-item>
        <!-- <a-form-model-item label="下载包" prop="downloadUrl">
          <a :href="form.downloadUrl">点击下载</a>
        </a-form-model-item>

        <a-form-model-item label="apk包的md5" prop="fileMD5">
          <a-input v-model="form.fileMD5" disabled />
        </a-form-model-item> -->
        <a-form-model-item label="是否开启" prop="enabled">
          <a-switch checked-children="开" un-checked-children="关" v-model="form.enabled" />
        </a-form-model-item>
        <a-form-model-item label="是否强制更新" prop="forceUpdate">
          <a-switch checked-children="是" un-checked-children="否" v-model="form.forceUpdate" />
        </a-form-model-item>

        <a-form-model-item label="创建时间" prop="createdAt">
          <a-input v-model="form.createdAt" disabled />
        </a-form-model-item>

        <a-form-model-item label="创建时间" prop="createdAt">
          <a-input v-model="form.updatedAt" disabled />
        </a-form-model-item>

        <a-form-model-item :wrapper-col="{ span: 10, offset: 8 }">
          <a-button type="primary" @click="onSubmit" :loading="saveLoading">
            保存
          </a-button>
          <a-button style="margin-left: 10px;" @click="resetForm">
            返回
          </a-button>
        </a-form-model-item>
      </a-form-model>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { getVersionDetail, UpdateVersion } from '@/api/version'
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
        updateDesc: '',
        forceUpdate: true
        // downloadUrl: '',
        // fileMD5: ''
      },
      rules: {},
      client: {},
      saveLoading: false,
      apkName: ''
    }
  },
  created() {
    getVersionDetail(this.$route.params.id).then(res => {
      this.form = res.data.version
    })
  },
  methods: {
    onSubmit() {
      this.saveLoading = true
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          //  修改
          UpdateVersion(this.form).then(res => {
            this.saveLoading = false
            if (res.code === 0) {
              this.$router.push({
                name: 'versionManager'
              })
            }
          })
        } else {
          message.warning('请先填写完整再提交哦！')
          return false
        }
      })
    },
    resetForm() {
      this.$router.push({
        name: 'versionManager',
        params: {
          pageNumber: this.$route.params.pageNumber,
          pageSize: this.$route.params.pageSize
        }
      })
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
