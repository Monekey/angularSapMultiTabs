define(["require","ngAMD","angular","uploadService"],function(require){var ngAMD=require("ngAMD"),angular=require("angular"),upload=require("uploadService");ngAMD.controller("changeCardDate",["$scope","appConstant","ajaxService","register","uploadService","$rootScope",function($scope,appConstant,ajaxService,register,uploadService,$rootScope){var tabData=$rootScope.TabsData,data=angular.copy(tabData);$scope.shop=data,$scope.from=data.from;var param={};for(var x in data)param[x]=data[x];param.name="getChangeCardDates",param.pageNo="1",param.pageCount=appConstant.pageSet.numPerPage,param.otherShop=data.isOtherShop;var sessionId=$rootScope.sessionId;$scope.conditions={ajaxUrl:"reportcenter/compDetailed/list.do",request:param,filter:[{type:"normal",field:"终端",requestFiled:"terminalId",value:[],ajaxUrl:"reportcenter/terminal/list.do",request:param}]},$scope.pageSet={title:"修改有效期",currentPage:appConstant.pageSet.currentPage,maxSize:appConstant.pageSet.maxSize,numPerPage:appConstant.pageSet.numPerPage,table:[{field:"index",desc:"编号"},{field:"ts_code",desc:"流水号",column:"ts_code"},{field:"member_name",desc:"姓名"},{field:"number",desc:"卡号"},{field:"old_date",desc:"原有效期"},{field:"new_date",desc:"新有效期"},{field:"opname",desc:"操作类型",column:"opname"},{field:"createTime",desc:"操作时间",column:"createTime"},{field:"terminal_code",desc:"终端号"},{field:"operation_name",desc:"操作人",column:"operation_name"},{field:"open_shop_name",desc:"开卡门店"},{field:"xf_shop_name",desc:"交易门店"}]}}])});