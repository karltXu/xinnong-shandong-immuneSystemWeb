import { v4 as uuidv4 } from 'uuid'
import moment from 'moment'
import { getStsConfig, clientConstrctor } from '@/api/oss'
import { getDrugList } from '@/api/drug'
import { getBusinessDetail } from '@/api/business'
import Map from '@/components/MapContainer'
import TEditor from '@/components/Editor/TinyMceEditor'

export default {
  data() {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      loading: false,
      form: {
        createdAt: null,
        updatedAt: null,
        drugIds: [],
        category: 'COMMON',
        longitude: 0,
        latitude: 0,
        detail: ''
      },
      rules: {
        name: [{ required: true, message: '请输入商家名字', trigger: 'blur' }],
        address: [{ required: true, message: '请输入商家地址', trigger: 'blur' }],
        description: [{ required: true, message: '请输入商家简介', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入商家电话', trigger: 'blur' }]
      },
      client: {},
      saveLoading: false,
      dateFormat: 'YYYY-MM-DD HH:mm:ss',
      content: '',
      data: [],
      value: [],
      fetching: false,
      editor: null
    }
  },
  components: {
    Map,
    TEditor
  },
  created() {
    // 获取oss参数
    getStsConfig().then(res => {
      const { bucket, region, stsToken } = res.data
      this.client = clientConstrctor(bucket, region, stsToken)
    })
  },
  mounted() {
    if (this.$route.params.id) {
      getBusinessDetail(this.$route.params.id).then(res => {
        this.form = res.data.merchant
        this.form.createdAt = moment(res.data.merchant.createdAt, this.dateFormat)
        this.form.updatedAt = moment(res.data.merchant.updatedAt, this.dateFormat)
        this.content = res.data.merchant.detail

        this.value = res.data.merchant.drugs.map(item => {
          return {
            key: item.id,
            label: item.name
          }
        })
      })
    }
  },
  methods: {
    async ossUpload(info) {
      try {
        this.loading = true
        const result = await this.client.put('user-content/ops/' + uuidv4() + '-' + info.file.name, info.file)
        const imageUrl = 'https://assets.aibcxw.com/' + result.name
        this.form.imageURL = imageUrl
        this.loading = false
      } catch (e) {
        console.log(e)
      }
    },
    beforeUpload(file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJpgOrPng) {
        this.$message.error('You can only upload JPG file!')
      }
      const isLt2M = file.size / 1024 / 1024 < 20
      if (!isLt2M) {
        this.$message.error('Image must smaller than 20MB!')
      }
      return isJpgOrPng && isLt2M
    },
    checkBig() {
      const url = this.form.imageURL
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
    addChange() {
      if (this.form.latitude && this.form.longitude) {
        // 在地图上标注
      }
    },
    fetchDrug(value) {
      console.log('fetching drug', value)

      this.data = []
      this.fetching = true

      getDrugList({ name: value }).then(res => {
        this.data = res.data.drugs
        this.fetching = false
      })
    },
    handleSelectChange(value) {
      console.log('select: ', value)
      Object.assign(this, {
        value,
        data: [],
        fetching: false
      })
    },
    saveMapData(name, lng, lat) {
      console.log('parent: ', name, lng, lat)
      // this.form.address = name
      this.form.longitude = lng
      this.form.latitude = lat
    }
  }
}
