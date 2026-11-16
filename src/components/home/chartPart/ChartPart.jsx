/*
* author:TanJun
* describe:topMenu
* createTime:2018/6/13
* */

import './chartPart.scss';
import React, { Component } from 'react';
import ChartFrame from '../../../components/home/chartFrame/ChartFrame';
import { getLocal } from 'Utils/storage';
import emitter from 'Utils/emitter';
import { directlyCity } from '../../../constants/common';
import { CROSS_REGION_PATH } from 'RouterPath';
import { contains, shouldUpdate } from 'Utils/util';
// 网络借贷
import AverageProfit from '../../../components/home/averageProfit/AverageProfit';
import AverageLoanDate from '../../../components/home/averageLoanDate/AverageLoanDate';
// 交易场所
import TradeType from '../../../components/home/tradeType/TradeType';
import TradeVariety from '../../../components/home/tradeVariety/TradeVariety';
// 私募基金
import PrivateProductNumber from '../../../components/home/privateProductNumber/PrivateProductNumber';
import PrivateType from '../../../components/home/privateType/PrivateType';
import TimeSequence from '../../../components/home/timeSequence/TimeSequence';// 区域高危企业时序图 （复用）
import RightPlan from '../../../components/home/rightPlan/RightPlan'; // 首页右侧
import BarChart from '../../../components/home/rightPlan/mychart/BarChart';

class ChartPart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            monitorArea: props.province,  // 监测地区
            province: getLocal('user').province,  // 当前省份
            monitorIndustry: '综合监测',  // 当前选择的行业
            isComprehension: true, // 是否为综合监测
            isDirectliCity: false, // 是否为直辖市
            areaInfo: false, // 地区详情信息
            LoadingAreaRiskData: false, // 是否在加载区域高危企业数据
            noData: false,
            topBarlen: 0
        };
    }

    componentDidMount() {
        emitter.on('CHANGE_MONITOR_AREA', this._getMonitorAreaData);  // 监测区域改变 => getMonitorAreaData
        // 直辖市情况
        let { province, monitorArea } = this.state;
        let isDirectliCity = false;
        if (contains(directlyCity, province)) {
            isDirectliCity = true;
            this.setState({
                operatingCity: province,
                isDirectliCity: isDirectliCity
            });
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return shouldUpdate(this.state, nextState);
    }

    componentWillUnmount() {
        emitter.removeListener('CHANGE_MONITOR_AREA', this._getMonitorAreaData);
    }

    render() {
        let comps = this._getComps();
        /*
       * 综合监测
       * */

        return (
            <div className="home-right">
                {comps}
            </div>
        );
    }

    /**
     * 获取子组件
     * */
    _getComps() {
        let comps = <div></div>;
        let { monitorIndustry } = this.state;
        switch (monitorIndustry) {
            case '综合监测': {
                comps = this._getComprehensive();
                break;
            }
            case '网络借贷': {
                comps = this._getNetworkLoan();
                break;
            }
            case '私募基金': {
                comps = this._getPrivateOfferingFund();
                break;
            }
            case '交易场所': {
                comps = this._getTradingPlace();
                break;
            }
            case '小额贷款':
            case '融资担保':
            case '新兴金融': {
                comps = this._getCommon();
                break;
            }
            default: {
                comps = this._getCommon();
                break;
            }

        }
        return comps;
    }

    /**
     * 获取综合监测组件
     * */
    _getComprehensive() {
        let { areaInfo } = this.state;
        let comp = <div>
            <ChartFrame key={0} icon="top3" {...areaInfo}/>
            <ChartFrame key={1} icon="pie" {...areaInfo}/>
            <RightPlan {...areaInfo} />
        </div>;
        return comp;
    }

    /**
     * 获取网络借贷组件
     * */
    _getNetworkLoan() {
        let { areaInfo } = this.state;
        let comp = <div>
            {this._getTop5()}
            <AverageProfit {...areaInfo}/>
            <AverageLoanDate {...areaInfo}/>
        </div>;
        return comp;
    }

    /**
     * 获取私募基金组件
     * */
    _getPrivateOfferingFund() {
        let { areaInfo } = this.state;
        let comp = <div>
            {this._getTop5()}
            <PrivateProductNumber {...areaInfo}/>
            <PrivateType {...areaInfo}/>
        </div>;
        return comp;
    }

    /**
     * 获取交易场所组件
     * */
    _getTradingPlace() {
        let { areaInfo } = this.state;
        let comp = <div>
            {this._getTop5()}
            <TradeType {...areaInfo}/>
            <TradeVariety {...areaInfo}/>
        </div>;
        return comp;
    }

    /**
     * 获取小额贷款、融资担保、新兴金融组件
     * */
    _getCommon() {
        let { areaInfo } = this.state;
        let comp = <div>
            <ChartFrame {...areaInfo} key={3} icon="top5"/>
            <TimeSequence {...areaInfo} />
            <RightPlan comType={false} {...areaInfo}/>
        </div>;
        return comp;
    }

    /**
     * 获取top5的图标
     * */
    _getTop5() {
        let { areaInfo } = this.state;
        return <div className="top-chart-box">
            <p className="chart-title">{`${areaInfo.previewInfo === '全国' ? '浙江省' : (areaInfo.type && areaInfo.type === 'area' && (areaInfo.industry === '网络借贷' || areaInfo.industry === '私募基金')) ? areaInfo.city : areaInfo.previewInfo}-${areaInfo.industry}-区域高危企业数Top5`}</p>
            <div className="chart-box">
                <BarChart {...areaInfo}/>
            </div>
        </div>;
    }
    _getMonitorAreaData = (info) => {
        if (info) {
            this.setState({ areaInfo: info, monitorIndustry: info.industry });
        } else {
            this.forceUpdate();
        }
    };
}

export default ChartPart;