'use strict';
import React from 'react';
import Store from './Store';
import {Tip} from 'mtui/index';
// import Tip from '../../myReport/Tip/Tip';

// 获取直接关联的点
// @param $Map：map对象
// @param type：rect / crile
// @param color：0~7 表示不同的因子
// @return nodes;
function aboutNodesFilter($Map, type, color) {
    // console.log(Store.oldData.obj)
    var nodes = {
        source: [], // 隐藏的直接点
        other: [] // 和隐藏相关的间接点
        // levels:[] // 存放other的度数
    };
    $Map = $('#Map');
    $Map.find('image[data-type="' + type + '"][data-color^="' + color + '"]').each(function (elem, index) {
        var id = $(this).attr('data-name');
        nodes.source.push(id);
        // 起点
        var $linet = $Map.find('line[data-target="' + id + '"]');
        $linet.each(function (elem, index) {
            var targetId = $(this).attr('data-source');
            if (targetId) {
                nodes.other.push(targetId);
                // nodes.levels.push(Store.oldData.obj[targetId].category);
            }
        });

        // 终点
        var $lines = $Map.find('line[data-source="' + id + '"]');
        $lines.each(function (elem, index) {
            var sourceId = $(this).attr('data-target');
            if (sourceId) {
                nodes.other.push(sourceId);
                // nodes.levels.push(Store.oldData.obj[sourceId].category)
            }
        });

    });
    nodes.other = _.uniq(nodes.other); // 去重
    // console.log('直接关联的点：',nodes);
    return nodes;
}

// 隐藏点，线，文字
// @param $dom: 目标对象
// @param className: 0~7 表示不同的因子
function yinziAttr($dom, className) {
    var attr = $dom.attr('data-yinzi');
    if (!attr) {
        $dom.attr('data-yinzi', className);
    } else {
        var arr = attr.split(',');
        arr.push(className);
        arr = _.uniq(arr);// 去重
        $dom.attr('data-yinzi', arr.join(','));
    }
}

// 隐藏图片。文字，线条
// @param $Map：map对象
// @param name：表示node ID , cname 表示节点的名字
// @param className: 0~7 表示不同的因子
function hideImageLineText($Map, name, className) {

    var $image = $Map.find('image[data-name="' + name + '"]'),
        $linet = $Map.find('line[data-target="' + name + '"]'),
        $lines = $Map.find('line[data-source="' + name + '"]'),
        $text = $Map.find('text[data-name="' + name + '"]'),
        $linetexts = $Map.find('[data-source-name="' + name + '"]'),
        $linetextt = $Map.find('[data-target-name="' + name + '"]');

    yinziAttr($image, className);
    yinziAttr($linet, className);
    yinziAttr($lines, className);
    yinziAttr($text, className);
    yinziAttr($linetexts, className);
    yinziAttr($linetextt, className);
}

// 隐藏文字，图片
// @param $Map：map对象
// @param name：表示node ID , cname 表示节点的名字
// @param className: 0~7 表示不同的因子
function hideImageText($Map, name, className) {

    var $image = $Map.find('image[data-name="' + name + '"]'),
        $text = $Map.find('text[data-name="' + name + '"]');

    yinziAttr($image, className);
    yinziAttr($text, className);
}

// 显示点，线，文字
// @param $Map：map对象
function showImageLineText($Map) {
    $Map.find('[data-ihide]').removeAttr('data-ihide');
    $Map.find('[data-yinzi]').removeAttr('data-yinzi');
}

// 隐藏，显示，核心
// @param $Map：map对象
// @param type：rect / crile
// @param color：颜色
// @param className: 0~7 表示不同的因子
function hideNodes($Map, type, color, className) {
    $Map = $('#Map');
    var nodes = aboutNodesFilter($Map, type, color);

    // 隐藏一度对对应的点
    for (var i = 0; i < nodes.source.length; i++) {
        hideImageLineText($Map, nodes.source[i], className);
    }

    // 采用排除法排除于2度无关联的点
    var white = []; // 白名单

    // 重新获取对象,更新缓存$
    $Map = $('#Map');

    // 将中点加入白名单
    white.push($Map.find('.g_nodes_0 image').attr('data-name'));

    // 存放二度白名单ID
    var arrId = [];

    // 存放1度白名单
    white = white.concat(nodes.source);

    // 将一度可见加入白名单
    $Map.find('.g_nodes_1').find('image').not('[data-yinzi]').each(function (index, el) {
        var id = $(this).attr('data-name');
        white.push(id);

        // 通过一度可见，找到二度可见，加入白名单
        if (Store.oldData.obj[id].category === '1') {
            var arr = Store.oldData.obj[id].children.source.concat(Store.oldData.obj[id].children.target);
            for (var i = 0; i < arr.length; i++) {
                arrId.push(arr[i].name);
            }
        }

    });
    // 合并去重
    white = arrId.concat(white);
    white = _.uniq(white);

    // 反向选择
    var all = _.keys(Store.oldData.obj);
    var black = _.difference(all, white); // 黑名单
    // 隐藏黑名单
    for (let i = 0; i < black.length; i++) {
        hideImageLineText($Map, black[i], className);
    }
}

// 隐藏黑名单
function blackHide(white, $Map, className) {

    // 将中心加入白名单
    white.push(Store.company);

    // 反向选择
    white = _.uniq(white); // 去重
    // var all = _.keys(Store.oldData.obj);
    // console.log("隐藏黑名单",all);
    var all = [];
    $Map.find('image').each(function (index, el) {
        all.push($(this).attr('data-name'));
    });
    all = _.uniq(all); // 去重

    // console.log(white,all);

    var black = _.difference(all, white); // 黑名单
    // 隐藏黑名单
    for (var i = 0; i < black.length; i++) {
        hideImageLineText($Map, black[i], className);
    }
}

// 隐藏线
function hideLine($Map, type, className) {
    type = parseInt(type, 10);
    var white = []; // 存放要显示的点
    // 实线
    if (type === 7) {
        $Map.find('line[data-line="line"]').each(function () {
            var sourceId = $(this).attr('data-source');
            var targetId = $(this).attr('data-target');
            white.push(sourceId);
            white.push(targetId);
        });
    } else {// 虚线
        $Map.find('line[data-line="dotted"]').each(function () {
            var sourceId = $(this).attr('data-source');
            var targetId = $(this).attr('data-target');
            white.push(sourceId);
            white.push(targetId);
        });
    }
    blackHide(white, $Map, className);
}

// 设置当前图谱节点总数
window.setAllNodesCount = function () {
    var $all = $('.activeMap-canvas');
    var img = $all.find('image');
    var addnodes = $all.find('.g_addnodes');
    var len1 = img.length;
    var len2 = addnodes.length;

    var totalN = $('#setAllNodesCount');
    totalN.length && totalN.html(len1 - len2);
    //  if($('#setAllNodesCount')[0])
    //  	$('#setAllNodesCount').html(len1 - len2);

    var map = {};
    img.each(function (i, e) {
        map[$(e).attr('data-name')] = $(e).attr('data-type');
    });
    var n1 = 0, n2 = 0;

    for (var e in map) {
        if (map[e] === 'rect') {
            n1++;
        }
        if (map[e] === 'circle') {
            n2++;
        }
    }

    var companyN = $('#setAllNodesCount1');
    companyN.length && companyN.html(n1);

    var personN = $('#setAllNodesCount2');
    personN.length && personN.html(n2);

    //  debugger;
    return len1 - len2;
};

// 隐藏目标点 下面的一度且单一的节点
export const hideOneLevelOnlyNode = function (id, type) {
    var $Map = $('#Map');
    // 筛选出需要隐藏的集合
    var obj = Store.iniData.obj[id];
    var child = obj.children.source.concat(obj.children.target);
    // var idArr = [];
    for (var i = 0; i < child.length; i++) {
        var other = Store.iniData.obj[child[i].name];
        if (other.children.len === 1) {
            // idArr.push(child[i].name);
            if (type === 'hide') {
                // 隐藏
                $Map.find('[data-name="' + child[i].name + '"]').hide();
                if (child[i].name === child[i].source) {
                    $Map.find('[data-source="' + child[i].name + '"]').hide();
                }
                if (child[i].name === child[i].target) {
                    $Map.find('[data-target="' + child[i].name + '"]').hide();
                }
            } else {
                // 显示
                $Map.find('[data-name="' + child[i].name + '"]').show();
                if (child[i].name === child[i].source) {
                    $Map.find('[data-source="' + child[i].name + '"]').show();
                }
                if (child[i].name === child[i].target) {
                    $Map.find('[data-target="' + child[i].name + '"]').show();
                }
            }

        }
    }

};

// 传一个id数组，然后隐藏数组里面的节点和线
export const showOrHideArrNode = function (arr, $map, type) {

    if (type === 'show') {
        $map.addClass('hidePath');
        var obj = {};
        for (var i = 0; i < arr.length; i++) {
            if (!obj[arr[i]]) {
                obj[arr[i]] = true;
            }
        }
        for (var key in obj) {
            $map.find('[data-name="' + key + '"]').attr('data-path', 'show');
            $map.find('line[data-source="' + key + '"]').each(function (index, el) {
                var tid = $(this).attr('data-target');
                if (obj[tid]) {
                    $(this).attr('data-path', 'show');
                }
            });
            $map.find('line[data-target="' + key + '"]').each(function (index, el) {
                var tid = $(this).attr('data-source');
                if (obj[tid]) {
                    $(this).attr('data-path', 'show');
                }
            });
        }

    }

    $(document).off('click.path').on('click.path', function (e) {
        if (!$(e.target).closest('.g_box')[0] && !$(e.target).closest('.shortcut-key')[0]) {
            $map.find('[data-path]').removeAttr('data-path');
            $map.removeClass('hidePath');
        }
    });
}

// 权限限制
export const permissionTips = function (per, tips) {
    var p = PERMISSION[per];
    if (p) {
        return true;
    } else {
        Tip.error(tips);
        return false;
    }
}

// 绘制num
export const drawNum = function (data) {

    // console.error(data)
    var keys = [];
    // 二度点才可以扩展
    var nodes = [];

    for (var key in data.arr) {
        nodes = nodes.concat(data.arr[key].nodes)
    }

    for (var i = 0; i < nodes.length; i++) {
        keys.push(nodes[i].name);
    }
    // 请求数字，然后渲染
    $.ajax({
        url: '/relation/count.htm',
        type: 'post',
        dataType: 'json',
        data: { keys: keys.join(',') },
        success: function (res) {
            // ...
            // console.log(res)
            if (res.success) {
                var num = []; // 存放绘制的num
                var $Map = $('#Map');
                for (var key in res.data) {

                    if (res.data[key] != 0) {
                        var $node = $Map.find('image[data-name="' + key + '"]');
                        var obj = {};
                        obj['x'] = $node.attr('x');
                        obj['y'] = $node.attr('y');
                        obj['name'] = key;
                        obj['num'] = res.data[key];
                        obj['cname'] = $node.attr('cname');
                        num.push(obj);
                    }

                }// end for

                // 绘制
                var g = d3.select('#Map').select(".g_nums").append("g")
                g.selectAll("text").data(num).enter().append("text")
                    .attr("dx", function (d) {
                        return parseInt(d.x, 10) + 26;
                    })
                    .attr("dy", function (d) {
                        return parseInt(d.y, 10) + 18
                    })
                    .attr("data-name", function (d) {
                        return d.name
                    })
                    .attr("font-size", 12)
                    .style("fill", "#f36a5a")
                    .text(function (d) {
                        return d.num
                    });


            } // END IF
        }
    });
}

// 探寻，历史，标记，没有数据的时候
export const listNoCompany = function (shtml, str) {
    // console.error(shtml)
    if (shtml == '') {
        shtml = '<li className="tanxun-null-tips">' + str + '</li>'
        return shtml;
    } else {
        $('.tanxun-null-tips').remove();
        return false;
    }
}

// 获取某家公司的关联点。
export const getThisNodes = function (id) {
    var arr = [];
    var idArr = [];
    var $map = $('#Map');
    var pushArr = function ($this, qyxxid, mark) {
        var $dom = $map.find('image[data-name="' + qyxxid + '"]');
        var color = 7;
        var guanlian = $this ? $this.attr('data-guanlian') : null;

        // 设置颜色
        if (mark == null) {
            color = 0;
        } else {
            if ($dom.attr('data-type') == 'rect') {
                if (mark == 'source') {
                    color = 1 //  蓝色
                } else {
                    color = 2// 黄色
                }
            } else {
                if (guanlian.indexOf('监事') != -1) { // 监事
                    color = 5;
                } else if (guanlian.indexOf('自然人') != -1) { // 自然人
                    color = 3;
                } else if (guanlian.indexOf('股东') != -1) { // 股东
                    color = 6;
                } else { // 高管
                    color = 4;
                }
            }
        }

        if (arr.indexOf(qyxxid) == -1) {
            idArr.push({
                name: qyxxid,
                guanlian: guanlian,
                childlen: parseInt($dom.attr('data-len'), 10),
                color: color,
                cname: $dom.attr('data-cname'),
                symbol: $dom.attr('data-type')
            });
        }
        arr.push(qyxxid);
    }

    // 设置原点
    pushArr(null, id, null);

    $map.find('line[data-target="' + id + '"]').each(function (index, el) {
        var $this = $(this);
        var qyxxid = $this.attr('data-source');
        pushArr($this, qyxxid, 'source');
    });
    $map.find('line[data-source="' + id + '"]').each(function (index, el) {
        var $this = $(this);
        var qyxxid = $this.attr('data-target');
        pushArr($this, qyxxid, 'target');
    });
    pushArr = null;
    return idArr
}

// 互相投资
export const huxiang = function (mark) {
    if (!$('#Map2').is(':hidden')) {
        Tip.error('请先恢复重绘！');
        return
    }
    var $Map = $("#Map");
    showImageLineText($Map); // 全部显示 // 
    if (mark) {
        var $links = $Map.find('.g_links');
        var white = [];
        $links.find('line').each(function (index, el) {
            var $this = $(this);
            var source = $this.attr('data-source');
            var target = $this.attr('data-target');
            if ($links.find('line[data-source="' + target + '"][data-target="' + source + '"]')[0]) {
                white.push(source);
                white.push(target);
            }
        });

        blackHide(white, $Map, 'hx');
    }
}

// 交叉关系
export const jiaocha = function (mark) {
    if (!$('#Map2').is(':hidden')) {
        Tip.error('请先恢复重绘！');
        return
    }
    var $Map = $("#Map");
    showImageLineText($Map); // 全部显示

    if (!mark) return

    /**
    * 先获取连线，根据连线上的两个端点，采用jquery选择器的方式去筛选出相关联的第三点arrs,arrt。然后去重合并
    * 将links 两两相关的点，放到arr里面。
    */
    var arr = []; // 
    // var links = Store.oldData.links;
    var links = [];
    $Map.find('line').each(function (index, el) {
        var $this = $(this);
        links.push({
            target: $this.attr("data-source"),
            source: $this.attr("data-target")
        });
    });

    for (var i = 0; i < links.length; i++) {
        var source = links[i].source;
        var target = links[i].target;

        var returnArr = [];
        var arrs = [];
        var arrt = [];
        $Map.find('line[data-source="' + source + '"]').each(function (index, el) {
            var id = $(this).attr('data-target');
            if (id != target) {
                arrs.push(id)
            }
        });
        $Map.find('line[data-target="' + source + '"]').each(function (index, el) {
            var id = $(this).attr('data-source');
            if (id != target) {
                arrs.push(id)
            }
        });
        $Map.find('line[data-source="' + target + '"]').each(function (index, el) {
            var id = $(this).attr('data-target');
            if (id != source) {
                arrt.push(id)
            }
        });
        $Map.find('line[data-target="' + target + '"]').each(function (index, el) {
            var id = $(this).attr('data-source');
            if (id != source) {
                arrt.push(id)
            }
        });
        returnArr = _.intersection(arrs, arrt);
        returnArr.unshift(source);
        returnArr.unshift(target);

        if (returnArr.length > 2) {
            arr = arr.concat(returnArr);
        }
    }
    // console.log(arr);
    // console.log(_.uniq(arr));

    blackHide(arr, $Map, 'jc');
}

// 正向投资
export const zhengxiang = function (mark) {
    if (!$('#Map2').is(':hidden')) {
        Tip.error('请先恢复重绘！');
        return
    }
    // console.log('正向投资',mark,Store);
    var $Map = $("#Map");
    showImageLineText($Map); // 全部显示
    if (mark) {
        var white = [];
        // 中点加入
        white.push(Store.company);

        // 一度点
        $Map.find('line[data-target="' + Store.company + '"]').not('[data-line="dotted"]').each(function (index, el) {
            var id = $(this).attr('data-source');
            white.push(id);
        });

        // 扩展点处理
        var nowWhite = white;
        var kuoZhanNodes = function (w) {
            var white2 = [];
            for (var i = 1; i < w.length; i++) {
                $Map.find('line[data-target="' + w[i] + '"]').not('[data-line="dotted"]').each(function (index, el) {
                    var id = $(this).attr('data-source');
                    white2.push(id);
                });
            }
            nowWhite = white2;
            white = white.concat(white2);
        }
        var level = $Map.find('.g_addnodes').length + 1;
        for (var i = 0; i < level; i++) {
            kuoZhanNodes(nowWhite);
        }

        blackHide(white, $Map, 'zx');
    }
}

// 逆向投资
export const nixiang = function (mark) {
    if (!$('#Map2').is(':hidden')) {
        Tip.error('请先恢复重绘！');
        return
    }
    var $Map = $('#Map');
    showImageLineText($Map); // 全部显示
    if (mark) {
        var white = [];
        // 中点加入
        white.push(Store.company);

        // 一度点
        $Map.find('line[data-source="' + Store.company + '"]').each(function (index, el) {
            var id = $(this).attr('data-target');
            white.push(id);
        });

        var nowWhite = white;
        var kuoZhanNodes = function (w) {
            var white2 = [];
            for (var i = 1; i < w.length; i++) {
                $Map.find('line[data-source="' + w[i] + '"]').each(function (index, el) {
                    var id = $(this).attr('data-target');
                    white2.push(id);
                });
            }
            nowWhite = white2;
            white = white.concat(white2);
        }
        var level = $Map.find('.g_addnodes').length + 1;
        for (var i = 0; i < level; i++) {
            kuoZhanNodes(nowWhite);
        }

        blackHide(white, $Map, 'nx');
    }
}

// 因子隐藏
export const hideForYinZi = function (yinzi) {

    if (!$('#Map2').is(':hidden')) {
        Tip.error('请先恢复重绘！');
        return
    }

    var $Map = $('#Map');
    showImageLineText($Map); // 全部显示
    if (!yinzi[0]) {
        hideNodes(null, $Map, 'rect', 1, '1');
    }
    if (!yinzi[1]) {
        hideNodes(null, $Map, 'rect', 2, '2');
    }
    if (!yinzi[2]) {
        hideNodes(null, $Map, 'circle', 3, '3');
    }
    if (!yinzi[3]) {
        hideNodes(null, $Map, 'circle', 4, '4');
    }
    if (!yinzi[4]) {
        hideNodes(null, $Map, 'circle', 5, '5');
    }
    if (!yinzi[5]) {
        hideNodes(null, $Map, 'circle', 6, '6');
    }
    if (!yinzi[6]) {
        $('.activeMap-canvas').addClass('yinzi-hideline');
        hideLine($Map, 6, '6');
    } else {
        $('.activeMap-canvas').removeClass('yinzi-hideline');
    }
    if (!yinzi[7]) {
        $('.activeMap-canvas').addClass('yinzi-hidedotted');
        hideLine($Map, 7, '7');
    } else {
        $('.activeMap-canvas').removeClass('yinzi-hidedotted');
    }
}

// 隐藏name
function hideByName(name) {
    var $Map = $('#Map');
    var $image = $Map.find('image[data-name="' + name + '"]'),
        $linet = $Map.find('line[data-target="' + name + '"]'),
        $lines = $Map.find('line[data-source="' + name + '"]'),
        $text = $Map.find('text[data-name="' + name + '"]'),
        $linetexts = $Map.find('[data-source-name="' + name + '"]'),
        $linetextt = $Map.find('[data-target-name="' + name + '"]');

    $image.attr('data-ihide', true);
    $linet.attr('data-ihide', true);
    $lines.attr('data-ihide', true);
    $text.attr('data-ihide', true);
    $linetexts.attr('data-ihide', true);
    $linetextt.attr('data-ihide', true);
}

// 投资
export function showTouZhi() {
    var $Map = $('#Map');
    showImageLineText($Map); // 全部显示
    // 白名单
    var white = [Store.company];

    for (let i = 0; i < Store.oldData.links.length; i++) {
        let link = Store.oldData.links[i];
        if (link.source === Store.company) {
            white.push(link.target);
        }
    }
    // 反向选择
    var all = _.keys(Store.oldData.obj);
    var black = _.difference(all, white); // 黑名单

    for (let i = 0; i < black.length; i++) {
        hideByName(black[i]);
    }
}

// 全部
export function showAll() {
    var $Map = $('#Map');
    showImageLineText($Map); // 全部显示
}

// 股东
export function showGuDong() {
    var $Map = $('#Map');
    showImageLineText($Map); // 全部显示
    // 白名单
    var white = [Store.company];
    // for (let i = 0; i < Store.oldData.links.length; i++) {
    //     let link = Store.oldData.links[i];
    //     if (link.target === Store.company) {
    //         white.push(link.source);
    //     }
    // }
    // console.log(Store.oldData.obj, 'Store.oldData.obj===');
    for(let key in Store.oldData.obj){
        if(Store.oldData.obj[key].relationDescribe === '法人股东' || Store.oldData.obj[key].relationDescribe === '自然人股东' ){
        // if(Store.oldData.obj[key].color === '2' || Store.oldData.obj[key].color === '3' ){
            white.push(key);
        }
    }
    // 反向选择
    var all = _.keys(Store.oldData.obj);
    var black = _.difference(all, white); // 黑名单
    for (let i = 0; i < black.length; i++) {
        hideByName(black[i]);
    }
}

// 董监高
export function showExecutives() {
    var $Map = $('#Map');
    showImageLineText($Map); // 全部显示
    // 白名单
    var white = [Store.company];
    // for (let i = 0; i < Store.oldData.links.length; i++) {
    //     let link = Store.oldData.links[i];
    //     if (link.target === Store.company) {
    //         white.push(link.source);
    //     }
    // }
    // console.log(Store.oldData.obj, 'Store.oldData.obj===');
    for(let key in Store.oldData.obj){
        if(Store.oldData.obj[key].relationDescribe === '董监高' ){
        // if(Store.oldData.obj[key].color === '2' || Store.oldData.obj[key].color === '3' ){
            white.push(key);
        }
    }
    // 反向选择
    var all = _.keys(Store.oldData.obj);
    var black = _.difference(all, white); // 黑名单
    for (let i = 0; i < black.length; i++) {
        hideByName(black[i]);
    }
}