
import React from 'react';
import BBDPie from '../../../common/echarts/BBDPie';
import { getDistributionDatas } from '../../../../services/home';
import { Grid, LoadingBox, Tip } from 'mtui';
import { shouldComponentUpdateWithoutZoom } from '../../../common/indexComponent/mixins/mixins';

class PieChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            option: null,
            isLoading: true
        };
        this.shouldComponentUpdate = shouldComponentUpdateWithoutZoom.bind(this);
    }
    
    // componentWillReceiveProps(nextProps) {
    //     if (nextProps.dataType !== this.props.dataType) {
    //         this.setState({
    //             dataType: nextProps.dataType
    //         }, () => {
    //             this.getDistributionDatas(this.state.dataType);
    //         });
    //     }
    // }
    getDistributionDatas = () => {
        getDistributionDatas().then((data) => {
            if (data.code === 200) {
                this.initChart(data.content);
            }
        }, (error) => {
            console.error(error.message);
        });
    }
    initChart(datas){
        let dataName = [];
        let pieData = [];
        
        for (let i = 0; i < datas.length; i++) {
            dataName.push(datas[i].k);
            let dataobj = {
                name: datas[i].k,
                value: datas[i].v
            };
            pieData.push(dataobj);
        }
      
        let option = {
            title: {
                left: 0,
                padding: 12,
                textStyle: {
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: 18
                },
                text: '四川省-行业高危企业行业分布'
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c} ({d}%)',
                textStyle: {
                    color: 'rgba(102, 102, 102, 1)',
                    fontSize: 14
                },
                backgroundColor: 'rgba(255,255,255,.9)',
                padding: 5
            },
            legend: {
                icon: 'rect',
                show: false,
                orient: 'horizontal',
                data: dataName
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
                avoidLabelOverlap: false,
                color: ['#0083C4', '#75B8F0', '#00479D', '#75F0DF', '#75F0DF', '#3F8DD7'],
                labelLine: {
                    normal: {
                        length: 20,
                        length2: 45,
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
    }
    componentDidMount() {
        this.getDistributionDatas();
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

export default PieChart;