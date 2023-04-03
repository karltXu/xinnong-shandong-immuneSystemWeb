import { v4 as uuidv4 } from 'uuid'
import { getAgencyOptions } from '@/api/agency'
import Map from '@/components/MapContainer'

export default {
  data() {
    const phoneValidator = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入手机号'))
      } else if (!(/^1\d{10}$/.test(value))) {
        callback(new Error('手机号格式不正确'))
      } else {
        callback()
      }
    }
    return {
      rules: {
        name: [{ required: true, message: '请输入机构名字', trigger: 'blur' }],
        principal: [{ required: true, message: '请输入机构负责人/法人', trigger: 'blur' }],
        contact: [{ required: true, message: '请输入联系人姓名', trigger: 'blur' }],
        phone: [{ required: true, validator: phoneValidator, trigger: 'change' }],
        address: [{ required: true, message: '请输入机构营业地址', trigger: 'blur' }],
        personNumber: [{ required: true, message: '请输入团队人数', trigger: 'blur' }],
        workingAge: [{ required: true, message: '请输入工作年限', trigger: 'blur' }],
        goodAtAnimalIds: [{ required: true, message: '请输入擅长的服务动物种类', trigger: 'blur' }],
        longitude: [{ required: true, message: '请输入经度', trigger: 'change' }],
        latitude: [{ required: true, message: '请输入纬度', trigger: 'change' }]
        // testCategoryIds: [{ required: true, message: '请输入检测范围/检测项目', trigger: 'blur' }]
      },
      animalNameOptions: [],
      testCategoryOptions: []
    }
  },
  components: {
    Map
  },
  mounted() {

  },
  methods: {
    getOption() {
      getAgencyOptions().then(res => {
        const { animalNameOptions, testCategoryOptions } = res.data
        this.animalNameOptions = animalNameOptions
        this.testCategoryOptions = testCategoryOptions
      })
    },
    async ossUpload1(info) {
      try {
        this.loading1 = true
        const result = await this.client.put('user-content/ops/' + uuidv4() + '-' + info.file.name, info.file)
        const imageUrl = 'https://assets.aibcxw.com/' + result.name
        this.form.introImageUrls = imageUrl
        this.loading1 = false
      } catch (e) {
        console.log(e)
      }
    },
    async ossUpload2(info) {
      try {
        this.loading2 = true
        const result = await this.client.put('user-content/ops/' + uuidv4() + '-' + info.file.name, info.file)
        const imageUrl = 'https://assets.aibcxw.com/' + result.name
        this.form.licenseImageUrls = imageUrl
        this.loading2 = false
      } catch (e) {
        console.log(e)
      }
    },
    async ossUpload3(info) {
      try {
        this.loading3 = true
        const result = await this.client.put('user-content/ops/' + uuidv4() + '-' + info.file.name, info.file)
        const imageUrl = 'https://assets.aibcxw.com/' + result.name
        this.form.certImageUrls = imageUrl
        this.loading3 = false
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
      let url = ''
      switch (flag) {
        case 1:
          url = this.form.introImageUrls
          break
        case 2:
          url = this.form.licenseImageUrls
          break
        default:
          url = this.form.certImageUrls
          break
      }

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
    handleAddressChange(event) {
      setTimeout(() => {
        this.form.address = event.target.value
      }, 500)
    },
    saveMapData(name, lng, lat) {
      console.log('parent: ', name, lng, lat)
      // this.form.address = name
      this.form.longitude = lng
      this.form.latitude = lat
    },
    handleEdit(id, name) {
      this.$router.push({
        name: 'detectItemList',
        params: { id, name }
      })
    }
  }
}
