/*
* author:TanJun
* describe:RelatedPartyAtlas
* createTime:2018/7/5
* */
import './index.scss';
import React, { Component } from 'react';
import { Select } from 'antd';
import higgscharts from 'Libs/higgscharts';
import { higgschartsType, appDataType } from 'Constants/higgscharts';
import { CommonTimeAxis } from 'CommonComponents';
import LeftScreen from './leftScreen';
import RightExplain from './rightExplain';
import Contextmenu from './contextmenu';
import { relationAPI } from 'Services/analysis';
import { Services } from 'Constants/common';
import appData from 'Utils/appData';
import emitter from 'Utils/emitter';
import { dataURLtoBlob } from 'Utils/util';
import { formatDate } from '../../../../../utils/formatter';

const Option = Select.Option;
const { CIRCLE, COMMUNITY, STOCK, SEEK, INDUSTRY, NATURAL } = higgschartsType;
const { NODE } = appDataType;
const {
    RELATION_CIRCLE,
    RELATION_COMMUNITY,
    RELATION_REGION,
    RELATION_SEEK,
    RELATION_STOCK,
    RELATION_NATURAL_PERSON,
    RELATION_NATURAL_PERSON_INVERST,
    EXPORT_BRIEF
} = Services;

class RelatedPartyAtlas extends Component {

    constructor(props) {
        super(props);
        let { companyName, companyId } = props.params;
        this._charts = {};
        this._hcs = {};
        this._chartsImgs = [];
        this._naturalCompany = [];
        this.state = {
            companyName, 
            companyId, 
            type: CIRCLE
        };
    }

    componentDidMount() {
        let { offsetWidth, offsetHeight } = this._charts[CIRCLE];
        let { upDateURL } = this.props;

        this._hcs[CIRCLE] = higgscharts.init(this._charts[CIRCLE], {
            width: offsetWidth,
            height: offsetHeight,
            plugins: [
                new Contextmenu() // 插入 右键功能按钮
            ],
            isUpdate: false
        });

        this._hcs[CIRCLE].on('setStateBehavior', (info) => {
            // 获取图谱nodes
            appData.setAppData({ type: NODE, info: info });
            this.setState({ isUpdate: true });
        });

        // this._hcs[CIRCLE].on('chart.getSettingStatus', () => {
        //     let { type } = this.state;
        //     this._hc.trigger(`${type}.setting.setData`,
        //         {
        //             statusParam: {
        //                 followed: false,
        //                 name: false,
        //                 num: false,
        //                 path: false,
        //                 ratio: false,
        //                 relation: false,
        //                 remark: false
        //             }
        //         });
        // });
        
        // 生成图片
        // this.getChartImgs();
    }

    render() {
        let { type, people } = this.state;

        return (
            <div>
                {
                    type === NATURAL && people
                        ? <div>
                            <div>
                                <strong>成都十年名品</strong>
                                <Select
                                    mode="combobox"
                                    size="default"
                                    onSelect={this.handleChangePeople}
                                    style={{ width: 200 }}
                                >
                                    {
                                        people.map(function (value) {
                                            return <Option key={value.bbdQyxxId} value={value.personName}>{value.personName}</Option>;
                                        })
                                    }
                                </Select>
                            </div>
                            <div>
                                <p>简介：ceo</p>
                            </div>
                        </div>
                        : null
                }
                {/* 图谱绑定元素 */}
                <div className="c-atlas" ref={chart => this._charts[CIRCLE] = chart}>
                    {/* 下方日期选择器 */}
                    <CommonTimeAxis {...this.state} hc={this._hcs[CIRCLE]} ref={timeAxis => this._timeAxis = timeAxis} initAtlas={this.initAtlas} />
                    {/* 左侧筛选菜单 */}
                    { [COMMUNITY, NATURAL].includes(type) ? null : <LeftScreen {...this.state} hc={this._hcs[CIRCLE]} getAtlasData={this.getAtlasData}/> }
                    {/* 右侧分析结果 */}
                    <RightExplain ref={explain => this._explain = explain} {...this.state} hc={this._hcs[CIRCLE]} />
                </div>
                <div className="charts-unvisible">
                    <div className="c-atlas" ref={chart => this._charts[COMMUNITY] = chart}></div>
                    <div className="c-atlas" ref={chart => this._charts[STOCK] = chart}></div>
                    <div className="c-atlas" ref={chart => this._charts[SEEK] = chart}></div>
                    <div className="c-atlas" ref={chart => this._charts[INDUSTRY] = chart}></div>
                </div>
            </div>
        );
    }

    // 初始化图谱
    initAtlas = ({ type = 'circle' }) => {
        this.setState({ type }, () => {
            this.getAtlasData({ type });
        });
    };

    toggleExplain = () => {
        this._explain.toggleExplain();
    };

    getAtlasData = ({ type, callback, degree, seekData }) => {
        let { companyId } = this.state, url,
            ajaxData = { bbdQyxxId: companyId, degree: degree ? degree : 2, date: this._timeAxis.getTime() };
        switch (type) {
            case CIRCLE:
                url = RELATION_CIRCLE;
                break;
            case COMMUNITY:
                url = RELATION_COMMUNITY;
                break;
            case STOCK: {
                url = RELATION_STOCK;
                break;
            }
            case NATURAL: {
                const p0 = new Promise(resolve => this.getPeople(resolve));
                const p1 = new Promise(resolve => this.getPeopleInvester(resolve));
                Promise.all([p0, p1]).then(data => {
                    // this._hcs[CIRCLE].dispose();
                    this.setState({
                        people: data[0],
                        peopleInvester: data[1],
                        type: NATURAL
                    });
                });
                return;
            }
            case SEEK:
                url = RELATION_SEEK;
                seekData = seekData || {
                    nodeIds: [companyId, '0af66fb87bf79f2c629b60968bb4e885'],
                    nodeTypes: ['Company', 'Person'],
                    seekType: 'INVEST_MANAGE',
                    companyId
                };
                ajaxData = {
                    ...ajaxData,
                    ...seekData
                };
                break;
            case INDUSTRY:
                url = RELATION_REGION;
                break;
        }
        emitter.emit('TOGGLE_COMMON_LOADING', true);
        relationAPI({ type: url, data: ajaxData }).then(({ data }) => {
            emitter.emit('TOGGLE_COMMON_LOADING', false);
            this._initAtlas({ type, sourceData: data, seekData, callback });
        }).catch(() => {
            emitter.emit('TOGGLE_COMMON_LOADING', false);
        });
    };

    _initAtlas({ type, sourceData, seekData, callback }) {
        let { companyId } = this.state;

        switch (type) {
            case CIRCLE:
                sourceData = higgscharts.Translator.transformCircle({ data: sourceData });
                break;
            case COMMUNITY:
                sourceData = higgscharts.Translator.transformCommunity({ data: sourceData });
                break;
            case NATURAL:{
                let formatterData = this.formatterNatural('许文平');
                companyId = formatterData.data.centerNode.bbdQyxxId;
                sourceData = higgscharts.Translator.transformPerson(formatterData);
                break;
            }
            case STOCK:
                sourceData = higgscharts.Translator.transformStock({ data: sourceData });
                break;
            case SEEK:
                sourceData = higgscharts.Translator.transformSeek({ data: sourceData });
                break;
            case INDUSTRY: {
                let formatData = require('./data/addressFormatData.json');
                sourceData.nodes.map((v, index) => {
                    let newData = formatData.filter(({ name, key }) => name === v.province);
                    v.companyIndustry = newData.length > 0 ? newData[0].key : 'A';
                });
                sourceData = higgscharts.Translator.transformIndustry({ data: sourceData });

                break;
            }
        }
        
        if (callback) {
            callback(sourceData.data);
        } else {
            if (companyId) {
                sourceData.data.nodes.map(function (v) {
                    if (v.id === companyId) {
                        v.isTarget = true;
                    }
                });
            }

            // this._hc.on('dispose', () => {
            //     this._hc.dispose();
            // });

            // 根据转换数据，初始化图谱
            this._hcs[CIRCLE].setOption({
                chart: {
                    type,
                    animation: false,
                    scale: [1, 1],
                    data: sourceData.data,
                    seek: type === SEEK ? seekData : ''
                }
            });
        }
    }

    getChartImgs = () => {
        let p0 = new Promise((resolve, reject) => {
            this.initChart(COMMUNITY, resolve);
        });

        let p1 = new Promise((resolve, reject) => {
            this.initChart(STOCK, resolve);
        });

        let p2 = new Promise((resolve, reject) => {
            this.initChart(SEEK, resolve);
        });

        let p3 = new Promise((resolve, reject) => {
            this.initChart(INDUSTRY, resolve);
        });

        Promise.all([p0, p1, p2, p3]).then(values => {
            let formData = new FormData();
            formData.append('relationImg', this._hcs[CIRCLE].toDataURL(), '二度关联方图谱');
            formData.append('communityImg', values[0], '核心关联路径图（二度）');
            formData.append('equityPenetrationImg', values[1], '一度股权穿透图');
            formData.append('INDUSTRY', values[3], '一度股权穿透图');

        });
    };

    initChart(type, resolve) {
        let { offsetWidth, offsetHeight } = this._charts[CIRCLE];

        this._hcs[type] = higgscharts.init(this._charts[type], {
            width: offsetWidth,
            height: offsetHeight,
            isUpdate: false
        });

        let { companyId } = this.state;
        let url;
        let seekData;
        let ajaxData = { bbdQyxxId: companyId, degree: 2, date: this._timeAxis.getTime() };

        switch (type) {
            case CIRCLE:
                url = RELATION_CIRCLE;
                break;
            case COMMUNITY:
                url = RELATION_COMMUNITY;
                break;
            case STOCK: 
                url = RELATION_STOCK;
                break;
            case SEEK:
                url = RELATION_SEEK;
                seekData = seekData || {
                    nodeIds: [companyId, '0af66fb87bf79f2c629b60968bb4e885'],
                    nodeTypes: ['Company', 'Person'],
                    seekType: 'INVEST_MANAGE',
                    companyId
                };
                ajaxData = {
                    ...ajaxData,
                    ...seekData
                };
                break;
            case INDUSTRY:
                url = RELATION_REGION;
                break;
        }

        relationAPI({
            type: url, 
            data: ajaxData
        }).then((data) => {
            let { companyId } = this.state;
            let sourceData = data.data;

            switch (type) {
                case CIRCLE:
                    sourceData = higgscharts.Translator.transformCircle({ data: sourceData });
                    break;
                case COMMUNITY:
                    sourceData = higgscharts.Translator.transformCommunity({ data: sourceData });
                    break;
                case STOCK: 
                    sourceData = higgscharts.Translator.transformStock({ data: sourceData });
                    break;                
                case SEEK:
                    sourceData = higgscharts.Translator.transformSeek({ data: sourceData });
                    break;
                case INDUSTRY: {
                    let formatData = require('./data/addressFormatData.json');
                    sourceData.nodes.map((v, index) => {
                        let newData = formatData.filter(({ name, key }) => name === v.province);
                        v.companyIndustry = newData.length > 0 ? newData[0].key : 'A';
                    });
                    sourceData = higgscharts.Translator.transformIndustry({ data: sourceData });
                    break;     
                }           
            }

            if (companyId) {
                sourceData.data.nodes.map(function (v) {
                    if (v.id === companyId) {
                        v.isTarget = true;
                    }
                });
            }

            // this._hc.on('dispose', () => {
            //     this._hc.dispose();
            // });

            // 根据转换数据，初始化图谱
            this._hcs[type].setOption({
                chart: {
                    type,
                    animation: false,
                    scale: [1, 1],
                    data: sourceData.data,
                    seek: type === SEEK ? seekData : ''
                }
            });
            this.downloadPng(type, resolve);
        });
    }

    downloadPng = (type, resolve) => {
        const png = this._hcs[type].toDataURL();
        resolve(dataURLtoBlob(png));
    };

    getPeople(resolve) {
        let param = {
            bbdQyxxId: this.state.companyId,
            date: this._timeAxis.getTime()
        };
        relationAPI({ type: RELATION_NATURAL_PERSON, data: param }).then(({ data }) => {
            resolve(data);
        });
    }

    getPeopleInvester(resolve) {
        let param = {
            bbdQyxxId: this.state.companyId
        };
        relationAPI({ type: RELATION_NATURAL_PERSON_INVERST, data: param }).then(data => {
            data = data.data;
            if (data) {
                let _peopleInvester = [];
                const keys = Object.keys(data);
                keys.forEach(value => {
                    _peopleInvester = _peopleInvester.concat(data[value]);
                });
                return resolve(_peopleInvester);
            }
        });
    }

    handleChangePeople = (value) => {
        const sourceData = this.formatterNatural(value);
        this._initAtlas({ type: NATURAL, sourceData });
    };

    formatterNatural = (personName) => {
        const { people, peopleInvester } = this.state;
        let sourceData = {
            data: null
        };

        let person = people.find(function (value) {
            return personName === value.personName;
        });
        const centerNode = {
            name: person.personName,
            category: 0,
            riskIndex: 0,
            black: false,
            bbdQyxxId: person.bbdQyxxId,
            riskCount: 0,
            degree: 0,
            labels: [
                'Person',
                'Entity'
            ],
            human: true
        };
        let investNodes = [], links = [];
        peopleInvester.forEach(function (value) {
            if (person.personName === value.name || person.personName === value.ent_frname) {
                investNodes.push({
                    bbdQyxxId: value.dataId,
                    personName: value.companyName,
                    dwtzxx: 1,
                    degree: 1,
                    labels: ['Company', 'Entity'],
                    human: false
                });
                links.push({
                    startId: person.bbdQyxxId,
                    endId: value.dataId,
                    properties: {
                        bbdRoleId: value.dataId,
                        roleName: '公司',
                        ratio: '',
                        relationType: null,
                        labels: ['Invest', 'Role', 'Entity']
                    }
                });
            }
        });

        sourceData.data = {
            centerNode: centerNode,
            investNodes: investNodes,
            links: links
        };
        return sourceData;
    };
}

export default RelatedPartyAtlas;