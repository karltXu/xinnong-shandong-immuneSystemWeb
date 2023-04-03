<template>
  <div>
    <div id="r-result" v-if="!hideSearch">
      <input
        type="text"
        id="tipinput"
        placeholder="搜索"
        class="ant-input"
      />
    </div>
    <div id="container"></div>
  </div>
</template>
<script>
const AMap = window.AMap
let marker = null

export default {
    // props: ['lng', 'lat', 'hideSearch'],
    props: {
      lng: {
        type: [String, Number],
        default: 120.383479
      },
      lat: {
        type: [String, Number],
        default: 36.067961
      },
      hideSearch: {
        type: Boolean,
        default: false
      }
    },
    data() {
        return {
            map: null
        }
    },
    mounted() {
        // DOM初始化完成进行地图初始化
        this.initMap()
    },
    // watch: {
    //   lng: function (val) {
    //       console.log(1)
    //       this.initMap()
    //   },
    //   lat: function (val) {
    //       console.log(2)
    //       this.initMap()
    //   }
    // },
    methods: {
        initMap() {
            const _this = this
            // 如果有经纬度，自动定位到此处
            const lng = this.lng ? Number(this.lng) : 120.383479
            const lat = this.lat ? Number(this.lat) : 36.067961
            // 地图加载
            var map = new AMap.Map('container', {
                resizeEnable: true,
                // 是否为3D地图模式
                viewMode: '3D',
                // 初始化地图级别
                zoom: 9,
                // 初始化地图中心点位置，青岛
                center: [lng, lat]
            })
            // 输入提示
            var autoOptions = {
                city: '青岛',
                input: 'tipinput'
            }

            AMap.plugin(['AMap.PlaceSearch', 'AMap.AutoComplete'], function () {
                var auto = new AMap.AutoComplete(autoOptions)
                // 构造地点查询类
                var placeSearch = new AMap.PlaceSearch({
                    map
                })
                // 注册监听，当选中某条记录时会触发
                auto.on('select', select)
                function select(e) {
                    placeSearch.setCity(e.poi.adcode)
                    // 关键字查询查询
                    placeSearch.search(e.poi.name)
                }
                // 给搜索出来的点，加点击事件
                AMap.Event.addListener(placeSearch, 'markerClick', (e) => {
                    console.log('marker click: ', e)
                    _this.$emit('mapdata', e.data.name, e.data.location.lng, e.data.location.lat)
                })
            })
            map.on('click', (ev) => {
                // 触发事件的地理坐标，AMap.LngLat 类型
                var lnglat = ev.lnglat
                const name = document.getElementById('tipinput').value
                _this.$emit('mapdata', name, lnglat.lng, lnglat.lat)
                marker && map.remove(marker)
                // 创建一个 Marker 实例：
                marker = new AMap.Marker({
                    position: new AMap.LngLat(lnglat.lng, lnglat.lat),
                    title: ''
                })

                // 将创建的点标记添加到已有的地图实例：
                map.add(marker)
            })
            setTimeout(() => {
              if (this.lng) {
                  // 创建一个 Marker 实例：
                  marker = new AMap.Marker({
                      position: new AMap.LngLat(+this.lng, +this.lat)
                  })

                  // 将创建的点标记添加到已有的地图实例：
                  map.add(marker)
                  map.setFitView([marker])
              }
            }, 1000)
        }
    }
}
</script>
<style lang="less" scoped>
#container {
    padding: 0px;
    margin: 0px;
    width: 100%;
    height: 500px;
}
</style>
