/**
 * @desc 封装了图表组件的一些公用方法.
 */

/*
 * 设置缩放开始比例
 * ps: 适用于有缩放组件的时序图
 */
export function setZoom(dataZoomStart) {
    let option = JSON.parse(JSON.stringify(this.state.option));
    option.dataZoom.start = dataZoomStart;
    this.setState({ option });
}

/*
 * 仅当调用initChart或者获取到新的版本更新时间，渲染更新
 * ps: 适用于有缩放组件的时序图
 */
export function shouldComponentUpdateWithZoom(nextProps, nextState){
    return nextState.option !== this.state.option || nextProps.updateTag !== this.props.updateTag;
}
/*
 * 仅当调用initChart，渲染更新
 * ps: 适用于没有zoom组件的其他图表
 */
export function shouldComponentUpdateWithoutZoom(nextProps, nextState){
    return nextState.option !== this.state.option;
}
