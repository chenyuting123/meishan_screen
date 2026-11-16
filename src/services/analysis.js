/*
* author:TanJun
* describe:
* createTime:2018/6/27
* */

import { HttpMethod, Services } from '../constants/common';
import HiggsPromise from 'Utils/higgsPromise';

const dstr = '/api/v1.0/';
const { RELATION_SEEK, ANALYZE_KEYREL_TOP5, SEARCH_RELATION } = Services;

function commonFunc({ data, type, isPostJson }, url) {
    let info = {
        type: HttpMethod.POST,
        data: data,
        url: url + type,
        isPostJson
    };
    return HiggsPromise(info);
}

export function searchAPI(data) {
    let dstr = '/api/v1.0/search/';
    switch (data.type) {
        case SEARCH_RELATION: {
            data.isPostJson = true;
            break;
        }
    }
    return commonFunc(data, dstr);
}

export function relationAPI(data) {
    let dstr = '/api/v1.0/relation/';
    switch (data.type) {
        case RELATION_SEEK: {
            data.isPostJson = true;
            break;
        }
    }
    return commonFunc(data, dstr);
}

export function companyCountyAPI(data) {
    let dstr = '/api/v1.0/';
    return commonFunc(data, dstr);
}

// 企业画像-分析统计
export function analyzeController(data) {
    let dstr = '/api/v1.0/company/analyze/';
    switch (data.type) {
        case ANALYZE_KEYREL_TOP5: {
            data.isPostJson = true;
            break;
        }
    }
    return commonFunc(data, dstr);
}