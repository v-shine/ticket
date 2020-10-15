
import CryptoJS from 'crypto-js'

export const filePath = (filePath = '') => {
    return ()=>import('@/views/'+filePath);
}

// 获取当前日期 day 前后日期  times 当前日期时间戳
export const getDates = (day = 0, times) => {
    var dd = times ? new Date(times) : new Date();
    dd.setDate(dd.getDate() + day); //获取day天后的日期
    var y = dd.getFullYear(); 
    var m = (dd.getMonth()+1) < 10 ? "0" + (dd.getMonth() + 1) : (dd.getMonth() + 1);
    var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate();
    return y + "-" + m + "-" + d; 
}

export const getMonthFirstDay = () => {
    var date = new Date();
    date.setDate(1);
    var month = parseInt(date.getMonth()+1);
    var day = date.getDate();
    if (month < 10) {
        month = '0' + month
    }
    if (day < 10) {
        day = '0' + day
    }
    return date.getFullYear() + '-' + month + '-' + day;
}

// 获取本月最后一天的日期
export const getMonthLastDay = () => {
    var date=new Date();
    var currentMonth=date.getMonth();
    var nextMonth=++currentMonth;
    var nextMonthFirstDay=new Date(date.getFullYear(),nextMonth,1);
    var oneDay=1000*60*60*24;
    var lastTime = new Date(nextMonthFirstDay-oneDay);
    var month = parseInt(lastTime.getMonth()+1);
    var day = lastTime.getDate();
    if (month < 10) {
        month = '0' + month
    }
    if (day < 10) {
        day = '0' + day
    }
    return date.getFullYear() + '-' + month + '-' + day;
}

// 获取当前周的起止日期 -1代表上一个周   为1代表下一个周以此类推
export const getWeekStartAndEnd = (AddWeekCount = 0) =>{
    //起止日期数组   
    var startStop = new Array(); 
    //一天的毫秒数   
    var millisecond = 1000 * 60 * 60 * 24; 
    //获取当前时间   
    var currentDate = new Date();
    //相对于当前日期AddWeekCount个周的日期
    currentDate = new Date(currentDate.getTime() + (millisecond * 7*AddWeekCount));
    //返回date是一周中的某一天
    var week = currentDate.getDay(); 
    //返回date是一个月中的某一天   
    var month = currentDate.getDate();
    //减去的天数   
    var minusDay = week != 0 ? week - 1 : 6; 
    //获得当前周的第一天   
    var currentWeekFirstDay = new Date(currentDate.getTime() - (millisecond * minusDay)); 
    //获得当前周的最后一天
    var currentWeekLastDay = new Date(currentWeekFirstDay.getTime() + (millisecond * 6));
    //添加至数组   
    startStop.push(getDates(0,currentWeekFirstDay)); 
    startStop.push(getDates(0,currentWeekLastDay));
    return startStop; 
}

/**
 * 加密（需要先加载lib/aes/aes.min.js文件）
 */
export const encrypt = (word) => {
    return CryptoJS.MD5(word).toString()
}