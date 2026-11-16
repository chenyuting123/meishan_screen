import './chartFrame.scss';
import React, { Component } from 'react';
import Rank from '../rank/Rank';
import Pie from '../pie/Pie';
import { shouldUpdate } from 'Utils/util';
import { indexDefaultAPI } from 'Services/home';
import { Services } from 'Constants/common';
import Immutable from 'immutable';
import { NoData } from 'CommonComponents';
import { browserHistory } from 'react-router';
import { MAIN, MONITOR, SPECIAL_EVENT, MISTAKE_RULE } from 'RouterPath';
import { getLocal } from 'Utils/storage';

const { INDEX_RISK_COUNT, INDEX_HIGH_RISK_INDUSTRY, INDEX_GROUP_REGION, INDEX_AREA_RISK_LEVEL } = Services;

class ChartFrame extends Component {
    constructor(props) {
        super(props);

        this.state = {
            // icon: props.icon, // icon识别当前组件分发
            areaRiskData: [],
            totalCompanies: 0,
            industryRiskDate: null,
            noData: false
        };
    }

    componentDidMount() {
        this.initData({ once: true });
    }

    componentWillReceiveProps(nextProps) {
        let isNewKeyWord = Immutable.is(nextProps.previewInfo, this.props.previewInfo);
        let isNewKeyWord1 = Immutable.is(nextProps.industry, this.props.industry);
        let isIcon = Immutable.is(nextProps.icon, this.props.icon);
        if (!isNewKeyWord || !isNewKeyWord1 || !isIcon) {
           
            this.initData({ nextProps });
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return shouldUpdate(this.props, nextProps) || shouldUpdate(this.state, nextState);
    }

    render() {
        let
            { previewInfo, isCountry, industry, icon, area } = this.nextProps || this.props,
            industryTitle = industry === '综合监测' ? '' : industry + '-',
            titleInfo = '',
            forTitle = `${previewInfo === '全国' ? '浙江省' : previewInfo}-${industryTitle}`;
        switch (icon) {
            case 'top3':
                titleInfo = `${forTitle}${(area) ? '风险分类监测'  : '区域高危企业数Top3'}`;
                break;
            case 'top5':
                titleInfo = `${forTitle}${'区域高危企业数top5'}`;
                break;
            case 'pie':
                titleInfo = `${forTitle}高危企业行业分布`;
                break;
        }
        return (
            <div className="chat-frame" ref={ite => this._container = ite} key={new Date().getTime()}>
                <div className="head">
                    <span className="title">{titleInfo}</span>
                </div>
                {icon === 'pie' ? this._pieChart() : this._getTopChart()}
            </div>
        );
    }

    initData({ nextProps = this.props, once }) {
       
        // 判断
        let { area, industry, province, city, type, icon, isCountry } = nextProps;
        // if (once && isCountry === undefined && getLocal('user').province === '全国') { //这个不晓得来干嘛的 有bug
        //     isCountry = true;
        // }
        // if (icon === 'top3') {
        //     if (isCountry) {
        //         indexDefaultAPI({ type: INDEX_RISK_COUNT }).then(({ data }) => {
        //             let {
        //                 ruleBreakRiskCompanyCount, ruleBreakRiskCompanyRatio,
        //                 featureRiskCompanyCount, featureRiskCompanyRatio,
        //                 focusOnCompanyCount, focusOnCompanyRatio
        //             } = data;
        //             let areaRiskData = [
        //                 {
        //                     'region': '违规预警企业',
        //                     'highCompany': ruleBreakRiskCompanyCount,
        //                     'proportion': ruleBreakRiskCompanyRatio
        //                 },
        //                 {
        //                     'region': '特征事件预警企业',
        //                     'highCompany': featureRiskCompanyCount,
        //                     'proportion': featureRiskCompanyRatio
        //                 },
        //                 {
        //                     'region': '已重点监控企业',
        //                     'highCompany': focusOnCompanyCount,
        //                     'proportion': focusOnCompanyRatio
        //                 }
        //             ];
        //             let totalCompanies = 0;
        //             areaRiskData.map(({ highCompany }) => {
        //                 totalCompanies += highCompany;
        //             });
        //             this.setState({ areaRiskData, noData: data.length === 0 || !data, totalCompanies });
        //         });
        //     }
        // }

        if (icon === 'top5' || (icon === 'top3')) {
            if (type !== 'area') {
                this._getIndexGroup(nextProps || this.props);
            } else {
                this._getAreaRisLevel(nextProps || this.props);
            }
        }

        if (icon === 'pie') {
            this.setState({ industryRiskDate: null, noData: false }, () => {
                indexDefaultAPI(
                    {
                        type: INDEX_HIGH_RISK_INDUSTRY,
                        data: {
                            province: '浙江省',
                            city,
                            area
                        }
                    }
                ).then(({ data }) => {
                    let industryRiskDate = null;
                    if (data.length > 0) {
                        industryRiskDate = data.map((ite, index) => {
                            let { industry, highCompany } = ite;
                            industry = industry.replace('红警', '');
                            return { k: industry, v: highCompany };
                        });
                    }
                    this.setState({ industryRiskDate, noData: data.length === 0 || !data });
                });
            });

        }
    }

    _getIndexGroup(props) {
        let { area, isCountry, industry, province, city, type, icon } = props;
        indexDefaultAPI({
            type: INDEX_GROUP_REGION, data: {
                province: '浙江省',
                city, area, 
                industry: (industry === '综合监测') ? '' : industry,
                riskLevel: '高危预警'
            }
        }).then(({ data }) => {
            let areaRiskData = data.filter((ite, index) => index < (icon === 'top5' ? 5 : 3));
            this.setState({
                areaRiskData,
                noData: data.length === 0 || !data,
                totalCompanies: 0
            });
        });
    }

    _getAreaRisLevel(props) {
        let { area, isCountry, industry, province, city, type, icon } = props;
        indexDefaultAPI({
            type: INDEX_AREA_RISK_LEVEL,
            data: {
                province: '浙江省', 
                city, area,
                industry: (industry === '综合监测') ? '' : industry
            }
        }).then(({ data }) => {
            let {
                    focusOn,
                    highCompany,
                    monitorCompany,
                    sustainMonitor
                } = data,
                focusOnRatio = focusOn / monitorCompany,
                highCompanyRatio = highCompany / monitorCompany,
                sustainMonitorRatio = sustainMonitor / monitorCompany;
            let areaRiskData = [
                {
                    'region': '高危预警',
                    'highCompany': highCompany,
                    'proportion': highCompanyRatio
                },
                {
                    'region': '重点关注',
                    'highCompany': focusOn,
                    'proportion': focusOnRatio
                },
                {
                    'region': '持续监控',
                    'highCompany': sustainMonitor,
                    'proportion': sustainMonitorRatio
                }
            ];
            this.setState({ areaRiskData, totalCompanies: 0, noData: data.length === 0 || !data });
        });
    }

    _getTopChart() {
        let { totalCompanies, areaRiskData } = this.state;
        let { isCountry, industry, icon } = this.nextProps || this.props;
        let comp = areaRiskData.map((item, index) => {
            let { region, highCompany, proportion } = item;
            return <div className={icon === 'top3' ? 'rank-box-top3' : ''} key={index} onClick={() => {
                let path = '';
                switch (index) {
                    case 0: {
                        path = `/${MAIN}/${MISTAKE_RULE}`;
                        break;
                    }
                    case 1: {
                        path = `/${MAIN}/${SPECIAL_EVENT}`;
                        break;
                    }
                    case 2: {
                        path = `/${MAIN}/${MONITOR}`;
                        break;
                    }
                }
                isCountry && industry === '综合监测' && path && browserHistory.push(path);
            }}>
                <Rank totalCompanies={totalCompanies} cityName={region} parent={this}
                      showStyle={(icon === 'top3' && isCountry) ? true : false}
                      value={highCompany} percent={proportion}
                      charrtName={'rank' + index}/>
            </div>;
        });

        return comp.length > 0
            ?
            <div className="rank-content clearfix">{comp}</div>
            : this._loadingComp();
    }

    _pieChart() {
        let { industryRiskDate } = this.state;
        let comp = <div className="pie-content clearfix">
            <Pie className="pie" industryRiskDate={industryRiskDate} name="高危企业数"
                 chartName="riskPie"/>
        </div>;
        return industryRiskDate ? comp : this._loadingComp();
    }

    _loadingComp = () => {
        let { noData } = this.state;
        return <NoData isNoData={noData}/>;
    };
}

export default ChartFrame;