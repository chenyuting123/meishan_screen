export function getNum(type, data){
    switch (type){
        case '高危企业数':
            return data.highRiskCompanyCount ? data.highRiskCompanyCount : 0;
        case '违规预警企业数':
            return data.ruleBreakRiskCompanyCount ? data.ruleBreakRiskCompanyCount : 0;
        case '特征事件预警企业':
            return data.featureRiskCompanyCount ? data.featureRiskCompanyCount : 0;
        case '重点关注企业数':
            return data.focusOnCompanyCount ? data.focusOnCompanyCount : 0;
        case '黑名单企业数':
            return data.blackCompanyCount ? data.blackCompanyCount : 0;
        
    }
}

export function getChangeNum(type, data){
    switch (type){
        case '高危企业数':
            return data.monthAddHighRiskCompanyCount ? data.monthAddHighRiskCompanyCount : 0;
        case '违规预警企业数':
            return data.monthAddRuleBreakRiskCompanyCount ? data.monthAddRuleBreakRiskCompanyCount : 0;
        case '特征事件预警企业':
            return data.addFeatureRiskCompanyCount ? data.addFeatureRiskCompanyCount : 0;
        case '重点关注企业数':
            return data.monthAddFocusOnCompanyCount ? data.monthAddFocusOnCompanyCount : 0;
        case '黑名单企业数':
            return data.monthAddBlackCompanyCount ? data.monthAddBlackCompanyCount : 0;
        
    }
}

export function getIndexCount(type, data){
    switch (type){
        case '已监控企业':
            return data.monitorNum ? data.monitorNum : 0;
        case '本月新增监控企业':
            return data.addMonitorNumThisMonth ? data.addMonitorNumThisMonth : 0;
        case '本周风险变动':
            return data.riseMonitorNum ? data.riseMonitorNum : 0;
        case '黑名单企业':
            return data.blackNum ? data.blackNum : 0;
    }
}
// 判断是否是正数
export function validate(num)
{
    let reg = /^\d+(?=\.{0,1}\d+$|$)/;
    if(reg.test(num)){
        return true;
    }
    return false; 
}