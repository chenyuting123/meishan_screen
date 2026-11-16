/*
 * create by xuyao
 * 实时监测中国地图迁徙图
*/
import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import './style.css';
// import {ajax} from '../../../../mixins/ajax'
import CommonComponents from 'CommonComponents';// 中国地图 迁徙图
let { BBDMapChinaGeoLine } = CommonComponents;
const MapChina = React.createClass({
    getInitialState() {
        return {
            geoCoordMap: null, // 中国地图地理位置信息
            SHToAllPlace: [], // 上海到全国
            allPlaceToSH: [], // 全国到上海
            mapChinaOption: null,
            mapChinaShow: 'block',
            goLink: ''
        };
    },
    componentDidMount() {
        this.getGeoJson();
        this.goLink();
    },
    componentDidUpdate() {
        //
    },
    componentWillReceiveProps(nextProps) {
        let show = nextProps.show;
        if (show) {
            this.setState({ mapChinaShow: 'block' });
        } else {
            this.setState({ mapChinaShow: 'none' });
        }
    },
    /*
    *获取地图地理信息
   */
    getGeoJson() {
        let self = this;
        // ajax({
        //     url: './data/realtimeMonitor/geoCoordMap.json',
        //     dataType:'json',
        //     data: {},
        //     type: 'GET',
        //     success: function(result) {
        //         let geoCoordMap=result.data.geoCoordMap;
        //         self.setState({geoCoordMap:geoCoordMap},function(){
        //             self.getMapChina();
        //         });
        //     }
        // });
    },
    /*
     *获取地图的迁徙数据
    */
    getMapChina() {
        let self = this;
        // ajax({
        //     url: '/realTimeMonitor/ChinaMap.do',
        //     dataType:'json',
        //     data: {},
        //     type: 'GET',
        //     success: function(result) {
        //         self.setState({
        //             SHToAllPlace:result.content.SHData1,//上海到全国
        //             allPlaceToSH:result.content.SHData//全国到上海
        //         },function(){
        //             self.initMap();//处理数据初始化地图
        //         })
        //     },
        //     error:function(result){
        //         //
        //     }
        // });
    },
    initMap() {
        let SHToAllPlace = this.state.SHToAllPlace;
        let allPlaceToSH = this.state.allPlaceToSH;
        let geoCoordMap = this.state.geoCoordMap;
        let mapChinaOption = {
            geoCoordMap: geoCoordMap, // 地理坐标
            data: allPlaceToSH, // 可以切换为SHToAllPlace实现迁徙图方向变化
            direction: 0 // 正方向为1, 反方向为0  从上海到各地为正方向 各地到上海为反方向
        };
        this.setState({ mapChinaOption: mapChinaOption });
    },
    /*
     *
    */
    switchDirection(e) {
        let direction = this.state.mapChinaOption.direction;
        let geoCoordMap = this.state.geoCoordMap;
        let data = [];
        if (direction === 0) {
            data = this.state.SHToAllPlace;
            direction = 1;
        } else {
            data = this.state.allPlaceToSH;
            direction = 0;
        }
        let mapChinaOption = {
            geoCoordMap: geoCoordMap, // 地理坐标
            data: data, // 可以切换为SHToAllPlace实现迁徙图方向变化
            direction: direction // 正方向为1, 反方向为0  从上海到各地为正方向 各地到上海为反方向
        };
        this.setState({ mapChinaOption: mapChinaOption });
    },
    onMapClick(e) {
        if (e.componentSubType === 'effectScatter' && e.name === '上海') {
            this.props.callBack();
        }
    },
    goLink() {
        let self = this;
        // ajax({
        //     url: "/sysConfig/findByKey.do",
        //     dataType:"json",
        //     type: "GET",
        //     success: function(result) {
        //         self.setState({goLink:result.content})
        //     }
        // });
    },
    render() {
        let mapChinaShow = this.state.mapChinaShow;
        let onEvents = {
            'click': this.onMapClick
        };
        let mapChina = '';
        if (mapChinaShow === 'block' && this.state.mapChinaOption) {
            mapChina = <BBDMapChinaGeoLine option={this.state.mapChinaOption} onEvents={onEvents}
                                           style={{ width: '100%', height: '100%' }}/>;
        }
        return (
            <div className="mapChina" style={{ display: mapChinaShow }}>
                {mapChina}
                <a href={this.state.goLink} target="_blank" className="goLink"></a>
                <button className="switchDirection" onClick={this.switchDirection}>切换投资方向</button>
            </div>
        );
    }
});

// 将state植入 到 props
export default MapChina;