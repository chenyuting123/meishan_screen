/*
* author:TanJun
* describe:
* createTime:2018/7/9
* */

export const higgschartsType = {
    CIRCLE: 'circle', // 关联风险分析
    COMMUNITY: 'community', // 关键路径分析
    STOCK: 'stock', // 股权穿透分析
    NATURAL: 'person', // 核心自然人分析
    SEEK: 'seek', // 关系探寻分析
    INDUSTRY: 'industry', // 地域分布分析
    COUNT: 'count', // 关联方统计分析
    REGION: 'region',
    EVENT: 'event'
};

export const appDataType = {
    NODE: 'nodeObj'
};

export const NodeCategory = {
    NORMAL: {               // 正常
        value: 'normal',
        color: '#14ADFF'
    },
    RISK: {                 // 风险企业
        value: 'risk',
        color: '#F76D43'
    },
    BLACK: {                // 黑名单
        value: 'black',
        color: '#535353'
    },
    REVOKE: {               // 注吊销
        value: 'revoke',
        color: '#BFBFBF'
    }
};