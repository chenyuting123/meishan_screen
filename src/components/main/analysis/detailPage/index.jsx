/*
* author:TanJun
* describe:DetailPage
* createTime:2018/7/5
* */
import './index.scss';
import React, { Component } from 'react';
import { CommonTable } from 'CommonComponents';
import ClassfiyHandle from './classifyHandle';
import RelatedPartyAtlas from './relatedPartyAtlas';
import RelatedAnalysis from './relatedAnalysis';
import { higgschartsType } from 'Constants/higgscharts';
import { Tip } from 'mtui/index';
import { browserHistory } from 'react-router';
import DetailHead from '../../detail/common/detailHead/DetailHead';

const { COUNT } = higgschartsType;

class DetailPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            type: props.params.type,
            updateAtlas: this.updateAtlas,
            isShowAtlas: true,
            toggleExplain: this.toggleExplain,
            pageShow: false // 判断是否有权限查看
        };
    }

    componentDidMount() {
        let { type } = this.state;
        this.updateAtlas({ type });
    }

    changePageShow(flag, msg) {
        if (flag) {
            this.setState({
                pageShow: true
            });
        } else {
            Tip.warning(msg, 2000, function () {
                browserHistory.push('/main/overall');
            });
        }
    }

    render() {
        let { isShowAtlas } = this.state;
        return <div className="u-container c-detail-page">
            <DetailHead {...this.props} pageShow={this.changePageShow.bind(this)} isDetailPage={true}/>
            <div className="c-detail-page__content">
                <ClassfiyHandle {...this.state}/>
                {isShowAtlas
                    ? <RelatedPartyAtlas ref={atlas => this._atlas = atlas} {...this.props} upDateURL={this.upDateURL}/>
                    : <RelatedAnalysis {...this.props}/>
                }
                {/* {isShowAtlas ? */}
                    {/* <div className="table-content"> */}
                        {/* <p className="title">分析数据列表</p> */}
                        {/* <CommonTable ref={ref => this._table = ref}/> */}
                    {/* </div> */}
                    {/* : null} */}
            </div>
        </div>;
    }

    updateAtlas = ({ type }) => {
        if (type === COUNT) {
            this.setState({ isShowAtlas: false });
        } else {
            this.setState({ isShowAtlas: true }, () => {
                this._atlas.initAtlas({ type });
            });
        }
    };

    upDateURL = ({ listData }) => {
        let tableColumns = [
            {
                title: '企业名',
                dataIndex: 'name',
                key: 'name'
            },
            {
                title: '注册资本',
                dataIndex: 'regcap',
                key: 'regcap'
            },
            {
                title: '注册日期',
                dataIndex: 'esdate',
                key: 'esdate'
            },
            {
                title: '状态',
                dataIndex: 'estatus',
                key: 'estatus'
            },
            {
                title: '行业',
                dataIndex: 'industry',
                key: 'industry'
            },
            {
                title: '风险等级',
                dataIndex: 'riskLevel',
                key: 'riskLevel'
            },
            {
                title: '风险分值',
                dataIndex: 'riskIndex',
                key: 'riskIndex'
            },
            {
                title: '“非法集资“裁判文书',
                dataIndex: 'totalFfjz',
                key: 'totalFfjz'
            },
            {
                title: '“民间借贷“诉讼文书',
                dataIndex: 'totalPrivateLendingNum',
                key: 'totalPrivateLendingNum'
            },
            {
                title: '失信被执行人',
                dataIndex: 'totalDishonestyNum',
                key: 'totalDishonestyNum'
            },
            {
                title: '被执行人',
                dataIndex: 'totalZhixingNum',
                key: 'totalZhixingNum'
            },
            {
                title: '行政处罚',
                dataIndex: 'totalXzcfNum',
                key: 'totalXzcfNum'
            },
            {
                title: '经营异常',
                dataIndex: 'totalQyycNum',
                key: 'totalQyycNum'
            },
            {
                title: '诉讼',
                dataIndex: 'totalDocumentNum',
                key: 'totalDocumentNum'
            },
            {
                title: '工商变更',
                dataIndex: 'totalBgxxNum',
                key: 'totalBgxxNum'
            },
            {
                title: '对外投资',
                dataIndex: 'totalOutDegreeNum',
                key: 'totalOutDegreeNum'
            },
            {
                title: '黑名单关联方',
                dataIndex: 'totalBlackNum',
                key: 'totalBlackNum'
            },
            {
                title: '高风险关联方',
                dataIndex: 'totalHighNum',
                key: 'totalHighNum'
            }
        ];
        this._table.upDateURL({ tableColumns, listData });
    };

    toggleExplain = () => {
        this._atlas.toggleExplain();
    };

}

export default DetailPage;