/**
 * 时间段插件
 * @version  v1.0
 * @createAuthor LSZ
 * @updateHistory
 *        2016/4/20 LSZ create
 *        2016/6/3  LSZ  update 封装jedate日期插件
 */
define(['ngAMD', 'jedate'], function (ngAMD) {

    ngAMD.directive('period', [
        function () {
            return {
                restrict: 'E',
                scope: {
                    "startTime": '=',
                    "endTime": '=',
                    "isTime": "@",//是否显示时间，不设置时不显示
                    "maxDate": "@",//最大日期，不设置不做限制
                    "minDate": "@"//最小日期，不设置不做限制
                },
                replace: 'true',
                template: "<div><input id='{{startId}}'  type='text' class='form-control' style='width: 43% !important;float:left;' value='' ng-change='startOnChange(sttm)' ng-model='sttm'>" +
                "<div class='col-xs-1' style='margin-top:4px;text-align: center;padding: 2px;'>至</div>" +
                "<input id='{{endId}}' type='text' class='col-xs-5 form-control' style='width: 43% !important;float:left;' ng-change='startOnChange(edtm)' ng-model='edtm'></div>",
                controller: 'com.tcsl.crm7.periodController'
            };
        }]);

    ngAMD.factory('variable', [
        function () {
            var variable = 0;
            return {
                //获取cookie
                getVariable: function () {
                    return ++variable;
                }
            }
        }]);

    ngAMD.controller('com.tcsl.crm7.periodController', [
        '$scope',
        'variable',
        '$timeout',
        function ($scope, variable, $timeout) {
            $scope.varI = variable.getVariable();
            $scope.startId = 'start' + $scope.varI;
            $scope.endId = 'end' + $scope.varI;

            $scope.$on('to-child', function (event, data) {
                document.getElementById($scope.startId).value = data[0];
                document.getElementById($scope.endId).value = data[1];
                end.minDate = data[0];
                start.maxDate = data[1];
            });

            $scope.startOnChange = function (model) {
                if (model === '') {//为空时将startTime的model置空（防止用户手动清空的情况）
                    if (model === $scope.sttm) {
                        $scope.startTime = '';
                    } else {
                        $scope.endTime = '';
                    }
                }
            };

            function Range(range) {
                return {
                    dateCell: range.dateCell,
                    festival: false,//是否显示节日
                    zIndex: 2066,//层级
                    //isinitVal: true,//初始化日期
                    maxDate: (function () {
                        if ($scope.maxDate == 'now') {
                            return jeDate.now(0);
                        } else if ($scope.maxDate) {
                            return $scope.maxDate + " 23:59:59";
                        }

                    })(),
                    minDate: (function () {
                        if ($scope.minDate == 'now') {
                            return jeDate.now(0);
                        } else if ($scope.minDate) {
                            return $scope.minDate + " 00:00:00";
                        }
                    })(),
                    isTime: $scope.isTime,
                    choosefun: range.choosefun,
                    format: (function () {
                        if ($scope.isTime) {
                            return 'YYYY-MM-DD hh:mm:ss';
                        }
                        return 'YYYY-MM-DD';
                    })(),
                    clearfun: range.clearfun
                }
            }


            var start = Range({
                dateCell: '#' + $scope.startId,
                choosefun: function (datas) {
                    end.minDate = datas; //开始日选好后，重置结束日的最小日期
                    if (!$scope.isTime) {
                        datas = new Date(datas);
                        datas.setHours(0);
                        datas.setMinutes(0);
                        datas.setSeconds(0);
                    }
                    $scope.startTime = new Date(datas).getTime();

                    if (!$scope.endTime && document.getElementById($scope.endId).value) {
                        var dataNew = document.getElementById($scope.endId).value;
                        if (!$scope.isTime) {
                            dataNew = new Date(dataNew);
                            dataNew.setHours(23);
                            dataNew.setMinutes(59);
                            dataNew.setSeconds(59);
                        }
                        $scope.endTime = new Date(dataNew).getTime();
                    }
                    $scope.$apply();
                    if ($scope.$parent.score_post && $scope.endTime) {
                        $scope.$parent.score_post();
                    }
                },
                clearfun: function (val) {
                    $scope.startTime = '';
                    $scope.$apply();
                }
            });

            var end = Range({
                dateCell: '#' + $scope.endId,
                choosefun: function (datas) {
                    start.maxDate = datas; //将结束日的初始值设定为开始日的最大日期
                    if (!$scope.isTime) {
                        datas = new Date(datas);
                        datas.setHours(23);
                        datas.setMinutes(59);
                        datas.setSeconds(59);
                    }
                    $scope.endTime = new Date(datas).getTime();

                    if (!$scope.startTime && document.getElementById($scope.startId).value) {
                        var dataNew = document.getElementById($scope.startId).value;
                        if (!$scope.isTime) {
                            dataNew = new Date(dataNew);
                            dataNew.setHours(0);
                            dataNew.setMinutes(0);
                            dataNew.setSeconds(0);
                        }
                        $scope.startTime = new Date(dataNew).getTime();
                    }
                    $scope.$apply();
                    if ($scope.$parent.score_post && $scope.startTime) {
                        $scope.$parent.score_post();
                    }
                },
                clearfun: function (val) {
                    $scope.endTime = '';
                    $scope.$apply();
                }
            });

           /* start.format = start.format();
            start.maxDate = start.maxDate();
            start.minDate = start.minDate();
            end.format = end.format();
            end.maxDate = end.maxDate();
            end.minDate = end.minDate();*/

            $timeout(function () {
                if ($scope.startTime) {
                    document.getElementById($scope.startId).value = $scope.startTime;
                    end.minDate = $scope.startTime;
                }
                if ($scope.endTime) {
                    document.getElementById($scope.endId).value = $scope.endTime;
                    start.maxDate = $scope.startTime;
                }
                jeDate(start);
                jeDate(end);
            });
        }
    ]);

    ngAMD.directive('monthSelect', [
        function () {
            return {
                restrict: 'E',
                scope: {
                    "month": '=',
                    "format":'@',
                    "maxDate": "@",//最大日期，不设置不做限制
                    "minDate": "@"//最小日期，不设置不做限制
                },
                replace: 'true',
                template: "<div><input id='{{monthId}}'  type='text' class='form-control' style='width: 43% !important;' value=''  ng-change='startOnChange(time)' ng-model='time'>",
                controller: 'com.tcsl.crm7.monthController'
            };
        }]);

    ngAMD.controller('com.tcsl.crm7.monthController', [
        '$scope',
        'variable',
        '$timeout',
        function ($scope, variable, $timeout) {
            $scope.varI = variable.getVariable();
            $scope.monthId = 'month' + $scope.varI;
            $scope.$on('to-childMonth', function (event, data) {

                document.getElementById($scope.monthId).value = data;

            });
            function FormatDate (strTime) {
                var date = new Date(strTime);
                var year = date.getFullYear();
                var month = (date.getMonth()+1)<10?"0"+(date.getMonth()+1):(date.getMonth()+1);
                var day = date.getDate()<10?"0"+date.getDate():date.getDate();
                return year+"-"+month+"-"+day;
            };
            $scope.startOnChange = function (model) {
                if (model === '') {//为空时将startTime的model置空（防止用户手动清空的情况）
                    if (model === $scope.time) {
                        $scope.month = '';
                    }
                }
            };

            var dateFormat = $scope.format? $scope.format:'YYYY-MM';
            $timeout(function () {
                if ($scope.month) {
                    if($scope.format == 'YYYY-MM-DD'){
                        document.getElementById($scope.monthId).value = FormatDate($scope.month);
                    }else{
                        document.getElementById($scope.monthId).value = $scope.month;
                    }
                }

                var jeMaxDate = function () {
                    if ($scope.maxDate == 'now') {
                        return jeDate.now(0);
                    } else if ($scope.maxDate) {
                        return $scope.maxDate + " 00:00:00";
                    }
                };
                var jeMinDate = function(){
                        if ($scope.minDate == 'now') {
                            return jeDate.now(0);
                        } else if ($scope.minDate) {
                            return $scope.minDate + " 00:00:00";
                        }
                };
                jeDate({
                    dateCell: "#" + $scope.monthId,
                    zIndex: 2066,//层级
                    //isinitVal: true,//初始化日期
                    maxDate: jeMaxDate(),
                    minDate: jeMinDate(),
                    choosefun: function(datas){
                        $scope.month = datas;
                        if(dateFormat && dateFormat==='YYYY-MM-DD'){
                            var dataNew = new Date($scope.month);
                            dataNew.setHours(0);
                            dataNew.setMinutes(0);
                            dataNew.setSeconds(0);
                            $scope.month = new Date(dataNew).getTime();
                        }else{
                            $scope.month = new Date($scope.month).getTime();
                        }
                        $scope.$apply();
                        if ($scope.$parent.score_post && datas) {
                            $scope.$parent.score_post();
                        }
                    },
                    format:  dateFormat,
                    clearfun: function(){
                        $scope.month = '';
                        $scope.$apply();
                    }
                });
            });
        }]);
});

