/**
 * 我的首页
 * @version  v1.0
 * @createTime: 2016-04-20
 * @createAuthor liyd
 * @updateHistory
 *            2016-06-24 liuzy 图表切换代码复用
 *
 * @note 列表页:myindex
 */

define(function (require) {
    var ngAMD = require('ngAMD');
    var app = require("css!myindex_css");
    var echart = require("echart");
    var macarons = require("macarons");
    echart.registerTheme("macarons", macarons);
    var $_true = require("jquery");
    $_true(".tab li").click(
        function () {
            $_true(this).addClass("blue").siblings().removeClass("blue");
            var tab = $_true(this).attr("title");
            $_true("#" + tab).show().siblings().hide();

        }
    );

    function tab() {
        $_true(this).addClass("blue").siblings().removeClass("blue");
        var tab = $_true(this).attr("title");
        $_true("#" + tab).show().siblings().hide();

    };

    var jquery1;
    var companyId;
    var titleName = "会员数";

    function init_setEchars(param) {
        param.data.companyId = companyId;
        jquery1.AjaxPost(param.data, param.url).then(function (result) {
            var chart = echart.init(document.getElementById(param.id), 'macarons');
            chart.clear();
            chart.setOption({
                //trigger: 'axis',
                tooltip: {
                    trigger: 'axis',
                    formatter: "{a} {b} {c}" + param.label
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                toolbox: {
                    show: true,
                    x: '1200',
                    y: '5',
                    feature: {
                        saveAsImage: {show: true}
                    }
                },
                calculable: true,
                /* legend: {
                 data: ['会员数','会员消费','会员积分','会员储值']
                 },*/
                xAxis: [{
                    type: 'category',
                    boundaryGap: false,
                    data: result.name,
                    splitLine: {
                        show: false
                    }
                }],
                yAxis: [{
                    type: 'value',
                    //name:titleName,
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: ['#ddd'],
                            width: 1,
                            type: 'solid'
                        }
                    },
                }],
                series: [{
                    type: 'line',
                    stack: '总量',
                    name: titleName,
                    data: result.value,
                    smooth: true,
                    itemStyle: {
                        normal: {
                            label: {
                                show: true,
                                formatter: function (p) {
                                    return p.value > 0 ? (p.value) : '';
                                }
                            },
                            areaStyle: {type: 'default'}
                        }
                    }
                }]
            });
            window.onresize = chart.resize;
        });
    }

    //var add2ctrl = require( "myindex/myindexfour/myindexfour" );

    ngAMD.controller("indexCtrl", [
        '$scope',
        "ajaxService",
        "$rootScope",
        "register",
        function ($scope, ajaxService, $rootScope, register) {
            var sessionId = $rootScope.sessionId;

            jquery1 = ajaxService;
            //var sessionId = getCookie("CRMSESSIONID");

            ajaxService.AjaxPost({
                sessionId: sessionId,
                data: 1
            }, "index/busiSMS/load.do").then(function (result) {

                $scope.surplusCount = result.showCount;
                $scope.showName = result.showName;
                $scope.showURL = result.showLogo;

            });

            ajaxService.AjaxPost({
                showCount: 5,
                sessionId: sessionId
            }, "index/sysMsg/load.do").then(function (result) {
                $scope.list = result.pageInfo.list;
            });

            $scope.isShow = function (hot) {
                if (hot == 1) {
                    return "block";
                }
                else {
                    return "none";
                }
            };
            //var companyId=0;

            ajaxService.AjaxPost({
                sessionId: sessionId
            }, "index/memberReport/load.do").then(function (result) {
                $scope.memberCount = result.data.memberCount;
                $scope.toDayMemberCount = result.data.toDayMemberCount;
                $scope.toDayConsume = result.data.toDayConsume;

                if (result.data.addMemberCount == '-') {
                    $scope.addMemberCount = result.data.addMemberCount;
                    $_true("#addMemberCount").remove();
                } else if (result.data.addMemberCount >= 0) {
                    $scope.addMemberCount = result.data.addMemberCount + '%';
                    $scope.addMemberCountImg = '&#xe62e;';
                    $scope.addMemberCountChose = '1';
                } else {
                    $scope.addMemberCount = -result.data.addMemberCount + '%';
                    $scope.addMemberCountImg = '&#xe62d';
                    $scope.addMemberCountChose = '2';
                }

                if (result.data.addDayConsume == '-') {
                    $scope.addDayConsume = result.data.addDayConsume;
                    $_true("#addDayConsume").remove();
                } else if (result.data.addDayConsume >= 0) {
                    $scope.addDayConsume = result.data.addDayConsume + '%';
                    $scope.addDayConsumeImg = '&#xe62e;';
                    $scope.addDayConsumeChose = '1';
                } else {
                    $scope.addDayConsume = -result.data.addDayConsume + '%';
                    $scope.addDayConsumeImg = '&#xe62d;';
                    $scope.addDayConsumeChose = '2';
                }


                companyId = result.companyId;

                init_setEchars($scope.chartParam);

            });
            /**
             * 初始请求图表参数
             * @type {{id: string, data: {reportName: string, sessionId: *, date: number, dateExecute: boolean, format: string, toDay: boolean, type: string, size: number, count: number}, url: string, label: string}}
             */
            $scope.chartParam = {
                id: "main",
                data: {
                    reportName: 'memberCountReportDay',
                    sessionId: sessionId,
                    date: 7,
                    dateExecute: true,
                    format: 'MM月dd日',
                    toDay: false,
                    type: 'DAY',
                    size: -1,
                    count: 7
                },
                url: 'index/memberReport/list.do',
                label: '个'
            };
            /**
             * 根据时间请求图表数据方法
             * @param date
             */
            $scope.clickDate = function (date) {
                $scope.chartParam.data.date = date.date;
                $scope.chartParam.data.format = date.format;
                $scope.chartParam.data.type = date.type;
                $scope.chartParam.data.count = date.count;
                $scope.chartParam.data.reportName = date.reportName;
                $scope.chartParam.data.toDay = date.toDay;
                init_setEchars($scope.chartParam);
            };

            $scope.addTab1 = function () {

                register.addToTabs({
                    title: "系统消息",
                    id: "add2ctrl",
                    template: "myindex/sysmsg/sysmsg.html",
                    ctrl: "myindex/sysmsg/sysmsg",
                    ctrlName: "add2ctrl",
                    ng_show: false,
                    type: 'single',
                    from: 10001
                }, {a: 1});
            };

            $scope.addWarning = function () {
                $scope.conditions = {};
                register.openTabWithRequest({id: 10043}, {});//穿透时调用的方法,id为目标tab功能id,第二个参数为显示类型及显示条件（searchType搜索的下拉条件 searchTypeValue搜索框内的内容）
            };

            $scope.allMember = function () {
                register.openTabWithRequest({id: 10013}, {select: 'all'});
            };

            $scope.todayMember = function () {
                register.openTabWithRequest({id: 10013}, {select: 'toDay'});
            };

            $scope.todayTrans = function () {
                register.openTabWithRequest({id: 10015}, {select: 'toDay'});
            };
            /**
             * 图表上方日期button
             * @type {*[]}
             */
            $scope.dates = [
                {
                    name: '近7天',
                    statu: true,
                    title: 1,
                    date: 7,
                    format: 'MM月dd日',
                    type: 'DAY',
                    count: 7,
                    reportName: 'memberCountReportDay',
                    toDay: false
                },
                {
                    name: '近15天',
                    statu: false,
                    title: 2,
                    date: 15,
                    format: 'MM月dd日',
                    type: 'DAY',
                    count: 15,
                    reportName: 'memberCountReportDay',
                    toDay: false
                },
                {
                    name: '近30天',
                    statu: false,
                    title: 3,
                    date: 30,
                    format: 'MM月dd日',
                    type: 'DAY',
                    count: 30,
                    reportName: 'memberCountReportDay',
                    toDay: false
                },
                {
                    name: '近12个月',
                    statu: false,
                    title: 4,
                    date: 11,
                    format: 'yyyy年MM月',
                    type: 'MONTH',
                    count: 11,
                    reportName: 'memberCountReportMonth',
                    toDay: true
                }];
            $scope.setDateColor = function (date, title) {
                $scope.dates.forEach(function (date) {
                    date.statu = false;
                });
                date.statu = true;
                $scope.clickDate(date);
            };
            /**
             * 图表panel-title的图表类型button
             * @type {*[]}
             */
            $scope.typers = [
                {
                    name: '会员数',
                    statu: true,
                    title: "d1",
                    chartId: 'main',
                    reportDayName: 'memberCountReportDay',
                    reportMonthName: 'memberCountReportMonth',
                    label: '个'
                },
                {
                    name: '会员消费',
                    statu: false,
                    title: "d2",
                    chartId: 'maina',
                    reportDayName: 'memberConsumeReportDay',
                    reportMonthName: 'memberConsumeReportMonth',
                    label: '元'
                },
                {
                    name: '会员积分',
                    statu: false,
                    title: "d3",
                    chartId: 'mainb',
                    reportDayName: 'memberScoreReportDay',
                    reportMonthName: 'memberScoreReportMonth',
                    label: '分'
                },
                {
                    name: '会员储值',
                    statu: false,
                    title: "d4",
                    chartId: 'maind',
                    reportDayName: 'memberSaveMonryReportDay',
                    reportMonthName: 'memberSaveMonryReportMonth',
                    label: '元'
                }];
            $scope.setColor = function (typer) {
                $scope.typers.forEach(function (typer) {
                    typer.statu = false;
                    var tab = typer.title;
                    $_true("#" + tab).hide();
                    //$_true("#maind").show();
                });
                typer.statu = true;
                titleName = typer.name;
                $scope.dates.forEach(function (date) {
                    if (date.title === 4) {
                        date.reportName = typer.reportMonthName;
                    } else {
                        date.reportName = typer.reportDayName;
                    }
                    date.statu = false;
                });
                $scope.dates[0].statu = true;
                $scope.chartParam.id = typer.chartId;
                $scope.chartParam.label = typer.label;
                //$_true(this).addClass("blue").siblings().removeClass("blue");
                var tab = typer.title;
                $_true("#" + tab).show();
                $scope.clickDate($scope.dates[0]);
                $_true("#" + typer.chartId).show();
            };
        }
    ])
    return 'indexCtrl';
});