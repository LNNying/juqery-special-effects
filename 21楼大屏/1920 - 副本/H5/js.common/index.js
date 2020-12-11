/**
 * dom操作
 * 里程碑，动态，通知，出差  都是定时调接口 区间在6,9,12,15,18
 * 出勤和中间内容显示  先接口初始化数据显示 后期通过websocket推数据显示
 */
$(function () {
    // 代办
    $('.lnn-agency').hide();

    // 顶部时间
    function setDate() {
        $('#lnn-date-info').text(handleTimeType(new Date(), 'date'));
    }
    setDate();
    setInterval(setDate, 60 * 1000)

    //------------------------------以下是公司公司里程碑处理

    // 获取公司里程碑
    function getMilepost() {
        $.ajax({
            type: 'GET',
            contentType: "application/json",
            headers: {
                'token': 'token_value'
            },
            url: MILESTONE_URL,
            data: {},
            dataType: 'json',
            success: function (data) {
                if (data.length > 0) {
                    // data 替换 milepostDataList
                    handleMilepostFun(milepostDataList);
                } else {
                    console.log('获取里程碑数据为空');
                }
            },
            error: function (err) {
                console.log('获取里程碑数据 ----> 网络错误');
            }
        });
    }

    // 处理公司里程碑数据  数据按年月排序 6个
    function handleMilepostFun(dataList) {
        let html = '';
        if (dataList.length > 0) {
            animateWidth = dataList.length
            let dateInfo = dataList.concat(dataList.slice(1, 4));
            for (let i = 0; i < dateInfo.length; i++) {
                let left = i * 160;
                let src = i == 0 ? 'img/head1.png' : returnSrc(); 
                html += `<div class="lnn-icon-first" style="left: ${left}px;background-image: url(${src});">
                <div class="lnn-icon-time">${handleTimeType(dateInfo[i].milestoneDate, 'y-m')}</div>
            </div>`
            }
            $('#lnn-milepost').html(html);
            if (milepostTime) {
                clearInterval(milepostTime);
            }

            aminateMilepost(dateInfo);
            milepostTime = setInterval(() => {
                aminateMilepost(dateInfo);
            }, 10000)
        }
    }

    function aminateMilepost(dateInfo) {
        let childList = $('#lnn-milepost').children();
        if (childList.length > 0) {
            $('#lnn-milepost').css({
                "transform": `translateX(-${animateIndex * 160}px)`,
                // "font-weight": 'bold'
            })
            if (animateIndex == animateWidth) {
                $('#lnn-real-icon-line').css({
                    "transform": `translateX(${animateLineIndex * 160}px)`,
                    "font-weight": 'bold'
                })
                if (animateLineIndex == 2) {
                    animateLineIndex = 0;
                    animateIndex = 0;
                } else {
                    animateLineIndex += 1;
                }
            } else {
                animateIndex += 1;
                $('#lnn-real-icon-line').css({
                    "transform": `translateX(${0}px)`
                })
            }
            let index = 0;
            if (animateIndex == 0 && animateLineIndex == 0) {
                index = animateWidth + 2;
            } else {
                index = animateLineIndex + animateIndex - 1;
            }
            let dataInfo = dateInfo[index];
            fadeOutToIn('.lnn-content-title', dataInfo['milestoneTitle'])
            // $('.lnn-content-title').text(dataInfo['title'])
            if (!!dataInfo['milestoneImg']) {
                $('#lnn-content-desc').hide();
                $('.lnn-content-img').show();
                let imgSRCList = dataInfo['milestoneImg'].split(',');
                $('.lnn-content-img').html(`<img src="${imgSRCList[0]}"/>
                <img src="${imgSRCList[1]}"/>`);
            } else {
                $('#lnn-content-desc').show();
                $('.lnn-content-img').hide();
                fadeOutToIn('#lnn-content-desc', dataInfo['milestoneContent']);
                // $('#lnn-content-desc').text(dataInfo['desc'])
            }
        }
    }

    function fadeOutToIn(id, text) {
        $(id).fadeOut(300, () => {
            $(id).text(text);
        });
        $(id).fadeIn(MILEPOST_TEXT_TIME);
    }

    //------------------------------以下是公司动态处理

    // 公司动态轮播 8个
    function dynamicLunBo() {
        let dynamicChild = $('#lnn-dynamic').children();
        if (dynamicChild.length > 0) {
            $('#lnn-dynamic').animate({
                top: -776
            }, DY_TIME, 'linear', function () {
                $('#lnn-dynamic').css('top', 00)
            })
        }
    }
    // 公司动态替换数据  8条
    function dynamicData() {
        let html = '';
        $.ajax({
            type: 'GET',
            contentType: "application/json",
            headers: {
                'token': 'token_value'
            },
            url: DYNAMIC_URL,
            data: {},
            dataType: 'json',
            success: function (data) {
                if (data.length > 0) {
                    // 替换数据
                    // data 替换 dynamicDataList
                    let dataCopyList = data.slice(0, 4);
                    let dataList = data.concat(dataCopyList);
                    for (let i = 0; i < dataList.length; i++) {
                        html += `<div class="lnn-dynamic-item">
                        <div class="lnn-dynamic-img">
                            <img src="${dataList[i].dynamicImg}" alt="图片" />
                        </div>
                        <div class="lnn-dynamic-content">
                            <div class="lnn-content-desc">
                            ${dataList[i].dynamicDetailed}
                            </div>
                            <div class="lnn-content-time">${handleTimeType(dataList[i].dynamicDate, 'y-m-d')}</div>
                        </div>
                    </div>`;
                    }
                } else {
                    html = '';
                    console.log('获取公司动态数据为空');
                }
                $('#lnn-dynamic').html(html);
                dynamicLunBo();
                if (dynamicInterTime) {
                    clearInterval(dynamicInterTime);
                }
                dynamicInterTime = setInterval(dynamicLunBo, DY_TIME);
            },
            error: function (err) {
                console.log('获取公司动态数据失败 ----> 网络错误');
            }
        });
    }

    //------------------------------以下是公司通知处理

    // 公司通知轮播 就显示10个
    function notifyLunBo() {
        let notifyChild = $('#lnn-real-dynamic').children();
        if (notifyChild.length > 0) {
            $('#lnn-real-dynamic').animate({
                top: -1150
            }, NO_TIME, 'linear', function () {
                $('#lnn-real-dynamic').css('top', 0)
            })
        }
    }

    // 公司通知替换数据
    function notifyDataFun() {
        let html = '';
        $.ajax({
            type: 'Get',
            contentType: "application/json",
            headers: {
                'token': 'token_value'
            },
            url: NOTIFY_URL,
            data: {},
            dataType: 'json',
            success: function (data) {
                if (data.length > 0) {
                    // 替换数据
                    // data 替换 notifyDataList
                    let dataInfo = data.slice(0, 4)
                    let dataList = data.concat(dataInfo);
                    for (let i = 0; i < dataList.length; i++) {
                        html += `<div class="lnn-center-bottom-notify">
                        <div class="lnn-center-bottom-head">
                            <div class="lnn-center-head1">${dataList[i]['noticeTitle']}</div>
                            <div class="lnn-center-head2">${dataList[i]['depart']['departname']}</div>
                            <div class="lnn-center-head3">${handleTimeType(dataList[i]['createTime'], 'y-m-d')}</div>
                        </div>
                        <div class="lnn-center-bottom-notify-info">
                        ${dataList[i]['noticeDetailed']}
                        </div>
                        <div class="lnn-center-bottom-notify-horn"></div>
                    </div>`;
                    }
                } else {
                    html = '';
                    console.log('获取公司通知数据为空');
                }
                $('#lnn-real-dynamic').html(html);
                if (notifyInterTime) {
                    clearInterval(notifyInterTime);
                }
                notifyLunBo();
                notifyInterTime = setInterval(notifyLunBo, NO_TIME);
            },
            error: function (err) {
                console.log('获取公司动态失败 ----> 网络错误');
            }
        });
    }

    //------------------------------以下是当日出勤情况处理

    // 当日出勤情况
    function dayAttendance(obj) {
        let { arriveNum, onDutyNum, leaveNum, travelNum } = obj;
        if (Number(arriveNum) == Number(onDutyNum)) {
            $('#lnn-on-duty').css({
                "background-image": "url(img/duty-100.png)"
            })
            $('#lnn-on-duty-num').css({
                "top": "-25px"
            })
        } else {
            $('#lnn-on-duty').css({
                "background-image": "url(img/duty-76.png)"
            })
            $('#lnn-on-duty-num').css({
                "top": "12px"
            })
        }

        if (Number(leaveNum) == 0) {
            $('#lnn-leave').css({
                "background-image": "url(img/qingjia-0.png)"
            });
            $('#lnn-leave-num').css({
                "top": "75px"
            })
        } else {
            $('#lnn-leave').css({
                "background-image": "url(img/qingjia-1.png)"
            });
            $('#lnn-leave-num').css({
                "top": "58px"
            })
        }

        if (Number(travelNum) == 0) {
            $('#lnn-duty-travel').css({
                "background-image": "url(img/travel-0.png)"
            });
            $('#lnn-travel-num').css({
                "top": "75px"
            })
        } else {
            $('#lnn-duty-travel').css({
                "background-image": "url(img/travel-1.png)"
            });
            $('#lnn-travel-num').css({
                "top": "58px"
            })
        }

        $('#lnn-arrive-num').text(arriveNum);
        $('#lnn-on-duty-num').text(onDutyNum);
        $('#lnn-leave-num').text(leaveNum);
        $('#lnn-travel-num').text(travelNum);
    }

    function onDutyInfoFun(person) {
        // 如果是数组这说明是初始化  否则是websocket推送
        if (Array.isArray(person)) {
            onDutyInfo = person;
        } else {
            onDutyInfo.push(person);
        }
        let html = ''
        if (onDutyInfo.length > 0) {
            for (let i = 0; i < onDutyInfo.length; i++) {
                html += `<div class="lnn-person-icon">
                            <img src="${onDutyInfo[i].imgSrc}" data-name="${onDutyInfo[i]['realName']}"/>
                            <div class="lnn-person-icon-bottom"></div>
                        </div>`;
            }
        } else {
            html = `<div class="lnn-person-icon">
                    <div style="color: rgb(49, 123, 153);text-align: center;line-height: 55px;font-size: 40px;font-weight: bold;">+</div>
                    </div>`;
        }
        $('#lnn-real-person').html(html);
        // dyOnDutyFun();
        if (dutyInterval) {
            clearInterval(dutyInterval);
        }
        dutyInterval = setInterval(() => {
            dyOnDutyFun();
        }, 3000)
    }

    function dyOnDutyFun() {
        let childList = $('#lnn-real-person').children();
        if (childList.length > 0) {
            let num = Math.ceil(childList.length / 5);
            let surplusNum = num - 4;
            if (surplusNum > 0) {
                if (surplusNum >= dutyIndex) {
                    $('#lnn-real-person').css({
                        "transform": `translateY(-${dutyIndex * 75}px)`
                    })
                    dutyIndex += 1;
                } else {
                    dutyIndex = 1;
                    $('#lnn-real-person').css({
                        "transform": `translateY(0px)`
                    })
                }
            }
        }
    }

    // 初始化出勤数据
    function initOnDutyInfo() {
        $.ajax({
            type: 'POST',
            contentType: "application/json",
            headers: {
                'token': 'token_value'
            },
            url: ARRIVE_URL,
            data: {},
            dataType: 'json',
            success: function (data) {
                if (data.returnCode === 200) {
                    let dataInfo = JSON.parse(data.returnData);
                    let body = {
                        arriveNum: dataInfo[1].arriveNum ? dataInfo[1].arriveNum : 0,
                        onDutyNum: dataInfo[1].onDutyNum ? dataInfo[1].onDutyNum : 0,
                        leaveNum: dataInfo[1].leaveNum ? dataInfo[1].leaveNum : 0,
                        travelNum: dataInfo[1].travelNum ? dataInfo[1].travelNum : 0
                    }

                    onDutyInfoFun(dataInfo[0]);
                    dayAttendance(body);
                } else {
                    console.log('初始化出勤数据失败');
                }
            },
            error: function (err) {
                console.log('初始化出勤数据失败 ----> 网络错误');
            }
        });
        // onDutyInfoFun(personIcon);
        // dayAttendance({ arriveNum: 57, onDutyNum: 50, leaveNum: 4, travelNum: 3 });
    }

    //------------------------------以下是出差情况处理

    // 地图信息循环展示

    // 总方法
    function allTravelFun() {
        if (mapIntervalTime) {
            clearInterval(mapIntervalTime);
        }
        // 调接口
        $.ajax({
            type: 'GET',
            contentType: "application/json",
            headers: {
                'token': 'token_value'
            },
            url: TREACEL_URL,
            data: {},
            dataType: 'json',
            success: function (data) {
                if (data.returnCode === 200) {
                    if (data.returnData.length > 0) {
                        // 省份数量
                        let currentCityNum = {};
                        // 出差动态图
                        let mapMigrateObj = {};
                        let geoMap = {};
                        let dataNumInfo = data.returnData[0]['mapTravelNum'];
                        let mapDataInfo = data.returnData[0]['mapMigrate'];
                        let mapCoord = data.returnData[0]['cityLongLat'];

                        for (let i = 0; i < mapCoord.length; i++) {
                            let city = mapCoord[i]['cityName'];
                            let location = mapCoord[i]['longLat'];
                            if (location !== null) {
                                location.replaceAll(/\[(.+?)\]/g, function(rr, g) {
                                    let locations = g.split(',');
                                    geoMap[city] = [Number(locations[0]),Number(locations[1])]
                                })
                            }
                        }

                        for (let i = 0; i < dataNumInfo.length; i++) {
                            let item = {
                                name: dataNumInfo[i]['provinceName'],
                                value: dataNumInfo[i]['amount']
                            };
                            currentCityNum[dataNumInfo[i]['provinceName']] = item;
                        }

                        for (let i = 0; i < mapDataInfo.length; i++) {
                            let subCity = mapDataInfo[i]['toCity'].split('、');
                            for (let j = 0; j < subCity.length; j++) {
                                let itemList = [
                                    {
                                        name: mapDataInfo[i]['fromCity'],
                                        value: 100
                                    },
                                    {
                                        name: subCity[j]
                                    }
                                ];
                                mapMigrateObj[mapDataInfo[i]['fromCity'] + '-' + subCity[j]] = itemList;
                            }
                        }

                        geoMap['青岛'] = [121.6651, 36.0373];

                        for (let item in mapMigrateObj) {
                            let keys = item.split('-');
                            if (!(geoMap[keys[0]] && geoMap[keys[1]])) {
                                delete mapMigrateObj[item];
                                console.log('其中一个城市没有维护坐标 --->' + item);
                            } else {
                                mapMigrateObj[keys[1]] = [
                                    {
                                        name: keys[1],
                                        value: 100
                                    }
                                ]
                            }
                        }
                        // geoMap 替换 geoCoordMap
                        // currentCityNum 替换 currentMapData
                        // mapMigrateObj 替换 mapMigrate
                        travelMap(geoMap, currentCityNum, mapMigrateObj);

                        travelMapInfoFun(data.returnData[0]['travelInfo']);
                        mapIntervalTime = setInterval(() => {
                            travelMapInfoFun(data.returnData[0]['travelInfo']);
                        }, MAP_INTO_TIME);
                    } else {
                        console.log('获取出差信息为空');
                    }
                } else {
                    console.log('初始化出差信息失败');
                }
            },
            error: function (err) {
                console.log('初始化出勤数据失败 ----> 网络错误');
            }
        });
    }
    // 循环显示出差信息
    function travelMapInfoFun(travelInfo) {
        if (travelIndex > travelInfo.length - 1) {
            travelIndex = 0;
        }
        $('#lnn-travel').flip({
            direction: 'tb',
            content: `<div> <div class="lnn-travel-info-head">
            <img src="${travelInfo[travelIndex].photo}" alt="图片"/>
            <div class="lnn-travel-info-del">
            <div>姓名: <span>${travelInfo[travelIndex].user.realName}</span></div>
            <div>地区: <span>${travelInfo[travelIndex].businessPlace}</span></div>
            <div>归属项目: ${travelInfo[travelIndex].projectName}</div>
            </div>
            </div>
    </div>`,
            color: 'rgb(16, 2, 55)',
            onEnd: function (e) {
                $('#lnn-travel').css(milepostCSS);
            }
        });
        travelIndex += 1;
    }

    // 出差分布
    function travelMap(map, currentMapData, mapMigrate) {
        let myChart = echarts.init(document.getElementById('lnn-map'));
        let dataList = []
        let migrateList = []
        for (let item in currentMapData) {
            dataList.push(currentMapData[item]);
        }
        for (let item in mapMigrate) {
            migrateList.push(mapMigrate[item]);
        }
        // 地区出差人数数量
        var series = [{
            name: '出差分布',
            type: "map",
            map: "china",
            zoom: 1.152, // 地图中心放大
            // top: '30',
            zlevel: 1,
            left: 'center',
            align: 'right',
            label: {
                normal: {
                    show: false
                },
                emphasis: {
                    show: false
                },
            },
            itemStyle: {
                normal: {
                    borderColor: "#112b3b", //省市边界线
                    borderColor: "#a7e4e6", //省市边界线
                    shadowColor: 'rgba(166, 230, 236, 0.6)',
                    shadowOffsetX: 0,
                    shadowOffsetY: 0,
                    shadowBlur: 180
                },
                emphasis: {
                    areaColor: "#4aafde",
                    borderColor: "red"
                },
            },
            data: dataList
        }];
        // 动态路线
        migrateList.forEach(function (item, i) {
            if (item.length === 1) {
                series.push({
                    type: "effectScatter",
                    coordinateSystem: "geo",
                    zlevel: 2,
                    label: {
                        normal: {
                            // 默认情况下不显示省份
                            show: true,
                            position: "bottom", //显示位置
                            offset: [0, 0], //偏移设置
                            color: "rgb(58, 243, 166)",
                            formatter: "{b}", //圆环显示文字
                            fontWeight: "lighter",
                            fontSize: 10
                        },
                        emphasis: {
                            show: true
                        },
                    },
                    // 以下是省份图标
                    symbol: "circle",
                    symbolSize: function (val) {
                        return 2 //圆环大小
                    },
                    itemStyle: {
                        normal: {
                            color: "#f18647",
                            show: false,

                        },
                        emphasis: {
                            show: false,

                        }
                    },
                    data: [{
                        name: item[0].name,
                        value: map[item[0].name]
                    }]
                })
            } else {
                series.push({
                    name: '动态图',
                    type: "lines",
                    zlevel: 2,
                    animationDuration: function (idx) {
                        // 越往后的数据延迟越大
                        return idx * 400;
                    },
                    animationDelay: function (idx) {
                        // 越往后的数据延迟越大
                        return idx * 100;
                    },
                    effect: {
                        // 动态箭头
                        show: true,
                        color: "#7CE9FF",
                        period: 2, //箭头指向速度，值越小速度越快
                        trailLength: 0.5, //特效尾迹长度[0,1]值越大，尾迹越长重
                        symbol: "circle", //箭头图标
                        symbolSize: 5, //图标大小
                        loop: true, //是否循环
                        delay: function (idx) {
                            return Math.round(Math.random() * 3000);
                        }
                    },
                    lineStyle: {
                        normal: {
                            color: '#eee',
                            width: 0, //尾迹线条宽度
                            opacity: 0, //尾迹线条透明度
                            curveness: 0.4 //尾迹线条曲直度
                        }
                    },
                    data: [
                        [{
                            coord: map[item[0].name],
                            value: item[0].value
                        },
                        {
                            coord: map[item[1].name],
                            // value: item[0].value
                        }
                        ]
                    ]
                }, {
                    type: "effectScatter",
                    coordinateSystem: "geo",
                    name: item[0].name,
                    zlevel: 5,
                    rippleEffect: {
                        //涟漪特效
                        period: 4, //动画时间，值越小速度越快
                        brushType: "stroke", //波纹绘制方式 stroke, fill
                        scale: 5 //波纹圆环最大限制，值越大波纹越大
                    },
                    label: {
                        normal: {
                            show: true,
                            position: "bottom", //显示位置
                            offset: [0, 4], //偏移设置
                            fontWeight: "lighter", // lighter
                            fontSize: 12,
                            color: "rgb(58, 243, 166)",
                            formatter: "{b}" //圆环显示文字
                        },
                        emphasis: {
                            show: false
                        },
                    },
                    symbol: "circle",
                    symbolSize: function (val) {
                        return 6 + val[2] / 1000; //圆环大小
                    },
                    itemStyle: {
                        normal: {
                            color: "rgb(58, 243, 166)",
                            show: true,

                        },
                        emphasis: {
                            show: true,

                        }
                    },
                    data: [{
                        name: item[0].name,
                        value: map[item[0].name].concat([item[0].value])
                    }]
                });
            }

        });

        let option = {
            // backgroundColor: 'rgb(16,22,63)',

            visualMap: {
                //图例值控制
                show: false,
                type: 'piecewise',
                seriesIndex: 0,
                pieces: [ // 不指定 max，表示 max 为无限大（Infinity）。
                    {
                        min: 0,
                        max: 3,
                        color: 'rgb(29, 178, 255)'
                    },
                    {
                        min: 4,
                        max: 6,
                        color: 'rgb(16, 170, 180)'
                    },
                    {
                        min: 7,
                        max: 9,
                        color: 'rgb(29, 130, 255)'
                    },
                    {
                        min: 10,
                        color: 'rgb(237, 174, 93)'
                    }],

                showLabel: false,
                calculable: true,
            },
            geo: {
                map: "china",
                show: false,
                roam: false, //是否允许缩放
                layoutCenter: ["50%", "50%"], //地图位置
                layoutSize: "100%",
                itemStyle: {
                    normal: {
                        show: true,
                        color: "#0e2832", //地图背景色
                        borderWidth: 10,
                        borderColor: "#22e6c5", //省市边界线
                        shadowColor: 'rgba(166, 230, 236, 0.6)',
                        shadowOffsetX: 0,
                        shadowOffsetY: 0,
                        shadowBlur: 120
                    },
                    emphasis: {
                        show: true,
                        color: "rgba(255, 43, 61, .9)" //悬浮背景
                    }
                }
            },
            series: series
        };
        myChart.setOption(option);
    }

    /**
     * 10分钟调度一次
     * 接口总调度器
     */
    function mainWork() {
        allTime = setInterval(() => {
            let date = new Date();
            let hour = date.getHours();
            if (UPDATE_TIME.includes(hour)) {
                if (updateNum === 1) {
                    updateNum = 2;
                    // 里程碑
                    getMilepost();
                    // 动态
                    dynamicData();
                    // 通知
                    notifyDataFun();
                    // 当日出差
                    // 地图
                    allTravelFun();
                    console.log(hour);
                }
            } else {
                updateNum = 1;
            }
        }, 60 * 10 * 1000);
    }

    // websocket连接
    function setWebSocket() {
        if ('WebSocket' in window) {
            console.log('当前浏览器支持WebSocket');
            let socket = new WebSocket(WEB_SOCKET);
            // 判断连接状态
            switch (socket.readyState) {
                case WebSocket.CONNECTING:
                    console.log('正在连接');
                    break;
                case WebSocket.OPEN:
                    console.log('连接成功');
                    break;
                case WebSocket.CLOSING:
                    console.log('正在关闭');
                    break;
                case WebSocket.CLOSED:
                    console.log('连接关闭或连接失败');
                    break;
                default:
                    console.log('无法判断的状态');
                    break;
            }
            // 连接成功回调
            socket.onopen = function (e) {
                console.log('websocket连接成功');
            };
            // 接收信息
            socket.onmessage = function (e) {
                console.log('websocket消息 => ' + e.data);
                let message = JSON.parse(e.data);
                initBageScreen(message);
            };
            // 连接关闭回调
            socket.onclose = function (e) {
                if (reconnectNum > 10) {
                    setWebSocket();
                }
                console.log('连接被关闭' + reconnectNum);
                console.log(e);
                reconnectNum += 1;
            };
            // 连接失败回调
            socket.onerror = function (ev) {
                console.log('建立连接失败');
                console.log(ev);
            };
        } else {
            console.log('当前浏览器不支持WebSocket');
        }
    }

    // 大屏隐藏
    $('#lnn-detail-info').hide();
    $('#lnn-bage').hide();
    // 初始化数据显示
    function initGridData() {
        $.ajax({
            type: 'POST',
            contentType: "application/json",
            headers: {
                'token': 'token_value'
            },
            url: CONTATIN_URL,
            data: {},
            dataType: 'json',
            success: function (data) {
                if (data.returnCode === 200 && data.returnData !== null) {
                    let dataInfo = data.returnData;
                    initBageScreen({
                        isFullScreen: !dataInfo.isFullScreen,
                        type: dataInfo.screenType,
                        letterSpace: dataInfo.txtLetterSpace + 'px',
                        color: dataInfo.txtColour,
                        imgSrc: dataInfo.sourcePath,
                        fontSize: dataInfo.txtFontSize + 'px',
                        text: dataInfo.welcomeTxt,
                        videoSrc: dataInfo.sourcePath
                    });
                } else {
                    console.log('获取整体布局失败');
                }
            },
            error: function (err) {
                console.log('获取整体布局失败 ----> 网络错误');
            }
        });
    }

    function handleFullShow(isFullScreen, type) {
        if (isFullScreen) {
            $('#lnn-detail-info').hide();
            $('#lnn-bage').show();
            $('.lnn-left-back').hide();
            $('.lnn-right-back').hide();
        } else {
            $('#lnn-detail-info').show();
            $('#lnn-bage').hide();
            $('.lnn-left-back').show();
            $('.lnn-right-back').show();
            if (type === 'video') {
                $('#lnn-real-video').show();
                $('#lnn-small-sub-title').hide();
            } else {
                $('#lnn-small-sub-title').show();
                $('#lnn-real-video').hide();
            }
        }
    }

    /**
     * 
     * @param {*} data 
     * isFullScreen => 是否全屏
     * type => 是否全屏
     * letterSpace => 字间距
     * color => 字颜色
     * imgSrc => 图片路径
     * fontSize => 字体大小
     * text => 文本
     * videoSrc => 视屏路径
     */
    // 大屏初始化
    function initBageScreen(data) {
        let { isFullScreen, type, letterSpace, color, imgSrc, fontSize, text, videoSrc } = data;
        let option = {};
        if (type === '0') {
            option = {
                letterSpace: letterSpace,
                color: color,
                imgSrc: imgSrc,
                fontSize: fontSize,
                text: text
            }
        } else {
            option = {
                videoSrc: videoSrc
            }
        }
        handleFullShow(isFullScreen, type);
        // 全屏
        if (isFullScreen) {
            // 全屏清除所有定时器
            if (milepostTime) {
                clearInterval(firstMilepost);
            }
            if (mapIntervalTime) {
                clearInterval(mapIntervalTime);
            }
            if (dynamicInterTime) {
                clearInterval(dynamicInterTime)
            }
            if (notifyInterTime) {
                clearInterval(notifyInterTime)
            }
            if (dutyInterval) {
                clearInterval(dutyInterval);
            }
            if (allTime) {
                clearInterval(allTime);
            }
            $('#lnn-bage').html(returnVideoOrSubtitle(option, type, isFullScreen));

        } else {
            $('#lnn-video').html(returnVideoOrSubtitle(option, type, isFullScreen));
            // 所有方法调用 以下所有方法都是在小屏下调用 默认小屏  得有个初始化接口
            // 1. 里程碑
            getMilepost();
            // 2. 动态
            dynamicData();
            // 3. 通知
            notifyDataFun();
            // 4. 初始化出勤
            initOnDutyInfo();
            // 5. 出差
            allTravelFun();
            // 总调度系统
            mainWork();
        }
    }
    initGridData();
    setWebSocket();

})