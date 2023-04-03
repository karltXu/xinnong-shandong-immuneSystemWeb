<template>
  <page-header-wrapper :title="false">
    <a-card :bordered="false">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="检测机构名称" prop="name">
          <a-input v-model="form.name" />
        </a-form-model-item>
        <a-form-model-item label="负责人/法人" prop="principal">
          <a-input v-model="form.principal" />
        </a-form-model-item>
        <a-form-model-item label="联系人姓名" prop="contact">
          <a-input v-model="form.contact" />
        </a-form-model-item>
        <a-form-model-item label="联系人电话" prop="phone">
          <a-input style="width: 80%;margin-right: 10px;" v-model="form.phone" />
          <a-tag color="cyan">
            <small> 用于登录账号</small>
          </a-tag>
        </a-form-model-item>
        <a-form-model-item label="宣传照" prop="introImageUrls">
          <a-upload
            name="intro"
            list-type="picture-card"
            class="avatar-uploader"
            :show-upload-list="false"
            :before-upload="beforeUpload"
            :customRequest="ossUpload1"
          >
            <img v-if="form.introImageUrls" :src="form.introImageUrls" alt="logo" class="img" />
            <div v-else>
              <a-icon :type="loading1 ? 'loading' : 'plus'" />
              <div class="ant-upload-text">
                上传
              </div>
            </div>
          </a-upload>
          <a @click="checkBig(1)">放大查看</a>
        </a-form-model-item>
        <a-form-model-item label="营业执照" prop="licenseImageUrls">
          <a-upload
            name="license"
            list-type="picture-card"
            class="avatar-uploader"
            :show-upload-list="false"
            :before-upload="beforeUpload"
            :customRequest="ossUpload2"
          >
            <img v-if="form.licenseImageUrls" :src="form.licenseImageUrls" alt="logo" class="img" />
            <div v-else>
              <a-icon :type="loading2 ? 'loading' : 'plus'" />
              <div class="ant-upload-text">
                上传
              </div>
            </div>
          </a-upload>
          <a @click="checkBig(2)">放大查看</a>
        </a-form-model-item>
        <a-form-model-item label="检验检测机构资质证书" prop="certImgUrls">
          <a-upload
            name="cert"
            list-type="picture-card"
            class="avatar-uploader"
            :show-upload-list="false"
            :before-upload="beforeUpload"
            :customRequest="ossUpload3"
          >
            <img v-if="form.certImageUrls" :src="form.certImageUrls" alt="logo" class="img" />
            <div v-else>
              <a-icon :type="loading3 ? 'loading' : 'plus'" />
              <div class="ant-upload-text">
                上传
              </div>
            </div>
          </a-upload>
          <a @click="checkBig(3)">放大查看</a>
        </a-form-model-item>
        <a-form-model-item label="团队人数" prop="personNumber">
          <a-input-number v-model="form.personNumber" :min="1" :max="100000" />
        </a-form-model-item>
        <a-form-model-item label="营业地址" prop="address">
          <a-input v-model="form.address" />
        </a-form-model-item>
        <a-form-model-item label="选择位置" prop="pos">
          <Map ref="map" @mapdata="saveMapData"></Map>
        </a-form-model-item>

        <a-form-model-item label="经度" prop="longitude">
          <a-input v-model="form.longitude" @change="addChange" />
        </a-form-model-item>
        <a-form-model-item label="纬度" prop="latitude">
          <a-input v-model="form.latitude" @change="addChange" />
        </a-form-model-item>

        <a-form-model-item label="执业年限" prop="workingAge">
          <a-input-number id="inputNumber" v-model="form.workingAge" :min="0" :max="100" />
        </a-form-model-item>

        <!-- <a-form-model-item label="检测范围/检测项目" prop="testCategoryIds">
          <a-select mode="multiple" style="width: 100%" v-model="form.testCategoryIds">
            <a-select-option v-for="item in testCategoryOptions" :key="item.id">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-model-item> -->
        <a-form-model-item label="送样信息以及注意事项" prop="description">
          <a-textarea :rows="5" :minRows="5" :maxRows="10" v-model="form.description" />
        </a-form-model-item>
        <a-form-model-item label="附件上传" >
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
import { v4 as uuidv4 } from 'uuid'
import { CreateAgency } from '@/api/agency'
import { getStsConfig, clientConstrctor } from '@/api/oss'
import { message } from 'ant-design-vue'
import mixin from './mixin'

export default {
  name: 'DetectNew',
  mixins: [mixin],
  data() {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      loading1: false,
      loading2: false,
      loading3: false,
      form: {
        address: '',
        latitude: '',
        longitude: '',
        name: '',
        phone: '',
        workingAge: 1,
        personNumber: 1
      },
      client: {},
      saveLoading: false,
      uploadFiles: [],
      fileList: []
    }
  },
  created() {
    getStsConfig().then(res => {
      const { bucket, region, stsToken } = res.data
      this.client = clientConstrctor(bucket, region, stsToken)
    })
    this.getOption()
  },
  mounted() {

  },
  methods: {
    onSubmit() {
      this.saveLoading = true
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          //  新建
          const param = {
            ...this.form,
            atype: 1,
            attachmentUrls: this.uploadFiles
          }

          CreateAgency(param).then(res => {
            if (res.code === 0) {
              message.success('新建解剖机构成功')
              this.$router.push({
                name: 'detectList'
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
      this.$refs.ruleForm.resetFields()
    },
    addChange() {
      if (this.form.latitude && this.form.longitude) {
        this.$refs.map.initMap()
      }
    },
    handleFileChange(info) {
      console.log(11, info)
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
.city_content_medium {
  line-height: normal;
}
.citylist_popup_main .city_content_top {
  line-height: normal;
  height: 41px !important;
}
.note {
  position: absolute;
  left: 180px;
  color: #c41d7f;
}
</style>
