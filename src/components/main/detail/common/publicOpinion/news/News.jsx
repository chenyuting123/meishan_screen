/**
 * Created by ashima on 2017/4/19.
 * Remark 舆情
 */
import './news.scss';
import React, { Component } from 'react';
import { PageList, Input, Button } from 'mtui/index';
import { fieldAnomaly } from 'Utils/formatter';
import { Services } from 'Constants/common';
import { newsManageDataAPI } from 'Services/detail';
const { DETAIL_MANAGE_YUQING } = Services;
export default class News extends Component {
    constructor(props) {
        super(props);
        this.news = null;
        this.state = {
            companyName: this.props.params.companyName || '',
            companyId: this.props.params.companyId || '',
            listLoading: '数据载入中...', // 列表加载
            total: 0, // 总量
            start: 1,
            size: 5,
            listData: []
        };
    }

    componentDidMount() {
        this.newsList();
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.pubdateDesc !== this.props.pubdateDesc){
            this.setState({ start: 1 }, () =>{
                this.newsList(true);
            });
        }
    }
    /**
     * 舆情列表
     * @return {[type]} [description]
     */
    newsList(refresh) {
        let { companyId, start, size } = this.state;
        newsManageDataAPI({
            type: DETAIL_MANAGE_YUQING,
            data: {
                bbdQyxxId: companyId,
                pubdateDesc: this.props.pubdateDesc,
                page: start - 1, // 接口分页从0开始
                pageSize: size
            }
        }).then(({ data }) => {
            this.news && this.setState({
                listLoading: '暂无相关数据！',
                listData: []
            }, () => {
                if (data !== null) {
                    let { content, totalElements } = data;
                    // this.news && this.props.getNum('newsNum', totalCount);
                    this.news && this.setState({
                        listData: content.length ? content : [],
                        total: totalElements
                    });
                    if(refresh){
                        this.pagelist.refresh();
                    }
                }
            });
        });
    }

    /**
     * 分页回调
     * @param  {[type]} pageNumber [当前页码]
     * @return {[type]}            [description]
     */
    pageCallback(page) {
        this.setState({
            start: page.current
        }, function () {
            this.newsList();
        });
    }

    toPage(e) {
        this.pagelist.toPage(this.num.getValue());
    }
    
    render() {
        const { listData, pubdateDesc } = this.state;

        return (
            <div className="news" ref={c => this.news = c}>
                
                {
                    !(listData.length > 0) ? (
                            <div className="list-items textC no-data">{this.state.listLoading}</div>) :
                        listData.map(function (item, index) {
                            {
                                let url = '';
                                let textInfo = '';
                                if (item.bbdUrl === null) {
                                    url = <a className="name" href="javascript:void(null)">{item.newsTitle}</a>;
                                } else {
                                    url = <a className="name" target="_blank" href={item.bbdUrl}>{item.newsTitle}</a>;
                                }
                                if (item.summary) {
                                    textInfo = <p title={item.summary}>{fieldAnomaly(item.summary)}</p>;
                                } else {
                                    textInfo = <p title={item.main}>{fieldAnomaly(item.main)}</p>;
                                }
                                return (
                                    <div className="list-items" key={index}>
                                        {url}
                                        <span className="soure">{item.pubdate} {item.newsSite}</span>
                                        {textInfo}
                                    </div>
                                );
                            }
                        })
                }
                <div className="page-box" style={{ display: listData.length > 0 ? 'block' : 'none' }}>
                    <PageList ref={pagelist => this.pagelist = pagelist}
                              current={this.state.start}
                              pageSize={this.state.size}
                              callback={this.pageCallback.bind(this)}
                              total={this.state.total}/>
                    &nbsp;<Input style={{ width: 50 }} defaultValue="" ref={num => this.num = num} size="xm" type="text"/>
                    &nbsp;<Button size="sm" onClick={this.toPage.bind(this)}>跳转</Button>
                </div>
            </div>
        );
    }
}