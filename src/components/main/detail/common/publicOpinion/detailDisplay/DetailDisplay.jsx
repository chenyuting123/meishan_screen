/**
 * Created by fuzhihong on 2017/7/7.
 * DetailDisplay 舆情详情展示
 */
import './detailDisplay.scss';
import React, { Component } from 'react';
import { PageList, Input, Button, Select } from 'mtui/index';
import { fieldAnomaly } from 'Utils/formatter';
import { LoadingBox } from 'mtui/index';
import { Services } from 'Constants/common';
import { detailPageAPI } from 'Services/detail';

const { DETAIL_YU_QING_COMPANYID, DETAIL_YU_QING_COMPANYID_RELATE } = Services;

const classArr = ['detail-list-item-title-text', 'detail-time-pubdate', 'detail-time-source']; // 点击弹窗内容防止事件触发
const parentClassArr = ['detail-detail', 'show-modal', 'detail-title']; // 点击弹窗内容防止事件触发
let Immutable = require('immutable');
export default class DetailDisplay extends Component {
    constructor(props) {
        super(props);
        this.pagelist = null;
        this.num = null;
        this.detailDisplay = null;
        this.state = {
            requestDone: null, // 加载完成
            sortBy: '1', // 1:按发布时间（pubdate）降序 2:按发布时间（pubdate）升序 3:按情感分数（financial_senti）降序 4:按情感分数（financial_senti）升序）
            listData: [], // 数据载体
            showModal: false, // 详细窗口是或否显示
            left: 0, // 窗口left
            top: 0, // 窗口top
            sortType: ['发布时间降序', '发布时间升序', '情感分数降序', '情感分数升序'],
            isByPeople: false,
            selectedItem: {}, // 选中的item
            detailDisplayWords: '',
            type: 1,
            currentPage: 1, // 当前分页
            total: 0, // 总量
            pageSize: 3 // 每页数量
        };
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        let { initDetailDisplayData } = this.props;
        this.setState({
            listData: initDetailDisplayData.items,
            requestDone: true,
            total: initDetailDisplayData.totalCount
        });
        document.addEventListener('click', this.handleClick);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClick);
    }

    /**
     * 处理点击其它地方 关闭弹窗
     * @param e
     */
    handleClick(e) {
        let obj = e.target;
        if (obj.className) {
            if (classArr.indexOf(obj.className) !== -1 || obj.id === 'detailDisplayModal' || parentClassArr.indexOf(obj.parentElement.className) !== -1) {
                return;
            }
        }
        this.setState({
            showModal: false
        });
    }

    componentWillReceiveProps(nextProps) {
        let isNewKeyWord = Immutable.is(nextProps.detailDisplayWords, this.props.detailDisplayWords);
        if (!isNewKeyWord) {
            this.setState({
                sortBy: 1,
                currentPage: 1,
                isByPeople: true,
                detailDisplayWords: nextProps.detailDisplayWords,
                type: nextProps.type
            }, () => {
                this.getDataByPeople();
            });
        }
    }

    /**
     * 根据公司id或者人物获取舆情数据列表
     */
    getDataByPeople(refresh) {
        let { sortType, currentPage, pageSize, sortBy, detailDisplayWords, type } = this.state;
        detailPageAPI({
            type: DETAIL_YU_QING_COMPANYID_RELATE,
            data: {
                companyId: this.props.params.companyId,
                page: currentPage,
                pageSize: pageSize,
                sort: sortType[sortBy - 1],
                qc: detailDisplayWords,
                type // 1：相关公司，2：相关人物
            }
        }).then(({ data }) => {
            let content = data === null ? { items: [], totalCount: 0 } : data;
            let { items, totalCount } = content;
            if (refresh) {
                this.pagelist.refresh();
            }
            this.setState({
                listData: items,
                requestDone: true,
                total: totalCount
            });
        });
    }

    /**
     * 获取所有舆情数据列表
     */
    getData(refresh, newKeyWord) {
        let { sortType, currentPage, pageSize, sortBy } = this.state;
        detailPageAPI({
            type: DETAIL_YU_QING_COMPANYID,
            data: {
                companyId: this.props.params.companyId,
                page: currentPage,
                pageSize: pageSize,
                sort: sortType[sortBy - 1]
            }
        }).then(({ data }) => {
            let content = data === null ? { items: [], totalCount: 0 } : data;
            let { items, totalCount } = content;
            if (refresh) {
                this.pagelist.refresh();
            }
            this.setState({
                listData: items,
                requestDone: true,
                total: totalCount
            });
        });
    }

    /**
     * 类型选择
     * @param e
     * @param data
     */
    sortByChange(e, data) {
        let isByPeople = this.state.isByPeople;
        this.setState({
            currentPage: 1,
            sortBy: data.value
        }, () => {
            if (isByPeople) {
                this.getDataByPeople('refresh');
            } else {
                this.getData('refresh');
            }
        });
    }

    /**
     * 展示详细信息
     * @param item
     * @param isLast
     * @param e
     */
    showDetail(item, isLast, e) {
        let _this = this;
        let target = e.target;
        this.setState({
            selectedItem: item,
            showModal: true
        }, function () {
            let modalHeight = document.getElementById('detailDisplayModal').offsetHeight;
            this.scrollNews.scrollTop = 0;
            _this.setState({
                left: target.offsetLeft,
                top: isLast ? target.offsetTop - modalHeight : target.offsetTop + target.offsetHeight + modalHeight > this.detailDisplay.clientHeight ? target.offsetTop - modalHeight / 3 : target.offsetTop + target.offsetHeight
            });
        });
    }

    /**
     * 关闭详情
     */
    closeDetail() {
        this.setState({
            showModal: false
        });
    }

    /**
     * 分页回调
     * @param  {[type]} page [当前页码]
     * @return {[type]}            [description]
     */
    pageCallback(page) {
        let isByPeople = this.state.isByPeople;
        this.setState({
            currentPage: page.current
        }, () => {
            if (isByPeople) {
                this.getDataByPeople();
            } else {
                this.getData();
            }
        });
    }

    /**
     * 指定跳转
     */
    toPage(e) {
        this.pagelist.toPage(this.num.getValue());
    }

    render() {
        let { listData, sortBy, showModal, left, top, selectedItem, requestDone } = this.state;
        return (
            <div className="detail-display" ref={c => this.detailDisplay = c}>
                <div className="detail-display-head">
                    <Select
                        value={sortBy}
                        style={{
                            width: 210,
                            height: 40,
                            color: '#000033',
                            fontSize: 17,
                            border: '1px solid rgb(0,0,52)',
                            borderRadius: 100,
                            lineHeight: '40px'
                        }}
                        onChange={this.sortByChange.bind(this)}
                        modalStyle={{ color: '#ccc', borderRadius: '4px' }}
                        defaultValue={1}
                        trigger="click"
                    >
                        <Option value={1}>按时间降序排列</Option>
                        <Option value={2}>按时间升序排列</Option>
                        <Option value={3}>按情感由正到负排列</Option>
                        <Option value={4}>按情感由负到正排列</Option>
                    </Select>
                </div>
                <div className="detail-display-content">
                    <ul className="detail-list">
                        {
                            requestDone ?
                                listData.length > 0 ?
                                    listData.map(function (item, index) {
                                        let financialSenti = item.financialSenti;
                                        let colorInfo = '';
                                        if (financialSenti >= 10 && financialSenti <= 100) {// 正面
                                            colorInfo = '#77d4a5';
                                        } else if (financialSenti >= -100 && financialSenti < -10) { // 大于等于-100,小于-10是负面负面
                                            colorInfo = '#f67d7d';
                                        } else {
                                            colorInfo = '#14adff';
                                        }
                                        return (
                                            <li key={index} className="detail-list-item">
                                                <p className="detail-list-item-title">
                                                    <em className="iconfont icon-globe" style={{ color: colorInfo }}></em>
                                                    <span className="detail-list-item-title-text"
                                                          onClick={this.showDetail.bind(this, item, index + 1 === listData.length && listData.length > 1)}>
                                                        {item.newsTitle}
                                                    </span>
                                                </p>
                                                <p className="detail-list-item-time">
                                                    <span>{fieldAnomaly(item.pubdate)}</span>
                                                    <span className="right">信息来源 : {fieldAnomaly(item.newsSite)}</span>
                                                </p>
                                                <p className="detail-list-item-detail">{fieldAnomaly(item.abstract_)}</p>
                                            </li>
                                        );
                                    }.bind(this)) :
                                    <p className="textC v-center" style={{ width: '100%', height: '400px' }}>
                                        <span>暂无相关数据。</span></p>
                                : <LoadingBox type="loading2"/>
                        }
                    </ul>
                </div>

                {/* 展示modal*/}
                <div id="detailDisplayModal" className="show-modal"
                     style={{ display: showModal ? 'block' : 'none', left: left, top: top, zIndex: 999 }}>
                    <p className="detail-title"><span>{fieldAnomaly(selectedItem.newsTitle)}</span></p>
                    <p className="detail-time">
                        <span className="detail-time-pubdate">{fieldAnomaly(selectedItem.pubdate)}</span>
                        <span className="detail-time-source"
                              style={{ float: 'right' }}>信息来源 : {fieldAnomaly(selectedItem.newsSite)}</span>
                    </p>
                    <div className="detail-detail" ref={scrollNews => this.scrollNews = scrollNews}
                         dangerouslySetInnerHTML={{ __html: selectedItem.main }}></div>
                    <div className="close-btn"><span className="close-text"
                                                     onClick={this.closeDetail.bind(this)}>关  闭</span></div>
                </div>

                {/* 分页*/}
                <div className="page-box" style={{ display: listData.length > 0 ? 'block' : 'none' }}>
                    <PageList ref={pagelist => this.pagelist = pagelist}
                              current={this.state.currentPage}
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