/*
* author:TanJun
* describe:CommonPagination
* createTime:2018/7/6
* */
import './index.scss';
import React, { Component } from 'react';
import { Button, Pagination, Input } from 'antd';

class CommonPagination extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        let { page, pageSize, totalPage, total } = this.props;
        return <footer className="c-common-pagination">
            <Button onClick={() => {
                this.onChange(1);
            }}>首页</Button>
            <Pagination total={total}
                        key={page + new Date().getTime()}
                        defaultCurrent={page}
                        defaultPageSize={pageSize}
                        onChange={(e) => this.onChange(e)}>
            </Pagination>
            <Button onClick={() => {
                this.onChange(Math.ceil(total / pageSize));
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
        </footer>;
    }

    onChange(page) {
        const { pageSize, total } = this.props;
        let max = Math.ceil(total / pageSize);
        if ((page !== '' && page <= max && page > 0 ) && this.props.onChange) {
            this.props.onChange(page);
        }
    }

}

export default CommonPagination;