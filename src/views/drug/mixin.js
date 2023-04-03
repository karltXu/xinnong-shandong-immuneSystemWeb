import { v4 as uuidv4 } from 'uuid'
import { getStsConfig, clientConstrctor } from '@/api/oss'
import { getDrugOptions } from '@/api/drug'

export default {
  data() {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      form: {
        package1Number: 1,
        package2Number: 0,
        package3Number: 0,
        package2Name: 0,
        package3Name: 0
      },
      rules: {
        // name: [{ required: true, message: '请输入药品名称', trigger: 'blur' }],
        genericName: [{ required: true, message: '请输入药品通用名称', trigger: 'blur' }],
        // manufacture: [{ required: true, message: '请输入生产厂家', trigger: 'blur' }],
        package1Name: [{ required: true, message: '请输入包装规格', trigger: 'blur' }]
      },
      saveLoading: false,
      client: {},
      loading: false,
      package1Options: [],
      package2Options: [],
      package3Options: []
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
  methods: {
    getOption() {
      getDrugOptions().then(res => {
        const { package1Options, package2Options, package3Options } = res.data
        this.package1Options = package1Options
        this.package2Options = package2Options
        this.package3Options = package3Options
      })
    },
    async ossUpload(info) {
      try {
        this.loading = true
        const result = await this.client.put('user-content/ops/' + uuidv4() + '-' + info.file.name, info.file)
        const imageUrl = 'https://assets.aibcxw.com/' + result.name
        this.form.imageUrl = imageUrl
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
    checkBig() {
      const url = this.form.imageUrl
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
    }
  }
}
