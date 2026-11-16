/**
 * Created by ashima on 2017/4/19.
 * Remark 域名备案
 */
import './record.scss';
import React, { Component } from 'react';
import { PageList, Input, Button } from 'mtui/index';
import { fieldAnomaly } from 'Utils/formatter';
import { Services } from 'Constants/common';
import { detailManageDataAPI } from 'Services/detail';

const { DETAIL_MANAGE_DOMAIN_NAME } = Services;
export default class Record extends Component {
    constructor(props) {
        super(props);
        this.recordRef = null;
        this.state = {
            companyName: this.props.params.companyName || '',
            companyId: this.props.params.companyId || '',
            listLoading: '数据载入中...', // 列表加载
            total: 0, // 总量
            start: 1,
            size: 10,
            listData: []
        };
    }

    componentDidMount() {
        this.record();
    }

    /**
     * 域名备案
     * @return {[type]} [description]
     */
    record() {
        let { companyId, start, size } = this.state;
        detailManageDataAPI({
            type: DETAIL_MANAGE_DOMAIN_NAME,
            data: {
                companyId: companyId,
                page: start,
                pageSize: size
            }
        }).then(({ data }) => {
            let content = data;
            this.recordRef && this.setState({
                listLoading: '暂无相关数据！',
                listData: []
            }, () => {
                if (content !== null) {
                    let { items, totalCount } = content;
                    this.recordRef && this.props.getNum('recordNum', totalCount);
                    this.recordRef && this.setState({
                        listData: items === null ? [] : items,
                        total: totalCount
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
        }, () => {
            this.record();
        });
    }

    toPage(e) {
        this.pagelist.toPage(this.num.getValue());
    }

    render() {
        let { listLoading, listData, size, start, total } = this.state;
        return (
            <div className="record" ref={c => this.recordRef = c}>
                <div className="tab-item">
                    <table className="table-theme">
                        <thead>
                        <tr>
                            <td width="10%" className="textC">序号</td>
                            <td width="10%">网站名称</td>
                            <td width="20%">网址</td>
                            <td width="30%" className="textC">网站备案/许可证号</td>
                            <td width="30%" className="textC">登记批准日期</td>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            !(listData.length > 0) ? (<tr>
                                    <td colSpan="5" className="textC">{listLoading}</td>
                                </tr>) :
                                listData.map(function (item, index) {
                                    {
                                        let indexNum = (start - 1) * size + index + 1;
                                        return (
                                            <tr key={index}>
                                                <td className="textC">{indexNum}</td>
                                                <td><span className="text-ellipsis"
                                                          title={fieldAnomaly(item.websiteName)}>{fieldAnomaly(item.websiteName)}</span>
                                                </td>
                                                <td><a href={`//${item.homepageUrl}`} className="text-ellipsis" target="_blank"
                                                       title={fieldAnomaly(item.homepageUrl)}>{fieldAnomaly(item.homepageUrl)}</a>
                                                </td>
                                                <td className="textC">{fieldAnomaly(item.siteCertificateNo)}</td>
                                                <td className="textC">{fieldAnomaly(item.approvalTime)}</td>
                                            </tr>
                                        );
                                    }
                                })
                        }
                        </tbody>
                    </table>
                    <div className="page-box" style={{ display: listData.length > 0 ? 'block' : 'none' }}>
                        <PageList ref={pagelist => this.pagelist = pagelist}
                                  current={start}
                                  pageSize={size}
                                  callback={this.pageCallback.bind(this)}
                                  total={total}/>
                        &nbsp;<Input style={{ width: 50 }} defaultValue="" ref={num => this.num = num} size="xm"
                                     type="text"/>
                        &nbsp;<Button size="sm" onClick={this.toPage.bind(this)}>跳转</Button>
                    </div>
                </div>
            </div>
        );
    }
}