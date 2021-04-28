const notify = $.isNode() ? require('./sendNotify') : '';
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';

//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [], cookie = '', message = '', allMessage = '';
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') that.log = () => {};
} else {
  cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}
let superShakeBeanConfig = {
  "superShakeUlr": "",//超级摇一摇活动链接
  "superShakeBeanFlag": false,
  "superShakeTitle": "",
  "taskVipName": "",
}
$.assigFirends = [];
$.brandActivityId = '2f707380-ebc9-4b4f-bc39-cc2c7702ca0e';//超级品牌日活动ID
$.brandActivityId2 = '2vSNXCeVuBy8mXTL2hhG3mwSysoL';//超级品牌日活动ID2
const JD_API_HOST = 'https://api.m.jd.com/client.action';
!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
    return;
  }
  await welcomeHome()
  if (superShakeBeanConfig['superShakeUlr']) {
    await getActInfo(superShakeBeanConfig['superShakeUlr']);
  }
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      $.index = i + 1;
      $.freeTimes = 0;
      $.prizeBeanCount = 0;
      $.totalBeanCount = 0;
      $.superShakeBeanNum = 0;
      $.isLogin = true;
      $.nickName = '';
      message = ''
      await TotalBean();
      that.log(`\n开始【京东账号${$.index}】${$.nickName || $.UserName}\n`);
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});

        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }
        continue
      }
      await clubLottery();
      await showMsg();
    }
  }
  for (let v = 0; v < cookiesArr.length; v++) {
    cookie = cookiesArr[v];
    $.index = v + 1;
    $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]);
    $.canHelp = true;
    if ($.canHelp && $.activityId) {
      $.assigFirends = $.assigFirends.concat({
        "encryptAssignmentId": "2mPXah3aWb3Q86kkaCMhey6sNYR4",
        "assignmentType": 2,
        "itemId": "SZm_olqSxIOtH97BATGmKoWraLaw",
      })
      for (let item of $.assigFirends || []) {
        if (item['encryptAssignmentId'] && item['assignmentType'] && item['itemId']) {
          that.log(`\n账号 ${$.index} ${$.UserName} 开始给 ${item['itemId']} 进行助力`)
          await superBrandDoTask({
            "activityId": $.activityId,
            "encryptProjectId": $.encryptProjectId,
            "encryptAssignmentId": item['encryptAssignmentId'],
            "assignmentType": item['assignmentType'],
            "itemId": item['itemId'],
            "actionType": 0,
            "source": "main"
          });
          if (!$.canHelp) {
            that.log(`次数已用完，跳出助力`)
            break
          }
        }
      }
    }
  }
  if (allMessage) {
    if ($.isNode()) await notify.sendNotify($.name, allMessage);
  }
  if (superShakeBeanConfig.superShakeUlr) {
    const scaleUl = { "category": "jump", "des": "m", "url": superShakeBeanConfig['superShakeUlr'] };
    const openjd = `openjd://virtual?params=${encodeURIComponent(JSON.stringify(scaleUl))}`;
    if ($.isNode()) await notify.sendNotify($.name, `【${superShakeBeanConfig['superShakeTitle']}】活动再次开启\n【${superShakeBeanConfig['taskVipName'] || '开通会员'}】如需做此任务,请点击链接直达活动页面\n${superShakeBeanConfig['superShakeUlr']}\n【超级品牌日】${$.superbrandUrl}`, { url: openjd });
    $.msg($.name, superShakeBeanConfig['superShakeTitle'], `【超级摇一摇】活动再次开启\n【${superShakeBeanConfig['taskVipName'] || '开通会员'}】如需做此任务,请点击弹窗直达活动页面`, { 'open-url': openjd })
  }
})()
    .catch((e) => {
      $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
    })
    .finally(() => {
      $.done();
    })

async function clubLottery() {
  try {
    await doTasks();//做任务
    await getFreeTimes();//获取摇奖次数
    await vvipclub_receive_lottery_times();//京东会员：领取一次免费的机会
    await vvipclub_shaking_info();//京东会员：查询多少次摇奖次数
    await shaking();//开始摇奖
    await shakeSign();
    await superShakeBean();//京东APP首页超级摇一摇
    await superbrandShakeBean();//京东APP首页超级品牌日
  } catch (e) {
    $.logErr(e)
  }
}
async function doTasks() {
  const browseTaskRes = await getTask('browseTask');
  if (browseTaskRes.success) {
    const { totalPrizeTimes, currentFinishTimes, taskItems } = browseTaskRes.data[0];
    const taskTime = totalPrizeTimes - currentFinishTimes;
    if (taskTime > 0) {
      let taskID = [];
      taskItems.map(item => {
        if (!item.finish) {
          taskID.push(item.id);
        }
      });
      if (taskID.length > 0) that.log(`开始做浏览页面任务`)
      for (let i = 0; i < new Array(taskTime).fill('').length; i++) {
        await $.wait(1000);
        await doTask('browseTask', taskID[i]);
      }
    }
  } else {
    that.log(`${JSON.stringify(browseTaskRes)}`)
  }
  const attentionTaskRes = await getTask('attentionTask');
  if (attentionTaskRes.success) {
    const { totalPrizeTimes, currentFinishTimes, taskItems } = attentionTaskRes.data[0];
    const taskTime = totalPrizeTimes - currentFinishTimes;
    if (taskTime > 0) {
      let taskID = [];
      taskItems.map(item => {
        if (!item.finish) {
          taskID.push(item.id);
        }
      });
      that.log(`开始做关注店铺任务`)
      for (let i = 0; i < new Array(taskTime).fill('').length; i++) {
        await $.wait(1000);
        await doTask('attentionTask', taskID[i].toString());
      }
    }
  }
}
async function shaking() {
  for (let i = 0; i < new Array($.leftShakingTimes).fill('').length; i++) {
    that.log(`开始 【京东会员】 摇奖`)
    await $.wait(1000);
    const newShakeBeanRes = await vvipclub_shaking_lottery();
    if (newShakeBeanRes.success) {
      that.log(`京东会员-剩余摇奖次数：${newShakeBeanRes.data.remainLotteryTimes}`)
      if (newShakeBeanRes.data && newShakeBeanRes.data.rewardBeanAmount) {
        $.prizeBeanCount += newShakeBeanRes.data.rewardBeanAmount;
        that.log(`恭喜你，京东会员中奖了，获得${newShakeBeanRes.data.rewardBeanAmount}京豆\n`)
      } else {
        that.log(`未中奖\n`)
      }
    }
  }
  for (let i = 0; i < new Array($.freeTimes).fill('').length; i++) {
    that.log(`开始 【摇京豆】 摇奖`)
    await $.wait(1000);
    const shakeBeanRes = await shakeBean();
    if (shakeBeanRes.success) {
      that.log(`剩余摇奖次数：${shakeBeanRes.data.luckyBox.freeTimes}`)
      if (shakeBeanRes.data && shakeBeanRes.data.prizeBean) {
        that.log(`恭喜你，中奖了，获得${shakeBeanRes.data.prizeBean.count}京豆\n`)
        $.prizeBeanCount += shakeBeanRes.data.prizeBean.count;
        $.totalBeanCount = shakeBeanRes.data.luckyBox.totalBeanCount;
      } else if (shakeBeanRes.data && shakeBeanRes.data.prizeCoupon) {
        that.log(`获得优惠券：${shakeBeanRes.data.prizeCoupon['limitStr']}\n`)
      } else {
        that.log(`摇奖其他未知结果：${JSON.stringify(shakeBeanRes)}\n`)
      }
    }
  }
  if ($.prizeBeanCount > 0) message += `摇京豆：获得${$.prizeBeanCount}京豆`;
}
function showMsg() {
  return new Promise(resolve => {
    if (message) {
      $.msg(`${$.name}`, `京东账号${$.index} ${$.nickName}`, message);
    }
    resolve();
  })
}
//====================API接口=================
//查询剩余摇奖次数API
function vvipclub_shaking_info() {
  return new Promise(resolve => {
    const options = {
      url: `https://api.m.jd.com/?t=${Date.now()}&appid=sharkBean&functionId=vvipclub_shaking_info`,
      headers: {
        "accept": "application/json",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "zh-CN,zh;q=0.9",
        "cookie": cookie,
        "origin": "https://skuivip.jd.com",
        "referer": "https://skuivip.jd.com/",
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
      }
    }
    $.get(options, (err, resp, data) => {
      try {
        if (err) {
          that.log(`\n${$.name}: API查询请求失败 ‼️‼️`)
          $.logErr(err);
        } else {
          // that.log(data)
          data = JSON.parse(data);
          if (data.success) {
            $.leftShakingTimes = data.data.leftShakingTimes;//剩余抽奖次数
            that.log(`京东会员——摇奖次数${$.leftShakingTimes}`);
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
//京东会员摇奖API
function vvipclub_shaking_lottery() {
  return new Promise(resolve => {
    const options = {
      url: `https://api.m.jd.com/?t=${Date.now()}&appid=sharkBean&functionId=vvipclub_shaking_lottery&body=%7B%7D`,
      headers: {
        "accept": "application/json",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "zh-CN,zh;q=0.9",
        "cookie": cookie,
        "origin": "https://skuivip.jd.com",
        "referer": "https://skuivip.jd.com/",
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
      }
    }
    $.get(options, (err, resp, data) => {
      try {
        if (err) {
          that.log(`\n${$.name}: API查询请求失败 ‼️‼️`)
          $.logErr(err);
        } else {
          // that.log(data)
          data = JSON.parse(data);
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}
//领取京东会员本摇一摇一次免费的次数
function vvipclub_receive_lottery_times() {
  return new Promise(resolve => {
    const options = {
      url: `https://api.m.jd.com/?t=${Date.now()}&appid=sharkBean&functionId=vvipclub_receive_lottery_times`,
      headers: {
        "accept": "application/json",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "zh-CN,zh;q=0.9",
        "cookie": cookie,
        "origin": "https://skuivip.jd.com",
        "referer": "https://skuivip.jd.com/",
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
      }
    }
    $.get(options, (err, resp, data) => {
      try {
        if (err) {
          that.log(`\n${$.name}: API查询请求失败 ‼️‼️`)
          $.logErr(err);
        } else {
          // that.log(data)
          data = JSON.parse(data);
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}
//查询多少次机会
function getFreeTimes() {
  return new Promise(resolve => {
    $.get(taskUrl('vvipclub_luckyBox', { "info": "freeTimes" }), (err, resp, data) => {
      try {
        if (err) {
          that.log(`\n${$.name}: API查询请求失败 ‼️‼️`)
          $.logErr(err);
        } else {
          // that.log(data)
          data = JSON.parse(data);
          if (data.success) {
            $.freeTimes = data.data.freeTimes;
            that.log(`摇京豆——摇奖次数${$.freeTimes}`);
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
function getTask(info) {
  return new Promise(resolve => {
    $.get(taskUrl('vvipclub_lotteryTask', { info, "withItem": true }), (err, resp, data) => {
      try {
        if (err) {
          that.log(`\n${$.name}: API查询请求失败 ‼️‼️`)
          $.logErr(err);
        } else {
          // that.log(data)
          data = JSON.parse(data);
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}
function doTask(taskName, taskItemId) {
  return new Promise(resolve => {
    $.get(taskUrl('vvipclub_doTask', { taskName, taskItemId }), (err, resp, data) => {
      try {
        if (err) {
          that.log(`\n${$.name}: API查询请求失败 ‼️‼️`)
          $.logErr(err);
        } else {
          // that.log(data)
          data = JSON.parse(data);
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}
function shakeBean() {
  return new Promise(resolve => {
    $.get(taskUrl('vvipclub_shaking', { "type": '0' }), (err, resp, data) => {
      try {
        if (err) {
          that.log(`\n${$.name}: API查询请求失败 ‼️‼️`)
          $.logErr(err);
        } else {
          // that.log(`摇奖结果:${data}`)
          data = JSON.parse(data);
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}
//超级摇一摇(此处功能部分京东API抓包自：https://github.com/i-chenzhe/qx/blob/main/jd_shake.js)
async function superShakeBean() {
  await superBrandMainPage();
  if ($.activityId && $.encryptProjectId) {
    await superBrandTaskList();
    await superBrandDoTaskFun();
    await superBrandMainPage();
    await lo();
  }
  if ($.ActInfo) {
    await fc_getHomeData($.ActInfo);//获取任务列表
    await doShakeTask($.ActInfo);//做任务
    await fc_getHomeData($.ActInfo, true);//做完任务后查询多少次摇奖次数
    await superShakeLottery($.ActInfo);//开始摇奖
  } else {
    // that.log(`\n\n京东APP首页超级摇一摇：目前暂无活动\n\n`)
  }
}
function welcomeHome() {
  return new Promise(resolve => {
    const data = {
      "homeAreaCode": "",
      "identity": "88732f840b77821b345bf07fd71f609e6ff12f43",
      "fQueryStamp": "",
      "globalUIStyle": "9.0.0",
      "showCate": "1",
      "tSTimes": "",
      "geoLast": "",
      "geo": "",
      "cycFirstTimeStamp": "",
      "displayVersion": "9.0.0",
      "geoReal": "",
      "controlMaterials": "",
      "xviewGuideFloor": "index,category,find,cart,home",
      "fringe": "",
      "receiverGeo": ""
    }
    const options = {
      url: `https://api.m.jd.com/client.action?functionId=welcomeHome&body=${escape(JSON.stringify(data))}&uuid=8888888&client=apple&clientVersion=9.4.1&st=1618538579097&sign=e29d09be25576be52ec22a3bb74d4f86&sv=100`,
      body: `body=${escape(JSON.stringify(data))}`,
      headers: {
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-Hans-CN;q=1, zh-Hant-CN;q=0.9",
        "Connection": "keep-alive",
        "Content-Length": "1761",
        "Content-Type": "application/x-www-form-urlencoded",
        "Host": "api.m.jd.com",
        "User-Agent": "JD4iPhone/167588 (iPhone; iOS 14.3; Scale/2.00)"
      }
    }
    $.post(options, async (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} welcomeHome API请求失败，请检查网路重试`)
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data['floorList'] && data['floorList'].length) {
              const shakeFloorNew = data['floorList'].filter(vo => !!vo && vo.type === 'shakeFloorNew')[0];
              const shakeFloorNew2 = data['floorList'].filter(vo => !!vo && vo.type === 'float')[0];
              // that.log('shakeFloorNew2', JSON.stringify(shakeFloorNew2))
              if (shakeFloorNew) {
                const jump = shakeFloorNew['jump'];
                if (jump && jump.params && jump['params']['url']) {
                  superShakeBeanConfig['superShakeUlr'] = jump.params.url;
                  that.log(`【超级摇一摇】活动链接：${superShakeBeanConfig['superShakeUlr']}`);
                }
              }
              if (shakeFloorNew && shakeFloorNew2) {
                const jump = shakeFloorNew2['jump'];
                if (jump && jump.params && jump['params']['url']) {
                  that.log(`【超级品牌日】活动链接：${jump.params.url}`);
                  $.superbrandUrl = jump.params.url;
                }
              }
            }
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
//===================新版超级本摇一摇==============
function superBrandMainPage() {
  return new Promise(resolve => {
    const body = {"source":"main"};
    const options = superShakePostUrl('superBrandMainPage', body)
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} superBrandTaskList API请求失败，请检查网路重试`)
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data['code'] === '0' && data['data']['bizCode'] === '0') {
              $.activityId = data['data']['result']['activityBaseInfo']['activityId'];
              $.encryptProjectId = data['data']['result']['activityBaseInfo']['encryptProjectId'];
              $.activityName = data['data']['result']['activityBaseInfo']['activityName'];
              $.userStarNum = Number(data['data']['result']['activityUserInfo']['userStarNum']) || 0;
              superShakeBeanConfig['superShakeTitle'] = $.activityName;
              that.log(`${$.activityName} 当前共有积分：${$.userStarNum}，可抽奖：${parseInt($.userStarNum / 100)}次(最多4次摇奖机会)\n`);
            } else {
              that.log(`获取超级摇一摇信息异常：${JSON.stringify(data)}`);
            }
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
function superBrandTaskList() {
  return new Promise(resolve => {
    $.taskList = [];
    const body = {"activityId": $.activityId, "assistInfoFlag": 4, "source": "main"};
    const options = superShakePostUrl('superBrandTaskList', body)
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} superBrandTaskList API请求失败，请检查网路重试`)
        } else {
          if (data) {
            // that.log(data);
            data = JSON.parse(data);
            if (data['code'] === '0' && data['data']['bizCode'] === '0') {
              $.taskList = data['data']['result']['taskList'];
              $.canLottery = $.taskList.filter(vo => !!vo && vo['assignmentTimesLimit'] === 4)[0]['completionFlag']
            } else {
              that.log(`获取超级摇一摇任务异常：${JSON.stringify(data)}`);
            }
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
async function superBrandDoTaskFun() {
  $.taskList = $.taskList.filter(vo => !!vo && !vo['completionFlag'] && (vo['assignmentType'] !== 6 && vo['assignmentType'] !== 7 && vo['assignmentType'] !== 0 && vo['assignmentType'] !== 30));
  for (let item of $.taskList) {
    if (item['assignmentType'] === 1) {
      const { ext } = item;
      that.log(`开始做 ${item['assignmentName']}，需等待${ext['waitDuration']}秒`);
      const shoppingActivity = ext['shoppingActivity'];
      for (let task of shoppingActivity) {
        await superBrandDoTask({
          "activityId": $.activityId,
          "encryptProjectId": $.encryptProjectId,
          "encryptAssignmentId": item['encryptAssignmentId'],
          "assignmentType": item['assignmentType'],
          "itemId": task['itemId'],
          "actionType": 1,
          "source": "main"
        })
        await $.wait(1000 * ext['waitDuration'])
        await superBrandDoTask({
          "activityId": $.activityId,
          "encryptProjectId": $.encryptProjectId,
          "encryptAssignmentId": item['encryptAssignmentId'],
          "assignmentType": item['assignmentType'],
          "itemId": task['itemId'],
          "actionType": 0,
          "source": "main"
        })
      }
    }
    if (item['assignmentType'] === 3) {
      const { ext } = item;
      that.log(`开始做 ${item['assignmentName']}`);
      const followShop = ext['followShop'];
      for (let task of followShop) {
        await superBrandDoTask({
          "activityId": $.activityId,
          "encryptProjectId": $.encryptProjectId,
          "encryptAssignmentId": item['encryptAssignmentId'],
          "assignmentType": item['assignmentType'],
          "itemId": task['itemId'],
          "actionType": 0,
          "source": "main"
        })
      }
    }
    if (item['assignmentType'] === 2) {
      const { ext } = item;
      const assistTaskDetail = ext['assistTaskDetail'];
      that.log(`${item['assignmentName']}好友邀请码： ${assistTaskDetail['itemId']}`)
      if (assistTaskDetail['itemId']) $.assigFirends.push({
        itemId: assistTaskDetail['itemId'],
        encryptAssignmentId: item['encryptAssignmentId'],
        assignmentType: item['assignmentType'],
      });
    }
  }
}
function superBrandDoTask(body) {
  return new Promise(resolve => {
    const options = superShakePostUrl('superBrandDoTask', body)
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} superBrandTaskList API请求失败，请检查网路重试`)
        } else {
          if (data) {
            if (body['assignmentType'] === 2) {
              that.log(`助力好友 ${body['itemId']}结果 ${data}`);
            } else {
              that.log('做任务结果', data);
            }
            data = JSON.parse(data);
            if (data && data['code'] === '0' && data['data']['bizCode'] === '108') {
              $.canHelp = false;
            }
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
async function lo() {
  const num = parseInt(($.userStarNum || 0) / 100);
  if (!$.canLottery) {
    for (let i = 0; i < new Array(num).fill('').length; i++) {
      await $.wait(1000);
      await superBrandTaskLottery();
    }
  }
  if ($.superShakeBeanNum > 0) {
    message += `${message ? '\n' : ''}${$.activityName || '超级摇一摇'}：获得${$.superShakeBeanNum}京豆\n`;
    allMessage += `京东账号${$.index}${$.nickName || $.UserName}\n${superShakeBeanConfig['superShakeTitle']}：获得${$.superShakeBeanNum}京豆${$.index !== cookiesArr.length ? '\n\n' : ''}`;
  }
}
function superBrandTaskLottery() {
  return new Promise(resolve => {
    const body = { "activityId": $.activityId, "source": "main" }
    const options = superShakePostUrl('superBrandTaskLottery', body)
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} superBrandDoTaskLottery API请求失败，请检查网路重试`)
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data && data['code'] === '0') {
              if (data['data']['bizCode'] === "TK000") {
                $.rewardComponent = data['data']['result']['rewardComponent'];
                if ($.rewardComponent) {
                  that.log(`超级摇一摇 抽奖结果:${JSON.stringify($.rewardComponent)}`)
                  if ($.rewardComponent.beanList && $.rewardComponent.beanList.length) {
                    that.log(`获得${$.rewardComponent.beanList[0]['quantity']}京豆`)
                    $.superShakeBeanNum = $.superShakeBeanNum + parseInt($.rewardComponent.beanList[0]['quantity']);
                  }
                }
              } else if (data['data']['bizCode'] === "TK1703") {
                that.log(`超级摇一摇 抽奖失败：${data['data']['bizMsg']}`);
              } else {
                that.log(`超级摇一摇 抽奖失败：${data['data']['bizMsg']}`);
              }
            } else {
              that.log(`超级摇一摇 抽奖异常： ${JSON.stringify(data)}`)
            }
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
function getActInfo(url) {
  return new Promise(resolve => {
    $.get({
      url,
      headers:{
        // 'Cookie': cookie,
        'User-Agent': $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
      },
      timeout: 10000
    },async (err,resp,data)=>{
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = data && data.match(/window\.__FACTORY__TAOYIYAO__STATIC_DATA__ = (.*)}/)
          if (data) {
            data = JSON.parse(data[1] + '}');
            if (data['pageConfig']) superShakeBeanConfig['superShakeTitle'] = data['pageConfig']['htmlTitle'];
            if (data['taskConfig']) {
              $.ActInfo = data['taskConfig']['taskAppId'];
              that.log(`\n获取【${superShakeBeanConfig['superShakeTitle']}】活动ID成功：${$.ActInfo}\n`);
            }
          }
        }
      } catch (e) {
        that.log(e)
      }
      finally {
        resolve()
      }
    })
  })
}
function fc_getHomeData(appId, flag = false) {
  return new Promise(resolve => {
    const body = { appId }
    const options = taskPostUrl('fc_getHomeData', body)
    $.taskVos = [];
    $.lotteryNum = 0;
    $.post(options, async (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} fc_getHomeData API请求失败，请检查网路重试`)
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data && data['data']['bizCode'] === 0) {
              const taskVos = data['data']['result']['taskVos'] || [];
              if (flag && $.index === 1) {
                superShakeBeanConfig['superShakeBeanFlag'] = true;
                superShakeBeanConfig['taskVipName'] = taskVos.filter(vo => !!vo && vo['taskType'] === 21)[0]['taskName'];
              }
              $.taskVos = taskVos.filter(item => !!item && item['status'] === 1) || [];
              $.lotteryNum = parseInt(data['data']['result']['lotteryNum']);
              $.lotTaskId = parseInt(data['data']['result']['lotTaskId']);
            } else if (data && data['data']['bizCode'] === 101) {
              that.log(`京东APP首页超级摇一摇： ${data['data']['bizMsg']}`);
            } else {
              that.log(`获取超级摇一摇任务数据异常： ${JSON.stringify(data)}`)
            }
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
async function doShakeTask(appId) {
  for (let vo of $.taskVos) {
    if (vo['taskType'] === 21) {
      that.log(`${vo['taskName']} 跳过`);
      continue
    }
    if (vo['taskType'] === 9) {
      that.log(`开始做 ${vo['taskName']}，等10秒`);
      const shoppingActivityVos = vo['shoppingActivityVos'];
      for (let task of shoppingActivityVos) {
        await fc_collectScore({
          appId,
          "taskToken": task['taskToken'],
          "taskId": vo['taskId'],
          "itemId": task['itemId'],
          "actionType": 1
        })
        await $.wait(10000)
        await fc_collectScore({
          appId,
          "taskToken": task['taskToken'],
          "taskId": vo['taskId'],
          "itemId": task['itemId'],
          "actionType": 0
        })
      }
    }
    if (vo['taskType'] === 1) {
      that.log(`开始做 ${vo['taskName']}， 等8秒`);
      const followShopVo = vo['followShopVo'];
      for (let task of followShopVo) {
        await fc_collectScore({
          appId,
          "taskToken": task['taskToken'],
          "taskId": vo['taskId'],
          "itemId": task['itemId'],
          "actionType": 1
        })
        await $.wait(9000)
        await fc_collectScore({
          appId,
          "taskToken": task['taskToken'],
          "taskId": vo['taskId'],
          "itemId": task['itemId'],
          "actionType": 0
        })
      }
    }
  }
}
function fc_collectScore(body) {
  return new Promise(resolve => {
    const options = taskPostUrl('fc_collectScore', body)
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} fc_collectScore API请求失败，请检查网路重试`)
        } else {
          if (data) {
            data = JSON.parse(data);
            that.log(`${JSON.stringify(data)}`)
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
async function superShakeLottery(appId) {
  if ($.lotteryNum) that.log(`\n\n开始京东APP首页超级摇一摇 摇奖`);
  for (let i = 0; i < new Array($.lotteryNum).fill('').length; i++) {
    await fc_getLottery(appId);//抽奖
    await $.wait(1000)
  }
  if ($.superShakeBeanNum > 0) {
    message += `${message ? '\n' : ''}${superShakeBeanConfig['superShakeTitle']}：获得${$.superShakeBeanNum}京豆`
    allMessage += `京东账号${$.index}${$.nickName || $.UserName}\n${superShakeBeanConfig['superShakeTitle']}：获得${$.superShakeBeanNum}京豆${$.index !== cookiesArr.length ? '\n\n' : ''}`;
  }
}
function fc_getLottery(appId) {
  return new Promise(resolve => {
    const body = {appId, "taskId": $.lotTaskId}
    const options = taskPostUrl('fc_getLotteryResult', body)
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} fc_collectScore API请求失败，请检查网路重试`)
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data && data['data']['bizCode'] === 0) {
              $.myAwardVo = data['data']['result']['myAwardVo'];
              if ($.myAwardVo) {
                that.log(`超级摇一摇 抽奖结果:${JSON.stringify($.myAwardVo)}`)
                if ($.myAwardVo['type'] === 2) {
                  $.superShakeBeanNum = $.superShakeBeanNum + parseInt($.myAwardVo['jBeanAwardVo']['quantity']);
                }
              }
            } else {
              that.log(`超级摇一摇 抽奖异常： ${JSON.stringify(data)}`)
            }
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
//============超级品牌日==============
async function superbrandShakeBean() {
  if ($.brandActivityId) {
    await superbrand_getMaterial();
    await qryCompositeMaterials();
    await superbrand_getGift();//抽奖
  }
}
function superbrand_getMaterial() {
  return new Promise(resolve => {
    const body = {"brandActivityId":$.brandActivityId}
    const options = superShakePostUrl('superbrand_getMaterial', body)
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} superbrand_getMaterial API请求失败，请检查网路重试`)
        } else {
          if (data) {
            data = JSON.parse(data)
            if (data['code'] === 0) {
              if (data['data']['bizCode'] === 0) {
                const { result } = data['data'];
                $.cmsTaskShopId = result['cmsTaskShopId'];
                $.cmsTaskLink = result['cmsTaskLink'];
                $.cmsTaskGroupId = result['cmsTaskGroupId'];
              } else {
                that.log(`超级超级品牌日 ${data['data']['bizMsg']}`)
              }
            } else {
              that.log(`超级超级品牌日 异常： ${JSON.stringify(data)}`)
            }
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
function qryCompositeMaterials() {
  return new Promise(resolve => {
    const t1 = {"type": "productGroup", "id": `${$.cmsTaskGroupId}`, "mapTo": "Tasks0"}
    const qryParam = JSON.stringify([t1]);
    const body = {
      qryParam,
      "activityId": $.brandActivityId2,
      "pageId": "1411763",
      "reqSrc": "jmfe",
      "geo": {"lng": "", "lat": ""}
    }
    const options = taskPostUrl('qryCompositeMaterials', body)
    $.post(options, async (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} qryCompositeMaterials API请求失败，请检查网路重试`)
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data['code'] === '0') {
              const { list } = data['data']['Tasks0'];
              that.log(`超级品牌日，做关注店铺 任务`)
              let body = {"brandActivityId": $.brandActivityId, "taskType": "1", "taskId": $.cmsTaskShopId}
              await superbrand_doMyTask(body);
              that.log(`超级品牌日，逛品牌会场 任务`)
              body = {"brandActivityId": $.brandActivityId, "taskType": "2", "taskId": $.cmsTaskLink}
              await superbrand_doMyTask(body);
              that.log(`超级品牌日，浏览下方指定商品 任务`)
              for (let item of list.slice(0, 3)) {
                body = {"brandActivityId": $.brandActivityId, "taskType": "3", "taskId": item['skuId']};
                await superbrand_doMyTask(body);
              }
            } else {
              that.log(`qryCompositeMaterials异常： ${JSON.stringify(data)}`)
            }
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
//做任务API
function superbrand_doMyTask(body) {
  return new Promise(resolve => {
    const options = superShakePostUrl('superbrand_doMyTask', body)
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} superbrand_doMyTask API请求失败，请检查网路重试`)
        } else {
          if (data) {
            // data = JSON.parse(data)
            that.log(`超级品牌日活动做任务结果：${data}\n`)
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
function superbrand_getGift() {
  return new Promise(resolve => {
    const body = {"brandActivityId":$.brandActivityId}
    const options = superShakePostUrl('superbrand_getGift', body)
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} superbrand_getGift API请求失败，请检查网路重试`)
        } else {
          if (data) {
            data = JSON.parse(data)
            if (data['code'] === 0) {
              if (data['data']['bizCode'] === 0) {
                const { result } = data['data'];
                $.jpeasList = result['jpeasList'];
                if ($.jpeasList && $.jpeasList.length) {
                  for (let item of $.jpeasList) {
                    that.log(`超级品牌日 抽奖 活动：${item['prizeName']}`);
                    message += `【超级品牌日】获得：${item['prizeName']}\n`;
                    if ($.superShakeBeanNum === 0) {
                      allMessage += `京东账号${$.index}${$.nickName || $.UserName}\n【超级品牌日】获得：${item['prizeName']}\n`;
                    } else {
                      allMessage += `【超级品牌日】获得：${item['prizeName']}\n`;
                    }
                  }
                }
              } else {
                that.log(`超级超级品牌日 抽奖失败： ${data['data']['bizMsg']}`)
              }
            } else {
              that.log(`超级超级品牌日 抽奖 异常： ${JSON.stringify(data)}`)
            }
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
//=======================京东会员签到========================
async function shakeSign() {
  await pg_channel_page_data();
  if ($.token && $.currSignCursor && $.signStatus === -1) {
    const body = {"floorToken": $.token, "dataSourceCode": "signIn", "argMap": { "currSignCursor": $.currSignCursor }};
    const signRes = await pg_interact_interface_invoke(body);
    that.log(`京东会员第${$.currSignCursor}天签到结果；${JSON.stringify(signRes)}`)
    let beanNum = 0;
    if (signRes.success && signRes['data']) {
      that.log(`京东会员第${$.currSignCursor}天签到成功。获得${signRes['data']['rewardVos'] && signRes['data']['rewardVos'][0]['jingBeanVo'] && signRes['data']['rewardVos'][0]['jingBeanVo']['beanNum']}京豆\n`)
      beanNum = signRes['data']['rewardVos'] && signRes['data']['rewardVos'][0]['jingBeanVo'] && signRes['data']['rewardVos'][0]['jingBeanVo']['beanNum']
    }
    if (beanNum) {
      message += `\n京东会员签到：${beanNum}获得京豆`;
    }
  } else {
    that.log(`京东会员第${$.currSignCursor}已签到`)
  }
}
function pg_channel_page_data() {
  const body = {
    "paramData":{"token":"dd2fb032-9fa3-493b-8cd0-0d57cd51812d"}
  }
  return new Promise(resolve => {
    const options = {
      url: `https://api.m.jd.com/?t=${Date.now()}&appid=sharkBean&functionId=pg_channel_page_data&body=${escape(JSON.stringify(body))}`,
      headers: {
        "Accept": "application/json",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-cn",
        "Connection": "keep-alive",
        "Host": "api.m.jd.com",
        "Cookie": cookie,
        "Origin": "https://spa.jd.com",
        "Referer": "https://spa.jd.com/home",
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
      }
    }
    $.get(options, (err, resp, data) => {
      try {
        if (err) {
          that.log(`\n${$.name}: API查询请求失败 ‼️‼️`)
          $.logErr(err);
        } else {
          data = JSON.parse(data);
          if (data.success) {
            const SIGN_ACT_INFO = data['data']['floorInfoList'].filter(vo => !!vo && vo['code'] === 'SIGN_ACT_INFO')[0]
            $.token = SIGN_ACT_INFO['token'];
            if (SIGN_ACT_INFO['floorData']) {
              $.currSignCursor = SIGN_ACT_INFO['floorData']['signActInfo']['currSignCursor'];
              $.signStatus = SIGN_ACT_INFO['floorData']['signActInfo']['signActCycles'].filter(item => !!item && item['signCursor'] === $.currSignCursor)[0]['signStatus'];
            }
            that.log($.token, $.currSignCursor, $.signStatus)
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data || {});
      }
    })
  })
}
function pg_interact_interface_invoke(body) {
  return new Promise(resolve => {
    const options = {
      url: `https://api.m.jd.com/?appid=sharkBean&functionId=pg_interact_interface_invoke&body=${escape(JSON.stringify(body))}`,
      headers: {
        'User-Agent': $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
        "Cookie": cookie,
        "Accept": "application/json",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-cn",
        "Connection": "keep-alive",
        "Content-Length": "0",
        "Host": "api.m.jd.com",
        "Origin": "https://spa.jd.com",
        "Referer": "https://spa.jd.com/home"
      }
    }
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          that.log(`\n${$.name}: API查询请求失败 ‼️‼️`)
          $.logErr(err);
        } else {
          data = JSON.parse(data);
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data || {});
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
function taskUrl(function_id, body = {}, appId = 'vip_h5') {
  return {
    url: `${JD_API_HOST}?functionId=${function_id}&appid=${appId}&body=${escape(JSON.stringify(body))}&_=${Date.now()}`,
    headers: {
      'Cookie': cookie,
      'Host': 'api.m.jd.com',
      'User-Agent': $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
      'Referer': 'https://vip.m.jd.com/newPage/reward/123dd/slideContent?page=focus',
    }
  }
}
function taskPostUrl(function_id, body) {
  return {
    url: `https://api.m.jd.com/client.action?functionId=${function_id}&body=${escape(JSON.stringify(body))}&client=wh5&clientVersion=1.0.0`,
    headers: {
      'Cookie': cookie,
      'Host': 'api.m.jd.com',
      'User-Agent': $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
      'Referer': 'https://h5.m.jd.com/babelDiy/Zeus/4SXuJSqKganGpDSEMEkJWyBrBHcM/index.html',
    }
  }
}
function superShakePostUrl(function_id, body) {
  return {
    url: `https://api.m.jd.com/client.action?functionId=${function_id}&appid=content_ecology&body=${escape(JSON.stringify(body))}&client=wh5&clientVersion=9.3.0&uuid=8888888&t=${Date.now()}`,
    headers: {
      'Cookie': cookie,
      'Host': 'api.m.jd.com',
      'User-Agent': $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
      'Referer': 'https://h5.m.jd.com/babelDiy/Zeus/4SXuJSqKganGpDSEMEkJWyBrBHcM/index.html',
    }
  }
}