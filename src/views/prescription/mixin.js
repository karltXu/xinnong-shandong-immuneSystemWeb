import { getPrescriptionOptions } from '@/api/prescription'
import { getDrugList, getDrugOptions } from '@/api/drug'
import { message } from 'ant-design-vue'

export default {
  data() {
    return {
      labelCol: { span: 2 },
      wrapperCol: { span: 22 },
      form: {
        name: '',
        remarks: ''
      },
      rules: {
        name: [{ required: true, message: '请输入处方名称', trigger: 'blur' }],
        selectedDrugList1: [{ required: true, message: '至少添加一个药品', trigger: 'blur' }]
      },
      usageFrequencyOptions: [],
      usageMethodOptions: [],
      selectedDrugList: [1],
      drugValue: [],
      drugData: [],
      searching: [true],
      visible: false,
      id: 0,
      packageOptions: [],
      package2Options: []
    }
  },
  created() {
    this.getOption()
  },
  methods: {
    getOption() {
      getDrugOptions().then(res => {
        const { packageOptions, package2Options } = res.data
          this.packageOptions = packageOptions
          this.package2Options = package2Options
      })
      getPrescriptionOptions().then(res => {
        const { usageFrequencyOptions, usageMethodOptions } = res.data
        this.usageFrequencyOptions = usageFrequencyOptions
        this.usageMethodOptions = usageMethodOptions
      })
    },
    handleAddDrug() {
      this.selectedDrugList.push({})
    },
    handleDrugDetail(id) {
      console.log('id: ', id)
      if (id) {
        this.id = id
        this.visible = true
      } else {
        message.warning('请先选择药品哦～')
      }
    },
    handleDeleteDrug(index) {
      this.selectedDrugList.splice(index, 1)
    },
    handleSearch(value, index) {
      this.searching[index] = true
      const queryParam = {
        pageNumber: 1,
        pageSize: 20,
        name: value
      }
      getDrugList(queryParam).then(res => {
        this.drugData = res.data.drugs
      })
    },
    handleChange(value, index) {
      this.searching[index] = false
      const i = this.drugData.findIndex(item => item.id === value)
      const name = this.drugData[i].name
      this.drugValue[index] = name
      this.selectedDrugList[index] = this.drugData[i]
      const queryParam = {
        pageNumber: 1,
        pageSize: 20,
        name
      }
      getDrugList(queryParam).then(res => {
        this.drugData = res.data.drugs
        // this.selectedDrugList[index] = res.data.drugs[i] || res.data.drugs[0]
      })
    },
    getSingleMount(index) {
      const data = this.selectedDrugList[index]
      if (data.package3Number !== 0) {
        return data.package3Name
      } else {
        return data.package2Name
      }
    },
    getAllMount(index) {
      const data = this.selectedDrugList[index]
      return data.package1Name
    },
    getContent(index) {
      const data = this.selectedDrugList[index]
      return data.contentSpecification || '-'
    },
    getPack(index) {
      const item = this.selectedDrugList[index]
      if (!item.id) {
        return '-'
      }
      if (!item.package1Name) {
        return '-'
      }
      let str = ''
      if (item.package2Number !== 0 && item.package3Number !== 0) {
        str = item.package2Number + item.package2Name + ' * ' + item.package3Number + item.package3Name + ' / ' + item.package1Name
      } else if (item.package2Number !== 0) {
        str = str = item.package2Number + item.package2Name + ' / ' + item.package1Name
      } else {
        str = item.package3Number + item.package3Name + ' / ' + item.package1Name
      }
      return str
    },
    handleOk() {
      this.visible = false
    }
  }
}
