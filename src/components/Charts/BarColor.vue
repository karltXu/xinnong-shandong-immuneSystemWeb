<template>
  <div :style="{ padding: '0 0 32px 32px' }">
    <h4 :style="{ marginBottom: '20px' }">{{ title }}</h4>
    <v-chart height="300" :data="data" :forceFit="true" :padding="['auto', 'auto', '40', '50']" :scale="scale">
      <v-tooltip />
      <v-axis />
      <v-legend></v-legend>
      <v-bar position="key*value" color="value" />
    </v-chart>
  </div>
</template>

<script>
export default {
  name: 'BarColor',
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
            dataKey: 'key'
          },
          {
            dataKey: 'value',
            alias: '时间'
          }
        ]
      }
    },
    tooltip: {
      type: Array,
      default: () => {
        return [
          'x*y',
          (x, y) => ({
            name: x,
            value: y
          })
        ]
      }
    }
  },
  data() {
    return {}
  }
}
</script>
