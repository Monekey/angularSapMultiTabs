/**
 * 集团会员详情页
 * @version  v1.0
 * @createTime: 2016-04-20
 * @createAuthor zuoxh
 * @updateHistory  
 *
 */
define(function (require) {
	//require加载模块
    var ngAMD = require("ngAMD");
    var angular = require("angular");
    var membersCss = require("css!../../../assets/css/members");
    //注册会员详情controller
	ngAMD.controller("memberDetailCtrl", [
        "$scope",
        "appConstant",
        "ajaxService",
        "register",
        "$rootScope",//加载模块，与回调函数顺序一致
        function ($scope, appConstant, ajaxService, register,$rootScope) {
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
            //获取集团会员标识
            var memberId = $scope.member.id
            //常量中获取民族
            $scope.nationList = appConstant.nationList;
            //取得当前会员对应的名族名称
            $scope.meberNationName = getNationName($scope.member.nation);
            //常量中获取证件类型
            /*$scope.cardKindList = appConstant.cardKindList;*/
            //取得当前会员对应证件名称
            $scope.cardKindName = getcardKindName($scope.member.cardKind);
            /*//常量中获取生日类型
            $scope.birthdayTypeList = appConstant.birthdayTypeList;*/
            
            /*调用ajax服务，根据会员标识获取会员的关系图谱 */
            ajaxService.AjaxPost({sessionId: $rootScope.sessionId,id:memberId}, 'businessmanage/memberManage/memberRelationship.do').then(function (result) {
                //获取返回结果集
            	$scope.memberRlationships= result.data;
            	
                //解析我邀请人的信息
                $scope.myInviteMembers=[];//存储我邀请人的信息
                var inviteIds = $scope.memberRlationships.inviteIds;
                var inviteNames =$scope. memberRlationships.inviteNames;
                var inviteSexs = $scope.memberRlationships.inviteSexs;
                var invitePhotos = $scope.memberRlationships.invitePhotos;
                if(inviteIds && inviteIds !=""){
                	var inviteIdArray= inviteIds.split(",");
                	var inviteNameArray= inviteNames.split(",");
                	var inviteSexArray= inviteSexs.split(",");
                	var invitePhotoArray= invitePhotos.split(",");
                	for (var i = 0; i < inviteIdArray.length; i++) {
						var  obj={};//建立我邀请人的对象
						obj.id=inviteIdArray[i];
						obj.name=inviteNameArray[i];
						obj.sex=inviteSexArray[i];
						obj.photo=invitePhotoArray[i];
						$scope.myInviteMembers.push(obj);
						
					}
                	
                }
            });
            
            
            /*获得会员的行为信息*/
            ajaxService.AjaxPost({sessionId: $rootScope.sessionId,id:memberId}, 'businessmanage/memberBehavior/memberBehavior.do').then(function (result) {
            	//接收会员行为信息
            	$scope.myBeaviors =result.data;
            });
           
            /*
             * 根据会员的名字获取会员民族
             */
            function getNationName(nationCode){
            	var nationName =null;
            	if(nationCode != null && nationCode != ""){
            		var nationList = appConstant.nationList;
            		for (var i = 0; i < nationList.length; i++) {
						if(nationCode ==parseInt(nationList[i].value)){
							nationName = nationList[i].name;
							break;
						}
					}
            	}
            	return nationName;
            }
            /*获取会员对应的证件类型*/
            function getcardKindName(cardKind){
            	var cardKindName =null;
            	if(cardKind != null && cardKind != ""){
            		var cardKindList = appConstant.cardKindList;
            		for (var i = 0; i < cardKindList.length; i++) {
						if(cardKind ==parseInt(cardKindList[i].value)){
							cardKindName = cardKindList[i].name;
							break;
						}
					}
            	}
            	return cardKindName;
            }
        }]);
});