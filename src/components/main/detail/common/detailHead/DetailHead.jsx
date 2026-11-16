/**
 * Created by fuzhihong on 2017/4/18.
 * Remark 公司详情头部
 */
import './detailHead.scss';
import { Icon } from 'antd';
import classname from 'classnames';
import React, { Component } from 'react';
import { browserHistory, Link } from 'react-router';
import { Modal } from 'antd';
import { Checkbox, Input, Tip } from 'mtui/index';
import { GetPageByUrl, DownLoadIframe } from 'Utils/hjPromise';
import { formatDate } from 'Utils/formatter';
import { setLocal, getLocal } from 'Utils/storage';
import emitter from 'Utils/emitter';
import { switchIndustry, switchIndustryYW, fieldAnomaly } from 'Utils/formatter';
import { CommonModal, RadioGroupItem } from 'CommonComponents';
import { Services, classIndustry } from 'Constants/common';
import { detailBaseDataAPI, companyDetailAPI } from 'Services/detail';
import { personalCenterPAPI, personalCenterRAPI } from 'Services/personal';
import { MAIN, ANALYSIS, DEFAULT_DETAIL, BLACK, CIRCLE, ANALYSIS_DETAIL } from 'RouterPath';

const {
    DETAIL_BASE_DATA_OVERVIEW, COMPANY_DETAIL_ADD_FOCUS,
    COMPANY_DETAIL_ADD_BLACK_LIST, COMPANY_DETAIL_ADD_DEALINFO,
    PERSONAL_CENTER_CANCEL_FOCUS, PERSONAL_CENTER_CANCEL_BLACKLIST,
    COMPANY_DETAIL_UPDATE_INFO, PERSONAL_CENTER_GETSEARCHINFO, PERSONAL_CENTER_MAKERESEARCH, COMPANY_DETAIL_GET_APPLYTIME
} = Services;

export default class DetailHead extends Component {
    constructor(props) {
        super(props);
        let dataSession = getLocal('user');
        this.state = {
            companyName: props.params.companyName, //  公司名称
            companyId: props.params.companyId, // 公司id
            userName: dataSession ? dataSession.username : '', // 用户名
            userId: dataSession ? dataSession.id : '', // 用户id
            companyDetail: [], // 获取详情
            otherValue: '', // 用户输入其他原因
            black: false, // 是否被拉黑
            blackId: null, // 拉黑id
            focus: false, // 是否被关注
            focusId: null, // 关注id
            focusNum: 0, // 被关注数量
            emptyValue: false, // input提交值是否为空
            reportTimes: 0, // 研报下载次数
            reportStatus: 'hasFirst', // 下载研报状态
            reportGenerating: false, // 研报生成状态
            applyDate: '', // 申请日期
            isOther: false, // 是否为非新金融
            isBlack: false, // 是否为黑名单企业
            isProblem: false, // 是否为问题平台
            hasMultiPlatforms: false, // 如为问题平台,是否有多个平台
            industry: '', // 行业
            industryText: '',
            expirationDate: '',
            likeVisible: false, // 加入监控
            unLikeVisible: false, // 取消关注
            blackVisible: false, // 加入黑名单
            unBlackVisible: false, // 取消加入黑名单
            companyMsgVisible: false, // 更正企业信息
            companyMsgSureVisible: false, // 更正企业信息确定
            reportVisible: false, // 申请报告
            handleManager: false, // 风险处理面板
            likeCheckedArr: {
                0: false,
                1: false,
                2: false,
                3: false
            }, // 关注的时候选择理由
            dislikeCheckedArr: {
                0: false,
                1: false,
                2: false,
                3: false
            }, // 拉黑的时候选择理由
            offDislikeCheckedArr: {
                0: false,
                1: false,
                2: false
            } // 取消拉黑的时候选择理由
        };
        this.setProblem = this.setProblem.bind(this);
    }

    /**
     * 获取基本信息
     * @return {[type]} [description]
     */
    getBaseDataOverview() {
        let getUrl = this.props.location.pathname;
        let { companyId, isBlack } = this.state;
        let urlIndexOfBalck = getUrl.indexOf('black');
        detailBaseDataAPI({
            type: DETAIL_BASE_DATA_OVERVIEW,
            data: {
                companyId
            }
        }).then(({ data, statusCode, msg }) => {
            let { content } = data;
            let { addBlackDate, riskLevel, blackReasons, industry, focusNum, userFocus, focusId, blackId, black } = content;
            let baseIndustry = industry;
            if (statusCode === 403) {
                this.props.pageShow(false, msg);
            } else {
                this.props.pageShow(true);
                if (content) {
                    // 如果后台添加公司为黑名单，这里需要跳转到黑名单
                    if (black && urlIndexOfBalck === -1 && !this.props.isDetailPage) {
                        let path = this.props.params;
                        let url = `${DEFAULT_DETAIL}/${BLACK}/${path.companyName}/${path.companyId}/hmd/${switchIndustry(baseIndustry)}`;
                        browserHistory.push(url);
                        setTimeout(() => {
                            emitter.emit('POST_BLACK_DETAIL', addBlackDate, blackReasons);
                        }, 1000);
                        return;
                    }

                    setLocal('industry', baseIndustry);
                    setLocal('riskLevel', riskLevel);
                    if (black) {
                        setTimeout(() => {
                            emitter.emit('POST_BLACK_DETAIL', addBlackDate, blackReasons);
                        }, 1000);
                    }
                    this.setState({
                        companyDetail: content,
                        black,
                        blackId,
                        focusId,
                        focus: userFocus,
                        focusNum,
                        industry: switchIndustry(industry),
                        industryText: industry
                    });
                }
            }
        });
    }

    /**
     * 获取研报状态
     * @return {[type]} [description]
     */
    getApplyTime = () =>{
        let _this = this;
        personalCenterRAPI({
            type: COMPANY_DETAIL_GET_APPLYTIME,
            data: {
                companyId: this.state.companyId
            }
        }).then(({ data }) => {
            _this.setState({
                reportGenerating: (data.reportStatus === '生成中') ? true : false
            });
        });
      
    }

    componentDidMount() {
        emitter.on('PROBLEM_PLATFORM', this.setProblem);
        if (this.props.location.pathname.indexOf('black') !== -1) {
            this.setState({
                isBlack: true
            });
        } else if (this.props.location.pathname.indexOf('other') !== -1) {
            this.setState({
                isOther: true
            });
        }
        this.getBaseDataOverview();
        this.getApplyTime();
        if (this.props.isDetailPage) {
            emitter.on('ADD_MONITOR', this.addlLike);
        }
    }

    componentWillUnmount() {
        emitter.removeListener('PROBLEM_PLATFORM', this.setProblem);
    }

    /**
     * 如果是问题平台 调用设置isProblem 判断是否为多平台
     * @param flag
     * @param platformNum
     */
    setProblem(flag, platformNum) {
        let hasMultiPlatforms = platformNum > 1;
        this.setState({
            isProblem: flag,
            hasMultiPlatforms: hasMultiPlatforms
        });
    }

    /**
     * 弹出已关注Modal
     */
    addlLike = (e) => {
        let { id, text } = e;
        if (e && text) {
            this._atlasPage = true;
            this.setState({
                likeVisible: true,
                detailPageData: {
                    companyId: id,
                    companyName: text
                }

            });
        } else {
            this._atlasPage = false;
            this.setState({
                likeVisible: true
            });
        }
    };

    /**
     * 打开取消关注modal
     */
    cancelLike() {
        this.setState({
            unLikeVisible: true
        });
    }

    /**
     * 管理风险处理modal
     * */
    _toggleHandleManager = (type) => {
        this.setState({
            handleManager: type
        });
    };

    /**
     * 打开拉黑Modal
     */
    addBlack() {
        this.setState({
            blackVisible: true
        });
    }

    /**
     * 打开取消拉黑modal
     */
    cancelBlack() {
        this.setState({
            unBlackVisible: true
        });
    }

    /**
     * 打开修改企业信息Modal
     */
    changeCompanyMsg() {
        this.setState({
            emptyValue: false,
            companyMsgVisible: true
        }, function () {
            this.feedbackInput.value = '';
        });
    }

    /**
     * 关注Modal radio回调
     * @param data
     * @param value
     */
    likeChange(data, value) {
        let _this = this;
        this.setState({
            likeCheckedArr: Object.assign({}, _this.state.likeCheckedArr, { [value.value]: !_this.state.likeCheckedArr[value.value] })
        });
    }

    /**
     * 是否被选择
     * @param item
     * @param arr
     * @returns {*}
     */
    isChecked(item, arr) {
        return this.state[arr][item];
    }

    /**
     * 拉黑Modal radio回调 方法
     * @param data
     * @param value
     */
    dislikeChange(data, value) {
        let _this = this;
        this.setState({
            dislikeCheckedArr: Object.assign({}, _this.state.dislikeCheckedArr, { [value.value]: !_this.state.dislikeCheckedArr[value.value] })
        });
    }

    /**
     * 取消拉黑modal checkbox回调
     * @param data
     * @param value
     */
    offDislikeChange(data, value) {
        let _this = this;
        this.setState({
            offDislikeCheckedArr: Object.assign({}, {
                0: false,
                1: false,
                2: false
            }, { [value.value]: !_this.state.offDislikeCheckedArr[value.value] })
        });
    }

    /**
     * input change callback
     * @param e
     */
    handleInputChange(e) {
        this.setState({
            otherValue: e.target.value
        });
    }

    /**
     * 确认操作
     * @param type
     */
    confirmOperate(type) {
        let checkedArr;
        let url;
        let reasonList = [], { detailPageData, companyId, companyName, otherValue, likeCheckedArr, dislikeCheckedArr, isProblem, hasMultiPlatforms, industry, industryText } = this.state;
        let _this = this;
        if (type === 'likeCheckedArr') {
            checkedArr = likeCheckedArr;
            url = COMPANY_DETAIL_ADD_FOCUS;
            reasonList = [
                '其他原因', '出现负面舆情', '风险变动较大', '涉嫌非法集资'
            ];
        } else {
            checkedArr = dislikeCheckedArr;
            url = COMPANY_DETAIL_ADD_BLACK_LIST;
            reasonList = [
                '其他原因', '已立案/已查处', '已跑路/已失联', '其他确凿证据'
            ];
        }
        let reasons = [];
        for (let i in checkedArr) {
            if (i === '0' && checkedArr[i] && otherValue.trim()) {
                reasons.push({
                    k: 2,
                    v: otherValue.trim()
                });
            }
            if (i === '1' && checkedArr[i]) {
                reasons.push({
                    k: 1,
                    v: reasonList[1]
                });
            }
            if (i === '2' && checkedArr[i]) {
                reasons.push({
                    k: 1,
                    v: reasonList[2]
                });
            }
            if (i === '3' && checkedArr[i]) {
                reasons.push({
                    k: 1,
                    v: reasonList[3]
                });
            }
        }
        if (type === 'likeCheckedArr' || reasons.length > 0) {
            let reasonsStr = JSON.stringify(reasons);
            if (this._atlasPage) {
                companyName = detailPageData.companyName;
                companyId = detailPageData.companyId;
            }
            companyDetailAPI({
                type: url,
                data: {
                    company: companyName,
                    companyId,
                    reasons: reasonsStr,
                    industry: industryText,
                    province: '',
                    city: '',
                    area: ''
                }
            }).then(() => {
                if (!this._atlasPage) {
                    detailBaseDataAPI({
                        type: DETAIL_BASE_DATA_OVERVIEW,
                        data: {
                            companyId
                        }
                    }).then(({ data }) => {
                        let { content } = data;
                        let { industry, userFocus, focusId, focusNum, blackReasons, addBlackDate, black, blackId } = content;
                        if (content) {
                            setLocal('industry', industry);
                            if (type === 'likeCheckedArr') {
                                this.setState({
                                    focus: userFocus,
                                    focusId,
                                    focusNum,
                                    likeVisible: false
                                });
                            } else {
                                    // 如果为网络借贷 不走黑名单页面，只是在头部打上黑名单标签
                                this.setState({
                                    isBlack: black,
                                    black,
                                    blackId,
                                    focusNum,
                                    blackVisible: false
                                }, () => {
                                    if ( !hasMultiPlatforms && !this.props.isDetailPage) {
                                        let path = this.props.params;
                                        let url = `${DEFAULT_DETAIL}/${BLACK}/${path.companyName}/${path.companyId}/hmd/${this.state.industry}`;
                                        browserHistory.push(url);
                                        setTimeout(() => {
                                            emitter.emit('POST_BLACK_DETAIL', addBlackDate, blackReasons);
                                        }, 1000);
                                    }
                                });
                            }
                        }
                    });
                } else {
                    this.setState({
                        likeVisible: false
                    });
                }
            }
            );
        } else {
            return;
        }

    }

    /**
     * 取消关注确认
     */
    confirmOffFocus() {
        let { companyId, focusId, companyName } = this.state;
        personalCenterPAPI({
            type: PERSONAL_CENTER_CANCEL_FOCUS,
            data: {
                id: focusId,
                company: companyName
            }
        }).then(() => {
            detailBaseDataAPI({
                type: DETAIL_BASE_DATA_OVERVIEW,
                data: {
                    companyId
                }
            }).then(({ data }) => {
                let { content } = data, { userFocus, focusNum } = content;
                if (content) {
                    this.setState({
                        focus: userFocus,
                        focusNum: focusNum,
                        unLikeVisible: false
                    });
                }
            });
        });
    }

    /**
     *  取消拉黑确认
     */
    confirmOffDislike() {
        let reasons = [];
        let { blackId, companyId, companyName, isProblem, industryText, offDislikeCheckedArr, otherValue } = this.state;
        let checkedArr = offDislikeCheckedArr;
        for (let i in checkedArr) {
            if (i === '0' && checkedArr[i] && otherValue.trim()) {
                reasons.push({
                    k: 4,
                    v: otherValue.trim()
                });
            }
            if (i === '1' && checkedArr[i]) {
                reasons.push({
                    k: 3,
                    v: '已排查/排除非法集资可能性'
                });
            }
            if (i === '2' && checkedArr[i]) {
                reasons.push({
                    k: 3,
                    v: '误操作'
                });
            }
        }
        if (reasons.length > 0) {
            let reason = JSON.stringify(reasons);
            personalCenterPAPI({
                type: PERSONAL_CENTER_CANCEL_BLACKLIST,
                // 获取不到黑名单id
                data: {
                    id: blackId,
                    companyId,
                    company: companyName,
                    cancelReason: reason
                }
            }).then(() => {
                this.setState({
                    unBlackVisible: false
                }, () => {
                    if (!isProblem) {
                        let path = this.props.params;
                        let url = `${DEFAULT_DETAIL}/${switchIndustry(industryText)}/${path.companyName}/${path.companyId}/${switchIndustryYW(industryText)}`;
                        browserHistory.push(url);
                    }
                    detailBaseDataAPI({
                        type: DETAIL_BASE_DATA_OVERVIEW,
                        data: {
                            companyId
                        }
                    }).then(({ data }) => {
                        let { content } = data;
                        this.setState({
                            black: content.black,
                            isBlack: content.black
                        });
                    });
                });

            });
        } else {
            return;
        }
    }

    /**
     * 确认提交反馈
     */
    confirmFeedback() {
        let { userName, companyId, companyName } = this.state;
        if (!this.feedbackInput.value.trim()) {
            this.setState({
                emptyValue: true
            });
        } else {
            companyDetailAPI({
                type: COMPANY_DETAIL_UPDATE_INFO,
                data: {
                    username: userName,
                    companyId,
                    company: companyName,
                    content: this.feedbackInput.value.trim()
                }
            }).then(() => {
                this.setState({
                    companyMsgVisible: false,
                    companyMsgSureVisible: true // 弹出企业更正确定信息
                });
            });
        }
    }

    /**
     * textArea change回调
     * @param e
     */
    textAreaChange(e) {
        let hasValue = !!e.target.value.trim().length;
        this.setState({
            emptyValue: !hasValue
        });
    }

    /**
     * 关闭modal
     * @param type
     */
    cancelModal(type) {
        this[type].showModal(false);
    }

    /**
     * 生成研报
     */
    generateReport = () => {
        personalCenterRAPI({
            type: PERSONAL_CENTER_GETSEARCHINFO
        }).then(({ data }) => {
            if (data === null) {
                this.setState({
                    reportStatus: 'noCondition'
                }, () => {
                    /* GetUserLog({
                        page: '企业页面',
                        operation: '申请研报',
                        detail: '点击生成研报（无协议用户）'
                    }); */
                });
            }
            if (data && data.residue_degree === 0) {
                this.setState({
                    reportStatus: 'noTimes',
                    reportTimes: data.residue_degree
                }, () => {
                    /* GetUserLog({
                        page: '企业页面',
                        operation: '申请研报',
                        detail: '点击生成研报（次数用完）'
                    }); */
                });
            }
            if (data && data.residue_degree !== 0) {
                this.setState({
                    reportStatus: 'hasFirst',
                    reportTimes: data.residue_degree
                    // expirationDate: data.expiration_date
                });
            }
        }).then(() => {
            let { reportStatus } = this.state;
            if (reportStatus === 'noCondition' || reportStatus === 'noTimes') {
                this.setState({
                    reportVisible: true
                });
                return;
            }
            //  判断是否二次下载 获取时间
            personalCenterRAPI({
                type: COMPANY_DETAIL_GET_APPLYTIME,
                data: {
                    companyId: this.state.companyId
                }
            }).then(({ data }) => {
                if (data.applyTime) {
                    this.setState({
                        reportStatus: 'hasSecond',
                        applyDate: formatDate(data.applyTime)
                    }, ()=> {
                        this.setState({
                            reportVisible: true
                        });
                    });
                } else {
                    this.setState({
                        reportVisible: true
                    });
                }
            });
        });
    };
    /**
     * 导出PDF
     */
    exportPDF = () => {
        let pageName = GetPageByUrl();
        let { companyId, companyName } = this.state;
        let exportPDFUrl = '/api/v1.0/word/exportWord.do?companyId=' + companyId + '&companyName=' + encodeURIComponent(companyName) + '&operationPage=' + encodeURIComponent(pageName);
        DownLoadIframe(exportPDFUrl);
    };
    
    /**
     * 确认生成研报
     */
    confirmGenerateReport() {
        personalCenterRAPI({
            type: PERSONAL_CENTER_MAKERESEARCH,
            data: {
                companyId: this.state.companyId,
                company: this.state.companyName
            }
        }).then((data) => {
            this.setState({
                reportStatus: 'applySuccess',
                reportGenerating: true
            });
            /* GetUserLog({
                page: '企业页面', // 页面类型
                operation: '申请研报', // 使用日志
                detail: '点击生成研报'// 详情记录
            }); */
        });
    }

    /**
     * 关注弹出窗--取消
     * @return {[type]} [description]
     */
    closelikeVisible() {
        this.setState({
            likeVisible: false
        });
    }

    /**
     * 关闭取消关注model
     */
    coloseUnLikeVisible() {
        this.setState({
            unLikeVisible: false
        });
    }

    /**
     * 关闭黑名单model
     */
    closeBlackVisible() {
        this.setState({
            blackVisible: false
        });
    }

    /**
     * 关闭取消黑名单model
     */
    closeUnBlackVisible() {
        this.setState({
            unBlackVisible: false
        });
    }

    /**
     * 关闭更正企业信息model
     */
    closeCompanyMsg() {
        this.setState({
            companyMsgVisible: false
        });
    }

    /**
     * 关闭确认更正企业信息model
     */
    closeSureCompanyMsg() {
        this.setState({
            companyMsgSureVisible: false
        });
    }

    /**
     * 关闭研报model
     */
    cancelReport() {
        this.setState({
            reportVisible: false
        });
    }

    render() {
        let { companyDetail, black, problem, focus, focusNum, isBlack, isProblem, userId, companyName, companyId } = this.state;
        let isBlackOrProblem = isBlack || isProblem;
        // 企业电话号码
        let tel = companyDetail.tel === undefined || companyDetail.tel === null ? '' :
            <div className="left"><em className="label iconfont icon-dianhua"></em><span
                className="info"> {companyDetail.tel}</span></div>;
        // 企业邮箱
        let email = companyDetail.email === undefined || companyDetail.email === null ? '' :
            <div className="left"><em className="label iconfont icon-xiaoxi"></em><span
                className="info"> {companyDetail.email}</span></div>;
        // 企业网址
        let website = companyDetail.website === undefined || companyDetail.website === null ? '' :
            <div className="left"><em className="label iconfont icon-globe"></em><span className="info website"> <a
                target="_blank"
                href={companyDetail.website.indexOf('http') === -1 ? `http://${companyDetail.website}` : companyDetail.website}>{companyDetail.website}</a> </span>
            </div>;
        // 行业标签
        let industry = companyDetail.industry === undefined || companyDetail.industry === null ? '' :
            <div className="left type-label">{companyDetail.industry}</div>;
        // 基金管理人   
        // let fundType = companyDetail.fundType === undefined || companyDetail.fundType === null ? '' :
        //     <div className="left type-label">{companyDetail.fundType}</div>;
        // 存续状态
        let status = companyDetail.companyEnterpriseStatus === undefined || companyDetail.companyEnterpriseStatus === null ? '' :
            <div className="left type-label other">{companyDetail.companyEnterpriseStatus}</div>;

        let isClassIndustry = classIndustry.find(({ name }, index) => name === companyDetail.industry);

        return (
            <div className="detail-head" style={{ height: this.props.isDetailPage ? 150 : null }}>
                <div className="line line-one clearfix">
                    <div className="left company-name" title={companyName}>{companyName}</div>
                    {isClassIndustry
                        ? <div className="left like mt5" onClick={() => {
                            this._handleManager.toggleModal({
                                type: true,
                                option: { title: '风险处置管理', callback: this._commitHandleManager }
                            });
                        }}>
                            <Icon type="credit-card" className="detail-head__icon"/>
                        </div>
                        : null
                    }
                    {
                        userId ?
                            focus ?
                                <div className="left like mt5" onClick={this.cancelLike.bind(this)}>
                                    <Icon type="eye-o" className="detail-head__icon active"/>
                                    {
                                        focusNum > 0 ?
                                            <em className={classname({ active: focus }, { default: !focus })}>({focusNum})</em> :
                                            null
                                    }
                                </div> :
                                <div className="left like mt5" onClick={this.addlLike.bind(this)}>
                                    <Icon type="eye-o" className="detail-head__icon"/>
                                    {
                                        focusNum > 0 ?
                                            <em className={classname('default')}>({focusNum})</em> :
                                            null
                                    }
                                </div>
                            : null
                    }
                    {
                        userId ?
                            this.state.isOther ?
                                null :
                                black ?
                                    <div className="left dislike mt5 hover" onClick={this.cancelBlack.bind(this)}>
                                        <em className={classname('iconfont', 'icon-heimingdan', 'active')}> </em>
                                    </div> :
                                    <div className="left dislike mt5 hover" onClick={this.addBlack.bind(this)}>
                                        <em className={classname('iconfont', 'icon-heimingdan', 'default')}> </em>
                                    </div>
                            : null
                    }
                    {industry}
                    {status}
                    {
                        companyDetail.riskLevel === '持续监控' && !black ?
                            <div className="left risk-button risk-button-blue">
                                持续监控
                            </div> :
                            null
                    }
                    {
                        companyDetail.riskLevel === '重点关注' && !black ?
                            <div className="left risk-button risk-button-yellow">
                                重点关注
                            </div> :
                            null
                    }
                    {
                        companyDetail.riskLevel === '高危预警' && !black ?
                            <div className="left risk-button risk-button-red">
                                高危预警
                            </div> :
                            null
                    }
                    {
                        black ?
                            <div className="left risk-button risk-button-black">
                                黑名单
                            </div> :
                            null
                    }
                    {
                        black ? null :
                            <div
                                className={classname('left', 'mt5', { blue: companyDetail.riskLevel === '持续监控' }, { yellow: companyDetail.riskLevel === '重点关注' }, { red: companyDetail.riskLevel === '高危预警' })}>
                                {
                                    companyDetail.rise === 1 ?
                                        <div className="left reverse"><em className="iconfont icon-down2"></em>
                                        </div> : null
                                }
                                {
                                    companyDetail.rise === -1 ?
                                        <div className="left"><em className="iconfont icon-down2"></em></div> : null
                                }
                                {
                                    companyDetail.rise === 0 && null
                                }
                                {companyDetail.riskIndex}
                            </div>
                    }
                    {
                        this.state.isOther ?
                            null :
                            <div>
                                {/* 此处产品需求先隐藏此功能*/}
                                {/* {*/}
                                    {/* userId ?*/}
                                        {/* this.state.reportGenerating ?*/}
                                            {/* <div className="right u-btn gray">*/}
                                                {/* <em style={{margin: 0}}>研报生成中</em>*/}
                                            {/* </div> :*/}
                                            {/* <div className="right u-btn base"*/}
                                                 {/* onClick={this.generateReport} style={{ display: 'none' }}>*/}
                                                {/* <em className="iconfont icon-xiangxi"></em>生成研报*/}
                                            {/* </div>*/}
                                        {/* : null*/}
                                {/* }*/}
                                <a href={'/api/v1.0/pdf/exportPdf.do?userName=' + this.state.userName + '&companyId=' + companyId + '&companyName=' + encodeURIComponent(companyName)}
                                   className="right u-btn export">
                                    <em className="iconfont icon-daochu"></em>导出简报
                                </a>
                                {
                                    this.props.isDetailPage
                                        ? null
                                        : <div className="right u-btn big-data">
                                            <em className="iconfont icon-daochu"></em><Link
                                            to={`${ANALYSIS_DETAIL}/${CIRCLE}/${companyName}/${companyId}`}
                                            target="_blank">大数据智能风险分析</Link>

                                        </div>
                                }

                            </div>
                    }
                </div>
                {this.props.isDetailPage ? null : <div className="line line-three clearfix">
                    <div className="left">
                        <span className="label">法定代表人 : </span><span
                        className="info">{fieldAnomaly(companyDetail.frname)}</span>
                    </div>
                    <div className="left">
                        <span className="label">注册资本 : </span><span
                        className="info">{fieldAnomaly(companyDetail.regcap)}</span>
                    </div>
                    <div className="left">
                        <span className="label">成立日期 : </span><span
                        className="info">{fieldAnomaly(companyDetail.esdate)}</span>
                    </div>
                    {website}
                </div>}
                {this.props.isDetailPage ? null : <div className="line line-three clearfix">
                    <div className="right">
                        {
                            userId
                                ? <em className="label iconfont icon-bianji link"
                                      onClick={this.changeCompanyMsg.bind(this)}>&nbsp;更正企业信息>> </em>
                                : null
                        }
                    </div>
                </div>}

                {/* 风险处置管理 */}
                <CommonModal ref={refs => this._handleManager = refs}>
                    <div className="mt-panel-min">
                        <div className="mt-panel-box">
                            <div className="font14 remark warning">选择对企业信息进行处理：</div>
                            <div className="textL" style={{ margin: '-20px 0 10px 0' }}>
                                <RadioGroupItem option={{
                                    radio: [
                                        { key: 1, info: '已查看' },
                                        { key: 2, info: '已排查' },
                                        { key: 3, info: '已处置' }
                                    ]
                                }} ref={radio => this._radio = radio}/>
                            </div>
                            <br/>
                            <div className="textL">
                                <span style={{ margin: '2px 15px 0 0' }}>备注:</span>
                                <Input onChange={(e) => {
                                    this._remarkValue = e.target.value;
                                }}
                                       placeholder="请输入备注" style={{ width: '300px' }} size="nm"/>
                            </div>
                        </div>
                    </div>
                </CommonModal>

                {/* 加入监控 */}
                <Modal
                    visible={this.state.likeVisible}
                    wrapClassName="vertical-center-modal"
                    width={460}
                    title={'加入监控'}
                    onOk={this.confirmOperate.bind(this, 'likeCheckedArr')}
                    onCancel={this.closelikeVisible.bind(this)}
                >
                    <div className="mt-panel-min">
                        <div className="mt-panel-box">
                            <div className="remark textL">请勾选加入监控的原因：</div>
                            <div className="textL">
                                <Checkbox checked={this.isChecked('1', 'likeCheckedArr')} value="1"
                                          onChange={this.likeChange.bind(this)}>出现负面舆情</Checkbox>
                                <Checkbox checked={this.isChecked('2', 'likeCheckedArr')} value="2"
                                          onChange={this.likeChange.bind(this)}>风险变动较大</Checkbox>
                                <Checkbox checked={this.isChecked('3', 'likeCheckedArr')} value="3"
                                          onChange={this.likeChange.bind(this)}>涉嫌非法集资</Checkbox>
                            </div>
                            <br/>
                            <div className="textL">
                                <Checkbox value="0"
                                          checked={this.isChecked('0', 'likeCheckedArr')}
                                          onChange={this.likeChange.bind(this)}>其他原因</Checkbox>
                                <Input onChange={this.handleInputChange.bind(this)}
                                       disabled={!this.state.likeCheckedArr['0']} ref={(ipt) => this.likeInput = ipt}
                                       placeholder="请输入原因" style={{ width: '215px' }} size="nm"/>
                            </div>

                        </div>
                    </div>
                </Modal>

                {/* 取消关注 */}
                <Modal
                    visible={this.state.unLikeVisible}
                    wrapClassName="vertical-center-modal"
                    width={460}
                    title={'取消关注'}
                    onOk={this.confirmOffFocus.bind(this)}
                    onCancel={this.coloseUnLikeVisible.bind(this)}
                >
                    <div className="mt-panel-min">
                        <div className="mt-panel-box">
                            <p className="font16 color-gray line"></p>
                            <p className="font16 color-light-black line">是否确认取消关注?</p>
                            <p className="font16 color-light-black line"></p>
                        </div>
                    </div>
                </Modal>

                {/* 加入黑名单modal */}
                <Modal
                    visible={this.state.blackVisible}
                    wrapClassName="vertical-center-modal"
                    width={460}
                    title={'加入黑名单'}
                    onOk={this.confirmOperate.bind(this, 'dislikeCheckedArr')}
                    onCancel={this.closeBlackVisible.bind(this)}
                >
                    <div className="mt-panel-box">
                        <div
                            className="font14 line warning">注：加入黑名单须填写确凿证据，且黑名单企业特征会影响模型构建，请谨慎操作！{this.state.focus ? '(该企业将从关注列表中移至黑名单)' : null}</div>
                        <div className="textL">
                            <Checkbox checked={this.isChecked('1', 'dislikeCheckedArr')} value="1"
                                      onChange={this.dislikeChange.bind(this)}>已立案/已查处</Checkbox>
                            <Checkbox checked={this.isChecked('2', 'dislikeCheckedArr')} value="2"
                                      onChange={this.dislikeChange.bind(this)}>已跑路/已失联</Checkbox>
                            <Checkbox checked={this.isChecked('3', 'dislikeCheckedArr')} value="3"
                                      onChange={this.dislikeChange.bind(this)}>其它确凿证据</Checkbox>
                        </div>
                        <br/>
                        <div className="textL">
                            <Checkbox value="0"
                                      checked={this.isChecked('0', 'dislikeCheckedArr')}
                                      onChange={this.dislikeChange.bind(this)}>其他原因</Checkbox>
                            <Input onChange={this.handleInputChange.bind(this)}
                                   disabled={!this.state.dislikeCheckedArr['0']} ref={(ipt) => {
                                       this.dislikeInput = ipt;
                                   }} placeholder="请输入原因" style={{ width: '194px' }} size="nm"/>
                        </div>
                    </div>
                </Modal>

                {/* 取消拉黑modal */}
                <Modal
                    visible={this.state.unBlackVisible}
                    wrapClassName="vertical-center-modal"
                    width={460}
                    title={'移除黑名单'}
                    onOk={this.confirmOffDislike.bind(this)}
                    onCancel={this.closeUnBlackVisible.bind(this)}
                >
                    <div className="mt-panel-box">
                        <div className="font14 line warning">注：移出黑名单须确认其无非法集资可能性，且会影响模型构 建，请谨慎操作！</div>
                        <div className="textL">
                            <Checkbox checked={this.isChecked('1', 'offDislikeCheckedArr')} value="1"
                                      onChange={this.offDislikeChange.bind(this)}>已排查/排除非法集资可能性</Checkbox>
                            <Checkbox checked={this.isChecked('2', 'offDislikeCheckedArr')} value="2"
                                      onChange={this.offDislikeChange.bind(this)}>误操作</Checkbox>
                        </div>
                        <br/>
                        <div className="textL">
                            <Checkbox value="0"
                                      checked={this.isChecked('0', 'offDislikeCheckedArr')}
                                      onChange={this.offDislikeChange.bind(this)}>其他原因</Checkbox>
                            <Input onChange={this.handleInputChange.bind(this)}
                                   disabled={!this.state.offDislikeCheckedArr['0']} ref={(ipt) => {
                                       this.offDislikeInput = ipt;
                                   }} placeholder="请输入原因" style={{ width: '194px' }} size="nm"/>
                        </div>
                    </div>
                </Modal>

                {/* 更正企业信息modal */}
                <Modal
                    visible={this.state.companyMsgVisible}
                    wrapClassName="vertical-center-modal companyMsg-model"
                    width={460}
                    title={'更正企业信息'}
                    onOk={this.confirmFeedback.bind(this)}
                    onCancel={this.closeCompanyMsg.bind(this)}
                >
                    <div className="mt-panel-box">
                        <div className="remark textL">反馈内容：</div>
                        <div className="textC textarea-box">
                                <textarea ref={(ipt) => {
                                    this.feedbackInput = ipt;
                                }} onChange={this.textAreaChange.bind(this)} name="modify" id="modifyM" rows="8"
                                          cols="27" placeholder="请反馈需要更正的企业信息.如：行业类别有误，应为“私募基金”行业...">
                                </textarea>
                            {
                                this.state.emptyValue ?
                                    <p className="font14 warning">请输入反馈内容！</p> :
                                    null
                            }
                        </div>
                    </div>
                </Modal>

                <Modal
                    visible={this.state.companyMsgSureVisible}
                    wrapClassName="vertical-center-modal companysureMsg-model"
                    width={460}
                    title={'更正企业信息'}
                    onCancel={this.closeSureCompanyMsg.bind(this)}
                    onOk={this.closeSureCompanyMsg.bind(this)}
                >
                    <div className="mt-panel-box">
                        <div className="remark textC">
                            <p>非常感谢您的反馈！我们将尽快核实并更正信息。</p>
                        </div>
                        <div className="model-active">
                            <div className="btn blue" onClick={this.closeSureCompanyMsg.bind(this)}>确定</div>
                        </div>
                    </div>
                </Modal>

                {/* 研报下载modal */}
                <Modal
                    visible={this.state.reportVisible}
                    wrapClassName="vertical-center-modal  detai-report"
                    width={460}
                    onCancel={this.cancelReport.bind(this)}
                    title={'生成调研报告'}
                >
                    {
                        this.state.reportStatus === 'noCondition' ?
                            <div className="mt-panel-box">
                                <div className="remark textC">
                                    <p className="font16 color-gray line"></p>
                                    <p>尚未开通该功能!</p>
                                    <p>请与我司联系。</p>
                                    <p className="font16 color-gray line"></p>
                                </div>
                                <div className="model-active">
                                    <div className="btn blue"
                                         onClick={this.cancelReport.bind(this, 'reportModalRef')}>确定
                                    </div>
                                </div>
                            </div> : null
                    }
                    {
                        this.state.reportStatus === 'noTimes' ?
                            <div className="mt-panel-box">
                                <div className="remark textC">
                                    <p className="font16 color-gray line"></p>
                                    <p>剩余下载次数: <span className="warning">{this.state.reportTimes}</span>次</p>
                                    <p>请与我司联系,续订该功能。</p>
                                    <p className="font16 color-gray line"></p>
                                </div>
                                <div className="model-active">
                                    <div className="btn blue"
                                         onClick={this.cancelReport.bind(this, 'reportModalRef')}>确定
                                    </div>
                                </div>
                            </div> : null
                    }
                    {
                        this.state.reportStatus === 'hasFirst' ?
                            <div className="mt-panel-box">
                                <div className="remark textC">
                                    <p className="font16 color-gray line"></p>
                                    <p>剩余下载次数：<span className="warning">{this.state.reportTimes}</span>次</p>
                                    <p>是否确认提交?</p>
                                    <p className="font16 color-gray line"></p>
                                </div>
                                <div className="model-active">
                                    <div className="btn blue" onClick={this.confirmGenerateReport.bind(this)}>确认</div>
                                    <div className="btn gray"
                                         onClick={this.cancelReport.bind(this, 'reportModalRef')}>取消
                                    </div>
                                </div>
                            </div> : null
                    }
                    {
                        this.state.reportStatus === 'applySuccess' ?
                            <div className="mt-panel-box">
                                <div className="remark textC">
                                    <p className="font16 color-gray line"></p>
                                    <p>请于<span className="warning">3日后</span>在“个人中心-我的报告”</p>
                                    <p>中下载调研报告，请耐心等待！</p>
                                    <p className="font16 color-gray line"></p>
                                </div>
                                <div className="model-active">
                                    <div className="btn blue"
                                         onClick={this.cancelReport.bind(this, 'reportModalRef')}>确定
                                    </div>
                                </div>
                            </div> : null
                    }
                    {
                        this.state.reportStatus === 'hasSecond' ?
                            <div className="mt-panel-box">
                                <div className="remark textC">
                                    <p className="font16 color-gray line"></p>
                                    <p>已于{this.state.applyDate}申请过该企业研报!</p>
                                    <p>剩余下载次数：<span className="warning">{this.state.reportTimes}</span>次</p>
                                    <p>是否确认提交?</p>
                                    <p className="font16 color-gray line"></p>
                                </div>
                                <div className="model-active">
                                    <div className="btn blue" onClick={this.confirmGenerateReport.bind(this)}>确认</div>
                                    <div className="btn gray"
                                         onClick={this.cancelReport.bind(this, 'reportModalRef')}>取消
                                    </div>
                                    <p className="font16 color-gray line"></p>
                                </div>
                            </div> : null
                    }
                </Modal>
            </div>
        );
    }

    _commitHandleManager = () => {
        let { companyId } = this.state,
            { _remarkValue, _radio } = this,
            data = { companyId, dealStatus: _radio.getValue(), remark: _remarkValue ? _remarkValue : '' };
        companyDetailAPI({
            type: COMPANY_DETAIL_ADD_DEALINFO,
            data
        }).then(() => {
            Tip.success('企业分险管理处理成功。');
        }).catch();
    };

}
