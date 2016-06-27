/**
 * 集团会员修改页
 * @version  v1.0
 * @createTime: 2016-04-20
 * @createAuthor zuoxh
 * @updateHistory
 *
 */
define(function (require) {
    //加载模块
    var ngAMD = require("ngAMD");
    var angular = require("angular");
    //注册会员修改controller
    ngAMD.controller("memberEditCtrl", [
        "$scope",
        "appConstant",
        "ajaxService",
        "register",
        "modalService",
        "$rootScope",//加载模块，顺序与function中的参数一致
        function ($scope, appConstant, ajaxService, register,modalService,$rootScope) {
            //获取父页面操作记录的数据
            var tabData = $rootScope.TabsData;
            //为避免修改父页面数据，复制数据
            var data = angular.copy(tabData);
            //将副本数据赋值给当前scope中的对象
            $scope.member = data;

            //为了避免卡类型、民族下拉框select不到值的情况，将当前卡类型的值、以及民族值转换为字符串
            if($scope.member.cardKind != null){
                $scope.member.cardKind=$scope.member.cardKind+"";
            }
            if($scope.member.nation != null){
                $scope.member.nation=$scope.member.nation+"";
            }
            //规定页面默认展示阳历生日
            $scope.member.birthdayType='0';
            //获取当前Tab页面的父Tab页面归属，后边使用定位
            $scope.from = data.from;
            //常量中获取民族列表
            $scope.nationList = appConstant.nationList;
            //常量中获取证件类型列表
            $scope.cardKindList = appConstant.cardKindList;
            //常量中获取生日类型列表
            $scope.birthdayTypeList = appConstant.birthdayTypeList;
            //if($scope.member.birthday && $scope.member.birthday != ''){
            //    $scope.member.birthday = new Date($scope.member.birthday).getTime();
            //}


            /*保存更新操作*/
            $scope.updateMember = function (member) {
                member.birthday = new Date(member.birthday).getTime();
                member.createTime=null;//为了避免字符换转换Timestamp出错
                member.updateTime=null;//为了避免字符换转换Timestamp出错

                if($scope.member.cardKind && $scope.member.cardKind != '' &&
                    (!$scope.member.certificateNo ||$scope.member.certificateNo =='')){
                    modalService.info({title:'提示', content:'请填写证件编号！', size:'sm', type: 'confirm'});
                    return false;
                }
                if($scope.member.certificateNo && $scope.member.certificateNo != '' &&
                    (!$scope.member.cardKind ||$scope.member.cardKind =='')){
                    modalService.info({title:'提示', content:'请选择证照类型！', size:'sm', type: 'confirm'});
                    return false;
                }

                //声明参数
                var param = {member: member, sessionId: $rootScope.sessionId};
                //调用ajax服务，保存更新内容
                ajaxService.AjaxPost(param, 'businessmanage/memberManage/update.do').then(function (result) {
                    modalService.info({content:'修改成功！',type: 'ok'}).then(function(obj){
                        //更新成功后，关闭当前tab页面，切换到父Tab
                        if(obj.status == 'ok'){
                            $scope.member.callback();
                            register.switchTab({id: $scope.from});
                        }
                    },function(){
                        $scope.member.callback();
                        register.switchTab({id: $scope.from});
                    });
                });
            };

            /*取消更新操作，切换到父TAB*/
            $scope.cancel = function () {
                register.switchTab({id: $scope.from});
            }
        }]);
});