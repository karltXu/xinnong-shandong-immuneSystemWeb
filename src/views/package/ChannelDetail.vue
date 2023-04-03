<template>
  <page-header-wrapper :title="false">
    <a-card :bordered="false">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="ID" prop="id">
          <a-input v-model="form.id" disabled />
        </a-form-model-item>
        <a-form-model-item label="渠道名称" prop="channel">
          <a-input v-model="form.channel" disabled />
        </a-form-model-item>

        <a-form-model-item label="推广商户" prop="channel">
          <a-select v-model="promoterId" style="width: 100%" @change="handleChange">
            <a-select-option v-for="item in promoters" :value="item.id" :key="item.id">
              {{ item.nickname }}
            </a-select-option>
          </a-select>
        </a-form-model-item>

        <a-form-model-item label="渠道用途" prop="desc">
          <a-input v-model="form.desc" />
        </a-form-model-item>

        <!-- <a-form-model-item label="是否占用" prop="used">
          <a-switch v-model="form.used" />
        </a-form-model-item> -->

        <a-form-model-item label="推广链接" prop="pageUrl">
          <a :href="form.pageUrl" target="_blank">{{ form.pageUrl }} </a>
          <a-tooltip placement="top">
            <template slot="title">
              <span>复制此链接</span>
            </template>
            <a @click="copyUrl"><a-icon type="copy"/></a>
          </a-tooltip>
        </a-form-model-item>

        <a-form-model-item label="二维码">
          <canvas id="qrcode"></canvas>
        </a-form-model-item>

        <a-form-model-item label="图标logo颜色">
          <input type="color" name="color" id="color" v-model="form.appIconColor" />
        </a-form-model-item>

        <a-form-model-item label="宣传语">
          <a-textarea v-model="form.appSlogan" placeholder="请自己换行" :auto-size="{ minRows: 3 }" />
        </a-form-model-item>

        <a-form-model-item label="宣传语颜色">
          <input type="color" name="color" id="color" v-model="form.appSloganColor" />
        </a-form-model-item>

        <a-form-model-item label="宣传背景图">
          <div v-for="(item, index) in fileList" :key="index" class="div-img">
            <img :src="item" class="image" @click="handlePreview(item)" />
            <div class="delete2" @click="handleDelete(index)"><span>×</span></div>
          </div>
          <a-upload
            list-type="picture-card"
            :show-upload-list="false"
            :before-upload="beforeUpload"
            :customRequest="ossUpload"
            style="float: left"
          >
            <div v-if="fileList.length < 1">
              <a-icon type="plus" />
              <div class="ant-upload-text">
                上传
              </div>
            </div>
          </a-upload>
          <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
            <img alt="example" style="width: 100%" :src="previewImage" />
          </a-modal>
        </a-form-model-item>

        <a-form-model-item label="应用描述">
          <a-textarea v-model="form.appDesc" placeholder="请自己换行" :auto-size="{ minRows: 3 }" />
        </a-form-model-item>

        <a-form-model-item label="应用截图" prop="createdAt">
          <div v-for="(item, index) in fileList2" :key="index" class="div-img">
            <img :src="item" class="image" @click="handlePreview(item)" />
            <div class="delete2" @click="handleDelete2(index)"><span>×</span></div>
          </div>
          <a-upload
            list-type="picture-card"
            :show-upload-list="false"
            :before-upload="beforeUpload"
            :customRequest="ossUpload2"
            style="float: left"
          >
            <div v-if="fileList2.length < 20">
              <a-icon type="plus" />
              <div class="ant-upload-text">
                上传
              </div>
            </div>
          </a-upload>
        </a-form-model-item>

        <a-form-model-item label="创建时间" prop="createdAt">
          <a-input v-model="form.createdAt" disabled />
        </a-form-model-item>

        <a-form-model-item label="更新时间" prop="updatedAt">
          <a-input v-model="form.updatedAt" disabled />
        </a-form-model-item>

        <a-form-model-item :wrapper-col="{ span: 10, offset: 8 }">
          <a-button type="primary" @click="onSubmit" :loading="saveLoading">
            保存
          </a-button>
          <a-button style="margin-left: 10px;" @click="goBack">
            返回
          </a-button>
        </a-form-model-item>
      </a-form-model>
    </a-card>
  </page-header-wrapper>
</template>
<script>
import { getChannelDetail, UpdateChannel, getPromoterList } from '@/api/channel'
import { message } from 'ant-design-vue'
import { v4 as uuidv4 } from 'uuid'
import { getStsConfig, clientConstrctor } from '@/api/oss'
const QRCode = require('qrcode')

export default {
  name: 'VIPDetail',
  data() {
    return {
      labelCol: { span: 7 },
      wrapperCol: { span: 12 },
      loading: false,
      form: {
        promoter: {
          nickname: ''
        }
      },
      rules: {
        title: [{ required: true, message: '请输入套餐名称', trigger: 'blur' }]
      },
      saveLoading: false,
      promoters: [],
      promoterId: '',
      fileList: [],
      fileList2: [],
      client: {},
      previewVisible: false,
      previewImage: ''
    }
  },
  beforeMount() {
    getPromoterList().then(res => {
      this.promoters = res.data.promoters
    })
  },
  created() {
    getStsConfig().then(res => {
      const { bucket, region, stsToken } = res.data
      this.client = clientConstrctor(bucket, region, stsToken)
    })
  },
  mounted() {
    getChannelDetail(this.$route.params.id).then(res => {
      this.form = res.data.channel
      this.form.promoter = res.data.channel.promoter
      this.promoterId = res.data.channel.promoter.id
      this.form.used = this.form.used === 1
      this.fileList = res.data.channel.appBgImgUrl ? [res.data.channel.appBgImgUrl] : []
      this.fileList2 = res.data.channel.appScreenShots || []
      QRCode.toCanvas(document.getElementById('qrcode'), res.data.channel.pageUrl, function(error) {
        if (error) {
          console.error(error)
        }
      })
    })
  },
  methods: {
    goBack() {
      this.$router.push({
        name: 'channelManager',
        params: {
          pageNumber: this.$route.params.pageNumber,
          pageSize: this.$route.params.pageSize
        }
      })
    },
    onSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          // 更新
          this.saveLoading = true
          this.form.used = this.form.used ? 1 : 0
          this.form.promoterId = this.promoterId
          this.form.appBgImgUrl = this.fileList[0]
          this.form.appScreenShots = this.fileList2.join(',')
          UpdateChannel(this.form).then(res => {
            this.saveLoading = false
            if (res.code === 0) {
              message.success('修改成功')
              this.goBack()
            }
          })
        } else {
          message.warning('请先填写完整再提交哦！')
          return false
        }
      })
    },
    copyUrl() {
      const input = document.createElement('input')
      input.setAttribute('readonly', 'readonly') // 防止手机上弹出软键盘
      input.setAttribute('value', this.form.pageUrl)
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      message.success('复制成功')
    },
    handleChange(item) {
      console.log(22, item, this.promoterId)
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
    async ossUpload2(info) {
      try {
        const result = await this.client.put('user-content/ops/' + uuidv4() + '-' + info.file.name, info.file)
        const imageUrl = 'https://assets.aibcxw.com/' + result.name
        this.fileList2.push(imageUrl)
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
    },
    handleCancel() {
      this.previewVisible = false
    },
    handlePreview(url) {
      this.previewImage = url
      this.previewVisible = true
    },
    handleDelete(index) {
      this.fileList.splice(index, 1)
    },
    handleDelete2(index) {
      this.fileList2.splice(index, 1)
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
.delete2 {
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
    top: -14px;
    left: 3px;
  }
}
</style>
