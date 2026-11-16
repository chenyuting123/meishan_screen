/*
* author:TanJun
* describe:SeekItem
* createTime:2018/7/14
* */
import './index.scss';
import React, { Component } from 'react';
import { Select, Input, Pagination, Button, message, Icon } from 'antd';
import { NoData } from 'CommonComponents';
import { Services } from 'Constants/common';
import { searchAPI, companyCountyAPI } from 'Services/analysis';
import { getProvinces } from 'Services/home';

const { Option } = Select;
const { Group, Search } = Input;
const { SEARCH_RELATION, SEARCH_COMPANY_COUNTY } = Services;

class SeekItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentType: 'Company',
            currentP: '',
            listP: [],
            currentC: '',
            listC: [],
            currentA: '',
            listA: [],
            selectSeek: [],
            pageNum: 1,
            pageSize: 5,
            totalCount: 10,
            searchValue: '',
            list: []
        };
    }

    componentDidMount() {
        getProvinces().then(({ data }) => {
            this.setState({
                listP: data.map((item) => {
                    return { key: item, name: item };
                })
            });
        });
    }

    render() {
        let { selectSeek, currentType, pageNum, pageSize, totalCount, list } = this.state;
        let { type, hc, getAtlasData, companyId } = this.props, isResult = list.length > 0;
        return <div className="c-seek">
            <h3>探寻搜索</h3>
            <Group compact size="large" className="c-seek__input">
                {this._getTypeComp()}
                <Search ref={(ref) => this._search = ref}
                        placeholder="添加探寻目标主体关键字或全称"
                        onSearch={(e) => {
                            this.state = { ...this.state, searchValue: e, pageNum: 1 };
                            this._getList();
                        }}
                        style={{ width: 300, height: 44, fontSize: 14 }}
                />
            </Group>
            <div className="c-seek__area">
                {this._getAreaComp()}
            </div>
            <ul className="c-seek__pagination">
                {isResult > 0 ? list.map((item, index) => {
                    let { companyNameNa, bbdQyxxId } = item;
                    let isActive = selectSeek.filter((item) => item.bbdQyxxId === bbdQyxxId).length > 0;
                    return <li key={index}>
                        <div>{companyNameNa}</div>
                        <Button disabled={isActive}
                                onClick={() => {
                                    if (!isActive) {
                                        if (selectSeek.length >= 4) {
                                            message.warning('最多探寻4个');
                                        } else {
                                            let selects = selectSeek;
                                            selects.push({ bbdQyxxId, companyNameNa, currentType });
                                            this.setState({ selectSeek: selects });
                                        }
                                    }
                                }}>+加入探寻</Button>
                    </li>;
                }) : <NoData isNoData={true} fontColor="#000000"/>}
            </ul>
            {isResult ? <div className="c-seek__p-list">
                <Pagination
                    current={pageNum}
                    defaultCurrent={1}
                    pageSize={pageSize}
                    onChange={(e) => this._pageChange(e)}
                    total={totalCount}/>
            </div> : null}
            <h3>探寻主体</h3>
            <ul className="c-seek__result">
                {selectSeek.length > 0 ? selectSeek.map((item, index) => {
                    let { companyNameNa, bbdQyxxId } = item;
                    return <li key={index}>
                        <div>{companyNameNa}</div>
                        <Icon type="close" onClick={() => {
                            this.setState({ selectSeek: selectSeek.filter((item) => item.bbdQyxxId !== bbdQyxxId) });
                        }}/>
                    </li>;
                }) : <NoData isNoData={true} fontColor="#000000"/>}
            </ul>
            {/* <h3>开始探寻</h3>*/}
            <Button className="c-seek__btn" onClick={() => {
                getAtlasData && getAtlasData({
                    type,
                    seekData: {
                        nodeIds: selectSeek.map((v) => v.bbdQyxxId),
                        nodeTypes: selectSeek.map((v) => v.currentType),
                        seekType: 'INVEST_MANAGE',
                        companyId
                    }
                });
            }}>开始探寻</Button>
        </div>;
    }

    _getAreaComp = () => {
        let { currentP, currentC, currentA, listP, listC, listA } = this.state;
        let comps = [
            {
                item: listP,
                defaultValue: '全国',
                current: currentP,
                onChange: (e) => {
                    this._getCompanyCounty({ type: 'province', value: e });
                    this.setState({ currentP: e, currentC: '', listC: [], currentA: '', listA: [] });
                }
            },
            {
                item: listC,
                defaultValue: '市',
                current: currentC,
                onChange: (e) => {
                    this._getCompanyCounty({ type: 'city', value: e });
                    this.setState({ currentC: e, currentA: '', listA: [] });
                }
            },
            {
                item: listA,
                defaultValue: '区县',
                current: currentA,
                onChange: (e) => {
                    this.setState({ currentA: e });
                }
            }
        ];

        return comps.map((ite) => this._getSelectComp(ite));
    };

    _getCompanyCounty({ type, value }) {
        companyCountyAPI({
            type: SEARCH_COMPANY_COUNTY,
            data: {
                type, value
            }
        }).then(({ data }) => {
            let list = data.map(({ district, city }) => {
                return { key: district || city, name: district || city };
            });
            let info = { listA: list };
            if (type === 'province') {
                info = { listC: list };
            }
            this.setState(info);
        });
    }

    _getTypeComp() {
        let typeItem = [
                { key: 'Company', name: '企业名' },
                { key: 'Person', name: '自然人' }
            ],
            { currentType } = this.state;
        return this._getSelectComp({
            item: typeItem, current: currentType, onChange: (e) => {
                this.setState({ currentType: e });
            }
        });
    }

    _getSelectComp({ item, current, onChange, defaultValue }) {
        return <Select defaultValue={current || defaultValue} style={{ width: 120 }}
                       key={defaultValue + new Date().getTime()}
                       onChange={e => onChange && onChange(e)}>
            {item.map(({ key, name }, index) => <Option value={key} key={key + new Date().getTime()}>{name}</Option>)}
        </Select>;
    }

    _getList() {
        let { currentType, currentP, currentC, currentA, pageNum, pageSize, searchValue } = this.state;
        searchAPI({
            type: SEARCH_RELATION, data: {
                pageNum,
                pageSize,
                query: searchValue,
                type: currentType,
                province: currentP,
                district: currentA,
                city: currentC
            }
        }).then(({ data }) => {
            let { totalCount } = data;
            this.setState({ list: data.data, totalCount });
        });
    }

    _pageChange(pageNum) {
        this.state = { ...this.state, pageNum };
        this._getList();
    }

}

export default SeekItem;