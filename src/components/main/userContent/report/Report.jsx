/**
 * Created by ashima on 2017/4/19.
 * Remark 我的报告
 */
import './report.scss';
import React, { Component } from 'react';
import { Link } from 'react-router';
import { Modal } from 'antd';
import { PageList, Input, Button, Tip } from 'mtui/index';
import { DownLoadIframe } from 'Utils/hjPromise';
import { switchIndustry, switchIndustryYW, fmtReportStatus } from 'Utils/formatter';
import { getLocal } from 'Utils/storage';
import emitter from 'Utils/emitter';
import { DEFAULT_DETAIL, BLACK } from 'RouterPath';
import { Services } from 'Constants/common';
import { personalCenterPAPI, personalCenterRAPI, personalCenterDAPI } from 'Services/personal';
const { PERSONAL_CENTER_MY_REPORTLIST, PERSONAL_CENTER_MAKERESEARCH,
    PERSONAL_CENTER_GETSEARCHINFO, PERSONAL_CENTER_CHEACK_FILETYPE } = Services;
export default class Report extends Component {
    constructor(props) {
        super(props);
        this.state = {
            total: 0, // 总量
            pageSize: 10,
            page: 1,
            clickCompany: '',
            companyId: '',
            clickId: '',
            clickStatus: '',
            listLoading: '数据载入中...', // 列表加载
            residueNum: 0, // 研报剩余次数
            residueText: '', //
            residueTextTitleShow: true,
            listData: [], // 所有数据
            reportNum: this.props.location.query.reportNum,
            reportVisible: false,
            reportTipVisible: false,
            id: ''
        };

    }

    componentDidMount() {
        this.reportList();
    }
    componentWillUnMount() {
        this.timer && clearTimeout(this.timer);
    }
    /**
     * 我的报告
     * @return {[type]} [description]
     */
    reportList = ()=> {
        let _this = this;
        personalCenterPAPI({
            type: PERSONAL_CENTER_MY_REPORTLIST,
            data: {
                pageSize: _this.state.pageSize,
                page: _this.state.page
            }
        }).then(({ data })=>{
            _this.setState({
                listLoading: '暂无相关数据！'
            }, () =>{
                let responseSoureData = data.items === null ? [] : data.items;
                _this.setState({
                    listData: responseSoureData,
                    total: data.totalCount
                });
            });
          
        }, (error)=>{
            console.error(error.message);
        });
    }

    /**
     * 下载研报样例【目前取消该功能】
     * @return {[type]} [description]
     */
    dowmLoadDemo =()=> {
        let dowmLoadDemoUrl = '/downloadReports/downloadResearchExample.do';
        DownLoadIframe(pdfDownLoadUrl);
    }

    /**
     * 下载pdf
     * @return {[type]} [description]
     */
    pdfDownLoad =(companyId, companyName)=> {
        let pdfDownLoadUrl = '/pdf/exportPdf.do?companyId=' + companyId + '&companyName=' + encodeURIComponent(companyName) + '&operationPage=' + encodeURIComponent('个人中心');
        DownLoadIframe(pdfDownLoadUrl);
    }

    /**
     * 我的报告操作日志
     * @param  {[type]} company 公司名称
     * @return {[type]}         [description]
     */
    reportListToLog =(company)=> {
        // GetUserLog({
        //     page: '个人中心', // 页面类型
        //     operation: '我的报告', // 使用日志
        //     detail: '点击' + company + '进入详情'// 详情记录
        // });
    }

    pageCallback =(pageNumber)=> {
        this.setState({ page: pageNumber.current }, ()=> {
            this.reportList();
        });
    }

    toPage =(e)=>{
        this.pagelist.toPage(this.num.getValue());
    }

    render() {
        return (
            <div className="report">
                <table className="table-theme">
                    <tbody>
                    {
                        !(this.state.listData.length > 0) ? (<tr>
                                <td colSpan="6">{this.state.listLoading}</td>
                            </tr>) :
                            this.state.listData.map(function (item, index) {
                                {
                                    let exportActive = '';
                                    let rise = ''; // 易燃指数是否上升；1:上升，0：持平，-1：下降 ,
                                    let colorName = '';
                                    let riskLevel = '';
                                    let riskIndex = '';

                                    if (item.black) {
                                        colorName = 'conpany-soure black';
                                        rise = <em className="iconfont"></em>;
                                        riskLevel = <span className="danger-text min">黑名单</span>;
                                        riskIndex = <span className="danger-num"></span>;
                                    } else {
                                        if (item.rise === 1) {
                                            rise = <em className="iconfont icon-up2"></em>;
                                        } else if (item.rise === 0) {
                                            rise = <em className="iconfont"></em>;
                                        } else if (item.rise === -1) {
                                            rise = <em className="iconfont icon-down2"></em>;
                                        }

                                        if (item.riskLevel === '高危预警') {
                                            colorName = 'conpany-soure orange';
                                        } else if (item.riskLevel === '重点关注') {
                                            colorName = 'conpany-soure yellow';
                                        } else if (item.riskLevel === '持续监控') {
                                            colorName = 'conpany-soure sky';
                                        }
                                        riskLevel = <span className="danger-text min">{item.riskLevel}</span>;
                                        riskIndex = <span className="danger-num">{item.riskIndex}</span>;

                                    }

                                    return (
                                        <tr key={index}>
                                            <td className="company-text-f textL">
                                                <Link
                                                    className="name text-ellipsis"
                                                    target="_blank"
                                                    title={item.companyName}
                                                    onClick={this.reportListToLog.bind(this, item.companyName)}
                                                    to={item.black ? `${DEFAULT_DETAIL}/${BLACK}/${item.companyName}/${item.qyxxId}/hmd/${switchIndustry(item.industry)}` :
                                                        `${DEFAULT_DETAIL}/${switchIndustry(item.industry)}/${item.companyName}/${item.qyxxId}/${switchIndustryYW(item.industry)}`}>{item.companyName}
                                                </Link>
                                                <em className="type radius-btn min">{item.industry}</em>
                                            </td>
                                            <td className="textL">
                                                <div className={colorName}>
                                                    {riskLevel}
                                                    {rise}
                                                    {riskIndex}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="sec-line">
                                                    <p>简报下载日期</p>
                                                    <span>{item.bulletinDownloadTime !== null ? item.bulletinDownloadTime.replace(/(.{10}).*/, '$1') : '' }</span>
                                                </div>
                                            </td>
                                            <td>
                                                <a href={'/api/v1.0/word/exportWord.do?companyId=' + item.qyxxId + '&companyName=' + item.companyName}>
                                                    <span className="down-load radius-btn">
                                                        下载最新简报
                                                     </span>
                                                </a>
                                            </td>
                                        </tr>
                                    );
                                }
                            }.bind(this))
                    }
                    </tbody>
                </table>

                <div className="page-box" style={{ display: this.state.listData.length > 0 ? 'block' : 'none' }}>
                    <PageList ref={pagelist => this.pagelist = pagelist}
                              current={this.state.page}
                              pageSize={this.state.pageSize}
                              callback={this.pageCallback.bind(this)}
                              total={this.state.total}/>
                    &nbsp;<Input style={{ width: 50 }} defaultValue="" ref={num => this.num = num} size="xm" type="text"/>
                    &nbsp;<Button size="sm" onClick={this.toPage.bind(this)}>跳转</Button>
                </div>
            </div>
        );
    }
}