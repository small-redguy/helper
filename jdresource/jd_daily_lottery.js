/*
每日抽奖
活动时间：2021-05-01至2021-05-31
更新时间：2021-5-7
活动入口：京东APP首页搜索 "玩一玩"，每日抽奖
脚本兼容: QuantumultX, Surge, Loon, JSBox, Node.js
===================quantumultx================
[task_local]
#每日抽奖
13 1,22,23 * * * https://jdsharedresourcescdn.azureedge.net/jdresource/jd_daily_lottery.js, tag=每日抽奖, img-url=https://raw.githubusercontent.com/Orz-3/mini/master/Color/jd.png, enabled=true

=====================Loon================
[Script]
cron "13 1,22,23 * * *" script-path=https://jdsharedresourcescdn.azureedge.net/jdresource/jd_daily_lottery.js, tag=每日抽奖

====================Surge================
每日抽奖 = type=cron,cronexp="13 1,22,23 * * *",wake-system=1,timeout=3600,script-path=https://jdsharedresourcescdn.azureedge.net/jdresource/jd_daily_lottery.js

============小火箭=========
每日抽奖 = type=cron,script-path=https://jdsharedresourcescdn.azureedge.net/jdresource/jd_daily_lottery.js, cronexpr="13 1,22,23 * * *", timeout=3600, enable=true
*/
$.toObj=(t, e = null)=> {
			try {
				return JSON.parse(t)
			} catch {
				return e
			}
		}
		$.toStr=(t, e = null)=> {
			try {
				return JSON.stringify(t)
			} catch {
				return e
			}
		}
const notify = $.isNode() ? require('./sendNotify') : '';
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
const activityCode = '1386931424925319168';
$.helpCodeList = [];
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [], cookie = '';
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') that.log = () => {};
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
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=(.+?);/) && cookie.match(/pt_pin=(.+?);/)[1])
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = $.UserName;
      await TotalBean();
      that.log(`\n*****开始【京东账号${$.index}】${$.nickName || $.UserName}*****\n`);
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});

        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }
        continue
      }

      await dailyLottery()
    }
  }
  for (let i = 0; i < $.helpCodeList.length && cookiesArr.length > 0; i++) {
    if ($.helpCodeList[i].needHelp === 0) {
      continue;
    }
    for (let j = 0; j < cookiesArr.length && $.helpCodeList[i].needHelp !== 0; j++) {
      $.helpFlag = '';
      cookie = cookiesArr[j];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=(.+?);/) && cookie.match(/pt_pin=(.+?);/)[1])
      if ($.helpCodeList[i].use === $.UserName) {
        continue;
      }
      that.log(`${$.UserName}助力:${$.helpCodeList[i].helpCpde}`);
      await helpFriend($.helpCodeList[i].helpCpde);
      if ($.helpFlag === true) {
        $.helpCodeList[i].needHelp -= 1;
      }
      cookiesArr.splice(j, 1);
      j--;
    }
  }

})()
    .catch((e) => {
      $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
    })
    .finally(() => {
      $.done();
    })

async function dailyLottery() {
  $.lotteryInfo = {};
  $.missionList = [];
  await Promise.all([getLotteryInfo(), getQueryMissionList()]);
  that.log(`初始化`);
  if ($.lotteryInfo.success !== true) {
    that.log(`${$.UserName}数据异常，执行失败`);
    return;
  }
  if ($.missionList.length === 0) {
    that.log(`${$.UserName}获取任务列表失败`);
  } else {
    await doMission();//做任务
    await $.wait(1000);
    await Promise.all([getLotteryInfo(), getQueryMissionList()]);
    // await doMission();//做任务
    // await $.wait(1000);
    // await Promise.all([getLotteryInfo(), getQueryMissionList()]);
  }
  await $.wait(1000);
  if ($.missionList.length === 0) {
    that.log(`${$.UserName}获取任务列表失败`);
  } else {
    await collectionTimes();//领任务奖励
    await $.wait(1000);
    await Promise.all([getLotteryInfo(), getQueryMissionList()]);
  }
  let drawNum = $.lotteryInfo.content.drawNum || 0;
  that.log(`共有${drawNum}次抽奖机会`);
  $.drawNumber = 1;
  for (let i = 0; i < drawNum; i++) {
    await $.wait(2000);
    //执行抽奖
    await lotteryDraw();
    $.drawNumber++;
  }
}

//助力
async function helpFriend(missionNo) {
  const body = `[{"userNo":"$cooMrdGatewayUid$","missionNo":"${missionNo}"}]`;
  const myRequest = getPostRequest('luckdraw/helpFriend', body);
  return new Promise(async resolve => {
    $.post(myRequest, (err, resp, data) => {
      try {
        /*
        * {"code":1,"content":true,"data":true,"errorMsg":"SUCCESS","msg":"SUCCESS","success":true}
        * */
        that.log(`助力结果:${data}`);
        data = JSON.parse(data);
        if (data.success === true && data.content === true) {
          that.log(`助力成功`);
          $.helpFlag = true;
        } else {
          $.helpFlag = false;
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

//做任务
async function collectionTimes() {
  that.log(`开始领任务奖励`);
  for (let i = 0; i < $.missionList.length; i++) {
    await $.wait(1000);
    if ($.missionList[i].status === 11) {
      let getRewardNos = $.missionList[i].getRewardNos;
      for (let j = 0; j < getRewardNos.length; j++) {
        await collectionOneMission($.missionList[i].title, getRewardNos[j]);//领奖励
        await $.wait(2000);
      }
    }
  }
}

//做任务
async function doMission() {
  that.log(`开始执行任务`);
  for (let i = 0; i < $.missionList.length; i++) {
    if ($.missionList[i].status !== 1) {
      continue;
    }
    await $.wait(3000);
    if ($.missionList[i].jumpType === 135) {
      await doOneMission($.missionList[i]);
    } else if ($.missionList[i].jumpType === 1) {
      await createInvitation($.missionList[i]);
    }
  }
}

//邀请好友来抽奖
async function createInvitation(missionInfo) {
  const body = `[{"userNo":"$cooMrdGatewayUid$","activityCode":"${activityCode}"}]`;
  const myRequest = getPostRequest('luckdraw/createInvitation', body)
  return new Promise(async resolve => {
    $.post(myRequest, (err, resp, data) => {
      try {
        //{"code": 1,"content": "ML:786c65ea-ca5c-4b3b-8b07-7ca5adaa8deb","data": "ML:786c65ea-ca5c-4b3b-8b07-7ca5adaa8deb","errorMsg": "SUCCESS","msg": "SUCCESS","success": true}
        data = JSON.parse(data);
        if (data.success === true) {
          $.helpCodeList.push({
            'use': $.UserName,
            'helpCpde': data.data,
            'needHelp': missionInfo['totalNum'] - missionInfo['completeNum']
          });
          that.log(`互助码(内部多账号自己互助)：${data.data}`);
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

//领奖励
async function collectionOneMission(title, getRewardNo) {
  const body = `[{"userNo":"$cooMrdGatewayUid$","activityCode":"${activityCode}","getCode":"${getRewardNo}"}]`;
  const myRequest = getPostRequest('luckDraw/getDrawChance', body);
  return new Promise(async resolve => {
    $.post(myRequest, (err, resp, data) => {
      try {
        data = JSON.parse(data);
        if (data.success === true) {
          that.log(`${title}，领取任务奖励成功`);
        } else {
          that.log(JSON.stringify(data));
          that.log(`${title}，领取任务执行失败`);
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

//做任务
async function doOneMission(missionInfo) {
  const body = `[{"userNo":"$cooMrdGatewayUid$","activityCode":"${activityCode}","missionNo":"${missionInfo.missionNo}","params":${JSON.stringify(missionInfo.params)}}]`;
  const myRequest = getPostRequest('luckdraw/completeMission', body);
  return new Promise(async resolve => {
    $.post(myRequest, (err, resp, data) => {
      try {
        data = JSON.parse(data);
        if (data.success === true) {
          that.log(`${missionInfo.title}，任务执行成功`);
        } else {
          that.log(JSON.stringify(data));
          that.log(`${missionInfo.title}，任务执行失败`);
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

//获取任务列表
async function getQueryMissionList() {
  const body = `[{"userNo":"$cooMrdGatewayUid$","activityCode":"${activityCode}"}]`;
  const myRequest = getPostRequest('luckdraw/queryMissionList', body)
  return new Promise(async resolve => {
    $.post(myRequest, (err, resp, data) => {
      try {
        data = JSON.parse(data);
        if (data.success === true) {
          $.missionList = data.content.missionList;
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

//获取信息
async function getLotteryInfo() {
  const body = `[{"userNo":"$cooMrdGatewayUid$","activityCode":"${activityCode}"}]`;
  const myRequest = getPostRequest('luckdraw/queryActivityBaseInfo', body)
  return new Promise(async resolve => {
    $.post(myRequest, (err, resp, data) => {
      try {
        $.lotteryInfo = JSON.parse(data);
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}


async function lotteryDraw() {
  const body = `[{"userNo":"$cooMrdGatewayUid$","activityCode":"${activityCode}"}]`;
  const myRequest = getPostRequest('luckdraw/draw', body)
  return new Promise(async resolve => {
    $.post(myRequest, (err, resp, data) => {
      try {
        //that.log(`${data}`);
        data = JSON.parse(data);
        if (data.success === true) {
          that.log(`${$.name}第${$.drawNumber}次抽奖，获得：${data.content.rewardDTO.title || ' '}`);
        } else {
          that.log(`${$.name}第${$.drawNumber}次抽奖失败`);
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

function getPostRequest(type, body) {
  const url = `https://lop-proxy.jd.com/${type}`;
  const method = `POST`;
  const headers = {
    'Accept-Encoding': `gzip, deflate, br`,
    'Host': `lop-proxy.jd.com`,
    'Origin': `https://jingcai-h5.jd.com`,
    'Connection': `keep-alive`,
    'biz-type': `service-monitor`,
    'Accept-Language': `zh-cn`,
    'version': `1.0.0`,
    'Content-Type': `application/json;charset=utf-8`,
    "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0"),
    'Referer': `https://jingcai-h5.jd.com`,
    'ClientInfo': `{"appName":"jingcai","client":"m"}`,
    'access': `H5`,
    'Accept': `application/json, text/plain, */*`,
    'jexpress-report-time': `${new Date().getTime()}`,
    'source-client': `2`,
    'X-Requested-With': `XMLHttpRequest`,
    'Cookie': cookie,
    'LOP-DN': `jingcai.jd.com`,
    'AppParams': `{"appid":158,"ticket_type":"m"}`,
    'app-key': `jexpress`
  };
  return {url: url, method: method, headers: headers, body: body};
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
