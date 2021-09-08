// @grant nodejs
/*
ENV
JOYPARK_JOY_START =      只做前几个CK
JOY_COIN_MAXIMIZE =      最大化硬币收益，如果合成后全部挖土后还有空位，则开启此模式（默认关闭） 0关闭 1开启

请确保新用户助力过开工位，否则开启游戏了就不算新用户，后面就不能助力开工位了！！！！！！！！！！

更新地址：https://github.com/Tsukasa007/my_script

============Quantumultx===============
[task_local]
#汪汪乐园养joy
20 0-23/3 * * * jd_joypark_joy.js, tag=汪汪乐园养joy, img-url=https://raw.githubusercontent.com/tsukasa007/icon/master/jd_joypark_joy.png, enabled=true

================Loon==============
[Script]
cron "20 0-23/3 * * *" script-path=jd_joypark_joy.js,tag=汪汪乐园养joy

===============Surge=================
汪汪乐园养joy = type=cron,cronexp="20 0-23/3 * * *",wake-system=1,timeout=3600,script-path=jd_joypark_joy.js

============小火箭=========
汪汪乐园养joy = type=cron,script-path=jd_joypark_joy.js, cronexpr="20 0-23/3 * * *", timeout=3600, enable=true
*/
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
let process={
    env:{
        "JD_JOY_PARK":"true"
    }
}
const notify = $.isNode() ? require('./sendNotify') : '';
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [],
    cookie = '';
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {};
} else {
  cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}

//最大化硬币收益模式
$.JOY_COIN_MAXIMIZE = process.env.JOY_COIN_MAXIMIZE === '1'
$.log(`最大化收益模式: 已${$.JOY_COIN_MAXIMIZE ? `默认已开启` : `关闭`}  `)

const JD_API_HOST = `https://api.m.jd.com/client.action`;
message = ""
!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/', {
      "open-url": "https://bean.m.jd.com/"
    });
    return;
  }
  if (process.env.JD_JOY_PARK && process.env.JD_JOY_PARK === 'false') {
    console.log(`\n******检测到您设置了不运行汪汪乐园，停止运行此脚本******\n`)
    return;
  }
  for (let i = 0; i < cookiesArr.length; i++) {
    //$.wait(50)
    if (process.env.JOYPARK_JOY_START && i == process.env.JOYPARK_JOY_START){
      console.log(`\n汪汪乐园养joy 只运行 ${process.env.JOYPARK_JOY_START} 个Cookie\n`);
      break
    }
    cookie = cookiesArr[i];
    if (cookie) {
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = '';
      $.maxJoyCount = 10
      await TotalBean();
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});

        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }
        continue
      }
      console.log(`\n\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
      //下地后还有有钱买Joy并且买了Joy
      $.hasJoyCoin = true
      await getJoyBaseInfo(undefined,undefined,undefined,true);
      $.activityJoyList = []
      $.workJoyInfoList = []
      await getJoyList(true);
      await getGameShopList()
      //清理工位
      await doJoyMoveDownAll($.workJoyInfoList)
      //从低合到高
      await doJoyMergeAll($.activityJoyList)
      await getJoyList(true)
    }
  }
})()
    .catch((e) => $.logErr(e))
    .finally(() => $.done())


function getJoyBaseInfo(taskId = '',inviteType = '',inviterPin = '',printLog = false) {
  //await $.wait(20)
  return new Promise(resolve => {
    $.post(taskPostClientActionUrl(`body={"taskId":"${taskId}","inviteType":"${inviteType}","inviterPin":"${inviterPin}","linkId":"LsQNxL7iWDlXUs6cFl-AAg"}&_t=1625480372020&appid=activities_platform`,`joyBaseInfo`), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          if (printLog) {
            $.log(`等级: ${data.data.level}|金币: ${data.data.joyCoin}`);
            if (data.data.level >= 30 && $.isNode()) {
              await notify.sendNotify(`${$.name} - 账号${$.index} - ${$.nickName}`, `【京东账号${$.index}】${$.nickName || $.UserName}\n当前等级: ${data.data.level}\n已达到单次最高等级奖励\n请尽快前往活动查看领取\n活动入口：京东极速版APP->汪汪乐园\n更多脚本->"https://github.com/zero205/JD_tencent_scf"`);
            }
          }
          $.joyBaseInfo = data.data
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve($.joyBaseInfo);
      }
    })
  })
}

function getJoyList(printLog = false){
  //await $.wait(20)
  return new Promise(resolve => {
    $.get(taskGetClientActionUrl(`appid=activities_platform&body={"linkId":"LsQNxL7iWDlXUs6cFl-AAg"}`,`joyList`), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          if (printLog) {
            $.log(`\n===== 【京东账号${$.index}】${$.nickName || $.UserName} joy 状态 start =====`)
            $.log("在逛街的joy⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️")
            for (let i = 0; i < data.data.activityJoyList.length; i++) {
              //$.wait(50);
              $.log(`id:${data.data.activityJoyList[i].id}|name: ${data.data.activityJoyList[i].name}|level: ${data.data.activityJoyList[i].level}`);
            }
            $.log("\n在铲土的joy⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️")
            for (let i = 0; i < data.data.workJoyInfoList.length; i++) {
              //$.wait(50)
              $.log(`工位: ${data.data.workJoyInfoList[i].location} [${data.data.workJoyInfoList[i].unlock ? `已开` : `未开`}]|joy= ${data.data.workJoyInfoList[i].joyDTO ? `id:${data.data.workJoyInfoList[i].joyDTO.id}|name: ${data.data.workJoyInfoList[i].joyDTO.name}|level: ${data.data.workJoyInfoList[i].joyDTO.level}` : `毛都没有`}`)
            }
            $.log(`===== 【京东账号${$.index}】${$.nickName || $.UserName} joy 状态  end  =====\n`)
          }
          $.activityJoyList = data.data.activityJoyList
          $.workJoyInfoList = data.data.workJoyInfoList
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data.data);
      }
    })
  })
}

function getGameShopList(){
  //await $.wait(20)
  return new Promise(resolve => {
    $.get(taskGetClientActionUrl(`appid=activities_platform&body={"linkId":"LsQNxL7iWDlXUs6cFl-AAg"}`,`gameShopList`), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          //排除不能购买的
          data = JSON.parse(data).data.filter(row => row.shopStatus === 1);
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}

async function doJoyMoveUpAll(activityJoyList, workJoyInfoList) {
  let workJoyInfoUnlockList = workJoyInfoList.filter(row => row.unlock && row.joyDTO === null)
  if (activityJoyList.length !== 0 && workJoyInfoUnlockList.length !== 0) {
    let maxLevelJoy = Math.max.apply(Math, activityJoyList.map(o => o.level))
    let maxLevelJoyList = activityJoyList.filter(row => row.level === maxLevelJoy)
    $.log(`下地干活！ joyId= ${maxLevelJoyList[0].id} location= ${workJoyInfoUnlockList[0].location}`)
    await doJoyMove(maxLevelJoyList[0].id, workJoyInfoUnlockList[0].location)
    await getJoyList()
    await doJoyMoveUpAll($.activityJoyList, $.workJoyInfoList)
  }
  // else if ($.JOY_COIN_MAXIMIZE) {
  //   await joyCoinMaximize(workJoyInfoUnlockList)
  // }

}

async function joyCoinMaximize(workJoyInfoUnlockList) {
  if (workJoyInfoUnlockList.length !== 0 && $.hasJoyCoin) {
    $.log(`竟然还有工位挖土？开启瞎买瞎下地模式！`);
    let joyBaseInfo = await getJoyBaseInfo()
    let joyCoin = joyBaseInfo.joyCoin
    $.log(`还有${joyCoin}金币,看看还能买啥下地`)
    let shopList = await getGameShopList()
    let newBuyCount = false;
    for (let i = shopList.length - 1;i >= 0 && i - 3 >= 0;i--){ //向下买3级
      if (joyCoin > shopList[i].consume) {
        $.log(`买一只 ${shopList[i].userLevel}级的！`);
        joyCoin = joyCoin - shopList[i].consume;
        let buyResp = await doJoyBuy(shopList[i].userLevel);
        if (!buyResp.success) {
          break;
        } else {
          newBuyCount = true
          $.hasJoyCoin = false
          i++
        }
      }
    }
    $.hasJoyCoin = false
    if (newBuyCount) {
      await getJoyList()
      await doJoyMoveUpAll($.activityJoyList,$.workJoyInfoList)
      await getJoyBaseInfo();
    }
  }
}

async function doJoyMoveDownAll(workJoyInfoList) {
  if (workJoyInfoList.filter(row => row.joyDTO).length === 0) {
    $.log(`工位清理完成！`)
    return true
  }
  for (let i = 0; i < workJoyInfoList.length; i++) {
    //$.wait(50)
    if (workJoyInfoList[i].unlock && workJoyInfoList[i].joyDTO) {
      $.log(`从工位移除 => id:${workJoyInfoList[i].joyDTO.id}|name: ${workJoyInfoList[i].joyDTO.name}|level: ${workJoyInfoList[i].joyDTO.level}`)
      await doJoyMove(workJoyInfoList[i].joyDTO.id, 0)
    }
  }
  //check
  await getJoyList()
  await doJoyMoveDownAll($.workJoyInfoList)
}

async function doJoyMergeAll(activityJoyList) {
  let minLevel = Math.min.apply(Math, activityJoyList.map(o => o.level))
  let joyMinLevelArr = activityJoyList.filter(row => row.level === minLevel);
  let joyBaseInfo = await getJoyBaseInfo()
  let fastBuyLevel = joyBaseInfo.fastBuyLevel
  if (joyMinLevelArr.length >= 2) {
    $.log(`开始合成 ${minLevel} ${joyMinLevelArr[0].id} <=> ${joyMinLevelArr[1].id} 【限流严重，2秒后合成！如失败会重试】`);
    await $.wait(2000)
    await doJoyMerge(joyMinLevelArr[0].id, joyMinLevelArr[1].id);
    await getJoyList()
    await doJoyMergeAll($.activityJoyList)
  } else if (joyMinLevelArr.length === 1 && joyMinLevelArr[0].level < fastBuyLevel) {
    let buyResp = await doJoyBuy(joyMinLevelArr[0].level,$.activityJoyList);
    if (buyResp.success) {
      await getJoyList();
      await doJoyMergeAll($.activityJoyList);
    } else {
      $.log("完成！")
      await doJoyMoveUpAll($.activityJoyList, $.workJoyInfoList)
    }
  } else {
    $.log(`没有需要合成的joy 开始买买买🛒🛒🛒🛒🛒🛒🛒🛒`)
    $.log(`现在最高可以购买: ${fastBuyLevel}  购买 ${fastBuyLevel} 的joy   你还有${joyBaseInfo.joyCoin}金币`)
    let buyResp = await doJoyBuy(fastBuyLevel,$.activityJoyList);
    if (buyResp.success) {
      await getJoyList();
      await doJoyMergeAll($.activityJoyList);
    } else {
      $.log("完成！")
      await doJoyMoveUpAll($.activityJoyList, $.workJoyInfoList)
    }
  }
}

function doJoyMove(joyId,location){
  //await $.wait(20)
  return new Promise(resolve => {
    $.post(taskGetClientActionUrl(`body={"joyId":${joyId},"location":${location},"linkId":"LsQNxL7iWDlXUs6cFl-AAg"}&appid=activities_platform`,`joyMove`), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (location !== 0) {
            $.log(`下地完成了！`);
          }
          data = JSON.parse(data);
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data.data);
      }
    })
  })
}

function doJoyMerge(joyId1,joyId2){
  //await $.wait(20)
  return new Promise(resolve => {
    $.get(taskGetClientActionUrl(`body={"joyOneId":${joyId1},"joyTwoId":${joyId2},"linkId":"LsQNxL7iWDlXUs6cFl-AAg"}&appid=activities_platform`,`joyMergeGet`), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
          data = {}
        } else {
          data = JSON.parse(data);
          $.log(`合成 ${joyId1} <=> ${joyId2} ${data.success ? `成功！` : `失败！【${data.errMsg}】 code=${data.code}`}`)
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data.data);
      }
    })
  })
}

async function doJoyBuy(level,activityJoyList){
  //await $.wait(20)
  return new Promise(resolve => {
    $.post(taskPostClientActionUrl(`body={"level":${level},"linkId":"LsQNxL7iWDlXUs6cFl-AAg"}&appid=activities_platform`,`joyBuy`), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          let codeMsg = '【不知道啥意思】'
          switch (data.code) {
            case 519:
              codeMsg = '【没钱了】';
              break
            case 518:
              codeMsg = '【没空位】';
              if (activityJoyList) {//正常买模式
                $.log(`因为购买 ${level}级🐶 没空位 所以我要删掉比低级的狗了`);
                let minLevel = Math.min.apply(Math, activityJoyList.map(o => o.level))
                await doJoyRecovery(activityJoyList.filter(row => row.level === minLevel)[0].id);
              }
              break
            case 0:
              codeMsg = '【OK】';
              break
          }

          $.log(`购买joy level: ${level} ${data.success ? `成功！` : `失败！${data.errMsg} code=${data.code}`}  code的意思是=${codeMsg}`)
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}

function doJoyRecovery(joyId) {
  return new Promise(resolve => {
    $.post(taskPostClientActionUrl(`body={"joyId":${joyId},"linkId":"LsQNxL7iWDlXUs6cFl-AAg"}&appid=activities_platform`,`joyRecovery`), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
          data = {}
        } else {
          data = JSON.parse(data);
          $.log(`回收🐶 ${data.success ? `成功！` : `失败！【${data.errMsg}】 code=${data.code}`}`)
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}

function taskPostClientActionUrl(body,functionId) {
  return {
    url: `https://api.m.jd.com/client.action?${functionId?`functionId=${functionId}`:``}`,
    body: body,
    headers: {
      'User-Agent': $.user_agent,
      'Content-Type':'application/x-www-form-urlencoded',
      'Host':'api.m.jd.com',
      'Origin':'https://joypark.jd.com',
      'Referer':'https://joypark.jd.com/?activityId=LsQNxL7iWDlXUs6cFl-AAg&lng=113.387899&lat=22.512678&sid=4d76080a9da10fbb31f5cd43396ed6cw&un_area=19_1657_52093_0',
      'Cookie': cookie,
    }
  }
}

function taskGetClientActionUrl(body,functionId) {
  return {
    url: `https://api.m.jd.com/client.action?functionId=${functionId}${body ? `&${body}` : ``}`,
    // body: body,
    headers: {
      'User-Agent': $.user_agent,
      'Content-Type':'application/x-www-form-urlencoded',
      'Host':'api.m.jd.com',
      'Origin':'https://joypark.jd.com',
      'Referer':'https://joypark.jd.com/?activityId=LsQNxL7iWDlXUs6cFl-AAg&lng=113.388006&lat=22.512549&sid=4d76080a9da10fbb31f5cd43396ed6cw&un_area=19_1657_52093_0',
      'Cookie': cookie,
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
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.2 Mobile/15E148 Safari/604.1"
      }
    }
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
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
            console.log(`京东服务器返回空数据`)
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
      console.log(e);
      $.msg($.name, '', '请勿随意在BoxJs输入框修改内容\n建议通过脚本去获取cookie')
      return [];
    }
  }
}
