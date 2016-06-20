/**
 * 预警通知人选择模态框页面
 * @version  v1.0
 * @createTime: 2016-04-20
 * @createAuthor liuzy
 * @updateHistory
 *
 *
 */
define(function( require ){
    var app = require( "app" );
    var angular = require("angular");
    app.ngAMDCtrlRegister.controller( "recipientSelectorCtrl",["$scope","ajaxService","getCookieService", "noticeEmps", "$uibModalInstance", function($scope,ajax,cookie,noticeEmps,$uibModalInstance){

       //获取sessionId
        var sessionId = cookie.getCookie("CRMSESSIONID");
        $scope.roles = [];
        $scope.roleModel = {};
        /**
         * 获取全部角色选择项
         */
        ajax.AjaxPost( {sessionId : sessionId}, "usermanager/rolemanager/getRoleCombo.do" ).then(function( result ){
           $scope.roles = result.data;
            $scope.roleModel.roleId = $scope.roles[0].value;
            $scope.watchRoleId =  $scope.roleModel.roleId;
        });

        /**
         * 监听角色选择是否变化，根据角色变化加载对应的员工
         */
        $scope.$watch('watchRoleId', function(roleId){
            if(roleId){
                getEmpByRoleId(roleId);
            }
        });
        /**
         * 根据角色id获取员工
         * @param roleId
         */
        function getEmpByRoleId(roleId){
            refreshEmps(roleId, noticeEmps);
        }

        $scope.changeRoleId = function(roleId){
            getEmpByRoleId(roleId);
        };

        /**
         * 根据角色id获取员工具体操作
         * @param roleId
         * @param selectEmps
         */
        function refreshEmps(roleId, selectEmps){
            ajax.AjaxPost( {sessionId : sessionId, roleId : roleId}, "userManager/empManager/getEmpByRoleId.do" ).then(function( result ){
                $scope.emps = result.data;
               $scope.emps = regroupEmps($scope.emps, selectEmps);
            });
        }

        /**
         * 重组员工列表，排除已选的通知人后的列表
         * @param arr1
         * @param arr2
         * @returns {*}
         */
        function regroupEmps(arr1, arr2){
            var newArr = angular.copy(arr1);
            if(arr1.length !== 0 || arr2.length !== 0){
                for(var i = 0; i < arr1.length ; i++){
                    for(var j = 0; j < arr2.length; j++){
                        if(arr1[i].empId === arr2[j].empId){
                            var index = inArray(newArr,arr1[i]);
                            if(index !== -1){
                                newArr.splice(index,1);
                            }

                        }
                    }
                }
            }
            return newArr;
        }
        /**
         * 判断元素事都存在在数组中
         * @param arr
         * @param item
         * @returns {number}
         */
        function inArray(arr, item) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].empId === item.empId) {
                    return i;
                }
            }
            return -1;
        }

        /**
         * 员工列表的单选多选，反选操作
         * @type {Array}
         */
        $scope.selected = [];
        $scope.checkAll = false;
        $scope.checked = false;
        /**
         * 选择全部员工，以及反选
         * @param checkAll
         * @param emps
         */
        $scope.selectAllEmp = function(checkAll, emps){
            if(checkAll === true){
                $scope.checked = true;
                $scope.selected = [];
                for(var i = 0; i < emps.length ; i++){
                    $scope.selected.push(emps[i]);
                }
            }else{
                $scope.checked = false;
                $scope.selected = [];
            }
        };
        /**
         * 单选员工具体执行
         * @param action
         * @param emp
         */
        var updateSelected = function(action,emp){
            if(action == 'add' && $scope.selected.indexOf(emp) === -1){
                $scope.selected.push(emp);
            }
            if(action == 'remove' && $scope.selected.indexOf(emp)!== -1){
                var idx = $scope.selected.indexOf(emp);
                $scope.selected.splice(idx,1);
            }
            if($scope.selected.length == 0){
                $scope.checkAll = false;
            }
        };
        /**
         * 单选员工操作
         * @param $event
         * @param emp
         */
        $scope.updateSelection = function($event, emp){
            var checkbox = $event.target;
            var action = (checkbox.checked ? 'add' : 'remove');
            updateSelected(action,emp);
        };

        /**
         * 判断员工是否已存在于已选员工数组中
         * @param emp
         * @returns {boolean}
         */
        $scope.isEmpSelected = function(emp){
            //for(var i = 0; i < $scope.selected.length; i++){
            //    if(){
            //
            //    }
            //}
            return $scope.selected.indexOf(emp)>= 0;
        };

        /**
         * 确定操作，并将已选列表传回主页面，并关闭模态框
         */
        $scope.sureRecipient = function(){
            $uibModalInstance.close($scope.selected);
            $scope.selected = [];
        };
        /**
         * 取消操作，关闭模态框
         */
        $scope.cancelRecipient = function(){
            $uibModalInstance.dismiss('cancel');
        };
    }]);
});