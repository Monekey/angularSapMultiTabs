/**
 * 公共数据。公共变量
 * @version  v1.0
 * @createAuthor LSZ
 * @updateHistory
 *       2016/3/9 LSZ  create
 */
define(function (require) {
    var public = require("publicService");

    public.constant('appConstant', {
        systemCode:{
            pos:10003,
            home:10001
        },
        posFun:[
            {
                code:10051,
                bgColor:"#ff0000"
            }
        ],
        //默认翻页设置
        pageSet: {
            currentPage: 1,//当前页码
            maxSize: 10,  //显示多少页
            numPerPage: 10//每页显示数量
        },
        //省市区域设置
        division:[
            {
                "id"       : "10",
                "name"     : "北京市",
                "pinyin"   : "B",
                "areas" : "华北"
            },
            {
                "id"       : "11",
                "name"     : "上海市",
                "pinyin"   : "S",
                "areas" : "华东"
            },
            {
                "id"       : "12",
                "name"     : "天津市",
                "pinyin"   : "T",
                "areas" : "华北"
            },
            {
                "id"       : "13",
                "name"     : "重庆市",
                "pinyin"   : "C",
                "areas" : "西南"
            },
            {
                "id"       : "14",
                "name"     : "四川省",
                "pinyin"   : "S",
                "areas" : "西南"
            },
            {
                "id"       : "15",
                "name"     : "贵州省",
                "pinyin"   : "G",
                "areas" : "西南"
            },
            {
                "id"       : "16",
                "name"     : "云南省",
                "pinyin"   : "Y",
                "areas" : "西南"
            },
            {
                "id"       : "17",
                "name"     : "西藏省",
                "pinyin"   : "X",
                "areas" : "西南"
            },
            {
                "id"       : "18",
                "name"     : "河南省",
                "pinyin"   : "H",
                "areas" : "华中"
            },
            {
                "id"       : "19",
                "name"     : "湖北省",
                "pinyin"   : "H",
                "areas" : "华中"
            },
            {
                "id"       : "20",
                "name"     : "湖南省",
                "pinyin"   : "H",
                "areas" : "华中"
            },
            {
                "id"       : "21",
                "name"     : "广东省",
                "pinyin"   : "G",
                "areas" : "华南"
            },
            {
                "id"       : "22",
                "name"     : "广西省",
                "pinyin"   : "G",
                "areas" : "华南"
            },
            {
                "id"       : "23",
                "name"     : "陕西省",
                "pinyin"   : "S",
                "areas" : "西北"
            },
            {
                "id"       : "24",
                "name"     : "甘肃省",
                "pinyin"   : "G",
                "areas" : "西北"
            },
            {
                "id"       : "25",
                "name"     : "青海省",
                "pinyin"   : "Q",
                "areas" : "西北"
            },
            {
                "id"       : "26",
                "name"     : "宁夏省",
                "pinyin"   : "N",
                "areas" : "西北"
            },
            {
                "id"       : "27",
                "name"     : "新疆省",
                "pinyin"   : "X",
                "areas" : "西北"
            },
            {
                "id"       : "28",
                "name"     : "河北省",
                "pinyin"   : "H",
                "areas" : "华北"
            },
            {
                "id"       : "29",
                "name"     : "山西省",
                "pinyin"   : "S",
                "areas" : "华北"
            },
            {
                "id"       : "30",
                "name"     : "内蒙古省",
                "pinyin"   : "N",
                "areas" : "华北"
            },
            {
                "id"       : "31",
                "name"     : "江苏省",
                "pinyin"   : "J",
                "areas" : "华东"
            },
            {
                "id"       : "32",
                "name"     : "浙江省",
                "pinyin"   : "Z",
                "areas" : "华东"
            },
            {
                "id"       : "33",
                "name"     : "安徽省",
                "pinyin"   : "A",
                "areas" : "华东"
            },
            {
                "id"       : "34",
                "name"     : "福建省",
                "pinyin"   : "F",
                "areas" : "华东"
            },
            {
                "id"       : "35",
                "name"     : "江西省",
                "pinyin"   : "J",
                "areas" : "华东"
            },
            {
                "id"       : "36",
                "name"     : "山东省",
                "pinyin"   : "S",
                "areas" : "华东"
            },
            {
                "id"       : "37",
                "name"     : "辽宁省",
                "pinyin"   : "L",
                "areas" : "东北"
            },
            {
                "id"       : "38",
                "name"     : "吉林省",
                "pinyin"   : "J",
                "areas" : "东北"
            },
            {
                "id"       : "39",
                "name"     : "黑龙江省",
                "pinyin"   : "H",
                "areas" : "东北"
            },
            {
                "id"       : "40",
                "name"     : "海南省",
                "pinyin"   : "H",
                "areas" : "华南"
            }
        ],
        //服务器设置
        servers: {
        	//local: 'http://192.168.4.140:8080/crm7/'//测试环境
            local: window.location.href.split('#')[0],//本地环境
            imgServer: 'http://192.168.12.40/'//图片前缀地址
        },
        //种族
        nationList:[{"name":"汉族","value":"0"},
                 {"name":"壮族","value":"1"},
                 {"name":"回族","value":"2"},
                 {"name":"满族","value":"3"},
                 {"name":"蒙古族","value":"4"},
                 {"name":"其他","value":"5"}],
        //身份
        cardKindList:[{"name":"身份证","value":"0"},
                      {"name":"军官证","value":"1"},
                      {"name":"护照","value":"2"},
                      {"name":"港澳通行证","value":"3"},
                      {"name":"其他","value":"4"}],
        birthdayTypeList:[{"name":"阳历","value":"0"},
            {"name":"阴历","value":"1"}],
        sexTypeList:[{"name":"男","value":"1"},
            {"name":"女","value":"0"}],
        accountTypePhotos:[{"typeId":1,"url":"resources/assets/images/member/accountType_1.png"},
            {"typeId":2,"url":"resources/assets/images/member/accountType_2.png"},
            {"typeId":3,"url":"resources/assets/images/member/accountType_3.png"}
        ]
    });
});