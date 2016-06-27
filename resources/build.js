({
    appDir: './',   //项目根目录
    dir: './dist',  //输出目录，全部文件打包后要放入的文件夹（如果没有会自动新建的）

    baseUrl: './page',   //相对于appDir，代表要查找js文件的起始文件夹，下文所有文件路径的定义都是基于这个baseUrl的

    modules: [					  //要优化的模块
        {
            name:'../app',
            /*exclude: [//要排除合并的模块
                "angular"
            ],*/
            insertRequire: ["../app"]
        }, 	//页面的入口文件，相对baseUrl的路径，也是省略后缀“.js”
        /*{
            name:'home/home',
            exclude: ['angular','ngAjaxService','publicService','getCookie','ui_bootstrap','ngAMD']
        }*/
    ],

    fileExclusionRegExp: /^(r|build)\.js|.*\.less$/,	//过滤，匹配到的文件将不会被输出到输出目录去

    optimizeCss: 'standard',

    removeCombined: true,   //如果为true，将从输出目录中删除已合并的文件

    //optimize: 'none',
    optimize: "uglify",
    uglify: {
        mangle: false  //false 不混淆变量名
    },
    findNestedDependencies: true,//合并第二层
    optimizeCss: 'standard',

    mainConfigFile: 'app.js'
})