/*
* author:TanJun
* describe:SearchList
* createTime:2018/6/21
* */
// import './index.scss';
import React, { Component } from 'react';
import { switchIndustry, switchIndustryYW, fieldAnomaly } from 'Utils/formatter';
import { Link } from 'react-router';
import { Tip } from 'mtui';
import { DEFAULT_DETAIL, BLACK, ANALYSIS_DETAIL } from 'RouterPath';
import { higgschartsType } from 'Constants/higgscharts';
import { classIndustry } from 'Constants/common';

const { CIRCLE } = higgschartsType;

class SearchResultList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: 'SearchList'
        };
    }

    render() {
        let { total, listData, listLoading } = this.props;
        return <div>
            <div className="header"><span>共搜索到 <em>{total}</em> 条相关结果</span></div>
            <div className="content">
                {
                    !(listData.length > 0) ? (
                            <div className="no-data"><span>{listLoading}</span></div>) :
                        listData.map(({
                                          hasPermission, black, rise, riskLevel, regcap, bbdQyxxId,
                                          riskIndex, hightLight, companyEnterpriseStatus, industry,
                                          unHighLightCompanyName, address, esdate, companyName, frname,
                                          bbdHistoryName
                                      }, index) => {
                            let isClassIndustry = classIndustry.find(({ name }, index) => name === industry);
                            let riseIcon = ''; // 易燃指数是否上升；1:上升，0：持平，-1：下降 ,
                            let colorName = 'conpany-soure ',
                                riskLevelSpan = '',
                                riskIndexSpan = '';

                            if (black) {
                                colorName += 'black';
                            } else {
                                switch (rise) {
                                    case 1: {
                                        riseIcon = 'icon-up2';
                                        break;
                                    }
                                    case -1: {
                                        riseIcon = 'icon-down2';
                                        break;
                                    }
                                }

                                switch (riskLevel) {
                                    case '高危预警': {
                                        colorName += 'orange';
                                        break;
                                    }
                                    case '重点关注': {
                                        colorName += 'yellow';
                                        break;
                                    }
                                    case '持续监控': {
                                        colorName += 'sky';
                                        break;
                                    }
                                }

                            }
                            riseIcon = <em className={'iconfont ' + riseIcon}> </em>;
                            riskLevelSpan = <span className="danger-text">{black ? '黑名单' : riskLevel}</span>;
                            riskIndexSpan = <span
                                className="danger-num"
                                style={{ width: 120 }}><span>{black ? '' : (riskIndex ? riskIndex : '')}</span>{black ? '' : riseIcon ? riseIcon : ''}</span>;

                            let {
                                    p2pPlatform, gdxx, baxx, regno,
                                    creditCode, patent, rjzzq, tradeMark
                                } = hightLight,
                                name = '', html = '';

                            if (p2pPlatform) {
                                name = '平台：';
                                html = p2pPlatform[0];
                            } else if (hightLight.frname) {
                                name = '法人或股东：';
                                html = hightLight.frname[0];
                            } else if (gdxx) {
                                name = '法人或股东：';
                                html = gdxx[0];
                            } else if (baxx) {
                                name = '董监高：';
                                html = baxx[0];
                            } else if (regno) {
                                name = '注册号：';
                                html = regno[0];
                            } else if (creditCode) {
                                name = '信用代码：';
                                html = creditCode[0];
                            } else if (patent) {
                                name = '专利：';
                                html = patent[0];
                            } else if (rjzzq) {
                                name = '软著：';
                                html = rjzzq[0];
                            } else if (tradeMark) {
                                name = '商标：';
                                html = tradeMark[0];
                            }
                            let lightInfo = (name && html) ?
                                <div className="frnamebox ">
                                    <span className="lable-msg frname">
                                        <em className="iconfont icon-guanlian"></em>{name}
                                    </span>
                                    <span className="legal-soure text-ellipsis"
                                          dangerouslySetInnerHTML={{ __html: html }}>
                                    </span>
                                </div>
                                : '';

                            let industryIcon = industry !== null ? <em className="item-flag">{industry}</em> : '';

                            let companyEnterpriseStatusIcon = companyEnterpriseStatus ?
                                <em className={'item-flag ' + (companyEnterpriseStatus === '存续' ? 'cunx' : 'cunx-danger')}>{companyEnterpriseStatus}</em> : '';
                            let pathTo = hasPermission
                                ? black
                                    ? `${DEFAULT_DETAIL}/${BLACK}/${unHighLightCompanyName}/${bbdQyxxId}/hmd/${switchIndustry(industry)}`
                                    : `${DEFAULT_DETAIL}/${switchIndustry(industry)}/${unHighLightCompanyName}/${bbdQyxxId}/${switchIndustryYW(industry)}`
                                : '';
                            let pathTo_2 = `${ANALYSIS_DETAIL}/${CIRCLE}/${unHighLightCompanyName}/${bbdQyxxId}`;
                            // 是否有权限查看
                            return <div
                                className="item clearfix"
                                key={index}
                                onClick={hasPermission ? this._searchListToLog(unHighLightCompanyName) : this._searchAuthority}>
                                <div className="item-l">
                                    <table>
                                        <tbody>
                                        <tr>
                                            <td colSpan="4">
                                                <div className="item-title">
                                                    <span className="name"
                                                          dangerouslySetInnerHTML={{ __html: companyName }}></span>
                                                    {companyEnterpriseStatusIcon}
                                                    {industryIcon}
                                                    <div className={colorName}>
                                                        {riskLevelSpan}
                                                        {riskIndexSpan}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td width="25%" style={{ height: '43px' }} className="lable-msg-item">
                                                <span className="lable-msg">法定代表人：</span>
                                                <span title={fieldAnomaly(frname)}
                                                      dangerouslySetInnerHTML={{ __html: fieldAnomaly(frname) }}>
                                                </span>
                                            </td>
                                            <td width="25%"><span
                                                className="lable-msg">注册资本：</span>{fieldAnomaly(regcap)}
                                            </td>
                                            <td width="20%"><span
                                                className="lable-msg">成立日期：</span>{fieldAnomaly(esdate)}
                                            </td>
                                            <td width="25%">
                                                {lightInfo}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan="2" className="address">
                                                <span className="lable-msg">注册地址：</span>
                                                <span
                                                    dangerouslySetInnerHTML={{ __html: hightLight.address === null ? address : hightLight.address[0] }}>

                                                </span>
                                            </td>
                                            {bbdHistoryName.length > 0 ? <td colSpan="2" className="address">

                                                <span className="lable-msg">历史名称：</span>
                                                <span>
                                                    <em>{bbdHistoryName.toString().replace(/,/g, '、')}</em>
                                                </span> 
                                            </td> : <td colSpan="2"></td>}
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="item-r">
                                    <div>
                                        <div className="u-btn blue"><Link to={pathTo_2} target="_blank">大数据智能分析</Link>
                                        </div>
                                        <div className="u-btn green"><Link to={pathTo}
                                                                           target="_blank">{`查看企业${isClassIndustry ? '风险详情' : '详细信息'}`}</Link>
                                        </div>
                                    </div>

                                </div>
                            </div>;
                        })
                }
            </div>
        </div>;
    }

    _searchAuthority = () => {
        Tip.warning('暂未开放除本区域外的企业信息查看权限！');
    };

    _searchListToLog = (company) => {
        // GetUserLog({
        //     page: '搜索结果', // 页面类型
        //     operation: '搜索结果列表', // 使用日志
        //     detail: '点击“' + company + '”进入企业详情'// 详情记录
        // });
    };

}

export default SearchResultList;