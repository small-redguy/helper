let allMessage = ``;
const notify = $.isNode() ? require('./sendNotify') : '';
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
const openUrl = `openjd://virtual?params=%7B%20%22category%22:%20%22jump%22,%20%22des%22:%20%22m%22,%20%22url%22:%20%22https://h5.m.jd.com/babelDiy/Zeus/41Lkp7DumXYCFmPYtU3LTcnTTXTX/index.html%22%20%7D`
let message = '';
let nowTimes = new Date(new Date().getTime() + new Date().getTimezoneOffset() * 60 * 1000 + 8 * 60 * 60 * 1000);
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [], cookie = '';
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') that.log = () => {};
} else {
  cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}

const JD_API_HOST = 'https://api.m.jd.com/api';
!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
    return;
  }
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=(.+?);/) && cookie.match(/pt_pin=(.+?);/)[1])
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = '';
      message = '';
      await TotalBean();
      that.log(`\n开始【京东账号${$.index}】${$.nickName || $.UserName}\n`);
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});

        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }
        continue
      }
      await jd_necklace();
    }
  }
  if ($.isNode() && allMessage) {
    await notify.sendNotify(`${$.name}`, `${allMessage}`, { url: openUrl })
  }
})()
    .catch((e) => {
      $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
    })
    .finally(() => {
      $.done();
    })
async function jd_necklace() {
  await necklace_homePage();
  await doTask();
  await necklace_homePage();
  await receiveBubbles();
  await sign();
  await necklace_homePage();
  // await necklace_exchangeGift($.totalScore);//自动兑换多少钱的无门槛红包，1000代表1元，默认兑换全部点点券
  await showMsg();
}
function showMsg() {
  return new Promise(async resolve => {
    if (nowTimes.getHours() >= 20) {
      $.msg($.name, '', `京东账号${$.index} ${$.nickName}\n当前${$.name}：${$.totalScore}个\n可兑换无门槛红包：${$.totalScore / 1000}元\n点击弹窗即可去兑换(注：此红包具有时效性)`, { 'open-url': openUrl});
    }
    // 云端大于10元无门槛红包时进行通知推送
    // if ($.isNode() && $.totalScore >= 20000 && nowTimes.getHours() >= 20) await notify.sendNotify(`${$.name} - 京东账号${$.index} - ${$.nickName}`, `京东账号${$.index} ${$.nickName}\n当前${$.name}：${$.totalScore}个\n可兑换无门槛红包：${$.totalScore / 1000}元\n点击链接即可去兑换(注：此红包具有时效性)\n↓↓↓ \n\n ${openUrl} \n\n ↑↑↑`, { url: openUrl })
    if ($.isNode() && nowTimes.getHours() >= 20 && (process.env.DDQ_NOTIFY_CONTROL ? process.env.DDQ_NOTIFY_CONTROL === 'false' : !!1)) {
      allMessage += `京东账号${$.index} ${$.nickName}\n当前${$.name}：${$.totalScore}个\n可兑换无门槛红包：${$.totalScore / 1000}元\n(京东APP->领券->左上角点点券.注：此红包具有时效性)${$.index !== cookiesArr.length ? '\n\n' : `\n↓↓↓ \n\n "https://h5.m.jd.com/babelDiy/Zeus/41Lkp7DumXYCFmPYtU3LTcnTTXTX/index.html" \n\n ↑↑↑`}`
    }
    resolve()
  })
}
async function doTask() {
  for (let item of $.taskConfigVos) {
    if (item.taskStage === 0) {
      that.log(`【${item.taskName}】 任务未领取,开始领取此任务`);
      await necklace_startTask(item.id);
      that.log(`【${item.taskName}】 任务领取成功,开始完成此任务`);
      await $.wait(1000);
      await reportTask(item);
    } else if (item.taskStage === 2) {
      that.log(`【${item.taskName}】 任务已做完,奖励未领取`);
    } else if (item.taskStage === 3) {
      that.log(`${item.taskName}奖励已领取`);
    } else if (item.taskStage === 1) {
      that.log(`\n【${item.taskName}】 任务已领取但未完成,开始完成此任务`);
      await reportTask(item);
    }
  }
}
async function receiveBubbles() {
  for (let item of $.bubbles) {
    that.log(`开始领取点点券\n`);
    await necklace_chargeScores(item.id)
  }
}
async function sign() {
  if ($.signInfo.todayCurrentSceneSignStatus === 1) {
    await necklace_sign();
  } else {
    that.log(`当前${new Date(new Date().getTime() + new Date().getTimezoneOffset()*60*1000 + 8*60*60*1000).toLocaleString()}已签到`)
  }
}
async function reportTask(item = {}) {
  //普通任务
  if (item['taskType'] === 2) await necklace_startTask(item.id, 'necklace_reportTask');
  //逛很多商品店铺等等任务
  if (item['taskType'] === 6 || item['taskType'] === 8 || item['taskType'] === 5 || item['taskType'] === 9) {
    //浏览精选活动任务
    await necklace_getTask(item.id);
    $.taskItems = $.taskItems.filter(value => !!value && value['status'] === 0);
    for (let vo of $.taskItems) {
      that.log(`浏览精选活动 【${vo['title']}】`);
      await necklace_startTask(item.id, 'necklace_reportTask', vo['id']);
    }
  }
  //首页浏览XX秒的任务
  if (item['taskType'] === 3) await doAppTask('3');
  if (item['taskType'] === 4) await doAppTask('4');
}
//每日签到福利
function necklace_sign() {
  return new Promise(resolve => {
    const body = {
      currentDate: $.lastRequestTime.replace(/:/g, "%3A"),
    }
    $.post(taskPostUrl("necklace_sign", body), async (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.rtn_code === 0) {
              if (data.data.biz_code === 0) {
                that.log(`签到成功，时间：${new Date(new Date().getTime() + new Date().getTimezoneOffset()*60*1000 + 8*60*60*1000).toLocaleString()}`)
                // $.taskConfigVos = data.data.result.taskConfigVos;
                // $.exchangeGiftConfigs = data.data.result.exchangeGiftConfigs;
              }
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}
//兑换无门槛红包
function necklace_exchangeGift(scoreNums) {
  return new Promise(resolve => {
    const body = {
      scoreNums,
      "giftConfigId": 31,
      currentDate: $.lastRequestTime.replace(/:/g, "%3A"),
    }
    $.post(taskPostUrl("necklace_exchangeGift", body), async (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.rtn_code === 0) {
              if (data.data.biz_code === 0) {
                const { result } = data.data;
                message += `${result.redpacketTitle}：${result.redpacketAmount}元兑换成功\n`;
                message += `红包有效期：${new Date(result.endTime + new Date().getTimezoneOffset()*60*1000 + 8*60*60*1000).toLocaleString('zh', {hour12: false})}`;
                that.log(message)
              }
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}
//领取奖励
function necklace_chargeScores(bubleId) {
  return new Promise(resolve => {
    const body = {
      bubleId,
      currentDate: $.lastRequestTime.replace(/:/g, "%3A"),
    }
    $.post(taskPostUrl("necklace_chargeScores", body), async (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.rtn_code === 0) {
              if (data.data.biz_code === 0) {
                // $.taskConfigVos = data.data.result.taskConfigVos;
                // $.exchangeGiftConfigs = data.data.result.exchangeGiftConfigs;
              }
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}
function necklace_startTask(taskId, functionId = 'necklace_startTask', itemId = "") {
  return new Promise(resolve => {
    let body = {
      taskId,
      currentDate: $.lastRequestTime.replace(/:/g, "%3A"),
    }
    if (itemId) body['itemId'] = itemId;
    $.post(taskPostUrl(functionId, body), async (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          that.log(`${functionId === 'necklace_startTask' ? '领取任务结果' : '做任务结果'}：${data}`);
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.rtn_code === 0) {
              if (data.data.biz_code === 0) {
                // $.taskConfigVos = data.data.result.taskConfigVos;
                // $.exchangeGiftConfigs = data.data.result.exchangeGiftConfigs;
              }
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
function necklace_getTask(taskId) {
  return new Promise(resolve => {
    const body = {
      taskId,
      currentDate: $.lastRequestTime.replace(/:/g, "%3A"),
    }
    $.taskItems = [];
    $.post(taskPostUrl("necklace_getTask", body), async (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.rtn_code === 0) {
              if (data.data.biz_code === 0) {
                $.taskItems = data.data.result && data.data.result.taskItems;
              }
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

function necklace_homePage() {
  $.taskConfigVos = [];
  return new Promise(resolve => {
    $.post(taskPostUrl('necklace_homePage'), async (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.rtn_code === 0) {
              if (data.data.biz_code === 0) {
                $.taskConfigVos = data.data.result.taskConfigVos;
                $.exchangeGiftConfigs = data.data.result.exchangeGiftConfigs;
                $.lastRequestTime = data.data.result.lastRequestTime;
                $.bubbles = data.data.result.bubbles;
                $.signInfo = data.data.result.signInfo;
                $.totalScore = data.data.result.totalScore;
              }
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

async function doAppTask(type = '3') {
  let body = {
    "pageClickKey": "CouponCenter",
    "childActivityUrl": "openapp.jdmobile%3a%2f%2fvirtual%3fparams%3d%7b%5c%22category%5c%22%3a%5c%22jump%5c%22%2c%5c%22des%5c%22%3a%5c%22couponCenter%5c%22%7d",
    "lat": "",
    "globalLat": "",
    "lng": "",
    "globalLng": ""
  }
  await getCcTaskList('getCcTaskList', body, type);
  body = {
    "globalLng": "",
    "globalLat": "",
    "monitorSource": "ccgroup_ios_index_task",
    "monitorRefer": "",
    "taskType": "2",
    "childActivityUrl": "openapp.jdmobile%3a%2f%2fvirtual%3fparams%3d%7b%5c%22category%5c%22%3a%5c%22jump%5c%22%2c%5c%22des%5c%22%3a%5c%22couponCenter%5c%22%7d",
    "pageClickKey": "CouponCenter",
    "lat": "",
    "taskId": "necklace_142",
    "lng": "",
  }
  if (type === '4') {
    await $.wait(15000);
    body['taskId'] = 'necklace_143';
  }
  await $.wait(15500);
  await getCcTaskList('reportCcTask', body, type);
}
function getCcTaskList(functionId, body, type = '3') {
  let url = '';
  return new Promise(resolve => {
    if (functionId === 'getCcTaskList') {
      url = `https://api.m.jd.com/client.action?functionId=${functionId}&body=${escape(JSON.stringify(body))}&uuid=8888888&client=apple&clientVersion=9.4.1&st=1614320848090&sign=d3259c0c19f6c792883485ae65f8991c&sv=111`
    }
    if (type === '3' && functionId === 'reportCcTask') url = `https://api.m.jd.com/client.action?functionId=${functionId}&body=${escape(JSON.stringify(body))}&uuid=8888888&client=apple&clientVersion=9.4.1&st=1615862880029&sign=65a8c7e54009ef2139bfe9fc6acd4390&sv=112`
    if (type === '4' && functionId === 'reportCcTask') url = `https://api.m.jd.com/client.action?functionId=${functionId}&body=${escape(JSON.stringify(body))}&uuid=8888888&client=apple&clientVersion=9.4.1&st=1615863447055&sign=d920e1397e0ed2de3c4abd123c523268&sv=122`
    // if (functionId === 'reportCcTask') {
    //   url = `https://api.m.jd.com/client.action?functionId=${functionId}&body=${escape(JSON.stringify(body))}&uuid=8888888&client=apple&clientVersion=9.4.1&st=1614320901023&sign=26e637ba072ddbcfa44c5273ef928696&sv=111`
    // }
    const options = {
      url,
      body: `body=${escape(JSON.stringify(body))}`,
      headers: {
        "Accept": "application/json, text/plain, */*",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-cn",
        "Connection": "keep-alive",
        "Content-Length": "63",
        "Content-Type": "application/x-www-form-urlencoded",
        "Host": "api.m.jd.com",
        "Origin": "https://h5.m.jd.com",
        "Cookie": cookie,
        "Referer": "https://h5.m.jd.com/babelDiy/Zeus/4ZK4ZpvoSreRB92RRo8bpJAQNoTq/index.html",
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0"),
      }
    }
    $.post((options), async (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            if (type === '3' && functionId === 'reportCcTask') that.log(`点击首页领券图标(进入领券中心浏览15s)任务:${data}`)
            if (type === '4' && functionId === 'reportCcTask') that.log(`点击“券后9.9”任务:${data}`)
            // data = JSON.parse(data);
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
function taskPostUrl(function_id, body = {}) {
  const time = new Date().getTime() + new Date().getTimezoneOffset()*60*1000 + 8*60*60*1000;
  return {
    url: `${JD_API_HOST}?functionId=${function_id}&appid=coupon-necklace&loginType=2&client=coupon-necklace&t=${time}&body=${escape(JSON.stringify(body))}&uuid=88732f840b77821b345bf07fd71f609e6ff12f43`,
    // url: `${JD_API_HOST}?functionId=${function_id}&appid=jd_mp_h5&loginType=2&client=jd_mp_h5&t=${time}&body=${escape(JSON.stringify(body))}`,
    headers: {
      "accept": "*/*",
      "accept-encoding": "gzip, deflate, br",
      "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
      "content-length": "0",
      "cookie": cookie,
      "origin": "https://h5.m.jd.com",
      "referer": "https://h5.m.jd.com/",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      "user-agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0")
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
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0")
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
      $.msg($.name, '', '请勿随意在BoxJs输入框修改内容\n建议通过脚本去获取cookie')
      return [];
    }
  }
}