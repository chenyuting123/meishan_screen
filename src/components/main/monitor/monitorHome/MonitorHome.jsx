/*
* author:TanJun
* describe:SearchHome
* createTime:2018/6/20
* */
import './monitorHome.scss';
import React, { Component } from 'react';
import { Menu, Dropdown } from 'antd';
import Upload from '../../../common/Upload/Upload';
import WarningInfo from '../../../home/map/myUi/WarningInfo';
import { Btnswitch } from '../../../common/indexComponent/IndexComponent';
import { Input, Button, Select, Modal, Tip, LoadingModal, Checkbox } from 'mtui/index';
import MyModal from 'antd/lib/modal/Modal';
import PageList from '../../../common/pageList/PageList';
import { Trim } from 'Utils/arrFilter';
import { getLocal } from 'Utils/storage';
import { Switch, Table } from 'antd';
import { DEFAULT_DETAIL } from 'RouterPath';
import { Services } from 'Constants/common';
import { isNumber } from 'Utils/util';
import { switchIndustry, switchIndustryYW } from 'Utils/formatter';
import { personalCenterPAPI, personalCenterGAPI, batchUpload, riskMonitorPAPI } from 'Services/monitor';
import { MyCheckBox } from '../../../common/indexComponent/IndexComponent';
const { MONITOR_HOME_INDEXCOUNT, MONITOR_HOME_SEARCH_DETAIL, MONITOR_HOME_ADD_RISK, MONITOR_HOME_GETMONLIST, MONITOR_HOME_cancelMONITOR, MONITOR_HOME_DOWNLOAD_MODEL, MONITOR_HOME_PUSHTOP,
    MONITOR_HOME_SELECTALL, MONITOR_HOME_DELETED, MONITOR_HOME_SETUP, MONITOR_HOME_SELECT, MONITOR_HOME_SETUOBUTTON, MONITOR_HOME_ADD } = Services;
const titleList = [
        { color: 'rgba(41,222,255,1)', title: '已监控企业' },
        { color: 'rgba(22,240,186,1)', title: '本月新增监控企业' },
        { color: 'rgba(254,125,21,1)', title: '本周风险变动' },
        { color: 'rgba(162,176,203,1)', title: '黑名单企业' }
    ],
    monitorTabList = [
        { text: '搜索添加', value: '0' },
        { text: '批量导入', value: '1' }
    ],
    tabList = [
        { text: '监控更多', value: '0' },
        { text: '推送设置', value: '1' }
    ];
const searchListColumns =  [{
    title: '企业名称',
    dataIndex: 'company'
}, {
    title: '企业类型',
    dataIndex: 'companyType'
}, {
    title: '经营状态',
    dataIndex: 'operate'
},
{
    title: '风险类型',
    dataIndex: 'risk'
}];

class MonitorHome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabActiveVal: '0',
            selectOperateVal: 0,
            monitorActiveVal: '0',
            choseBtn: 'confirm',
            indexCount: {},
            val: '',
            searchList: [],
            searchPage: 0,
            searchPageSize: 5,
            searchTotal: 0,
            addCompany: [],
            addCompanyId: [],
            page: 1,
            pageSize: 10,
            total: 0,
            monitorList: [], // 监控列表
            isTop: undefined,
            listLoading: '数据载入中...',
            companyName: undefined,
            droId: '',
            menu: (<Menu></Menu>),
            editId: '',
            fileName: '', // 选择到的文件的名字。
            pageShow: true,
            emailList: [],
            phoneList: [],
            eCount: 0,
            pCount: 0,
            otherValue: '', // 用户输入其他原因
            searchSelectedRowKeys: [],
            likeVisible: false, // 加入监控
            likeCheckedArr: {
                0: false,
                1: false,
                2: false,
                3: false
            }, // 监控的时候选择理由,
            checkBoxSelected: [],
            allChecked: false,
            emailSelectedRowKeys: [],
            phoneSelectedRowKeys: [],
            emailId: [], // 选中的邮箱ID
            phoneId: [], // 选中的手机ID
            emailIsChecked: true,
            phoneIsChecked: true,
            addIsShowE: false,
            addIsShowP: false,
            emailText: '',
            phoneText: ''
        };
        this.allcheckBox = [];
        // this.editAry = []; // 保存删除的ID数组
    }
    componentDidMount() {
        this.findIndexCount();
        this.getMonitorList();
    }

    handleChange = (e) =>{
        this.setState({
            val: Trim(e.target.value, 'g')
        });
    };
    // 获取监控列表显示及置顶
    getMonitorList = () =>{
        let { page, pageSize, companyName, isTop } = this.state;
        personalCenterPAPI({
            type: MONITOR_HOME_GETMONLIST,
            data: {
                userId: getLocal('user').id,
                page,
                pageSize
            }
        }).then(({ data })=>{
            this.setState({
                listLoading: '暂无相关数据！'
            }, () =>{
                this.setState({
                    monitorList: data.content.items ? data.content.items : [],
                    total: data.content.totalCount
                });
            });
        }, (error)=>{
            console.error(error.message);
        });
    }
    // 点击返回监控列表
    callBackList = () =>{
        this.setState({
            val: '',
            searchPage: 0
        }, ()=>{
            this.monitorMore.showModal(false);
        });
    }
    // 点击加入监控
    addClick = () =>{
        let { addCompany, addCompanyId } = this.state;
        if(addCompanyId.length > 0){
            // this.setState({
            //     likeVisible: true
            // });
            personalCenterPAPI({
                type: MONITOR_HOME_ADD_RISK,
                data: {
                    userId: getLocal('user').id,
                    // companyName: addCompany.toString(),
                    companyId: addCompanyId.toString(),
                    groupId: 0
                }
            }).then(({ data })=>{
                Tip.success(data.content);
                this.getMonitorList();
                this.monitorMore.showModal(false);
            }, (error)=>{
                console.error(error.message);
            });
        }else{
            Tip.warning('请选择需要加入监控的公司！');
        }
        
    }
    // 弹窗搜索列表
    searchClick = () => {
        let { val, searchPage, searchPageSize } = this.state;
        if(val !== ''){
            personalCenterPAPI({
                type: MONITOR_HOME_SEARCH_DETAIL,
                data: {
                    page: searchPage, 
                    pageSize: searchPageSize,
                    companyName: val
                }
            }).then(({ data })=>{
                let content = [];
                data.content.items.length > 0 && data.content.items.map((item, index)=>{
                    let obj = {
                        ...item,
                        key: index,
                        company: <div title={item.unHighLightCompanyName ? item.unHighLightCompanyName : '-'} className="tableDiv"  dangerouslySetInnerHTML={{
                            __html: item.unHighLightCompanyName ? item.unHighLightCompanyName : '-'
                        }}/>,
                        companyType: <div title={item.companyType ? item.companyType : '-'} className="tableDiv"  dangerouslySetInnerHTML={{
                            __html: item.companyType ? item.companyType : '-'
                        }}/>,
                        operate: <div title={item.companyEnterpriseStatus ? item.companyEnterpriseStatus : '-'} className="tableDiv"  dangerouslySetInnerHTML={{
                            __html: item.companyEnterpriseStatus ? item.companyEnterpriseStatus : '-'
                        }}/>,
                        risk: <div title={item.riskLevel ? item.riskLevel : '-'} className="tableDiv"  dangerouslySetInnerHTML={{
                            __html: item.riskLevel ? item.riskLevel : '-'
                        }}/>
                    };
                    content.push(obj);
                });
                this.setState({
                    searchList: content,
                    searchTotal: data.content.totalCount
                });
            }, (error)=>{
                console.error(error.message);
            }); 
        } else{
            Tip.warning('请输入企业名称关键词！');
        }
    }
    
    /**
     *  分页点击后执行
     */
    searchPageCallback =  (pageInfo) => {
        this.setState({
            searchPage: pageInfo.current - 1,
            searchSelectedRowKeys: []
        }, ()=>{
            this.searchClick();
        });
    }
    onClick=({ key })=>{
        let { droId, companyName } = this.state;
        if(key === '1'){
            this.handleOpenCancel(droId);
        }
        if(key === '2'){
            this.setState({
                isTop: true
            }, ()=>{
                this.handleOpenTop(droId, this.state.isTop);
            });
        }
        if(key === '3'){
            this.setState({
                isTop: false
            }, ()=>{
                this.handleOpenUnTop(droId, this.state.isTop);
            });
        }
    }
    handleClickDro = (ite) =>{
        if(ite !== 'p1'){
            const menu = (
                <Menu onClick={this.onClick}>
                    <Menu.Item key="1">取消监控</Menu.Item>
                    {
                        ite.top ? <Menu.Item key="3">取消置顶</Menu.Item> : <Menu.Item key="2">置顶</Menu.Item>
                    }
                </Menu>
            );
            this.setState({
                menu,
                companyName: ite.companyName,
                droId: ite.id
            });
        } else{
            this.setState({
                companyName: '',
                droId: ''
            });
        }
        
    }
    // 打开监控更多弹框
    openMonitorMore = () =>{
        this.setState({
            monitorActiveVal: '0',
            val: '',
            searchList: [],
            searchPage: 0,
            searchSelectedRowKeys: [],
            searchTotal: 0,
            pageShow: true
        }, ()=>{
            this.monitorMore.showModal(true);
            this.refsSearchPageList.refresh();
        });
        
    }
    searchListSelct = (selectedRowKeys, selectedRows) =>{
        this.setState({ searchSelectedRowKeys: selectedRowKeys });
        let company = [],
            companyId = [];
        selectedRows.length !== 0 ? selectedRows.map((item, index)=>{
            company.push(item.companyName);
            companyId.push(item.bbdQyxxId || item.qyxxId);
            this.setState({
                addCompany: company,
                addCompanyId: companyId
            });
        }) : this.setState({
            addCompany: [],
            addCompanyId: []
        });
    }
    render() {
        let { tabActiveVal,  monitorActiveVal, choseBtn, indexCount, searchList, searchPage, searchPageSize, searchTotal, monitorList, listLoading, menu, pageShow, eCount, pCount, searchSelectedRowKeys, checkBoxSelected, allChecked, emailList, phoneList, emailSelectedRowKeys, phoneSelectedRowKeys, emailIsChecked, phoneIsChecked, addIsShowE, addIsShowP, emailText, phoneText } = this.state;
        const menu1 = (
            <Menu onClick={this.onClick}>
                <Menu.Item key="1">取消监控</Menu.Item>
                <Menu.Item key="2">置顶</Menu.Item>
                <Menu.Item key="3">取消置顶</Menu.Item>
            </Menu>
        );
        const emailColumns = [{
            title: <span className="eTile"><span>邮箱</span> <label className="oriColor">已选： {eCount}</label><button onClick={this.openAddE}>添加</button><button className="grayColor" onClick={this.delEmailOrPhone.bind(this, 'email')}>删除</button></span>,
            dataIndex: 'email'
        }];
        const phoneColumns = [{
            title: <span className="eTile"><span>手机号码</span> <label className="oriColor">已选： {pCount}</label><button onClick={this.openAddP}>添加</button><button className="grayColor" onClick={this.delEmailOrPhone.bind(this, 'phone')}>删除</button></span>,
            dataIndex: 'phone'
        }];
        const emailRowSelection = {
            selectedRowKeys: emailSelectedRowKeys,
            onChange: this.emailListSelct
        };
        const phoneRowSelection = {
            selectedRowKeys: phoneSelectedRowKeys,
            onChange: this.phoneListSelct
        };
        const addRiskRowSelection = {
            selectedRowKeys: searchSelectedRowKeys,
            onChange: this.searchListSelct
        };
        this.allcheckBox = monitorList.map((item) => item.id);
        return (
            <div className="monitor-home-root">
                <div className="monitor-home-banner">
                {
                    titleList.map(({ title, color }, index) => <WarningInfo title={title} key={index} color={color}
                                                                             type = "monitor" indexCount ={indexCount}/>)
                }
                </div>
                <div className="monitor-home-main">
                    <div className="btn-tab">
                        <Btnswitch btnList={tabList} value={tabActiveVal}
                               onClick={this.choseTab}/>
                    </div>
                    <div className="content">
                        <div className="tableContent">
                            <table className="table-theme">
                                <thead>
                                    <tr>
                                        <td>
                                            <MyCheckBox onClick={this.handleAllCheckedItem} selected={allChecked}></MyCheckBox>
                                        </td>
                                        <td>序号</td>
                                        <td>企业名称</td>
                                        {/* <td>进入日期</td>*/}
                                        <td>行政处罚</td>
                                        <td>分支机构</td>
                                        <td>经营异常</td>
                                        <td>失信信息</td>
                                        <td>风险关联方</td>
                                        <td>诉讼信息</td>
                                        <td>工商变更</td>
                                        <td>风险分值</td>
                                        <td>民间借贷法律文书</td>
                                        <td>对外投资</td>
                                        <td>黑名单关联方</td>
                                        <td>高风险关联方</td>
                                        <td>与黑名单地址相同</td>
                                        <td>包含非法集资裁判文书</td>
                                        <td>利益一致行动法人</td>
                                        <td>地址相同企业</td>
                                        <td>注吊销企业</td>
                                        <td>
                                            <Dropdown overlay={menu1} trigger={['click']}  onClick={this.handleClickDro.bind(this, 'pl')}>
                                                <input type="text" placeholder="批量操作"/>
                                            </Dropdown>
                                        </td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        monitorList.length !== 0 ? monitorList.map((ite, index)=>{
                                            let indexNum = (this.state.page - 1) * this.state.pageSize + index + 1;
                                            return (
                                                <tr key ={index}>
                                                    <td>
                                                        <MyCheckBox onClick={this.handleCheckedItem.bind(this, ite.id)} selected={checkBoxSelected.indexOf(ite.id) !== -1}></MyCheckBox>
                                                    </td>
                                                    <td>{indexNum}</td>
                                                    <td><span className="btn font18 company-hover text-ellipsis-200" title={ite.companyName ? ite.companyName : '-'} onClick={this.goToDetail.bind(this, ite.companyId, ite.companyName, ite.industry)}>{ite.companyName ? ite.companyName : '-'}</span><sup className="iconfont icon-top" style={{ display: ite.top ? '' : 'none' }}></sup></td>
                                                    {/* <td>
                                                    {ite.date}
                                                    </td> */}
                                                    <td>{ite.totalXzcfNum ? ite.totalXzcfNum : '-'}</td>
                                                    <td>{ite.totalFzjgNum ? ite.totalFzjgNum : '-'}</td>
                                                    <td>{ite.totalQyycNum ? ite.totalQyycNum : '-'}</td>
                                                    <td>{ite.totalDishonestyNum ? ite.totalDishonestyNum : '-'}</td>
                                                    <td>{ite.totalFxglfNum ? ite.totalFxglfNum : '-'}</td>
                                                    <td>{ite.totalDocumentNum ? ite.totalDocumentNum : '-'}</td>
                                                    <td>{ite.totalBgxxNum ? ite.totalBgxxNum : '-'}</td>
                                                    <td>{ite.riskIndex ? ite.riskIndex : '-'}</td>
                                                    <td>{ite.totalPrivatelen ? ite.totalPrivatelen : '-'}</td>
                                                    <td>{ite.totalDegree ? ite.totalDegree : '-'}</td>
                                                    <td>{ite.blackNum ? ite.blackNum : '-'}</td>
                                                    <td>{ite.totalHighNum ? ite.totalHighNum : '-'}</td>
                                                    <td>{ite.blackAddrEqual ? ite.blackAddrEqual : '-'}</td>
                                                    <td>{ite.cpwsNum ? ite.cpwsNum : '-'}</td>
                                                    <td>{ite.commonInterest ? ite.commonInterest : '-'}</td>
                                                    <td>{ite.addrEqual ? ite.addrEqual : '-'}</td>
                                                    <td>{ite.estdateNum ? ite.estdateNum : '-'}</td>
                                                    <td>
                                                        <Dropdown overlay={menu} onClick={this.handleClickDro.bind(this, ite)} trigger={['click']}>
                                                            <input type="text" placeholder="操作更多"/>
                                                        </Dropdown>
                                                    </td>
                                                </tr>
                                            );
                                        }) : <tr>
                                            <td colSpan="12">{listLoading}</td>
                                        </tr>
                                    }
                                    
                                </tbody>
                            </table>
                        </div>
                        <div className="page-box pageStyle" style={{ display: monitorList.length > 0 ? 'block' : 'none' }}>
                            <PageList
                                ref={(c) => { this.refsPageList = c; }}
                                current={this.state.page}
                                pageSize={this.state.pageSize}
                                callback={this.PageCallback}
                                total={this.state.total} />
                                &nbsp;第&nbsp;<Input style={{ width: 50 }} defaultValue="" ref={(num) => {this.num = num;}} size="xm" type="text" />&nbsp;页
                                 &nbsp;<Button size="sm" onClick={this.toPage}>跳转</Button>
                        </div>
                    </div>
                    {/* 监控更多 */}
                    <div className="monitor-more">
                        <Modal ref={(monitorMore) => {this.monitorMore = monitorMore;}} modalClassName="animated bounceInDown" className="monitor-modal" style={{ width: 856, height: 521 }} >
                            <div className="mt-panel-min">
                                <div className="mt-panel-h2">监控更多</div>
                                <div className="mt-panel-box monitorMore-panel">
                                    {
                                        monitorActiveVal === '0' ? <Btnswitch btnList={monitorTabList} value={monitorActiveVal}
                                        onClick={this.choseMonitorTab}/> : null
                                    }
                                    {
                                        monitorActiveVal === '0' ? 
                                        <Input onChange={this.handleChange} value={this.state.val} placeholder="在此输入企业名称关键词" suffix={<a onClick={this.searchClick}><i className="iconfont icon-search"></i></a>}/>
                                        : <div className="btnBox">
                                            <span className="backBtn" onClick={this.handleClickCallBack}>返回上一级</span>
                                            <Upload
                                                serverUrl="/api/v1.0/riskMonitor/excelImport.do" // 上传地址
                                                accept="xlsx,xls"
                                                isImmediate={true} // 是否立即上传
                                                multiple={false} // 是否支持多选
                                                change={this.uploadChange} // 选择文件后回调
                                                submit={this.submit} // 提交上传文件
                                                error={this.fileTypeError}
                                                complete={this.complete} // 上传完毕
                                                uploadName = "选择本地文件"
                                            />
                                            <button onClick={this.downLoadModel}>下载Excel模板</button>
                                         </div>
                                    }
                                    <div className="table-content">
                                        <Table rowSelection={addRiskRowSelection} selections={false} columns={searchListColumns} dataSource={searchList} pagination={false}/>
                                    </div>
                                </div>
                                {
                                    pageShow ?  <div className="page-box pageStyle monitor-style" style={{ display: searchList.length > 0 ? 'block' : 'none' }}>
                                                    <PageList
                                                        ref={(b) => { this.refsSearchPageList = b; }}
                                                        current={searchPage + 1}
                                                        pageSize={searchPageSize}
                                                        callback={this.searchPageCallback}
                                                        total={searchTotal} 
                                                        isShow={false}/>
                                                </div> : null
                                }
                               
                                <div className="footer-panel monitor-foot">
                                        <button className={choseBtn === 'confirm' ? 'modal-btn modal-btn-active' : 'modal-btn'} onClick={this.addClick}>一键加入监控</button>
                                        <button className={choseBtn === 'cancel' ? 'modal-btn modal-btn-active' : 'modal-btn'} onClick={this.callBackList}>返回监控列表</button>
                                </div>
                            </div>
                        </Modal>
                    </div>
                     {/* 推送设置 */}
                     <div className="pushSet">
                        <Modal ref={(pushSet) => {this.pushSet = pushSet;}} modalClassName="animated bounceInDown" className="pushSet-modal" style={{ width: 800, height: 470 }}>
                            <div className="mt-panel-min">
                                <div className="mt-panel-h2">推送设置</div>
                                <div className="mt-panel-box push-panel-box clearfix">
                                    <div className="email-panel left">
                                        <p className="title">邮箱推送设置 <Switch checked={emailIsChecked} onChange={this.steUpOnChange.bind(this, 'email')} /></p>
                                        <Table rowSelection={emailRowSelection} columns={emailColumns} dataSource={emailList}  pagination={false} />
                                        <div className={addIsShowE ? 'addBox' : 'addBox hidden'}>
                                            <input type="text" placeholder="请输入邮箱" onChange={(e) => this.changeInput('emailText', e)} value={emailText}/>
                                            <button onClick={this.addOnClick.bind(this, 'email')}>确定</button>
                                            <button onClick = {this.cancleAddClick.bind(this, 'email')}>取消</button>
                                        </div>
                                    </div>
                                    <div className="phone-panel right">
                                        <p  className="title">手机短信通知 <Switch checked={phoneIsChecked} onChange={this.steUpOnChange.bind(this, 'phone')} /></p>
                                        <Table rowSelection={phoneRowSelection} columns={phoneColumns} dataSource={phoneList}  pagination={false} />
                                        <div className={addIsShowP ? 'addBox' : 'addBox hidden'}>
                                            <input type="text" placeholder="请输入手机号" onChange={(e) => this.changeInput('phoneText', e)} value={phoneText}/>
                                            <button onClick={this.addOnClick.bind(this, 'phone')}>确定</button>
                                            <button onClick = {this.cancleAddClick.bind(this, 'phone')}>取消</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="footer-panel">
                                        <button className={choseBtn === 'confirm' ? 'modal-btn modal-btn-active' : 'modal-btn'} onClick={this.handleClickModal.bind(this, 'confirm')}>完成</button>
                                        <button className={choseBtn === 'cancel' ? 'modal-btn modal-btn-active' : 'modal-btn'} onClick={this.handleClickModal.bind(this, 'cancel')}>取消</button>
                                </div>
                            </div>
                        </Modal>
                        {/* 是否确定取消监控弹出框*/}
                        <Modal ref={(cancelModal) => {this.cancelModal = cancelModal;}} modalClassName="animated bounceInDown" className=" cancel_modal" style={{ width: 396, height: 210 }}>
                            
                            <div className="mt-panel-min">
                                <div className="mt-panel-h2"></div>
                                <div className="mt-panel-box mt-warn-content">
                                    <i className="iconfont icon-isSure delModalIcon"></i>
                                    <span>是否确定取消监控</span>
                                </div>
                                <div className="popUpFooter">
                                    <button className="modalBtn modalBorderBtn" onClick={this.confirmCancelMonitor}>确定</button>
                                    <button className="modalBtn backStyle" onClick={this.unCancelMonitor.bind(this, 'unCancelMonitor')}>返回</button>
                                </div>
                            </div>
                        </Modal>  
                         {/* 是否确定顶置弹出框*/}
                         <Modal ref={(topModal) => {this.topModal = topModal;}} modalClassName="animated bounceInDown" className=" cancel_modal" style={{ width: 396, height: 210 }}>
                            
                            <div className="mt-panel-min">
                                <div className="mt-panel-h2"></div>
                                <div className="mt-panel-box mt-warn-content">
                                    <i className="iconfont icon-isSure delModalIcon"></i>
                                    <span>是否确定顶置监控信息</span>
                                </div>
                                <div className="popUpFooter">
                                    <button className="modalBtn modalBorderBtn" onClick={this.confirmTopMonitor}>确定</button>
                                    <button className="modalBtn backStyle" onClick={this.unCancelMonitor.bind(this, 'unPushTop')}>返回</button>
                                </div>
                            </div>
                        </Modal>
                        {/* 是否确定取消顶置弹出框*/}
                        <Modal ref={(unTopModal) => {this.unTopModal = unTopModal;}} modalClassName="animated bounceInDown" className=" cancel_modal" style={{ width: 396, height: 210 }}>
                            
                            <div className="mt-panel-min">
                                <div className="mt-panel-h2"></div>
                                <div className="mt-panel-box mt-warn-content">
                                    <i className="iconfont icon-isSure delModalIcon"></i>
                                    <span>是否确定取消顶置监控信息</span>
                                </div>
                                <div className="popUpFooter">
                                    <button className="modalBtn modalBorderBtn" onClick={this.confirmUnTopMonitor}>确定</button>
                                    <button className="modalBtn backStyle" onClick={this.unCancelMonitor.bind(this, 'unTop')}>返回</button>
                                </div>
                            </div>
                        </Modal> 
                         {/* 加入监控 */}
                        <MyModal
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
                        </MyModal>   
                    </div>

                </div>

            </div>
        );
    }
    // 点击切换
    choseTab = (val) => {
        this.setState({
            tabActiveVal: val
        }, () => {
            if(this.state.tabActiveVal === '0'){
                this.openMonitorMore ();
            }else{
                this.pushSet.showModal(true);
                this.setUp();
            }
        });
    };
    choseMonitorTab = (val) => {
        this.setState({
            monitorActiveVal: val,
            pageShow: val === '0' ? true : false,
            searchList: [],
            searchSelectedRowKeys: []
        });
    };
    // 推送弹窗
    handleClickModal = (type) =>{
        this.setState({
            choseBtn: type
        });
        if(type === 'confirm') {
            this.pushSet.showModal(false);
        } else{
            this.pushSet.showModal(false);
        }
    }
    // 风险监控数据统计
    findIndexCount = () =>{
        personalCenterPAPI({
            type: MONITOR_HOME_INDEXCOUNT,
            data: {
                userId: getLocal('user').id
            }
        }).then(({ data })=>{
            this.setState({
                indexCount: data.content
            });
        }, (error)=>{
            console.error(error.message);
        });
    }
    // 大分页回调
    PageCallback =  (pageInfo) => {
        this.setState({
            page: pageInfo.current
        }, ()=>{
            this.getMonitorList();
        });
    }
     /**
     * 输入页码跳转
     */
    toPage = (e) => {
        let num = parseInt(this.num.getValue(), 10);
        if(!isNumber(num) || num <= 0){
            return Tip.warning('请输入大于0的整数！');
        }
        this.refsPageList.toPage(this.num.getValue());
    }
    // 下载模板
    downLoadModel = () =>{
        window.open('/api/v1.0/riskMonitor/testDownload');
    }
       /**
    }
    * 取消操作
    */
    unCancelMonitor = (type) =>{
        if(type === 'unCancelMonitor'){
            this.cancelModal.showModal(false);
        } 
        if(type === 'unPushTop'){
            this.topModal.showModal(false);
        }
        if(type === 'unTopModal'){
            this.unTopModal.showModal(false);
        }
    }
    /**
     *弹出取消监控弹出框
     */
    handleOpenCancel = (id) => {
        if(id !== undefined){
            this.setState({
                editId: parseInt(id, 10)
            });
        }else if (id === undefined){
            this.setState({
                editId: ''
            });
        }
        this.cancelModal.showModal(true);    
    }
    /**
     *弹出顶置弹出框
     */
    handleOpenTop = (id, isTop) => {
        if(id !== undefined){
            this.setState({
                editId: parseInt(id, 10)
            });
        }else if (id === undefined){
            this.setState({
                editId: ''
            });
        }
        this.topModal.showModal(true);    
    }
    /**
     *弹出取消顶置弹出框
     */
    handleOpenUnTop = (id, isTop) => {
        if(id !== undefined){
            this.setState({
                editId: parseInt(id, 10)
            });
        }else if (id === undefined){
            this.setState({
                editId: ''
            });
        }
        this.unTopModal.showModal(true);    
    }
      /**
     * 确认取消监控
     */
    confirmCancelMonitor = () =>{
        let{ editId } = this.state;
        if(editId !== ''){
            this.editUserInfo(editId);  
        }
        else{
            this.editTion();
        }

    }
    /**
     * 确定顶置
     */
    confirmTopMonitor = () =>{
        let{ editId, isTop } = this.state;
        if(editId !== ''){
            this.topUserInfo(editId, isTop);  
        }
        else{
            this.topTion();
        }
    }
    /**
     * 确定取消顶置
     */
    confirmUnTopMonitor = () =>{
        let{ editId, isTop } = this.state;
        if(editId !== ''){
            this.unTopUserInfo(editId, isTop);  
        }
        else{
            this.unTopTion();
        }
    }
       /**
     * 取消监控
     */
    editUserInfo =(obj) =>{
        personalCenterPAPI({
            type: MONITOR_HOME_cancelMONITOR,
            data: {
                focusId: obj
            }
        }).then(({ data })=>{
            this.cancelModal.showModal(false);
            Tip.success(data.content);
            this.findIndexCount();
            this.getMonitorList();
        }, (error)=>{
            console.error(error.message);
        });
    }
      /**
     * 顶置
     */
    topUserInfo =(obj, isTop) =>{
        personalCenterPAPI({
            type: MONITOR_HOME_PUSHTOP,
            data: {
                id: obj,
                isTop
            }
        }).then(({ data })=>{
            this.topModal.showModal(false);
            Tip.success(data.content);
            this.getMonitorList();
        }, (error)=>{
            console.error(error.message);
        });
    }
      /**
     * 取消顶置
     */
    unTopUserInfo =(obj, isTop) =>{
        personalCenterPAPI({
            type: MONITOR_HOME_PUSHTOP,
            data: {
                id: obj,
                isTop
            }
        }).then(({ data })=>{
            this.unTopModal.showModal(false);
            Tip.success(data.content);
            this.getMonitorList();
        }, (error)=>{
            console.error(error.message);
        });
    }
     /**
    }
    * 批量取消监控
    */
    editTion = () => {
        if( this.state.checkBoxSelected.length <= 0){
            Tip.error('请选择要删除的用户');
            this.cancelModal.showModal(false);
            return false;
        }
        personalCenterPAPI({
            type: MONITOR_HOME_cancelMONITOR,
            data: {
                focusId: this.state.checkBoxSelected.toString()
            }
        }).then(({ data })=>{
            this.cancelModal.showModal(false);
            Tip.success(data.content);
            this.findIndexCount();
            this.getMonitorList();
        }, (error)=>{
            console.error(error.message);
        });
    }
     /**
    }
    * 批量顶置
    */
    topTion = () => {
        let { isTop } = this.state;
        if( this.state.checkBoxSelected.length <= 0){
            Tip.error('请选择要删除的用户');
            this.topModal.showModal(false);
            return false;
        }
        personalCenterPAPI({
            type: MONITOR_HOME_PUSHTOP,
            data: {
                id: this.state.checkBoxSelected.toString(),
                isTop
            }
        }).then(({ data })=>{
            this.topModal.showModal(false);
            Tip.success(data.content);
            this.getMonitorList();
        }, (error)=>{
            console.error(error.message);
        });
    }
     /**
    }
    * 批量取消顶置
    */
    unTopTion = () => {
        let { isTop } = this.state;
        if( this.state.checkBoxSelected.length <= 0){
            Tip.error('请选择要删除的用户');
            this.unTopModal.showModal(false);
            return false;
        }
        personalCenterPAPI({
            type: MONITOR_HOME_PUSHTOP,
            data: {
                id: this.state.checkBoxSelected.toString(),
                isTop
            }
        }).then(({ data })=>{
            this.unTopModal.showModal(false);
            Tip.success(data.content);
            this.getMonitorList();
        }, (error)=>{
            console.error(error.message);
        });
    }
    
    /**
     * 选择文件
     * @param data
     */
    uploadChange = (data) => {
        this.setState({ fileName: data });
    }

    /**
     * 批量导入
     */
    submit = (data) => {
        LoadingModal.show();
        batchUpload(data, true)
        .then(({ data }) => {
            if(data.code === 200) {
                LoadingModal.hide();
                Tip.success('导入成功');
                this.setState({ fileName: '' });
                let content = [];
                data.content.length > 0 && data.content.map((item, index)=>{
                    let obj = {
                        ...item,
                        key: index,
                        company: <div title={item.companyName ? item.companyName : '-'} className="tableDiv"  dangerouslySetInnerHTML={{
                            __html: item.companyName ? item.companyName : '-'
                        }}/>,
                        companyType: <div title={item.companyType ? item.companyType : '-'} className="tableDiv"  dangerouslySetInnerHTML={{
                            __html: item.companyType ? item.companyType : '-'
                        }}/>,
                        operate: <div title={item.enterpriseStatus ? item.enterpriseStatus : '-'} className="tableDiv"  dangerouslySetInnerHTML={{
                            __html: item.enterpriseStatus ? item.enterpriseStatus : '-'
                        }}/>,
                        risk: <div title={item.riskLevel ? item.riskLevel : '-'} className="tableDiv"  dangerouslySetInnerHTML={{
                            __html: item.riskLevel ? item.riskLevel : '-'
                        }}/>
                    };
                    content.push(obj);
                    this.setState({
                        searchList: content
                    });
                });
            }else {
                LoadingModal.hide();
                Tip.warning(response.msg);
            }
        }, (error) =>{
            LoadingModal.hide();
            console.error(error.message);
        });
    }

    /**
     * 上传的文件类型错误时报错方法
     */
    fileTypeError = () => {
        Tip.error('导入文件类型错误，后缀名必须为.xlsx, .xls的文件！');
    }

    /**
     * 上传完成 --- ie9下触发
     * @param res
     */
    complete = (res) => {
        let complete = JSON.parse(res);
        if(complete.code === 1) {
            Tip.success(complete.message);
        }else {
            Tip.error(complete.message);
        }
    }
   // 返回上一级
    handleClickCallBack = () =>{
        this.setState({
            monitorActiveVal: '0',
            val: '',
            searchList: [],
            searchPage: 0,
            searchTotal: 0,
            pageShow: true,
            searchSelectedRowKeys: []
        });
    }
    // 点击跳转企业详情页面
    goToDetail(qyxxId, companyName, industry) {
        window.open(`${DEFAULT_DETAIL}/${switchIndustry(industry)}/${companyName}/${qyxxId}/${switchIndustryYW(industry)}`);
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
     * 监控Modal radio回调
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
    confirmOperate = (type) => {
        let checkedArr;
        let url;
        let reasonList = [], { addCompany, addCompanyId, otherValue, likeCheckedArr, dislikeCheckedArr, isProblem, hasMultiPlatforms } = this.state;
        let _this = this;
        if (type === 'likeCheckedArr') {
            checkedArr = likeCheckedArr;
            url = MONITOR_HOME_ADD_RISK;
            reasonList = [
                '其他原因', '出现负面舆情', '风险变动较大', '涉嫌非法集资'
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
            personalCenterPAPI({
                type: url,
                data: {
                    userId: getLocal('user').id,
                    companyId: addCompanyId.toString(),
                    reasons: reasonsStr,
                    groupId: ''
                }
            }).then(({ data })=>{
                Tip.success(data.content);
                this.getMonitorList();
                this.setState({
                    likeVisible: false
                });
                this.monitorMore.showModal(false);
            }, (error)=>{
                console.error(error.message);
            });
        } else {
            return;
        }
    }

      /**
     * 加入监控弹出窗--取消
     * @return {[type]} [description]
     */
    closelikeVisible() {
        this.setState({
            likeVisible: false
        });
    }
       /**
     * 设置checkbox是否选中
     */
    handleCheckedItem = (id) => {
        let allcheckBox = this.allcheckBox;
        let arr = this.state.checkBoxSelected;
        let change = true;
        if (arr.indexOf(id) === -1) {
            arr.push(id);
            this.setState({ checkBoxSelected: arr });
        }
        else {
            arr.splice(arr.indexOf(id), 1);
            for (let i = 0; i < allcheckBox.length; i++) {
                if (arr.indexOf(allcheckBox[i]) === -1) {
                    break;
                } else {
                    change = false;
                }
            }
            const extraParam = arr.length || change ? { allChecked: false } : { };
            this.setState({ ...{ checkBoxSelected: arr }, ...extraParam });
        }
    }

    handleAllCheckedItem = () => {
        let arr = this.state.checkBoxSelected;
        let allcheckBox = this.allcheckBox;
        if (!this.state.allChecked) {
            allcheckBox.map((item) => {
                if (arr.indexOf(item) === -1) {
                    arr.push(item);
                }
            });
            this.setState({
                allChecked: true,
                checkBoxSelected: arr
            });

        } else {
            allcheckBox.map((item) => {
                if (arr.indexOf(item) !== -1) {
                    arr.splice(arr.indexOf(item), 1);
                }
            });
            this.setState({
                allChecked: false,
                checkBoxSelected: arr
            });
        }
    }
    // 推送设置
    setUp = () =>{
        riskMonitorPAPI({
            type: MONITOR_HOME_SETUP
        }).then(({ data })=>{
            this.btnType();
            this.getEmailList();
            this.getPhoneList();
        });
    }
    // 显示判断按钮状态
    btnType = () =>{
        riskMonitorPAPI({
            type: MONITOR_HOME_SELECT
        }).then(({ data })=>{
            data && data.length !== 0  && 
           data.map((ite)=>{
               if(ite.type === 1){
                   this.setState({
                       emailIsChecked: ite.status === 1 ? true : false
                   });
               }else{
                   this.setState({
                       phoneIsChecked: ite.status === 1 ? true : false
                   });
               }
           });
        });
    }
    // 获取邮箱列表
    getEmailList = () =>{
        riskMonitorPAPI({
            type: MONITOR_HOME_SELECTALL,
            data: {
                type: 1
            }
        }).then(({ data })=>{
            let content = [];
            let selectList = [];
            let idArr = [];
            data && data.length !== 0 && data.map((item, index)=>{
                let obj = {
                    ...item,
                    key: index,
                    email: item.mailOrPhone
                };
                content.push(obj);
                if(item.isPitchOn === 1){
                    selectList.push(index);
                    idArr.push(item.id);
                }
            });
            this.setState({
                emailList: content,
                emailSelectedRowKeys: selectList,
                emailId: idArr
            });
        });
    }
     // 获取手机列表
    getPhoneList = () =>{
        riskMonitorPAPI({
            type: MONITOR_HOME_SELECTALL,
            data: {
                type: 2
            }
        }).then(({ data })=>{
            let content = [];
            let selectList = [];
            let idArr = [];
            data && data.length !== 0 && data.map((item, index)=>{
                let obj = {
                    ...item,
                    key: index,
                    phone: item.mailOrPhone
                };
                content.push(obj);
                if(item.isPitchOn === 1){
                    selectList.push(index);
                    idArr.push(item.id);
                }
            });
            this.setState({
                phoneList: content,
                phoneSelectedRowKeys: selectList,
                phoneId: idArr
            });
        });
    }
    emailListSelct = (selectedRowKeys, selectedRows) =>{
        this.setState({ emailSelectedRowKeys: selectedRowKeys, eCount: selectedRows.length });
        let emailId = [];
        selectedRows.length !== 0 ? selectedRows.map((item, index)=>{
            emailId.push(item.id);
            this.setState({
                emailId: emailId
            });
        }) : this.setState({
            emailId: []
        });
    }
    phoneListSelct = (selectedRowKeys, selectedRows) =>{
        this.setState({ phoneSelectedRowKeys: selectedRowKeys, pCount: selectedRows.length });
        let phoneId = [];
        selectedRows.length !== 0 ? selectedRows.map((item, index)=>{
            phoneId.push(item.id);
            this.setState({
                phoneId: phoneId
            });
        }) : this.setState({
            phoneId: []
        });
    }
    delEmailOrPhone = (type) =>{
        let idArr = [],
            { emailId, phoneId } = this.state;
        switch (type) {
            case 'email': {
                idArr = emailId;
                break;
            }
            case 'phone': {
                idArr = phoneId;
                break;
            }
        }
        if(idArr.length !== 0 ){
            riskMonitorPAPI({
                type: MONITOR_HOME_DELETED,
                data: {
                    id: idArr.toString()
                }
            }).then(({ data })=>{
                Tip.success('删除成功');
                if(type === 'email'){
                    this.setState({
                        emailSelectedRowKeys: [],
                        emailId: [],
                        eCount: 0
                    }, ()=>{
                        this.getEmailList();
                    });
                }else{
                    this.setState({
                        phoneSelectedRowKeys: [],
                        phoneId: [],
                        pCount: 0
                    }, ()=>{
                        this.getPhoneList();
                    });
                }
            });
        }else{
            Tip.warning('请先选择要删除的选项！');
        }
      
    }
    steUpOnChange = (name, checked) =>{
        riskMonitorPAPI({
            type: MONITOR_HOME_SETUOBUTTON,
            data: {
                type: name === 'email' ? 1 : 2,
                status: checked ? 1 : 0
            }
        }).then(({ data })=>{
            this.btnType();
        });
    }
    // 显示添加编辑框
    openAddE = () =>{
        this.setState({
            addIsShowE: true,
            emailText: ''
        });
    }
    openAddP = () =>{
        this.setState({
            addIsShowP: true,
            phoneText: ''
        });
    }
    changeInput = (value, e) =>{
        this.setState({
            [value]: e.target.value
        });
    }
    // 确定新增
    addOnClick = (name) =>{
        let { emailText, phoneText } = this.state;
        riskMonitorPAPI({
            type: MONITOR_HOME_ADD,
            data: {
                type: name === 'email' ? 1 : 2,
                mailOrPhone: name === 'email' ? emailText : phoneText
            }
        }).then(({ data })=>{
            if(name === 'email'){
                Tip.success('添加邮箱成功！');
                this.getEmailList();
                this.setState({
                    addIsShowE: false
                });
            }else{
                Tip.success('添加手机号码成功！');
                this.getPhoneList();
                this.setState({
                    addIsShowP: false
                });
            }
        });
    }
    // 取消新增
    cancleAddClick = (name) =>{
        if(name === 'email'){
            this.setState({
                addIsShowE: false
            });
        }else{
            this.setState({
                addIsShowP: false
            });
        }
    }
}

export default MonitorHome;