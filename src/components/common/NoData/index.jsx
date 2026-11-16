import './index.scss';
import React from 'react';
import noDataLogo from 'Images/other/empty.png';
import { LoadingBox } from 'mtui/index';

class NoData extends React.Component {
    render() {
        const { style, fontColor, isNoData } = this.props;
        return <div className="c-no-data" style={style}>
            {isNoData
                ? <div>
                    <img src={noDataLogo}/>
                    <p style={{ color: fontColor }}>暂无数据!</p>
                </div>
                : <LoadingBox info="数据载入中" type="loading2"/>
            }
        </div>;
    }
}

export default NoData;
