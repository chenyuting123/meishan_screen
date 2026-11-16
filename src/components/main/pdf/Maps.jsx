/**
 * Created by hejie on 2017/5/5.
 *  pdf 关联方图谱
 */
import './pdf.scss';
import React, { Component } from 'react';
import Map from '../../Maps/Index';
window.loadedPdf = 'fail';// pdf的雷达图加载是否完成
export default class Radar extends Component {
    render() {
        return (
            <div className="maps-pdf">
                <Map {...this.props}/>
            </div>
        );
    }
}