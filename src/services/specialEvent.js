
import { HttpMethod } from '../constants/common';
import HiggsPromise from 'Utils/higgsPromise';

const dstr = '/api/';
export function specialEventGAPI({ data, type }) {
    let info = {
        type: HttpMethod.GET,
        data: data,
        url: dstr + type
    };
    return HiggsPromise(info);
}

export function specialEventPAPI({ data, type }) {
    let info = {
        type: HttpMethod.POST,
        data: data,
        url: dstr + type
    };
    return HiggsPromise(info);
}

export function specialEventCAPI({ data, type }) {
    let info = {
        type: HttpMethod.POST,
        data: data,
        url: '/api/v1.0/' + type
    };
    return HiggsPromise(info);
}