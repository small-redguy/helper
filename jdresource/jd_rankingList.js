const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
const needSum = false;     //是否需要显示汇总
const STRSPLIT = "|";
const JD_API_HOST = `https://api.m.jd.com/client.action?functionId=`;
let merge = {}
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [], cookie = '';
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') that.log = () => {
  };
} else {
  cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}

$.time=function ( format) { 
      var v = ""; 
      let date=new Date();
      if (typeof date == "string" || typeof date != "object") { 
        return; 
      } 
      var year  = date.getFullYear(); 
      var month  = date.getMonth()+1; 
      var day   = date.getDate(); 
      var hour  = date.getHours(); 
      var minute = date.getMinutes(); 
      var second = date.getSeconds(); 
      var weekDay = date.getDay(); 
      var ms   = date.getMilliseconds(); 
      var weekDayString = ""; 
        
      if (weekDay == 1) { 
        weekDayString = "星期一"; 
      } else if (weekDay == 2) { 
        weekDayString = "星期二"; 
      } else if (weekDay == 3) { 
        weekDayString = "星期三"; 
      } else if (weekDay == 4) { 
        weekDayString = "星期四"; 
      } else if (weekDay == 5) { 
        weekDayString = "星期五"; 
      } else if (weekDay == 6) { 
        weekDayString = "星期六"; 
      } else if (weekDay == 7) { 
        weekDayString = "星期日"; 
      } 
  
      v = format; 
      //Year 
      v = v.replace(/yyyy/g, year); 
      v = v.replace(/YYYY/g, year); 
      v = v.replace(/yy/g, (year+"").substring(2,4)); 
      v = v.replace(/YY/g, (year+"").substring(2,4)); 
  
      //Month 
      var monthStr = ("0"+month); 
      v = v.replace(/MM/g, monthStr.substring(monthStr.length-2)); 
  
      //Day 
      var dayStr = ("0"+day); 
      v = v.replace(/dd/g, dayStr.substring(dayStr.length-2)); 
  
      //hour 
      var hourStr = ("0"+hour); 
      v = v.replace(/HH/g, hourStr.substring(hourStr.length-2)); 
      v = v.replace(/hh/g, hourStr.substring(hourStr.length-2)); 
  
      //minute 
      var minuteStr = ("0"+minute); 
      v = v.replace(/mm/g, minuteStr.substring(minuteStr.length-2)); 
  
      //Millisecond 
      v = v.replace(/sss/g, ms); 
      v = v.replace(/SSS/g, ms); 
        
      //second 
      var secondStr = ("0"+second); 
      v = v.replace(/ss/g, secondStr.substring(secondStr.length-2)); 
      v = v.replace(/SS/g, secondStr.substring(secondStr.length-2)); 
        
      //weekDay 
      v = v.replace(/E/g, weekDayString); 
      return v; 
    } 
!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
    return;
  }
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = '';
      initial();
      merge.nickname=$.UserName
      await queryTrumpTask();
      await msgShow();
    }
  }
})()
  .catch((e) => $.logErr(e))
  .finally(() => $.done())


//获取昵称
function QueryJDUserInfo(timeout = 0) {
  return new Promise((resolve) => {
    setTimeout( ()=>{
      let url = {
        url : `https://wq.jd.com/user/info/QueryJDUserInfo?sceneval=2`,
        headers : {
          'Referer' : `https://wqs.jd.com/my/iserinfo.html`,
          'Cookie' : cookie
        }
      }
      $.get(url, (err, resp, data) => {
        try {
          data = JSON.parse(data);
          if (data.retcode === 13) {
            merge.enabled = false
            return
          }
          merge.nickname = data.base.nickname;
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve()
        }
      })
    },timeout)
  })
}

//查询任务
function queryTrumpTask(timeout = 0) {
  return new Promise((resolve) => {
    setTimeout( ()=>{
      let url = {
        url : `${JD_API_HOST}queryTrumpTask&body=%7B%22sign%22%3A2%7D&appid=content_ecology&clientVersion=9.2.0&client=wh5`,
        headers : {
          'Cookie' : cookie,
          'Connection' : `keep-alive`,
          'Accept' : `application/json, text/plain, */*`,
          'Referer' : `https://h5.m.jd.com/babelDiy/Zeus/3wtN2MjeQgjmxYTLB3YFcHjKiUJj/index.html`,
          'Host' : `api.m.jd.com`,
          'Accept-Encoding' : `gzip, deflate, br`,
          'Accept-Language' : `zh-cn`
        }
      }
      $.post(url, async (err, resp, data) => {
        try {
          //that.log(data)
          data = JSON.parse(data)
          let now = $.time('yyyy-MM-dd')
          for (let i in data.result.signTask.taskItemInfo.signList){
            //that.log(data.result.signTask.taskItemInfo.signList[i])
            if (data.result.signTask.taskItemInfo.signList[i].match(now)) {
              merge.jdBeans.fail++;
              merge.jdBeans.notify = `${now}已签过`;
              that.log(now + '已签过')
              return
            }
          }
          for (let i in data.result.taskList) {
            that.log(data.result.taskList[i].taskName)
            if (data.result.taskList[i].taskItemInfo.status === 0) {
              await doTrumpTask(data.result.taskList[i].taskId,data.result.taskList[i].taskItemInfo.itemId,1000)
            } else {
              that.log('已完成')
            }
          }
          that.log('开始签到')
          await doTrumpTask(4,"1",1000)
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve()
        }
      })
    },timeout)
  })
}


//做任务
function doTrumpTask(taskId,itemId,timeout = 0) {
  return new Promise((resolve) => {
    setTimeout( ()=>{
      let url = {
        url : `${JD_API_HOST}doTrumpTask&body=%7B%22taskId%22%3A${taskId}%2C%22itemId%22%3A%22${itemId}%22%2C%22sign%22%3A2%7D&appid=content_ecology&clientVersion=9.2.0&client=wh5`,
        headers : {
          'Cookie' : cookie,
          'Connection' : `keep-alive`,
          'Accept' : `application/json, text/plain, */*`,
          'Referer' : `https://h5.m.jd.com/babelDiy/Zeus/3wtN2MjeQgjmxYTLB3YFcHjKiUJj/index.html`,
          'Host' : `api.m.jd.com`,
          'Accept-Encoding' : `gzip, deflate, br`,
          'Accept-Language' : `zh-cn`
        }
      }
      $.post(url, async (err, resp, data) => {
        try {
          //
          data = JSON.parse(data);
          that.log(data.msg)
          if (data.code !== "0") {
            merge.jdBeans.fail++;
            merge.jdBeans.notify = `${data.msg}`;
            return
          } else {
            merge.jdBeans.success++;
            merge.jdBeans.prizeCount += parseInt(data.result.lotteryScore)
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve()
        }
      })
    },timeout)
  })
}



//初始化
function initial() {
  merge = {
    nickname: "",
    enabled: true,
    //blueCoin: {prizeDesc : "收取|蓝币|个",number : true},  //定义 动作|奖励名称|奖励单位   是否是数字
    jdBeans: {prizeDesc : "获得|京豆|个",number : true,fixed : 0}
  }
//   for (let i in merge) {
//     merge[i].success = 0;
//     merge[i].fail = 0;
//     merge[i].prizeCount = 0;
//     merge[i].notify = "";
//     merge[i].show = true;
//   }
}
//通知
function msgShow() {
  let message = "";
  let url ={ "open-url" : `openjd://virtual?params=%7B%20%22category%22:%20%22jump%22,%20%22des%22:%20%22m%22,%20%22url%22:%20%22https://h5.m.jd.com/babelDiy/Zeus/3wtN2MjeQgjmxYTLB3YFcHjKiUJj/index.html%22%20%7D`}
  let title = `京东账号：${merge.nickname}`;
  for (let i in merge) {
    if (typeof (merge[i]) !== "object" || !merge[i].show) continue;
    if (merge[i].notify.split("").reverse()[0] === "\n") merge[i].notify = merge[i].notify.substr(0,merge[i].notify.length - 1);
    message += `${merge[i].prizeDesc.split(STRSPLIT)[0]}${merge[i].prizeDesc.split(STRSPLIT)[1]}：` + (merge[i].success ? `${merge[i].prizeCount.toFixed(merge[i].fixed)}${merge[i].prizeDesc.split(STRSPLIT)[2]}\n` : `失败：${merge[i].notify}\n`)
  }
//合计
if (needSum)
  {
    $.sum = {};
    for (let i in merge) {
         if (typeof (merge[i]) !== "object" || !merge[i].show) continue;
         if (typeof ($.sum[merge[i].prizeDesc.split(STRSPLIT)[1]]) === "undefined")  $.sum[merge[i].prizeDesc.split(STRSPLIT)[1]] = {count : 0};
         $.sum[merge[i].prizeDesc.split(STRSPLIT)[1]].count += merge[i].prizeCount;
    }
    message += `合计：`
    for (let i in $.sum)
    {
      message += `${$.sum[i].count.toFixed($.sum[i].fixed)}${i}，`
    }
  }
  message += `请点击通知跳转至APP查看`
  //message = message.substr(0,message.length - 1);
  $.msg($.name, title, message, url);
}

function jsonParse(str) {
  if (typeof str == "string") {
    try {
      return JSON.parse(str);
    } catch (e) {
      that.log(e);
      $.msg($.name, '', '不要在BoxJS手动复制粘贴修改cookie')
      return [];
    }
  }
}