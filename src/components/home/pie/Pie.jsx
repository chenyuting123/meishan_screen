/**
 * Created by Administrator on 2017/4/18.
 * Remark 饼图图表
 */
import './pie.scss';
import React, { Component } from 'react';
import CHATBBD from 'Utils/bbdCharts';
class Pie extends Component{
    constructor(props){
        super(props);
        this.state = {};
    }

    /**
     * 绘制chart
     * @param props
     */
    drawChart(props){
        let data = [];
        props.industryRiskDate.map( (item, index) => {
            data[index] = {
                name: item.k,
                value: item.v
            };
        });
        CHATBBD.bbdPie({
            color: ['#49dea4', '#0ad0dd', '#357fc7', '#097aff', '#92c8e8', '#5f4ffe', '#1947ff', '#8c38f4', '#e8f6ff', '#24a54b'],
            chartName: props.chartName,
            data: data,
            name: props.name,
            unit: '家',
            radius: ['40%', '55%'],
            center: ['50%', '50%']
        });
    }

    /**
     * 组件加载完成
     */
    componentDidMount(){
        this.drawChart(this.props);
    }

    /**
     * 组件接收新参数
     * @param nextProps
     */
    componentWillReceiveProps(nextProps){
        if(nextProps.industryRiskDate !== this.props.industryRiskDate){
            this.drawChart(nextProps);
        }
    }
    render(){
        return (
            <div className="pie-chart v-center" style={{ width: '100%', height: '100%' }} id={this.props.chartName} ></div>
        );
    }
}
export default Pie;