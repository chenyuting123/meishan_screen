/*
* author:TanJun
* describe:DetailPage
* createTime:2018/7/5
* */
import React, { Component } from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { getLocal, setLocal } from 'Utils/storage';
import {
    MAIN, OVERALL, SPECIAL_EVENT, MISTAKE_RULE, ANALYSIS, MONITOR, DETAIL, USER_CONTENT, ATTENTION,
    BLACK_LIST, REPORT, PROCESS, PRIVATE, TRADING, NETWORK, EMERGING, BLACK, OTHER, DETAIL_ITEM, SEARCH,
    EVENT_DETAIL, RELATED_DETAIL, PERSON_ID, PERSON_NAME, TYPE, COMPANY_NAME, INDUSTRY, ANALYSIS_DETAIL,
    SYSTEM_ERROR, PDF_RADAR, PDF_MAPS, CROSS_REGION, DETAIL_PAGE, SSO_LOGIN
} from 'RouterPath';
import {
    App, Login, Main, Home, SpecialEvent, MistakeRule, Analysis, SearchHome, Search,
    Monitor, MonitorHome, Detail, Private, Trading, Network, Emerging, Black, Other, UserContent,
    Attention, BlackList, Report, Process, Radar, Maps, NotFound, SystemError, EventDetail,
    RelatedParDetail, CrossRegion, DetailPage, NoLandfall
} from '../components/index';
import { GetPageByUrl } from 'Utils/hjPromise';

export default class Root extends Component {
    constructor(props) {
        super(props);
    }
    
    enterPath = (nextPath) => {
        window.scrollTo(0, 0);
        let dataSession = getLocal('user');
        let userId = dataSession ? dataSession.id : ''; // 用户id 判断是否登录
        let path = nextPath.location.pathname;  // nextPath的路径
        let isSearchOrDetail = path.indexOf(`/${MAIN}/${OVERALL}/${DETAIL}`) !== -1 || path.indexOf(`${SEARCH}/`) !== -1;
        let isPdfRadarOrMap = path.indexOf('pdfRadar') !== -1 || path.indexOf('pdfMaps') !== -1;
        if (!userId && path === `/${MAIN}/${OVERALL}`) { // 没有登录 跳转首页的情况
            browserHistory.push('/');
        } else if (!userId && !isSearchOrDetail && !isPdfRadarOrMap && path !== '/') { // 未登录的跳转， 只能限制搜索 和 详情页面 限制pdf雷达和map
            browserHistory.push('/');
        }
        if (ECHART_ROOM.length > 0) {
            for (var i = 0; i < ECHART_ROOM.length; i++) {
                ECHART_ROOM[i].dispose();
                ECHART_ROOM.pop();
            }
        }
        setLocal('pageInfo', GetPageByUrl()); // 保存页面信息 给后台用户操作日志使用
    };

    render() {
        return (
            <Router history={browserHistory}>
                <Route path="/" component={App}>
                    <IndexRoute onEnter={this.enterPath} component={Login}/>
                    <Route path={MAIN} onEnter={this.enterPath} component={Main}>
                        {/* 全局实时监测预警 */}
                        <Route path={OVERALL}>
                            <IndexRoute onEnter={this.enterPath} component={Home}/>
                            <Route path={EVENT_DETAIL} onEnter={this.enterPath} component={EventDetail}/>
                            <Route path={CROSS_REGION} component={CrossRegion}/>
                            <Route path={RELATED_DETAIL + PERSON_NAME + PERSON_ID} onEnter={this.enterPath}
                                   component={RelatedParDetail}/>
                        </Route>
                        {/* 特征事件预警 */}
                        <Route path={SPECIAL_EVENT} onEnter={this.enterPath} components={SpecialEvent}>

                        </Route>
                        {/* 企业违规预警 */}
                        <Route path={MISTAKE_RULE} onEnter={this.enterPath} components={MistakeRule}>

                        </Route>
                        {/* 智能检索分析 */}
                        <Route path={ANALYSIS} onEnter={this.enterPath} components={Analysis}>
                            <IndexRoute onEnter={this.enterPath} component={SearchHome}/>
                            <Route path={SEARCH + TYPE + COMPANY_NAME} onEnter={this.enterPath} component={Search}/>
                            <Route path={DETAIL_PAGE} onEnter={this.enterPath} component={DetailPage}/>
                        </Route>
                        {/* 重点企业监控 */}
                        <Route path={MONITOR} onEnter={this.enterPath} components={Monitor}>
                            <IndexRoute onEnter={this.enterPath} component={MonitorHome}/>
                        </Route>
                        {/* 详情 */}
                        <Route path={DETAIL} onEnter={this.enterPath} component={Detail}>
                            <IndexRoute onEnter={this.enterPath} component={Private}/>
                            <Route path={PRIVATE + DETAIL_ITEM} onEnter={this.enterPath}
                                   component={Private}/>{/* 私募 */}
                            <Route path={TRADING + DETAIL_ITEM} onEnter={this.enterPath}
                                   component={Trading}/>{/* 详情交易 */}
                            <Route path={NETWORK + DETAIL_ITEM} onEnter={this.enterPath}
                                   component={Network}/>{/* 网络借贷 */}
                            <Route path={EMERGING + DETAIL_ITEM} onEnter={this.enterPath}
                                   component={Emerging}/>{/* 新兴金融 */}
                            <Route path={BLACK + DETAIL_ITEM + TYPE} onEnter={this.enterPath}
                                   component={Black}/>{/* 黑名单企业 */}
                            <Route path={OTHER + DETAIL_ITEM} onEnter={this.enterPath}
                                   component={Other}/>{/* 其它企业 */}
                        </Route>
                        <Route path={USER_CONTENT} onEnter={this.enterPath} component={UserContent}>
                            <IndexRoute onEnter={this.enterPath} component={BlackList}/>
                            {/* <Route path={ATTENTION} onEnter={this.enterPath} component={Attention}/> */}
                            <Route path={BLACK_LIST} onEnter={this.enterPath} component={BlackList}/>
                            <Route path={REPORT} onEnter={this.enterPath} component={Report}/>
                            <Route path={PROCESS} onEnter={this.enterPath} component={Process}/>
                        </Route>
                        <Route path={SYSTEM_ERROR} component={SystemError}/>
                    </Route>
                    <Route path={PDF_RADAR} onEnter={this.enterPath} component={Radar}/>
                    <Route path={PDF_MAPS} onEnter={this.enterPath} component={Maps}/>
                    <Route path={SSO_LOGIN} component={NoLandfall}/>
                    {/* <Route path="noLandfall/ToRiskMonitor/:card/:isShowChart/:riskColor"
                           component={NoLandfallToRiskMonitor}/> */}
                    <Route path="*" component={NotFound}/>
                </Route>
            </Router>
        );
    }
}

