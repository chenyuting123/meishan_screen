/**
 * Created by ashima on 2017/7/6.
 * Remark 关联方个人信息详情
 */
import './relatedParDetail.scss';
import 'mtui/style.css';
import 'perfect-scrollbar/dist/css/perfect-scrollbar.css';
import perfectScrollbar from 'perfect-scrollbar';
import React, { Component } from 'react';
import classname from 'classnames';
import { Input, Button, PageList } from 'mtui/index';
import { HJPromise } from 'Utils/hjPromise';
import { switchIndustry, switchIndustryYW, windowOpenByUrl, fieldAnomaly } from 'Utils/formatter';
import { DEFAULT_DETAIL, BLACK } from 'RouterPath';

export default class RelatedParDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageIndex: 1,
            pageSize: 10,
            total: 0,
            personId: this.props.params.personId || '',
            personName: this.props.params.personName || '',
            dataList: [],
            personList: [],
            basePersonList: [],
            listType: ['全部', '黑名单', '高风险', '新金融', '注吊销'],
            listTypeNum: []
        };
        this.getDegreeByType = this.getDegreeByType.bind(this);
    }

    componentDidMount() {
        this.getDetailInfo();
        perfectScrollbar.initialize(this.scrollRelateList);
    }

    componentDidUpdate() {
        perfectScrollbar.update(this.scrollRelateList);
    }

    componentWillUnmount() {
        perfectScrollbar.destroy(this.scrollRelateList);
    }

    /**
     * 获取个人详情
     * @return {[type]} [description]
     */
    getDetailInfo() {
        let _this = this;
        HJPromise({
            url: '/api/v1.0/personDetail/getDetailInfo.do',
            data: {
                personId: _this.state.personId
            },
            type: 'post'
        }).then((response) => {
            let data = response.data;
            let listTypeNum = [data.personRelationInfoVOS.length,
                data.blackPersonRelationInfos.length,
                data.highRiskPersonRelationInfos.length,
                data.financePersonRelationInfos.length,
                data.revokePersonRelationInfos.length
            ];
            _this.setState({
                dataList: data,
                total: data.personRelationInfoVOS.length,
                personList: data.personRelationInfoVOS,
                listTypeNum: listTypeNum
            }, function () {
                _this.getBaseDetailInfo();
            });

        });
    }

    /**
     * 查询企业是否是黑名单
     * @return {[type]} [description]
     */
    listGoDetail(name, companyId, isblack, industry) {
        /* GetUserLog({
            page: '个人信息',
            operation: '关联方列表',
            detail: '点击“' + name + '”进入企业详情'
        }); */

        if (isblack) {
            windowOpenByUrl(`${DEFAULT_DETAIL}/${BLACK}/${name}/${companyId}/hmd/${switchIndustry(industry)}`);
        } else {
            windowOpenByUrl(`${DEFAULT_DETAIL}/${switchIndustry(industry)}/${name}/${companyId}/${switchIndustryYW(industry)}`);
        }
    }

    /**
     * 类型筛选
     * @param  {[type]} index    [下标]
     * @param  {[type]} typeInfo [筛选；类型]
     * @param  {[type]} num      [当前类型的总量]
     * @return {[type]}          [description]
     */
    getDegreeByType(index, typeInfo, num) {
        if (num === 0) {
            return;
        }
        // 这了以后需更改，不要用jq
        let $getMeunDom = $(this.meunType).find('span');
        $getMeunDom.removeClass('active');
        $getMeunDom.eq(index).addClass('active');

        let personList = [];
        let baseData = this.state.dataList;
        if (index === 0) {
            personList = baseData.personRelationInfoVOS;
        } else if (index === 1) {
            personList = baseData.blackPersonRelationInfos;
        } else if (index === 2) {
            personList = baseData.highRiskPersonRelationInfos;
        } else if (index === 3) {
            personList = baseData.financePersonRelationInfos;
        } else if (index === 4) {
            personList = baseData.revokePersonRelationInfos;
        }
        // GetUserLog({
        //     page: '个人信息',
        //     operation: '关联方列表',
        //     detail: '点击“' + typeInfo + '”类型'
        // });
        this.setState({
            personList: personList,
            total: personList.length,
            pageIndex: 1
        }, function () {
            this.getBaseDetailInfo('refresh');
        });
    }

    /**
     * 分页处理
     * @return {[type]} [description]
     */
    getBaseDetailInfo(refresh) {
        if (refresh) {
            this.pagelist.refresh();
        }
        let dataSoure = this.state.personList;
        let beginIndex = (this.state.pageIndex - 1) * this.state.pageSize; // 数据起始位置
        let endIndex = this.state.pageIndex * this.state.pageSize; // 数据结束位置
        let pageListBySlice = dataSoure.slice(beginIndex, endIndex); // 得到当前截取数据
        this.setState({
            basePersonList: pageListBySlice
        });
    }

    pageCallback(page) {
        let _this = this;
        _this.setState({
            pageIndex: page.current
        }, function () {
            _this.getBaseDetailInfo();
        });
    }

    toPage(e) {
        this.pagelist.toPage(this.num.getValue());
    }

    render() {
        return (
            <div className="relate-detail">
                <div className="header">
                    <div className="user-msg">
                        <h2>{this.state.dataList.personName ? this.state.dataList.personName : this.state.personName}</h2>
                        <div className="remark">
                            <span>简介：</span>{this.state.dataList.profile === null ? '暂无。' : this.state.dataList.profile}
                        </div>
                    </div>
                </div>
                <div className="content">
                    <div className="content-padding">
                        <div className="table-header">
                            <div className="action-type" ref={meunType => this.meunType = meunType}>
                                {
                                    this.state.listTypeNum.map(function (ele, index) {
                                        let listType = this.state.listType;
                                        return (
                                            <span key={index}
                                                  onClick={this.getDegreeByType.bind(this, index, listType[index], ele)}
                                                  className={classname({
                                                      noHover: ele <= 0,
                                                      '': ele > 0,
                                                      active: index === 0
                                                  })}
                                            >{listType[index]}({ele})</span>

                                        );
                                    }.bind(this))
                                }
                            </div>
                            <div className="action-search">
                                <a className="expor-box"
                                   href={`/api/v1.0/export/personRelationNodes.do?personId=${this.state.personId}&operationPage=个人信息`}><span>下载关联方列表</span></a>
                            </div>
                        </div>
                        <div className="table-content clearfix">
                            <div className="left company-name">
                                <table className="table-theme">
                                    <thead>
                                    <tr>
                                        <td className="pl30">企业</td>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        this.state.basePersonList.map(function (ele, index) {
                                            let investRatioInfo = ele.investRatio === null ? '' :
                                                <span className="dis-block cap-scale">出资比例{ele.investRatio}</span>;
                                            return (
                                                <tr key={index}>
                                                    <td className="pl30">
                                                        <span className="text-ellipsis dis-block"
                                                              title={ele.relationCompanyName}
                                                              onClick={this.listGoDetail.bind(this, ele.relationCompanyName, ele.relationCompanyId, ele.black, ele.industry)}>{ele.relationCompanyName}</span>
                                                        {investRatioInfo}
                                                    </td>
                                                </tr>
                                            );
                                        }.bind(this))
                                    }
                                    </tbody>
                                </table>
                            </div>
                            <div className="left company-remark">
                                <div className="scroll-relate-list"
                                     ref={scrollRelateList => this.scrollRelateList = scrollRelateList}>
                                    <table className="table-theme">
                                        <thead>
                                        <tr>
                                            <td width="6%">角色</td>
                                            <td width="5%">省份地区</td>
                                            <td width="8%">注册资本</td>
                                            <td width="6%">注册日期</td>
                                            <td width="6%">法人</td>

                                            <td width="5%">状态</td>
                                            <td width="6%">行业</td>
                                            <td width="5%">风险等级</td>
                                            <td width="3%">风险分值</td>
                                            <td width="7%" className="textC"><span
                                                className="cursor-pointer">民间借贷法律文书</span></td>

                                            <td width="6%" className="textC"><span
                                                className="cursor-pointer">失信被执行人</span></td>
                                            <td width="5%" className="textC"><span
                                                className="cursor-pointer">被执行人</span></td>
                                            <td width="5%" className="textC"><span
                                                className="cursor-pointer">行政处罚</span></td>
                                            <td width="4%" className="textC"><span
                                                className="cursor-pointer">经营异常</span></td>
                                            <td width="4%" className="textC"><span className="cursor-pointer">诉讼</span>
                                            </td>

                                            <td width="4%" className="textC"><span
                                                className="cursor-pointer">工商变更</span></td>
                                            <td width="4%" className="textC"><span
                                                className="cursor-pointer">对外投资</span></td>
                                            <td width="5%" className="textC"><span
                                                className="cursor-pointer">黑名单关联方</span></td>
                                            <td width="5%" className="textC"><span
                                                className="cursor-pointer">高风险关联方</span></td>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            this.state.basePersonList.map(function (ele, index) {
                                                let riskLevel = ele.black ? '黑名单' : ele.riskLevel;
                                                let riskIndex = ele.black ? '--' : ele.riskIndex;
                                                return (
                                                    <tr key={index}>
                                                        <td width="6%">
                                                                <span className="text-ellipsis dis-block"
                                                                      title={fieldAnomaly(ele.role)}>
                                                                     {fieldAnomaly(ele.role)}
                                                                </span>
                                                        </td>
                                                        <td width="5%">{fieldAnomaly(ele.province)}</td>
                                                        <td width="8%">{fieldAnomaly(ele.regcap)}</td>
                                                        <td width="6%">{fieldAnomaly(ele.esdate)}</td>
                                                        <td width="6%">
                                                                <span className="text-ellipsis dis-block"
                                                                      title={fieldAnomaly(ele.frname)}>
                                                                    {fieldAnomaly(ele.frname)}
                                                                </span>
                                                        </td>

                                                        <td width="5%">
                                                                <span className="text-ellipsis dis-block"
                                                                      title={fieldAnomaly(ele.enterpriseStatus)}>
                                                                    {fieldAnomaly(ele.enterpriseStatus)}
                                                                </span>
                                                        </td>
                                                        <td width="6%">
                                                                <span className="text-ellipsis dis-block"
                                                                      title={fieldAnomaly(ele.industry)}>
                                                                {fieldAnomaly(ele.industry)}
                                                                </span>
                                                        </td>
                                                        <td width="5%">{fieldAnomaly(ele.riskLevel)}</td>
                                                        <td width="3%">{fieldAnomaly(ele.riskIndex)}</td>
                                                        <td width="7%"
                                                            className="textC">{fieldAnomaly(ele.totalPrivateLendingNum)}</td>

                                                        <td width="6%"
                                                            className="textC">{fieldAnomaly(ele.totalDishonestyNum)}</td>
                                                        <td width="5%"
                                                            className="textC">{fieldAnomaly(ele.totalZhixingNum)}</td>
                                                        <td width="5%"
                                                            className="textC">{fieldAnomaly(ele.totalXzcfNum)}</td>
                                                        <td width="4%"
                                                            className="textC">{fieldAnomaly(ele.totalQyycNum)}</td>
                                                        <td width="4%"
                                                            className="textC">{fieldAnomaly(ele.totalDocumentNum)}</td>

                                                        <td width="4%"
                                                            className="textC">{fieldAnomaly(ele.totalBgxxNum)}</td>
                                                        <td width="4%"
                                                            className="textC">{fieldAnomaly(ele.totalOutDegreeNum)}</td>
                                                        <td width="5%"
                                                            className="textC">{fieldAnomaly(ele.totalBlackNum)}</td>
                                                        <td width="5%"
                                                            className="textC">{fieldAnomaly(ele.totalHighNum)}</td>
                                                    </tr>
                                                );
                                            }.bind(this))
                                        }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div style={{ clear: 'both' }}></div>
                            {
                                !(this.state.basePersonList.length > 0) ? <div className="no-data">暂无数据。</div> : null
                            }
                        </div>
                        <div className="page-box"
                             style={{ display: this.state.personList.length > 0 ? 'block' : 'none' }}>
                            <PageList ref={pagelist => this.pagelist = pagelist}
                                      current={this.state.pageIndex}
                                      pageSize={this.state.pageSize}
                                      callback={this.pageCallback.bind(this)}
                                      total={this.state.total}/>
                            &nbsp;<Input style={{ width: 50 }} defaultValue="" ref={num => this.num = num} size="xm"
                                         type="text"/>
                            &nbsp;<Button size="sm" onClick={this.toPage.bind(this)}>跳转</Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}