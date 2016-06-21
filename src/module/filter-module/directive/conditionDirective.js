/**
 * 筛选器公共模块
 * @version  v1.0
 * @createAuthor LSZ
 * @updateHistory
 *       2016/3/7 LSZ  create
 *       2016/6/7 LSZ  update 时间按钮显示相应的时间期间
 */
define(function (require) {
    var angular = require("angular");
    var period = require("period");

    var listModule = angular.module("com.tcsl.crm7.list", []);
    /*var listModule = require('ngAMD');
    var uiBootstrapped = require("ngload!ui.bootstrap");*/

    //自定义筛选器指令
    listModule.directive('conditionFilter', [
        function () {
            return {
                restrict: 'E',
                scope: {
                    "conditions": "=",
                    "resultName": "@"
                },
                replace: 'true',
                templateUrl: 'src/module/filter-module/template/condition_filter.html',
                controller: 'com.tcsl.crm7.list.filterController'
            };
        }]);
    //筛选器controller
    listModule.controller('com.tcsl.crm7.list.filterController', [
        '$scope',
        'ajaxService',
        '$rootScope',
        '$timeout',
        '$window',
        '$interval',
        function ($scope, ajaxService, $rootScope, $timeout,$window,$interval) {
            $scope.moreFilter = false;
            $scope.moreConditions = {value: []};
            if ($scope.conditions.isCollapsed != false && $scope.conditions.isCollapsed != true) {
                $scope.conditions.isCollapsed = true;
            }
            if ($scope.conditions.select) {
                $scope.selType = $scope.conditions.select.options[0];
            }

            if ($scope.conditions.filter) {
                if ($scope.conditions.filter.length > 0) {
                    $scope.conditions.filter.forEach(function (condition) {
                        if (condition.ajaxUrl) {
                            ajaxService.AjaxPost(condition.request, condition.ajaxUrl).then(function (result) {
                                var elementSelect = 0;
                                if (typeof(result.elementSelect) != "undefined") {
                                    elementSelect = result.elementSelect;
                                }
                                condition.value.push({'name': '全部', 'state': !elementSelect, 'value': null});
                                var allCount = 0;
                                for (var i in result.pageInfo.list) {
                                    var x = {};
                                    x.state = false;

                                    if (elementSelect != 0 && elementSelect == result.pageInfo.list[i].id) {
                                        x.state = true;
                                    }

                                    x.value = result.pageInfo.list[i].id;
                                    if (result.pageInfo.list[i].cityName) {
                                        x.name = result.pageInfo.list[i].cityName;
                                    } else {
                                        x.name = result.pageInfo.list[i].typeName;
                                    }
                                   /* if (result.pageInfo.list[i].count) {//筛选条件显示数量
                                        x.count = result.pageInfo.list[i].count;
                                        allCount += x.count;
                                        condition.value[0].count = allCount;
                                    }*/

                                    condition.value.push(x);
                                }

                                loadPopver(condition.value, condition);//同一个过滤条件超过七个值，则分两个数组显示
                            });
                        }
                    });
                }
            }

            //查询
            ajaxService.AjaxPost($scope.conditions.request, $scope.conditions.ajaxUrl).then(function (result) {
                $scope.noData = false;
                if(result.pageInfo.list.length<=0){
                    $scope.noData = true;
                }
                result.firstRequest = true;
                result.noData = $scope.noData;
                if ($scope.resultName) {
                    $scope.$parent[$scope.resultName] = result;
                    $scope.$parent[$scope.resultName + 'Request'] = {
                        request: $scope.conditions.request,
                        ajaxUrl: $scope.conditions.ajaxUrl
                    };
                } else {
                    $scope.$parent.resultList = result;
                    $scope.$parent.requestObj = {
                        request: $scope.conditions.request,
                        ajaxUrl: $scope.conditions.ajaxUrl
                    };
                }
            });

            //页面穿透时带回的搜索条件
            if ($rootScope.searchRequest) {
                if ($rootScope.searchRequest.searchType) {
                    $scope.selType = $scope.conditions.select.options[parseInt($rootScope.searchRequest.searchType) - 1];
                    $scope.conditions.searchValue = $rootScope.searchRequest.searchTypeValue;
                }
                for (var rr in $rootScope.searchRequest) {
                    $scope.conditions.request[rr] = $rootScope.searchRequest[rr];
                }
                delete $rootScope.searchRequest;
            }


            var broad2Period = function (button) {//将按钮相应时间传到period内
                var GetDateStr = function (AddDayCount) {//("前天："+GetDateStr(-2))昨天："+GetDateStr(-1)今天："+GetDateStr(0)明天："+GetDateStr(1)
                    var dd = new Date();
                    dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
                    var y = dd.getFullYear();
                    var m = dd.getMonth() + 1;//获取当前月份的日期
                    var d = dd.getDate();

                    if(m < 10){
                        m = "0" + m;
                    }
                    if(d < 10){
                        d = "0" + d;
                    }

                    return y + "-" + m + "-" + d;
                };

                var  GetMonthStr = function(AddMonthCount){
                    var dd = new Date();
                    var month = dd.getMonth();//获取当前月份的日期
                    var year2 = dd.getFullYear();
                    var month2 = parseInt(month) + 1 + AddMonthCount;
                    if (month2 == 0) {
                        year2 = parseInt(year2) - 1;
                        month2 = 12;
                    }
                    if (month2 < 10) {
                        month2 = '0' + month2;
                    }
                    var t2 = year2 + '-' + month2;
                    return t2;
                }

                switch (button + '') {
                    case '0':
                        $scope.$broadcast('to-child', [GetDateStr(0), GetDateStr(0)]);
                        break;
                    case '1':
                        $scope.$broadcast('to-child', [GetDateStr(-1), GetDateStr(-1)]);
                        break;
                    case '7':
                        $scope.$broadcast('to-child', [GetDateStr(-7), GetDateStr(-1)]);
                        break;
                    case '15':
                        $scope.$broadcast('to-child', [GetDateStr(-15), GetDateStr(-1)]);
                        break;
                    case '30':
                        $scope.$broadcast('to-child', [GetDateStr(-30), GetDateStr(-1)]);
                        break;
                    case 'M1':
                        $scope.$broadcast('to-childMonth',GetMonthStr(0));
                        break;
                    case 'M2':
                        $scope.$broadcast('to-childMonth',GetMonthStr(-1));
                        break;
                }
            };

            $timeout(function () {//默认显示相应相应时间段，全部为空
                if ($scope.conditions.datePicker) {
                    $scope.conditions.datePicker.value.forEach(function (date) {
                        if (date.state) {
                            broad2Period(date.value);
                        }
                    });
                    $scope.conditions.datePicker.value.forEach(function (need) {
                        if (need.state) {
                            $scope.filterSelected = [];
                            $scope.filterSelected.push(need);
                        }
                    });
                }
            }, 500);


            //提交
            $scope.score_post = function () {
                if ($scope.conditions.more) {
                    $scope.filterSelected = [];
                }
                var postObj = $scope.conditions.request;

                var dateRange = function (dateRanger) {
                    var dateButton = dateRanger.requestFiled[0];
                    var start = dateRanger.requestFiled[1];
                    var end = dateRanger.requestFiled[2];

                    if (angular.isArray(dateRanger.requestFiled)) {
                        if (dateRanger[start] || dateRanger[end]) {
                            postObj[start] = dateRanger[start];
                            postObj[end] = dateRanger[end];
                            delete(postObj[dateButton]);
                            dateRanger.value.forEach(function (value) {
                                value.state = false;
                            });
                        } else {
                            postObj[dateButton] = dateRanger[dateButton];
                            delete(postObj[start]);
                            delete(postObj[end]);

                            if (dateRanger[dateButton] === 'null') {//选择全部按钮的情况
                                $scope.$broadcast('to-child', ['', '']);
                                return;
                            }else{
                                dateRanger.value.forEach(function (need) {
                                    if (need.state) {
                                        if($scope.filterSelected){
                                            $scope.filterSelected.push(need);
                                        }
                                    }
                                });
                                broad2Period(dateRanger[dateButton]);
                            }
                        }
                    }
                }


                if ($scope.conditions.datePicker) {//顶部时间段
                    dateRange($scope.conditions.datePicker);
                }

                if ($scope.conditions.searchValue !== undefined) {
                    if ($scope.conditions.searchValue) {
                        postObj[$scope.conditions.search.requestFiled] = $scope.conditions.searchValue;
                        postObj[$scope.conditions.select.requestFiled] = $scope.selType.value;
                    } else {
                        delete postObj[$scope.conditions.search.requestFiled];
                        delete postObj[$scope.conditions.select.requestFiled];
                    }
                }

                if ($scope.conditions.filter) {
                    if ($scope.conditions.filter.length > 0) {
                        $scope.conditions.filter.forEach(function (condition) {
                            var key;

                            if (angular.isArray(condition.requestFiled)) {
                                dateRange(condition);//内容区时间段
                            } else {
                                condition.value.forEach(function (need) {
                                    if (need.state) {
                                        key = condition.requestFiled;
                                        postObj[key] = need.value;
                                        if (need.name !== '全部' && $scope.conditions.more) {
                                            $scope.filterSelected.push(need);
                                        }
                                    }

                                });

                            }
                            if (angular.isUndefined(postObj[key])) {//当前选中条件不在value中，而在moreValue中
                                if (condition.moreValue) {
                                    condition.moreValue.forEach(function (need) {
                                        if (need.state) {
                                            key = condition.requestFiled;
                                            postObj[key] = need.value;
                                        }
                                    });
                                }
                            }
                        });
                    }
                }


                if ($scope.conditions.more) {
                    postObj.type = $scope.moreType;
                    delete postObj.typeValue;
                    $scope.moreConditions.value.forEach(function (mCdt) {
                        if (mCdt.state) {
                            postObj.typeValue = mCdt.value;
                            $scope.filterSelected.push(mCdt);
                        }
                    });
                    if (angular.isUndefined(postObj.typeValue)) {//当前选中条件不在value中，而在moreValue中
                        if ($scope.moreConditions.moreValue) {
                            $scope.moreConditions.moreValue.forEach(function (mCdt) {
                                if (mCdt.state) {
                                    postObj.typeValue = mCdt.value;
                                    $scope.filterSelected.push(mCdt);
                                }
                            });
                        }
                    }
                }

                if ($scope.$parent.pageSet.table) {//查询时候清除table的排序功能
                    for (var i = 0; i < $scope.$parent.pageSet.table.length; i++) {
                        $scope.$parent.pageSet.table[i].sort = 'disable';
                    }
                }

//查询
                ajaxService.AjaxPost(postObj, $scope.conditions.ajaxUrl).then(function (result) {
                    result.noData = $scope.noData;
                    if ($scope.resultName) {
                        $scope.$parent[$scope.resultName] = result;
                        $scope.$parent[$scope.resultName + 'Request'] = {
                            request: postObj,
                            ajaxUrl: $scope.conditions.ajaxUrl
                        };
                    } else {
                        $scope.$parent.resultList = result;
                        $scope.$parent.requestObj = {request: postObj, ajaxUrl: $scope.conditions.ajaxUrl};
                    }
                });
            }
            ;

            function loadPopver(list, more) {
                if (list.length > 7) {//同一个过滤条件超过七个值，则分两个数组显示
                    var newArray = angular.copy(list);
                    more.value = list.splice(0, 7);
                    more.templateUrl = "src/module/filter-module/template/popver.html";
                    more.moreValue = newArray.splice(7, (newArray.length - 1));
                }
            }


//默认查询筛选条件
            function getResult(ajaxUrl) {
                ajaxService.AjaxPost({sessionId: $scope.conditions.request.sessionId}, ajaxUrl).then(function (results) {
                    var list = results.data;
                    list.forEach(function (resultOne) {
                        resultOne.state = false;
                        resultOne.name = resultOne.typeName;
                        resultOne.value = resultOne.id;
                    });
                    $scope.moreConditions.value = list;

                    loadPopver(list, $scope.moreConditions);
                });
            }

            if ($scope.conditions.more) {
                $scope.moreType = '0';
                getResult("reportcenter/compBrand/list.do");
            }


            $scope.changeFilter = function (moreType) {
                var type = parseInt(moreType);
                $scope.moreType = type;
                if (type === 0) {
                    getResult("reportcenter/compBrand/list.do");
                } else if (type === 1) {
                    getResult("reportcenter/compCity/list.do");
                }
            };
//删除单个已选filter
            $scope.removeFilter = function (filter) {
                var filterSelected = $scope.filterSelected;
                for (var i = 0; i < filterSelected.length; i++) {
                    if (filterSelected[i].name === filter.name) {
                        filterSelected[i].state = false;
                        filterSelected.splice(i, 1);

                        $scope.conditions.filter.forEach(function (condition) {
                            angular.forEach(condition.value, function (filterOne) {
                                if (filterOne.name === filter.name) {
                                    filterOne.state = false;
                                    condition.value[0].state = true;
                                }
                            });
                        });
                        $scope.score_post();
                        return;
                    }
                }
            };
//删除所有已选filter
            $scope.clearAllFilter = function () {
                $scope.conditions.filter.forEach(function (condition) {
                    angular.forEach(condition.value, function (filterOne) {
                        filterOne.state = false;
                    });
                    condition.value[0].state = true;
                });
                if ($scope.filterSelected) {
                    $scope.filterSelected.forEach(function (filterSel) {
                        filterSel.state = false;
                    });
                }

                $scope.filterSelected = [];
                $scope.score_post();
            };

            //条件点击事件
            $scope.ruleStatus_click = function (condition, button) {
                if(condition.requestFiled){
                    if(angular.isArray(condition.requestFiled)){//数组为dataflex类型的日期按钮
                        condition[condition.requestFiled[0]] = button.value + '';
                        delete(condition[condition.requestFiled[1]]);
                        delete(condition[condition.requestFiled[2]]);
                    }
                }

                angular.forEach(condition.value, function (j) {
                    j.state = false;
                });
                if (condition.moreValue) {
                    angular.forEach(condition.moreValue, function (j) {
                        j.state = false;
                    });
                }
                button.state = !button.state;
                $scope.score_post();
            };

//禁止事件传播
            $scope.forbidden = function (event) {
                event.stopPropagation();
            };

            $scope.changeSelType = function (type) {
                $scope.selType = type;
            };

//条件更多里的搜索
            $scope.findModal = function (condition, searchValue) {
                if (angular.isUndefined(searchValue)) {
                    searchValue = '';
                }

                if(angular.isUndefined(condition)){
                    condition = $scope.moreConditions;
                    if (condition.moreValueCopy) {
                        var moreValue = angular.copy(condition.moreValueCopy);
                    } else {
                        var moreValue = angular.copy(condition.moreValue);
                    }
                }else{
                    if (condition.moreValueCopy) {
                        var moreValue = angular.copy(condition.moreValueCopy);
                    } else {
                        var moreValue = angular.copy(condition.moreValue);
                    }
                }


                condition.moreValue.forEach(function (valueOne) {
                    if (valueOne.state) {
                        moreValue.forEach(function (valueCopy) {
                            if (valueCopy.value == valueOne.value) {
                                valueCopy.state = true;
                            } else {
                                valueCopy.state = false;
                            }
                        });
                    }
                });
                condition.moreValue = [];
                moreValue.forEach(function (value) {
                    if (value.name.indexOf(searchValue) >= 0) {
                        condition.moreValue.push(value);
                    }
                });
                $scope.filterSearch = searchValue;

                condition.moreValueCopy = angular.copy(moreValue);
            };

            $scope.isFixed = false;//固定顶部的开关
            $scope.randomId = new Date().getTime();//生成不重复ID
            //开关点击事件
            var watchUnbindFunc = null;
            $scope.fix = function(){
                $scope.isFixed = !$scope.isFixed;
                var cbw=$("#ControlBarWrapper"+$scope.randomId);//撑高度的遮罩
                var nav=$("#ControlBarWrapper"+$scope.randomId+" .shaixuan"); //得到导航对象
                var sc=$(".content-main").length<=0?$(".content-pullLeft-main"):$(".content-main");//滚动条DOM对象
                var topBarHeight=$(".head").height();
                var fixClass = "shaixuan-fix";
                if(sc.length<=0){
                   sc = $("#ui-view");
                    topBarHeight+=$("#posTopbar").height();
                    fixClass+="-pos";
                }
                if(!$scope.isFixed){
                    sc.unbind('scroll');
                    if(watchUnbindFunc!=null){
                        watchUnbindFunc();
                    }
                    nav.removeClass(fixClass);
                    cbw.css('height','auto');
                }else{
                    var navH = nav.height();
                    var fixWidth = cbw.width();
                    var offTop = nav.offset().top-topBarHeight;
                    var offLeft = cbw.offset().left;
                    nav.css('left',offLeft);
                    nav.css('width',fixWidth);
                    watchUnbindFunc = $scope.$watch(function(){return cbw.width()}, function(width){
                        nav.css('width',width);
                        nav.css('left',cbw.offset().left);
                    });
                    sc.bind('scroll',function(){
                        if(sc.scrollTop()>=offTop){
                            nav.addClass(fixClass);
                            cbw.css('height',navH);
                        }else{
                            nav.removeClass(fixClass);
                            cbw.css('height','auto');
                        }
                    });
                }
            };
        }])
    ;
})
;

