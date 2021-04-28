$.toObj = (t, e = null) => {
	try {
		return JSON.parse(t)
	} catch {
		return e
	}
}
$.toStr = (t, e = null) => {
	try {
		return JSON.stringify(t)
	} catch {
		return e
	}
}
const jdCookieNode = $.isNode() ? require("./jdCookie.js") : "";
let cookiesArr = [],
  cookie = "",
  allMsg = '';

if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item]);
  });
  that.log(`如果出现提示 ?.data. 错误，请升级nodejs版本(进入容器后，apk add nodejs-current)`)
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === "false") that.log = () => {};
} else {
  cookiesArr = [
    $.getdata("CookieJD"),
    $.getdata("CookieJD2"),
    ...$.toObj($.getdata("CookiesJD") || "[]").map((item) => item.cookie)].filter((item) => !!item);
}
const JD_API_HOST = "https://api.m.jd.com/client.action";
!(async () => {
  if (!cookiesArr[0]) {
    $.msg(
      $.name,
      "【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取",
      "https://bean.m.jd.com/",
      {"open-url": "https://bean.m.jd.com/"}
    );
    return;
  }
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(
        cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]
      );
      $.index = i + 1;
      that.log(`\n******开始【京东账号${$.index}】${$.UserName}*********\n`);
      await main()
    }
  }
  await showMsg()
})()
  .catch((e) => {
    $.log("", `❌ ${$.name}, 失败! 原因: ${e}!`, "");
  })
  .finally(() => {
    $.done();
  });
function showMsg() {
  return new Promise(async resolve => {
    $.msg($.name, '', allMsg);
    resolve();
  })
}
async function main() {
  await getInfo('https://pro.m.jd.com/mall/active/3ryu78eKuLyY5YipWWVSeRQEpLQP/index.html')
  await getInfo('https://pro.m.jd.com/mall/active/3ryu78eKuLyY5YipWWVSeRQEpLQP/index.html')
}
async function getInfo(url) {
  return new Promise(resolve=>{
    $.get({
      url,
      headers:{
        "Cookie": cookie,
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
      }
    },async (err,resp,data)=>{
      try{
        if(err){

        }else{
          data = $.toObj(data.match(/window.__react_data__ = (\{.*\})/)[1])
          let taskList = data?.activityData?.floorList?.filter(vo=>vo.template==='score_task')[0]
          //that.log(data?.activityData?.floorList)
          for(let vo of taskList['taskItemList']){
            for(let i = vo.joinTimes; i< vo.taskLimit;++i){
              that.log(`去完成${vo?.flexibleData?.taskName ?? vo.enAwardK}任务，第${i+1}次`)
              await doTask(vo.enAwardK)
              await $.wait(500)
            }
          }
          let lottery = data?.activityData?.floorList?.filter(vo=>vo.template==='choujiang_wheel')[0]
          //that.log(lottery)
          const {userScore,lotteryScore} = lottery.lotteryGuaGuaLe
          if(lotteryScore<=userScore) {
            that.log(`抽奖需要${lotteryScore}，当前${userScore}分，去抽奖`)
            await doLottery("a84f9428da0bb36a6a11884c54300582")
          }
        }
      }catch (e) {

      }finally {
        resolve()
      }

    })
  })
}
function doTask(enAwardK) {
  return new Promise(resolve => {
    $.post(taskUrl('babelDoScoreTask',{enAwardK,"isQueryResult":0,"siteClient":"apple","mitemAddrId":"","geo":{"lng":"","lat":""},"addressId":"","posLng":"","posLat":"","homeLng":"","homeLat":"","focus":"","innerAnchor":"","cv":"2.0"}),
      (err,resp,data)=>{
      try{
        if(err){

        }else{
          data = $.toObj(data)
          that.log(data.promptMsg)
        }
      }catch (e) {

      }finally {
        resolve()
      }
      })
  })
}
function doLottery(enAwardK,authType="2") {
  return new Promise(resolve => {
    $.post(taskUrl('babelGetLottery',{enAwardK,authType}),
      (err,resp,data)=>{
        try{
          if(err){

          }else{
            data = $.toObj(data)
            that.log(data.promptMsg)
            allMsg += `【京东账号${$.index}】${$.UserName}：${data.promptMsg}\n`
          }
        }catch (e) {

        }finally {
          resolve()
        }
      })
  })
}
function taskUrl(function_id, body = {}) {
  return {
    url: `${JD_API_HOST}/client.action?functionId=${function_id}`,
    body: `body=${escape(JSON.stringify(body))}&client=wh5&clientVersion=1.0.0`,
    headers: {
      "Cookie": cookie,
      "origin": "https://h5.m.jd.com",
      "referer": "https://h5.m.jd.com/",
      'Content-Type': 'application/x-www-form-urlencoded',
      "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
    }
  }
}

function safeGet(data) {
  try {
    if (typeof JSON.parse(data) == "object") {
      return true;
    }
  } catch (e) {
    that.log(e);
    that.log(`京东服务器访问数据为空，请检查自身设备网络情况`);
    return false;
  }
}
