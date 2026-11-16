import { HttpMethod, Services } from '../constants/common';
import HiggsPromise from 'Utils/higgsPromise';

const dstr = '/api/v1.0/index/';

const { HOME_LATITUDE, HOME_MAP_CITY, HOME_MAP_COUNTRY, HOME_MAP_PROVINCE } = Services;

/* 总体分析
 * GET请求
*/
export function findIndexTotalInfo(data) {
    return HiggsPromise({
        url: '/api/v1.0/index/findIndexTotalInfo.do',
        type: HttpMethod.GET,
        data: data
    });

}

/* 新金融发展趋势
 * GET请求
*/
export function findNewEcoDevelopTrend(data) {
    return HiggsPromise({
        url: '/api/v1.0/index/findNewEcoDevelopTrend.do',
        type: HttpMethod.GET,
        data: data
    });
}

/* 查询全国新金融风险指数
 * GET请求
*/
export function getRiskTrendLine(data) {
    return HiggsPromise({
        url: '/api/v1.0/index/findCountryRiskTrend.do',
        type: HttpMethod.GET,
        data: data
    });
}

/* 查询当地和全国风险指数
 * GET请求
*/
export function findLocalRiskTrend(data) {
    return HiggsPromise({
        url: '/api/v1.0/index/findLocalRiskTrend.do',
        type: HttpMethod.GET,
        data: data
    });
}

/* 查询跨区域企业数趋势
 * GET请求
*/
export function getFindCrossRegionTrend(data) {
    return HiggsPromise({
        url: '/api/v1.0/index/findCrossRegionTrend.do',
        type: HttpMethod.GET,
        data: data
    });
}

/* 首页地图借口调用
 * GET请求
*/
export function indexMap({ data, type }) {
    let info = {
        type: HttpMethod.GET,
        data: data
    };
    info = { ...info, url: dstr + type };
    return HiggsPromise(info);
}

/* 风险分类监测
 * GET请求
*/
export function findRiskCount() {
    return HiggsPromise({
        url: '/api/v1.0/index/findRiskCount.do',
        type: HttpMethod.GET
    });
}

/* 企业地区分布
 * GET请求
*/
export function findCompanyCountGroupByRegion(data) {
    return HiggsPromise({
        url: '/api/v1.0/index/findCompanyCountGroupByRegion.do',
        type: HttpMethod.GET,
        data: data
    });
}

/* 查询高危企业行业分布
 * GET请求
*/
export function findHighRiskCountGroupByIndustry(data) {
    return HiggsPromise({
        url: '/api/v1.0/index/findHighRiskCountGroupByIndustry.do',
        type: HttpMethod.GET,
        data: data
    });
}

/* 查询高危企业列表
 * GET请求
*/
export function getList(data) {
    return HiggsPromise({
        url: '/api/v1.0/index/query/high/company.do',
        type: HttpMethod.GET,
        data: data
    });
}

/* 查询黑名单列表
 * GET请求
*/
export function getBlackList(data) {
    return HiggsPromise({
        url: '/api/v1.0/index/query/blackList.do',
        type: HttpMethod.GET,
        data: data
    });
}

/* 重点关注和持续监控企业查询
 * GET请求
*/
export function findIndexCompanyPage(data) {
    return HiggsPromise({
        url: '/api/v1.0/index/query/findIndexCompanyPage.do',
        type: HttpMethod.GET,
        data: data
    });
}

/* 获取省份列表
 * GET请求
*/
export function getProvinces() {
    return HiggsPromise({
        url: '/api/v1.0/common/provinces.do',
        type: HttpMethod.GET
    });
}

/* 获取城市列表
 * GET请求
*/
export function getCitys(data) {
    return HiggsPromise({
        url: '/api/v1.0/common/citys.do',
        type: HttpMethod.GET,
        data: data
    });
}

/* 获取区县列表
 * GET请求
*/
export function getAreas(data) {
    return HiggsPromise({
        url: '/api/v1.0/common/areas.do',
        type: HttpMethod.GET,
        data: data
    });
}

/*
* 首页-综合监测
* */
export function indexDefaultAPI({ data, type }) {
    let dstr = '/api/v1.0/index/', info = {
            type: HttpMethod.GET,
            data: data,
            url: dstr + type
        };
    return HiggsPromise(info);
}

/*
* 首页-网络借贷
* */
export function indexNetAvgAPI({ data, type }) {
    let dstr = '/api/v1.0/index/query/p2p/', info = {
            type: HttpMethod.GET,
            data: data,
            url: dstr + type
        };
    return HiggsPromise(info);
}

/*
* 首页-私募基金
* */
export function indexPrivateFundAPI({ data, type }) {
    let dstr = '/api/v1.0/index/query/privateFund/', info = {
            type: HttpMethod.GET,
            data: data,
            url: dstr + type
        };
    return HiggsPromise(info);
}

/*
* 首页-交易场所
* */
export function indexTradePlaceAPI({ data, type }) {
    let dstr = '/api/v1.0/index/query/tradePlace/', info = {
            type: HttpMethod.GET,
            data: data,
            url: dstr + type
        };
    return HiggsPromise(info);
}

/* 查询处理状态对应数量
 * GET请求
*/
export function findDealStatusCount(data) {
    return HiggsPromise({
        url: '/api/v1.0/index/findDealStatusCount.do',
        type: HttpMethod.GET,
        data: data
    });
}
