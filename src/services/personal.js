/*
* author:TanJun
* describe:
* createTime:2018/6/27
* */

import { HttpMethod } from '../constants/common';
import HiggsPromise from 'Utils/higgsPromise';

const dstr = '/api/v1.0/personal/';
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

export function personalCenterRAPI({ data, type }) {
    let info = {
        type: HttpMethod.GET,
        data: data,
        url: '/api/v1.0/applyReport/' + type
    };
    return HiggsPromise(info);
}

export function personalCenterDAPI({ data, type }) {
    let info = {
        type: HttpMethod.GET,
        data: data,
        url: '/api/v1.0/downloadReports/' + type
    };
    return HiggsPromise(info);
}