let cookiesArr = [], cookie = '';
const JD_API_HOST = 'https://ms.jr.jd.com/gw/generic/uc/h5/m';
const notify = $.isNode() ? require('./sendNotify') : '';
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') that.log = () => {};
} else {
  cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
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
      await TotalBean();
      that.log(`\n***********开始【京东账号${$.index}】${$.nickName || $.UserName}********\n`);
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});

        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }
        continue
      }
      await jdDailyEgg();
    }
  }
})()
    .catch((e) => {
      $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
    })
    .finally(() => {
      $.done();
    })
async function jdDailyEgg() {
  await toDailyHome()
  await toWithdraw()
  await toGoldExchange();
}
function toGoldExchange() {
  return new Promise(async resolve => {
    const body = {
      "timeSign": 0,
      "environment": "jrApp",
      "riskDeviceInfo": "{}"
    }
    $.post(taskUrl('toGoldExchange', body), (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            // that.log(data)
            data = JSON.parse(data);
            if (data.resultCode === 0) {
              if (data.resultData.code === '0000') {
                that.log(`兑换金币:${data.resultData.data.cnumber}`);
                that.log(`当前总金币:${data.resultData.data.goldTotal}`);
              } else if (data.resultData.code !== '0000') {
                that.log(`兑换金币失败:${data.resultData.msg}`)
              }
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
function toWithdraw() {
  return new Promise(async resolve => {
    const body = {
      "timeSign": 0,
      "environment": "jrApp",
      "riskDeviceInfo": "{}"
    }
    $.post(taskUrl('toWithdraw', body), (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            // that.log(data)
            data = JSON.parse(data);
            if (data.resultCode === 0) {
              if (data.resultData.code === '0000') {
                that.log(`收取鹅蛋:${data.resultData.data.eggTotal}个成功`);
                that.log(`当前总鹅蛋数量:${data.resultData.data.userLevelDto.userHaveEggNum}`);
              } else if (data.resultData.code !== '0000') {
                that.log(`收取鹅蛋失败:${data.resultData.msg}`)
              }
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
function toDailyHome() {
  return new Promise(async resolve => {
    const body = {
      "timeSign": 0,
      "environment": "jrApp",
      "riskDeviceInfo": "{}"
    }
    $.post(taskUrl('toDailyHome', body), (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            // that.log(data)
            data = JSON.parse(data);
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
function TotalBean() {
  return new Promise(async resolve => {
    const options = {
      "url": `https://wq.jd.com/user/info/QueryJDUserInfo?sceneval=2`,
      "headers": {
        "Accept": "application/json,text/plain, */*",
        "Content-Type": "application/x-www-form-urlencoded",
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
function taskUrl(function_id, body) {
  return {
    url: `${JD_API_HOST}/${function_id}`,
    body: `reqData=${encodeURIComponent(JSON.stringify(body))}`,
    headers: {
      'Accept' : `application/json`,
      'Origin' : `https://uua.jr.jd.com`,
      'Cookie' : cookie,
      'Content-Type' : `application/x-www-form-urlencoded;charset=UTF-8`,
      'Host' : `ms.jr.jd.com`,
      'Connection' : `keep-alive`,
      'User-Agent' : $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
      'Referer' : `https://uua.jr.jd.com/uc-fe-wxgrowing/moneytree/index`,
      'Accept-Language' : `zh-cn`
    }
  }
}
function jsonParse(str) {
  if (typeof str == "string") {
    try {
      return JSON.parse(str);
    } catch (e) {
      that.log(e);
      $.msg($.name, '', '请勿随意在BoxJs输入框修改内容\n建议通过脚本去获取cookie')
      return [];
    }
  }
}