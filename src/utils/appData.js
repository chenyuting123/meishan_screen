/*
* author:TanJun
* describe:
* createTime:2018/7/14
* */
import { appDataType, higgschartsType, NodeCategory } from 'Constants/higgscharts';

const data = {};

function getCommonAnalysis(nodes = [], names = {}) {
    var { normal = '关联方总数', risk = '高危预警', black = '黑名单', revoke = '注吊销' } = names;    
    var { NORMAL, RISK, BLACK, REVOKE } = NodeCategory;

    var normalNum = nodes.filter(({ category, slight = false }) => category === NORMAL.value && slight === false ).length;
    var riskNum = nodes.filter(({ category, slight = false }) => category === RISK.value && slight === false).length;
    var blackNum = nodes.filter(({ category, slight = false }) => category === BLACK.value && slight === false).length;
    var revokeNum = nodes.filter(({ category, slight = false }) => category === REVOKE.value && slight === false).length;

    return [{ 
        num: normalNum, color: NORMAL.color, name: normal 
    }, { 
        num: riskNum, color: RISK.color, name: risk
    }, { 
        num: blackNum, color: BLACK.color, name: black 
    }, { 
        num: revokeNum, color: REVOKE.color, name: revoke 
    }];
}

function getIndustryAnalysis(nodes = [], circles = []) {
    const OTHER = '其他';
    var analysis = {};

    circles.forEach(({ text }) => analysis[text] = []);

    nodes.forEach((node) => {
        var { data, slight } = node;
        if (!slight) {
            var { province, city } = data;

            if (analysis[province]) {
                analysis[province].push(node);
            } else {
                if (!analysis[OTHER]) {
                    analysis[OTHER] = [];
                }
                analysis[OTHER].push(node);
            }
        }
    });
    // 从多到少排序
    var analysisOrder = Object.entries(analysis).sort((first, second) => {
        return second[1].length - first[1].length;
    });

    return analysisOrder.map(([province, nodes]) => {
        var num = nodes.filter(({ slight }) => !slight).length;

        return { 
            num, color: NodeCategory.NORMAL.color, name: province
        };
    });
}

class appData {
    constructor(props) {

    }

    static setAppData({ type, info }) {
        data[type] = info;
    }

    static getAppData({ type }) {
        return data[type];
    }

    static getNodeInfo({ type }) {
        let { nodes = [] } = data[type];
        let total = nodes.length;
        let company = nodes.filter(({ data }) => !data.human).length;
        let person = nodes.filter(({ data }) => data.human).length;
        let slightNodes = nodes.filter(({ slight, category, select }) => select && category !== 'person');

        return { total, company, person, nodes, slightNodes };
    }

    static getAnalysisResult(chartType) {
        var { CIRCLE, COMMUNITY, STOCK, SEEK, INDUSTRY, REGION, EVENT } = higgschartsType;
        var { nodes = [], circles = [] } = data[appDataType.NODE] || {};
        var analysisResult;
        
        switch (chartType) {
            case CIRCLE:
            case COMMUNITY:
            case STOCK:
            case SEEK:
                analysisResult = getCommonAnalysis(nodes);
                break;
            case REGION:
                break;
            case EVENT:
                break;
            case INDUSTRY:
                analysisResult = getIndustryAnalysis(nodes, circles);
                break;
        }

        return analysisResult;
    }
}

export default appData;