'use strict';
import React from 'react';
import Engine from './Engine'; //  引擎 
import Store from './Store'; //  引擎 
import ShowAllFilter from './filter/ShowAllFilter'; //  过滤器1，显示所有
import ExtFilter from './filter/ExtFilter'; //  过滤器1，显示所有
import { browserHistory, Link } from 'react-router';
//  import BuyDo from '../../myReport/mixins';
import { listNoCompany, drawNum, permissionTips, hideOneLevelOnlyNode, showOrHideArrNode } from './FunApi';

window.tanXunCallBack = function (objs) {
    // 
    var arr = !localStorage.getItem('higgs_tanxun') ? [] : localStorage.getItem('higgs_tanxun').split('#');
    var shtml = '';

    if (objs !== null) {
        var json = { name: objs.name, qyxxid: objs.qyxxid };
        arr.push(JSON.stringify(json));
    }

    //  获取当前缓存
    arr = _.uniq(arr); //  去重

    // 拼接字符串
    for (var i = 0; i < arr.length; i++) {
        var obj = JSON.parse(arr[i]);
        shtml += ('<li data-name=' + obj.name + ' data-qyxxId=' + obj.qyxxid + '>' + obj.name + '<a class="iconfont icon-close"></a></li>')
    }
    localStorage.setItem('higgs_tanxun', arr.join('#'));
    if (listNoCompany(shtml, '未添加探寻企业')) {
        shtml = listNoCompany(shtml, '未添加探寻企业');
    }
    $('#tanxunList').html(shtml);
}

// 传入name，高亮关系
function hightLightNodesAndLinks(name, MapSvg) {
    // console.log("渲染高亮！！！！！")
    var $MapSvg = $("#" + MapSvg);
    $MapSvg.attr('class', 'hideAll');

    var notcls = '[data-yinzi],[data-type="mark"],[data-ohide="hide"],[data-ihide]';
    var notcls2 = '[data-yinzi],[data-ihide]';

    // console.time('1');
    $MapSvg.find("image[data-name='" + name + "']").not(notcls).attr('class', 'show');
    $MapSvg.find("text[data-name='" + name + "']").not(notcls2).attr('class', 'show');


    var arr = [];
    // console.time('2');
    // 显示一度的线和点
    $MapSvg.find("line[data-target='" + name + "']").not(notcls2).attr('class', 'show').each(function (index, el) {
        // 显示当前直接关联的线上文字
        $MapSvg.find("text[data-target-name='" + name + "'][data-source-name='" + $(this).attr('data-source') + "']").closest('g').not(notcls2).attr('class', 'show');

        // 显示对应的点
        $MapSvg.find("image[data-name='" + $(this).data("source") + "']").not(notcls).attr('class', 'show');
        $MapSvg.find("text[data-name='" + $(this).data("source") + "']").not(notcls2).attr('class', 'show');
        arr.push($(this).data("source"));
    });
    // console.timeEnd('2');

    // console.time('3');
    // 显示一度的线和点
    $MapSvg.find("line[data-source='" + name + "']").not(notcls2).attr('class', 'show').each(function (index, el) {

        // 显示当前直接关联的线上文字
        $MapSvg.find("text[data-target-name='" + $(this).attr('data-target') + "'][data-source-name='" + name + "']").closest('g').not(notcls2).attr('class', 'show');

        // 显示对应的点
        $MapSvg.find("image[data-name='" + $(this).data("target") + "']").not(notcls).attr('class', 'show');
        $MapSvg.find("text[data-name='" + $(this).data("target") + "']").not(notcls2).attr('class', 'show');
        arr.push($(this).data("target"));
    });
    // console.timeEnd('3');
    // console.log(arr);

    // console.time('4');
    // 如果二度有交叉连线，在这里处理
    $("#" + MapSvg).find('line').not('[class="show"]').each(function (index, el) {
        var source = $(this).attr('data-source');
        var target = $(this).attr('data-target');
        if (_.indexOf(arr, source) != -1 && _.indexOf(arr, target) != -1) {
            $(this).attr('class', 'show');
        }
    });
    //  for(var i=0,len=arr.length; i< len; i++){
    //  	for(var j=0; j< len; j++){
    //  		var $line = $MapSvg.find("line[data-target='"+arr[i]+"'][data-source='"+arr[j]+"']");
    //  		if($line[0]){
    //  			$line.not('[data-yinzi]').attr('class','show');
    //  			$MapSvg.find("text[data-target-name='"+arr[i]+"'][data-source-name='"+arr[j]+"']").closest('g').not('[data-yinzi]').attr('class','show');
    //  		}
    //  	}
    //  }
    // console.timeEnd('1');
}

// 取消高亮
function cancelHightLight(MapSvg) {
    var $MapSvg = $("#" + MapSvg);
    $MapSvg.removeAttr('class');
    $MapSvg.find('.show').removeAttr('class');
}
// 取消高亮2
// cancelHightLight2();
function cancelHightLight2() {
    $("#Map3").off("click").on("click", function () {
        if (!window.dragState) {
            $("#Map3").hide();
        }
        window.dragState = false;
    })
}



// 加入历史记录
function addHositryView(name, str) {
    if (str == 'clickHositryView') {

    } else {
        var $hositryView = $("#hositryView");
        $hositryView.find(".on").removeClass('on');
        $hositryView.append('<li class="item on">' + name + '</li>')
    }
}

// 将选中的 因子 封装成新的obj - 重绘
function domToNewObjYinZi() {

    var $MapSvg = $("#MapSvg");
    var newNodes = [];
    var newLinks = [];

    // 通过name,获取到所有一度子连线
    $MapSvg.find("line").not('[data-yinzi]').each(function (index, el) {
        var obj = new Object();
        var $this = $(this);
        obj['guanlian'] = $this.attr('data-guanlian');
        obj['source'] = $this.attr('data-source');
        obj['target'] = $this.attr('data-target');
        obj['line'] = $this.attr('data-line');
        newLinks.push(obj);
    });

    $MapSvg.find("image").not('[data-yinzi]').each(function (index, el) {
        var image = $(this)
        var obj = new Object();
        obj['symbol'] = image.attr('data-type');
        obj['color'] = image.attr('data-color');
        obj['children'] = {};
        obj['children']['len'] = image.attr("data-len");
        obj['name'] = image.attr('data-name');
        obj['cname'] = image.attr('data-cname');

        if (image.closest('.g_addnodes')[0]) {
            obj['category'] = 3;
            obj['addnodes'] = true;
        } else {
            obj['category'] = image.attr('data-category');
        }

        newNodes.push(obj);
    });

    // console.log(newNodes.length,Store.iniData.obj[Store.company])
    if (newNodes.length == 1) {
        // console.log(Store.iniData.obj[Store.company])
        // 加入圆点
        newNodes.push(Store.iniData.obj[Store.company]);
    }

    // newNodes = _.uniq(newNodes);
    // 去重
    var newArr = [], hash = {};
    for (var i = 0; i < newNodes.length; i++) {
        if (!hash[newNodes[i].name]) {
            hash[newNodes[i].name] = true;
            newArr.push(newNodes[i]);
        }
    }
    hash = null;
    // newNodes = newArr; // 

    var $map = $("#Map2");
    $map.html("");
    Engine(
        ShowAllFilter({ nodes: newArr, links: newLinks }),
        {
            x0: $map.width() / 2, // 中点坐标
            y0: $map.height() / 2,
            svgId: "Map2",// 最外层DIV的id
            MapSvg: "MapSvg2", // 最外层SVG的id
            hoverDo: true,
            clickDo: true, // 底层的点击事件，必须锁住
            interval: 100,
            type: 'default'// 类型 - 点击后的弹窗
        });
    $map.show();
}

// 将选中的值封装成新的obj - 重绘
function domToNewObj(name, MapSvg) {

    $(document).trigger('click')
    $("#MapSvg").find('image[name="' + name + '"]').trigger('click');

    var $MapSvg = $("#" + MapSvg);
    var newNodes = [];
    var newLinks = [];
    var mark = false;

    // 通过name,获取到所有一度子连线
    $MapSvg.find("line").each(function (index, el) {
        var obj = new Object();
        var $this = $(this);
        obj['guanlian'] = $this.attr('data-guanlian');
        obj['source'] = $this.attr('data-source');
        obj['target'] = $this.attr('data-target');
        obj['line'] = $this.attr('data-line');
        newLinks.push(obj);
    });

    $MapSvg.find("image").each(function (index, el) {
        var image = $(this)
        var obj = new Object();
        obj['symbol'] = image.attr('data-type');
        obj['color'] = image.attr('data-color');
        obj['children'] = {};
        obj['children']['len'] = image.attr("data-len");
        obj['name'] = image.attr('data-name');
        obj['cname'] = image.attr('data-cname');
        obj['category'] = image.attr('data-category');
        newNodes.push(obj);
    });

    var $map = $("#Map2");
    $map.html("");
    Engine(
        ShowAllFilter({ nodes: newNodes, links: newLinks }),
        {
            x0: $map.width() / 2, // 中点坐标
            y0: $map.height() / 2,
            svgId: "Map2",// 最外层DIV的id
            MapSvg: "MapSvg2", // 最外层SVG的id
            hoverDo: true,
            clickDo: true, // 底层的点击事件，必须锁住
            interval: 200,
            type: 'default'// 类型 - 点击后的弹窗
        });
    $map.show();
}

// 将选中的值封装成新的obj - 点击节点触发
function domToNewObjClick(name, MapSvg, cname, type) {

    MapSvg = MapSvg || 'MapSvg';

    var dragState = '';
    if(type === 'rect'){
        let param = {
            name: name,
            cname: cname
        };
        $(document).trigger('selectNode', param);
    }else{
        $('#mapPop').hide();
    }
    var $MapSvg = $("#" + MapSvg);
    var newNodes = [];
    var newLinks = [];
    var mark = false;

    var pushNewNodes = function ($this) {
        var _name = $this.attr("data-name");
        var obj = new Object();
        var pypx = -$this.attr('width') / 2; // 微调偏移量 。 方块width/2

        obj['symbol'] = $this.attr('data-type');
        obj['color'] = $this.attr('data-color');
        obj['x'] = $this.attr('x') - pypx;
        obj['y'] = $this.attr('y') - pypx;
        obj['children'] = {};
        obj['children']['len'] = $this.attr("data-len");
        obj['name'] = _name;
        obj['cname'] = $this.attr("data-cname");
        obj['category'] = (_name == name ? 0 : 1);
        newNodes.push(obj);
    }

    // 单独加入中心节点
    // pushNewNodes($MapSvg.find("image[data-name='"+name+"']").eq(0));

    // console.log(name)
    $MapSvg.find("image.show").not('[data-ohide="hide"]').each(function (index, el) {

        pushNewNodes($(this));
    });
    $MapSvg.find("line.show").not('[data-hide="hide"]').each(function (index, el) {
        var obj = new Object();
        var $this = $(this);
        var pypx = -$(this).attr('width') / 2; // 微调偏移量 。 方块width/2

        // console.log(pypx)

        obj['guanlian'] = $this.attr('data-guanlian');
        obj['source'] = $this.attr('data-source');
        obj['target'] = $this.attr('data-target');
        obj['line'] = $this.attr('data-line');
        obj['x1'] = $this.attr('x1') - pypx;
        obj['y1'] = $this.attr('y1') - pypx;
        obj['x2'] = $this.attr('x2') - pypx;
        obj['y2'] = $this.attr('y2') - pypx;
        newLinks.push(obj);
    });

    // 因为会生成两个category 0的节点，这里要去重一个
    var objs = {};
    var newNodesUnqi = [];
    for (var i = 0; i < newNodes.length; i++) {
        if (!objs[newNodes[i].name]) {
            objs[newNodes[i].name] = true;
            newNodesUnqi.push(newNodes[i]);
        }
    }
    pushNewNodes = null;
    objs = null;

    var $map = $("#Map3");
    $map.html("");
    // console.log({nodes : newNodes, links : newLinks })
    Engine(
        ShowAllFilter({ nodes: newNodesUnqi, links: newLinks }),
        {
            svgId: "Map3",// 最外层DIV的id
            MapSvg: "MapSvg3", // 最外层SVG的id
            hoverDo: false,
            clickDo: false, // 底层的点击事件，必须锁住
            type: 'clickShow'// 类型 - 点击后的弹窗
        });
    window.dragState = false;
    $map.show();

    $(document).off('click.showmap3').on('click.showmap3', function (e) {
        if($(e.target).hasClass('highSvg')){
             return false;
        }
        // console.error($(e.target).closest('.shortcut-key')[0]);
        if (!$(e.target).closest('.g_box')[0] && !$(e.target).closest('.shortcut-key')[0] && !$(e.target).hasClass('highSvg')) {
            $('#Map3').hide();
            $('#mapPop').hide();
            cancelHightLight2();
            // $("#"+MapSvg).trigger('click');

        } else {
            cancelHightLight2();
        }
    });

}

// 全局暴露
window.heightLight = function(name) {
    console.info('55555', name);
    $('#MapSvg').find('image[data-name="' + name + '"]').trigger('mouseenter').trigger('click').trigger('mouseout');
};

var hoverLock = false;
var thisName = '';
const Event = {
    // hover 事件
    hoverEvent(MapSvg) {

        $("#" + MapSvg).off('mouseenter.imageHover' + MapSvg).on('mouseenter.imageHover' + MapSvg, 'image:not([data-yinzi])', function (e) {
            e.preventDefault();
            if ($(this).attr("data-ohide") === 'hide') {
                return
            }
            var name = $(this).data("name");
            hightLightNodesAndLinks(name, MapSvg);
        }).off('mouseout.imageLeave').on('mouseout.imageLeave', 'image', function (e) {
            e.preventDefault();
            cancelHightLight(MapSvg);
        });
    },

    // 重绘图谱
    reRenderMap(yinzi) {

        $('#Map3').hide();
        if (!yinzi && $("#Map2").is(":hidden")) {
            // 封装成obj // 
            domToNewObj(Store.companyLeftName, 'MapSvg3');
        } else {
            domToNewObjYinZi();
        }
    },

    // 点击图片高亮，变化零时目标节点
    clickEvent(MapSvg) {
        $("#" + MapSvg).off('click.mouseLeftBtn').on('click.mouseLeftBtn', function (event, str) {
            let e = event;
            e.preventDefault();
            // 操作器隐藏
            $("#nodes-dailog").hide();
            var name = $(e.target).data("name");
            var cname = $(e.target).data("cname");
            var type = $(e.target).data("type");
            
            // 鼠标左键，记录当前目标节点，供重绘使用
            Store.companyLeftName = name;

            // console.log(e.target.nodeName)
            if (e.target.nodeName == 'image') {
                domToNewObjClick(name, MapSvg, cname, type);
                hoverLock = true;
                // 侧面联动
                if (location.href.indexOf('relateInfo') != -1) {
                    updateRelationList(cname, name);
                }
            } else {
                $('.hideAll').removeClass('class');
                $("#activeMapList").hide();
                $("#activeMapListAll").show();
                $("#nodes-dailog").hide();
                hoverLock = false;
            }
            thisName = name;
        });
    },

    // 二度连续展开
    //  triggerClick(){
    //  	var _this = this;
    //  	$("#Map2").off('click.triggerClick').on('click.triggerClick','image', function(e) {
    //  		e.preventDefault();
    //  		var name = $(this).data("name");
    //  		console.log(name);
    //  		Store.companyLeftName = name;
    //  		_this.reRenderMap('reload');
    //  		//  $("#Map2").trigger('click'); 
    //  		//  hightLightNodesAndLinks(name,'MapSvg'); 
    //  		//  $("#Map").find("image[data-name='"+name+"']").trigger('click');
    //  	});
    //  },

    // 还原查看记录
    clickHositryView() {
        var $hositryView = $("#hositryView");
        $hositryView.off('click.hositryView').on('click.hositryView', '.item', function (e) {
            e.preventDefault();
            $(this).siblings('.item').removeClass('on');
            $(this).addClass('on');
            var name = $(this).html();
            $("#Map2").trigger('click');
            $("#Map").find('image[data-name="' + name + '"]').trigger('click', 'clickHositryView');
        });
    },

    // 窗口大小变化
    resizeWindow(MapSvg) {
        $(window).resize(function (event) {
            var $activeMap = $(".activeMap-canvas");
            var width = $activeMap.width();
            var height = $activeMap.height();
            $("#" + MapSvg).attr("width", width).attr("height", height);
        });
    },

    // 拖拽
    drag(MapSvg) {
        var $MapSvg = $("#" + MapSvg);
        var $g_box = $MapSvg.find('.g_box');
        $MapSvg.off('mousedown.drag').on('mousedown.drag', function (ed) {
            ed.preventDefault();
            var x0 = ed.pageX;
            var y0 = ed.pageY;
            var tx, ty, scale;
            var str = $g_box.attr("transform") == undefined ? [0, 0, 1] : $g_box.attr("transform").replace(/(translate\(|\)scale\(|\))/g, ",").split(",");
            tx = str[1];
            ty = str[2];
            scale = (str[3] == undefined ? 1 : str[3]);
            $(document).on('mousemove.drag', function (em) {
                em.preventDefault();
                var xm = em.pageX - x0;
                var ym = em.pageY - y0;
                $g_box.attr("transform", "translate(" + (xm + parseInt(tx, 10)) + "," + (ym + parseInt(ty, 10)) + ")scale(" + scale + ")");
            }).on('mouseup.drag', function (eu) {
                hoverLock = true;
                eu.preventDefault();
                $(document).off("mousemove.drag").off("mouseup.drag");
            });
        });
    },

    // 鼠标右键监听
    mouseRight() {
        document.oncontextmenu = function (e) {
            if (window.event) e = window.event;
            if (e.target.tagName == 'image') {
                var $target = $(e.target);
                var rwid = 150 // 圈宽度

                if ($target.closest("#Map2")[0] || $target.closest("#Map4")[0] || $target.closest("#Map5")[0]) {
                    return false;
                }

                var name = $target.attr('data-name');
                var type = $target.attr('data-type');

                // 获取map1 下面的 节点对象
                $target = $('#MapSvg').find('image[data-name="' + name + '"]');

                // 设置值
                Store.extDom = {
                    name: name,
                    target: $target,
                    r: parseInt($target.attr('width'), 10)
                }

                // 恢复按钮
                if ($target.attr("data-ohide") == 'hide') {
                    $("#nodes-hide").html('恢复');
                } else {
                    $("#nodes-hide").html('删除');
                }

                // 扩展，收起按钮
                if ($target.attr("data-ext") != 'true') {
                    $("#nodes-ext").html('扩展');
                } else {
                    $("#nodes-ext").html('收起');
                }

                //  // 0，1度默认是收起
                //  if( !$target.attr('data-ext') && parseInt($target.attr('data-category'), 10) < 2){
                //  	// $("#nodes-ext").addClass('nodesExtHide');
                //  	$("#nodes-ext").html('收起');
                //  }

                // 标记，收起按钮
                if ($target.attr("data-mark") != 'true') {
                    $("#nodes-mark").html('标记');
                } else {
                    $("#nodes-mark").html('取消');
                }

                // 如果是人。不显示详情
                if (type == 'circle') {
                    $('#nodes-detail').addClass('nodesExtHide');
                    $('#nodes-tanxun').addClass('nodesExtHide');
                } else {
                    $('#nodes-detail').removeClass('nodesExtHide');
                    $('#nodes-tanxun').removeClass('nodesExtHide');
                }

                // 设置当前选中的名称
                Store.companyRightName = name;
                Store.companyRightCname = $target.attr('data-cname');
                // 设置当前显示的对象
                Store.showMap = $("#Map2").is(':hidden') ? 1 : 2;

                // 展开操作
                var x = $target.offset().left;
                var y = $target.offset().top;
                var r = parseInt($target.attr("width"), 10);
                // console.log(x,y,r)
                $("#nodes-dailog").removeClass('nodes-btn-animate').hide(0).css({
                    left: x - rwid + r / 2,
                    top: y - rwid + r / 2
                }).show(0).addClass('nodes-btn-animate');
            }

            return true;// 这个是阻止浏览器默认的右键菜单
        }
    },

    // 取消路径高亮
    cancelnodesPath() {
        $("#Map").off("click").on("click", function () {
            // $(".g_box").hide();
            $("#Map").removeClass("hidePath");
        })
    },

    // 删除 隐藏-恢复节点
    hideNodes() {
        $("#nodes-hide").off('click.nodeHide').on('click.nodeHide', function (e) {

            if (!permissionTips('higgs-node-right-click-operation-delete', '没有权限！')) {
                return
            }

            // 如果标记了选项为 nodesExtHide ，不可操作
            if (this.className.indexOf('nodesExtHide') != -1) return

            e.preventDefault();
            var name = Store.companyRightName;
            var $MapSvg = $('#MapSvg');

            // 操作器隐藏
            $("#nodes-dailog").hide();

            // 删除隐藏节点的子节点
            var hideAndShowChild = function (id, mark) {
                var len = $MapSvg.find('line[data-source="' + id + '"]').length + $MapSvg.find('line[data-target="' + id + '"]').length;
                if (len == 1) {
                    if (mark == 'hide') {
                        $MapSvg.find('image[data-name="' + id + '"]').attr("data-hide", "hide");
                        $MapSvg.find('text[data-name="' + id + '"]').attr("data-hide", "hide");
                    } else {
                        $MapSvg.find('image[data-name="' + id + '"]').removeAttr("data-hide");
                        $MapSvg.find('text[data-name="' + id + '"]').removeAttr("data-hide");
                    }
                }
            }

            // 点击删除
            if ($(this).attr('data-mark') == 'hide') {
                // 删除该节点
                var $img = $MapSvg.find('image[data-name="' + name + '"]').not('[data-type="mark"]');
                $img.attr("data-ohide", "hide");

                // 设置 url
                var href = $img.attr('href');
                if (href.indexOf('extnodes') == -1) {
                    $img.attr('data-ohref', href);
                }
                $img.attr('href', '/static/map/images/extnodes.svg');

                // 删除该节点的线
                var $source = $MapSvg.find('line[data-source="' + name + '"]');
                var $target = $MapSvg.find('line[data-target="' + name + '"]');
                $source.attr("data-hide", "hide");
                $target.attr("data-hide", "hide");

                //  // 相对原点的线不能删除
                //  var showPoint = function(id){

                //  }

                // 删除该节点下面的单点
                $source.each(function (index, el) {
                    var id = $(this).attr('data-target');
                    // 通过ID寻找出对应的点
                    hideAndShowChild(id, 'hide');
                });
                $target.each(function (index, el) {
                    var id = $(this).attr('data-source');
                    hideAndShowChild(id, 'hide');
                });
                $(this).html('恢复').attr('data-mark', 'show');

                // showPoint = null;
            } else {
                // 显示该节点
                var $img = $MapSvg.find('image[data-name="' + name + '"]').not('[data-type="mark"]');
                $img.removeAttr("data-ohide");

                // 设置URL
                var url = $img.attr('data-ohref');
                $img.attr('href', url);

                // 显示该节点的线
                var $source = $MapSvg.find('line[data-source="' + name + '"]');
                var $target = $MapSvg.find('line[data-target="' + name + '"]');
                $source.removeAttr("data-hide");
                $target.removeAttr("data-hide");

                // 显示该节点下面的单点
                $source.each(function (index, el) {
                    var id = $(this).attr('data-target');
                    // 通过ID寻找出对应的点
                    hideAndShowChild(id, 'show');
                });
                $target.each(function (index, el) {
                    var id = $(this).attr('data-source');
                    hideAndShowChild(id, 'show');
                });
                $(this).html('删除').attr('data-mark', 'hide');
            }

            hideAndShowChild = null;

        });
    },

    // 扩展节点
    nodesExt() {
        $("#nodes-ext").off('click.extNode').on('click.extNode', function (e) {

            if (!permissionTips('higgs-node-right-click-operation-extend', '没有权限！')) {
                return
            }

            if (this.className.indexOf('nodesExtHide') != -1) return
            e.preventDefault();
            var $this = $(this);
            var $map = $("#Map");
            var name = Store.companyRightName;
            var $imgs = $map.find('.g_nodes_0,.g_nodes_1').find('image[data-name="' + name + '"]');
            // console.log(name)

            // 操作器隐藏
            $("#nodes-dailog").hide();
            if ($this.text() == '扩展') {

                // 0,1度扩展
                if ($imgs[0]) {
                    $imgs.each(function (index, el) {
                        $(this).attr('data-ext', 'true')
                    });
                    hideOneLevelOnlyNode(name, 'show');
                    return
                }

                // 2+度扩展
                $this.html('收起');
                $.ajax({
                    url: ROOT + '/relation/subGraph.htm',
                    data: {
                        date: '',
                        qyxxId: name,
                        degree: 1
                    },
                    dataType: 'json',
                    success: function (res) {
                        // data = data.responseJSON;
                        if (res.success) {

                            if (res.data.nodes.length == 0) {
                                Tip.err('无扩展节点');
                                return
                            }

                            var data = res.data;
                            var $map = $("#Map");
                            var $img = Store.extDom.target;
                            var $img0 = $map.find('image[data-category="0"]');

                            // 初始化extR - 每层相隔50像素
                            if (!Store.extR) {
                                Store.extR = parseInt(Store.rmax, 10) + 100;
                            } else {
                                Store.extR += 60;
                            }

                            data = ExtFilter.ExtFilter(data);
                            // 计算X,Y的点，寻找最优位子
                            // 圆点 (x0,y0) 当前点的位子：(x1,y1)
                            var r = Store.extDom.r; // 获取当前扩展对象的半径
                            var x0 = parseInt($img0.attr('x'), 10),
                                y0 = parseInt($img0.attr('y'), 10),
                                x1 = parseInt($img.attr('x'), 10),
                                y1 = parseInt($img.attr('y'), 10);
                            var y = y0 - (y0 - y1) / (Store.rmax / Store.extR);
                            var x = x0 - (x0 - x1) / (Store.rmax / Store.extR);
                            var conf = {
                                x0: x1 + r / 2,
                                y0: y1 + r / 2,
                                newPoint: {
                                    x: parseInt(x, 10),
                                    y: parseInt(y, 10),
                                    R: Store.extR,
                                    x0: x0,
                                    y0: y0
                                },
                                type: 'addNodes',// 类型 - 添加节点
                                callback: function () {
                                    // 绘制数字
                                    drawNum(data);
                                    // 设置总数
                                    setAllNodesCount();
                                }
                            }

                            // console.log(conf);

                            // 绘制
                            Engine(data, conf);
                        }// end if
                        else {
                            Tip.error(res.msg)
                        }
                    }
                });
            } else {// 收起回去 - 这里需要修改~
                $this.html('扩展');
                // var map = d3.select("#Map")

                // 收起分两个情况。1、扩展出来的收起，2、01度的收起

                // 0,1度的收起
                if ($imgs[0]) {
                    $imgs.each(function (index, el) {
                        $(this).attr('data-ext', 'false')
                    });
                    hideOneLevelOnlyNode(name, 'hide');
                    return
                }

                // 扩展的收起
                var $img = $map.find('.g_addnodes').find('image[data-name="' + name + '"][data-ext="true"]');
                var $addnodes = $img.closest('.g_addnodes');

                $map.find('image[data-name="' + name + '"][data-ext="true"]').removeAttr('data-ext')

                if ($('[data-ext="true"]').length == 1) {
                    Store.extR = null;
                } else {
                    Store.extR = parseInt($img.attr('data-extr'), 10) - 60;
                }

                // 判断下面是否还有展开 - 如果有，收起来~
                //  			$addnodes.find('.g_addnodes_nodes_1').find('image').each(function(index, el) {
                //  	var _name = $(this).attr('data-name');
                //  	var $image = $map.find('image[data-name="'+_name+'"][data-ext="true"]');
                //  	if($image.length > 0){
                //  		$image.closest('.g_addnodes').remove();
                //  	}
                //  });
                // 对应的数字也删除
                var $nums = $('#Map').find('.g_nums');
                $addnodes.find('.g_addnodes_nodes_1').find('image').each(function (index, el) {
                    // 此处不严谨，将来一定会修改
                    $nums.find('[data-name="' + $(this).attr('data-name') + '"]').remove();
                })

                $addnodes.remove();
                setAllNodesCount();
                // $map.find('image[data-name="'+name+'"][data-ext="true"]').removeAttr('data-ext')
            }

        });
    },

    // 路径
    nodesPath() {
        $("#nodes-path").off('click.nodesPath').on('click.nodesPath', function (e) {

            if (!permissionTips('higgs-node-right-click-operation-route', '没有权限！')) {
                return
            }

            if (this.className.indexOf('nodesExtHide') != -1) return
            e.preventDefault();

            var $Map = $('#Map');
            var $start = $Map.find('image[data-name="' + Store.companyRightName + '"]')
            var $end = $Map.find('image[data-name="' + Store.company + '"]')

            // 请求路径
            $.ajax({
                url: ROOT + '/relation/path.htm',
                type: 'get',
                dataType: 'json',
                data: {
                    end: Store.company,// 	结束结点唯一id	string	
                    endSymbol: $end.attr('data-type'),// 	结束结点的形状	string	
                    start: Store.companyRightName,// 	开始结点唯一id	string	
                    startSymbol: $start.attr('data-type')// 	开始节点的形状	string
                },
                success: function (res) {
                    // console.log(res);
                    if (res.success) {
                        var arr = _.pluck(res.data.nodes, 'name');
                        // mantou
                        showOrHideArrNode(arr, $('#Map'), 'show');
                    } else {
                        Tip.err(res.msg);
                    }
                }
            });

            // alert()
            $('#nodes-dailog').hide()
        });
    },

    // 详情
    nodesDetail() {
        $("#nodes-detail").off('click.nodesDetail').on('click.nodesDetail', function (e) {
            if (this.className.indexOf('nodesExtHide') != -1) return
            e.preventDefault();
            var $this = $(this);
            //  console.log('详情名称：',Store.companyRightName);
            //  console.log('详情名称：',Store.companyRightCname);
            BuyDo._buy(Store.companyRightName, Store.companyRightCname, null, function () {

                // 如果面板隐藏，触发显示
                if ($('.map-report').is(':hidden')) {
                    $('.toggle-show')[0].click();
                }
                // debugger;
                // browserHistory.push(location.pathname+'?companyName='+Store.companyRightCname+'&qyxxId='+Store.companyRightName);
                var obj = $('#company-info-basic');
                if (obj.length > 0) {
                    obj[0].click();
                }
                browserHistory.push('/map/company/basic?companyName=' + Store.companyRightCname + '&qyxxId=' + Store.companyRightName);
            });
            $('#nodes-dailog').hide()
        });
    },

    // 探寻
    nodesTanXun() {
        $("#nodes-tanxun").off('click.nodestanxun').on('click.nodestanxun', function (e) {

            if (!permissionTips('higgs-rf-search-relationship', '没有权限！')) {
                return
            }
            if (this.className.indexOf('nodesExtHide') != -1) return
            e.preventDefault();
            var $this = $(this);

            Tip.ok('已加入探寻列表！')

            tanXunCallBack({
                name: Store.companyRightCname,
                qyxxid: Store.companyRightName
            });
            $('#nodes-dailog').hide()
        });

        // 删除探寻
        $('#tanxunList').off('click').on('click', '.icon-close', function (e) {
            e.preventDefault();
            e.stopPropagation();
            var $this = $(this).closest('li');
            var name = $this.attr('data-name');
            var qyxxid = $this.attr('data-qyxxId');
            var arr = !localStorage.getItem('higgs_tanxun') ? [] : localStorage.getItem('higgs_tanxun').split('#');
            for (var i = 0; i < arr.length; i++) {
                var obj = JSON.parse(arr[i]);
                if (obj.qyxxid == qyxxid) {
                    arr.splice(i, 1);
                    break;
                }
            }
            // 拼接字符串
            var shtml = '';
            for (var i = 0; i < arr.length; i++) {
                var obj = JSON.parse(arr[i]);
                shtml += ('<li data-name=' + obj.name + ' data-qyxxId=' + obj.qyxxid + '>' + obj.name + '<a class="iconfont icon-close"></a></li>')
            }
            localStorage.setItem('higgs_tanxun', arr.join('#'));
            if (listNoCompany(shtml, '未添加探寻企业')) {
                shtml = listNoCompany(shtml, '未添加探寻企业');
            }
            $('#tanxunList').html(shtml);

        });
    },

    // 标记
    nodesMark() {
        $("#nodes-mark").off('click.nodesmark').on('click.nodesmark', function (e) {
            if (!permissionTips('higgs-node-right-click-operation-sign', '没有权限！')) {
                return
            }

            if (this.className.indexOf('nodesExtHide') != -1) return
            e.preventDefault();
            var $this = $(this);
            //  console.log('标记名称：',Store.companyRightName);
            //  console.log('标记名称：',Store.companyRightCname);

            // 标记符号
            var $elem = $('#MapSvg').find('image[data-name="' + Store.companyRightName + '"]');
            var mark = $elem.attr('data-mark');
            if (mark == 'true') {
                $elem.removeAttr('data-mark')
            } else {
                $elem.attr('data-mark', 'true');
            }

            // 取消标记
            if ($this.text() == '取消') {
                $('.mark_' + $elem.attr('data-name')).remove();
                var _thisDomId = $elem.attr('data-name');// 当前要取消标记的id

                var markArr = !localStorage.getItem('higgs_had_mark') ? [] : localStorage.getItem('higgs_had_mark').split('#');// 标记数据数组
                for (var i = 0; i < markArr.length; i++) {
                    var obj = JSON.parse(markArr[i]);
                    if (obj.qyxxid == _thisDomId || _thisDomId == "undefined") {
                        markArr.splice(i, 1);
                        break;
                    }
                }

                // 拼接字符串
                var shtml = '';
                for (var i = 0; i < markArr.length; i++) {
                    var obj = JSON.parse(markArr[i]);
                    shtml += ('<li data-name=' + obj.name + ' data-qyxxId=' + obj.qyxxid + '>' + obj.name + '<a class="iconfont icon-close"></a></li>')
                }
                localStorage.setItem('higgs_had_mark', markArr.join('#'));
                if (listNoCompany(shtml, '暂无标记节点')) {
                    shtml = listNoCompany(shtml, '暂无标记节点');
                }
                $('#hadMark').html(shtml);
            } else {
                var data = [{
                    r: 20,
                    name: $elem.attr('data-name'),
                    cname: $elem.attr('data-cname'),
                    x: parseInt($elem.attr('x'), 10) + 10,
                    y: $elem.attr('y') - 10,
                    category: $elem.attr('data-category')
                }]

                // 添加标记符号
                var g_mark = d3.select("#MapSvg").select('.g_mark')
                g_mark = g_mark.append("g").attr('class', 'mark_' + data[0].name);
                g_mark.selectAll('image').data(data).enter().append("image")
                    .attr("width", function (d) {
                        return d.r;
                    })
                    .attr("height", function (d) {
                        return d.r;
                    })
                    .attr("data-name", function (d) {
                        return d.name;
                    })
                    .attr("data-type", function (d) {
                        return 'mark';
                    })
                    .attr("data-cname", function (d) {
                        return d.cname;
                    })
                    .attr("data-category", function (d) {
                        return d.category;
                    })
                    .attr("xlink:href", function (d) {
                        return ASSETS_PATH + '/images/mark.svg';
                    })
                    .attr('x', function (d) {
                        return d.x;
                    })
                    .attr('y', function (d) {
                        return d.y;
                    })

                // // // // // // // // // // // // // // // // // // // // // // // // // // // // // /
                // 历史查看
                var json = { name: Store.companyRightCname, qyxxid: Store.companyRightName },
                    arr = !localStorage.getItem('higgs_had_mark') ? [] : localStorage.getItem('higgs_had_mark').split('#'),
                    shtml = '';

                // 获取当前缓存
                arr.push(JSON.stringify(json));
                arr = _.uniq(arr); // 去重

                // 拼接字符串
                for (var i = 0; i < arr.length; i++) {
                    var obj = JSON.parse(arr[i]);
                    shtml += ('<li data-name=' + obj.name + ' data-qyxxId=' + obj.qyxxid + '>' + obj.name + '<a class="iconfont icon-close"></a></li>')
                }
                localStorage.setItem('higgs_had_mark', arr.join('#'));
                $('#hadMark').html(shtml);

            }// end else

            // end 历史
            // // // // // // // // // // // // // // // // // // // // // // // // // // // // // /
            $('#nodes-dailog').hide()
        });

        // 删除标记
        $('#hadMark').on('click', '.icon-close', function (e) {
            e.preventDefault();
            e.stopPropagation();
            var $this = $(this).closest('li');
            var name = $this.attr('data-name') || '';
            var qyxxid = $this.attr('data-qyxxId') || '';
            var arr = !localStorage.getItem('higgs_had_mark') ? [] : localStorage.getItem('higgs_had_mark').split('#');
            for (var i = 0; i < arr.length; i++) {
                var obj = JSON.parse(arr[i]);
                if (obj.qyxxid == qyxxid || qyxxid == "undefined") {
                    arr.splice(i, 1);
                    break;
                }
            }

            // 删除svg
            // console.warn('.mark_'+qyxxid)
            $('.mark_' + qyxxid).remove();
            $('#MapSvg').find('image[data-mark="true"]').removeAttr('data-mark')

            // 拼接字符串
            var shtml = '';
            for (var i = 0; i < arr.length; i++) {
                var obj = JSON.parse(arr[i]);
                shtml += ('<li data-name=' + obj.name + ' data-qyxxId=' + obj.qyxxid + '>' + obj.name + '<a class="iconfont icon-close"></a></li>')
            }
            localStorage.setItem('higgs_had_mark', arr.join('#'));
            if (listNoCompany(shtml, '暂无标记节点')) {
                shtml = listNoCompany(shtml, '暂无标记节点');
            }
            $('#hadMark').html(shtml);

        });

    },

    // 搜索
    searchMap() {
        $("#searchMap").off('keyup').on('keyup', function (e) {

        });
    },

    // 点击左侧list 
    relateinfoList() {
        $('#relateinfoList').on('click', 'tr', function (e) {
            e.preventDefault();

        });
    }

}

// window.domToNewObjClick = domToNewObjClick;

// 关于我们
export default Event;

// 点击高亮的方法给暴露出去
// export domToNewObjClick;