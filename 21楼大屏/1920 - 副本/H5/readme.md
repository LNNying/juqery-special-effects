```单行
    white-space: nowrap; // 不换行
    overflow: hidden; // 隐藏
    text-overflow: ellipsis; // 显示省略号
```

```指定行
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 6
```

```文字渐变
    background: linear-gradient(to right, #caf5f8, #02b6ec);
    -webkit-background-clip: text;
    color: transparent;
```

出勤数据top偏移

应到 top：-25px

实到 top：-25px   top：12px

请假 top：58px    top：75px

出差 top：58px    top：75px

中间字体   小屏  20px - 60px  字数 19 * 11 = 209个  -13*4=52个   大屏 60px - 100px  字数  31 * 5 = 155个   - 3 * 9 = 27个


目前遗留问题

1. 图片路径不对
2. 里程碑图片必须两张
3. 代办事项提醒
4. 地图经纬度维护、地图数据返回残缺(为null)
5. websocket推送
