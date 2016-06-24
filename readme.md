# 简介
- 项目下下来后需要修改constants.js里面的servers常数，修改为本地的目录。
- 这是一个基于angularjs和requirejs的前端框架，正不断完善中。
- 整个项目为现在流行的局部刷新单页面应用。并实现按需加载js文件。
- 下面我将演示一个新增tab页面的操作
<!-- 样式的重用 -->
 - 这套前台系统都是通过接口与后台通讯的
 - 左边的tabs都是从后台的接口中读取的数据
 - 关于数据结构，可以参考 /src/testData/Init/getPages.do ,下面简要说一下数据的结构
第一级是 userInfo ，buttons ，page
这里面显示左边导航的就是用到page节点里面的数据page节点里面又有三个节点，后台管理，报表中心，交易系统，我们主要讨论后台管理节点里面的数据。
 - 后台管理里面有一个childtree，里面的内容，就是后台管理页面的左边的导航里面的所有的内容。
 - 我们在组件栏里面的增加一个tab，则在getPages.do里面增加数据。我们要在showname为 组件 的节点中childtree属性数组中增加一个tab的对象。
```
{
      "code": "10005",
      "showName": "组件",
      "fatherCode": "10001",
      "childTree": [
      	{
                  "code":"11016",
                  "showName":"测试增加tab",
                  "fatherCode":"10005",
                  "childTree":null,
                  "orderby":9,
                  "maxLevel": null,
                  "hasChildTree": 0,
                  "template": "newtab/newTabqwe.html",
                  "ctrl": "newtab/newTabqwe",
                  "img": "no",
                  "routing": null,
                  "keyCode": null,
                  "authority": null,
                  "type": 1,
                  "shortcutMenu": null
      	}...
```
- 然后下一步就是增加页面的html模版和controller文件了
增加 newTabqwe.html 和 newTabqwe.js 。
- 关于newTabqwe.js的结构也有一定的要求
```
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
``` 
html文件则没有什么要求
```
<div> 
      <div>
            {{ hello }}
      </div>
</div>      
```