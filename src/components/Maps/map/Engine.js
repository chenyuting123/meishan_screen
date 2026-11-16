'use strict';
import React from 'react';
import View from './View'; //  视图
import Store from './Store'; //  Store
import Event from './Event'; //  事件操作 
import d3 from 'd3';
window.dragState = false;
var ASSETS_PATH = '/static';

function Engine(DATA, _config) {

    if (DATA == false) {
        return;
    }
    var DATA_ARR = DATA.arr;
    var DATA_OBJ = DATA.obj;
    var DATA_LINK = DATA.links;

    //  如果没有度数的关系
    if (DATA_OBJ.length == 0) return;
    //  if(DATA_LINK.length == 0)return;

    //  设置全局变量
    var $activeMap = $('.activeMap-canvas');
    var width = $activeMap.width();
    var height = $activeMap.height();
    var NR = 0; //  初始半径，这个必须是0
    var limitNum = [];//  设置大小界限
    var centerName = DATA_ARR[0] ? DATA_ARR[0].nodes[0].name : null;
    //  获取节点最多的点有多少连线 ,0度的情况特殊
    var maxLinkNum = DATA_ARR[0] ? (DATA_ARR[0].nodes[0].children.source.length + DATA_ARR[0].nodes[0].children.target.length) : 0;

    //  基本配置信息
    var conf = $.extend({
        x0: width / 2, //  中点坐标
        y0: height / 2,
        minWid: 70, //  每个点相隔
        add: 50, //  每层加50
        intervalRoom: 200, //  0~1度之间的间隔
        interval: 90, //  1~其他度之间的间隔
        svgId: "Map",//  最外层DIV的id
        MapSvg: "MapSvg", //  最外层SVG的id
        hoverDo: true,
        clickDo: true,
        newPoint: null,
        transform: false,
        type: 'default',
        nodeWid: 24, //  点的大小
        newAdd: null, //  扩展节点的
        lineDo: true, //  是否绘制连线
        callback: null //  绘制完成后的回调函数
    }, _config);

    //  每次要设置当前的操作对象
    function setData() {
        Store.iniData = DATA;
        // console.log(DATA, 'DATA=============');
        if (Store.oldData == null) {
            Store.oldData = DATA;
        }
    }

    //  设置目标公司
    if (Store.company == null) {
        Store.company = centerName;
    }

    //  变量定义
    var zoom = null,
        drag = null,
        svg = null,
        g_box = null,
        g_lines = null,
        g_texts = null,
        g_linetexts = null,
        g_nodes = null,
        g_nums = null,
        g_zoom = null,
        g_mark = null,
        zero_arr = null,
        listHtml = '',
        listNum = 1,
        rmax = null;
    // 放大缩小
    function scaleFun(mark, scales) {
        if(!scales){
            $('.g_box').each(function () {
                $(this).attr('transform', 'translate(0,1)scale(1)');
            });
            return;
        }
        // 获取当前的 scale
        let str = $('.g_box').eq(0).attr('transform');
        
        // let scale = str.replace(/translate\((.+,.+)\)scale\((.+)\)/, '$2') || 1;
        // let xy = str.replace(/translate\((.+,.+)\)scale\((.+)\)/, '$1') || '0,0';
        let strReg = str.match(/^.+?\((.+?)\).+?\((.+?)\).*$/);
        let scale = 1;
        let xy = '0,0';
        if(strReg){
            scale = strReg[2];
            xy = strReg[1];
        }
        scale = parseFloat(scale);
        if (mark < 0) {
            // console.log('缩小', scale);
            scale -= 0.05;
            if (scale < 0.05) {
                scale = 0.05;
            }
        } else {
            // console.log('放大', scale);
            scale += 0.05;
            if (scale > 5) {
                scale = 5;
            }
        }
        $('.g_box').each(function () {
            $(this).attr('transform', `translate(${xy})scale(${scale})`);
        });
    }
    // 设置全局
    window.scaleFun = scaleFun;
        // 设置坐标位置
    function setPos(id) {
        var $box = $('#' + id);
        var $svg = $('#' + id).find('.g_box');

        // conf.scale
        var width = $box.width();
        var height = $box.height();
        var svgWidth = $svg.width();
        var svgHeight = $svg.height();

        var obj = {
            box_wid: width,
            box_hei: height,
            svg_wid: svgWidth,
            svg_hei: svgHeight,
            left: width / 2 * conf.scale, // ((width - svgWidth) / 2),
            top: height / 2 * conf.scale// -((height - svgHeight) / 2)
        };

        return obj;
    }

    function hideText(tip){
        let $node = $('#Map').find('.g_texts');
        if(tip){
            $node.addClass('hide');
        }else{
            $node.removeClass('hide');
        }
    }
    window.hideText = hideText;
    //   dragState=false;

    //  初始化SVG对象 - zoom,drag,svg,g_box,g_lines,g_texts,g_nodes,g_nums,zero_arr
    function iniSVG() {
        //  缩放
        var box = d3.select('#MapSvg').select('.g_box');
        var box2 = d3.select('#MapSvg2').select('.g_box');

        // zoom = d3.behavior.zoom()
        //     .scaleExtent([0.2, 5])
        //     .on("zoom", function () {
        //         d3.select(this).attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
        //         //  如果是MapSvg3 ， MapSvg2底层跟着缩放
        //         if ($(this).closest('#MapSvg3')[0] || $(this).closest('#MapSvg2')[0]) {
        //             box.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
        //             box2.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
        //         }
        //     });

        // 缩放事件
        $('#activeMap').off('mousewheel').on('mousewheel', function (event) {
            scaleFun(event.originalEvent.wheelDelta, true);
            event.preventDefault();
        });
        //  拖拽
        var dx0, dy0, tt, tx, ty, scale;
        drag = d3.behavior.drag()
            .on("dragstart", function () {
                dx0 = d3.event.sourceEvent.x;
                dy0 = d3.event.sourceEvent.y;
                var str = d3.select(this).select('.g_box').attr("transform") == undefined ? [0, 0, 1] : d3.select(this).select('.g_box').attr("transform").replace(/(translate\(|\).*scale\(|\))/g, ",").split(",");
               if(document.all){
                    tx = str[1].split(" ")[0];
                    ty = str[1].split(" ")[1];
                    scale = (str[2] == undefined ? 1 : str[2]);
                }else{
                    tx = str[1];
                    ty = str[2];
                    scale = (str[3] == undefined ? 1 : str[3]);
                }

            })
            .on("drag", function () {
                window.dragState = true;
                var xm = d3.event.sourceEvent.x - dx0;
                var ym = d3.event.sourceEvent.y - dy0;
                d3.select(this).select('.g_box')
                    .attr("transform", "translate(" + (xm + parseInt(tx, 10)) + "," + (ym + parseInt(ty, 10)) + ")scale(" + scale + ")");
                //  console.log(ym,xm,"位移坐标");
                //  如果是MapSvg3 底层跟着拖拽
                //  console.log(event.target);
                if ($(this).closest('#MapSvg3')[0] || $(this).closest('#MapSvg2')[0]) {
                    //  console.log("是MapSvg3 底层跟着拖拽");
                    //  console.log($(this))
                    box.attr("transform", "translate(" + (xm + parseInt(tx, 10)) + "," + (ym + parseInt(ty, 10)) + ")scale(" + scale + ")");
                    box2.attr("transform", "translate(" + (xm + parseInt(tx, 10)) + "," + (ym + parseInt(ty, 10)) + ")scale(" + scale + ")");
                }
            });

        //  设置svg宽度和高度
        svg = d3.select("#" + conf.svgId)
            .append("svg")
            .attr("id", conf.MapSvg)
            .attr("width", width)
            .attr("height", height);
        g_box = svg.append("g").attr("class", "g_box");//.call(zoom)  .call(drag);
        g_zoom = g_box.append("g").attr("class", "g_zoom"); //  缩放接收用
        g_lines = g_box.append("g").attr("class", "g_links");
        g_texts = g_box.append("g").attr("class", "g_texts");
        g_linetexts = g_box.append("g").attr("class", "g_linetexts");
        g_nodes = g_box.append("g").attr("class", "g_nodes");
        g_nums = g_box.append("g").attr("class", "g_nums");
        g_mark = g_box.append("g").attr("class", "g_mark");

        svg.call(drag);

        //  
        //  
        if (!$('#Map2').is(':hidden')) {
            var transform = $("#Map2").find('.g_box').attr('transform');
        } else {
            var transform = $("#Map").find('.g_box').attr('transform');
        }
        g_box.attr('transform', transform || 'translate(0,1)scale(1)')

        // svg.call(d3.behavior.zoom()).on('dbclick', null);

        //  如果是clickShow , 底层发生了位移，那么clickShow层也要位移
        if (conf.type == 'clickShow') {
            var tran = $("#Map").find(".g_box").attr('transform');
            if (tran) {
                $("#" + conf.svgId).find('.g_box').attr('transform', tran)
            }
        }

        //  0度的关联
        //  console.error(centerName)
        if (centerName) {
            zero_arr = DATA_OBJ[centerName].children.target.concat(DATA_OBJ[centerName].children.source);
        }

    }

    //  已知A点，B点，R长度，获取C点坐标，AB连线,延长到C点的位子,从圆心扩展到C点的坐标,Add 表示偏移角度
    //   独立方法 - 追加点的时候用到
    function getCPoint(A, B, R, Add) {
        var VN = Math.abs((B.y - A.y) / (B.x - A.x));
        var V = Math.atan(VN);
        var X = 1;//  向限
        if (B.x >= A.x && B.y <= A.y) {
            X = 1; //  1向限
        } else if (B.x <= A.x && B.y <= A.y) {
            X = 2;//  2向限
        } else if (B.x <= A.x && B.y >= A.y) {
            X = 3;//  3向限
        } else {
            X = 4;//  4向限
        }
        //  1,4向线，X为 + x0
        if (X == 1 || X == 4) {
            var x = parseInt(A.x + R * Math.cos(V + Add), 10)
        } else {
            var x = parseInt(A.x - R * Math.cos(V + Add), 10)
        }
        if (X == 1 || X == 2) {
            var y = parseInt(A.y - R * Math.sin(V + Add), 10)
        } else {
            var y = parseInt(A.y + R * Math.sin(V + Add), 10)
        }

        return {
            x: x,
            y: y
        }

    }

    //  添加箭头 - svg
    function addDefs() {
        //  箭头
        if (!$("#svg-arrow")[0]) {
            //   var defsId = [
            //       {id:'arrow1',refX:'20',refY:'6'}, //  16,24,32,40,48
            //       {id:'arrow2',refX:'24',refY:'6'},
            //       {id:'arrow3',refX:'28',refY:'6'},
            //       {id:'arrow4',refX:'32',refY:'6'},
            //       {id:'arrow5',refX:'36',refY:'6'}
            //       ]
            var defsId = [
                { id: 'arrow_red', refX: conf.nodeWid, refY: '6', color: '#f36a5a' }, //  红色
                { id: 'arrow_blue', refX: conf.nodeWid, refY: '6', color: '#80cef4' }, //  蓝色
                { id: 'arrow_yellow', refX: conf.nodeWid, refY: '6', color: '#f4d03e' }, //  黄色
                { id: 'arrow_green', refX: conf.nodeWid, refY: '6', color: '#83f5b7' }, //  绿色
                { id: 'arrow', refX: conf.nodeWid, refY: '6', color: '#ccc' }, //  灰色
                { id: 'arrow_high', refX: conf.nodeWid, refY: '6', color: '#f11' }, //  高风险色
                { id: 'arrow_black', refX: conf.nodeWid, refY: '6', color: '#333' }, //  黑名单
                { id: 'arrow_orange', refX: conf.nodeWid, refY: '6', color: '#f49d82' }, //  橙色
                { id: 'arrow_deepb', refX: conf.nodeWid, refY: '6', color: '#778AE6' } // 深蓝色
            ];
            $(".activeMap-canvas").append('<div id="arrow-box"></div>');
            var defs = d3.select("#arrow-box").append('svg').append("defs").attr("id", "svg-arrow");
            var arrow_path = "M2,2 L10,6 L2,10 L3,6 L2,2";
            defs.selectAll("marker")
                .data(defsId)
                .enter()
                .append("marker")
                .attr("id", function (d) {
                    return d.id
                })
                .attr("markerUnits", "strokeWidth")
                .attr("markerWidth", "12")
                .attr("markerHeight", "12")
                .attr("viewBox", "0 0 12 12")
                .attr("refX", function (d) {
                    return d.refX
                })
                .attr("refY", function (d) {
                    return d.refY
                })
                .attr("orient", "auto")
                .append("path")
                .attr("d", arrow_path)
                .attr("fill", function (d) {
                    return d.color;
                })
        }
    }

    //  设置分布
    function setLevelArr(nodes, R1) {
        var len = nodes.length;
        var S = 2 * Math.PI * R1 / len;//  获取两点之间的距离
        var levelArr = []; //  存放每层显示个数
        if (S < conf.minWid) {
            //  第一层最大显示多少个，最小隔30显示一个点
            var nowMax = parseInt(2 * Math.PI * R1 / conf.minWid); //  当前度数显示的个数
            var R = R1;
            levelArr.push(nowMax);
            len -= nowMax;
            //  如果还有，继续计算第二层
            while (len > 0) {
                R += conf.add;
                nowMax = parseInt(2 * Math.PI * R / conf.minWid);
                levelArr.push(nowMax);
                len -= nowMax;
            };
        } else {
            var R = R1;
            levelArr.push(nodes.length);
        }
        NR = R;
        return levelArr;
    };

    //  计算位置 - conf,levelArr,R1,nodes,maxLinkNum
    var vadd = 0; //  偏移量,一度和2度或者三度都存在偏移情况，避免线条重合区
    function countNodesPostion(levelArr, R1, nodes) {
        var now = 0;
        //  计算位置
        for (var j = 0; j < levelArr.length; j++) {
            var JD1 = 0;
            var count = levelArr[j];
            var V1 = 2 * Math.PI / count;

            //  避免线重叠
            //  console.warn(V1,Math.PI%V1)
            if (Math.PI % V1 == 0) {
                vadd = 0.785;
            }
            //  console.log("count",count,"V1",V1,"now",now);

            for (var i = 0; i < count; i++) {
                if (i + now < nodes.length) {
                    var _obj = nodes[i + now];

                    var x = parseInt(conf.x0 - (R1 + j * conf.minWid) * Math.cos(V1 * JD1 + vadd), 10);
                    var y = parseInt(conf.y0 + (R1 + j * conf.minWid) * Math.sin(V1 * JD1 + vadd), 10);

                    //  设置坐标
                    _obj['x'] = isNaN(x) ? 10 : x;
                    _obj['y'] = isNaN(y) ? 10 : y;

                    //  设置children.len
                    _obj.children['len'] = _obj.children.source.length + _obj.children.target.length;

                    //  设置最大节点的子节点个数
                    if (_obj.children.len > maxLinkNum) {
                        maxLinkNum = _obj.children.len;
                    }

                    JD1++;

                    //  设置rmax
                    rmax = R1 + j * conf.minWid;
                }
            }

            vadd += 0.785;
            now += levelArr[j];
        }
    };

    //  获取圆点的关联信息 - zero_arr，name
    function getGuanlian(name) {
        //  console.log('>>>>>>>>>>>zero_arr',name,zero_arr);
        var guanlian = '';
        for (var i = 0; i < zero_arr.length; i++) {
            //   console.log(zero_arr[i],name);
            if (zero_arr[i].name == name) {
                if (zero_arr[i].target == name) {
                    guanlian = zero_arr[i].guanlian + 'out'
                } else {
                    guanlian = zero_arr[i].guanlian + 'in'
                }

            }
        }
        return guanlian;
    }

    //  设置子节点sub的HTML
    function setRightSubHtml(obj) {
        var item = '<div class="sub">';
        var objarr = obj.children.target.concat(obj.children.source);
        for (var i = 0; i < objarr.length; i++) {
            item += '<div class="item animated fadeInDown" style="-webkit-animation-delay:' + i / 10 + 's;"><span>' + objarr[i].name + '(' + objarr[i].guanlian + ')</span></div>'
        }
        item += '</div>';
        return item;
    }

    //  初始化右侧列表
    function addRightList(obj) {
        //  console.log(obj)
        listHtml += '<div class="list" data-name="' + obj.name + '">\
                            <div class="name"><span class="num">'+ listNum + '</span>' + obj.name + '<a href="javascript:;" class="list-flod"><i class="iconfont icon-bottom"></i></a></div>' +
            setRightSubHtml(obj) + '\
                       </div>';
        listNum++;
    }

    //  追加点 到 列表 - 废弃
    function appendRightList(obj) {
        var $all = $("#activeMapListAll");
        //  名字重复就不 用追加了
        if ($all.find('.list[data-name="' + obj.name + '"]')[0]) return;

        //  新的点
        var num = $all.find('.list').length;
        num++;
        var sHtml = '<div class="list" data-name="' + obj.name + '">\
                            <div class="name"><span class="num">'+ num + '</span>' + obj.name + '<a href="javascript:;" class="list-flod"><i class="iconfont icon-bottom"></i></a></div>' +
            setRightSubHtml(obj) + '\
                       </div>';
        $("#activeMapListAll").append(sHtml)
    }

    //  getGuanlian(),addRightList();
    function setNodes(dom, nodes) {
        //  console.log("传入的节点",nodes);
        //  缓存节点半径界限
        if (Store.oldLimitNum == null) {
            Store.oldLimitNum = limitNum;
        }

        //  console.log('nodes=====>',nodes)
        var d3Obj = dom.selectAll("image")
            .data(nodes)
            .enter()
            .append("image")
            .attr("width", function (d) {
                addRightList(d); //  添加list
                var linkNum = d.children.source.length + d.children.target.length;
                //   if(linkNum == 1)d['r'] = 16;
                //   else if(linkNum < limitNum[0])d['r'] = 24;
                //   else if(linkNum < limitNum[1])d['r'] = 32;
                //   else if(linkNum < limitNum[2])d['r'] = 40;
                //   else if(linkNum < limitNum[3])d['r'] = 48;
                //   else d['r'] = 56;
                d['r'] = conf.nodeWid;
                return d.r;
            })
            .attr("height", function (d) {
                return d.r;
            })
            .attr('data-len', function (d) {
                return d.children.source.length + d.children.target.length;
            })
            .attr("data-type", function (d) {
                return d.symbol;
            })
            .attr("data-color", function (d) {
                return d.color;
            })
            .attr("data-category", function (d) {
                return d.category;
            })
            .attr("data-name", function (d) {
                return d.name;
            })
            .attr("data-cname", function (d) {
                return d.cname;
            })
            .attr("xlink:href", function (d) {
                //  var color = d.color.replace("#","");
                d.color = d.color.toString();
                 //  var color = d.color.replace("#","");
                var className = '';
                if (d.symbol == "rect") {
                    if(d.color.indexOf('5') != -1){
                        className = 'company_high';
                    }else if(d.color.indexOf('6') != -1){
                        className = 'company_black';
                    }else if (d.category == '0') {
                        className = 'company_orange';
                    } else if (d.category == '1') {
                        var guanlian = getGuanlian(d.name);
                        if (guanlian.indexOf('out') != -1) {
                            className = 'company_deepb';
                        } else {
                            className = 'company_green';
                        }
                    } else {
                        className = 'company_grey';
                    }
                    d['url'] = className;
                    //  d['url'] = home+'/images/company/'+className+'.svg';
                    return ASSETS_PATH + '/images/company/' + className + '.svg'; //
                }

                //  如果是人。判断度数
                if (d.category == '0') { //  0度是红色
                    className = 'man_orange';
                } else if (d.category == '1') { //  1度是彩色的[0]
                    // console.log(Store.company, 'Store==========');
                     // console.log(d, 'sd==========');
                    className = 'man_blue'; 
                    let lineType = d.children.target;
                    for(let i=0; i<lineType.length; i++){
                        // console.log('监测目标公司-------------------------');
                        if(lineType[i].target === Store.company && lineType[i].line === 'line'){
                            className = 'g_green';
                        }
                    }
                    // 
                    // console.log(d.children, 'd.children==========');
                    // if(lineType == 'line'){
                    //     className = 'g_green';
                    // }else{
                    //      className = 'man_blue'; 
                    // }
                    //1度才存在高管什么的~
                    // var guanlian = getGuanlian(d.name);
                    // console.log(guanlian, 'guanlian=============');
                    // if(guanlian.indexOf('股东') != -1 || guanlian.indexOf('中国公民') != -1 || guanlian.indexOf('其他投资者') != -1 || guanlian.indexOf('自然人') != -1){ //  股东
                    //     className = 'g_green';
                    // }else{ //  高管
                    //     className = 'man_blue'; 
                    // }
                    // if(d.color.indexOf('3') != -1){
                    //     className = 'g_green';
                    // }else if(d.color.indexOf('4') != -1){
                    //     className = 'man_blue';
                    // }else if(guanlian.indexOf('股东') != -1){
                    //     className = 'g_green';
                    // }else{
                    //     className = 'man_blue';
                    // }

                } else { //  2+度是灰色
                    className = 'man_grey';
                }
                d['url'] = className;
                //  d['url'] = home+'/images/man/'+className+'.svg';
                return ASSETS_PATH + '/images/man/' + className + '.svg';
                // if(d.cname === '00971bee668948c28a6f4c5685c89071'){
                //     console.info('1111111111111', d);
                // }
                // var className = '';
                // var path = '/images/company/';
                // if(d.color.indexOf('5') != -1){
                //     className = 'company_high';
                // }else if(d.color.indexOf('6') != -1){
                //     className = 'company_black';
                // }else if(d.category === 0 && d.symbol === 'circle'){
                //     path = '/images/man/';
                //     className = 'man_orange';
                // }else if(d.category === 0 && d.symbol === 'rect'){
                //     className = 'company_orange';
                // }else if (d.category === 1) {
                //     var guanlian = getGuanlian(d.name);
                //     if(d.color.indexOf('1') != -1){
                //         className = 'company_deepb';
                //     }else if(d.color.indexOf('2') != -1){
                //         className = 'company_green';
                //     }else if(d.color.indexOf('3') != -1){
                //         className = 'g_green';
                //         path = '/images/man/';
                //     }else if(d.color.indexOf('4') != -1){
                //         className = 'man_blue';
                //         path = '/images/man/';
                //     }else if (guanlian.indexOf('out') != -1) {
                //         className = 'company_deepb';
                //     }else if (guanlian.indexOf('in') != -1) {
                //         className = 'company_green';
                //     }else{
                //         className = 'company_grey';
                //     }
                // }else{
                //     if(d.symbol === 'circle'){
                //         path = '/images/man/';
                //         className = 'd_grey';
                //     }else{
                //         className = 'company_grey';
                //     }
                // }
                // d['url'] = className;
                // return ASSETS_PATH + path + className + '.svg'; //  
            })
            .attr('data-ext', function (d) {
                return d.category < 2 ? 'true' : 'false'
            })

        //  如果是 clickShow 类型，没有动画
        if (conf.type == 'clickShow') {
            d3Obj.attr('x', function (d) {
                return d.x - d.r / 2;
            })
                .attr('y', function (d) {
                    return d.y - d.r / 2;
                })
        } else {
            d3Obj.attr('x', function (d) {
                return conf.x0 - d.r / 2;
            })
                .attr('y', function (d) {
                    return conf.y0 - d.r / 2;
                })
                .transition()
                .duration(800)
                .attr('x', function (d) {
                    return d.x - d.r / 2;
                })
                .attr('y', function (d) {
                    return d.y - d.r / 2;
                })
        }

    }

    //  设置节点位子 - DATA_ARR，conf,maxLinkNum
    //  countNodesPostion(), setLevelArr()
    function setNodeAttr() {
        //  添加节点属性
        for (var level in DATA_ARR) {
            //  圆点，0度情况
            var nodes = DATA_ARR[level].nodes;
            if (level == 0) {
                nodes[0]['x'] = conf.x0;
                nodes[0]['y'] = conf.y0;
            } else if (level == 1) { //   1度的情况
                //  数组排序
                nodes.sort(function (a, b) {
                    return a.color > b.color ? 1 : -1
                })
                var R1 = NR + conf.intervalRoom;
                //  分布排列
                var levelArr = setLevelArr(nodes, R1);
                //  设置点
                countNodesPostion(levelArr, R1, nodes);
            } else {
                var R1 = NR + conf.interval;
                //  分布排列
                var levelArr = setLevelArr(nodes, R1);
                //  设置点
                countNodesPostion(levelArr, R1, nodes);
            }
        }

        //  锁定Store.rmax
        if (Store.rmax == null) {
            Store.rmax = rmax
        }

        //  设置每个点的大小界限
        var ecahNum = (maxLinkNum > 4 ? parseInt(maxLinkNum / 4, 10) : 1);
        for (var i = 0; i < 4; i++) {
            limitNum.push(ecahNum);
            ecahNum += ecahNum;
        }
    }

    //  设置新的节点位子 - DATA_ARR，conf,maxLinkNum
    //  countNodesPostion(), setLevelArr()
    //   扩展出来的点，默认依次增加层数，
    //  建议:创建一个圈层分布map,在分布map中计算出最佳位置插入扩展点。增加，删除节点都在分布map中进行预操作，然后通过分布map给出最佳扩展位置
    function setNewNodeAttr() {
        var setObj = function (_obj, x, y) {
            //  设置坐标
            x = isNaN(x) ? 10 : x;
            y = isNaN(y) ? 10 : y;
            _obj['x'] = parseInt(x, 10);
            _obj['y'] = parseInt(y, 10);

            //  设置children.len
            _obj.children['len'] = _obj.children.source.length + _obj.children.target.length;
        }
        //  添加节点属性
        for (var level in DATA_ARR) {
            //  圆点，0度情况
            var nodes = DATA_ARR[level].nodes;
            if (level == 0) {
                //  中心节点就是当前位子
                nodes[0]['x'] = conf.x0;
                nodes[0]['y'] = conf.y0;
            } else if (level == 1) { //   1度的情况
                //  只有一个点
                if (nodes.length == 1) {
                    setObj(nodes[0], conf.newPoint.x, conf.newPoint.y);
                } else {
                    //  getCPoint
                    //  数组排序
                    nodes.sort(function (a, b) {
                        return parseInt(a.color.replace("#", ""), 16) > parseInt(b.color.replace("#", ""), 16) ? 1 : -1
                    })
                    var R3 = conf.newPoint.R;
                    var S = 2 * Math.PI * R3;//  获取周长

                    //  小于最大容量,正常扩展，如果大于最大容量。平均扩展
                    if (nodes.length < S / conf.minWid) {
                        var V = conf.minWid / S * 2 * Math.PI; //  求得每个的角度
                    } else {
                        var V = 2 * Math.PI / nodes.length; //  求得每个的角度
                    }
                    for (var i = 0; i < nodes.length; i++) {
                        var p = getCPoint({ x: conf.newPoint.x0, y: conf.newPoint.y0 }, { x: conf.newPoint.x, y: conf.newPoint.y }, R3, V * i);
                        setObj(nodes[i], p.x, p.y);
                    }
                }//  end if
            }
        }

        //  设置每个点的大小界限
        var ecahNum = (maxLinkNum > 4 ? parseInt(maxLinkNum / 4, 10) : 1);
        for (var i = 0; i < 4; i++) {
            limitNum.push(ecahNum);
            ecahNum += ecahNum;
        }
        setObj = null;
    }

    //  绘制节点 - DATA_ARR,nodes
    //  setNodes()
    function renderNodes() {
        //  绘制节点
        for (var level in DATA_ARR) {
            var nodes = DATA_ARR[level].nodes;
            var thisNodes = g_nodes.append("g").attr("class", "g_nodes_" + level);
            setNodes(thisNodes, nodes);
        }
        //  初始化侧面列表 - 废弃
        //   if(conf.type == 'default'){
        //       $("#activeMapList").hide();
        //       $("#activeMapListAll").html(listHtml).show();
        //   }else{
        //       $("#activeMapListAll").hide();
        //       $("#activeMapList").html(listHtml).show();
        //   }
    }

    //  绘制连线 - g_lines,DATA_LINK,DATA_OBJ,
    function renderLinks(glines) {

        var getColor = function (d) {
            //  线的颜色根据，source的颜色确定
            if (DATA_OBJ[d.source] == undefined) {
                var obj = Store.oldData.obj[d.source];
            } else {
                var obj = DATA_OBJ[d.source];
            }
            return obj.url;

        }

        //  绘制连线 
        var lines = glines.selectAll("line")
            .data(DATA_LINK)
            .enter()
            .append("line")
            .attr('stroke-dasharray', function (d) {
                if (d.line == 'dotted')
                    return '5 5';
                else
                    return null;
            })
            .attr('x1', function (d) {
                if (DATA_OBJ[d.source] == undefined) {
                    var obj = Store.oldData.obj[d.source];
                } else {
                    var obj = DATA_OBJ[d.source];
                }
                return obj.x;
            })
            .attr('y1', function (d) {
                if (DATA_OBJ[d.source] == undefined) {
                    var obj = Store.oldData.obj[d.source];
                } else {
                    var obj = DATA_OBJ[d.source];
                }
                return obj.y;
            })
            .attr('x2', function (d) {
                if (DATA_OBJ[d.target] == undefined) {
                    var obj = Store.oldData.obj[d.target];
                } else {
                    var obj = DATA_OBJ[d.target];
                }
                return obj.x;
            })
            .attr('y2', function (d) {
                if (DATA_OBJ[d.target] == undefined) {
                    var obj = Store.oldData.obj[d.target];
                } else {
                    var obj = DATA_OBJ[d.target];
                }
                return obj.y;
            })
            .attr("data-target", function (d) {
                return d.target
            })
            .attr("data-guanlian", function (d) {
                return d.guanlian;
            })
            .attr("data-source", function (d) {
                return d.source
            })
            .attr("data-line", function (d) {
                return d.line;
            })
            .attr("marker-end", function (d) {
                //   if(DATA_OBJ[d.target] == undefined){
                //       var obj = Store.oldData.obj[d.target];
                //   }else{
                //       var obj = DATA_OBJ[d.target];
                //   }
                //  var r = obj.r;
                //   if(r == 16) return "url(#arrow1)";
                //   if(r == 24) return "url(#arrow2)";
                //   if(r == 32) return "url(#arrow3)";
                //   if(r == 40) return "url(#arrow4)";
                //   if(r == 48) return "url(#arrow5)";
                //  return "url(#arrow)";
                var url = getColor(d);
                if (url.indexOf('grey') != -1) {
                    return 'url(#arrow)'
                } else if (url.indexOf('red') != -1) {
                    return 'url(#arrow_red)'
                } else if (url.indexOf('blue') != -1) {
                    return 'url(#arrow_blue)'
                } else if (url.indexOf('yellow') != -1) {
                    return 'url(#arrow_yellow)'
                } else if (url.indexOf('green') != -1) {
                    return 'url(#arrow_green)'
                } else if (url.indexOf('high') != -1) {
                    return 'url(#arrow_high)'
                } else if (url.indexOf('black') != -1) {
                    return 'url(#arrow_black)'
                } else if (url.indexOf('orange') != -1) {
                    return 'url(#arrow_orange)'
                } else if (url.indexOf('deepb') != -1) {
                    return 'url(#arrow_deepb)'
                }
            });

        if (conf.type != 'clickShow') {
            lines.style("stroke-width", 1)
                .style("stroke", "#ffffff")
                .transition()
                .delay(800) //  延迟动画
                .duration(500)
        }
        lines.style("stroke", function (d) {
            //  线的颜色根据，source的颜色确定
            var url = getColor(d);
            if (url.indexOf('grey') != -1) {
                return '#c5cdd9'
            } else if (url.indexOf('red') != -1) {
                return '#f49d82'
            } else if (url.indexOf('blue') != -1) {
                return '#80cef4'
            } else if (url.indexOf('yellow') != -1) {
                return '#f4d03f'
            } else if (url.indexOf('green') != -1) {
                return '#83f5b7'
            }else if (url.indexOf('high') != -1) {
                return '#f11'
            } else if (url.indexOf('black') != -1) {
                return '#333'
            } else if (url.indexOf('orange') != -1) {
                return '#f49d82'
            } else if (url.indexOf('deepb') != -1) {
                return '#778AE6'
            }
        })

        getColor = null;
    }

    //  绘制文字 - DATA_ARR，g_texts，
    function renderTexts(gtexts, isAddNodes) {
        //  添加文字
        var textArr = [];
        if (isAddNodes) {
            textArr = DATA_ARR[1].nodes;
        } else {
            for (var i in DATA_ARR) {
                textArr = textArr.concat(DATA_ARR[i].nodes);
            }
        }

        var text = gtexts.selectAll("text")
            .data(textArr)
            .enter()
            .append("text")
            .attr("font-size", 12)
            .attr("dx", function (d) {
                var x = d.x - d.cname.replace(Store.nameExg, '').length * 6;
                return x;
            })
            .attr("dy", function (d) {
                var y = parseInt(d.y) + d.r / 2 + 15;
                return y;
            })
            .attr("data-name", function (d) {
                return d.name
            })
            .text(function (d) {
                //   console.log(d)
                return d.cname.replace(Store.nameExg, '');
            });

        if (conf.type == 'clickShow') {
            text.style("fill", "#666")
        } else {
            text.style("fill", "#fff")
                .transition()
                .duration(800)
                .style("fill", "#666")
        }
    }

    //  绘制line文字 - DATA_ARR，g_texts，
    function renderLineTexts(gtexts, isAddNodes) {
        //  添加文字
        var textArr = DATA_LINK;
        //  console.log("PPPPP",textArr);
        //  数据筛选，企业法人，或者'' 都不显示
        var newTextArr = [];
        for (var i = 0; i < textArr.length; i++) {
            if (textArr[i].guanlian != '企业法人' && textArr[i].guanlian != '') {
                newTextArr.push(textArr[i]);
            }
        }

        var text = gtexts.selectAll("text")
            .data(newTextArr)
            .enter()
            .append("g");

        //  绘制底部方块
        text.append('rect')
            .attr('width', function (d) {
                return d.guanlian.length * 12 + 10
            })
            .attr('height', 20)
            .attr('fill', '#fae0c7')
            .attr('stroke-width', 1)
            .attr('stroke', '#e3b794')
            .attr('stroke-dasharray', '3 3')
            .attr("data-source-name", function (d) {
                return d.source
            })
            .attr("data-target-name", function (d) {
                return d.target
            })
            .attr("x", function (d) {
                if (DATA_OBJ[d.source] == undefined) {
                    var obj1 = Store.oldData.obj[d.source];
                } else {
                    var obj1 = DATA_OBJ[d.source];
                }
                var x1 = parseInt(obj1.x, 10);

                if (DATA_OBJ[d.target] == undefined) {
                    var obj2 = Store.oldData.obj[d.target];
                } else {
                    var obj2 = DATA_OBJ[d.target];
                }
                var x2 = parseInt(obj2.x, 10);
                return (x1 + x2) / 2 - d.guanlian.length * 6 - 5;
            })
            .attr("y", function (d) {
                if (DATA_OBJ[d.source] == undefined) {
                    var obj1 = Store.oldData.obj[d.source];
                } else {
                    var obj1 = DATA_OBJ[d.source];
                }
                var y1 = parseInt(obj1.y, 10);

                if (DATA_OBJ[d.target] == undefined) {
                    var obj2 = Store.oldData.obj[d.target];
                } else {
                    var obj2 = DATA_OBJ[d.target];
                }
                var y2 = parseInt(obj2.y, 10);
                return (y1 + y2) / 2 - 8;
            });

        //  添加文本
        text.append("text")
            .attr("font-size", 12)
            .attr("dx", function (d) {
                if (DATA_OBJ[d.source] == undefined) {
                    var obj1 = Store.oldData.obj[d.source];
                } else {
                    var obj1 = DATA_OBJ[d.source];
                }
                var x1 = parseInt(obj1.x, 10);

                if (DATA_OBJ[d.target] == undefined) {
                    var obj2 = Store.oldData.obj[d.target];
                } else {
                    var obj2 = DATA_OBJ[d.target];
                }
                var x2 = parseInt(obj2.x, 10);
                return (x1 + x2) / 2 - d.guanlian.length * 6;
            })
            .attr("dy", function (d) {
                if (DATA_OBJ[d.source] == undefined) {
                    var obj1 = Store.oldData.obj[d.source];
                } else {
                    var obj1 = DATA_OBJ[d.source];
                }
                var y1 = parseInt(obj1.y, 10);

                if (DATA_OBJ[d.target] == undefined) {
                    var obj2 = Store.oldData.obj[d.target];
                } else {
                    var obj2 = DATA_OBJ[d.target];
                }
                var y2 = parseInt(obj2.y, 10);;
                return (y1 + y2) / 2 + 6;
            })
            .attr("data-guanlian", function (d) {
                return d.guanlian
            })
            .attr("data-source-name", function (d) {
                return d.source
            })
            .attr("data-target-name", function (d) {
                return d.target
            })
            .style("fill", "#333")
            .text(function (d) {
                //   console.log(d)
                return d.guanlian
            });

        //   if(conf.type == 'clickShow'){
        //       text.style("fill", "#333")
        //   }else{
        //       text.style("fill", "#fff")
        //       .transition()
        //       .duration(800)
        //       .style("fill", "#333")
        //   } 
    }

    //  添加新的节点
    function addNewNodes(dom, nodes, iszero) {

        //  追加到Store.oldData

        //  var home = window.location.origin;
        dom.selectAll("image").data(nodes).enter().append("image")
            .attr("width", function (d) {
                appendRightList(d); //  添加list 

                d['r'] = conf.nodeWid;
                return conf.nodeWid;
                //  console.log(d,Store.extDom.r);
                if (d.category == '0') {
                    d['r'] = Store.extDom.r;
                    return d.r;
                } else {
                    var linkNum = d.children.source.length + d.children.target.length;
                    if (linkNum == 1) d['r'] = 16;
                    else if (linkNum < Store.oldLimitNum[0]) d['r'] = 24;
                    else if (linkNum < Store.oldLimitNum[1]) d['r'] = 32;
                    else if (linkNum < Store.oldLimitNum[2]) d['r'] = 40;
                    else if (linkNum < Store.oldLimitNum[3]) d['r'] = 48;
                    else d['r'] = 56;
                    return d.r;
                }
            })
            .attr("height", function (d) {

                d['r'] = conf.nodeWid;
                return conf.nodeWid;
                if (d.category == '0') {
                    var r = Store.extDom.r;
                    d['r'] = r;
                    return r;
                }
                return d.r;
            })
            .attr('data-color', function (d) {
                return d.color;
            })
            .attr("data-category", function (d) {
                return d.category;
            })
            .attr('data-len', function (d) {
                return d.children.len;
            })
            .attr("data-type", function (d) {
                return d.symbol;
            })
            .attr("data-extr", iszero ? Store.extR : '')
            .attr("data-name", function (d) {
                return d.name;
            })
            .attr("data-cname", function (d) {
                return d.cname;
            })
            .attr("data-willdel", function (d) {
                return d.willDel;
            })
            .attr("xlink:href", function (d) {
                //  var color = d.color.replace("#","");
                var className = '';
                if (d.symbol == "rect") {
                    className = 'company_grey';
                    d['url'] = className;
                    return ASSETS_PATH + '/images/company/' + className + '.svg';
                }
                else {
                    className = 'man_grey';
                    d['url'] = className;
                    return ASSETS_PATH + '/images/man/' + className + '.svg';
                }

            })
            .attr('x', function (d) {
                if (d.category == '0') {
                    return conf.x0 - Store.extDom.r / 2
                }
                return conf.x0 - d.r / 2;
            })
            .attr('y', function (d) {
                if (d.category == '0') {
                    return conf.y0 - Store.extDom.r / 2
                }
                return conf.y0 - d.r / 2;
            })
            .transition()
            .duration(800)
            .attr('x', function (d) {
                return d.x - d.r / 2;
            })
            .attr('y', function (d) {
                return d.y - d.r / 2;
            })
            .attr('data-ext', function (d) {
                if (iszero) {
                    //  扩展
                    $('#Map').find('image[data-name="' + d.name + '"]').attr('data-ext', 'true')
                }
                return iszero;
            })

        //  重新渲染追加的对象
        //  $("#activeMapListAll").append(listHtml)
    }

    //  console.log(DATA);

    //  追加到allDATA 里面
    function addToAllDATA(data) {
        //   console.log(Store);
        //   Store.allData['arr'] = _.defaults(Store.allData.arr,data.arr);
        //   Store.allData['links'] = data.links.concat(Store.allData.links); 
        //   Store.allData['obj'] = _.defaults(Store.allData.obj,data.obj);
    }

    function zoomSvg() {
        setTimeout(function () {
            if (!$('#' + conf.svgId).find('.g_box')[0]) return
            //  缩放问题
            var gs = $('#' + conf.svgId).find('.g_box')[0].getBBox();
            g_zoom.append("rect")
                .attr("opacity", 0)
                .attr("x", gs.x)
                .attr("y", gs.y)
                .attr("width", gs.width)
                .attr("height", gs.height);
        }, 900)
    }

    //  初始化
    if (conf.type == 'default') {

        //  console.log('DATA',DATA);

        addToAllDATA(DATA)

        //  缓存操作对象
        setData();
        //  初始化SVG对象
        iniSVG();
        //  添加箭头 - 无需重复添加
        addDefs();
        //  设置节点位子
        setNodeAttr();
        //  绘制节点
        renderNodes();
        //  绘制连线
        renderLinks(g_lines);
        //  绘制文字
        renderTexts(g_texts, false);
        renderLineTexts(g_linetexts, false);
        zoomSvg();//  缩放
    } else if (conf.type == 'addNodes') { //  如果是追加点
        //  console.log('DATA',DATA);
        addToAllDATA(DATA)
        //  获取SVG对象
        svg = d3.select("#Map");
        g_box = svg.select(".g_box");
        //  追加点
        var addnodes = g_box.append("g").attr("class", "g_addnodes");
        var glines = addnodes.append("g").attr("class", "g_addnodes_lines");
        var gtexts = addnodes.append("g").attr("class", "g_addnodes_texts");
        var glinetexts = addnodes.append("g").attr("class", "g_addnodes_linetexts");
        var gnodes0 = addnodes.append("g").attr("class", "g_addnodes_nodes_0");
        var gnodes1 = addnodes.append("g").attr("class", "g_addnodes_nodes_1");

        //  绘制节点
        //  console.log(DATA);
        //  设置节点位子
        setNewNodeAttr();
        //   limitNum = Store.oldLimitNum;
        //   //  绘制节点
        addNewNodes(gnodes0, DATA_ARR[0].nodes, true);

        //  如果点出现在扩展点里面 - 多余的点
        
        var $g_addnodes = $('.g_addnodes');
        if (DATA_ARR[1] == undefined) {
            return
        }
        for (var i = 0; i < DATA_ARR[1].nodes.length; i++) {
            var name = DATA_ARR[1].nodes[i].name;
            var $thisNode = $g_addnodes.find('image[data-name="' + name + '"]');
            if ($thisNode[0]) {
                var r = parseInt($thisNode.attr('width'), 10)
                DATA_ARR[1].nodes[i].x = parseInt($thisNode.attr('x'), 10) + r / 2;
                DATA_ARR[1].nodes[i].y = parseInt($thisNode.attr('y'), 10) + r / 2;
                DATA_ARR[1].nodes[i]['willDel'] = 'true';
            }
        }
        addNewNodes(gnodes1, DATA_ARR[1].nodes, false);

        //  绘制后，再删掉多余的点
        $('[data-willdel="true"]').remove();

        setTimeout(function () {
            //  绘制连线
            renderLinks(glines);
            //  绘制文字
            renderTexts(gtexts, true);
            renderLineTexts(glinetexts, true);

            var gs = $('#' + conf.svgId).find('.g_box')[0].getBBox();
            //  console.log(gs)
            d3.select('#' + conf.svgId).select("rect")
                .attr("x", gs.x)
                .attr("y", gs.y)
                .attr("width", gs.width)
                .attr("height", gs.height);

        }, 800);
    } else if (conf.type == 'clickShow') {
        //  缓存操作对象
        setData();
        //  初始化SVG对象
        iniSVG();
        //  添加箭头 - 无需重复添加
        addDefs();
        //  设置节点位子
        //  setNodeAttr();
        //  绘制节点
        renderNodes();
        //  绘制连线
        renderLinks(g_lines);
        //  绘制文字
        renderTexts(g_texts, false);
        renderLineTexts(g_linetexts, false);
        zoomSvg();//  缩放
    } else if (conf.type == 'history') {
        //  初始化SVG对象
        iniSVG();
        //  添加箭头 - 无需重复添加
        addDefs();
        //  设置节点位子
        setNodeAttr();
        //  绘制节点
        renderNodes();
        //  绘制连线
        renderLinks(g_lines);
        //  绘制文字
        renderTexts(g_texts, false);
        zoomSvg();//  缩放
    } else {
        zoomSvg();//  缩放
    }

    //  事件操作
    if (conf.hoverDo)
        Event.hoverEvent(conf.MapSvg); //  鼠标hover事件
    if (conf.clickDo)
        Event.clickEvent(conf.MapSvg); //  点击
    //   if(!conf.clickDo)
    //       Event.triggerClick(); //  点击Map2的点，触发Map的点

    Event.resizeWindow(conf.MapSvg); //  窗口大小变化 
    Event.drag(conf.MapSvg); //  窗口大小变化

    //  动画完成后执行
    setTimeout(function () {
        if (conf.callback) {
            conf.callback();
        }

        //  内存回收
        setData = null;
        iniSVG = null;
        getCPoint = null;
        addDefs = null;
        setLevelArr = null;
        countNodesPostion = null;
        getGuanlian = null;
        setRightSubHtml = null;
        addRightList = null;
        appendRightList = null;
        setNodes = null;
        setNodeAttr = null;
        setNewNodeAttr = null;
        renderNodes = null;
        renderLinks = null;
        renderTexts = null;
        renderLineTexts = null;
        addNewNodes = null;
        addToAllDATA = null;
        zoomSvg = null;

    }, 900);

    return dragState;

}

export default Engine;