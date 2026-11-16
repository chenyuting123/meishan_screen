(function () {
    function findReactInstance(dom) {
      if (!dom) return null;
      for (var k in dom) {
        if (k.indexOf('__reactInternalInstance') === 0 || k.indexOf('__reactFiber') === 0) {
          return dom[k];
        }
      }
      return null;
    }
    function collectEcharts(node, out) {
      if (!node || out.length > 40) return;
      try {
        if (node._instance && node._instance._echartObj && node._instance._echartObj.resize) {
          out.push(node._instance._echartObj);
        }
        if (node.stateNode && node.stateNode._echartObj && node.stateNode._echartObj.resize) {
          out.push(node.stateNode._echartObj);
        }
        // React 15
        if (node._renderedComponent) collectEcharts(node._renderedComponent, out);
        if (node._renderedChildren) {
          for (var ck in node._renderedChildren) {
            collectEcharts(node._renderedChildren[ck], out);
          }
        }
        // Fiber
        if (node.child) collectEcharts(node.child, out);
        if (node.sibling) collectEcharts(node.sibling, out);
        if (node.memoizedState) {
          // skip
        }
      } catch (e) {}
    }
    function resizeCharts() {
      try {
        var list = [];
        if (window.ECHART_ROOM && window.ECHART_ROOM.length) {
          for (var r = 0; r < window.ECHART_ROOM.length; r++) {
            if (window.ECHART_ROOM[r] && window.ECHART_ROOM[r].resize) list.push(window.ECHART_ROOM[r]);
          }
        }
        var nodes = document.querySelectorAll('[_echarts_instance_], .mod, .chart-box, .map-chart');
        for (var i = 0; i < nodes.length; i++) {
          var instRoot = findReactInstance(nodes[i]);
          if (instRoot) collectEcharts(instRoot, list);
          if (window.echarts && window.echarts.getInstanceByDom) {
            var g = window.echarts.getInstanceByDom(nodes[i]);
            if (g) list.push(g);
          }
        }
        var seen = {};
        for (var j = 0; j < list.length; j++) {
          var chart = list[j];
          var id = chart.id || j;
          if (seen[id]) continue;
          seen[id] = 1;
          try {
            var opt = chart.getOption && chart.getOption();
            if (opt && opt.grid) {
              var grids = Object.prototype.toString.call(opt.grid) === '[object Array]' ? opt.grid : [opt.grid];
              var next = [];
              for (var g = 0; g < grids.length; g++) {
                next.push(Object.assign({}, grids[g] || {}, {
                  containLabel: true,
                  left: 58,
                  right: 36,
                  top: 52,
                  bottom: 42
                }));
              }
              chart.setOption({ grid: next.length === 1 ? next[0] : next }, false);
            }
            chart.resize();
          } catch (e) {}
        }
        window.dispatchEvent(new Event('resize'));
      } catch (e) {}
    }
    window.addEventListener('load', function () {
      setTimeout(resizeCharts, 400);
      setTimeout(resizeCharts, 1200);
      setTimeout(resizeCharts, 2000);
    });
    window.addEventListener('resize', function () {
      setTimeout(resizeCharts, 80);
    });
  })();
