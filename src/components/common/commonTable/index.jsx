/*
 *author: tj
 * date: 25/5/2018
 * describe: Table
 */
import './index.scss';
import React, { Component } from 'react';
import { Button, Input, Pagination, Table } from 'antd';
import NoData from '../NoData/index';
import { companyDetailAPI } from 'Services/detail';

export default class TableCommon extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [{ id: 0 }],
            title: '',
            pageSize: 10,
            page: 1,
            url: '',
            totalPage: 1,
            count: 10,
            showLoading: true,
            type: '',
            tableColumns: [],
            defaultTableColumns: [{
                title: '序号',
                dataIndex: '',
                key: 'id',
                width: '5%',
                render: (text, record, index) => {
                    let { page, pageSize } = this.state;
                    return <span>{(page - 1) * pageSize + index + 1}</span>;
                }
            }]
        };
    }

    render() {
        const { list, count, page, pageSize, defaultTableColumns, tableColumns, showLoading, totalPage } = this.state;
        return (
            <div className="c-common-table">
            {
                showLoading ? '' : count > 0 ?
                <div>
                    <Table columns={tableColumns ? [...defaultTableColumns, ...tableColumns] : defaultTableColumns}
                        dataSource={list}
                        pagination={false}
                        rowKey="id"
                        loading={showLoading}
                    />
                    <footer className="c-common-table__footer">
                        <Button onClick={() => {
                            this.onChange(1);
                        }}>首页</Button>
                        <Pagination total={count}
                                    key={page}
                                    defaultCurrent={page}
                                    defaultPageSize={pageSize}
                                    onChange={(e) => this.onChange(e)}>
                        </Pagination>
                        <Button onClick={() => {
                            this.onChange(Math.ceil(count / pageSize));
                        }}>尾页</Button>
                        <div className="total-page">
                            <span>共{totalPage}页</span>
                            第&nbsp;&nbsp;&nbsp;
                            <Input style={{ width: '40px' }} ref={num => this._num = num}
                                defaultValue={page}/>
                            &nbsp;&nbsp;&nbsp;页
                        </div>
                        <Button onClick={() => {
                            let value = parseInt(this._num.refs.input.value, 10);
                            this.onChange(value);
                        }}>跳转</Button>
                    </footer>
                </div> : <NoData isNoData = {true} fontColor = "#333"/>
                }
            </div>
        );
    }

    // 分页点击
    onChange(page) {
        this.state = { ...this.state, page: page };
        this.getList();
    }

    // 改变每页显示的个数
    changePage(current, size) {
        this.state = { ...this.state, page: current, pageSize: size };
        this.getList();
    }

    upDateURL({ url, tableColumns, type, listData, province, industry, ym, city, area }) {
        this.setState({ url, tableColumns, type, listData, province, industry, ym, city, area }, () => this.getList());
    }

    getList() {
        let { page, pageSize, url, type, listData, province, industry, ym, city, area } = this.state;
        if (listData) {
            let total = listData.length;
            this.setState({
                list: listData.filter((item, index) => index >= (page - 1) * pageSize && index < page * pageSize).map(({ data }) => data),
                totalPage: Math.ceil(total / pageSize),
                showLoading: false,
                count: total
            });
        } else {
            companyDetailAPI({
                type: url,
                data: { pageSize, page, type, province, industry, ym, city, area }
            }).then(({ data }) => {
                let { items, totalPage, totalCount } = data;
                this.setState({ list: items, totalPage, showLoading: false, count: totalCount });
            });
        }

    }
}
