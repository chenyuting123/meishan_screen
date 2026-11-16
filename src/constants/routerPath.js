/*
* author:TanJun
* describe:路由常数管理
* createTime:2018/6/20
* */

module.exports = {
    MAIN: 'main',
    OVERALL: 'overall',
    SPECIAL_EVENT: 'specialEvent',
    MISTAKE_RULE: 'mistakeRule',
    ANALYSIS: 'analysis',
    ANALYSIS_DETAIL: '/main/analysis/detailPage',
    ANALYSIS_SEARCH: '/main/analysis/search',
    MONITOR: 'monitor',
    DETAIL: 'detail',
    CIRCLE: 'circle',
    COMMUNITY: 'community', // 关键路径分析
    STOCK: 'stock', // 股权穿透分析
    NATURAL_PERSON: 'person', // 核心自然人分析
    SEEK: 'seek', // 关系探寻分析
    INDUSTRYS: 'industry', // 地域分布分析
    COUNT: 'count', // 关联方统计分析
    REGION: 'region',
    EVENT: 'event',
    USER_CONTENT: 'userContent',
    ATTENTION: 'attention',
    BLACK_LIST: 'blackList',
    REPORT: 'report',
    PROCESS: 'process',
    PRIVATE: 'private',
    TRADING: 'trading',
    NETWORK: 'network',
    EMERGING: 'emerging',
    BLACK: 'black',
    OTHER: 'other',
    DETAIL_ITEM: '/:companyName/:companyId/:industry',
    SEARCH: 'search',
    EVENT_DETAIL: 'eventDetail',
    RELATED_DETAIL: 'relatedDetail',
    PERSON_ID: '/:personId',
    PERSON_NAME: '/:personName',
    TYPE: '/:type',
    COMPANY_NAME: '/:companyName',
    INDUSTRY: '/:industry',
    DEFAULT_DETAIL: '/main/detail',
    SYSTEM_ERROR: 'systemError',
    PDF_RADAR: 'pdfRadar',
    PDF_MAPS: 'pdfMaps',
    CROSS_REGION: 'crossRegion/:industry',
    CROSS_REGION_PATH: '/main/overall/crossRegion',
    DETAIL_PAGE: 'detailPage/:type/:companyName/:companyId',
    SSO_LOGIN: 'ssologin/:tokenId'
};