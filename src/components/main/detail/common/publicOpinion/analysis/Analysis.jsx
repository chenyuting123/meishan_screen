/**
 * Created by fuzhihong on 2017/7/7.
 * PublicOpinion 舆情信息
 */

import React, { Component } from 'react';
import { isEmpty } from 'Utils/util';
import PoItemPanel from '../poItemPanel/PoItemPanel'; // item 包裹层
import Gauge from '../gauge/Gauge'; // 口碑值
import GaugeTend from '../gaugeTend/GaugeTend'; // 口碑走势
import WordCloud from '../wordCloud/WordCloud'; // 热词词云
import RelationShip from '../relationShip/RelationShip'; // 关联关系
import IncAndDes from '../incAndDes/IncAndDes'; // 上升&下降最快
import RelateCompany from '../relateCompany/RelateCompany'; // 相关公司
import RelatePeople from '../relatePeople/RelatePeople'; // 相关人物
// import DetailDisplay from '../detailDisplay/DetailDisplay'; // 详情展示
import { LoadingBox } from 'mtui/index';
import { Services } from 'Constants/common';
import { detailPageAPI } from 'Services/detail';

const { DETAIL_YU_QING_COMPANYID, DETAIL_INVOKE_DATA } = Services;

export default class PublicOpinion extends Component {
    constructor(props) {
        super(props);
        this.publicOpinion = null;
        this.state = {
            gaugeData: null, // 口碑值数据载体
            relationData: null, // 相关公司人物载体
            detailDisplayWords: '', // 舆情列表搜索词条
            isShowNoData: false,
            isLoadingData: true
        };
    }

    /**
     * 获取相关公司人物数据
     */
    getRelationData() {
        detailPageAPI({
            type: DETAIL_INVOKE_DATA,
            data: {
                apiId: 'api_hongjing_relatedcp',
                qyId: this.props.params.companyId
            }
        }).then(({ data }) => {
            let content = data.data;
            if (isEmpty(content)) {
                content = {
                    company_list: [],
                    company_name: '',
                    person_list: []
                };
            }
            this.setState({
                relationData: content
            });
        });
    }

    componentDidMount() {
        this.getRelationData();
    }

    /**
     *  相关人物 相关公司点击回调
     */
    onRelatedClick(name, type) {
        this.setState({
            detailDisplayWords: name,
            type: type
        });
    }

    // /**
    //  * 根据舆情来判断是否有数据，如果没有舆情模块显示暂无数据。
    //  * @return {[type]} [description]
    //  */
    // publicOpinionIsData(yuQingData){
    //     let _this = this;
    //     this.setState({
    //         isLoadingData: false
    //     }, function () {
    //         if(yuQingData.length <= 0){
    //             _this.setState({
    //                 isShowNoData: true
    //             });
    //         }
    //     });
    // }
    /**
     * render right title
     */
    renderRightTitle() {
        return <div>
            <span>关联趋势</span>
            <span><div className="relate-up-circle"></div>上升</span>
            <span><div className="relate-down-circle"></div>下降</span>
        </div>;
    }

    /**
     * render Gauge right title
     */
    renderGaugeRightTitle() {
        return <div>
            <span>正面 <div className="relate-positive-circle"> </div></span>
            <span>中性 <div className="relate-neutral-circle"> </div></span>
            <span>负面 <div className="relate-negative-circle"> </div></span>
        </div>;
    }

    render() {
        let { relationData } = this.state;
        return (
                <div>
                    <PoItemPanel itemName="口碑值" itemSize="col-1-3" rightTitle={this.renderGaugeRightTitle()}
                                    margin="col-1-3-margin" positionRelative={true}>
                        <Gauge {...this.props} />
                    </PoItemPanel>

                    <PoItemPanel itemName="口碑走势图" itemSize="col-1-3" margin="col-1-3-margin"
                                    positionRelative={true}>
                        <GaugeTend {...this.props} />
                    </PoItemPanel>

                    <PoItemPanel itemName="热词词云" itemSize="col-1-3" positionRelative={true}>
                        <WordCloud {...this.props} />
                    </PoItemPanel>

                    <PoItemPanel itemName="关联关系" itemSize="col-2-3" rightTitle={this.renderRightTitle()}
                                    margin="col-2-3-margin" positionRelative={true}>
                        <RelationShip {...this.props}/>
                    </PoItemPanel>

                    <PoItemPanel itemName="上升/下降" itemSize="col-1-3" hideHead={true}
                                    positionRelative={true}>
                        <IncAndDes {...this.props} />
                    </PoItemPanel>

                    <PoItemPanel itemName="相关公司" itemSize="col-1-2" margin="col-1-2-margin"
                                    positionRelative={true}>
                        {relationData ? <RelateCompany onRelatedClick={this.onRelatedClick.bind(this)}
                                                        relationData={relationData}/> :
                            <LoadingBox type="loading2"/>}
                    </PoItemPanel>

                    <PoItemPanel itemName="相关人物" itemSize="col-1-2" positionRelative={true}>
                        {relationData ? <RelatePeople onRelatedClick={this.onRelatedClick.bind(this)}
                                                        relationData={relationData}/> :
                            <LoadingBox type="loading2"/>}
                    </PoItemPanel>

                    {/* <PoItemPanel itemName="舆情详情展示" itemSize="col-1-1" hideHead={true} infiniteHeight={true}
                                    positionRelative={true}>
                        <DetailDisplay {...this.props} initDetailDisplayData={initDetailDisplayData}
                                        detailDisplayWords={detailDisplayWords} type={type}/>
                    </PoItemPanel> */}
                </div>
        );
    }
}