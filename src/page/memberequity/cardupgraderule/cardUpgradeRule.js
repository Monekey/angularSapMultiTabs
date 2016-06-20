/**
 * 卡型升级规格列表页     
 * @version  		v1.0      
 * @createTime: 	2016-04-20        
 * @createAuthor 	Hyz             
 * @updateHistory  
 *                	2016-04-20  Hyz  卡型升级规格列表页
 * @note   
 * 					  
 */
define(function (require) {
	//引入css样式
    var score_rule_css = require("css!score_rule_css");
    var upgrade_rule_css = require("css!upgrade_rule_css");
    // var card_type_css = require("css!card_type_css");
//    var app = require("css!../../../assets/css/card_type");
    //注册control
    var rtObj = {
    		//control  名             control  参数
        ctrl: "cardUpgradeRuleCtrl", arrFunc: [
            '$scope',
            '$rootScope',
            'getCookieService',
            'appConstant',
            'register',
            function ($scope,$rootScope, getCookieService, appConstant,register) {
            	//得到sessionid
                var sessionId = getCookieService.getCookie("CRMSESSIONID");
                //详情页面修改按钮权限
                $rootScope.editcardUpgrade = register.getRoot('修改');
                //卡型升级规格搜索panel
                $scope.conditions = {
                	//卡型升级规格搜索panel数据请求接口
                    ajaxUrl: 'memberequity/cardupgrade/list.do',
                    //卡型升级规格搜索panel数据请求接口   传入参数
                    request: {"sessionId": sessionId, "pageNo": "1", "pageCount": appConstant.pageSet.numPerPage}
                };
                //卡型升级规格数据分页  以及注册操作按钮等
                $scope.pageSet = {
                    title: '卡型升级规则列表',
                    currentPage: appConstant.pageSet.currentPage,
                    maxSize: appConstant.pageSet.maxSize,
                    numPerPage: appConstant.pageSet.numPerPage,
                    //注册一个表头    新建   按钮
                    button:{
                    	//按钮名称
                        title: '新建',
                        //新建一个页面
                        newtab: {
                        	//新建页面名称
                            title:"新建升级规则",
                            //新建页面名称id
                            id:"newCardUpgrade",
                          //新建页面名称control名
                            ctrlName:"cardUpgradeRuleCreateCtrl",
                          //新建页面名称control
                            ctrl: 'memberequity/cardupgraderule/cardUpgradeRuleCreate',
                          //新建页面名称html
                            template:"memberequity/cardupgraderule/cardUpgradeRuleCreate.html",
                            //来自于那个页面标记
                            from: 10024,
                            type: 'multiple',
                            ng_show:false
                        }
                    },
                    //展示数据table赋值
                    table: [
                     //field返回数据集合对象的属性名取值                //desc前段页面表头列名
                     {field: 'index', desc: '编号'}, 
                     {field: 'name', desc: '卡型升级名称',column:'card_upgrade_name'}, 
                     {
                    	 field: 'upgradeType',
                         desc: '升级类型',
                         filter: 'cardUpgradeType',
                         column:'card_upgrade_type'
                     },
                     {
                    	 field: 'upgradeStatus',
                    	 desc: '启用状态',
                    	 filter: 'cardUpgradeStatus',
                         column:'status',
                         isRender:true
                     },
                     ],
                     //在每条数据后边注册一个操作控件集合
                     task: [
					 {
						 //控件操作类型
					  	type: 'toAjax',
					  	//接口传入参数
					  	 content:'cardUpgradeRuleBean',
					  	 //动作接口
					  	 ajaxUrl: 'memberequity/cardupgrade/updateStatus.do',
					  	 //按钮显示 拦截器参数---从此列中获得
					  	 field: 'upgradeStatus',
					  	 //按钮显示 拦截器
					     filter: 'cardUpgradeStatus1'
					  },
                     {
						 //类型
                         type:'toChange',
                         //名称
                         desc: '修改',
                         //新页面
                         newtab:{
                             title:"升级规格修改",
                             //新页面id
                             id:"cardUpgradeRuleEdit",
                             //标记来源
                             from: 10024,
                             //control 名称
                             ctrlName:"cardUpgradeRuleEditCtrl",
                             //control
                             ctrl:"memberequity/cardupgraderule/cardUpgradeRuleEdit",
                             //html
                             template:"memberequity/cardupgraderule/cardUpgradeRuleEdit.html",
                             ng_show:false
                         }
                         
                     }, 
					 {
                    	 //类型
                     	type: 'delete',
                     	//次操作接口传入参数
                     	content:'vo',
                     	//操作接口
                     	ajaxUrl: 'memberequity/cardupgrade/delete.do',
                     	desc: '删除'
                     },
                     {
                    	 //类型
                         type:'toDetail',
                         //名称
                         desc: '详情',
                         //新页面
                         newtab:{
                             title:"升级规格详情",
                             ctrlName:"cardUpgradeRuleDetailCtrl",
                             ctrl:"memberequity/cardupgraderule/cardUpgradeRuleDetail",
                             from: 10024,
                             id:"CardUpgradeDetail",
                             template:"memberequity/cardupgraderule/cardUpgradeRuleDetail.html",
                             ng_show:false
                         }
                     }]
                };
            }
        ]
    };
    return rtObj;
});

