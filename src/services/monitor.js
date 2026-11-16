import { HttpMethod } from '../constants/common';
import HiggsPromise from 'Utils/higgsPromise';
const dstr = '/api/v1.0/riskMonitor/';
export function personalCenterGAPI({ data, type }) {
    let info = {
        type: HttpMethod.GET,
        data: data,
        url: dstr + type
    };
    return HiggsPromise(info);
}

export function personalCenterPAPI({ data, type }) {
    let info = {
        type: HttpMethod.POST,
        data: data,
        url: dstr + type
    };
    return HiggsPromise(info);
}
/**
 *导入
 * @param data
 */
export function batchUpload(data, isUpLoad) {
    return HiggsPromise({
        url: '/api/v1.0/riskMonitor/excelImport.do',
        type: HttpMethod.POST,
        data: data,
        isUpLoad
    });
}

// 推送设置
export function riskMonitorPAPI({ data, type }) {
    let dstr = '/api/v1.0/', info = {
            type: HttpMethod.POST,
            data: data,
            url: dstr + type
        };
    return HiggsPromise(info);
}

