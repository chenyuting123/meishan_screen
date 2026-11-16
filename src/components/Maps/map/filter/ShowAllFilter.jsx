import React from 'react';

// 展示所有的节点
function ShowAllFilter(obj) {
    // console.log("====>",obj);
    // 转化对象，转化格式，1度，2度，3度区分，然后节点->关联对象/关系区分
    var nodes = obj.nodes;
    var links = obj.links;

    // 整合成新的对象
    var nodesObj = new Object();
    var arrObj = {};
    var category = null;

    // console.log(obj);

    // nodes
    for (var i = 0, len = nodes.length; i < len; i++) {
        nodesObj[nodes[i].name] = {
            name: nodes[i].name, // 名字
            cname: nodes[i].cname, // 名字
            category: nodes[i].category, // 所在度数
            symbol: nodes[i].symbol, // 形状
            color: nodes[i].color, // 背景颜色
            relationDescribe: nodes[i].relationDescribe,
            children: {
                target: [],
                source: []
            }// 子节点 格式： name,line,guanlian,source,target
        }

        // 如果传入的有坐标
        if (nodes[i].x != undefined) {
            nodesObj[nodes[i].name]['x'] = nodes[i].x;
        }
        if (nodes[i].y != undefined) {
            nodesObj[nodes[i].name]['y'] = nodes[i].y;
        }

        // 转化为分度数的数组
        if (arrObj[nodes[i].category] == undefined) {
            arrObj[nodes[i].category] = {
                category: nodes[i].category,
                nodes: []
            };
        }
        arrObj[nodes[i].category].nodes.push(nodesObj[nodes[i].name]);
        category = nodes[i].category;
    }
    // links
    for (var i = 0, len = links.length; i < len; i++) {
        var source = links[i].source;
        var target = links[i].target;
        var objt = {
            name: target,
            line: links[i].line,
            guanlian: links[i].guanlian,
            source: source,
            target: target
        }
        var objs = {
            name: source,
            line: links[i].line,
            guanlian: links[i].guanlian,
            source: source,
            target: target
        }
        // 如果传入有坐标
        if (links[i].x1 != undefined) {
            objt['x1'] = links[i].x1;
            objt['y1'] = links[i].y1;
        }
        if (links[i].x2 != undefined) {
            objs['x2'] = links[i].x2;
            objs['y2'] = links[i].y2;
        }
        if (nodesObj[source]) {
            nodesObj[source].children['target'].push(objt)
        }
        if (nodesObj[target]) {
            nodesObj[target].children['source'].push(objs)
        }
    }

    // 这里应该要执行一次数据缓存
    if (arrObj !== {}) {
        return {
            arr: arrObj,
            obj: nodesObj,
            links: links
        };
    } else {
        console.log('服务器返回数据有错！');
        return false;
    }
}

// ...
export default ShowAllFilter;