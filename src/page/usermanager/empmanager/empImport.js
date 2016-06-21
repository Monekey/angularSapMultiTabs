/**
 * 批量导入模态框页面 
 * @version  v1.0
 * @createTime: 2016-06-13
 * @createAuthor sunrui
 * @updateHistory
 *
 *
 */
define(function( require ){
	
	require("src/page/usermanager/empmanager/sheetjs/js-xlsx/xlsx.js");
	
    var app = require( "app" );
    var angular = require("angular");
    app.ngAMDCtrlRegister.controller( "empImportCtrl",["$scope","ajaxService","getCookieService", "noticeEmps", "$uibModalInstance", 
                                                       function($scope,ajax,cookie,noticeEmps,$uibModalInstance){
    	/**
    	 * 浏览
    	 */
    	$scope.browse = function(file) {
    		$scope.file = file;
    	};
    	
    	/**
    	 * 确定导入
    	 */
    	$scope.import = function() {
    		
    		var xw_xfer = function (data, cb) {
        		var worker = new Worker("src/page/usermanager/empmanager/sheetjs/js-xlsx/xlsxworker2.js");
        		worker.onmessage = function(e) {
        			switch(e.data.t) {
        				case 'ready': break;
        				case 'e': console.error(e.data.d); break;
        				default: xx=ab2str(e.data).replace(/\n/g,"\\n").replace(/\r/g,"\\r"); cb(JSON.parse(xx)); break;
        			}
        		};
        		var val = s2ab(data);
    			worker.postMessage(val[1], [val[1]]);
        	}
        	
        	var s2ab = function (s) {
        		var b = new ArrayBuffer(s.length*2), v = new Uint16Array(b);
        		for (var i=0; i != s.length; ++i) v[i] = s.charCodeAt(i);
        		return [v, b];
        	}
        	
        	var ab2str = function (data) {
        		var o = "", l = 0, w = 10240;
        		for(; l<data.byteLength/w; ++l) o+=String.fromCharCode.apply(null,new Uint16Array(data.slice(l*w,l*w+w)));
        		o+=String.fromCharCode.apply(null, new Uint16Array(data.slice(l*w)));
        		return o;
        	}
        	
        	var to_csv = function to_csv(workbook) {
        		/*var result = [];
        		workbook.SheetNames.forEach(function(sheetName) {
        			var csv = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);
        			if(csv.length > 0){
        				result.push("SHEET: " + sheetName);
        				result.push("");
        				result.push(csv);
        			}
        		});
        		return result.join("\n");*/
        		var roa = null;
        		workbook.SheetNames.forEach(function(sheetName) {
        			roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
        		});
        		return roa;
        	}
        	
        	var process_wb = function (wb) {
        		var output = to_csv(wb);
        		var arr = []
        		for (var i=0; i<output.length; i++) {
        			var row = output[i];
        			var pe = row["手机/邮箱"];
        			var nm = row["姓名"];
        			arr[i] = [pe, nm];
        		}
        		$uibModalInstance.close(arr);
        	}
        	
    		var f = $scope.file;
    		var reader = new FileReader();
    		var name = f.name;
    		reader.onload = function(e) {
    			var data = e.target.result;
    			xw_xfer(data, process_wb);
    		};
    		reader.readAsBinaryString(f);
    		/////////////////////////
    	}
    	
        /**
         * 取消操作，关闭模态框
         */
        $scope.cancelRecipient = function(){
            $uibModalInstance.dismiss('cancel');
        };
    }]);
});