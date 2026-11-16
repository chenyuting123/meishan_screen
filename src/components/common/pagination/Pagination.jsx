import './pagination.scss';
import React, { Component } from 'react';
import { Pagination } from 'antd';

export default class Paginations extends Component {

    constructor(props) {
        super(props);
    }

    onChange(pageNumber, event){
        let firstPage = document.getElementsByClassName('ant-pagination-item-1')[0];
        if(pageNumber > 3){
            firstPage.style.display = 'none';
        }else {
            firstPage.style.display = 'block';
        }
        this.props.pageCallback(pageNumber);
    }

    render(){
        return (
            <Pagination 
                showQuickJumper
                current={this.props.current} 
                defaultCurrent={1} 
                pageSize={this.props.pageSize} 
                total={this.props.total} 
                onChange={(pageNumber)=>this.onChange(pageNumber)} />
        );
    }
}