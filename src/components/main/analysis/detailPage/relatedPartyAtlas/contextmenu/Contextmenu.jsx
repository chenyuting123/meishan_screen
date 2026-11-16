import styles from './contextmenu.scss';
import classnames from 'classnames/bind';
import React, { Component } from 'react';
import _ from 'Utils/lodash';
import { DEFAULT_DETAIL, OTHER } from 'RouterPath';
import { relationAPI } from 'Services/analysis';
import { Services } from 'Constants/common';
import { higgschartsType } from 'Constants/higgscharts';
import higgscharts from 'Libs/higgscharts';
import appData from 'Utils/appData';
import emitter from 'Utils/emitter';
import { switchIndustry, windowOpenByUrl } from 'Utils/formatter';
import { companyDetailAPI } from 'Services/detail';
import { message, Dropdown, Input, Menu } from 'antd';
import { CommonModal } from 'CommonComponents';
import { searchAPI } from 'Services/analysis';

const { Search } = Input;
const { CIRCLE, COMMUNITY, STOCK, SEEK, INDUSTRY, NATURAL } = higgschartsType;
const {
    RELATION_CIRCLE, RELATION_COMMUNITY, RELATION_REGION, SEARCH_RELATION,
    RELATION_SEEK, RELATION_STOCK, COMPANY_DETAIL_CHECK_FOCUS
} = Services;
const cx = classnames.bind(styles);
const r = 64;// 半径

export default class Contextmenu extends Component {

    constructor(props) {
        super(props);
        this.handler = props.handler;
        // this.currentEvent = null;
        this.painter = props.painter;
        this.state = {
            menus: [
                {
                    key: 1,
                    currentName: '详情',
                    isDisable: false
                },
                {
                    key: 2,
                    currentName: '扩展',
                    isDisable: false
                },
                {
                    key: 3,
                    currentName: '监控',
                    isDisable: false
                },
                {
                    key: 4,
                    currentName: '路径',
                    isDisable: false
                },
                {
                    key: 5,
                    currentName: '探寻',
                    isDisable: false
                }
            ],
            show: false,
            center: {
                x: 478,
                y: 202
            },
            type: CIRCLE,
            disableIndex: [],
            searchValue: '',
            list: [],
            currentEvent: null
        };

    }

    componentWillMount() {
        this.setPosition();
    }

    componentDidMount() {
        this.handleReset();
        appData.setAppData({ type: 'zoom', info: { scaleX: 1, scaleY: 1 } });
        this.painter.on('click', () => {
            this.setState({
                show: false
            });
        });
        // 拖拽
        this.painter.on('drag', () => {
            this.setState({
                show: false
            });
        });
        // 放大/缩小
        this.painter.on('zoom', (zoomDetail) => {
            appData.setAppData({ type: 'zoom', info: zoomDetail });
            this.setState({ show: false });

        });

        this.handler.on('c-extension', this._getAtlasData);
    }

    render() {
        const { menus, show, center, disableIndex, searchValue } = this.state;
        return (
            <div style={{ left: center.x - r, top: center.y - r }} className={cx({ contextmenu: true, show: show })}>
                <ul>
                    {
                        menus.map((option, index) => {
                            let i = index;
                            let { key } = option;
                            return (
                                <li key={i} onClick={this.registerClickEvent.bind(this, option, i)} className={cx({
                                    disable: disableIndex.includes(key),
                                    canUse: !disableIndex.includes(key)
                                })} style={{ left: this.setPosition()[i].x, top: this.setPosition()[i].y }}>
                                    <span>{option.currentName}</span></li>
                            );
                        })
                    }
                </ul>
                <CommonModal ref={refs => this._seekModal = refs} wrapClassName="seek-modal">
                    <Dropdown overlay={this._getSearchItem()} trigger={['click']} className={cx({ seekModal: true })}>
                        <Search ref={(ref) => this._search = ref}
                                placeholder="请输入要探寻关联的企业全称"
                                onSearch={(e) => {
                                    searchAPI({
                                        type: SEARCH_RELATION,
                                        data: {
                                            pageNum: 1,
                                            pageSize: 5,
                                            query: e,
                                            type: 'company'
                                        }
                                    }).then(({ data }) => {
                                        this.setState({ list: data.data || [] });
                                    });
                                }}
                                onChange={() => {
                                    // this.setState({searchValue: this._search.input.refs.input.value}, () => {
                                    //     console.log(searchValue);
                                    // });
                                }}
                                style={{ width: 380, height: 44, fontSize: 14 }}
                        />
                    </Dropdown>
                    <p className="c-context-menu__tip">提示：如果是探寻当前图谱关联路径可以直接点击目标节点</p>
                </CommonModal>
            </div>
        );
    }

    setPosition = () => {
        const { menus, center } = this.state;
        let arcLength = 2 * Math.PI * r / menus.length; // 弧长
        let position = [];
        for (let i = 0; i < menus.length; i++) {
            let angle = (i * arcLength * 180) / (Math.PI * r) + 270;
            let x = center.x + r * Math.cos(angle * Math.PI / 180);
            let y = center.y + r * Math.sin(angle * Math.PI / 180);
            position.push({
                x: x - center.x + 42,
                y: y - center.y + 42
            });
        }
        return position;
    };

    handleReset = () => {
        this.handler.on('contextmenu', (e) => {
            e.event.preventDefault();
            let { scaleX } = appData.getAppData({ type: 'zoom' }),
                { shapeType, transform, style } = e.target,
                width = style.width * scaleX / 2;

            let { menus } = this.state;
            if (e.target && shapeType === 'node') {
                let currentEvent = e;
                let { left, top } = $(this.painter.dom).offset();
                let center = {
                    x: transform[4] + left + width,
                    y: transform[5] + top + width
                };
                let type = appData.getAppData({ type: 'higgschartsType' });
                menus[1].currentName = currentEvent.target.expanded ? '扩展' : '收起';
                this.setState({
                    menus,
                    center: center,
                    show: true,
                    type,
                    currentEvent
                });
                this.setDisableMenu(e.target.degree, e.target.category);
            }
        });
    };

    setDisableMenu = (degree, category) => {
        const { type } = this.state;
        let { disableIndex } = this.state;
        switch (type) {
            case CIRCLE: // 圈层分布
                disableIndex = [];
                break;
            case COMMUNITY: // 关键链路
                disableIndex = [2, 4, 5];
                break;
            case INDUSTRY: // 地域
                disableIndex = [4, 5];
                break;
            case STOCK: // 股权
                disableIndex = [4, 5];
                break;
            case SEEK: // 探寻
                disableIndex = [2, 4, 5];
                break;
        }
        if (degree === 0) {
            disableIndex = _.uniq(disableIndex.concat([4]));
        }
        if (category === 'person') {
            disableIndex = _.uniq(disableIndex.concat([1, 2, 3]));
        } else {
            disableIndex = _.uniq(disableIndex.concat([]));
        }
        this.setState({
            disableIndex: disableIndex
        });
        return disableIndex;
    };

    registerClickEvent = (option, index) => {
        const { type, menus, currentEvent } = this.state;
        let e = currentEvent;
        let { companyName, bbdQyxxId, industry, name, human } = e.target.data, node = e.target;
        switch (option.key) {
            case 1: { // 详情
                windowOpenByUrl(`${DEFAULT_DETAIL}/${switchIndustry(industry)}/${companyName || name}/${bbdQyxxId}/${OTHER}`);
                break;
            }
            case 2: // 扩展
                if (option.currentName === '扩展') {
                    this._getAtlasData({
                        node: { ...node, type },
                        callback: (sourceData) => {
                            node.sourceData = sourceData;
                            this.currentEvent.target.expanded = false;
                            this.handler.trigger(`${type }.extension`, node);
                        }
                    });
                } else {
                    this.handler.trigger(`${type}.packup`, node);
                    e.target.expanded = true;
                }
                break;
            case 3: // 监控
                emitter.emit('TOGGLE_COMMON_LOADING', true);
                companyDetailAPI({
                    type: COMPANY_DETAIL_CHECK_FOCUS,
                    data: { companyId: bbdQyxxId }
                }).then(({ data }) => {
                    emitter.emit('TOGGLE_COMMON_LOADING', false);
                    let { content } = data;
                    if (!content) {
                        emitter.emit('ADD_MONITOR', node);
                    } else {
                        message.warning('已经添加关注');
                    }
                }).catch(() => {
                    emitter.emit('TOGGLE_COMMON_LOADING', false);
                });
                break;
            case 4: // 路径
                this.handler.trigger(`${type}.path`, node);
                break;
            case 5: { // 探寻
                this._seekModal.toggleModal({
                    type: true,
                    option: {
                        title: '输入要探寻关联的企业全称',
                        callback: () => {
                            if (this._selectNode.bbdQyxxId) {
                                let seekData = {
                                    companyId: bbdQyxxId,
                                    nodeIds: [this._selectNode.bbdQyxxId, bbdQyxxId],
                                    nodeTypes: ['Company', human ? 'Person' : 'Company'],
                                    seekType: 'INVEST_MANAGE'
                                };
                                this._getAtlasData({
                                    node: { ...node, type: SEEK, seekData },
                                    callback: (sourceData) => {
                                        node.sourceData = sourceData;
                                        node = { ...node, sourceData, ...seekData };
                                        this.handler.trigger(`${type}.seek`, node);
                                    },
                                    seekData
                                });
                            }
                        }
                    }
                });
                break;
            }
        }
        this.setState({
            show: false
        });

    };

    _getAtlasData = ({ node, callback, seekData }) => {
        let { data, type } = node, url, ajaxData = { bbdQyxxId: data.bbdQyxxId, degree: 1 };
        switch (type) {
            case CIRCLE:
                url = RELATION_CIRCLE;
                break;
            case COMMUNITY:
                url = RELATION_COMMUNITY;
                break;
            case NATURAL: {
                url = RELATION_CIRCLE;
                break;
            }
            case STOCK: {
                url = RELATION_STOCK;
                break;
            }
            case SEEK: {
                url = RELATION_SEEK;
                seekData = seekData || {
                    nodeIds: ['c707a36ece2ea479e97c1aa9a6c99d93', '0af66fb87bf79f2c629b60968bb4e885'],
                    nodeTypes: ['Person', 'Person'],
                    seekType: 'INVEST_MANAGE'
                };
                ajaxData = {
                    ...ajaxData,
                    ...seekData
                };
                break;
            }
            case INDUSTRY:
                url = RELATION_REGION;
                break;
        }
        emitter.emit('TOGGLE_COMMON_LOADING', true);

        relationAPI({
            type: url, 
            data: ajaxData
        }).then(({ data }) => {
            let sourceData = data;
            emitter.emit('TOGGLE_COMMON_LOADING', false);
            switch (type) {
                case CIRCLE:
                    sourceData = higgscharts.Translator.transformCircle({ data: sourceData });
                    break;
                case COMMUNITY:
                    sourceData = higgscharts.Translator.transformCommunity({ data: sourceData });
                    break;
                case NATURAL: {
                    sourceData = {};
                    let nodesKV = {};
                    data.nodes = data.nodes.filter(node => {
                        if (!node.human) {
                            nodesKV[node.bbdQyxxId] = node;
                        }
                        return !node.human;
                    });
                    data.links = data.links.filter(link => {
                        return (ajaxData.bbdQyxxId === link.startId || ajaxData.bbdQyxxId === link.endId) && (nodesKV[link.endId] || nodesKV[link.startId]);
                    });
                    // 找出能连接的公司
                    let links = [];
                    // 必须有连接关系，而且还必须是公司
                    data.links = data.links.map(link => {
                        return {
                            startId: ajaxData.bbdQyxxId,
                            endId: ajaxData.bbdQyxxId === link.startId ? link.endId : link.startId,
                            properties: {
                                bbdRoleId: ajaxData.bbdQyxxId === link.startId ? link.endId : link.startId,
                                roleName: '公司',
                                ratio: '',
                                relationType: null,
                                labels: ['Invest', 'Role', 'Entity']
                            }
                        };
                    });
                    sourceData.data = data;
                    // sourceData = higgscharts.Translator.transformPerson({data: sourceData});
                    break;
                }
                case STOCK: {
                    sourceData = higgscharts.Translator.transformStock({ data: sourceData });
                    break;
                }
                case SEEK:
                    sourceData = higgscharts.Translator.transformSeek({ data: sourceData });
                    break;
                case INDUSTRY: {
                    let formatData = require('../data/addressFormatData.json');
                    sourceData.nodes.map((v, index) => {
                        let newData = formatData.filter(({ name, key }) => name === v.province);
                        v.companyIndustry = newData.length > 0 ? newData[0].key : 'A';
                    });
                    sourceData = higgscharts.Translator.transformIndustry({ data: sourceData });

                    break;
                }
            }
            callback(sourceData.data);
        }).catch(() => {
            emitter.emit('TOGGLE_COMMON_LOADING', false);
        });
    };

    _getSearchItem = () => {
        // 模糊查询
        let { list } = this.state;
        return <Menu onClick={this._clickNode}>
            {list.map(({ companyName, companyNameNa }, index) => <Menu.Item
                key={companyNameNa}>
                <div className="c-search__item" dangerouslySetInnerHTML={{ __html: companyName }}></div>
            </Menu.Item>)}
        </Menu>;
    };

    _clickNode = (e) => {
        let { list } = this.state;
        let selectNode = list.filter((ite) => e.key === ite.companyNameNa);
        this._selectNode = selectNode.length > 0 ? selectNode[0] : null;
        this._search.input.refs.input.value = this._selectNode.companyNameNa;
    };
}