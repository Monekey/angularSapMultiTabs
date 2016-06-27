define(function (require) {
    var ngAMD = require('ngAMD');
    //定义controller
    ngAMD.controller('modalDemo',[
        '$scope',
        '$rootScope',
        //自定义模块注入，与回调函数顺序应一致
        "register",
        "modalService",
        function ($scope, $rootScope, register, modalService) {
            $scope.pageTitle = "模态弹窗";
            $scope.modalTypes = [{id:'sm',name:'小'},{id:'md',name:'中'},{id:'lg',name:'大'}];
            $scope.inputs = {
                success:{
                    content:'保存成功',
                    type:'ok'
                },
                fail:{
                    content:'保存失败',
                    type:'fail'
                },
                normal:{
                    title:'普通弹窗的提示',
                    content:'验证失败，请重试！',
                    size:'sm',
                    type:'normal'
                },
                confirm:{
                    title:'确认弹窗的提示',
                    content:'确定要删除该项目吗？',
                    size:'sm',
                    type:'confirm'
                }
            }
            $scope.custom={
                title:'这里是标题',
                content:'这里是内容',
                size:'sm',
                type:'normal',
                delay:1500,
                callback: null
            }
            $scope.success = function(){
                modalService.info($scope.inputs.success);
            }
            $scope.fail = function(){
                modalService.info($scope.inputs.fail);
            }
            $scope.normal = function(){
                modalService.info($scope.inputs.normal)
            }
            $scope.confirm = function(){
                modalService.info($scope.inputs.confirm).then(function(status){
                    alert('您点击了确定按钮');
                },function(reason){
                    alert('您点击了取消按钮');
                });
            }
            $scope.addOrRemoveCallback = function(){
                if($scope.custom.callback){
                    $scope.custom.callback = null;
                }else{
                    $scope.custom.callback = function(status){
                        alert('添加的alert事件!!');
                    }
                }
            }
            $scope.customModal = function(){
                modalService.info($scope.custom).then($scope.custom.callback);
            }
        }]);
    return 'modalDemo';
});

