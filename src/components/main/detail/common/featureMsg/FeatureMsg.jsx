/*
* author:TanJun
* describe:FeatureMsg
* createTime:2018/6/14
* */

import React, { Component } from 'react';
import { LoadingBox } from 'mtui/index';
import style from './FeatureMsg.scss';
import { fieldAnomaly } from 'Utils/formatter';

class FeatureMsg extends Component {
    constructor(props) {
        super(props);
        // 根据后端返回的可以对应不同的参数
        this.state = {
            list: [
                [{ name: '上线时间', key: '', infoList: ['hello world'] }, { name: '平均参考收益率', key: '' }, {
                    name: '总成交额（万',
                    key: ''
                }],
                [{ name: '银行存管', key: '' }, { name: '参考投资期限', key: '' }, { name: '平均借款期限（天）', key: '' }],
                [{ name: '自动投标', key: '' }, { name: '成交量（万元）', key: '' }, { name: '平均满标时间（小时）', key: '' }],
                [{ name: '债券转让', key: '' }, { name: '投资人数（人）', key: '' }, { name: '人均借款金额（万）', key: '' }],
                [{ name: '投标保障', key: '' }, { name: '借款人数（人）', key: '' }, { name: '人均投资金额（万）', key: '' }],
                [{ name: '保障模式', key: '' }, { name: '日资金净流入（万元）', key: '' }, { name: '人均借款次数（次）', key: '' }],
                [{ name: '风险准备金存管', key: '' }, { name: '日待还余额（万元）', key: '' }, { name: '人均投资次数（次）', key: '' }],
                [{
                    name: '融资记录', key: '', infoList: [
                        '15年06月 获得九鼎投资领投，巨人投资、久奕投资和沈晨宁等跟投20000.00万元融资',
                        '16年10月 获得宏商光影领投37500.00万元融资']
                }],
                [{
                    name: '监管协会', key: '', infoList: [
                        '2014年03月07日 加入东莞市互联网金融协会任会长单位单位',
                        '2013年12月01日 加入广东互联网金融协会任副会长单位单位',
                        '2016年03月25日 加入中国互联网金融协会任首批会员单位单位']
                }],
                [{
                    name: '融资记录 ', key: '', infoList: [
                        '东莞市卓诚融资担保有限公司(承保10000万元)',
                        '上海中驰建筑工程有限公司(承保6000万元)',
                        '四川绵竹汇通典当有限责任公司(承保2000万元)'
                    ]
                }]
            ],
            isLoading: false
        };
    }

    render() {
        let { isLoading } = this.state;
        return isLoading ?
            <div className="loading-box">
                <LoadingBox info="数据加载中" type="loading2"/>
            </div>
            :
            <div className={style.container}>
                <p>经营数据</p>
                {this._getList()}
            </div>;
    }

    _getList() {
        let { list } = this.state;
        return list.map(value => <div className={style.listItem}>
            {value.map(({ name, infoList }, index) => <div key={index}>
                <div className={style.title}>{name}</div>
                <ul className={style.content}>{infoList ? infoList.map((value, index) => <li
                    key={index}>{fieldAnomaly(value)}</li>) : fieldAnomaly('')}</ul>

            </div>)}
        </div>);
    }

}

export default FeatureMsg;