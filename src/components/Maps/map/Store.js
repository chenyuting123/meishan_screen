'use strict';
// 数据缓存
var Store = {
    tanxun: null,
    companyRightName: null, // 鼠标右键选中的公司
    companyRightCname: null, // 鼠标右键选中的公司 -中文
    companyLeftName: null, // 鼠标左键选中的公司 
    company: null, // 目标公司
    iniData: null, // 当前操作对象
    allData: {// 所有的点 
        'arr': {},
        'links': [],
        'obj': {}
    },
    showArr: null, // 显示的点
    oldData: null, // 初始化时候的对象
    oldLimitNum: null, // 初始化的图形的半径
    showMap: 1, // 当前默认显示对象为1
    rmax: null,  // 2度最大半径
    extR: null, // 记录扩展开的当前半径
    extDom: null, // 记录扩展的当前对象
    nameExg: /(有限公司|股份有限公司|有限责任公司|公司)/ // 缩减名字匹配过滤
};

// 关于我们
export default Store;