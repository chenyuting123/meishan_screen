/*
* @type 折线图
* @author hejie
*/
import React , { Component, PropTypes } from 'react';
class BBDLine extends Component {
    static propTypes = {
        option: React.PropTypes.object.isRequired,
        style: React.PropTypes.object,
        className: React.PropTypes.string,
        theme: React.PropTypes.string,
        onChartReady: React.PropTypes.func,
        showLoading: React.PropTypes.bool,
        onEvents: React.PropTypes.object
    }
    setOption(parm){
        let seriesLineData = [];
        for (let i = 0; i < parm.series.length; i++) {
            var lineAreaStyle={};
            if(parm.lineGradient){
                lineAreaStyle= {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: parm.lineGradient[i][0]
                        }, {
                            offset: 1,
                            color: parm.lineGradient[i][1]
                        }])
                    }
                }
            }
            let seriesBarItem = {
                "type": "line",
                "name": parm.legend[i],
                "label":parm.lineLable == undefined ? {} : parm.lineLable, 
                "areaStyle": lineAreaStyle,
                 itemStyle:{
                    normal:{
                        color:parm.color[i]
                    }
                },
                "symbolSize": parm.symbolSize,
                "data": parm.series[i]
            };
            seriesLineData.push(seriesBarItem);
        }
        const option = {
            color: parm.color,
            title: {
                show:parm.titleShow==undefined?false:true,
                text: parm.title,
                x: parm.titleX,
                padding: [10, 0, 0, 15],
                textStyle: {
                    color: "#fff",
                    fontSize: 16,
                    fontWeight: "normal",
                    fontFamily: 'Microsoft Yahei'
                }
            },
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(0,0,0,0.7)',
                padding: [10, 10, 10, 10],
                formatter: function (v) {
                    var info=v[0].name+"<br/>";
                    for(var i=0;i<v.length;i++){
                        var _until = parm.unit? "":parm.unit[i];
                        var _spanCorlor='<span style=color:'+parm.color[i]+'>' + v[i].value +_until+ '</span><br/>';
                         info+=v[i].seriesName+" :&nbsp;"+ _spanCorlor
                    }
                    return info;
                },
                axisPointer: {
                    type: 'none'
                }
            },
            grid: parm.grid==undefined ?{top:'10%',left: '5%',right: '5%',bottom: '5%',containLabel: true}:parm.grid,
            legend: {
                data: parm.legend,
                itemWidth:20,
                itemHeight:5,
                show: parm.legendIsShow==undefined?false:parm.legendIsShow,
                right: parm.legendRight == undefined ? "auto" : parm.legendRight,
                bottom: parm.legendBottom == undefined ? "auto" : parm.legendBottom,
                top:parm.legendTop == undefined ? "auto" : parm.legendTop,
                padding: parm.legendPadding== undefined ? [15,0,0,0] : parm.legendPadding,
                textStyle: {
                    color: "#99a3b7",
                    fontSize: 12,
                    fontFamily: 'Microsoft Yahei'
                }
            },
            xAxis: {
                type: 'category',
                data: parm.xAxis,
                axisLabel: {
                    formatter: '{value}',
                    textStyle: {
                        color: "#99a3b7",
                        fontSize: 12,
                        fontFamily: 'Microsoft Yahei'
                    }
                },
                axisLine: {
                    lineStyle: {
                        width: 1,
                        color: '#353b45',//'#8f949a'
                    }
                },
                axisTick: {
                    show: false
                }
            },
            yAxis: {
                name: parm.yAxisName,
                // interval:parm.yInterval==undefined?"":parm.yInterval,
                // max:parm.yMax==undefined?"auto":parm.yMax,
                // min:parm.yMin==undefined?"auto":parm.yMin,
                nameTextStyle: {
                    color: "#7f868e"
                },
                type: 'value',
                axisTick: {
                    show: false
                },
                splitLine: {
                    lineStyle: {
                        width: 1,
                        color: '#353b45'
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: '#353b45'
                    }
                },
                axisLabel: {
                    formatter: '{value}' + parm.yFlag,
                    textStyle: {
                        color: "#99a3b7",
                        fontSize: 12,
                        fontFamily: 'Microsoft Yahei'
                    }
                }
            },
            series: seriesLineData
        }
        return option;
    }
    componentDidMount() {
        let echartObj = this.renderEchartDom();
        let onEvents = this.props.onEvents || [];
        for (let eventName in onEvents) {
            if (typeof eventName === 'string' && typeof onEvents[eventName] === 'function') {
                echartObj.on(eventName, function(param) {
                    onEvents[eventName](param, echartObj);
                });
            }
        }
        $(window).resize(function(){
           echartObj.resize();
        });
    }
    componentDidUpdate() {
        this.renderEchartDom()
    }
    componentWillUnmount() {
        echarts.dispose(this.refs.chart)
    }
    renderEchartDom() {
        let echartObj = this.getEchartsInstance();
        echartObj.setOption(this.setOption(this.props.option));
        if (this.props.showLoading) {
            echartObj.showLoading();
        } else {
            echartObj.hideLoading();
        }
        return echartObj;
    }
    getEchartsInstance() {
        return echarts.getInstanceByDom(this.refs.echartsDom) || echarts.init(this.refs.echartsDom, this.props.theme);
    }
    render() {
        let style = this.props.style || {
            height: '100%'
        };
        return ( < div ref = 'echartsDom' style = {style} />
        );
    }
}
export default BBDLine;