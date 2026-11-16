import React from 'react';

//  展示额外的节点
function ExtFilter(obj) {
    // console.log("====>",obj);
    // 转化对象，转化格式，1度，2度，3度区分，然后节点->关联对象/关系区分

    if (obj == undefined) {
        console.log("服务器返回数据有错！");
        return false
    }

    var nodes = obj.nodes;
    var links = obj.links;

    // 整合成新的对象
    var nodesObj = new Object();
    var arrObj = {};
    var category = null;

    // console.log("~~~~~~~",obj);

    // nodes
    var $g_nodes = $("#MapSvg .g_nodes");
    var nArr = [];
    for (var i = 0, len = nodes.length; i < len; i++) {
        // 去重
       
        var $nodes = $g_nodes.find('image[data-name=' + nodes[i].name + ']');
        if ($nodes[0] == undefined || nodes[i].category == '0') {
            // console.log(nodes[i].name);
            nodesObj[nodes[i].name] = {
                cname: nodes[i].cname, // 名字
                name: nodes[i].name, // 名字
                category: nodes[i].category, // 所在度数
                symbol: nodes[i].symbol, // 形状
                color: nodes[i].color, // 背景颜色
                children: {
                    target: [],
                    source: []
                }// 子节点 格式： name,line,guanlian,source,target
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
    }

    // links
    var $g_links = $("#MapSvg .g_links");
    for (var i = 0, len = links.length; i < len; i++) {
        var source = links[i].source;
        var target = links[i].target;

        // 去重
        var $links = $g_links.find('[data-source=' + source + '][data-target=' + target + ']');
        if ($links[0]) {
            links[i] = false
        } else {
            if (nodesObj[source] != undefined) {
                nodesObj[source].children['target'].push({
                    name: target,
                    line: links[i].line,
                    guanlian: links[i].guanlian,
                    source: source,
                    target: target
                })
            }
            if (nodesObj[target] != undefined) {
                nodesObj[target].children['source'].push({
                    name: source,
                    line: links[i].line,
                    guanlian: links[i].guanlian,
                    source: source,
                    target: target
                })
            }
        }
    }
    var newLinks = [];
    for (var i = 0; i < links.length; i++) {
        if (links[i]) {
            newLinks.push(links[i]);
        }
    }

    // 这里应该要执行一次数据缓存
    if (arrObj != {}) {
        return {
            arr: arrObj,
            obj: nodesObj,
            links: newLinks
        };
    } else {
        console.log("服务器返回数据有错！");
        return false
    }
}

// ...
export default ExtFilter;