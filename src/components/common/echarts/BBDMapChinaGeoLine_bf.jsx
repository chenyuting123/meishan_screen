/*
* @type 地图
* @author xuyao
*/
import React , { Component, PropTypes } from 'react';

/*中国地图迁徙图*/
class BBDMapChinaGeoLine_bf extends Component {
    static propTypes = {
        option: React.PropTypes.object.isRequired,
        style: React.PropTypes.object,
        className: React.PropTypes.string,
        theme: React.PropTypes.string,
        onChartReady: React.PropTypes.func,
        showLoading: React.PropTypes.bool,
        onEvents: React.PropTypes.object
    };
    setOption(parm){
        let data = parm.data;
        let geoCoordMap = parm.geoCoordMap;
        let direction=parm.direction;
        let convertData = function (data) {
            let res = [];
            for (let i = 0; i < data.length; i++) {
                let dataItem = data[i];
                let fromCoord = geoCoordMap[dataItem[0].name];
                let toCoord = geoCoordMap[dataItem[1].name];
                if (fromCoord && toCoord) {
                    res.push({
                        fromName: dataItem[0].name,
                        toName: dataItem[1].name,
                        coords: [fromCoord, toCoord]
                    });
                }
            }
            return res;
        };
        let option = {
            backgroundColor: 'none',
            title : {
                left: 'center',
                textStyle : {
                    color: '#fff'
                }
            },
            tooltip : {
              show:true,
              trigger: 'item',
              formatter:function(data){
                 return data.name;
              }
            },
            grid:{

            },
            geo: {
              map: 'china',
              top:"2%",
              left:"5%",
              right:"5%",
              bottom:"2%",
              roam:false,
              label: {
                    emphasis: {
                        show: false
                    }
                },
                itemStyle: {
                    normal: {
                        areaColor: 'none',
                        borderColor: '#5a87d8',
                        borderWidth:1
                    },
                    emphasis: {
                        areaColor: '#25a9c3'
                    }
                }
            },
            series: [
                {//线
                    name: '上海',
                    type: 'lines',
                    zlevel: 3,
                    effect: {
                        show: true,
                        period: 6,
                        trailLength: 0.7,
                        color: 'yellow',
                        symbolSize: 3
                    },
                    lineStyle: {
                        normal: {
                            color: '#facd89',
                            width: 0,
                            curveness: 0.2
                        }
                    },
                    data: convertData(data)
                },
                {//线上移动的图标
                    name: '',
                    type: 'lines',
                    zlevel: 2,
                    // symbol: ['none', 'arrow'],
                    // symbolSize: 10,
                    effect: {
                        show: false,
                        period: 6,
                        trailLength: 0,
                        symbol: '',
                        symbolSize: 15
                    },
                    lineStyle: {
                        normal: {
                            color: '#facd89',
                            width: 1,
                            opacity: 0.4,
                            curveness: 0.2
                        }
                    },
                    data: convertData(data)
                },
                {//圆点
                    name: '上海',
                    type: 'effectScatter',
                    coordinateSystem: 'geo',
                    zlevel: 2,
                    rippleEffect: {
                        brushType: 'stroke'
                    },
                    label: {
                        normal: {
                            show: false,
                            position: 'right',
                            formatter: function(v){
                            }
                        },
                        emphasis:{
                            show:true
                        }
                    },
                    symbolSize: function (val) {
                        if(direction ==0){
                            if (val[2] >200000){
                                return 1
                            } else if(val[2]>5000 && val[2]< 200000) {
                                return val[2]/500;
                            }else if(val[2]>1000 && val[2]< 5000){
                                return val[2]/100
                            }else if(val[2]>500 && val[2]< 1000){
                                return val[2]/90
                            }else if(val[2]>100 && val[2]< 500){
                                return val[2]/40
                            }else if(val[2]>10 && val[2]< 100){
                                return val[2]/20
                            }else if(val[2]>0 && val[2]<10){
                                return val[2]*3
                            }
                        }else{
                            if (val[2] >200000){
                                return val[2]/20000
                            }else if(val[2]>100000 && val[2]<200000){
                                return val[2]/10000
                            }else if(val[2]>50000 && val[2]<100000){
                                return val[2]/8000
                            }else if(val[2]>10000 && val[2]<50000){
                                return val[2]/4000
                            }else if(val[2]>5000 && val[2]<10000){
                                return val[2]/1000
                            }else if(val[2]>1000 && val[2]< 5000){
                                return val[2]/100
                            }else if(val[2]>500 && val[2]< 1000){
                                return val[2]/50
                            }else if(val[2]>100 && val[2]< 500){
                                return val[2]/40
                            }else if(val[2]>10 && val[2]< 100){
                                return val[2]/20
                            }else if(val[2]>0 && val[2]<10){
                                return val[2]*3
                            }
                        }

                    },
                    itemStyle: {
                        normal: {
                            color: "#52f5f6"
                        }
                    },
                    data: data.map(function (dataItem) {
                        return {
                            name: dataItem[direction].name,
                            value: geoCoordMap[dataItem[direction].name].concat([dataItem[direction].value])
                        };
                    })
                },
                {   //圆点
                    name: '',
                    type: 'effectScatter',
                    coordinateSystem: 'geo',
                    zlevel: 10,
                    rippleEffect: {
                        brushType: 'stroke'
                    },
                    label: {
                        normal: {
                            show: false,
                            position: 'right',
                            formatter: '{b}'
                        }
                    },
                    symbolSize: function (val) {
                        return val[2] / 8+10;
                    },
                    itemStyle: {
                        normal: {
                            color: "red"
                        }
                    },
                    data: [{
                        name:"上海",
                        value:[121.4648,31.2891,40]
                    }]
                }
            ]
        };
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
        // if (typeof this.props.onChartReady === 'function') this.props.onChartReady(echartObj);
        // elementResizeEvent(this.refs.echartsDom, function() {
        //  echartObj.resize();
        // });
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
            height: '300px'
        };
        return ( < div ref = 'echartsDom' style = {style} />
        );
    }
}

export default BBDMapChinaGeoLine_bf;