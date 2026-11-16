/**
 * Created by ashima on 2017/4/19.
 * Remark 招聘
 */
import './recruitment.scss';
import React, { Component } from 'react';
import { isEmptyObject, fieldAnomaly } from 'Utils/formatter';
import CHATBBD from 'Utils/bbdCharts';
import { PageList, Input, Button, Grid } from 'mtui/index';
import { Services } from 'Constants/common';
import { detailManageDataAPI } from 'Services/detail';

const { DETAIL_MANAGE_RECRUIT, DETAIL_MANAGE_RECRUIT_KPI } = Services;
export default class Recruitment extends Component {
    constructor(props) {
        super(props);
        this.recruitment = null;
        this.state = {
            companyName: this.props.params.companyName || '',
            companyId: this.props.params.companyId || '',
            listLoading: '数据载入中...', // 列表加载
            total: 0, // 总量
            page: 1,
            pageSize: 10,
            listData: [],
            educationLoading: '数据载入中...',
            industryLoading: '数据载入中...',
            dateLineLoading: '数据载入中...'
        };
        this.pageCallback = this.pageCallback.bind(this);
        this.toPage = this.toPage.bind(this);
    }

    componentDidMount() {
        this.recruitmentKPIList();
        this.recruitmentList();
    }

    /**
     * 获取招聘KPI信息
     * @return {[type]} [description]
     */
    recruitmentKPIList() {
        let { companyId } = this.state;
        detailManageDataAPI({
            type: DETAIL_MANAGE_RECRUIT_KPI,
            data: {
                companyId
            }
        }).then(({ data }) => {
            let content = data;
            this.recruitment && this.setState({
                educationLoading: '暂无相关数据！',
                industryLoading: '暂无相关数据！',
                dateLineLoading: '暂无相关数据！'
            }, () => {
                if (content !== null) {
                    let { educationMap = {}, industryMap = {}, dateMap = {} } = content;
                    let dateLineMap = dateMap; // 招聘时间分布
                    let educationData = [];
                    let industryData = [];
                    let leducationLegend = [];
                    let industryLegend = [];
                    let dateLineXAxis = [];
                    let dateLineSeries = [];
                    for (let item in educationMap) {
                        if (educationMap.hasOwnProperty(item)) {
                            leducationLegend.push(item);
                            educationData.push({
                                name: item,
                                value: educationMap[item]
                            });
                        }
                    }

                    for (let item in industryMap) {
                        if (industryMap.hasOwnProperty(item)) {
                            industryLegend.push(item);
                            industryData.push({
                                name: item,
                                value: industryMap[item]
                            });
                        }
                    }

                    for (let item in dateLineMap) {
                        if (dateLineMap.hasOwnProperty(item)) {
                            dateLineXAxis.push(item);
                            dateLineSeries.push(dateLineMap[item]);
                        }
                    }

                    if (isEmptyObject(educationMap)) {
                        this.setState({
                            educationLoading: '暂无相关数据！'
                        });
                    } else {
                        CHATBBD.bbdPie({
                            chartName: 'pie-xieli',
                            color: ['#4492da', '#53ded6', '#f9c337', '#f76d43', '#0c5ec3'],
                            legendShow: false,
                            legend: leducationLegend,
                            data: educationData,
                            name: '学历结构',
                            showLable: true
                        });
                    }
                    if (isEmptyObject(dateLineMap)) {
                        this.setState({
                            industryLoading: '暂无相关数据！'
                        });
                    } else {
                        CHATBBD.bbdLine({
                            chartName: 'line-zhaopin',
                            legend: ['招聘人数'],
                            specialFormatter: 'recrutment',
                            legendShow: false,
                            colors: ['#74c8f4', '#0585fa', '#0669e3'],
                            stack: 'common',
                            xAxis: dateLineXAxis,
                            labelTextColor: '#999',
                            series: [dateLineSeries]
                        });
                    }

                    if (isEmptyObject(industryMap)) {
                        this.setState({
                            dateLineLoading: '暂无相关数据！'
                        });
                    } else {
                        CHATBBD.bbdPie({
                            chartName: 'pie-hangye',
                            color: ['#4492da', '#53ded6', '#f9c337', '#f76d43', '#0c5ec3'],
                            legendShow: false,
                            legend: industryLegend,
                            data: industryData,
                            name: '行业分布',
                            showLable: true
                        });
                    }
                }
            });
        });
    }

    /**
     * 获取招聘KPI信息
     * @return {[type]} [description]
     */
    recruitmentList() {
        let { companyId, page, pageSize } = this.state;
        detailManageDataAPI({
            type: DETAIL_MANAGE_RECRUIT,
            data: {
                companyId: companyId,
                page,
                pageSize
            }
        }).then(({ data }) => {
            let content = data;
            this.recruitment && this.setState({
                listLoading: '暂无相关数据！',
                listData: []
            }, () => {
                if (content !== null) {
                    let { items, totalCount } = content;
                    this.recruitment && this.props.getNum('recruitmentNum', totalCount);
                    this.recruitment && this.setState({
                        listData: items === null ? [] : items,
                        total: totalCount
                    });
                }
            });
        });
    }

    pageCallback(page) {
        this.setState({ page: page.current }, () => {
            this.recruitmentList();
        });
    }

    toPage(e) {
        this.pagelist.toPage(this.num.getValue());
    }

    render() {
        return (
            <div className="business-msg" ref={c => this.recruitment = c}>
                <div className="top">
                    <div className="item">
                        <div className="header">学历结构图</div>
                        <div className="content">
                            <div className="chart-box">
                                <div className="pie-xieli v-center" id="pie-xieli"
                                     style={{ width: '100%', height: '100%' }}><span>{this.state.listLoading}</span></div>
                            </div>
                        </div>
                    </div>

                    <div className="item mid">
                        <div className="header">招聘人数时序图</div>
                        <div className="content">
                            <div className="line-zhaopin v-center" id="line-zhaopin"
                                 style={{ width: '100%', height: '100%' }}><span>{this.state.listLoading}</span></div>
                        </div>
                    </div>

                    <div className="item">
                        <div className="header">行业分布图</div>
                        <div className="content">
                            <div className="pie-hangye v-center" id="pie-hangye"
                                 style={{ width: '100%', height: '100%' }}><span>{this.state.listLoading}</span></div>
                        </div>
                    </div>
                </div>
                <div className="bottom">
                    <div className="tab-item">
                        <table className="table-theme">
                            <thead>
                            <tr>
                                <td width="10%" className="textC">序号</td>
                                <td width="15%">职位</td>
                                <td width="15%">薪资</td>
                                <td width="15%">经验</td>
                                <td width="15%">地点</td>
                                <td width="10%">学历</td>
                                <td width="10%">信息来源</td>
                                <td width="10%">发布日期</td>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                !(this.state.listData.length > 0) ? (<tr>
                                        <td colSpan="8" className="textC">{this.state.listLoading}</td>
                                    </tr>) :
                                    this.state.listData.map(function (item, index) {
                                        {
                                            let indexNum = (this.state.page - 1) * this.state.pageSize + index + 1;
                                            return (
                                                <tr key={index}>
                                                    <td className="textC">{indexNum}</td>
                                                    <td>{fieldAnomaly(item.jobTitle)}</td>
                                                    <td>{fieldAnomaly(item.salary)}</td>
                                                    <td>{fieldAnomaly(item.serviceYear)}</td>
                                                    <td>
                                                        <div className="text-ellipsis location"
                                                             title={fieldAnomaly(item.location)}>{fieldAnomaly(item.location)}</div>
                                                    </td>
                                                    <td>{fieldAnomaly(item.educationRequired)}</td>
                                                    <td>{fieldAnomaly(item.source)}</td>
                                                    <td>{fieldAnomaly(item.pubdate)}</td>
                                                </tr>
                                            );
                                        }
                                    }.bind(this))
                            }
                            </tbody>
                        </table>
                    </div>
                    <div className="page-box" style={{ display: this.state.listData.length > 0 ? 'block' : 'none' }}>
                        <PageList ref={pagelist => this.pagelist = pagelist}
                                  current={this.state.page}
                                  pageSize={this.state.pageSize}
                                  callback={this.pageCallback}
                                  total={this.state.total}/>
                        &nbsp;<Input style={{ width: 50 }} defaultValue="" ref={num => this.num = num} size="xm"
                                     type="text"/>
                        &nbsp;<Button size="sm" onClick={this.toPage}>跳转</Button>
                    </div>
                </div>
            </div>
        );
    }
}