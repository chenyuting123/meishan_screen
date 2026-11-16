/*
* author:TanJun
* describe:SearchInput
* createTime:2018/6/20
* */
import './searchInput.scss';
import React, { Component } from 'react';
import { Button, Select, Input, message } from 'antd';
import { browserHistory } from 'react-router';
import { ANALYSIS_SEARCH } from 'RouterPath';

const InputGroup = Input.Group;
const Option = Select.Option;

class SearchInput extends Component {

    constructor(props) {
        super(props);
        this._searchData = {};
        this.state = {
            name: 'SearchInput',
            selectItem: [
                { key: '1', info: '综合', placeholder: '请输入企业名、法定代表人/股东、董监高、注册地址进行搜索' },
                { key: '2', info: '企业名', placeholder: '请输入企业名进行搜索' },
                { key: '3', info: '平台名', placeholder: '请输入平台名进行搜索' },
                { key: '4', info: '法人或股东', placeholder: '请输入法定代表人/股东进行搜索' },
                { key: '5', info: '董监高', placeholder: '请输入董监高进行搜索' }
            ],
            btnName: '查询',
            placeholder: '请输入企业名、平台名、法人代表、董监高等关键字',
            defaultValue: '1'
        };
    }

    componentDidMount() {
        let { companyName } = this.props;
        companyName && this.searchData({ value: companyName });
    }

    render() {
        let { placeholder, defaultValue, btnName, selectItem } = this.state;
        return <InputGroup compact size="large" className="c-search-input">
            <Select defaultValue={defaultValue} onChange={(e) => {
                let { info, placeholder } = selectItem.filter(item => e === item.key)[0];
                this.setState({ defaultValue: e, placeholder });
                this.searchData({ type: info });
            }}>
                {this._getOption()}
            </Select>
            <Input style={{ width: '700px' }} placeholder={placeholder} defaultValue={this.props.companyName || ''} onChange={(e) => {
                this.searchData({ value: e.target.value });
            }} onPressEnter={(e) => {
                e.stopPropagation();
                e.preventDefault();
                this._findInfo();
            }
            } />
            <Button size="large" onClick={() => {
                this._findInfo();
            }}>{btnName}</Button>
        </InputGroup>;
    }

    _getOption() {
        let { selectItem } = this.state;
        return selectItem.map(({ key, info }) => <Option value={String(key)} key={key}>{info}</Option>);
    }

    searchData(data) {
        this._searchData = { ...this._searchData, ...data };
    }

    _findInfo = () => {
        let { type = '综合', value = '' } = this._searchData,
            path = `${ANALYSIS_SEARCH}/${type}/${value}`;
        if (value) {
            if (this.props.getList) {
                this.props.getList({ key: value, type });
            } else {
                browserHistory.push(path);
            }
        } else {
            let { placeholder } = this.state;
            message.warn(placeholder);
        }

    };

}

export default SearchInput;