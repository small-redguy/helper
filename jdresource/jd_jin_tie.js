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
const notify = $.isNode() ? require('./sendNotify') : '';
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [], cookie = '', message, allMessage = '';
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item]);
  });
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === "false") that.log = () => {};
} else {
  cookiesArr = [
    $.getdata("CookieJD"),
    $.getdata("CookieJD2"),
    ...$.toObj($.getdata("CookiesJD") || "[]").map((item) => item.cookie)].filter((item) => !!item);
}
!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
    return;
  }
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]);
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = '';
      message = '';
      await TotalBean();
      that.log(`\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});

        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }
        continue
      }
      await main();
    }
  }
})()
    .catch((e) => {
      $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
    })
    .finally(() => {
      $.done();
    })
async function main() {
  try {
    await signInforOfJinTie();
    await queryMission();
    await doTask();
    await queryMission(false);
    await queryAvailableSubsidyAmount();
  } catch (e) {
    $.logErr(e)
  }
}
function queryMission(info = true) {
  $.taskData = [];
  const body = JSON.stringify({
    channel: "sqcs",
    channelCode: "SUBSIDY2",
    "riskDeviceParam": JSON.stringify({
      appId: "jdapp",
      appType: "3",
      clientVersion: "9.4.6",
      deviceType: "iPhone11,8",
      "eid": cookie,
      "fp": getFp(),
      idfa: "",
      imei: "",
      ip: "",
      macAddress: "",
      networkType: "WIFI",
      os: "iOS",
      osVersion: "14.2",
      token: "",
      uuid: ""
    })
  })
  const options = taskUrl('queryMission', body);
  return new Promise((resolve) => {
    $.get(options, async (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          if (data.resultCode === 0) {
            if (data.resultData.code === '0000') {
              if (info) {
                that.log('互动任务获取成功')
                $.taskData = data.resultData.data;
                $.willTask = $.taskData.filter(t => t.status === -1) || [];
                // $.willTask = $.taskData.filter(t => t.status === 0) || [];//已领取任务，但未完成
                $.recevieTask = $.taskData.filter(t => t.status === 1) || [];
                const doneTask = $.taskData.filter(t => t.status === 2);
                that.log(`\n剩余未接取任务：${$.willTask.length}`)
                that.log(`已完成任务：${doneTask.length}\n`);
              } else {
                if ($.recevieTask && $.recevieTask.length) {
                  for (let task of $.recevieTask) {
                    that.log('预计获得：', task.awards[0].awardName, task.awards[0].awardRealNum, task.awards[0].awardUnit)
                    await awardMission(task['missionId'])
                  }
                }
              }
            } else {
              that.log('获取互动任务失败', data.resultData.msg)
            }
          } else {
            that.log('获取互动任务失败', data.resultMsg)
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    })
  })
}
//领取任务
function receiveMission(missionId) {
  const body = JSON.stringify({
    missionId,
    "channelCode": "SUBSIDY2",
    "timeStamp": new Date().toString(),
    "env": "JDAPP"
  });
  const options = taskUrl('receiveMission', body);
  return new Promise((resolve) => {
    $.get(options, (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          if (data.resultCode === 0) {
            if (data.resultData.code === '0000') {
              that.log('任务接取成功')
            } else {
              that.log('任务接取失败', data.resultData.msg)
            }
          } else {
            that.log('任务接取失败', data.resultMsg)
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}
//完成任务
function finishReadMission(missionId, readTime) {
  const body = JSON.stringify({missionId, readTime});
  const options = taskUrl('finishReadMission', body);
  return new Promise((resolve) => {
    $.get(options, (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          if (data.resultCode === 0) {
            if (data.resultData.code === '0000') {
              that.log('完成任务 成功')
            } else {
              that.log('完成任务失败', data.resultData.msg)
            }
          } else {
            that.log('完成任务失败', data.resultMsg)
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}
//领取金贴奖励
function awardMission(missionId) {
  const body = JSON.stringify({
    missionId,
    "channelCode": "SUBSIDY2",
    "timeStamp": new Date().toString(),
    "env": "JDAPP"
  });
  const options = taskUrl('awardMission', body);
  return new Promise((resolve) => {
    $.get(options, (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          if (data.resultCode === 0) {
            if (data.resultData.code === '0000') {
              that.log('奖励领取成功')
            } else {
              that.log('奖励领取失败', data.resultData.msg)
            }
          } else {
            that.log('奖励领取失败', data.resultMsg)
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}
//获取签到状态
function signInforOfJinTie() {
  const body = JSON.stringify({
    channel: "sqcs",
    "riskDeviceParam": JSON.stringify({
      appId: "jdapp",
      appType: "3",
      clientVersion: "9.4.6",
      deviceType: "iPhone11,8",
      "eid": cookie,
      "fp": getFp(),
      idfa: "",
      imei: "",
      ip: "",
      macAddress: "",
      networkType: "WIFI",
      os: "iOS",
      osVersion: "14.2",
      token: "",
      uuid: ""
    })
  })
  const options = taskUrl('signInforOfJinTie', body, 'jrm');
  return new Promise((resolve) => {
    $.get(options, async (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          if (data.resultCode === 0) {
            if (data.resultData.code === '000') {
              let state = data.resultData.data.sign
              that.log('获取签到状态成功', state ? '今日已签到' : '今日未签到', '连续签到', data.resultData.data.signContinuity, '天\n')
              if (!state) await signOfJinTie()
            } else {
              that.log('获取签到状态失败', data.resultData.msg)
            }
          } else {
            that.log('获取签到状态失败', data.resultMsg)
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}
//签到
function signOfJinTie() {
  const body = JSON.stringify({
    channel: "sqcs",
    "riskDeviceParam": JSON.stringify({
      appId: "jdapp",
      appType: "3",
      clientVersion: "9.4.6",
      deviceType: "iPhone11,8",
      "eid": cookie,
      "fp": getFp(),
      idfa: "",
      imei: "",
      ip: "",
      macAddress: "",
      networkType: "WIFI",
      os: "iOS",
      osVersion: "14.2",
      token: "",
      uuid: ""
    })
  })
  const options = taskUrl('signOfJinTie', body, 'jrm');
  return new Promise((resolve) => {
    $.get(options, async (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          if (data.resultCode === 0) {
            if (data.resultData.code === '000') {
              that.log('签到成功', data.resultData.data.amount)
            } else {
              that.log('签到失败', data.resultData.msg)
            }
          } else {
            that.log('签到失败', data.resultMsg)
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}
function queryAvailableSubsidyAmount() {
  const body = JSON.stringify({
    channel: "sqcs",
    "riskDeviceParam": JSON.stringify({
      appId: "jdapp",
      appType: "3",
      clientVersion: "9.4.6",
      deviceType: "iPhone11,8",
      "eid": cookie,
      "fp": getFp(),
      idfa: "",
      imei: "",
      ip: "",
      macAddress: "",
      networkType: "WIFI",
      os: "iOS",
      osVersion: "14.2",
      token: "",
      uuid: ""
    })
  })
  const options = taskUrl('queryAvailableSubsidyAmount', body, 'jrm');
  return new Promise((resolve) => {
    $.get(options, async (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          if (data.resultCode === 0) {
            if (data.resultData.code === '000') {
              that.log(`获取当前总金贴成功\n\n京东账号${$.index} ${$.nickName || $.UserName} 当前总金贴：${data.resultData.data}元`)
            } else {
              that.log('获取当前总金贴失败', data.resultData.msg)
            }
          } else {
            that.log('获取当前总金贴失败', data.resultMsg)
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}
async function doTask() {
  for (let task of $.willTask) {
    that.log(`\n开始领取 【${task['name']}】任务`);
    await receiveMission(task['missionId']);
    await $.wait(100)
    if (task.doLink.indexOf('readTime=') !== -1) {
      const readTime = parseInt(task.doLink.substr(task.doLink.indexOf('readTime=') + 9));
      await finishReadMission(task['missionId'], readTime);
      await $.wait(200);
    } else if (task.detail.indexOf('京东到家') !== -1) {

    } else if ((task.detail.indexOf('关注') !== -1 || task.detail.indexOf('收藏')) && task.doLink.indexOf('shopId') !== -1) {
      const shopId = task.doLink.substr(task.doLink.indexOf('shopId=') + 7);
    }
  }
}
function taskUrl(function_id, body, type = 'mission') {
  return {
    url: `https://ms.jr.jd.com/gw/generic/${type}/h5/m/${function_id}?reqData=${encodeURIComponent(body)}`,
    headers: {
      'Accept' : `*/*`,
      'Origin' : `https://u.jr.jd.com`,
      'Accept-Encoding' : `gzip, deflate, br`,
      'Cookie' : cookie,
      'Content-Type' : `application/x-www-form-urlencoded;charset=UTF-8`,
      'Host' : `ms.jr.jd.com`,
      'Connection' : `keep-alive`,
      "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
      'Referer' : `https://u.jr.jd.com/`,
      'Accept-Language' : `zh-cn`
    }
  }
}
function getFp() {
  // const crypto = require('crypto');
  // let fp = crypto.createHash("md5").update($.UserName + '573.9', "utf8").digest("hex").substr(4, 16)
  return ""
}
function TotalBean() {
  return new Promise(async resolve => {
    const options = {
      url: "https://me-api.jd.com/user_new/info/GetJDUserInfoUnion",
      headers: {
        Host: "me-api.jd.com",
        Accept: "*/*",
        Connection: "keep-alive",
        Cookie: cookie,
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
        "Accept-Language": "zh-cn",
        "Referer": "https://home.m.jd.com/myJd/newhome.action?sceneval=2&ufc=&",
        "Accept-Encoding": "gzip, deflate, br"
      }
    }
    $.get(options, (err, resp, data) => {
      try {
        if (err) {
          $.logErr(err)
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data['retcode'] === "1001") {
              $.isLogin = false; //cookie过期
              return;
            }
            if (data['retcode'] === "0" && data.data && data.data.hasOwnProperty("userInfo")) {
              $.nickName = data.data.userInfo.baseInfo.nickname;
            }
          } else {
            $.log('京东服务器返回空数据');
          }
        }
      } catch (e) {
        $.logErr(e)
      } finally {
        resolve();
      }
    })
  })
}
