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
          label="姓名"
          prop="name"
        >
          <a-input v-model="form.name" />
        </a-form-model-item>
        <a-form-model-item label="头像">
          <a-upload
            name="avatar"
            list-type="picture-card"
            class="avatar-uploader"
            :show-upload-list="false"
            :before-upload="beforeUpload"
            :customRequest="ossUpload"
          >
            <img
              v-if="form.iconUrl"
              :src="form.iconUrl"
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
          label="性别"
          prop="sex"
        >
          <a-radio-group v-model="form.sex">
            <a-radio v-for="item in sexOptions" :value="item" :key="item">
              {{ item }}
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item
          label="年龄"
          prop="age"
        >
          <a-input-number v-model="form.age" :min="1" :max="100" />
        </a-form-model-item>
        <a-form-model-item
          label="手机"
          prop="phone"
        >
          <a-input v-model="form.phone" />
        </a-form-model-item>
        <a-form-model-item
          label="毕业学校"
          prop="graduateAt"
        >
          <a-input v-model="form.graduateAt" style="width: 300px" />
        </a-form-model-item>
        <a-form-model-item
          label="学历"
          prop="qualifications"
        >
          <a-select style="width: 300px" v-model="form.qualifications">
            <a-select-option v-for="item in qualificationsOptions" :value="item" :key="item">
              {{ item }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item
          label="专业"
          prop="major"
        >
          <a-select
            show-search
            option-filter-prop="children"
            style="width: 300px"
            :filter-option="filterOption"
            v-model="form.major"
          >
            <a-select-option v-for="item in majorOptions" :value="item" :key="item">
              {{ item }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item
          label="职称/职务"
          prop="title"
        >
          <a-input v-model="form.title" style="width: 300px" />
          <!-- <a-select style="width: 300px" v-model="form.title">
            <a-select-option v-for="item in titleOptions" :value="item" :key="item">
              {{ item }}
            </a-select-option>
          </a-select> -->
        </a-form-model-item>
        <a-form-model-item
          label="从业年限"
          prop="workingAge"
        >
          <a-input-number v-model="form.workingAge" :min="1" :max="100" />
        </a-form-model-item>
        <a-form-model-item label="执业资格证书">
          <a-upload
            name="cert"
            list-type="picture-card"
            class="avatar-uploader"
            :show-upload-list="false"
            :before-upload="beforeUpload"
            :customRequest="ossUpload2"
          >
            <img
              v-if="form.certificateUrl"
              :src="form.certificateUrl"
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
          <a @click="checkBig(2)">放大查看</a>
        </a-form-model-item>
        <a-form-model-item
          label="工作单位"
          prop="workingAt"
        >
          <a-input v-model="form.workingAt" />
        </a-form-model-item>
        <a-form-model-item
          label="联系地址"
          prop="address"
        >
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

        <a-form-model-item
          label="擅长种类"
          prop="goodAtAnimalNames"
        >
          <a-select mode="multiple" style="width: 100%" v-model="form.goodAtAnimalNames">
            <a-select-option v-for="item in animalNameOptions" :key="item">
              {{ item }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item
          label="专业特长/学术成就"
          prop="achievements"
        >
          <a-textarea
            :auto-size="{ minRows: 2, maxRows: 10 }"
            v-model="form.achievements"
          />
        </a-form-model-item>
        <a-form-model-item
          label="工作经历"
          prop="careers"
        >
          <a-textarea
            :auto-size="{ minRows: 2, maxRows: 10 }"
            v-model="form.careers"
          />
        </a-form-model-item>

        <a-form-model-item
          label="展示状态"
          prop="blocked"
        >
          <a-radio-group v-model="form.blocked">
            <a-radio :value="0">
              正常
            </a-radio>
            <a-radio :value="1">
              禁用
            </a-radio>
          </a-radio-group>
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
import { CreateExpert, getExpertOptions } from '@/api/expert'
import { getStsConfig, clientConstrctor } from '@/api/oss'
import { message } from 'ant-design-vue'
import Map from '@/components/MapContainer'

export default {
    name: 'ExpertNew',
    data() {
       const phoneValidator = (rule, value, callback) => {
         if (!value) {
            callback(new Error('请输入专家手机号'))
         } else if (!(/^\d{11}$/.test(value))) {
            callback(new Error('手机号格式不正确'))
         } else {
            callback()
         }
       }
        return {
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
            loading: false,
            form: {
                sex: '男',
                blocked: 0,
                longitude: 0,
                latitude: 0
            },
            rules: {
                name: [{ required: true, message: '请输入专家名字', trigger: 'blur' }],
                age: [{ required: true, message: '请输入专家年龄', trigger: 'blur' }],
                graduateAt: [{ required: true, message: '请输入专家毕业学校', trigger: 'blur' }],
                address: [{ required: true, message: '请输入专家联系地址', trigger: 'blur' }],
                phone: [{ required: true, validator: phoneValidator, trigger: 'change' }],
                qualifications: [{ required: true, message: '请输入专家学历', trigger: 'blur' }],
                major: [{ required: true, message: '请输入专家专业', trigger: 'blur' }],
                title: [{ required: true, message: '请输入专家职称或职务', trigger: 'blur' }],
                workingAge: [{ required: true, message: '请输入专家工作年限', trigger: 'blur' }],
                workingAt: [{ required: true, message: '请输入专家工作单位', trigger: 'blur' }],
                goodAtAnimalNames: [{ required: true, message: '请输入专家擅长种类', trigger: 'blur' }],
                longitude: [{ required: true, message: '请输入经度', trigger: 'change' }],
                latitude: [{ required: true, message: '请输入纬度', trigger: 'change' }]
            },
            client: {},
            saveLoading: false,
            animalNameOptions: [],
            majorOptions: [],
            qualificationsOptions: [],
            sexOptions: [],
            titleOptions: []
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
    components: {
      Map
    },
    methods: {
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
        onSubmit() {
            this.saveLoading = true
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    //  新建
                    const param = {
                        ...this.form,
                        goodAtAnimalNames: this.form.goodAtAnimalNames.join(',')
                    }

                    CreateExpert(param).then((res) => {
                      console.log(11, res)
                        if (res.code === 0) {
                            message.success('新建专家成功')
                            this.$router.push({
                                name: 'expertsList'
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
                this.form.iconUrl = imageUrl
                this.loading = false
            } catch (e) {
                console.log(e)
            }
        },
        async ossUpload2(info) {
            try {
                this.loading = true
                const result = await this.client.put('user-content/ops/' + uuidv4() + '-' + info.file.name, info.file)
                const imageUrl = 'https://assets.aibcxw.com/' + result.name
                this.form.certificateUrl = imageUrl
                this.loading = false
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
        checkBig(flag) {
            const url = flag === 1 ? this.form.iconUrl : this.form.certificateUrl
            this.$info({
                title: '',
                width: '70%',
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
        },
        addChange() {
          if (this.form.latitude && this.form.longitude) {
            this.$refs.map.initMap()
          }
        },
        saveMapData(name, lng, lat) {
          console.log('parent: ', name, lng, lat)
          // this.form.address = name
          this.form.longitude = lng
          this.form.latitude = lat
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
