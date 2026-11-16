/**
 * Created by ashima on 2017/4/19.
 * Remark 工商变更
 */
import './industrialChange.scss';
import React, { Component } from 'react';
import { PageList, Input, Button } from 'mtui/index';
import { fieldAnomaly } from 'Utils/formatter';
import { Services } from 'Constants/common';
import { detailManageDataAPI } from 'Services/detail';

const { DETAIL_MANAGE_BGXX } = Services;

export default class IndustrialChange extends Component {
    constructor(props) {
        super(props);
        this.industrialChange = null;
        this.state = {
            companyName: this.props.params.companyName || '',
            companyId: this.props.params.companyId || '',
            listLoading: '数据载入中...', // 列表加载
            start: 1,
            size: 10,
            total: 0, // 总量
            listData: []
        };
    }

    componentDidMount() {
        this.industrialList();
    }

    /**
     * 工商变更列表
     * @return {[type]} [description]
     */
    industrialList() {
        let { companyId, start, size } = this.state;
        detailManageDataAPI({
            type: DETAIL_MANAGE_BGXX,
            data: {
                companyId: companyId,
                page: start,
                pageSize: size
            }
        }).then(({ data }) => {
            let content = data;
            this.industrialChange && this.setState({
                listLoading: '暂无相关数据！',
                listData: []
            }, () => {
                if (content !== null) {
                    let { items, totalCount } = content;
                    this.industrialChange && this.props.getNum('industrialNum', totalCount);
                    this.industrialChange && this.setState({
                        listData: items === null ? [] : items,
                        total: totalCount,
                        pageShow: 'block'
                    });
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
            this.industrialList();
        });
    }

    toPage(e) {
        this.pagelist.toPage(this.num.getValue());
    }

    render() {
        let { changes, start, size } = this.state;
        return (
            <div className="industrial-change" ref={c => this.industrialChange = c}>
                <div className="tab-item">
                    <table className="table-theme">
                        <thead>
                        <tr>
                            <td width="10%" className="textC">序号</td>
                            <td width="10%">变更日期</td>
                            <td width="20%" className="pl50">变更事项</td>
                            <td width="30%" className="textC">变更前</td>
                            <td width="30%" className="textC">变更后</td>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            !(this.state.listData.length > 0) ? (<tr>
                                    <td colSpan="5" className="textC">{this.state.listLoading}</td>
                                </tr>) :
                                this.state.listData.map(function (item, index) {
                                    {
                                        return (
                                            <tr key={index}>
                                                <td className="textC">{(index + 1) + ((start - 1) * size)}</td>
                                                <td>{fieldAnomaly(item.changeDate)}</td>
                                                <td className="pl50">{fieldAnomaly(item.changeItems)}</td>
                                                <td className="textC">
                                                    <div className="industrial-detail"
                                                         dangerouslySetInnerHTML={{ __html: fieldAnomaly(item.contentBeforeChange) }}></div>
                                                </td>
                                                <td className="textC">
                                                    <div className="industrial-detail"
                                                         style={{ display: 'block', paddingLeft: 20, paddingRight: 20 }}
                                                         dangerouslySetInnerHTML={{ __html: fieldAnomaly(item.contentAfterChange) }}></div>
                                                </td>
                                            </tr>
                                        );
                                    }
                                })
                        }
                        </tbody>
                    </table>
                    <div className="page-box" style={{ display: this.state.listData.length > 0 ? 'block' : 'none' }}>
                        <PageList ref={pagelist => this.pagelist = pagelist}
                                  current={this.state.start}
                                  pageSize={this.state.size}
                                  callback={this.pageCallback.bind(this)}
                                  total={this.state.total}/>
                        &nbsp;<Input style={{ width: 50 }} defaultValue="" ref={num => this.num = num} size="xm"
                                     type="text"/>
                        &nbsp;<Button size="sm" onClick={this.toPage.bind(this)}>跳转</Button>
                    </div>
                </div>
            </div>
        );
    }
}