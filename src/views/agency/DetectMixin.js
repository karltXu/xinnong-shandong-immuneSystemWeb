import { getAnimalOptions } from '@/api/diagnose'
import { getExaminationList, getAgencyExamOptions } from '@/api/agency'

export default {
  data() {
    return {
      rules: {
        examinationId: [{ required: true, message: '请选择标准库检测项目', trigger: 'blur' }],
        name: [{ required: true, message: '请输入机构检测项目', trigger: 'blur' }],
        itemName: [{ required: true, message: '请输入检测类型', trigger: 'blur' }],
        method: [{ required: true, message: '请输入检测方法', trigger: 'change' }],
        cost: [{ required: true, message: '请输入单价', trigger: 'blur' }]
      },
      animalOptions: [],
      examOptions: [],
      examinationOptions: []
    }
  },
  mounted() {
    getAnimalOptions().then(res => {
      this.animalOptions = res.data.animals
    })

    getAgencyExamOptions().then(res => {
      this.examOptions = res.data.methodOptions
    })
  },
  methods: {
    getExaminationByAnimal(id) {
      console.log(11, id)
      getExaminationList({
        animalId: id,
        pageSize: 1000
      }).then(res => {
        this.examinationOptions = res.data.examinations
      })
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    }
  }
}
