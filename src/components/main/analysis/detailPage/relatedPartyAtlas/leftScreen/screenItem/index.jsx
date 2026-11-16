/*
* author:TanJun
* describe:ScreenItem
* createTime:2018/7/10
* */
import './index.scss';
import React, { Component } from 'react';
import { Input, Select, Dropdown, Menu } from 'antd';
import appData from 'Utils/appData';
import { appDataType } from 'Constants/higgscharts';

const Option = Select.Option;
const { Search } = Input;
const { NODE } = appDataType;

class ScreenItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: 'ScreenItem',
            currentDegrees: 2,
            nodeInfo: { total: 100, company: 50, person: 50, nodes: [] },
            degreesItem: [
                { key: 1, name: '一度' },
                { key: 2, name: '二度' },
                { key: 3, name: '三度' }
            ],
            currentRelated: 0,
            searchValue: '',
            relatedScreen: [
                { key: 1, name: '黑名单企业', type: 'black' },
                { key: 2, name: '高危预警企业', type: 'risk' },
                { key: 3, name: '新金融企业', type: 'industry' },
                { key: 4, name: '与黑名单地址相同', type: 'blackAddrEqual' },
                { key: 5, name: '包含非法集资裁判文书', type: 'totalFfjz' },
                { key: 6, name: '包含民间借贷诉讼文书', type: 'totalPrivateLendingNum' },
                { key: 7, name: '失信被执行人', type: 'totalDishonestyNum' },
                { key: 8, name: '存在行政处罚', type: 'totalXzcfNum' },
                { key: 9, name: '经营异常企业', type: 'totalQyycNum' },
                // {key: 10, name: '自然人关联企业数大于10', type: 'warning'},
                { key: 11, name: '利益一致行动法人', type: 'commonInterests' },
                { key: 12, name: '地址相同企业', type: 'addrEqual' },
                { key: 13, name: '注吊销企业', type: 'revoke' }
            ]
        };
    }

    componentWillReceiveProps(nextProps) {
        let { nodeInfo, currentRelated } = this.state;
        if (nextProps.isUpdate) {
            let info = appData.getNodeInfo({ type: NODE });
            if (nodeInfo.total !== info.total) {
                this.setState({ nodeInfo: info, currentRelated: 0 });
            }
        }
    }

    render() {
        let { degreesItem, relatedScreen, currentDegrees, currentRelated, nodeInfo } = this.state;
        let { total, company, person, nodes } = nodeInfo;
        let { type, hc, getAtlasData, companyId } = this.props;
        return <div className="c-screen">
            <p className="c-screen__count">
                <span>节点总数：<span>{total}</span></span>
                <span>法人：<span>{company}</span></span>
                <span>自然人：<span>{person}</span></span>
            </p>
            <p className="c-screen__degrees">
                {degreesItem.map(({ name, key }, index) =>
                    <span onClick={() => {
                        this.setState({ currentDegrees: key });
                        let degree = key;
                        getAtlasData({
                            type,
                            callback: (data) => {
                                data = { sourceData: data, id: companyId, date: '', degree };
                                hc.trigger(`${type}.reRender`, data);
                            },
                            degree
                        });
                    }}
                          className={`u-blue-hover ${key === currentDegrees ? 'active' : ''}`}
                          key={index}>{name}</span>)}
            </p>
            <Dropdown overlay={this._getSearchItem(nodes)} trigger={['click']}>
                <Search ref={(ref) => this._search = ref}
                        placeholder="快速定位查找当前关联方/数据关键词"
                        onSearch={() => {
                            this._selectNode.shapeType = 'node';
                            // 节点选择
                            hc.trigger(`${type}.highlight`, this._selectNode);
                        }}
                        onChange={() => {
                            this.setState({ searchValue: this._search.input.refs.input.value });
                        }}
                        style={{ width: 426, height: 44, fontSize: 14 }}
                />
            </Dropdown>
            <h3>关联方筛选</h3>
            <ul className="c-screen__related">
                {relatedScreen.map(({ name, key, type }, index) =>
                    <li onClick={() => {
                        this.setState({ currentRelated: key }, () => {
                            this._filterData(type);
                        });
                    }}
                        className={`u-blue-hover ${key === currentRelated ? 'active' : ''}`}
                        key={index}><span>{name}</span>
                    </li>)}
            </ul>
        </div>;
    }

    _filterData = (filterType) => {
        let { type, hc } = this.props;
        // 筛选条件
        hc.trigger(`${type}.filter`, filterType);
    };

    _clickNode = (e) => {
        let { nodes } = this.state.nodeInfo;
        let selectNode = nodes.filter((item, index) => item.id === e.key);
        this._search.input.refs.input.value = selectNode[0].text;
        this._selectNode = selectNode[0];
        this.setState({ searchValue: selectNode[0].text });
    };

    _getSearchItem = (nodes) => {
        // 模糊查询
        let { searchValue } = this.state;
        return <Menu onClick={this._clickNode}>
            {nodes.filter((item) => item.text.indexOf(searchValue) !== -1).map(({ id, text }, index) => <Menu.Item
                key={id}>
                <a>{text}</a>
            </Menu.Item>)}
        </Menu>;
    };

}

export default ScreenItem;