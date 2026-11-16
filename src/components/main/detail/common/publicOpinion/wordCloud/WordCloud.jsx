/**
 * Created by fuzhihong on 2017/7/7.
 * WordCloud 热词词云
 */
import './wordCloud.scss';
import React, { Component } from 'react';
import { WORD_CLOUD_COLORS } from 'Constants/common';
import { random } from 'Utils/util';
import { isEmpty } from 'Utils/util';
import { LoadingBox } from 'mtui/index';
import d3 from 'd3';
import { Services } from 'Constants/common';
import { detailPageAPI } from 'Services/detail';

const { DETAIL_INVOKE_DATA } = Services;

let cloud = require('Utils/d3/d3.layout.cloud');
const CloudScale = 6.5;

export default class WordCloud extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listData: [], // 数据源载体
            originListData: [], // 未做处理的的数据源
            listLoading: '数据加载中...',
            loadingFlag: null
        };
    }

    /**
     * 获取数据
     */
    getData() {
        detailPageAPI({
            type: DETAIL_INVOKE_DATA,
            data: {
                apiId: 'dataapi_hongjing_yQrc',
                qyId: this.props.params.companyId
            }
        }).then(({ data }) => {
            let content = data.data;
            this.setState({
                listLoading: '暂无相关数据。',
                loadingFlag: true
            }, () => {
                let { HotWords_content } = content;
                if (!isEmpty(content) && !isEmpty(HotWords_content)) {
                    let totalCount = HotWords_content.reduce((total, item) => total + item.HotWords_count, 0); // 获取热词总数
                    let handleArr = HotWords_content.map((item, index) => {
                        const handledSize = Math.ceil(item.HotWords_count / totalCount * 50);
                        return Object.assign({}, item, { HotWords_count: handledSize > 10 ? 10 : handledSize < 3 ? 3 : handledSize });
                    }
                    ); // 处理每条数据热词占比
                    this.setState({
                        listData: handleArr,
                        originListData: HotWords_content.slice(0, 10)
                    }, () => {
                        this.draw(this.state.listData);
                    });
                }
            });
        });
    }

    /**
     * 画热词图表
     * @param chartData
     */
    draw(chartData) {
        let chartOffset = document.getElementById('wordCloudChart');
        let fill = d3.scale.category20();
        let layout = cloud()
            .size([chartOffset.offsetWidth, chartOffset.offsetHeight])
            .words(chartData.map(function (d) {
                return {
                    text: d.HotWords,
                    size: CloudScale * d.HotWords_count,
                    color: WORD_CLOUD_COLORS[Math.abs(random() % 5)]
                };
            }))
            .padding(5)
            .rotate(function () {
                return 0;
            }) // 修改词条的旋转角度在这里   原始(只有横竖)：~~(Math.random() * 2) * 90
            .font('Impact')
            .fontSize(function (d) {
                return d.size;
            })
            .on('end', endDraw);
        layout.start();

        function endDraw(words) {
            d3.select('#wordCloudChart').append('svg')
                .attr('width', layout.size()[0])
                .attr('height', layout.size()[1])
                .append('g')
                .attr('transform', 'translate(' + layout.size()[0] / 2 + ',' + layout.size()[1] / 2 + ')')
                .selectAll('text')
                .data(words)
                .enter().append('text')
                .style('font-size', function (d) {
                    return d.size + 'px';
                })
                .style('font-family', 'Impact')
                .style('fill', function (d, i) {
                    return d.color;
                })
                .attr('text-anchor', 'middle')
                .attr('transform', function (d) {
                    return 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')';
                })
                .text(function (d) {
                    return d.text;
                });
        }
    }

    componentDidMount() {
        this.getData();
    }

    render() {
        let { listData, loadingFlag, listLoading, originListData } = this.state;
        return (
            <div className="word-cloud clearfix">
                <div id="wordCloudChart">
                </div>
                <div className="wordCloudTable textC">
                    <h3 className="wordCloudTable-title">事件高频词</h3>
                    <ul className="wordCloudTable-content-box">
                        {
                            loadingFlag ?
                                originListData.map((item, index) =>
                                    <li key={index} className="wordCloudTable-content-item">
                                        <div className="item-key">{item.HotWords}</div>
                                        <div className="item-value">{item.HotWords_count}次</div>
                                    </li>
                                ) : <LoadingBox type="loading2"/>
                        }
                    </ul>
                </div>
                <div className="v-center"
                     style={{
                         width: '100%',
                         height: '100%',
                         display: isEmpty(listData) ? 'table' : 'none',
                         position: 'absolute',
                         zIndex: 2,
                         backgroundColor: '#fff'
                     }}>
                    {
                        loadingFlag ? <span>{this.state.listLoading}</span> : <LoadingBox type="loading2"/>

                    }
                </div>
            </div>
        );
    }
}
