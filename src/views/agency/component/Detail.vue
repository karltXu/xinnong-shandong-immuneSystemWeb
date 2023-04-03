<template>
  <a-card :bordered="false">
    <a-descriptions
      title=""
      :column="1"
      bordered
      size="small"
    >
      <a-descriptions-item label="动物">
        {{ detail.animal.animalName }}
      </a-descriptions-item>
      <a-descriptions-item label="标准库检测项目">
        {{ detail.examination.name }}
      </a-descriptions-item>
      <a-descriptions-item label="机构检测项目">
        {{ detail.name }}
      </a-descriptions-item>
      <!-- <a-descriptions-item label="检测类型">
        {{ detail.itemName }}
      </a-descriptions-item> -->
      <a-descriptions-item label="检测方法">
        {{ detail.method }}
      </a-descriptions-item>
      <a-descriptions-item label="单价">
        {{ detail.name }}
      </a-descriptions-item>

      <a-descriptions-item label="采样说明">
        {{ detail.introduction }}
      </a-descriptions-item>
      <a-descriptions-item label="备注">
        {{ detail.remarks }}
      </a-descriptions-item>
    </a-descriptions>
  </a-card>
</template>
<script>
export default {
  name: 'Detail',
  props: {
    detail: {
      type: Object,
      default: () => {
        return {
          animal: {
            animalName: ''
          },
          examination: {
            name: ''
          }
        }
      }
    }
  },
  data() {
    return {

    }
  },
  mounted() {

  },
  methods: {

  }
}
</script>
<style lang="less" scoped>
/deep/.ant-card-body {
  padding: 10px 0;
}
/deep/.ant-descriptions-item-label {
  width: 90px;
}
</style>
