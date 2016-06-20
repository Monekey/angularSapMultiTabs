define( function( require ){

    var app = require("app");//引用样式
    var emp_css = require("css!emp_css");
    app.ngAMDCtrlRegister.controller("editEmpController",[//模块依赖
            "$scope",//必须引用
            "$rootScope","ajaxService","$uibModal","$log",'register','shopSelectorService','modalService',//可选引用  顺序要和function中顺序一致
            function ($scope,$rootScope,ajaxService,$uibModal,$log,register,shopSelectorService,modalService ){
            var copy = [];
            var sessionId = $rootScope.sessionId;
    		var data = $rootScope.TabsData;
    		$scope.from = data.from;
    		var param = {sessionId : sessionId,empId:data.empId};
    		$scope.employeeUpdate = {
    				empInfo:{}
    		};
    		var initItems = [];
    		//加载员工对应店面信息
    		ajaxService.AjaxPost(param, "userManager/empManager/load.do").then(
    				function( result ){
    	    			$scope.empInfo = result.data;
    	    			$scope.roleName = $scope.empInfo.roleName;
    	    			var str = JSON.stringify(result.data.shopIds);
    	                copy = eval("("+str+")");
    	                $scope.employeeUpdate.empInfo.shopIds = result.data.shopIds;
    	                initItems = angular.copy($scope.employeeUpdate.empInfo.shopIds); 
    	                $scope.changeItems = [];
    	    		}		
    		);
    		//点击门店选择次数计数
    		var flg = 0;
   		 	/**
            * 开启门店选择模态框
            */
           $scope.showModal = function() {
               //showFlg : 0 是只显示有权限的门店，showFlg : 1是显示集团下所有门店
               var showFlg = 1;
             //将当前对象转换成对应模态框的对象的字段
               flg += 1;
               if(flg <= 1){
               	initItems = convertModalShop1(initItems);
               }  
                var currentItems = convertModalShop1($scope.employeeUpdate.empInfo.shopIds);
                var paramSet = {
                    "serviceType": "shop", //terminal
                    "shop":{
                        "brand":1,
                        "city":2,
                        "ajaxUrl":"baseData/shopManager/getShopTree.do"
                    },
                    "initItems":initItems,
                    "currentItems":currentItems,
                    "showFlg": 1
                };
                shopSelectorService.openShopModal(paramSet).then(function(result){
                    //result中含有全部已选元素数组，和变化的元素数组
                    $scope.employeeUpdate.empInfo.shopIds = convertModalShop(result.allSelectedItems);
                    console.log( $scope.employeeUpdate.empInfo.shopIds );
                    
                    $scope.changeItems = convertModalShop(result.changeItems);
                    console.log($scope.changeItems);
                });
            };

            /**
             * 当前页面元素与模态框元素字段同步
             * @param shops
             * @returns {Array}
             */
            function convertModalShop(shops){
                var newShops = [];
                for(var i=0;i<shops.length;i++){
                    var shop = {};
                    shop.shopId = shops[i].code;
                    shop.shopName = shops[i].showName;
                    shop.bindStatus = shops[i].bindFlg;
                    shop.empId = data.empId;
                    newShops.push(shop);
                }
                return newShops;
            }
            function convertModalShop1(shops){
                var newShops1 = [];
                for(var i=0;i<shops.length;i++){
                    var shop = {};
                    shop.code = shops[i].shopId;
                    shop.showName = shops[i].shopName;
                    shop.bindFlg = shops[i].bindStatus;
                    newShops1.push(shop);
                }
                return newShops1;
            }
            /**
             * 实现规则列表新建页面的跳转
             * @param type
             */
            $scope.createNew = function () {
                register.openTabWithRequest({id: 10025}, {});
            };
            
    		
    		//根据sessionId获取员工所属角色
            var param1 = {
    			    sessionId : sessionId
    			};
    		ajaxService.AjaxPost(param1, "usermanager/rolemanager/getRoleCombo.do").then(
    				function( result ){
    	    			$scope.roleList=result.data;
    	    		}
    		);
    		

            /**
             * 删除数组中由于ng-repeat产生的"$$hashKey"字段
             * @param arr
             * @returns {*}
             */
            function deletePropertyHashKey(arr){
                for(var i = 0;i<arr.length;i++){
                    delete arr[i].$$hashKey;
                }
                return arr;
            }     

            //提交要更新的数据
            $scope.confirmUpdate = function(){
                
            	//将角色名转换为角色id
				var roleId;
				var roleList = $scope.roleList;
				for(var a=0;a<roleList.length;a++) {
					if($scope.roleName==roleList[a].showName) {
						roleId = roleList[a].value;
					}
				}
            	
                $scope.employeeUpdate.empInfo.shopIds = deletePropertyHashKey($scope.employeeUpdate.empInfo.shopIds);
                var shopIds = "";
                if( $scope.changeItems!=null){
                	shopIds = $scope.changeItems;
                    //console.log($scope.employeeUpdate.empInfo.shopIds);
                }else{
                	shopIds = [];
                }
               
                var submit =  {};
                
                submit.sessionId = sessionId;
                submit.shopIds = shopIds;
                submit.roleId = roleId;
                submit.empName = document.getElementById("empName").value;
                submit.empId = data.empId;
                /**
                 * 执行更新操作
                 */
                ajaxService.AjaxPost(submit,"userManager/empManager/edit.do").then(function (result) {
                    if(result&&result.status===1){
                        selectExchanges = [];
                        modalService.info({title:'提示', content:'修改成功!', size:'sm', type: 'ok'});
                        data.callback();//保存成功后,执行更新操作
                        register.switchTab({id: $scope.from});
                    }
                });
            };
    		
			//底端取消按钮
			$scope.cancelIn = function () {
	            register.switchTab({id: $scope.from});
	        };
	        
            $scope.toggleAnimation = function () {
                $scope.animationsEnabled = !$scope.animationsEnabled;
            };
			
            commonScope = $scope;
    		
		}]);

} );
