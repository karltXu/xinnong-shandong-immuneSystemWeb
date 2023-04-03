<template>
  <div :style="{ padding: '0 0 32px 32px' }">
    <h4 :style="{ marginBottom: '20px' }">{{ title }}</h4>
    <v-chart :forceFit="true" :height="height" :data="data" :scale="scale">
      <v-tooltip />
      <v-axis />
      <v-line position="key*value" />
      <v-point position="key*value" shape="circle" />
    </v-chart>
  </div>
</template>

<script>
export default {
  name: 'MyLine',
  props: {
    title: {
      type: String,
      default: ''
    },
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
    scale: {
      type: Array,
      default: () => {
        return [
          {
            dataKey: 'value',
            min: 0
          },
          {
            dataKey: 'key',
            min: 0,
            max: 1
          }
        ]
      }
    },
    tooltip: {
      type: Array,
      default: () => {
        return [
          'key*value',
          (x, y) => ({
            name: x,
            y: y
          })
        ]
      }
    }
  },
  data() {
    return {
      height: 400
    }
  }
}
</script>
