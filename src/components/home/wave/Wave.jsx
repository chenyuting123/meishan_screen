/**
 * Created by Administrator on 2017/4/17.
 * Remark 波浪图表
 */
import './wave.scss';
import React, { Component } from 'react';
import CHATBBD from 'Utils/bbdCharts';
import { isNumber } from 'Utils/util';

class Wave extends Component{
    constructor(props){
        super(props);
        this.state = {
        };
    }
    _drawChart(monitorRegion){
        CHATBBD.bbdWave({
            chartName: 'wave',
            monitorRegion: monitorRegion // 监测地区
        });
    }

    /**
     * 组件加载完成
     */
    componentDidMount(){
        this._drawChart(this.props.monitorRegion);
    }

    /**
     * 组件将接受新参数
     * @param nextProps
     */
    componentWillReceiveProps(nextProps){
        if(nextProps.monitorRegion !== this.props.monitorRegion){
            this._drawChart(nextProps.monitorRegion);
        }
    }
    render(){
        let { levelThree, monitorRegion } = this.props;
        return(
            <div className="wave-chart">
                <div id="wave" className="wave" style={{ width: this.props.width, height: this.props.height }}></div>
                <div className="monitor textC">
                    {
                        isNumber(monitorRegion) ?
                            <div>
                                <p><em className="monitorIndex">{monitorRegion}</em><em className="small-font">个</em></p>
                                <p className="mt10">监测地区</p>
                            </div> :
                            !levelThree && (monitorRegion.indexOf('市') !== -1 || monitorRegion.indexOf('州')) !== -1 ? null :
                            <div>
                                <p>监测地区</p>
                                <p className="mt10"><em className="monitorIndex">{monitorRegion}</em></p>
                            </div>
                    }
                </div>
            </div>
        );
    }

}
export default Wave;