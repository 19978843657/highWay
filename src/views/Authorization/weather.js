import AMapLoader from '@amap/amap-jsapi-loader'

AMapLoader.load({
  key: '0c51b8a0df1215976f3e9c65add89c0a',
  version: '2.0',
  plugins: [],
  AMapUI: {
    version: '1.1',
    plugins: []
  },
  Loca: {
    version: '1.3.2'
  }
}).then(() => {
  // 高德地图SDK加载完成后的回调函数
})

AMap.plugin('AMap.Geolocation', function () {
  var geolocation = new AMap.Geolocation({
    enableHighAccuracy: true, // 是否使用高精度定位，默认：true
    timeout: 10000, // 超过10秒后停止定位，默认：5s
    buttonOffset: new AMap.Pixel(10, 20), // 定位按钮的偏移量，默认：Pixel(10, 20)
    zoomToAccuracy: true, // 定位成功后将定位结果以定位的方式显示在地图上，默认：false
    buttonPosition: 'RB'
  })

  geolocation.getCurrentPosition(function (status, result) {
    if (status == 'complete') {
      onComplete(result)
    } else {
      onError(result)
    }
  })

  function onComplete(data) {
    console.log('获取定位成功：', data)
    // 定位成功后，可以调用天气API获取天气信息
  }

  function onError(data) {
    console.log('获取定位失败：', data)
  }
})
