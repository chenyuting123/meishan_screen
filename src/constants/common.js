// http协议method
export const HttpMethod = {
    GET: 'get',
    POST: 'post'
};
export const Event = {
    SHOW_LOADING: 'SHOW_LOADING',
    HIDE_LOADING: 'HIDE_LOADING',
    SEARCH_COMPANY: 'SEARCH_COMPANY',
    SEARCH_COMPANY_LIST: 'SEARCH_COMPANY_LIST',
    SEARCH_CONDITION: 'SEARCH_CONDITION',
    SEARCH_REDORBLACK: 'SEARCH_REDORBLACK',
    CLICK_FRAME: 'CLICK_FRAME'
};
// 直辖市
export const directlyCity = ['北京市', '天津市', '上海市', '重庆市', '台湾省', '澳门特别行政区', '香港特别行政区'];

// 16类金融数据
export const classIndustry = [
    {
        name: '全部行业',
        value: 'comprehensitive'
    },
    {
        name: '网络借贷',
        value: 'network'
    },
    {
        name: '私募基金',
        value: 'private'
    },
    // {
    //     name: '交易场所',
    //     value: 'trade'
    // },
    {
        name: '融资担保',
        value: 'financing'
    },
    {
        name: '小额贷款',
        value: 'loan'
    },
    {
        name: '新兴金融',
        value: 'other'
    },
    {
        name: '区域性股权市场',
        value: 'other'
    },
    {
        name: '典当',
        value: 'other'
    },
    {
        name: '融资租赁',
        value: 'other'
    },
    {
        name: '商业保理',
        value: 'other'
    },
    {
        name: '地方资产管理公司',
        value: 'other'
    },
    {
        name: '投资公司',
        value: 'other'
    },
    {
        name: '农民专业合作社',
        value: 'other'
    },
    {
        name: '社会众筹机构',
        value: 'other'
    },
    {
        name: '地方交易所',
        value: 'other'
    },
    {
        name: '数字货币',
        value: 'other'
    },
    {
        name: '支付',
        value: 'other'
    }
];

// 词云颜色库
export const WORD_CLOUD_COLORS = ['rgb(73,157,191)', 'rgb(33,139,239)', 'rgb(85,195,254)', 'rgb(24,100,198)', 'rgb(193,228,247)'];

// 风险扫描跳转地址
export const scanMap = {
    emerging: {
        '公司成立时间较短': [1, 0],
        '注册资本变动较大，资金来源存疑': [2, 0],
        '低学历人员招聘比例较高': [2, 2],
        '法定代表人变更频繁': [2, 0],
        '注册资本变更频繁': [2, 0],
        '高管变更频繁': [2, 0],
        '经营范围变更频繁': [2, 0],
        '分支机构数量较多': [1, 5],
        '企业存在“民间借贷”类诉讼文书': [3, 2],
        '企业存在“非法集资类”类诉讼文书': [3, 2],
        '企业存在失信被执行人信息': [3, 5],
        '企业存在被执行人信息': [3, 4],
        '企业受到行政处罚': [3, 0],
        '企业存在经营异常信息': [3, 7],
        '企业存在诉讼文书': [3, 2],
        '对外投资公司数量较多': ['relationpage', 'stock'],
        '公司及关联方短期成立公司数量较多': ['relationpage', 'circle'],
        '企业利益一致行动法人较多': ['relationpage', 'circle'],
        '关联方存在包含非法集资类裁判文书的企业': ['relationpage', 'circle'],
        '关联方中自然人控制企业数量集中': ['relationpage', 'circle'],
        '1度关联方中风险行业企业较多': ['relationpage', 'circle'],
        '1度法人关联方与黑名单企业地址相同': ['relationpage', 'circle'],
        '关联方存在涉“民间借贷”类诉讼企业': ['relationpage', 'circle'],
        '关联方存在失信被执行人企业': ['relationpage', 'circle'],
        '关联方存在吊销企业': ['relationpage', 'circle'],
        '关联方存在受行政处罚企业': ['relationpage', 'circle'],
        '关联方存在经营异常企业': ['relationpage', 'circle'],
        '单个关联自然人最大投资企业数量较多': ['relationpage', 'circle'],
        '单个关联法人最大投资企业数量较多': ['relationpage', 'stock'],
        '关联方中自然人比例较高': ['relationpage', 'count'],
        '关联企业中存在地址相同企业': ['relationpage', 'circle'],
        '关联方中存在黑名单企业': ['relationpage', 'circle'],
        '近三个月内自然人关联节点变动较大': ['relationpage', 'circle'],
        '近三个月内对外投资公司数量变动较大': ['relationpage', 'stock'],
        '近三个月内利益一致行动法人的数量变动较大': ['relationpage', 'circle'],
        '近三个月内3度及3度以下核心自然人（前3）控制节点总数变动较大': ['relationpage', 'circle']

    },
    network: {
        '公司成立时间较短': [2, 0],
        '注册资本变动较大，资金来源存疑': [3, 0],
        '低学历人员招聘比例较高': [3, 2],
        '法定代表人变更频繁': [3, 0],
        '注册资本变更频繁': [3, 0],
        '高管变更频繁': [3, 0],
        '经营范围变更频繁': [3, 0],
        '分支机构数量较多': [2, 5],
        '企业存在“民间借贷”类诉讼文书': [4, 2],
        '企业存在“非法集资类”类诉讼文书': [4, 2],
        '企业存在失信被执行人信息': [4, 5],
        '企业存在被执行人信息': [4, 4],
        '企业受到行政处罚': [4, 0],
        '企业存在经营异常信息': [4, 7],
        '企业存在诉讼文书': [4, 2],
        '对外投资公司数量较多': ['relationpage', 'stock'],
        '公司及关联方短期成立公司数量较多': ['relationpage', 'circle'],
        '企业利益一致行动法人较多': ['relationpage', 'circle'],
        '关联方存在包含非法集资类裁判文书的企业': ['relationpage', 'circle'],
        '关联方中自然人控制企业数量集中': ['relationpage', 'circle'],
        '1度关联方中风险行业企业较多': ['relationpage', 'circle'],
        '1度法人关联方与黑名单企业地址相同': ['relationpage', 'circle'],
        '关联方存在涉“民间借贷”类诉讼企业': ['relationpage', 'circle'],
        '关联方存在失信被执行人企业': ['relationpage', 'circle'],
        '关联方存在吊销企业': ['relationpage', 'circle'],
        '关联方存在受行政处罚企业': ['relationpage', 'circle'],
        '关联方存在经营异常企业': ['relationpage', 'circle'],
        '单个关联自然人最大投资企业数量较多': ['relationpage', 'circle'],
        '单个关联法人最大投资企业数量较多': ['relationpage', 'stock'],
        '关联方中自然人比例较高': ['relationpage', 'count'],
        '关联企业中存在地址相同企业': ['relationpage', 'circle'],
        '关联方中存在黑名单企业': ['relationpage', 'circle'],
        '近三个月内自然人关联节点变动较大': ['relationpage', 'circle'],
        '近三个月内对外投资公司数量变动较大': ['relationpage', 'stock'],
        '近三个月内利益一致行动法人的数量变动较大': ['relationpage', 'circle'],
        '近三个月内3度及3度以下核心自然人（前3）控制节点总数变动较大': ['relationpage', 'circle']
    },
    private: {
        '公司成立时间较短': [2, 0],
        '注册资本变动较大，资金来源存疑': [3, 0],
        '低学历人员招聘比例较高': [3, 2],
        '法定代表人变更频繁': [3, 0],
        '注册资本变更频繁': [3, 0],
        '高管变更频繁': [3, 0],
        '经营范围变更频繁': [3, 0],
        '分支机构数量较多': [2, 5],
        '企业存在“民间借贷”类诉讼文书': [4, 2],
        '企业存在“非法集资类”类诉讼文书': [4, 2],
        '企业存在失信被执行人信息': [4, 5],
        '企业存在被执行人信息': [4, 4],
        '企业受到行政处罚': [4, 0],
        '企业存在经营异常信息': [4, 7],
        '企业存在诉讼文书': [4, 2],
        '对外投资公司数量较多': ['relationpage', 'stock'],
        '公司及关联方短期成立公司数量较多': ['relationpage', 'circle'],
        '企业利益一致行动法人较多': ['relationpage', 'circle'],
        '关联方存在包含非法集资类裁判文书的企业': ['relationpage', 'circle'],
        '关联方中自然人控制企业数量集中': ['relationpage', 'circle'],
        '1度关联方中风险行业企业较多': ['relationpage', 'circle'],
        '1度法人关联方与黑名单企业地址相同': ['relationpage', 'circle'],
        '关联方存在涉“民间借贷”类诉讼企业': ['relationpage', 'circle'],
        '关联方存在失信被执行人企业': ['relationpage', 'circle'],
        '关联方存在吊销企业': ['relationpage', 'circle'],
        '关联方存在受行政处罚企业': ['relationpage', 'circle'],
        '关联方存在经营异常企业': ['relationpage', 'circle'],
        '单个关联自然人最大投资企业数量较多': ['relationpage', 'circle'],
        '单个关联法人最大投资企业数量较多': ['relationpage', 'stock'],
        '关联方中自然人比例较高': ['relationpage', 'count'],
        '关联企业中存在地址相同企业': ['relationpage', 'circle'],
        '关联方中存在黑名单企业': ['relationpage', 'circle'],
        '近三个月内自然人关联节点变动较大': ['relationpage', 'circle'],
        '近三个月内对外投资公司数量变动较大': ['relationpage', 'stock'],
        '近三个月内利益一致行动法人的数量变动较大': ['relationpage', 'circle'],
        '近三个月内3度及3度以下核心自然人（前3）控制节点总数变动较大': ['relationpage', 'circle']
    },
    trading: {
        '公司成立时间较短': [2, 0],
        '注册资本变动较大，资金来源存疑': [3, 0],
        '低学历人员招聘比例较高': [3, 2],
        '法定代表人变更频繁': [3, 0],
        '注册资本变更频繁': [3, 0],
        '高管变更频繁': [3, 0],
        '经营范围变更频繁': [3, 0],
        '分支机构数量较多': [2, 5],
        '企业存在“民间借贷”类诉讼文书': [4, 2],
        '企业存在“非法集资类”类诉讼文书': [4, 2],
        '企业存在失信被执行人信息': [4, 5],
        '企业存在被执行人信息': [4, 4],
        '企业受到行政处罚': [4, 0],
        '企业存在经营异常信息': [4, 7],
        '企业存在诉讼文书': [4, 2],
        '对外投资公司数量较多': ['relationpage', 'stock'],
        '公司及关联方短期成立公司数量较多': ['relationpage', 'circle'],
        '企业利益一致行动法人较多': ['relationpage', 'circle'],
        '关联方存在包含非法集资类裁判文书的企业': ['relationpage', 'circle'],
        '关联方中自然人控制企业数量集中': ['relationpage', 'circle'],
        '1度关联方中风险行业企业较多': ['relationpage', 'circle'],
        '1度法人关联方与黑名单企业地址相同': ['relationpage', 'circle'],
        '关联方存在涉“民间借贷”类诉讼企业': ['relationpage', 'circle'],
        '关联方存在失信被执行人企业': ['relationpage', 'circle'],
        '关联方存在吊销企业': ['relationpage', 'circle'],
        '关联方存在受行政处罚企业': ['relationpage', 'circle'],
        '关联方存在经营异常企业': ['relationpage', 'circle'],
        '单个关联自然人最大投资企业数量较多': ['relationpage', 'circle'],
        '单个关联法人最大投资企业数量较多': ['relationpage', 'stock'],
        '关联方中自然人比例较高': ['relationpage', 'count'],
        '关联企业中存在地址相同企业': ['relationpage', 'circle'],
        '关联方中存在黑名单企业': ['relationpage', 'circle'],
        '近三个月内自然人关联节点变动较大': ['relationpage', 'circle'],
        '近三个月内对外投资公司数量变动较大': ['relationpage', 'stock'],
        '近三个月内利益一致行动法人的数量变动较大': ['relationpage', 'circle'],
        '近三个月内3度及3度以下核心自然人（前3）控制节点总数变动较大': ['relationpage', 'circle']
    }
};

/*
* 后台接口
* */
export const Services = {
    /*
    * 主页地图
    * */
    HOME_LATITUDE: 'longi/Latitude.do',     // 查询经度
    HOME_MAP_COUNTRY: 'mapCountry.do',      // 查询全国地图散点数据
    HOME_MAP_PROVINCE: 'mapProvince.do',    // 查询省份地图散点数据
    HOME_MAP_CITY: 'mapCity.do',            // 查询城市地图散点数纬据
    HOME_MAP_AREA: 'mapArea.do',            // 查询区县地图散点数据
    HOME_MAP_INVESTMENT: 'findInvestmentFlowByInvestedProvince.do', // 查询省份地图散点数据
    /*
    *
    * */
    DETAIL_YU_QING_COMPANYID: 'getYuqingContentByCompanyId', // 根据公司id查询舆情
    DETAIL_YU_QING_COMPANYID_RELATE: 'getYuqingContentByCompanyIdAndRelate', // 根据公司id和相关公司人物查询舆情
    /*
    * 关联方信息
    * */
    RELATION_INFO: 'getRelationInfo.do', // 查询企业关联信息
    RELATION_NODE_AND_LINK: 'getRelationNodeAndLink.do', // 查询企业的关联节点和关联关系
    /*
     * 企业信息
    * */
    COMPANY_DETAIL_ADD_FOCUS: 'add/focus.do', // 加入监控
    COMPANY_DETAIL_ADD_DEALINFO: 'add/dealInfos.do', // 添加处理状态
    COMPANY_DETAIL_ADD_BLACK_LIST: 'add/blacklist.do', // 加入黑名单
    COMPANY_DETAIL_RIGHT_RELATION: 'getRightRelationOfDegree.do', // 企业详情页面右侧关联方信息POST getRightRelation.do(原接口)
    COUNT_BOTTOM_RELATION_INFO: 'countBottomRelationInfo.do', // 企业详情页面，标签个数
    COMPANY_DETAIL_SCAN: 'getScanByCompanyId.do', // 根据企业ID查询风险提示
    COMPANY_DETAIL_RADAR: 'getRadarByCompanyId.do', // 根据企业ID查询易燃指数雷达图
    COMPANY_DETAIL_SORT: 'getSortInfoByCompanyId.do', // 根据企业ID易燃指数时序图
    COMPANY_DETAIL_TIME_SQUE: 'getTimeSque.do', // 时序图行业平均数和行业中位数
    COMPANY_DETAIL_BOTTOM_RELATION: 'queryBottomRelationInfo.do', // 查询企业的关联节点和关联关系
    COMPANY_DETAIL_CROSS_REGION: 'queryCrossRegionCompanyDetail.do', // 跨域风险企业查询分支机构、投资子公司
    COMPANY_DETAIL_CROSS_REGION_COUNT: 'queryCrossRegionCompanyDetailTypeCount.do', // 跨域风险企业查询分支机构、投资子公司
    COMPANY_DETAIL_ABSTRACT: 'getCompanyAbstract.do', // 查询企业摘要信息
    COMPANY_DETAIL_UPDATE_INFO: 'updateCompanyInfo.do', // 更正企业信息
    COMPANY_DETAIL_CHECK_FOCUS: 'check/focus.do', // 检查当前用户是否已关注某企业
    COMPANY_DETAIL_GET_APPLYTIME: 'getApplyTime.do', // 查询研报申请时间
    /*
    * 基本信息
    * */
    DETAIL_BASE_DATA_OVERVIEW: 'getBaseDataOverview.do', // 查询基本信息概览
    DETAIL_BASE_DATA_FZJGEXTEND: 'qyxxFzjgExtend.do', // 查询分支机构信息
    DETAIL_BASE_DATA_JBXX: 'qyxxJbxx.do', // 查询企业的关联节点和关联关系
    DETAIL_BASE_DATA_OVERSEASINV: 'qyxxOverseasinv.do', // 查询境外投资信息
    /*
    * 特征信息
    * */
    FEATURE_EXCHANGE: 'bbdQyxgExchange.do', // 查询交易场所特征信息
    FEATURE_P2P: 'getP2PFeature.do', // 查询网络借贷特征信息
    FEATURE_PRIVATE_FUND: 'getPrivateFundFeature.do', // 查询私募基金特征信息
    /*
    * 经营信息
    * */
    DETAIL_MANAGE_BIDINVITING: 'qyxgBidinviting.do', // 查询招标数据信息
    DETAIL_MANAGE_BIDWINNER: 'qyxgBidwinner.do', // 查询中标数据信息
    DETAIL_MANAGE_RECRUIT: 'qyxgRecruit.do', // 查询招聘数据信息
    DETAIL_MANAGE_XZCF: 'qyxgXzcf.do', // 查询行政处罚数据信息
    DETAIL_MANAGE_BGXX: 'qyxxBgxx.do', // 查询工商变更数据信息
    DETAIL_MANAGE_DOMAIN_NAME: 'qyxxDomainNameWebsiteInfo.do', // 查询域名备案信息
    DETAIL_MANAGE_YUQING: 'qyxgYuqing.do', // 查询舆情
    DETAIL_MANAGE_RECRUIT_KPI: 'getRecruitKPI.do', // 查询招聘数据KPI信息
    DETAIL_MANAGE_NB: 'qyxxNb.do', // 查询年报信息
    /*
    * 信用信息
    * */
    CREDIT_DISHONESTY: 'qyxgDishonesty.do', // 查询失信被执行人数据信息/
    CREDIT_JYYC: 'qyxgJyyc.do', // 查询经营异常数据信息/
    CREDIT_KTGG: 'qyxgKtgg.do', // 查询开庭公告数据信息/
    CREDIT_QYQSINNER: 'qyxgQyqsInner.do', // 查询欠税名单数据信息/
    CREDIT_RMFYGG: 'qyxgRmfygg.do', // 查询法院公告数据信息/
    CREDIT_SFPMTAOBAO: 'qyxgSfpmTaobao.do', // 查询司法拍卖数据信息/
    CREDIT_ZGCPWSW: 'qyxgZgcpwsw.do', // 查询裁判文书数据信息/
    CREDIT_ZHIXING: 'qyxgZhixing.do', // 查询被执行人数据信息/
    CREDIT_LIQUIDATION: 'qyxxLiquidation.do', // 查询清算数据信息/
    CREDIT_MORDETAIL: 'qyxxMordetail.do', // 查询动产抵押数据信息/
    CREDIT_SHARESIMPAWN: 'qyxxSharesimpawn.do', // 查询股权出质数据信息/
    /*
    * 舆情信息
    * */
    DETAIL_INVOKE_DATA: 'invokeData', // 第三方接口
    /*
    * 备注
    * */
    DETAIL_DELETE_REMARK: 'deleteRemark', // 删除备注
    DETAIL_FIND_REMARK_LIST: 'findRemarkList', // 查询备注
    DETAIL_SAVE_REMARK: 'saveRemark', // 保存备注
    /*
    * 个人中心
    * */
    PERSONAL_CENTER_USER_PLUS: 'queryUserExpirationAndSurplus.do', // 用户到期与剩余次数统计
    PERSONAL_CENTER_USER_NUM: 'reportDownloadNumber.do', // 研报统计
    PERSONAL_CENTER_BULLETIN_NUM: 'bulletinDownloadNumber.do', // 简报统计
    PERSONAL_CENTER_BLACK_COUNT: 'queryMyBlackCount.do', // 黑名单企业-统计
    PERSONAL_CENTER_QUERY_STATUS: 'queryDealStatus.do', // 我的进程--处置状态Count
    PERSONAL_CENTER_MY_BLACKLIST: 'queryMyBlackList.do', // 黑名单列表
    PERSONAL_CENTER_MY_BLACKLIST_COUNT: 'my/blacklistCount.do', // 黑名单下载统计
    PERSONAL_CENTER_CANCEL_BLACKLIST: 'cancel/blacklist.do', // 移除黑名单
    PERSONAL_CENTER_CANCEL_FOCUS: 'cancel/focus.do', // 移除黑名单
    PERSONAL_CENTER_MY_REPORTLIST: 'queryReportList.do', // 报告列表
    PERSONAL_CENTER_MY_DEALLIST: 'queryDealList.do', // 我的进程
    PERSONAL_CENTER_MY_DEALLIST_DOWNLOAD: 'importMyDeal.do', // 我的进程导出
    PERSONAL_CENTER_LOOK_BLACKLIST: 'look/cancel/blacklist.do', // 查看被别人移除的黑名单
    PERSONAL_CENTER_CHECK_ISBLACK: 'check/is/black.do', // 判断一个企业是否为黑名单企业
    PERSONAL_CENTER_BLACK_UNLOOK: 'look/querylookOverCancelCount.do', // 我的黑名单未查看统计
    PERSONAL_CENTER_PROCESS_UNLOOK: 'look/queryDealOverCancelCount.do', // 我的进程未查看统计
    PERSONAL_CENTER_PROCESS_CHANGE_OVERCANCEL: 'look/cancel/dealOverCancel.do', // 修改进程查看状态
    PERSONAL_CENTER_MAKERESEARCH: 'makeResearch.do', // 根据客户申请产生研报申请信息
    PERSONAL_CENTER_GETSEARCHINFO: 'getResearchInfo.do', // 根据客户申请产生研报申请信息
    PERSONAL_CENTER_CHEACK_FILETYPE: 'checkFileType.do', // 下载时判断用户是否已上传文件
    /*
    * 首页-综合监测
    * */
    INDEX_RISK_COUNT: 'findRiskCount.do', // 风险分类监测
    INDEX_GROUP_REGION: 'findCompanyCountGroupByRegion.do', // 查询企业地区分布
    INDEX_HIGH_RISK_INDUSTRY: 'findHighRiskCountGroupByIndustry.do', // 查询高危企业行业分布
    INDEX_CROSS_REGION_TREND: 'findCrossRegionTrend.do', // 查询跨区域企业数趋势
    INDEX_AREA_RISK_LEVEL: 'findCountGroupByRiskLevel.do', // 查询各个风险等级对应数量
    /*
    * 首页-网络借贷
    * */
    INDEX_NET_AVG_LOAN_DATE: 'getNetAvgLoanDate.do', // 网络借贷平均贷款期限
    INDEX_NET_AVG_RETURN_RATE: 'netAvgReturnRate.do', // 网络借贷平均收益率
    /*
    * 首页-私募基金
    * */
    INDEX_PRIVATE_FUND_COMPANY_TYPE: 'getPrivateFundCompanyType.do', // 私募基金企业性质
    INDEX_PRIVATE_FUND_EMPLOYEE_SCALE: 'getPrivateFundEmployeeScale.do', // 私募基金人员规模
    INDEX_PRIVATE_FUND_PRODUCT_NUM: 'getPrivateFundProductNum.do', // 私募基金产品数量
    INDEX_PRIVATE_FUND_PRODUCT_TYPE: 'getPrivateFundProductType.do', // 私募基金基金类型
    /*
    * 首页-交易场所
    * */
    INDEX_TRADE_PLACE_SORT: 'getHighCompanySort.do', // 区域高危企业时序图(分行业)
    INDEX_TRADE_PLACE_TRADE_TYPE: 'getTradePlaceTradeType.do', // 交易场所数量 交易场所-交易品种
    INDEX_TRADE_PLACE_TYPE: 'getTradePlaceType.do', // 交易场所权益现货占比 交易场所-交易场所类型
    /*
   * 企业违规预警
   * */
    SPECIAL_EVENT_FINDBYCOMPANY: 'findByCompan.do', // 各行业违规分布
    SPECIAL_EVENT_FINDBYADDRESS: 'findByAddress.do', // 违规企业地区分布
    SPECIAL_EVENT_FINDBYTREND: 'findByTrend.do', // 违规企业数量走势
    SPECIAL_EVENT_TYPE_COUNTS: 'findTypeCounts.do', // 违规类型集中度
    SPECIAL_EVENT_COMPANY_TOTAL: 'getOutOfLineCounts.do', // 违规企业总数
    SPECIAL_EVENT_TABLELIST: 'findByPage.do', // 违规列表
    /*
   * 特征事件预警
   * */
    MISTAKE_RULE_PROPERTY: 'findByCompanProperty.do', // 各行业违规分布
    MISTAKE_RULE_ADDRESS_PROPERTY: 'findByAddressProperty.do', // 各行业违规分布
    MISTAKE_RULE_TYPE_COUNTS: 'findTypeCountsProperty.do', // 特征事件集中度
    MISTAKE_RULE__COMPANY_TOTAL: 'getOutOfLineCounts.do', // 特征事件企业总数
    MISTAKE_RULE_TABLELIST: 'findByPage.do', // 特征事件列表
    MONITOR_HOME_YQ: 'yq.do', // 舆情
    /*
    *重点企业实时监控monitorHome
    * */
    MONITOR_HOME_INDEXCOUNT: 'riskMonitorIndexCount.do', // 顶部数据统计
    MONITOR_HOME_SEARCH_DETAIL: 'queryCompanyDetail.do', // 搜索添加
    MONITOR_HOME_ADD_RISK: 'addRiskMonitor.do', // 一键加入监控
    MONITOR_HOME_GETMONLIST: 'getMonitorList.do', // 监控列表显示
    MONITOR_HOME_PUSHTOP: 'pushTop.do', // 顶置
    MONITOR_HOME_cancelMONITOR: 'cancelMonitor.do', // 取消监控
    MONITOR_HOME_DOWNLOAD_MODEL: 'testDownload', // 下载批量导入模板
    MONITOR_HOME_IMPORT_EXCEL: 'excelImport.do', // 批量导入
    // 推送设置
    MONITOR_HOME_SELECTALL: 'selectAll.do', // 获取手机，邮箱列表
    MONITOR_HOME_DELETED: 'deleteId.do', // 删除
    MONITOR_HOME_SETUP: 'setup.do', // 推送设置
    MONITOR_HOME_SELECT: 'select.do', // 显示判断按钮状态
    MONITOR_HOME_SETUOBUTTON: 'setupButton.do', // 邮箱-手机 推送设置按钮
    MONITOR_HOME_ADD: 'add.do', // 邮箱-手机 新增
    /*
    * 关联方图谱相关接口
    * */
    RELATION_CIRCLE: 'circle.do', // 关联风险分析
    RELATION_COMMUNITY: 'community.do', // 关键链路
    RELATION_COUNT: 'count.do', // 交易场所权益现货占比 交易场所-交易场所类型
    RELATION_REGION: 'region.do', // 地域分布分析
    RELATION_SEEK: 'seek.do', // 关系探寻
    RELATION_STOCK: 'stock.do', // 股权穿透分析
    RELATION_NATURAL_PERSON: 'people.do', // 自然人列表
    RELATION_NATURAL_PERSON_INVERST: 'people/inverst.do', // 自然人投资任职

    /*
    * 企业画像-分析统计 相关接口
    * */
    ANALYZE_KEYREL_TOP5: 'keyreltop5.do', // 关键自然人与法人TOP5
    ANALYZE_RELATION_COUNT: 'relationcount.do', // 关联方及关联关系统计
    ANALYZE_RELATION_TREND: 'relationtrend.do', // 关联方(法人)趋势统计
    ANALYZE_INDUSTRY_TREND: 'industrytrend.do', // 行业相关统计-行业分布
    ANALYZE_INDUSTRY_DIC: 'industrydic.do', // 获取行业字典

    /*
    * 意见反馈
    * */
    FEEDBACK: 'add.do', // 添加反馈信息

    /*
    * 搜索
    * */
    SEARCH_COMPANY: 'searchCompany.do', // 搜索公司信息
    SEARCH_COMPANY_COUNTY: 'companycounty.do', // 省市区搜索
    SEARCH_RELATION: 'relation.do', // 关联方关系探寻企业搜索

    /*
    * 导出
    * */
    EXPORT_BRIEF: 'export/brief.do'
};

export const MapContrast = {};