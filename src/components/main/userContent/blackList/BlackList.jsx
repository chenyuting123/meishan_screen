/**
 * Created by hejie on 2017/4/18.
 * Remark 我的黑名单
 */
import './blackList.scss';
import React, { Component } from 'react';
import { Modal } from 'antd';
import emitter from 'Utils/emitter';
import { uuid } from 'Utils/util';
import { switchIndustry, switchIndustryYW, fieldAnomaly } from 'Utils/formatter';
import { PageList, Select, Input, Button, Checkbox, Tip } from 'mtui/index';
import { DEFAULT_DETAIL, BLACK } from 'RouterPath';
import { Services } from 'Constants/common';
import { personalCenterPAPI, personalCenterGAPI } from 'Services/personal';
import { NoData } from 'CommonComponents';
import { classIndustry } from 'Constants/common';
const { PERSONAL_CENTER_MY_BLACKLIST, PERSONAL_CENTER_MY_BLACKLIST_COUNT, PERSONAL_CENTER_CANCEL_BLACKLIST, PERSONAL_CENTER_LOOK_BLACKLIST, PERSONAL_CENTER_CHECK_ISBLACK } = Services;
export default class BlackList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            start: 1,
            size: 10,
            industryList: classIndustry, // 所有行业
            descAsc: 'DESC', // 排序方式
            selectIndustry: classIndustry[0].name, // 行业
            hide: true,
            val: '1',
            total: 0, // 总量
            exportTotal: 0, // 导出总量
            listData: [], // 所有数据
            checkboxVal: [], // 多选框
            deletInfo: {},
            dangerVal: '2',
            order: '加入黑名单日期',
            selectRiskLevel: '全部风险', // 风险等级
            dangerList: ['全部风险', '高危预警', '重点关注', '持续监控'], // 风险行业
            listLoading: '数据载入中...', // 列表加载
            cancelReasonArr: [], // 取消原因
            otherValue: '', // other reason
            offDislikeCheckedArr: {
                0: false,
                1: false,
                2: false
            },
            firstCountNum: 0,
            exportVisible: false,
            cancelBlackVisible: false
        };
        this.modal = null;
        this.deleteModal =  null;
        this.otherInput = null;
    }
    componentDidMount() {
        this.getBlackList();
        this.getExtport();
    }
    // 黑名单下载统计
    getExtport = () =>{
        let { selectIndustry, descAsc, selectRiskLevel } = this.state;
        let _this = this;
        personalCenterPAPI({
            type: PERSONAL_CENTER_MY_BLACKLIST_COUNT,
            data: {
                industry: selectIndustry,
                order: descAsc,
                riskLevel: selectRiskLevel
            }
        }).then(({ data })=>{
            _this.setState({
                exportTotal: data
            });
        }, (error)=>{
            console.error(error.message);
        });
    }
    /**
     * 获取列表数据
     * @param  {[type]} isSelect    [排序方式]
     * @param  {[type]} descAsc    [排序方式]
     * @param  {[type]} order [排序字段]
     * @param {[type]} riskLevel   [风险等级]
     */
    
    getBlackList = () =>{
        let _this = this;
        personalCenterPAPI({
            type: PERSONAL_CENTER_MY_BLACKLIST,
            data: {
                page: _this.state.start,
                pageSize: _this.state.size,
                industry: _this.state.selectIndustry === classIndustry[0].name ? null : _this.state.selectIndustry,
                order: _this.state.descAsc
            }
        }).then(({ data })=>{
            _this.setState({
                listLoading: '暂无相关数据！'
            }, () =>{
                this.setState({
                    listData: data.items,
                    total: data.totalCount 
                });
            });
        }, (error)=>{
            console.error(error.message);
        });
    }

    /**
     * 移除黑名单
     * @param reasons
     */
    cancelBlack = (reasons) =>{
        let _this = this;
        personalCenterPAPI({
            type: PERSONAL_CENTER_CANCEL_BLACKLIST,
            data: {
                id: _this.state.deletInfo.id,
                companyId: _this.state.deletInfo.companyId,
                company: _this.state.deletInfo.company,
                cancelReason: JSON.stringify(reasons)
            }
        }).then(()=>{
            this.getBlackList();
            emitter.emit('REFRESH_USER_DATA');
            _this.setState({
                cancelBlackVisible: false
            });
        }, (error)=>{
            console.error(error.message);
        });
    }
    // 移除黑名单的弹窗
    cancelBlackModal=(id, companyId, company)=>{
        let deletInfo = this.state.deletInfo;
        deletInfo['id'] = id;
        deletInfo['companyId'] = companyId;
        deletInfo['company'] = company;
        this.setState({
            offDislikeCheckedArr: {
                0: false,
                1: false,
                2: false
            },
            deletInfo: deletInfo,
            cancelBlackVisible: true
        });
    }
    /**
     * 确认移除黑名单
     * @param  {[type]} deletInfo  [description]
     */
    confirmDelete=()=>{
        let _this = this;
        let reasons = [];
        let checkedArr = this.state.offDislikeCheckedArr;
        for(let i in checkedArr){
            if( i === '0' && checkedArr[i] && _this.state.otherValue.trim()){
                reasons.push({
                    k: 4,
                    v: _this.state.otherValue.trim()
                });
            }
            if( i === '1' && checkedArr[i]){
                reasons.push({
                    k: 3,
                    v: '已排查/排除非法集资可能性'
                });
            }
            if( i === '2' && checkedArr[i]){
                reasons.push({
                    k: 3,
                    v: '误操作'
                });
            }
        }
        if(reasons.length > 0){
            this.cancelBlack(reasons);
        }
    }
    /**
     * 取消移除黑名单
     * @param  {[type]} deletInfo  [description]
     */
    cancelDelete =()=>{
        this.setState({
            cancelBlackVisible: false
        });
    }
    // 导出列表的弹窗
    showModal = () =>{
        this.setState({
            exportVisible: true
        });
    }
    /**
     * 确认导出
     * @param  {[type]} deletInfo  [description]
     */
    confirmExport = () =>{
        window.location = `/api/v1.0/personal/importMyBlack.do?order=${encodeURIComponent(this.state.descAsc)}&industry=${encodeURIComponent(this.state.selectIndustry)}&isBlack=${encodeURIComponent(true)}`;
        this.cancelExport();
    }
    /**
     * 取消导出
     * @param  {[type]} deletInfo  [description]
     */
    cancelExport =() =>{
        this.setState({
            exportVisible: false
        });
    }
    /**
     * 全部行业
     * @param  {[type]} e    [description]
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    selectIndustryOnChang = (e, data) =>{ 
        this.setState({
            selectIndustry: data.children,
            start: 1
        }, ()=>{
            this.pagelist.toPage(1);
            this.getBlackList();
            this.getExtport();
        });
    }

    /**
     * [按照字段排序]
     * @param  {[type]} type [需要排序的字段]
     * @param  {[type]} dom  [当前要排序的dom]
     * @return {[type]}      [description]
     */
    sortList = (type, dom) => {
        let domdescAsc = this[dom].className;
        let getDomDescAsc = this.state.descAsc;
        if(domdescAsc.indexOf('des') !== -1) {
            this[dom].className = 'sort asc';
            getDomDescAsc = 'ASC';
        } else {
            this[dom].className = 'sort des';
            getDomDescAsc = 'DESC';
        }
        this.setState({
            descAsc: getDomDescAsc,
            order: type,
            start: 1
        }, ()=>{
            this.pagelist.toPage(1);
            this.getBlackList();
            this.getExtport();
        });
    }

    /**
     * 分页点击
     * @param pageNumber
     */
    pageCallback =(pageNumber)=> {
        if(this.state.start !== pageNumber.current){
            this.setState({
                start: pageNumber.current
            }, ()=> {
                this.getBlackList();
            });
        }
    }

    /**
     * 分页跳转
     * @param e
     */
    toPage = (e) => {
        let num = parseInt(this.num.getValue(), 10);
        if (!isNumber(num) || num <= 0) {
            return Tip.warning('请输入大于0的整数！');
        }
        this.pagelist.toPage(this.num.getValue());
    }

    /**
     * 多选框
     * @param data
     */
    onChangeGroup =(data)=>{
        this.setState({
            checkboxVal: data
        });
    }

    /**
     * 是否被选择
     * @param item
     * @param arr
     * @returns {*}
     */
    isChecked=(item, arr)=>{
        return this.state[arr][item];
    }

    /**
     * 取消拉黑modal checkbox回调
     * @param data
     * @param value
     */
    offDislikeChange =(data, value)=>{
        let _this = this;
        this.setState({
            offDislikeCheckedArr: Object.assign({}, {
                0: false,
                1: false,
                2: false
            }, { [value.value]: !_this.state.offDislikeCheckedArr[value.value] })
        });
    }
    // input change callback
    handleInputChange =(e)=>{
        this.setState({
            otherValue: e.target.value
        });
    }

    /**
     * 跳转详情页处理
     * @param routeId
     * @param id
     * @param company
     * @param industry
     */
    goToDetail=(companyId, id, company, industry)=>{
        personalCenterPAPI({
            type: PERSONAL_CENTER_LOOK_BLACKLIST,
            data: {
                qyxxId: companyId,
                id: id
            }
        }).then(({ data })=>{
            if(data.code === 200){
                personalCenterGAPI({
                    type: PERSONAL_CENTER_CHECK_ISBLACK,
                    data: {
                        companyId: companyId
                    }
                }).then(({ data })=>{
                    if(data.content === true){
                        window.open(`${DEFAULT_DETAIL}/${BLACK}/${company}/${companyId}/${switchIndustryYW(industry)}/${switchIndustry(industry)}`);
                    }else {
                        window.open(`${DEFAULT_DETAIL}/${switchIndustry(industry)}/${company}/${companyId}/${switchIndustryYW(industry)}`);
                    }
                    this.getBlackList();
                }, (error)=>{
                    console.error(error.message);
                });
            }
        }, (error)=>{
            console.error(error.message);
        });
    }
    render() {
        return (
            <div className="blackList">
                <div className="tab-item">
                    <div className="header">我的黑名单
                        {this.state.exportTotal > 0 ? <div className="export" onClick={this.showModal}><em className="iconfont icon-xiangxi"></em>&nbsp;导出列表</div> : null}
                    </div>
                    <table className="table-theme table-bg textC">
                        <thead>
                            <tr>
                                <td>序号</td>
                                <td width="25%">企业名</td>
                                <td>
                                    <Select
                                            value={0}
                                            style = {{ width: 100 }}
                                            onChange = {this.selectIndustryOnChang} 
                                            modalStyle = {{ color: '#fff' }}
                                            trigger = {'click'}>
                                            { 
                                                this.state.industryList.map(function(item, index){
                                                    {
                                                        return ( 
                                                            <Option value={index} key={item.name}>{item.name}</Option>
                                                        );
                                                    }
                                                })
                                            }
                                    </Select>
                                </td>
                                <td>
                                     <span className="sort des" 
                                        ref={ date => this.date = date} 
                                        onClick={this.sortList.bind(this, '加入黑名单日期', 'date')} >加入黑名单日期
                                        <em className="iconfont icon-paixu color-blue"></em>
                                    </span>
                                </td>
                                <td>加入原因</td>
                                <td>移出黑名单</td>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                !(this.state.listData.length > 0) ? (<tr><td colSpan="8">{this.state.listLoading}</td></tr>) : 
                                this.state.listData.map((ele, index) =>{
                                    let indexNum = (this.state.start - 1) * this.state.size + index + 1;
                                    return (ele.black ?
                                        <tr key = {uuid()}>
                                            <td>{indexNum}</td>
                                            <td><span className = "btn font18 company-hover text-ellipsis-200" title={ ele.companyName ? ele.companyName : '-' } onClick={this.goToDetail.bind(this, ele.qyxxId, ele.id, ele.companyName, ele.industry)}>{ele.companyName ? ele.companyName : '-'}</span></td>
                                            <td>{ele.industry ? ele.industry : '-'}</td>
                                            <td>{ele.addDate ? ele.addDate.replace(/(.{10}).*/, '$1') : '-'}</td>
                                            <td><span className="text-ellipsis" style={{ cursor: 'default' }} title={ele.blackReasons ? ele.blackReasons : '-'}>{ele.blackReasons ? ele.blackReasons : '-'}</span></td>
                                            <td><i className="iconfont icon-heimingdan color-red font22" onClick={this.cancelBlackModal.bind(this, ele.id, ele.qyxxId, ele.companyName)} /></td>
                                        </tr> :
                                        <tr key = {uuid()}>
                                            <td>{indexNum}</td>
                                            <td><span className = "btn font18 company-hover  text-ellipsis-200" onClick={this.goToDetail.bind(this, ele.qyxxId, ele.id, ele.companyName, ele.industry)}>{ele.companyName}</span></td>
                                            <td  colSpan="4" title={ele.cancelReasons}>该企业已被移出黑名单，原因为：{fieldAnomaly(ele.cancelReasons)} </td>
                                        </tr>
                                    );
                                })
                            }
                            
                        </tbody>
                    </table>
                </div>
                <div className="page-box" style={{ display: this.state.listData.length > 0 ? 'block' : 'none' }}>
                    <PageList ref={ pagelist => this.pagelist = pagelist}
                        current={this.state.start} 
                        pageSize={this.state.size} 
                        callback={this.pageCallback} 
                        total={this.state.total}/>
                            &nbsp;<Input style={{ width: 50 }} defaultValue="" ref={ num => this.num = num} size="xm" type="text" />
                            &nbsp;<Button size="sm" onClick={this.toPage.bind(this)}>跳转</Button>
                </div>
                <Modal
                    visible={this.state.exportVisible}
                    wrapClassName="vertical-center-modal"
                    width={460}
                    okText={'提交'}
                    title={'导出列表'}
                    onCancel={this.cancelExport.bind(this)}
                    onOk={this.confirmExport.bind(this)}
                >
                    <div className="mt-panel-box">
                        <p className = "font16 color-gray line">共<b className = "color-blue">{this.state.exportTotal}</b>条企业信息</p>
                        <p className = "font16 color-gray line">是否确认导出</p>
                    </div>
                </Modal>

                {/* 移除黑名单弹出窗*/}
                <Modal
                    visible={this.state.cancelBlackVisible}
                    wrapClassName="vertical-center-modal cancel-black"
                    width={460}
                    okText={'提交'}
                    title={'移出黑名单'}
                    onCancel={this.cancelDelete.bind(this)}
                    onOk={this.confirmDelete.bind(this)}
                >
                    <div className="mt-panel-box">
                            <p className = "font14 line warning">注：移出黑名单须确认其无非法集资可能性，且会影响模型构 建，请谨慎操作！</p>
                            <div className="check-box font16">
                                <Checkbox checked={this.isChecked('1', 'offDislikeCheckedArr')} value="1" onChange={this.offDislikeChange.bind(this)}>已排查/排除非法集资可能性</Checkbox>
                                <Checkbox checked={this.isChecked('2', 'offDislikeCheckedArr')} value="2" onChange={this.offDislikeChange.bind(this)}>误操作</Checkbox>
                            </div>
                            <div className="check-box font16">
                                <Checkbox value="0" style={{ marginRight: '15px' }} checked={this.isChecked('0', 'offDislikeCheckedArr')} onChange={this.offDislikeChange.bind(this)}>其他</Checkbox>
                                <Input onChange={this.handleInputChange.bind(this)} disabled={ !this.state.offDislikeCheckedArr['0'] } ref={ (ipt) => { this.otherInput = ipt;} } placeholder="请输入原因" size="nm"/>
                            </div>
                        </div>
                </Modal>
            </div>
        );
    }
}