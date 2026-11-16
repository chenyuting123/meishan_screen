
import React from 'react';
import BBDPie from '../../../common/echarts/BBDPie';
import { Grid, LoadingBox, Tip } from 'mtui';
import { shouldComponentUpdateWithoutZoom } from '../../../common/indexComponent/mixins/mixins';
let Immutable = require('immutable');
class IllegalPie extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            option: null,
            isLoading: true
        };
        this.shouldComponentUpdate = shouldComponentUpdateWithoutZoom.bind(this);
    }
    componentDidMount() {
        let { pieData } = this.props;
        this.initChart(pieData);
    }
    
    /**
     * 参数更新处理
     * @param nextProps
     */
    componentWillReceiveProps(nextProps) {
        let { pieData } = nextProps;
        let isPieData = Immutable.is(pieData, this.props.pieData);
        if (!isPieData) {
            this.initChart(pieData);
        }
    }
   
    initChart(data){
        if (data.length > 0) {
            let pieData = [];
            let data_name = [];
            for (let i = 0; i < data.length; i++){
                data[i]['companName'] = data[i]['companName'] + ' ' + data[i]['companNumber'];
                data_name.push(data[i]['companName']);
                let obj = {
                    name: data[i]['companName'],
                    value: data[i]['companNumber'] 
                };
                pieData.push(obj);
            }
            let option = {
                tooltip: {
                    trigger: 'item',
                    formatter: '{b}',
                    textStyle: {
                        color: 'rgba(102, 102, 102, 1)',
                        fontSize: 14
                    },
                    backgroundColor: 'rgba(255,255,255,.9)',
                    padding: 5
                },
                legend: {
                    orient: 'vertical',
                    top: 'center',
                    left: 10,
                    data: data_name,
                    itemGap: 5,
                    formatter: function (name) {
                        return  name.split(' ')[0];
                    },
                    textStyle: {
                        color: 'rgba(102,102,102,1)',
                        fontWeight: 'normal',
                        fontFamily: '宋体',
                        fontSize: 12
                    }
                },
                grid: {
                    // top: '35%',
                    bottom: '1%',
                    containLabel: true
                },
                
                series: [{
                    name: '',
                    type: 'pie',
                    selectedMode: true,
                    selectedOffset: 10,
                    avoidLabelOverlap: true,
                    center: ['60%', '50%'],
                    labelLine: {
                        normal: {
                            length: 10,
                            length2: 25,
                            show: true
                        }
        
                    },
                    roseType: false,
                    radius: ['40%', '55%'],
                    data: pieData
                }]
            };
            this.setState({
                option: option,
                isLoading: false
            });
        } else{
            this.setState({
                option: null,
                isLoading: true
            });
            return;
        }
    }
    render() {
        var chartBox = '';
        if (this.state.isLoading) {
            chartBox = <Grid style={{ height: '100%' }} width="1/1">
                <LoadingBox info="数据载入中" type="loading2" />
            </Grid>;
        } else if (this.state.option) {
            chartBox = <BBDPie option={this.state.option} style={{ height: '100%', width: '100%' }} />;
        }
        return (
            <div className="mod">
                {chartBox}
            </div>
        );
    }
}

export default IllegalPie;