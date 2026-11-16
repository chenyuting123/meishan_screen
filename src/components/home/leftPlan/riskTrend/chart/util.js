export function getYAxisName(type){
    switch (type){
        case '风险分析':
            return '企业数量（家）';
        case '风险走势':
            return '风险分值';
    }
}