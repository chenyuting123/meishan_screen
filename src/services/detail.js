/*
* author:TanJun
* describe:
* createTime:2018/6/27
* */

import { HttpMethod, Services } from '../constants/common';
import HiggsPromise from 'Utils/higgsPromise';

const dstr = '/api/v1.0/';

const {
    DETAIL_DELETE_REMARK, DETAIL_FIND_REMARK_LIST, DETAIL_SAVE_REMARK,
    DETAIL_YU_QING_COMPANYID, DETAIL_INVOKE_DATA, DETAIL_YU_QING_COMPANYID_RELATE
} = Services;

export function detailPageAPI({ data, type }) {
    let info = {
        type: HttpMethod.POST,
        data: data
    };

    switch (type) {

        case DETAIL_DELETE_REMARK: {
            info = { ...info, url: dstr + 'remark/deleteRemark.do' };
            break;
        }
        case DETAIL_FIND_REMARK_LIST: {
            info = { ...info, url: dstr + 'remark/findRemarkList.do' };
            break;
        }
        case DETAIL_SAVE_REMARK: {
            info = { ...info, url: dstr + 'remark/saveRemark.do' };
            break;
        }
        case DETAIL_YU_QING_COMPANYID: {
            info = { ...info, url: dstr + 'yuqing/getYuqingContentByCompanyId.do' };
            break;
        }
        case DETAIL_YU_QING_COMPANYID_RELATE: {
            info = { ...info, url: dstr + 'yuqing/getYuqingContentByCompanyIdAndRelate.do' };
            break;
        }
        case DETAIL_INVOKE_DATA: {
            info = { ...info, url: dstr + 'invoke/data.do' };
            break;
        }
    }
    return HiggsPromise(info);
}

export function detailCreditAPI({ data, type }) {
    let dstr = '/credit/', info = {
            type: HttpMethod.POST,
            data: data,
            url: dstr + type
        };
    return HiggsPromise(info);
}

export function detailRelationAPI({ data, type }) {
    let dstr = '/api/v1.0/relation/', info = {
            type: HttpMethod.POST,
            data: data,
            url: dstr + type
        };
    return HiggsPromise(info);
}

export function detailBaseDataAPI({ data, type }) {
    let dstr = '/api/v1.0/qyxx/', info = {
            type: HttpMethod.POST,
            data: data,
            url: dstr + type
        };
    return HiggsPromise(info);
}

export function companyDetailAPI({ data, type, me }) {
    let dstr = '/api/v1.0/companyDetail/', info = {
            type: me || HttpMethod.POST,
            data: data,
            url: dstr + type
        };
    return HiggsPromise(info);
}

export function detailManageDataAPI({ data, type }) {  
    let dstr = '/api/v1.0/manageData/', info = {
            type: HttpMethod.POST,
            data: data,
            url: dstr + type
        };
    return HiggsPromise(info);
}
export function newsManageDataAPI({ data }) { // 新增舆情接口
    let dstr = '/api/v1.0/yuqing/getByYQ.do', info = {
            type: HttpMethod.POST,
            data: data,
            url: dstr
        };
    return HiggsPromise(info);
}
export function detailFeatureAPI({ data, type }) {
    let dstr = '/api/v1.0/feature/', info = {
            type: HttpMethod.POST,
            data: data,
            url: dstr + type
        };
    return HiggsPromise(info);
}

export function feedbackAPI({ data, type }) {
    let dstr = '/api/v1.0/feedback/', info = {
            type: HttpMethod.POST,
            data: data,
            url: dstr + type
        };
    return HiggsPromise(info);
}
