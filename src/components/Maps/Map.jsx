'use strict';

import React, {Component} from 'react';
import {Link} from 'react-router';
import {LoadingBox, Tip} from 'mtui/index';
import {Services} from 'Constants/common';
import {detailRelationAPI} from 'Services/detail';

const {RELATION_INFO, RELATION_NODE_AND_LINK} = Services;

//   载入可用模块
import Engine from './map/Engine'; //   引擎 
import Store from './map/Store'; //   数据缓存
import Event from './map/Event'; //   事件操作 
import ShowAllFilter from './map/filter/ShowAllFilter'; //   过滤器1，显示所有
import emitter from 'Utils/emitter';

import {zhengxiang, nixiang, listNoCompany} from './map/FunApi';

class Index extends Component {
    //   构造函数
    constructor(props) {
        super(props);
        this.state = {
            mapdataAll: {},
            mapdata: false, //   地图数据
            qyxxid: null, //   企业信息ID
            companyName: null, //   公司名称
            companyType: '全部',
            province: ''
        };
    }

    //   初始化数据
    componentWillMount() {
        let companyName = this.props.params.companyName || this.props.location.query.companyName;
        let qyxxid = this.props.params.companyId || this.props.location.query.companyId;
        let province = this.props.location.query.province || '';
        if (qyxxid) {
            this.setState({
                companyName: companyName,
                qyxxid: qyxxid,
                province: province
            }, () => {
                this.initData(1);
            });
        } else {
            this.setState({
                mapdata: null
            });
        }
    }

    componentDidMount() {
        emitter.on('CHANGE_DEGREE_INDEX', this.initData);
        // emitter.on('CHANGE_MAP_MAX', this.drawMap);
        // emitter.on('CHANGE_TYPE_INDEX', this.changeData);
    }

    componentWillUnmount() {
        emitter.removeListener('CHANGE_DEGREE_INDEX', this.initData);
        // 避免异步请求调用setState时组件已经被销毁的错误.
        this.setState = () => {};
    }

    //  请求ajax成功后，初始化图表,第一次执行loading,ajax成功后，走这步
    drawMap = (res, qyxxids, companyNames) => {
        $('#Map').empty();
        let qyxxid = qyxxids ? qyxxids : this.state.qyxxid;
        let companyName = companyNames ? companyNames : this.state.companyName;
        var data = ShowAllFilter(res); //  数据过滤

        //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  /
        //  历史查看
        var json = {name: companyName, qyxxid: qyxxid},
            arr_view = !localStorage.getItem('higgs_history_view') ? [] : localStorage.getItem('higgs_history_view').split('#'),
            arr_mark = !localStorage.getItem('higgs_had_mark') ? [] : localStorage.getItem('higgs_had_mark').split('#'),
            arr_tanxun = !localStorage.getItem('higgs_tanxun') ? [] : localStorage.getItem('higgs_tanxun').split('#'),
            shtml = '';

        //  数组去重
        var filterData = function (arr) {
            //  获取当前缓存
            arr = _.uniq(arr); //  去重
            return arr;
        };

        //  历史记录拼接字符串
        arr_view.push(JSON.stringify(json));
        arr_view = filterData(arr_view);
        for (var i = 0; i < arr_view.length; i++) {
            var obj = JSON.parse(arr_view[i]);
            shtml += ('<li><a href="/map/relateInfo?companyName=' + obj.name + '&qyxxId=' + obj.qyxxid + '">' + obj.name + '</a></li>');
        }
        localStorage.setItem('higgs_history_view', arr_view.join('#'));
        $('#historyView').html(shtml);
        //  end 历史

        //  标记
        shtml = '';
        arr_mark = filterData(arr_mark);
        for (let i = 0; i < arr_mark.length; i++) {
            let obj = JSON.parse(arr_mark[i]);
            shtml += ('<li data-name=' + obj.name + ' data-qyxxId=' + obj.qyxxid + '>' + obj.name + '<a class="iconfont icon-close"></a></li>');
        }
        localStorage.setItem('higgs_had_mark', arr_mark.join('#'));
        if (listNoCompany(shtml, '暂无标记节点')) {
            shtml = listNoCompany(shtml, '暂无标记节点');
        }
        $('#hadMark').html(shtml);

        //  探寻
        shtml = '';
        arr_tanxun = filterData(arr_tanxun);
        for (let i = 0; i < arr_tanxun.length; i++) {
            let obj = JSON.parse(arr_tanxun[i]);
            shtml += ('<li data-name=' + obj.name + ' data-qyxxId=' + obj.qyxxid + '>' + obj.name + '<a class="iconfont icon-close"></a></li>');
        }
        localStorage.setItem('higgs_tanxun', arr_tanxun.join('#'));
        if (listNoCompany(shtml, '未添加探寻企业')) {
            shtml = listNoCompany(shtml, '未添加探寻企业');
        }
        $('#tanxunList').html(shtml);

        filterData = null;
        Engine(data, {
            callback: function () {
                $('#Map').show();
                // loadedPdf = 'success';// pdf那边截图要用
                // drawNum(data);
            }
        }); //  载入数据引擎
        //  事件绑定
        Event.mouseRight(); //  鼠标右键
        Event.hideNodes(); //  删除节点
        Event.nodesExt(); //  拓展节点
        Event.nodesPath(); //  路径显示
        Event.cancelnodesPath();//  取消路径高亮
        Event.nodesDetail(); //  查看详情
        Event.nodesMark(); //  标记
        Event.nodesTanXun(); //  探寻

        //   Event.listFlod(); //  列表折叠
        //   Event.menuListDo(); //  菜单列表操作
        //  Event.clickHositryView(); //  历史记录还原
        //  Event.searchMap(); //  智能搜索监听
        //   }
    };

    //   初始化数据
    initData = (degree) => {
        //   清空对象
        for (let key in Store) {
            if (key === 'showMap') {
                Store[key] = 1;
            } else if (key === 'nameExg') {
                Store[key] = /(有限公司|股份有限公司|有限责任公司|公司)/;
            } else if (key === 'allData') {
                Store[key] = {//   所有的点 
                    arr: {},
                    links: [],
                    obj: {}
                };
            } else {
                Store[key] = null;
            }
        }

        let {qyxxid, companyName, province} = this.state;

        setTimeout(() => { 
            detailRelationAPI({
                type: RELATION_NODE_AND_LINK,
                data: {
                    qyxxId: qyxxid,
                    degree,
                    province
                }
            }).then(({data}) => {
                let content = data;
                if (content) {
                    if (content.nodes.length === 0) {
                        content = {
                            links: [],
                            nodes: [{
                                addflag: '',
                                black: false,
                                category: 0,
                                cname: companyName,
                                color: 0,
                                industry: '',
                                name: qyxxid,
                                numIndex: 5,
                                relationDescribe: '目标公司',
                                riskIndex: 0,
                                riskLevel: '',
                                symbol: 'rect'

                            }]
                        };
                    }

                    emitter.emit('CHANGE_MAPS_DATA', content);
                    // 暴露出去 global
                    // window.GLOBAL_DATA = res.data;
                    $(document).trigger('getAllData', content);
                    this.setState({
                        mapdata: content,
                        qyxxid
                    });
                    //    绘图
                    this.drawMap(content, qyxxid, companyName);
                } else {
                    this.setState({
                        mapdata: 'error'
                    });
                }
            });
        }, 500);
    };

    render() {
        // 数据加载中
        if (this.state.mapdata === false) {
            return <LoadingBox info="数据载入中" type="loading2"/>;
        }
        // 加载失败
        else if (this.state.mapdata === 'error') { // == 'error'
            return <div className="loading-error">
                <i className="ico-oading-error"></i><br/>
                加载失败!
                <p>数据在加载过程中逃跑了，您可以协助我们进行以下操作：</p>
                <div>
                    <button style={{marginRight: '15px'}} onClick={() => this.callBack()}
                            className="mt-btn-green mt-btn-lg ink-reaction feedback">一键反馈&nbsp;&nbsp;&nbsp;</button>
                    <button className="mt-btn-blue mt-btn-lg ink-reaction"
                            onClick={this.reLoad}>重新加载&nbsp;&nbsp;</button>
                </div>
            </div>;
        }
        // 未选择公司
        else if (this.state.mapdata == null) {
            return <div className="no-select-qyxxid"> 未选择企业<br/> <i className="ico-noselect"></i></div>;
        }
        return <div style={{display: this.props.mapType == 'map' ? 'block' : 'none'}} className="map" id="Map"></div>;
    }
}

export default Index;