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
} else {
  cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}
const JD_API_HOST = 'https://api.m.jd.com/client.action';
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
      await jdMs()
    }
  }
})()
  .catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
  })
  .finally(() => {
    $.done();
  })

async function jdMs() {
  $.score = 0
  await getActInfo()
  await getUserInfo()
  $.cur = $.score
  if ($.encryptProjectId) {
    await getTaskList()
  }
  await getUserInfo(false)
  await showMsg()
}

function getActInfo() {
  return new Promise(resolve => {
    $.post(taskPostUrl('assignmentList', {}, 'appid=jwsp'), (err, resp, data) => {
      try {
        if (err) {
          that.log(`${err},${jsonParse(resp.body)['message']}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data)
            if (data.code === 200) {
              $.encryptProjectId = data.result.assignmentResult.encryptProjectId
              that.log(`活动名称：${data.result.assignmentResult.projectName}`)
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
function getUserInfo(info=true) {
  return new Promise(resolve => {
    $.post(taskPostUrl('homePageV2', {}, 'appid=SecKill2020'), (err, resp, data) => {
      try {
        if (err) {
          that.log(`${err},${jsonParse(resp.body)['message']}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data)
            if (data.code === 2041) {
              $.score = data.result.assignment.assignmentPoints || 0
              if(info) that.log(`当前秒秒币${$.score}`)
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
function getTaskList() {
  let body = {"encryptProjectId": $.encryptProjectId, "sourceCode": "wh5"}
  return new Promise(resolve => {
    $.post(taskPostUrl('queryInteractiveInfo', body), async (err, resp, data) => {
      try {
        if (err) {
          that.log(`${err},${jsonParse(resp.body)['message']}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data)
            $.risk = false
            if (data.code === '0') {
              for (let vo of data.assignmentList) {
                if($.risk) break
                if (vo['completionCnt'] < vo['assignmentTimesLimit']) {
                  if (vo['assignmentType'] === 1) {
                    if(vo['ext'][vo['ext']['extraType']].length === 0) continue;
                    for (let i = vo['completionCnt']; i < vo['assignmentTimesLimit']; ++i) {
                      that.log(`去做${vo['assignmentName']}任务：${i + 1}/${vo['assignmentTimesLimit']}`)
                      let body = {
                        "encryptAssignmentId": vo['encryptAssignmentId'],
                        "itemId": vo['ext'][vo['ext']['extraType']][i]['itemId'],
                        "actionType": 1,
                        "completionFlag": ""
                      }
                      await doTask(body)
                      await $.wait(vo['ext']['waitDuration'] * 1000 + 500)
                      body['actionType'] = 0
                      await doTask(body)
                    }
                  } else if (vo['assignmentType'] === 0) {
                    for (let i = vo['completionCnt']; i < vo['assignmentTimesLimit']; ++i) {
                      that.log(`去做${vo['assignmentName']}任务：${i + 1}/${vo['assignmentTimesLimit']}`)
                      let body = {
                        "encryptAssignmentId": vo['encryptAssignmentId'],
                        "itemId": "",
                        "actionType": "0",
                        "completionFlag": true
                      }
                      await doTask(body)
                      await $.wait(1000)
                    }
                  } else if (vo['assignmentType'] === 3) {
                    for (let i = vo['completionCnt']; i < vo['assignmentTimesLimit']; ++i) {
                      that.log(`去做${vo['assignmentName']}任务：${i + 1}/${vo['assignmentTimesLimit']}`)
                      let body = {
                        "encryptAssignmentId": vo['encryptAssignmentId'],
                        "itemId": vo['ext'][vo['ext']['extraType']][i]['itemId'],
                        "actionType": 0,
                        "completionFlag": ""
                      }
                      await doTask(body)
                      await $.wait(1000)
                    }
                  }
                }
              }
            } else {
              that.log(data)
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

function doTask(body) {
  body = {...body, "encryptProjectId": $.encryptProjectId, "sourceCode": "wh5", "ext": {}}
  return new Promise(resolve => {
    $.post(taskPostUrl('doInteractiveAssignment', body), (err, resp, data) => {
      try {
        if (err) {
          that.log(`${err},${jsonParse(resp.body)['message']}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data)
            that.log(data.msg)
            if(data.msg==='风险等级未通过') $.risk =1
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

function showMsg() {
  return new Promise(resolve => {
    message += `本次运行获得秒秒币${$.score-$.cur}枚，共${$.score}枚`;
    $.msg($.name, '', `京东账号${$.index}${$.nickName}\n${message}`);
    resolve()
  })
}


function taskPostUrl(function_id, body = {}, extra = '', function_id2) {
  let url = `${JD_API_HOST}`;
  if (function_id2) {
    url += `?functionId=${function_id2}`;
  }
  return {
    url,
    body: `functionId=${function_id}&body=${escape(JSON.stringify(body))}&client=wh5&clientVersion=1.0.0&${extra}`,
    headers: {
      "Cookie": cookie,
      "origin": "https://h5.m.jd.com",
      "referer": "https://h5.m.jd.com/babelDiy/Zeus/2NUvze9e1uWf4amBhe1AV6ynmSuH/index.html",
      'Content-Type': 'application/x-www-form-urlencoded',
      "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
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
