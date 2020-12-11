const HTTP = 'http://localhost:8088/';
const WEB_SOCKET = 'ws://localhost:8088/websocket';
// 请求路径
// 公司动态
const DYNAMIC_URL = HTTP + 'api/dynamic/getDynamicListDisplay';
// 里程碑
const MILESTONE_URL = HTTP + 'api/milestone/getMilestoneListDisplay';
// 公司通知
const NOTIFY_URL = HTTP + 'api/notice/getNoticeListDisplay';
// 初始化出勤
const ARRIVE_URL = HTTP + 'api/record/intRecord';
// 初始化整体布局
const CONTATIN_URL = HTTP + 'api/screen/initScreen';
// 出差
const TREACEL_URL = HTTP + 'api/business/getTripDetailed';
// 刷新数据时间
const UPDATE_TIME = [6,9,12,15,18];
// iconList
const iconList = ['img/head2.png', 'img/head3.png'];
// 刷新次数
let updateNum = 1; 
// websocket重连次数
let reconnectNum = 1;

// 里程碑翻转样式
let milepostCSS = {
    border: '1px solidrgba(163, 203, 241, 0.329)',
    boxShadow: '0px 0px 7px 3px rgba(163, 203, 241, 0.329)',
    borderRadius: '5px 5px',
    color: '#ffffff',
    backgroundColor: 'transparent'
};
// 动态定时器
let dynamicInterTime = null;
// 通知定时器
let notifyInterTime = null;
// 里程碑
let milepostTime = null;
// 地图定时器
let mapIntervalTime = null;
// 出差定时器
let dutyInterval = null;
// 总定时器
let allTime = null;
// 公司里程碑循环时间
const MILEPOST_TIME = 5000;
// 公司里程碑文本循环时间
const MILEPOST_TEXT_TIME = 100;
// 地图循环显示速度
const MAP_INTO_TIME = 5000;
// 公司动态和公司通知循环时间;
const DY_TIME = 20000;
const NO_TIME = 40000;
// 公司里程碑第一部分
let firstMilepostList = [];
// 公司里程碑第二部分
let secondMilepostList = [];
// 出勤人员
let onDutyInfo = [];
// 里程碑第一步显示下标
let firstIndex = 0;
// 里程碑第二部分显示下标
let secondIndex = 1;
// 出差信息
let travelIndex = 0;
// 里程碑长度
let animateWidth = 0;
// 里程碑动画index
let animateIndex = 0;
// 里程碑数显
let animateLineIndex = 0;
// 出差index
let dutyIndex = 1;



function handleTimeType(timeString, type) {
    if (!timeString) {
        return timeString;
    }
    let date = new Date(timeString);
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    let d = date.getDate();
    d = d < 10 ? '0' + d : d;
    let h = date.getHours();
    h = h < 10 ? '0' + h : h;
    let minute = date.getMinutes();
    let second = date.getSeconds();
    minute = minute < 10 ? '0' + minute : minute;
    second = second < 10 ? ('0' + second) : second;
    if (type === '年/月/日') {
        return y + '年' + m + '月' + d + '日';
    } else if (type === 'y-m-d') {
        return y + '-' + m + '-' + d;
    } else if (type === 'date') {
        return y + '年' + m + '月' + d + '日 ' + h + ':' + minute;
    } else if (type === 'y-m') {
        return y + '-' + m;
    } else {
        return '';
    }
}

// 数组-> 对象
function arrayToObj(data) {
    let obj = {};
    if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
            obj[data[i]['year'] + '-' + data[i]['month']] = data[i];
        }
    }
    return obj;
}

// 随机数
function randomData() {
    return Math.round(Math.random() * 300);
}

function returnSrc() {
    return iconList[Math.round(Math.random() * 1)];
}


// 中间视频html
function returnVideoOrSubtitle(obj, type, isFullScreen) {
    if (isFullScreen) {
        if (type !== '0') {
            return `<video src="${obj.videoSrc}" style="object-fit: fill;border-radius: 5px 5px;" width="1900"
            height="950" autoplay="autoplay" muted loop="loop"></video>`;
        } else {
            return `<div id="lnn-sub" style="letter-spacing: ${obj.letterSpace}; color: ${obj.color};
            background-image: url(${obj.imgSrc});
            font-size: ${obj.fontSize};"><div class="lnn-sub-title">${obj.text}</div></div>`;
        }
    } else {
        if (type !== '0') {
            return `<video src="${obj.videoSrc}" style="object-fit: fill;border-radius: 5px 5px;" width="795"
            height="578" autoplay="autoplay" muted loop="loop"></video>`;
        } else {
            return `<div id="lnn-small-sub" style="letter-spacing: ${obj.letterSpace}; color: ${obj.color};
            background-image: url(${obj.imgSrc});
            font-size: ${obj.fontSize / 10};"><div class="lnn-small-sub-title">${obj.text}</div></div>`;
        }
    }
}

// 地图
let planePath = 'path://M.6,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705';

// 地图数据
let geoCoordMap = {
    // '上海': [123.4648, 31.2891],
    // '东莞': [113.8953, 22.901],
    // '东营': [118.7073, 37.5513],
    // '中山': [113.4229, 22.478],
    // '临汾': [111.4783, 36.1615],
    // '临沂': [118.3118, 35.2936],
    // '丹东': [124.541, 40.4242],
    // '丽水': [119.5642, 28.1854],
    // '新疆': [86.9236, 41.5883],
    // '佛山': [112.8955, 23.1097],
    // '保定': [115.0488, 39.0948],
    // '甘肃': [103.9901, 36.3043],
    // '北京': [116.4551, 40.4539],
    // '北海': [109.314, 21.6211],
    // '江苏': [121.2062, 32.9208],
    // '广西': [108.479, 22.1152],
    // '江西': [117.0046, 26.6633],
    // '南通': [121.1023, 32.1625],
    // '厦门': [118.1689, 24.6478],
    // '台州': [121.1353, 28.6688],
    // '安徽': [118.29, 32.0581],
    // '内蒙古': [111.4124, 41.4901],
    // '咸阳': [108.4131, 34.8706],
    // '黑龙江': [129.9688, 47.868],
    // '唐山': [118.4766, 39.6826],
    // '嘉兴': [120.9155, 30.6354],
    // '大同': [113.7854, 39.8035],
    // '天津': [117.4219, 39.4189],
    // '山西': [112.3352, 37.9413],
    // '威海': [121.9482, 37.1393],
    // '宁波': [121.5967, 29.6466],
    // '宝鸡': [107.1826, 34.3433],
    // '宿迁': [118.5535, 33.7775],
    // '江苏': [119.3000,31.5582],
    // '广东': [114.5107, 21.1196],
    // '廊坊': [116.521, 39.0509],
    // '延安': [109.1052, 36.4252],
    // '张家口': [115.1477, 40.8527],
    // '徐州': [117.5208, 34.3268],
    // '德州': [116.6858, 37.2107],
    // '惠州': [114.6204, 23.1647],
    // '四川': [103.9526, 30.7617],
    // '扬州': [119.4653, 32.8162],
    // '承德': [117.5757, 41.4075],
    // '西藏': [87.1865, 32.1465],
    // '无锡': [120.3442, 31.5527],
    // '日照': [119.2786, 35.5023],
    // '云南': [101.9199, 24.0663],
    // '浙江': [120.5313, 29.8773],
    // '枣庄': [117.323, 34.8926],
    // '柳州': [109.3799, 24.9774],
    // '株洲': [113.5327, 27.0319],
    // '湖北': [113.0896, 30.3628],
    // '汕头': [117.1692, 23.3405],
    // '江门': [112.6318, 22.1484],
    // '辽宁': [124.1238, 42.1216],
    // '沧州': [116.8286, 38.2104],
    // '河源': [114.917, 23.9722],
    // '泉州': [118.3228, 25.1147],
    // '泰安': [117.0264, 36.0516],
    // '泰州': [120.0586, 32.5525],
    '山东': [119.1582, 36.8701],
    // '济宁': [116.8286, 35.3375],
    // '海口': [110.3893, 19.8516],
    // '淄博': [118.0371, 36.6064],
    // '淮安': [118.927, 33.4039],
    '深圳': [114.5435, 22.5439],
    // '清远': [112.9175, 24.3292],
    // '温州': [120.498, 27.8119],
    // '渭南': [109.7864, 35.0299],
    // '湖州': [119.8608, 30.7782],
    // '湘潭': [112.5439, 27.7075],
    // '滨州': [117.8174, 37.4963],
    // '潍坊': [119.0918, 36.524],
    // '烟台': [120.7397, 37.5128],
    // '玉溪': [101.9312, 23.8898],
    // '珠海': [113.7305, 22.1155],
    // '盐城': [120.2234, 33.5577],
    // '盘锦': [121.9482, 41.0449],
    // '河北': [115.4995, 38.6006],
    // '福建': [122.0543, 25.5222],
    // '秦皇岛': [119.2126, 40.0232],
    // '绍兴': [120.564, 29.7565],
    // '聊城': [115.9167, 36.4032],
    // '肇庆': [112.1265, 23.5822],
    // '舟山': [122.2559, 30.2234],
    // '苏州': [120.6519, 31.3989],
    // '莱芜': [117.6526, 36.2714],
    // '菏泽': [115.6201, 35.2057],
    // '营口': [122.4316, 40.4297],
    // '葫芦岛': [120.1575, 40.578],
    // '衡水': [115.8838, 37.7161],
    // '衢州': [118.6853, 28.8666],
    // '青海': [99.4038, 36.8207],
    '陕西': [109.1162, 34.2004],
    // '贵州': [106.6992, 25.7682],
    // '连云港': [119.1248, 34.552],
    // '邢台': [114.8071, 37.2821],
    // '邯郸': [114.4775, 36.535],
    // '河南': [114.4668, 33.6234],
    // '鄂尔多斯': [108.9734, 39.2487],
    // '重庆': [108.7539, 28.5904],
    // '金华': [120.0037, 29.1028],
    // '铜川': [109.0393, 35.1947],
    // '宁夏': [106.3586, 38.1775],
    // '镇江': [119.4763, 31.9702],
    // '吉林': [127.8154, 45.2584],
    // '湖南': [112.8823, 27.2568],
    // '长治': [112.8625, 36.4746],
    // '阳泉': [113.4778, 38.0951],
    '青岛': [121.6651, 36.0373],
    // '韶关': [113.7964, 24.7028],
    // '海南': [109.8500, 17.2028],
    // '台湾': [123.2964, 22.3528],
    // '大连': [121.444, 39.033],
};

// 现有省份人数
let currentMapData = {
    '北京': {
        name: "北京",
        value: 0,
    },
    '上海': {
        name: "上海",
        value: 0
    },
    '天津': {
        name: "天津",
        value: 0
    },
    '重庆': {
        name: "重庆",
        value: 0
    },
    '广东': {
        name: "广东",
        value: 0
    },
    '广西': {
        name: "广西",
        value: 0
    },
    '湖南': {
        name: "湖南",
        value: 0
    },
    '湖北': {
        name: "湖北",
        value: 30
    },
    '河南': {
        name: "河南",
        value: 0
    },
    '河北': {
        name: "河北",
        value: 0
    },
    '山东': {
        name: "山东",
        value: 3
    },
    '山西': {
        name: "山西",
        value: 0
    },
    '黑龙江': {
        name: "黑龙江",
        value: 0
    },
    '吉林': {
        name: "吉林",
        value: 0
    },
    '辽宁': {
        name: "辽宁",
        value: 0
    },
    '内蒙古': {
        name: "内蒙古",
        value: 0
    },
    '新疆': {
        name: "新疆",
        value: 0
    },
    '西藏': {
        name: "西藏",
        value: 0
    },
    '宁夏': {
        name: "宁夏",
        value: 0
    },
    '甘肃': {
        name: "甘肃",
        value: 0
    },
    '云南': {
        name: "云南",
        value: 0
    },
    '陕西': {
        name: "陕西",
        value: 0
    },
    '青海': {
        name: "青海",
        value: 0
    },
    '贵州': {
        name: "贵州",
        value: 0
    },
    '福建': {
        name: "福建",
        value: 3
    },
    '江西': {
        name: "江西",
        value: 0
    },
    '四川': {
        name: "四川",
        value: 0
    },
    '江苏': {
        name: "江苏",
        value: 0
    },
    '安徽': {
        name: "安徽",
        value: 4
    },
    '浙江': {
        name: "浙江",
        value: 6
    },
    '海南': {
        name: "海南",
        value: 3
    },
    '台湾': {
        name: "台湾",
        value: 2
    },
    '南海诸岛': {
        name: "南海诸岛",
        value: 0
    }
}
// 地图迁移数据
let mapMigrate = {
    '山东': [
        {
            name: '山东',
            value: 100
        }
    ],
    '深圳': [
        {
            name: '深圳',
            value: 100
        }   
    ],
    '陕西': [
        {
            name: '陕西',
            value: 100
        }  
    ],
    '青岛': [
        {
            name: '青岛',
            value: 100
        },
        {
            name: '山东'
        }
    ],
    '青岛-深圳': [
        {
            name: '青岛',
            value: 100
        },
        {
            name: '深圳'
        }
    ],
    '青岛-陕西': [
        {
            name: '青岛',
            value: 100
        },
        {
            name: '陕西'
        }
    ]
}