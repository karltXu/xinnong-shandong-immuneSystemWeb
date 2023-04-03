const nameTitle = '新用户诊断统计'
const subname = '鼠标滚动，可放大缩小'
const nameColor = 'rgb(55, 75, 113)'
const nameFontFamily = '等线'
const subnameFontSize = 15
const nameFontSize = 18
const mapName = 'china'

var geoCoordMap = {}

// /*获取地图数据*/
// myChart.showLoading()
const mapFeatures = window.echarts.getMap(mapName).geoJson.features

// myChart.hideLoading()
mapFeatures.forEach(function(v) {
  // 地区名称
  const name = v.properties.name
  // 地区经纬度
  geoCoordMap[name] = v.properties.cp
})

const max = 480
const min = 9
const maxSize4Pin = 100
const minSize4Pin = 20

var convertData = function(data) {
  var res = []
  for (let i = 0; i < data.length; i++) {
    var geoCoord = geoCoordMap[data[i].name]
    if (geoCoord) {
      res.push({
        name: data[i].name,
        value: geoCoord.concat(data[i].value)
      })
    }
  }
  return res
}

export const option = (data, toolTipData) => {
  return {
    title: {
      text: nameTitle,
      subtext: subname,
      x: 'center',
      textStyle: {
        color: nameColor,
        fontFamily: nameFontFamily,
        fontSize: nameFontSize
      },
      subtextStyle: {
        fontSize: subnameFontSize,
        fontFamily: nameFontFamily
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: function(params) {
        if (typeof params.value[2] === 'undefined') {
          let toolTiphtml = ''
          for (let i = 0; i < toolTipData.length; i++) {
            if (params.name === toolTipData[i].name) {
              toolTiphtml += toolTipData[i].name + ':<br>'
              for (let j = 0; j < toolTipData[i].value.length; j++) {
                toolTiphtml += toolTipData[i].value[j].name + ':' + toolTipData[i].value[j].value + '<br>'
              }
            }
          }
          // console.log(convertData(data))
          return toolTiphtml
        } else {
          let toolTiphtml = ''
          for (let i = 0; i < toolTipData.length; i++) {
            if (params.name === toolTipData[i].name) {
              toolTiphtml += toolTipData[i].name + ':<br>'
              for (let j = 0; j < toolTipData[i].value.length; j++) {
                toolTiphtml += toolTipData[i].value[j].name + ':' + toolTipData[i].value[j].value + '<br>'
              }
            }
          }
          return toolTiphtml
        }
      }
    },
    // legend: {
    //     orient: 'vertical',
    //     y: 'bottom',
    //     x: 'right',
    //     data: ['credit_pm2.5'],
    //     textStyle: {
    //         color: '#fff'
    //     }
    // },
    visualMap: {
      show: true,
      min: 0,
      max: 200,
      left: 'left',
      top: 'bottom',
      text: ['高', '低'], // 文本，默认为数值文本
      calculable: true
    },
    /* 工具按钮组 */
    toolbox: {
      show: true,
      orient: 'vertical',
      left: 'right',
      top: 'center',
      feature: {
        dataView: {
          readOnly: false
        },
        restore: {},
        saveAsImage: {}
      }
    },
    series: [
      {
        name: '散点',
        type: 'scatter',
        coordinateSystem: 'geo',
        data: convertData(data),
        symbolSize: function(val) {
          return val[2] / 10
        },
        label: {
          normal: {
            formatter: '{b}',
            position: 'right',
            show: true
          },
          emphasis: {
            show: true
          }
        },
        itemStyle: {
          normal: {
            color: '#05C3F9'
          }
        }
      },
      {
        type: 'map',
        map: mapName,
        geoIndex: 0,
        aspectScale: 0.75,
        // 长宽比
        showLegendSymbol: false,
        // 存在legend时显示
        label: {
          normal: {
            show: true
          },
          emphasis: {
            show: false,
            textStyle: {
              color: '#fff'
            }
          }
        },
        roam: true,
        itemStyle: {
          normal: {
            areaColor: '#031525',
            borderColor: '#3B5077'
          },
          emphasis: {
            areaColor: '#2B91B7'
          }
        },
        animation: false,
        data: data
      },
      {
        name: '点',
        type: 'scatter',
        coordinateSystem: 'geo',
        symbol: 'pin',
        // 气泡
        symbolSize: function(val) {
          var a = (maxSize4Pin - minSize4Pin) / (max - min)
          var b = minSize4Pin - a * min
          b = maxSize4Pin - a * max
          return a * val[2] + b
        },
        label: {
          normal: {
            show: true,
            textStyle: {
              color: '#fff',
              fontSize: 9
            }
          }
        },
        itemStyle: {
          normal: {
            color: '#F62157'
            // 标志颜色
          }
        },
        zlevel: 6,
        data: convertData(data)
      },
      {
        name: 'Top 5',
        type: 'effectScatter',
        coordinateSystem: 'geo',
        data: convertData(
          data
            .sort(function(a, b) {
              return b.value - a.value
            })
            .slice(0, 5)
        ),
        symbolSize: function(val) {
          return val[2] / 10
        },
        showEffectOn: 'render',
        rippleEffect: {
          brushType: 'stroke'
        },
        hoverAnimation: true,
        label: {
          normal: {
            formatter: '{b}',
            position: 'right',
            show: true
          }
        },
        itemStyle: {
          normal: {
            color: 'yellow',
            shadowBlur: 10,
            shadowColor: 'yellow'
          }
        },
        zlevel: 1
      }
    ]
  }
}
