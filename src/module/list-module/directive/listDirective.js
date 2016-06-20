/**
 * 列表展示公共模块
 * @version  v1.0
 * @createAuthor LSZ
 * @updateHistory
 *       2016/3/7 LSZ  create
 */
define(function (require) {

    var angular = require("angular");

    var listModule = angular.module("com.tcsl.crm7.list2", ['ui.bootstrap']);
    //自定义列表指令
    listModule.directive('pageList', [
        function () {
            return {
                restrict: 'E',
                scope: {
                    "results": '=',
                    "requestObj": '=',
                    "pageSet": "="
                },
                replace: 'true',
                templateUrl: 'src/module/list-module/template/page_list.html',
                controller: 'com.tcsl.crm7.list2.pageListController'
            };
        }]);
    //自定义列表controller
    listModule.controller('com.tcsl.crm7.list2.pageListController', [
        '$scope',
        'ajaxService',
        '$filter',
        'register',
        'modalService',
        function ($scope, ajaxService, $filter, register,modalService) {
            $scope.create = register.getRoot('新建');
            $scope.edit= register.getRoot('修改');
            $scope.delete= register.getRoot('删除');
            $scope.detail= register.getRoot('详情');

            //点击页码翻页
            $scope.pageChanged = function () {
                var postObj = $scope.requestObj.request;
                postObj.pageNo = $scope.pageSet.currentPage;
                postObj.pageCount = $scope.pageSet.numPerPage;
                //检索积分规则
                ajaxService.AjaxPost(postObj, $scope.requestObj.ajaxUrl).then(function (result) {
                    $scope.results = result;
                });
            };
            //加载自定义filter
            $scope.getContext = function (j, data) {
                if (!data.filter) {
                    return data.desc;
                }
                if (angular.isArray(data.field)) {
                    return $filter(data.filter)(j[data.field[0]], j[data.field[1]], j[data.field[2]],j[data.field[3]]);
                }
                return $filter(data.filter)(j[data.field]);
            };
            //根据过滤器规则添加css
            $scope.getStateCss = function(j, data) {
                if (!data.isRender) {
                    return '';
                }
                return $filter('tranCss')($scope.getContext(j,data));
            };
            //加载自定义Cssfilter
            $scope.getCss = function (j, data) {
                if (!data.cssFilter) {
                    return '';
                }
                if (angular.isArray(data.field)) {
                    return $filter(data.cssFilter)(j[data.field[0]], j[data.field[1]], j[data.field[2]],j[data.field[3]]);
                }
                return $filter(data.cssFilter)(j[data.field]);
            };
            $scope.getIconFont = function(data, task){
                return  $filter('tranListIconFont')(data[task.field],task.field);
            }
            //数据操作项
            $scope.taskEnything = function (data, task) {
                if (task.type === 'toAjax') {
                    if (data[task.field] !== 0) {
                        if (task.field === 'isAccess') {
                            if (data[task.field] === 1) {
                                data[task.field] = 2;
                            } else {
                                data[task.field] = 1;
                            }
                        } else {
                            data[task.field] = 0;
                        }
                    }

                    var postObj = {
                        "sessionId": $scope.requestObj.request.sessionId,
                        "flg": 1,
                    };
                    postObj[task.content] = data;

                    ajaxService.AjaxPost(postObj, task.ajaxUrl).then(function (result) {
                        if (result.scoreRule) {
                            ajaxService.AjaxPost($scope.$parent.conditions.request, $scope.$parent.conditions.ajaxUrl).then(function (results) {
                                $scope.results = results;
                            });
                        }
                    });
                } else if (task.type === 'delete') {
                    modalService.info({title:'提示', content:'确定要删除吗？', size:'sm', type: 'todo'}).then(function() {
                        var postObj = {
                            "sessionId": $scope.requestObj.request.sessionId,
                        };
                        postObj[task.content] = data;
                        ajaxService.AjaxPost(postObj, task.ajaxUrl).then(function (result) {
                            ajaxService.AjaxPost($scope.$parent.conditions.request, $scope.$parent.conditions.ajaxUrl).then(function (results) {
                                if(results.pageInfo.list.length<=0){
                                    results.noData = true;
                                }
                                $scope.results = results;
                            });
                        });
                    });
                } else if (task.type === 'toChange' || task.type === 'toDetail') {
                    var aNewObj = angular.copy(task.newtab);
                    aNewObj.id = task.newtab.id + data.id;
                    data.callback =function a(){
                        $scope.pageChanged();
                    };
                    register.addToTabs(aNewObj, data);
                }
            };
            //新建
            $scope.createNew = function (newtab) {
                register.addToTabs(newtab, {callback:function a(){
                    $scope.pageChanged();
                }});
            };

            $scope.setSort = function(sortType, table){
                if(table.column != undefined){//没有配置column字段则不需要进行排序
                    for(var i=0;i<$scope.pageSet.table.length;i++){
                        $scope.pageSet.table[i].sort = 'disable';
                    }
                    var postObj = $scope.requestObj.request;
                    postObj.pageNo = $scope.pageSet.currentPage;
                    postObj.pageCount = $scope.pageSet.numPerPage;

                    postObj.orderBy = table.column;

                    if(sortType === 'asc'){
                        table.sort = true;
                        //TODo
                        postObj.orderCending = 'asc';
                    }else{
                        table.sort= false;
                        //TODo
                        postObj.orderCending = 'desc';
                    }
                    ajaxService.AjaxPost(postObj, $scope.$parent.conditions.ajaxUrl).then(function (result) {
                        $scope.results = result;
                    });
                }
            }
        }]);
});

