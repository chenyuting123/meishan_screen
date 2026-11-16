/**
 * Created by ashima on 2017/4/17.
 * Remark 搜索列表
 */
import './search.scss';
import 'mtui/style.css';
import React, { Component } from 'react';
import { switchIndustry, switchIndustryYW, fieldAnomaly } from 'Utils/formatter';
import { DEFAULT_DETAIL, BLACK } from 'RouterPath';
import SearchCondition from './searchCondition';
import SearchResultList from './searchResultList/SearchResultList';
import SearchInput from '../searchInput/SearchInput';
import { CommonPagination } from 'CommonComponents';
import { Services } from 'Constants/common';
import { searchAPI } from 'Services/analysis';

const { SEARCH_COMPANY } = Services;

export default class Search extends Component {
    constructor(props) {
        super(props);
        let { companyName, type } = props.params;
        this.state = {
            page: 1, // 页码
            pageSize: 5, // 页量
            total: 0, // 总页数
            key: companyName,
            type: type,
            listData: [], // 所有数据
            listLoading: '数据载入中...' // 列表加载
        };
    }

    componentDidMount() {
        this.getList();
    }

    render() {
        let { listData, page, pageSize, total, key } = this.state;
        return (
            <div className="search">
                <div className="c-search-item">
                    <SearchInput getList={this.getList} companyName={key} />
                </div>
                <SearchCondition getList={this.getList} />
                <SearchResultList {...this.state} />
                <div className="page-box" style={{ display: listData.length > 0 ? 'block' : 'none' }}>
                    <CommonPagination total={total} key={page} totalPage={Math.ceil(total / pageSize)}
                        page={page}
                        pageSize={pageSize} onChange={(e) => this.onChange(e)} />
                </div>
            </div>
        );
    }

    /**
     * 
     * 搜索列表
     * @param  {[type]} refresh [description]
     * @return {[type]}         [description]
     */
    getList = (info) => {
        let state = {
            pageSize: (info && info.industry && info.industry !== '') ? 100 : 5
        };
        this.state = { ...this.state, ...state };
        let { regcapLevel, yearLevel, statusLevel, province, key, type, page, pageSize, industry } = info ? { ...this.state, ...info } : this.state,
            conditon = {
                regcapLevel,
                yearLevel,
                statusLevel,
                province,
                pageSize,
                page: info ? 1 : page,
                key,
                type,
                industry
            };
        searchAPI({
            type: SEARCH_COMPANY,
            data: {
                ...conditon
            }
        }).then(({ data }) => {
            let { items, totalCount } = data;
            this.setState({
                listLoading: '暂无相关数据！',
                ...conditon
            }, () => {
                if (data !== null) {
                    let responseSoureData = items === null ? [] : items;
                    this.setState({
                        listData: responseSoureData,
                        total: pageSize === 5 ? (totalCount >= 100 ? 100 : totalCount) : items.length
                    });
                }
            });
        });
    };

    /**
     * 分页回调
     * @param  {[type]} pageNumber [当前页码]
     * @return {[type]}            [description]
     */
    onChange = (page) => {
        this.setState({
            page: page
        }, () => {
            this.getList();
        });
    };

    toPage = (e) => {
        this.pagelist.toPage(this.num.getValue());
    };
}