define(function(require){
	var rtObj = {
		ctrl:"newtabCtrl",
		arrFunc:[
			"$scope",//在此引用模块
			function( $scope,$rootScope,register ){
				$scope.hello = "world1";
			}
		]
	};
	return rtObj;
});