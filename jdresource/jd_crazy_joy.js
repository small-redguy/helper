const JD_API_HOST = 'https://api.m.jd.com/';

const notify = $.isNode() ? require('./sendNotify') : '';
let jdNotify = true;//是否关闭通知，false打开通知推送，true关闭通知推送
let helpSelf = false // 循环助力，默认关闭
let applyJdBean = 0; //疯狂的JOY京豆兑换，目前最小值为2000京豆，默认为 0 不开启京豆兑换
let cookiesArr = [], cookie = '', message = '';
const inviteCodes = [
];
const randomCount = $.isNode() ? 0 : 5;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') that.log = () => {
  };
} else {
  let cookiesData = $.getdata('CookiesJD') || "[]";
  cookiesData = jsonParse(cookiesData);
  cookiesArr = cookiesData.map(item => item.cookie);
  cookiesArr.reverse();
  cookiesArr.push(...[$.getdata('CookieJD2'), $.getdata('CookieJD')]);
  cookiesArr.reverse();
  cookiesArr = cookiesArr.filter(item => item !== "" && item !== null && item !== undefined);
}
!function (n) {
  "use strict";

  function t(n, t) {
    var r = (65535 & n) + (65535 & t);
    return (n >> 16) + (t >> 16) + (r >> 16) << 16 | 65535 & r
  }

  function r(n, t) {
    return n << t | n >>> 32 - t
  }

  function e(n, e, o, u, c, f) {
    return t(r(t(t(e, n), t(u, f)), c), o)
  }

  function o(n, t, r, o, u, c, f) {
    return e(t & r | ~t & o, n, t, u, c, f)
  }

  function u(n, t, r, o, u, c, f) {
    return e(t & o | r & ~o, n, t, u, c, f)
  }

  function c(n, t, r, o, u, c, f) {
    return e(t ^ r ^ o, n, t, u, c, f)
  }

  function f(n, t, r, o, u, c, f) {
    return e(r ^ (t | ~o), n, t, u, c, f)
  }

  function i(n, r) {
    n[r >> 5] |= 128 << r % 32,
      n[14 + (r + 64 >>> 9 << 4)] = r;
    var e, i, a, d, h, l = 1732584193, g = -271733879, v = -1732584194, m = 271733878;
    for (e = 0; e < n.length; e += 16)
      i = l,
        a = g,
        d = v,
        h = m,
        g = f(g = f(g = f(g = f(g = c(g = c(g = c(g = c(g = u(g = u(g = u(g = u(g = o(g = o(g = o(g = o(g, v = o(v, m = o(m, l = o(l, g, v, m, n[e], 7, -680876936), g, v, n[e + 1], 12, -389564586), l, g, n[e + 2], 17, 606105819), m, l, n[e + 3], 22, -1044525330), v = o(v, m = o(m, l = o(l, g, v, m, n[e + 4], 7, -176418897), g, v, n[e + 5], 12, 1200080426), l, g, n[e + 6], 17, -1473231341), m, l, n[e + 7], 22, -45705983), v = o(v, m = o(m, l = o(l, g, v, m, n[e + 8], 7, 1770035416), g, v, n[e + 9], 12, -1958414417), l, g, n[e + 10], 17, -42063), m, l, n[e + 11], 22, -1990404162), v = o(v, m = o(m, l = o(l, g, v, m, n[e + 12], 7, 1804603682), g, v, n[e + 13], 12, -40341101), l, g, n[e + 14], 17, -1502002290), m, l, n[e + 15], 22, 1236535329), v = u(v, m = u(m, l = u(l, g, v, m, n[e + 1], 5, -165796510), g, v, n[e + 6], 9, -1069501632), l, g, n[e + 11], 14, 643717713), m, l, n[e], 20, -373897302), v = u(v, m = u(m, l = u(l, g, v, m, n[e + 5], 5, -701558691), g, v, n[e + 10], 9, 38016083), l, g, n[e + 15], 14, -660478335), m, l, n[e + 4], 20, -405537848), v = u(v, m = u(m, l = u(l, g, v, m, n[e + 9], 5, 568446438), g, v, n[e + 14], 9, -1019803690), l, g, n[e + 3], 14, -187363961), m, l, n[e + 8], 20, 1163531501), v = u(v, m = u(m, l = u(l, g, v, m, n[e + 13], 5, -1444681467), g, v, n[e + 2], 9, -51403784), l, g, n[e + 7], 14, 1735328473), m, l, n[e + 12], 20, -1926607734), v = c(v, m = c(m, l = c(l, g, v, m, n[e + 5], 4, -378558), g, v, n[e + 8], 11, -2022574463), l, g, n[e + 11], 16, 1839030562), m, l, n[e + 14], 23, -35309556), v = c(v, m = c(m, l = c(l, g, v, m, n[e + 1], 4, -1530992060), g, v, n[e + 4], 11, 1272893353), l, g, n[e + 7], 16, -155497632), m, l, n[e + 10], 23, -1094730640), v = c(v, m = c(m, l = c(l, g, v, m, n[e + 13], 4, 681279174), g, v, n[e], 11, -358537222), l, g, n[e + 3], 16, -722521979), m, l, n[e + 6], 23, 76029189), v = c(v, m = c(m, l = c(l, g, v, m, n[e + 9], 4, -640364487), g, v, n[e + 12], 11, -421815835), l, g, n[e + 15], 16, 530742520), m, l, n[e + 2], 23, -995338651), v = f(v, m = f(m, l = f(l, g, v, m, n[e], 6, -198630844), g, v, n[e + 7], 10, 1126891415), l, g, n[e + 14], 15, -1416354905), m, l, n[e + 5], 21, -57434055), v = f(v, m = f(m, l = f(l, g, v, m, n[e + 12], 6, 1700485571), g, v, n[e + 3], 10, -1894986606), l, g, n[e + 10], 15, -1051523), m, l, n[e + 1], 21, -2054922799), v = f(v, m = f(m, l = f(l, g, v, m, n[e + 8], 6, 1873313359), g, v, n[e + 15], 10, -30611744), l, g, n[e + 6], 15, -1560198380), m, l, n[e + 13], 21, 1309151649), v = f(v, m = f(m, l = f(l, g, v, m, n[e + 4], 6, -145523070), g, v, n[e + 11], 10, -1120210379), l, g, n[e + 2], 15, 718787259), m, l, n[e + 9], 21, -343485551),
        l = t(l, i),
        g = t(g, a),
        v = t(v, d),
        m = t(m, h);
    return [l, g, v, m]
  }

  function a(n) {
    var t, r = "", e = 32 * n.length;
    for (t = 0; t < e; t += 8)
      r += String.fromCharCode(n[t >> 5] >>> t % 32 & 255);
    return r
  }

  function d(n) {
    var t, r = [];
    for (r[(n.length >> 2) - 1] = void 0,
           t = 0; t < r.length; t += 1)
      r[t] = 0;
    var e = 8 * n.length;
    for (t = 0; t < e; t += 8)
      r[t >> 5] |= (255 & n.charCodeAt(t / 8)) << t % 32;
    return r
  }

  function h(n) {
    return a(i(d(n), 8 * n.length))
  }

  function l(n, t) {
    var r, e, o = d(n), u = [], c = [];
    for (u[15] = c[15] = void 0,
         o.length > 16 && (o = i(o, 8 * n.length)),
           r = 0; r < 16; r += 1)
      u[r] = 909522486 ^ o[r],
        c[r] = 1549556828 ^ o[r];
    return e = i(u.concat(d(t)), 512 + 8 * t.length),
      a(i(c.concat(e), 640))
  }

  function g(n) {
    var t, r, e = "";
    for (r = 0; r < n.length; r += 1)
      t = n.charCodeAt(r),
        e += "0123456789abcdef".charAt(t >>> 4 & 15) + "0123456789abcdef".charAt(15 & t);
    return e
  }

  function v(n) {
    return unescape(encodeURIComponent(n))
  }

  function m(n) {
    return h(v(n))
  }

  function p(n) {
    return g(m(n))
  }

  function s(n, t) {
    return l(v(n), v(t))
  }

  function C(n, t) {
    return g(s(n, t))
  }

  function A(n, t, r) {
    return t ? r ? s(t, n) : C(t, n) : r ? m(n) : p(n)
  }

  $.md5 = A
}(that);
!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
    return;
  }
  await requireConfig();
  $.selfCodes = []
  for (let i = 0; i < cookiesArr.length; i++) {
    if (i%2===0) {
      $.nextCode = ["JB9ow1icvgyQnKy8O_HDeQ==", "JB9ow1icvgyQnKy8O_HDeQ=="];
      $.nextCode = $.nextCode[randomNumber(0, $.nextCode.length)];
    }
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=(.+?);/) && cookie.match(/pt_pin=(.+?);/)[1])
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = '';
      message = '';
      $.GROWTH_REWARD_BEAN = 0;//解锁等级奖励的京豆
      await TotalBean();
      that.log(`\n开始【京东账号${$.index}】${$.nickName || $.UserName}\n`);
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});

        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }
        continue
      }
      await shareCodesFormat()
      await jdCrazyJoy()
    }
  }

  if (helpSelf) {
    that.log(`开始循环助力`)
    // 助力
    for (let i = 0; i < cookiesArr.length; i++) {
      if (cookiesArr[i]) {
        cookie = cookiesArr[i];
        $.UserName = decodeURIComponent(cookie.match(/pt_pin=(.+?);/) && cookie.match(/pt_pin=(.+?);/)[1])
        $.index = i + 1;
        $.isLogin = true;
        $.nickName = '';
        await TotalBean();
        that.log(`\n开始【京东账号${$.index}】${$.nickName || $.UserName}\n`);
        if (!$.isLogin) {
          $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});

          if ($.isNode()) {
            await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
          }
          continue
        }
        await shareCodesFormat()
        await helpFriends()
      }
    }
    // 领取任务奖励
    for (let i = 0; i < cookiesArr.length; i++) {
      if (cookiesArr[i]) {
        cookie = cookiesArr[i];
        $.UserName = decodeURIComponent(cookie.match(/pt_pin=(.+?);/) && cookie.match(/pt_pin=(.+?);/)[1])
        $.index = i + 1;
        $.isLogin = true;
        $.nickName = '';
        await TotalBean();
        that.log(`\n开始【京东账号${$.index}】${$.nickName || $.UserName}\n`);
        if (!$.isLogin) {
          $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});

          if ($.isNode()) {
            await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
          }
          continue
        }
        await doTasks()
      }
    }
  }
})()
  .catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
  })
  .finally(() => {
    $.done();
  })

async function jdCrazyJoy() {
  $.coin = 0
  $.bean = 0
  await getUserInfo($.nextCode)
  await doSign()
  // 助力好友
  await helpFriends()
  await doTasks()
  await getGrowthReward();//领取解锁的等级奖励
  await getCoin()
  await getUserBean()
  if ( applyJdBean!==0 && applyJdBean<=$.bean){
    await $.wait(1000)
    that.log(`检测您打开了自动兑换开关，去兑换京豆`)
    await doApplyJdBean(applyJdBean)
  }
  await getSpecialJoy();
  await showMsg();
}
async function doTasks() {
  await getTaskInfo()
  for (let j = 0; j < $.taskList.length; ++j) {
    let task = $.taskList[j];
    if (task['taskTypeId'] === 102) {
      message += `${task.taskTitle}：${task['doneTimes']}/${task.ext.count}\n`;
    }
    if (task.status === 0 && task.taskTypeId === 103)
      for (let i = task.doneTimes; i < task.ext.count; ++i) {
        await doTask(task.taskId)
      }
    if (task.status === 2)
      await awardTask(task.taskId)
  }
}
function doApplyJdBean(bean = 1000) {
  // 兑换京豆
  let body = {"paramData":{"bean":bean}}
  return new Promise(async resolve => {
    $.get(taskUrl('crazyJoy_user_applyJdBeanPaid', JSON.stringify(body)), async (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.success) {
              that.log(`兑换${bean}京豆成功`)
              message += `兑换京豆：${bean}京豆成功\n`;
            } else {
              that.log(`兑换${bean}京豆失败，错误信息：${data.resultTips||data.message}`)
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
function getUserInfo(code = "JB9ow1icvgyQnKy8O_HDeQ==") {
  let body = {"paramData": {"inviter": code}}
  return new Promise(async resolve => {
    $.get(taskUrl('crazyJoy_user_gameState', JSON.stringify(body)), async (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.success && data.data && data.data.userInviteCode) {
              that.log(`\n【京东账号${$.index}（${$.nickName || $.UserName}）的${$.name}好友互助码】${data.data.userInviteCode}`)
              $.selfCodes.push(data.data.userInviteCode)
              $.shareId=data.data.userInviteCode;
              $.nextCode = data.data.userInviteCode
              message += `${data.data['nickName']}：${data.data['userTopLevelJoyId']}级JOY\n`;
            }
            else
              that.log(`用户信息获取失败`)
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

async function helpFriends() {
  let codes = $.newShareCodes.concat($.selfCodes)
  for (let code of codes) {
    if (!code) continue
    await helpFriend(code)
    await $.wait(500)
  }
  await setHelp();
}

function getTaskInfo() {
  let body = {"paramData": {"taskType": "DAY_TASK"}}
  return new Promise(async resolve => {
    $.get(taskUrl('crazyJoy_task_getTaskState', JSON.stringify(body)), async (err, resp, data) => {
      try {
        $.taskList = []
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.success && data.data && data.data.length) {
              $.taskList = data.data;
            } else {
              that.log(`任务信息获取失败`)
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

function doSign() {
  return new Promise(async resolve => {
    $.get(taskUrl('crazyJoy_task_doSign'), async (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.success && data.data) {
              that.log(`签到成功，获得${data.data.beans}京豆，${data.data.coins}金币`)
            } else {
              that.log(data.message)
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

function doTask(taskId) {
  let body = {"action": "MARK", "taskId": taskId}
  return new Promise(async resolve => {
    $.get(taskUrl('crazyJoy_task_viewPage', JSON.stringify(body)), async (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.success && data.data && data.data.taskRecordId) {
              that.log(`去做任务【${data.data.taskTitle}】，任务id: ${data.data.taskRecordId}`)
              await $.wait(30000)
              await recordTask(taskId, data.data.taskRecordId)
            } else {
              that.log(`获取信息失败`)
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

function recordTask(taskId, taskRecordId) {
  let body = {"action": "INCREASE", "taskId": taskId, "taskRecordId": taskRecordId}
  return new Promise(async resolve => {
    $.get(taskUrl('crazyJoy_task_viewPage', JSON.stringify(body)), async (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.success) {
              that.log(`任务【${data.data.taskTitle}】记录成功，去领奖`)
              await awardTask(taskId)
            } else {
              that.log(`获取信息失败`)
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

function awardTask(taskId) {
  let body = {"taskId": taskId}
  return new Promise(async resolve => {
    $.get(taskUrl('crazyJoy_task_obtainAward', JSON.stringify(body)), async (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.success && data.data && data.data.taskTitle) {
              that.log(`任务【${data.data.taskTitle}】领奖成功，任务奖励：${data.data.beans}京豆，${data.data.coins}金币`)
            } else {
              that.log(`任务领奖信息获取失败`)
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

function helpFriend(code) {
  let body = {"paramData": {"inviter": code}}
  return new Promise(async resolve => {
    $.get(taskUrl('crazyJoy_task_recordAssist', JSON.stringify(body)), async (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['resultCode'] ==='0') {
              that.log(`助力结果:${JSON.stringify(data)}`);
            } else if (data['resultCode'] === '2000402') {
              that.log(data.resultTips)
            } else {
              that.log(`助力异常:${JSON.stringify(data)}`);
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

function getUserBean() {
  return new Promise(async resolve => {
    $.get(taskUrl('crazyJoy_user_getJdBeanInfo'), async (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.success && data.data && data.data.totalBeans)
              $.bean = data.data.totalBeans
            else
              that.log(`获取信息失败`)
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

function getCoin() {
  return new Promise(async resolve => {
    $.get(taskUrl('crazyJoy_joy_produce'), async (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.data && data.data.totalCoinAmount) {
              $.coin = data.data.totalCoinAmount;
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
//领取解锁等级奖励（京豆）
function getGrowthReward() {
  return new Promise(async resolve => {
    const body = { "paramData":{"eventType":"GROWTH_REWARD"} };
    $.get(taskUrl('crazyJoy_event_getGrowthAndSceneState', JSON.stringify(body)), async (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['resultCode'] === '0') {
              if (data.data) {
                for (let item of data.data) {
                  if (item.status === 1) {
                    if (item.eventRecordId) await obtainAward(item.eventRecordId);
                  }
                }
                if ($.GROWTH_REWARD_BEAN > 0) {
                  message += `解锁等级奖励：获得${$.GROWTH_REWARD_BEAN}京豆\n`;
                }
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
//获取特殊JOY情况
function getSpecialJoy() {
  return new Promise(async resolve => {
    const body = { "paramData":{"typeId": 4} };
    $.get(taskUrl('crazyJoy_user_getSpecialJoy', JSON.stringify(body)), async (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['resultCode'] === '0') {
              if (data.data) {
                message += '五福汪:'
                if (data['data'] && data['data'].length > 0) {
                  for (let item of data['data']) {
                    if (item['joyId'] === 1003) {
                      message += `多多JOY(${item['count']}只) `
                    } else if (item['joyId'] === 1004) {
                      message += `快乐JOY(${item['count']}只) `
                    } else if (item['joyId'] === 1005) {
                      message += `好物JOY(${item['count']}只) `
                    } else if (item['joyId'] === 1006) {
                      message += `省钱JOY(${item['count']}只) `
                    } else if (item['joyId'] === 1007) {
                      message += `东东JOY(${item['count']}只)`
                    } else {
                      message += `暂无`
                    }
                  }
                } else {
                  message += `暂无`;
                }
                if (data['data'].length >= 5) {
                  $.msg($.name, '', `京东账号 ${$.index}${$.nickName}\n恭喜你,已集成五福汪可合成分红JOY了`)
                  if ($.isNode()) await notify.sendNotify(`${$.name} - ${$.index} - ${$.nickName}`, `京东账号 ${$.index}${$.nickName}\n恭喜你,已集成五福汪可合成分红JOY了`);
                }
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
function obtainAward(eventRecordId) {
  return new Promise(async resolve => {
    const body = {"eventType": "GROWTH_REWARD", eventRecordId};
    $.get(taskUrl('crazyJoy_event_obtainAward', JSON.stringify(body)), async (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['resultCode'] === '0') {
              $.GROWTH_REWARD_BEAN += data.data['beans'];
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
function showMsg() {
  return new Promise(async resolve => {
    message += `\n当前信息：${$.bean}京豆，${$.coin}金币`
    $.msg($.name, '', `京东账号${$.index} ${$.nickName}\n${message}`)
    resolve()
  })
}
function taskUrl(functionId, body = '') {
  let t = Date.now().toString().substr(0, 10)
  let e = body || ""
  e = $.md5("aDvScBv$gGQvrXfva8dG!ZC@DA70Y%lX" + e + t)
  e = e + Number(t).toString(16)
  return {
    url: `${JD_API_HOST}?uts=${e}&appid=crazy_joy&functionId=${functionId}&body=${escape(body)}&t=${t}`,
    headers: {
      'Cookie': cookie,
      'Host': 'api.m.jd.com',
      'Accept': '*/*',
      'Connection': 'keep-alive',
      "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0"),
      'Accept-Language': 'zh-cn',
      'Referer': 'https://crazy-joy.jd.com/',
      'origin': 'https://crazy-joy.jd.com',
      'Accept-Encoding': 'gzip, deflate, br',
    }
  }
}
function readShareCode() {
  that.log(`开始`)
  return new Promise(async resolve => {
    $.get({url: `https://code.chiang.fun/api/v1/jd/jdcrazyjoy/read/${randomCount}/`, 'timeout': 10000}, (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            that.log(`随机取${randomCount}个码放到您固定的互助码后面(不影响已有固定互助)`)
            data = JSON.parse(data);
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
    await $.wait(10000);
    resolve()
  })
}
//格式化助力码
function shareCodesFormat() {
  return new Promise(async resolve => {
    // that.log(`第${$.index}个京东账号的助力码:::${$.shareCodesArr[$.index - 1]}`)
    $.newShareCodes = [];
    await getHelp();
    resolve();
  })
}

function requireConfig() {
  return new Promise(resolve => {
    that.log(`开始获取${$.name}配置文件\n`);
    //Node.js用户请在jdCookie.js处填写京东ck;
    let shareCodes = [];
    if ($.isNode()) {
      if (process.env.JDJOY_SHARECODES) {
        if (process.env.JDJOY_SHARECODES.indexOf('\n') > -1) {
          shareCodes = process.env.JDJOY_SHARECODES.split('\n');
        } else {
          shareCodes = process.env.JDJOY_SHARECODES.split('&');
        }
      }
      if (process.env.JDJOY_HELPSELF) {
        helpSelf = process.env.JDJOY_HELPSELF
      }
      if (process.env.JDJOY_APPLYJDBEAN) {
        applyJdBean = process.env.JDJOY_APPLYJDBEAN
      }
    }
    that.log(`共${cookiesArr.length}个京东账号\n`);
    $.shareCodesArr = [];
    if ($.isNode()) {
      Object.keys(shareCodes).forEach((item) => {
        if (shareCodes[item]) {
          $.shareCodesArr.push(shareCodes[item])
        }
      })
    }
    
    that.log(`您提供了${$.shareCodesArr.length}个账号的${$.name}助力码\n`);
    resolve()
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

function getHelp() {
		$.newShareCodes = [];
		return new Promise(resolve => {
			that.get({
				url: "https://actapi.tyh52.com/act/get/jdcrazy/6"
			}, (err, resp, data) => {
				try {
					if (data) {
						data = JSON.parse(data);
						if (data.code == 1) {
							let list = data.data;
							try {
								if (!(list instanceof Array)) {
									list = JSON.parse(list);
								}
							} catch (dd) {}
							if (list.length > 0) {
								for (var i in list) {
									$.newShareCodes.push(list[i]);
								}
							}
						}
					}
				} catch (e) {
					that.log(e);
				} finally {
					resolve(data);
				}
			})
		});

	}

	function setHelp() {
		return new Promise(resolve => {
			if ($.shareId) {
				that.get({
					url: "https://actapi.tyh52.com/act/set/jdcrazy/" + $.shareId
				}, (err, resp, data) => {
					try {
						if (data) {
							data = JSON.parse(data);
							if (data.code == 1) {
								that.log("提交自己的邀請碼成功");
							} else {
								that.log("提交邀请码失败，" + data.message);
							}
						}
					} catch (e) {
						that.log(e);
					} finally {
						resolve(data);
					}
				})
			} else {
				resolve();
			}
		});
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
            $.nickName = data['base'].nickname;
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
/**
 * 生成随机数字
 * @param {number} min 最小值（包含）
 * @param {number} max 最大值（不包含）
 */
function randomNumber(min = 0, max = 100) {
  return Math.min(Math.floor(min + Math.random() * (max - min)), max);
}