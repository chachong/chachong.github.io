!function() {
    var checkPaper=angular.module('checkPaper');

    //左侧菜单导航控制器
    checkPaper.controller('leftMenuCtl', ['$scope','$rootScope','$location','checkSystemService',function($scope,$rootScope,$location,checkSystemService) {
        //页面加载完毕
        $rootScope.$watch('$viewContentLoaded', function() {
            //高度自适应
            $rootScope.heightAdapter();
            //隐藏加载动画
            $("body>canvas").hide();
        });
    }]);

    checkPaper.service('systemCustomService', ['$http','checkSystemService',function ($http,checkSystemService) {
        var that=this;
        if(configObj){
            //直接获取js中定义的json对象
            that.webInfo = configObj.webInfo;
            that.checkSystems = configObj.checkSystems;
        }else{
            $http.get("json/config.json").success(function (data) {
                // console.log(JSON.stringify(data));
                that.webInfo = data.webInfo;
                that.checkSystems = data.checkSystems;
            }).error(function () {
            });
        }
        
        this.getCurrent= function (janeName) {
            if (!janeName) {
                janeName=checkSystemService.current().janeName;
            }
            if (janeName&&this.checkSystems) {
                return this.checkSystems[janeName];
            }
        };

    }]);
    
    checkPaper.run(['$rootScope','$window','$timeout','systemCustomService',function($rootScope,$window,$timeout,systemCustomService){
        $rootScope.systemCustomService=systemCustomService;

        $rootScope.heightAdapter=function (){
            //控制页面最小高度
            var contentMargin=$('.vp-content').outerHeight(true) - $('.vp-content').outerHeight();
            var minPageHeight=$(window).height()-$(".vp-navtop").outerHeight(true)-contentMargin;
            //中间主体内容的高度
            var mainHeight=$('.vp-content').outerHeight(true);
            $(".vp-content>.block-nav").css("min-height",minPageHeight<mainHeight?mainHeight:minPageHeight);
        }
        var w = angular.element($window);
        w.bind('resize', function(){
            $rootScope.heightAdapter();
        });
        $rootScope.$watch('step.index',function(){
            //切到订单结算后自适应
            if($rootScope.step&&$rootScope.step.index==2){
                $timeout(function () {
                    $rootScope.heightAdapter();
                }, 1000);
            }
        });
    }]);
}();

/**
 * 定义加入收藏夹函数
 * @param {*} siteUrl 
 * @param {*} siteName 
 */
function joinFavorite(siteUrl, siteName) {
    if(!siteUrl){
        siteUrl=window.location.href;
    }
    if(!siteName){
        siteName=document.title;
    }
    // console.log(siteUrl);
    // console.log(siteName);
    try{ 
        if (window.sidebar) { // For Mozilla Firefox Bookmark
            window.sidebar.addPanel(siteName, siteUrl,"");
        } else if( window.external || document.all) { // For IE Favorite
            window.external.addFavorite(siteUrl, siteName);
        } else { // for other browsers which does not support
            alert('请按 Ctrl+D 手动收藏!');
            return false;
        }
     }catch(e){          
        alert('浏览器不支持,请按 Ctrl+D 手动收藏!');
     }      
}