/*
* author:TanJun
* describe:FunctionBtn
* createTime:2018/7/10
* */
import './index.scss';
import React, { Component } from 'react';
import { Icon, Button } from 'antd';
import AnalysisResult from './analysisResult';
import Download from 'Libs/download';
import appData from 'Utils/appData';
import { appDataType } from 'Constants/higgscharts';

const { NODE } = appDataType;
import { browserHistory } from 'react-router';
import { DEFAULT_DETAIL, BLACK, ANALYSIS_DETAIL } from 'RouterPath';

class FunctionBtn extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            isShowList: false,
            analysisResult: appData.getAnalysisResult(props.type)
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isUpdate) {
            this.setState({
                analysisResult: appData.getAnalysisResult(nextProps.type)
            });
        }
    }

    render() {
        let { isShowList, analysisResult } = this.state;
        let { hc, companyName, type, companyId } = this.props;

        return (
            <div className="c-function-btn">
                <div className="u-btn green c-function-btn__download" onClick={() => {
                    let image = hc.toDataURL();
                    Download(image, `${companyName + type}_${new Date().getTime()}`, 'image/png');
                }}>
                    <Icon type="download"/><span>下载图片</span>
                </div>
                <ul className="c-function-btn__list" style={isShowList ? { height: '660px', overflowY: 'auto' } : { height: '40px' }}>
                    <li onClick={() => {
                        this.setState({ isShowList: !isShowList });
                    }}>
                        分析结果 <Icon type={`${isShowList ? 'down' : 'up'}-circle`} />
                    </li>
                    {/* 分析结果图标列表 */}
                    {
                        analysisResult && analysisResult.map((item, index) => <AnalysisResult key={index} {...item} />)
                    }
                </ul>
                <div className="c-function-btn__status">
                    <Button onClick={() => {
                        let pathTo = `${ANALYSIS_DETAIL}/${type}/${companyName}/${companyId}`;
                        browserHistory.push(pathTo);
                        window.location.reload();
                    }}>
                        <Icon type="sync" />
                    </Button>
                    <div>
                        <Button className="none" onClick={() => {
                            this.zoomChange('in');
                        }}><Icon type="plus"/></Button>
                        <div></div>
                        <Button className="none" onClick={() => {
                            this.zoomChange('out');
                        }}><Icon type="minus"/></Button>
                    </div>
                </div>
            </div>
        );
    }

    zoomChange(type) {
        let { hc } = this.props;
        const MIN = 0.2, MAX = 5;
        let event = appData.getAppData({ type: 'zoom' });
        let { scaleX } = event;
        let scale = Math.max(scaleX - 0.5, MIN);
        if (type === 'in') {
            scale = Math.min(scaleX + 0.5, MAX);
        }
        hc.trigger('zoom', { ...event, scaleX: scale, scaleY: scale });
    }
}

export default FunctionBtn;