/**
 * Created by fuzhihong on 2017/7/7.
 * PublicOpinion 舆情信息
 */
import './publicOpinion.scss';
import React, { Component } from 'react';
import { isEmpty } from 'Utils/util';
import Analysis from './analysis/Analysis'; // 舆情分析
import News from './news/News'; // 舆情列表
import { LoadingBox, Tabs, Select } from 'mtui/index';
import { Services } from 'Constants/common';
import { detailPageAPI } from 'Services/detail';
const TabItem = Tabs.TabItem;
const { DETAIL_YU_QING_COMPANYID, DETAIL_INVOKE_DATA } = Services;

export default class PublicOpinion extends Component {
    constructor(props) {
        super(props);
        this.publicOpinion = null;
        this.state = {
            gaugeData: null, // 口碑值数据载体
            relationData: null, // 相关公司人物载体
            initDetailDisplayData: null, // 舆情列表载体
            detailDisplayWords: '', // 舆情列表搜索词条
            isShowNoData: false,
            isLoadingData: true,
            activeIndex: 0,
            pubdateDesc: 1 // 排序方式
        };
    }

    componentDidMount() {
        this.getDetailDisplayData();
    }

    componentWillUnmount() {
        // 避免异步请求调用setState时组件已经被销毁的错误.
        this.setState = () => {};
    }

    /**
     * 初始化detailDisplay的数据源 然后判断是否有数据
     */
    getDetailDisplayData() {
        detailPageAPI({
            type: DETAIL_YU_QING_COMPANYID,
            data: {
                companyId: this.props.params.companyId,
                page: 1,
                pageSize: 3,
                keyword: null, // todo 接口更新后修改
                sort: '发布时间降序'
            }
        }).then(({ data }) => {
            let info = {
                initDetailDisplayData: data
            };
            if (isEmpty(data) || isEmpty(data.items)) {
                info = {
                    isShowNoData: true
                };
            }
            this.publicOpinion && this.setState(info, () => {
                this.setState({
                    isLoadingData: false
                });
            });
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

    changeBack = (index) => {
        this.setState({
            activeIndex: index
        });
    }
    /**
     * 类型选择
     * @param e
     * @param data
     */
    sortByChange = (e, data) => {
        const { pubdateDesc } = this.state;
        if(data.value !== pubdateDesc){
            this.setState({
                pubdateDesc: data.value
            });
        }
       
    }
    
    render() {
        let { type, isShowNoData, isLoadingData, activeIndex, pubdateDesc } = this.state;
        return (
            <div className="public-opinion clearfix" ref={c => this.publicOpinion = c}>
                {
                    isLoadingData
                        ? <div className="u-loading-box">
                            <LoadingBox info="数据加载中" type="loading2"/>
                        </div>
                        :
                        isShowNoData ?
                            <div className="yuqing-no-data">
                                <div className="no-data-img"></div>
                            </div>
                            :
                            <div>
                                <div className="detail-display-head" style = {{ opacity: activeIndex ? 0 : 1 }}>
                                    <Select
                                        value={pubdateDesc}
                                        style={{
                                            width: 210,
                                            height: 40,
                                            color: '#000033',
                                            fontSize: 17,
                                            border: '1px solid rgb(0,0,52)',
                                            borderRadius: 100,
                                            lineHeight: '40px'
                                        }}
                                        onChange={this.sortByChange}
                                        modalStyle={{ color: '#ccc', borderRadius: '4px' }}
                                        defaultValue={1}
                                        trigger="click"
                                    >
                                        <Option value={1}>按时间降序排列</Option>
                                        <Option value={2}>按时间升序排列</Option>
                                        <Option value={0}>由关联度从高到低</Option>
                                    </Select>
                                </div>
                                <Tabs className="small-tab" type="top" key={activeIndex} activeIndex={activeIndex}
                                    changeBack={this.changeBack}>
                                    <TabItem name={'舆情列表'}>
                                        <News {...this.props}  type={type} pubdateDesc = {pubdateDesc}/>
                                    </TabItem>
                                    <TabItem name={'舆情分析'}>
                                        <Analysis {...this.props}/>
                                    </TabItem>
                                </Tabs>
                            </div>
                            
                }
            </div>
        );
    }
}