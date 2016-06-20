/**
 * 弹出信息公共模块
 * @version  v1.0
 * @createAuthor hyz
 * @updateHistory
 *       2016/6/15 hyz  create
 */
define(['angular', 'ui_bootstrap', 'ng_animate','esegece','sgc','base64'], function (angular) {
    var modalModule = angular.module("com.tcsl.crm7.devices", ['ui.bootstrap', 'ngAnimate']);
    //自定义factory
    modalModule.factory('devicesService', [
        '$uibModal',
        '$q',
        '$rootScope',
        '$window',
        function ($uibModal, $q,$rootScope,$window) {
        	var TDevices = new function(){
        		var tdevs = this;
        		//debug
        		tdevs.debug = false;
        		
        		
        		// 打开外部执行文件
        		var OpenExe = function(enable){
        			if(enable != undefined)
        				this.enable = enable;
        			else
        				this.enable = true;// 未传默认开启
        		}
        		
        		OpenExe.DEFAULTS ={
        			"whichExe":1,
        			"event":0
        		}
        		
        		OpenExe.prototype.handle = function(opt){
        			if(!this.enable) {
        				dlog("外部程序打开驱动未启用！");
        				return;
        			}
        			this.options = extend({}, OpenExe.DEFAULTS, opt);
        			tdevs.rpc(GUID(), "tcsl.execute.open", this.options);
        		}
        		
        		$window.OpenExe = OpenExe;
        		
        		//fastreport
        		var FastReport = function(enable){
        			this.enable = enable;
        			this.oper = FastReport.OPER;
        			if(!tdevs.isWin) { //不支持非windows
        				this.enable = false;
        				return;
        			}
        		}
        		
        		FastReport.DEFAULTS = {
        			"fileid":0,
        			"exporttype":1,
        			"printer" : "report"
        			//DS1~5
        		};
        		
        		FastReport.OPER = {
        			cmd:{
        				printerlist:"tcsl.report.printer_list",
        				design:"tcsl.report.design",
        				preview:"tcsl.report.preview",
        				print:"tcsl.report.print",
        				export_data:"tcsl.report.export_data",
        				seturl:"tcsl.report.set_url"
        			}
        		}
        		//报表通用操作
        		FastReport.prototype.handle = function(op_name,params){
        			if(!this.enable) return;
        			var _this = this;
        			if(!_this.enable) {
        				//console.debug("尚未启用报表!");
        				return;
        			}
        			var _method = _this.oper.cmd[op_name];
        			if(typeof(params) == "string"){
        				tdevs.rpc(GUID(),_method, params);
        			}else{
        				var _params = extend({}, FastReport.DEFAULTS, params);
        				tdevs.rpc(GUID(),_method, _params);	
        			}
        		}
        		
        		//设计
        		FastReport.prototype.design = function(params){
        			this.handle("design",params);
        		}
        		//预览
        		FastReport.prototype.preview = function(params){
        			this.handle("preview",params);
        		}
        		//打印
        		FastReport.prototype.print = function(params){
        			this.handle("print",params);
        		}
        		//导出
        		FastReport.prototype.exportdata = function(params){
        			this.handle("export_data",params);
        		}
        		//初始化
        		FastReport.prototype.init = function(url){
        			var id = GUID();
        			var _method = this.oper.cmd["seturl"];
        			var _params = url;
        			tdevs.rpc(id,_method, _params);
        			this.url = url;
        			this.inited = true;
        		}
        		//打印机列表
        		FastReport.prototype.printerlist = function(callback){
        			if(!this.enable) return;
        			var id = GUID();
        			var _method = this.oper.cmd.printerlist;
        			//注册一个回调事件
        			regCallBack(id,_method,function(result){
        				if(callback) callback(result);
        			});
        			tdevs.rpc(id,_method, {});
        		}
        		
        		$window.FastReport = FastReport;
        		
        		//版本获取
        		var Version = function(){
        			this.oper = Version.OPER;
        		}
        		
        		Version.OPER = {
        			cmd:{
        				getversion:"tcsl.devicemgr.get_version"
        			}
        		}
        		
        		Version.prototype.getversion = function(callback){
        			var id = GUID();
        			var _method = this.oper.cmd.getversion;
        			//注册一个回调事件
        			regCallBack(id,_method,function(result){
        				if(callback) callback(result);
        			});
        			tdevs.rpc(id,_method, {});
        		}
        		
        		//打印操作
        		var DevicePrint = function(url){
        			if(url) this.url = url;
        			this.oper = DevicePrint.OPER;
        		}
        		
        		DevicePrint.OPER = {
        			cmd:{
        				preview:"tcsl.xlsprint.preview",
        				print:"tcsl.xlsprint.print",
        			}
        		}
        		
        		DevicePrint.prototype.handle = function(url,oper){
        			if(this.url || url ){
        				url = this.url;
        				var id = GUID();
        				tdevs.rpc(id,oper,url);
        			}
        		}
        		
        		//打印
        		DevicePrint.prototype.print = function(url){
        			this.handle(url,this.oper.cmd.print);
        		}
        		
        		//预览
        		DevicePrint.prototype.preview = function(url){
        			this.handle(url,this.oper.cmd.preview);
        		}
        		
        		$window.DevicePrint = DevicePrint;
        		
        		/** CRM M1卡、IC卡读卡 begin */
        		var CrmM1 = function(enable){
        			this.enable = enable;
        			this.oper = CrmM1.OPER;
        		}
        		
        		CrmM1.DEFAULTS = {
        			//读卡器类型--1=4442 2=330
        			"mode":1,
        			//COM端口号--mode=1是必须指定
        			"comport":1,
        			//COM波特率--mode=1是必须指定
        			"comrate" : "9600",
        			//IC卡的PIN码
        			"pin" : "000003"
        		};
        		
        		CrmM1.OPER = {
        			cmd:{
        				readno:"tcsl.cardop.read_no"
        			}
        		}
        		//报表通用操作
        		CrmM1.prototype.handle = function(op_name,params, callback){
        			if(!tdevs.isWin) { //不支持非windows
        				this.enable = false;
        				return;
        			}
        			var _this = this;
        			if(!_this.enable) {
        				return;
        			}
        			var _method = _this.oper.cmd[op_name];
        			var _params = extend({}, CrmM1.DEFAULTS, params);
        			var id = GUID();
        			if(callback) {
        				//注册一个回调事件
        				regCallBack(id,_method,function(result){
        					if(callback) callback(result);
        				});
        			}
        			tdevs.rpc(id,_method, _params);	
        		}
        		
        		//读卡
        		CrmM1.prototype.readno = function(params, callback){
        			this.handle("readno", params, callback);
        		}       		
        		
        		$window.CrmM1 = CrmM1;
        		/** CRM M1卡读卡 begin */
        		
        		//socket 归属TDevices
        		var socket;
        		//回调函数集合
        		var _callbak_keys=[],_callbak_funcs=[];
        		
        		//注册回调事件
        		var regCallBack = function(id,cmd,func,data){
        			_callbak_keys.push(id);
        			_callbak_funcs.push({
        				id:id,
        				cmd:cmd,
        				func:func,
        				data:data
        			})
        		}
        		
        		//根据id查找注册的回调
        		var findCallBack = function(id){
        			for (var i=0; i < _callbak_keys.length; i++) {
        			  	if(_callbak_keys[i] == id) return _callbak_funcs[i];
        			}
        			return null;
        		}
        		
        		//根据命令查找集合
        		var findCallBacks = function(cmd){
        			var funcs = [];
        			for (var i=0; i < _callbak_funcs.length; i++) {
        			  	if(_callbak_funcs[i].cmd == cmd) 
        			  		funcs.push(extend({},_callbak_funcs[i]));
        			}
        			return funcs;
        		}
        		
        		//wsocket所需要的参数
        		var _setting = {
        			location:"ws://127.0.0.1:5414",
        			onerror:function(event){
        				if(_setting.cuserr){
        					_setting.cuserr();
        				}
        				if(_setting.errCallBack){
        					_setting.errCallBack();
        					_setting.errCallBack = false;
        				}else{
        					if(event.message){
        						if(typeof($) != "undefined") $.toast(event.message,{type:"danger"});
        						else if(typeof(tcsl) != "undefined") tcsl.Toast.warn(event.message);
        					}else{
        						if(typeof($) != "undefined") $.toast("设备连接失败",{type:"danger"});
        						else if(typeof(tcsl) != "undefined") {
        							var msg = "设备连接失败";
        							if(tdevs.curDmPackage){ //如果有下载包链接
        								msg = "设备管理器连接失败，如需并口打印、钱箱、客显，请启动设备管理器 <br/>如未安装请<a href ='" + tdevs.curDmPackage +"'>点击下载</a>";
        							}
        							tcsl.Msg.warn(msg);
        						}
        					}
        					tdevs.errShowed = true;	
        				}
        			},
        			onopen:function(event){
        				if(_setting.cusopen){
        					_setting.cusopen();
        				}
        				
        				if(_setting.initCallBack){
        					_setting.initCallBack();
        					_setting.initCallBack = false;
        				}
        			},
        			onsgcrpcresult:function(m){
        				//console.debug("onsgcrpcresult~!!!");
        				var result = obj.result;
        				var id = obj.id;
        				var funcObj = findCallBack(id);
        				if(funcObj) 
        					funcObj.func(obj.result,funcObj.data);
        			}
        		};
        		
        		this.opt = _setting;
        		
        		/**
        		 * @public
        		 * @return {Boolean}
        		 */
        		this.isReady = function(){
        			//2015-3-14 处理socket未初始化的情况 lqk
        			if( socket )
        				return socket.state() == "open";
        				
        			return false;
        		};
        		
        		//socket是否关闭状态
        		this.isClose = function(){
        			return socket.state() == "close";
        		};
        		
        		//rpc协议请求
        		this.rpc = function(id,method,params){
        			if(this.notSupper) return;
        			dlog("rpc params before :" , params);
        			 
        			if(typeof params == "object"){
        				params = JSON.stringify(params);
        			}
        			
        			params = Base64.encode(params);
        			params = '{"v":"'+ params +'"}';
        			
        			//params = JSON.stringify(params);
        			
        			dlog("rpc params after :" , params);
        				
        			if(socket != null && tdevs.isReady()){ //如果是open状态
        				socket.rpc(id,method, params); //直接调用
        			}else{
        				var initCallBack = function(){
        					socket.rpc(id,method, params);
        				}
        				this.initWS({initCallBack:initCallBack}); //检测socket是否初始化
        			}
        		}
        		
        		
        		
        		//设置初始化回调
        		this.setInitCallBack = function(fun){
        			if(fun)
        				_setting.initCallBack = fun;
        		}
        		
        		function extend(){
        			var  copy, name,
        			target = arguments[0] || {},
        			i = 1,
        			length = arguments.length;
        			for ( ; i < length; i++ ) {
        				// Only deal with non-null/undefined values
        				if ( (options = arguments[ i ]) != null ) {
        					for ( name in options ) {
        						copy = options[ name ];
        						if ( copy !== undefined ) {
        							target[ name ] = copy;
        						}
        					}
        				}
        			}
        			return target;
        		}
        		
        		//合并ws参数
        		function getWsSetting(opt){
        			_setting = extend(_setting,opt);
        			return _setting;
        		}
        		
        		//设置ws参数
        		function setAttr(socket,setting){
        			for(var key in setting){
        				var index = key.indexOf("on");
        				if(index == 0){
        					if(setting[key]){
        						socket.on(key.substring(2,key.length), setting[key]);
        					}
        				}
        			}
        			if(setting.globle_opt) tdevs.globle_opt = setting.globle_opt;
        		}
        		
        		//初始化ws
        		this.initWS = function(opt, callback){
        			if (!$window.WebSocket){
        				this.notSupper = true;
        				return;
        			}
        				
        			if(!socket){
        				var setting = getWsSetting(opt);
        				socket = new sgcws(setting.location);
        				setAttr(socket,setting);
        			}else{
        				if(socket.state() == "closed" || socket.state() == "closing"){
        					var setting = getWsSetting(opt);
        					socket = new sgcws(setting.location);
        					setAttr(socket,setting);
        				}
        			}
        			if(callback) {
        				callback();
        			}
        		};
        		
        		function dlog(m,o){
        			if(tdevs.debug){
        				console.log(m);
        				if(o) console.log(o);
        			}
        		}
        	};
        	
 /**
  * *****************************打印机列表********************************************************************
  */       	
        	
            return {
                info: function () {
                	var me = this;
            		var isWin = true;
            		TDevices.isWin = isWin;
            		//平板报错修正 return前执行
            		this.rpt = new FastReport(true);
            		if(!isWin) return;
            		//初始化连接设备管理器配置
            		var cfg = {
            			location:"ws://127.0.0.1:5414", //TODO 连接设备的location地址
            			initCallBack:function(){
            				//发送给设备管理器contenxPath ,记得最后一个字符是 "/" !!
//            				me.rpt.init("http://localhost:8080/saas/");
            				//加载打印机列表
            				me.rpt.printerlist(function(result){
            					$rootScope.printers=[];
            					var printers = result.message.list;
        						for (var i in printers) {
        							var data = {
                							"id":"",
                							"name":""
                					};
        							data.id = i;
        							data.name = printers[i];
        							$rootScope.printers.push(data);
        							console.log(data);
        						};
            				});
            			},
            		};
            		//传入cfg
            		TDevices.initWS(cfg);
            		TDevices.report = this.rpt;
                },
                
                printjb:function(){
                	var printinfo = {
            				"fileid" : 1,
            				"exporttype" : 1,
	            			"printer" : "report",
	            			"printcnt": 1,
            				"DS1" :[
            			{ID:"981",dataPackType:1,dataDate:1409529600,createDate:1410798366,uploadDate:1410798381, autoUploadFlg :1, uploadFlg :1, dataPackFileName :"1_20140915162555390_1.mdp.zip"},
            			{ID:"982",dataPackType:1,dataDate:1409616000,createDate:1410798367,uploadDate:1410798389, autoUploadFlg :1, uploadFlg :1, dataPackFileName :"1_20140915162556640_1.mdp.zip"},
            			{ID:"983",dataPackType :1, dataDate :1409702400, createDate :1410798369, uploadDate :1410798394, autoUploadFlg :1, uploadFlg :1, dataPackFileName :"1_20140915162557734_1.mdp.zip"}
            					]
            			};

                	TDevices.report.print(printinfo);
            		alert(22222);
                },
                
 /**
  * 初始化设备
  */               
                init:function()
                {
                	
                }
            }
        }]);
});
