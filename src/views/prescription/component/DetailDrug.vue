<template>
  <a-descriptions
    :title="detail.name"
    :column="1"
    bordered
  >
    <a-descriptions-item label="药品编号">
      {{ detail.id }}
    </a-descriptions-item>

    <a-descriptions-item label="药品通用名称">
      {{ detail.genericName }}
    </a-descriptions-item>

    <a-descriptions-item label="药品名称">
      {{ detail.name || '-' }}
    </a-descriptions-item>
    <!-- <a-descriptions-item label="外观图片">
      <img :src="detail.imageUrl" alt="img" srcset="" style="width: 100px;">
    </a-descriptions-item> -->
    <a-descriptions-item label="包装规格">
      {{ getPackage() }}
    </a-descriptions-item>
    <a-descriptions-item label="含量规格">
      {{ detail.contentSpecification || '-' }}
    </a-descriptions-item>
    <!-- <a-descriptions-item label="备注">
      {{ detail.remarks || '-' }}
    </a-descriptions-item> -->
    <a-descriptions-item label="生产企业">
      {{ detail.manufacture || '-' }}
    </a-descriptions-item>
  </a-descriptions>
</template>
<script>
import { getDrugDetail } from '@/api/drug'

export default {
  name: 'DrugDetail2',
  data() {
    return {
      detail: {
        id: '',
        name: '',
        genericName: '',
        imageUrl: '',
        manufacture: ''
      },
      fileList: [],
      uploadFiles: []
    }
  },
  props: {
    id: {
      type: Number,
      default: 0
    }
  },
  watch: {
    id(val) {
      this.init()
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      getDrugDetail(this.id).then(res => {
        this.detail = res.data.drug
      })
    },
    getPackage() {
      const item = this.detail
      if (!item.package1Name) {
        return '-'
      }
      let str = ''
      if (item.package2Number !== 0 && item.package3Number !== 0) {
        str = item.package2Number + item.package2Name + ' * ' + item.package3Number + item.package3Name + ' / ' + item.package1Name
      } else if (item.package2Number !== 0) {
        str = str = item.package2Number + item.package2Name + ' / ' + item.package1Name
      } else if (item.package3Number !== 0) {
        str = item.package3Number + item.package3Name + ' / ' + item.package1Name
      } else {
        str = item.package1Name
      }
      return str
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
</style>
