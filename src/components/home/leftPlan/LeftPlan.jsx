/*
 * @desc 首页左侧侧面板
 * @author lijing
 */
import './leftPlan.scss';
import React, { Component } from 'react';
import { AacroAnalysis } from '../../common/indexComponent/IndexComponent'; // 总体分析
import TendencyChart from './tendencyChart/TendencyChart'; // 发展趋势（气泡图）
import RiskTrend from './riskTrend/RiskTrend'; // 风险走势（折线图）
import { isNumber, shouldUpdate } from 'Utils/util';
import emitter from 'Utils/emitter';
import { findIndexTotalInfo } from '../../../services/home';
import { validate } from '../map/myUi/util';

export default class LeftPlan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            indexTotalInfoData: null
        };
    }

    componentDidMount() {
        emitter.on('CHANGE_MONITOR_AREA', this.getArea);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return shouldUpdate(this.state, nextState);
    }

    componentWillUnmount() {
        emitter.removeListener('CHANGE_MONITOR_AREA', this.getArea);
    }

    /**
     * 获取整体分析
     * */
    getArea = (data) => {
        let { area, isCountry, city, industry, province, type } = data;
        if(isCountry){
            type = 'province', province = '浙江省', isCountry = false;
            let data = { type: 'province', industry: '综合监测', previewInfo: '浙江省', province: '浙江省' };
            this._tendency.getArea(data);
            this._riskTrend.getArea(data);
        }else{
            // if(data.area === '梅山保税港区' || data.area === '宁波保税区') {
            //     let trueData = Object.assign(data, { area: '北仑区', previewInfo: '北仑区' });
            //     this._tendency.getArea(trueData);
            //     this._riskTrend.getArea(trueData);
            // } else {
            this._tendency.getArea(data);
            this._riskTrend.getArea(data);
            // }
        }
        // 总体分析
        findIndexTotalInfo({
            province: !isCountry ? province : '',
            city: city,
            area: area,
            industry: industry === '综合监测' ? null : industry
        }).then(({ data }) => {
            let { date, avgRiskIndex, totalRegionCount, totalCompanyCount, monthAddCompanyCount } = data;
            let info = {
                type: industry === '综合监测' ? '新金融风险指数' : industry + '风险指数',
                date: date,
                score: isNumber(avgRiskIndex) ? Math.round(avgRiskIndex * 100) / 100 : 0,
                areaNum: totalRegionCount,
                enterprisesNum: totalCompanyCount,
                monthNum: validate(monthAddCompanyCount) ? ('+' + monthAddCompanyCount) : monthAddCompanyCount
            };
            this.setState({
                indexTotalInfoData: info
            });
        });
        // this._tendency.getArea(data);
        // this._riskTrend.getArea(data);
    };

    render() {
        let { indexTotalInfoData } = this.state;
        return (
            <div className="leftPlan_root">
                <AacroAnalysis
                    {...indexTotalInfoData}
                    style={{ marginBottom: '10px' }}/>
                <TendencyChart ref={ite => this._tendency = ite}/>
                <RiskTrend ref={ite => this._riskTrend = ite}/>
            </div>
        );
    }
}