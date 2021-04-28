let allMessage = '';
let bodyList = {
  "1": {
    "url": "https://api.m.jd.com/client.action?functionId=liveActivityV946&uuid=8888888&client=apple&clientVersion=9.4.1&st=1617173270021&sign=dbab3d99be06b010a7b296dea77487f5&sv=110",
    "body": "body=%7B%22liveId%22%3A%223810378%22%7D"
  },
  "2": {
    "url": "https://api.m.jd.com/client.action?functionId=liveActivityV946&uuid=8888888&client=apple&clientVersion=9.4.1&st=1617173266040&sign=8161dae063680508aa93aef0cf5473a0&sv=112",
    "body": "body=%7B%22liveId%22%3A%223804885%22%7D"
  }
}
let ids = {
  
}
const notify = $.isNode() ? require('./sendNotify') : '';
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [], cookie = '', message;
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') that.log = () => {
  };
  if(JSON.stringify(process.env).indexOf('GITHUB')>-1) process.exit(0)
}else {
  cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}
const JD_API_HOST = 'https://api.m.jd.com/api';
!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/', {"open-url": "https://bean.m.jd.com/"});
    return;
  }
  await getRedOnline();
  await getRedRain();

  let nowTs = new Date().getTime()
  if (!($.st <= nowTs && nowTs < $.ed)) {
    $.log(`远程红包雨配置获取错误，从本地读取配置`)
    let hour = (new Date().getUTCHours() + 8) %24
    if (ids[hour]){
      $.activityId = ids[hour]
      $.log(`本地红包雨配置获取成功`)
    } else{
      $.log(`无法从本地读取配置，请检查运行时间(注：非红包雨时间执行出现此提示请忽略！！！！！！！！！！！)`)
      $.log(`非红包雨期间出现上面提示请忽略。红包雨期间会正常，此脚本提issue打死！！！！！！！！！！！)`)
      return
    }
  } else{
    $.log(`远程红包雨配置获取成功`)
  }
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = '';
      message = '';
      await TotalBean();
      that.log(`\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/`, {"open-url": "https://bean.m.jd.com/"});

        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }
        continue
      }
      let nowTs = new Date().getTime() + new Date().getTimezoneOffset() * 60 * 1000 + 8 * 60 * 60 * 1000
      // that.log(nowTs, $.startTime, $.endTime)
      await receiveRedRain();
      // await showMsg();
    }
  }
  if (allMessage) {
    if ($.isNode()) await notify.sendNotify(`${$.name}`, `${allMessage}`);
    $.msg($.name, '', allMessage);
  }
})()
  .catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
  })
  .finally(() => {
    $.done();
  })

function showMsg() {
  return new Promise(resolve => {
    $.msg($.name, '', `【京东账号${$.index}】${$.nickName}\n${message}`);
    resolve()
  })
}

function getRedOnline(){
    return new Promise(resolve => {
    $.get({
    url: 'https://tyh52.com/jd/jdresource/redrain.json',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    }
  }, (err, resp, data) => {
      try {
          that.log(data)
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data) {
                bodyList=data;
            } else {
              that.log(`未获取到远程数据`)
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

function getRedRain() {
  let body
  if(bodyList.hasOwnProperty(new Date().getDate())) {
    body = bodyList[new Date().getDate()]
  }else{
    return
  }
  return new Promise(resolve => {
    $.post(taskGetUrl(body.url, body.body), (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.data && data.data.iconArea) {
              that.log(data.data.iconArea.filter(vo=>vo['type']==='anchor_darw_lottery').length &&
                data.data.iconArea.filter(vo=>vo['type']==='anchor_darw_lottery')[0].data.lotteryId)
              let act = data.data.iconArea.filter(vo=>vo['type']==="platform_red_packege_rain")[0]
              if (act) {
                let url = act.data.activityUrl
                $.activityId = url.substr(url.indexOf("id=") + 3)
                $.st = act.startTime
                $.ed = act.endTime
                that.log($.activityId)

                that.log(`下一场红包雨开始时间：${new Date($.st)}`)
                that.log(`下一场红包雨结束时间：${new Date($.ed)}`)
              } else {
                that.log(`暂无红包雨`)
              }
            } else {
              that.log(`暂无红包雨`)
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

function receiveRedRain() {
  return new Promise(resolve => {
    const body = {"actId": $.activityId};
    $.get(taskUrl('noahRedRainLottery', body), (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.subCode === '0') {
              that.log(`领取成功，获得${JSON.stringify(data.lotteryResult)}`)
              // message+= `领取成功，获得${JSON.stringify(data.lotteryResult)}\n`
              message += `领取成功，获得 ${(data.lotteryResult.jPeasList[0].quantity)}京豆`
              allMessage += `京东账号${$.index}${$.nickName || $.UserName}\n领取成功，获得 ${(data.lotteryResult.jPeasList[0].quantity)}京豆${$.index !== cookiesArr.length ? '\n\n' : ''}`;
            } else if (data.subCode === '8') {
              that.log(`今日次数已满`)
              message += `领取失败，本场已领过`;
            } else {
              that.log(`异常：${JSON.stringify(data)}`)
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}
function taskGetUrl(url, body) {
  return {
    url: url,
    body:body,
    headers: {
      "Accept": "*/*",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "zh-cn",
      "Connection": "keep-alive",
      "Content-Type": "application/x-www-form-urlencoded",
      "Host": "api.m.jd.com",
      "Referer": `https://h5.m.jd.com/active/redrain/index.html?id=${$.activityId}&lng=0.000000&lat=0.000000&sid=&un_area=`,
      "Cookie": cookie,
      "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
    }
  }
}

function taskPostUrl(function_id, body = body) {
  return {
    url: `https://api.m.jd.com/client.action?functionId=${function_id}`,
    body: body,
    headers: {
      'Host': 'api.m.jd.com',
      'content-type': 'application/x-www-form-urlencoded',
      'accept': '*/*',
      'user-agent': 'JD4iPhone/167408 (iPhone; iOS 14.2; Scale/3.00)',
      'accept-language': 'zh-Hans-JP;q=1, en-JP;q=0.9, zh-Hant-TW;q=0.8, ja-JP;q=0.7, en-US;q=0.6',
      //"Cookie": cookie,
    }
  }
}

function taskUrl(function_id, body = {}) {
  return {
    url: `${JD_API_HOST}?functionId=${function_id}&body=${escape(JSON.stringify(body))}&client=wh5&clientVersion=1.0.0&_=${new Date().getTime() + new Date().getTimezoneOffset() * 60 * 1000 + 8 * 60 * 60 * 1000}`,
    headers: {
      "Accept": "*/*",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "zh-cn",
      "Connection": "keep-alive",
      "Content-Type": "application/x-www-form-urlencoded",
      "Host": "api.m.jd.com",
      "Referer": `https://h5.m.jd.com/active/redrain/index.html?id=${$.activityId}&lng=0.000000&lat=0.000000&sid=&un_area=`,
      "Cookie": cookie,
      "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
    }
  }
}

function TotalBean() {
  return new Promise(async resolve => {
    const options = {
      "url": `https://wq.jd.com/user/info/QueryJDUserInfo?sceneval=2`,
      "headers": {
        "Accept": "application/json,text/plain, */*",
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-cn",
        "Connection": "keep-alive",
        "Cookie": cookie,
        "Referer": "https://wqs.jd.com/my/jingdou/my.shtml?sceneval=2",
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
      }
    }
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data['retcode'] === 13) {
              $.isLogin = false; //cookie过期
              return
            }
            if (data['retcode'] === 0) {
              $.nickName = (data['base'] && data['base'].nickname) || $.UserName;
            } else {
              $.nickName = $.UserName
            }
          } else {
            that.log(`京东服务器返回空数据`)
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
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