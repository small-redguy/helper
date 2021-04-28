let cookiesArr = [], cookie = '', jdPetShareArr = [], isBox = false, notify, newShareCodes, allMessage = '';
//助力好友分享码(最多5个,否则后面的助力失败),原因:京东农场每人每天只有四次助力机会
//此此内容是IOS用户下载脚本到本地使用，填写互助码的地方，同一京东账号的好友互助码请使用@符号隔开。
//下面给出两个账号的填写示例（iOS只支持2个京东账号）
let shareCodes = [ // IOS本地脚本用户这个列表填入你要助力的好友的shareCode
]
let message = '', subTitle = '', option = {};
let jdNotify = false;//是否关闭通知，false打开通知推送，true关闭通知推送
const JD_API_HOST = 'https://api.m.jd.com/client.action';
let goodsUrl = '', taskInfoKey = [];
let randomCount = $.isNode() ? 20 : 5;
!(async () => {
  await requireConfig();
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
      that.log(`\n开始【京东账号${$.index}】${$.nickName || $.UserName}\n`);
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});

        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }
        continue
      }
      message = '';
      subTitle = '';
      goodsUrl = '';
      taskInfoKey = [];
      option = {};
      await shareCodesFormat();
      await jdPet();
    }
  }
  if ($.isNode() && allMessage && $.ctrTemp) {
    await notify.sendNotify(`${$.name}`, `${allMessage}`)
  }
})()
    .catch((e) => {
      $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
    })
    .finally(() => {
      $.done();
    })
async function jdPet() {
  try {
    //查询jd宠物信息
    const initPetTownRes = await request('initPetTown');
    message = `【京东账号${$.index}】${$.nickName}\n`;
    if (initPetTownRes.code === '0' && initPetTownRes.resultCode === '0' && initPetTownRes.message === 'success') {
      $.petInfo = initPetTownRes.result;
      if ($.petInfo.userStatus === 0) {
        // $.msg($.name, '', `【提示】京东账号${$.index}${$.nickName}\n萌宠活动未开启\n请手动去京东APP开启活动\n入口：我的->游戏与互动->查看更多开启`, { "open-url": "openapp.jdmoble://" });
        await slaveHelp();//助力好友
        $.log($.name, '', `【提示】京东账号${$.index}${$.nickName}\n萌宠活动未开启\n请手动去京东APP开启活动\n入口：我的->游戏与互动->查看更多开启`);
        return
      }
      if (!$.petInfo.goodsInfo) {
        $.msg($.name, '', `【提示】京东账号${$.index}${$.nickName}\n暂未选购新的商品`, { "open-url": "openapp.jdmoble://" });
        if ($.isNode()) await notify.sendNotify(`${$.name} - ${$.index} - ${$.nickName}`, `【提示】京东账号${$.index}${$.nickName}\n暂未选购新的商品`);
        return
      }
      goodsUrl = $.petInfo.goodsInfo && $.petInfo.goodsInfo.goodsUrl;
      // option['media-url'] = goodsUrl;
      // that.log(`初始化萌宠信息完成: ${JSON.stringify(petInfo)}`);
      if ($.petInfo.petStatus === 5) {
        await slaveHelp();//可以兑换而没有去兑换,也能继续助力好友
        option['open-url'] = "openApp.jdMobile://";
        $.msg($.name, `【提醒⏰】${$.petInfo.goodsInfo.goodsName}已可领取`, '请去京东APP或微信小程序查看', option);
        if ($.isNode()) {
          await notify.sendNotify(`${$.name} - 账号${$.index} - ${$.nickName || $.UserName}奖品已可领取`, `京东账号${$.index} ${$.nickName}\n${$.petInfo.goodsInfo.goodsName}已可领取`);
        }
        return
      } else if ($.petInfo.petStatus === 6) {
        await slaveHelp();//已领取红包,但未领养新的,也能继续助力好友
        option['open-url'] = "openApp.jdMobile://";
        $.msg($.name, `【提醒⏰】已领取红包,但未继续领养新的物品`, '请去京东APP或微信小程序继续领养', option);
        if ($.isNode()) {
          await notify.sendNotify(`${$.name} - 账号${$.index} - ${$.nickName || $.UserName}奖品已可领取`, `京东账号${$.index} ${$.nickName}\n已领取红包,但未继续领养新的物品`);
        }
        return
      }
      that.log(`\n【京东账号${$.index}（${$.UserName}）的${$.name}好友互助码】${$.petInfo.shareCode}\n`);
      await taskInit();
      if ($.taskInit.resultCode === '9999' || !$.taskInit.result) {
        that.log('初始化任务异常, 请稍后再试');
        return
      }
      $.taskInfo = $.taskInit.result;

      await petSport();//遛弯
      await slaveHelp();//助力好友
      await masterHelpInit();//获取助力的信息
      await doTask();//做日常任务
      await feedPetsAgain();//再次投食
      await energyCollect();//收集好感度
      await showMsg();
      that.log('全部任务完成, 如果帮助到您可以点下🌟STAR鼓励我一下, 明天见~');
    } else if (initPetTownRes.code === '0'){
      that.log(`初始化萌宠失败:  ${initPetTownRes.message}`);
    }
  } catch (e) {
    $.logErr(e)
    const errMsg = `京东账号${$.index} ${$.nickName || $.UserName}\n任务执行异常，请检查执行日志 ‼️‼️`;
    if ($.isNode()) await notify.sendNotify(`${$.name}`, errMsg);
    $.msg($.name, '', `京东账号${$.index} ${$.nickName || $.UserName}\n${errMsg}`)
  }
}
// 收取所有好感度
async function energyCollect() {
  that.log('开始收取任务奖励好感度');
  let function_id = 'energyCollect';
  const response = await request(function_id);
  // that.log(`收取任务奖励好感度完成:${JSON.stringify(response)}`);
  if (response.resultCode === '0') {
    message += `【第${response.result.medalNum + 1}块勋章完成进度】${response.result.medalPercent}%，还需收集${response.result.needCollectEnergy}好感\n`;
    message += `【已获得勋章】${response.result.medalNum}块，还需收集${response.result.needCollectMedalNum}块即可兑换奖品“${$.petInfo.goodsInfo.goodsName}”\n`;
  }
}
//再次投食
async function feedPetsAgain() {
  const response = await request('initPetTown');//再次初始化萌宠
  if (response.code === '0' && response.resultCode === '0' && response.message === 'success') {
    $.petInfo = response.result;
    let foodAmount = $.petInfo.foodAmount; //剩余狗粮
    if (foodAmount - 100 >= 10) {
      for (let i = 0; i < parseInt((foodAmount - 100) / 10); i++) {
        const feedPetRes = await request('feedPets');
        that.log(`投食feedPetRes`);
        if (feedPetRes.resultCode == 0 && feedPetRes.code == 0) {
          that.log('投食成功')
        }
      }
      const response2 = await request('initPetTown');
      $.petInfo = response2.result;
      subTitle = $.petInfo.goodsInfo.goodsName;
      // message += `【与爱宠相识】${$.petInfo.meetDays}天\n`;
      // message += `【剩余狗粮】${$.petInfo.foodAmount}g\n`;
    } else {
      that.log("目前剩余狗粮：【" + foodAmount + "】g,不再继续投食,保留部分狗粮用于完成第二天任务");
      subTitle = $.petInfo.goodsInfo && $.petInfo.goodsInfo.goodsName;
      // message += `【与爱宠相识】${$.petInfo.meetDays}天\n`;
      // message += `【剩余狗粮】${$.petInfo.foodAmount}g\n`;
    }
  } else {
    that.log(`初始化萌宠失败:  ${JSON.stringify($.petInfo)}`);
  }
}


async function doTask() {
  const { signInit, threeMealInit, firstFeedInit, feedReachInit, inviteFriendsInit, browseShopsInit, taskList } = $.taskInfo;
  for (let item of taskList) {
    if ($.taskInfo[item].finished) {
      that.log(`任务 ${item} 已完成`)
    }
  }
  //每日签到
  if (signInit && !signInit.finished) {
    await signInitFun();
  }
  // 首次喂食
  if (firstFeedInit && !firstFeedInit.finished) {
    await firstFeedInitFun();
  }
  // 三餐
  if (threeMealInit && !threeMealInit.finished) {
    if (threeMealInit.timeRange === -1) {
      that.log(`未到三餐时间`);
    } else {
      await threeMealInitFun();
    }
  }
  if (browseShopsInit && !browseShopsInit.finished) {
    await browseShopsInitFun();
  }
  let browseSingleShopInitList = [];
  taskList.map((item) => {
    if (item.indexOf('browseSingleShopInit') > -1) {
      browseSingleShopInitList.push(item);
    }
  });
  // 去逛逛好货会场
  for (let item of browseSingleShopInitList) {
    const browseSingleShopInitTask = $.taskInfo[item];
    if (browseSingleShopInitTask && !browseSingleShopInitTask.finished) {
      await browseSingleShopInit(browseSingleShopInitTask);
    }
  }
  if (inviteFriendsInit && !inviteFriendsInit.finished) {
    await inviteFriendsInitFun();
  }
  // 投食10次
  if (feedReachInit && !feedReachInit.finished) {
    await feedReachInitFun();
  }
}
// 好友助力信息
async function masterHelpInit() {
  let res = await request('masterHelpInit');
  // that.log(`助力信息: ${JSON.stringify(res)}`);
  if (res.code === '0' && res.resultCode === '0') {
    if (res.result.masterHelpPeoples && res.result.masterHelpPeoples.length >= 5) {
      if(!res.result.addedBonusFlag) {
        that.log("开始领取额外奖励");
        let getHelpAddedBonusResult = await request('getHelpAddedBonus');
        if (getHelpAddedBonusResult.resultCode === '0') {
          message += `【额外奖励${getHelpAddedBonusResult.result.reward}领取】${getHelpAddedBonusResult.message}\n`;
        }
        that.log(`领取30g额外奖励结果：【${getHelpAddedBonusResult.message}】`);
      } else {
        that.log("已经领取过5好友助力额外奖励");
        message += `【额外奖励】已领取\n`;
      }
    } else {
      that.log("助力好友未达到5个")
      message += `【额外奖励】领取失败，原因：给您助力的人未达5个\n`;
    }
    if (res.result.masterHelpPeoples && res.result.masterHelpPeoples.length > 0) {
      that.log('帮您助力的好友的名单开始')
      let str = '';
      res.result.masterHelpPeoples.map((item, index) => {
        if (index === (res.result.masterHelpPeoples.length - 1)) {
          str += item.nickName || "匿名用户";
        } else {
          str += (item.nickName || "匿名用户") + '，';
        }
      })
      message += `【助力您的好友】${str}\n`;
    }
  }
}
/**
 * 助力好友, 暂时支持一个好友, 需要拿到shareCode
 * shareCode为你要助力的好友的
 * 运行脚本时你自己的shareCode会在控制台输出, 可以将其分享给他人
 */
async function slaveHelp() {
  //$.log(`\n因1.6日好友助力功能下线。故暂时屏蔽\n`)
  //return
  let helpPeoples = '';
  for (let code of newShareCodes) {
    that.log(`开始助力京东账号${$.index} - ${$.nickName}的好友: ${code}`);
    if (!code) continue;
    let response = await request('slaveHelp', {'shareCode': code});
    if (response.code === '0' && response.resultCode === '0') {
      if (response.result.helpStatus === 0) {
        that.log('已给好友: 【' + response.result.masterNickName + '】助力成功');
        helpPeoples += response.result.masterNickName + '，';
      } else if (response.result.helpStatus === 1) {
        // 您今日已无助力机会
        that.log(`助力好友${response.result.masterNickName}失败，您今日已无助力机会`);
        break;
      } else if (response.result.helpStatus === 2) {
        //该好友已满5人助力，无需您再次助力
        that.log(`该好友${response.result.masterNickName}已满5人助力，无需您再次助力`);
      } else {
        that.log(`助力其他情况：${JSON.stringify(response)}`);
      }
    } else {
      that.log(`助力好友结果: ${response.message}`);
    }
  }
  if (helpPeoples && helpPeoples.length > 0) {
    message += `【您助力的好友】${helpPeoples.substr(0, helpPeoples.length - 1)}\n`;
  }
}
// 遛狗, 每天次数上限10次, 随机给狗粮, 每次遛狗结束需调用getSportReward领取奖励, 才能进行下一次遛狗
async function petSport() {
  that.log('开始遛弯');
  let times = 1
  const code = 0
  let resultCode = 0
  do {
    let response = await request('petSport')
    that.log(`第${times}次遛狗完成: ${JSON.stringify(response)}`);
    resultCode = response.resultCode;
    if (resultCode == 0) {
      let sportRevardResult = await request('getSportReward');
      that.log(`领取遛狗奖励完成: ${JSON.stringify(sportRevardResult)}`);
    }
    times++;
  } while (resultCode == 0 && code == 0)
  if (times > 1) {
    // message += '【十次遛狗】已完成\n';
  }
}
// 初始化任务, 可查询任务完成情况
async function taskInit() {
  that.log('开始任务初始化');
  $.taskInit = await request('taskInit', {"version":1});
}
// 每日签到, 每天一次
async function signInitFun() {
  that.log('准备每日签到');
  const response = await request("getSignReward");
  that.log(`每日签到结果: ${JSON.stringify(response)}`);
  if (response.code === '0' && response.resultCode === '0') {
    that.log(`【每日签到成功】奖励${response.result.signReward}g狗粮\n`);
    // message += `【每日签到成功】奖励${response.result.signReward}g狗粮\n`;
  } else {
    that.log(`【每日签到】${response.message}\n`);
    // message += `【每日签到】${response.message}\n`;
  }
}

// 三餐签到, 每天三段签到时间
async function threeMealInitFun() {
  that.log('准备三餐签到');
  const response = await request("getThreeMealReward");
  that.log(`三餐签到结果: ${JSON.stringify(response)}`);
  if (response.code === '0' && response.resultCode === '0') {
    that.log(`【定时领狗粮】获得${response.result.threeMealReward}g\n`);
    // message += `【定时领狗粮】获得${response.result.threeMealReward}g\n`;
  } else {
    that.log(`【定时领狗粮】${response.message}\n`);
    // message += `【定时领狗粮】${response.message}\n`;
  }
}

// 浏览指定店铺 任务
async function browseSingleShopInit(item) {
  that.log(`开始做 ${item.title} 任务， ${item.desc}`);
  const body = {"index": item['index'], "version":1, "type":1};
  const body2 = {"index": item['index'], "version":1, "type":2};
  const response = await request("getSingleShopReward", body);
  // that.log(`点击进去response::${JSON.stringify(response)}`);
  if (response.code === '0' && response.resultCode === '0') {
    const response2 = await request("getSingleShopReward", body2);
    // that.log(`浏览完毕领取奖励:response2::${JSON.stringify(response2)}`);
    if (response2.code === '0' && response2.resultCode === '0') {
      that.log(`【浏览指定店铺】获取${response2.result.reward}g\n`);
      // message += `【浏览指定店铺】获取${response2.result.reward}g\n`;
    }
  }
}

// 浏览店铺任务, 任务可能为多个? 目前只有一个
async function browseShopsInitFun() {
  that.log('开始浏览店铺任务');
  let times = 0;
  let resultCode = 0;
  let code = 0;
  do {
    let response = await request("getBrowseShopsReward");
    that.log(`第${times}次浏览店铺结果: ${JSON.stringify(response)}`);
    code = response.code;
    resultCode = response.resultCode;
    times++;
  } while (resultCode == 0 && code == 0 && times < 5)
  that.log('浏览店铺任务结束');
}
// 首次投食 任务
function firstFeedInitFun() {
  that.log('首次投食任务合并到10次喂食任务中\n');
}

// 邀请新用户
async function inviteFriendsInitFun() {
  that.log('邀请新用户功能未实现');
  if ($.taskInfo.inviteFriendsInit.status == 1 && $.taskInfo.inviteFriendsInit.inviteFriendsNum > 0) {
    // 如果有邀请过新用户,自动领取60gg奖励
    const res = await request('getInviteFriendsReward');
    if (res.code == 0 && res.resultCode == 0) {
      that.log(`领取邀请新用户奖励成功,获得狗粮现有狗粮${$.taskInfo.inviteFriendsInit.reward}g，${res.result.foodAmount}g`);
      message += `【邀请新用户】获取狗粮${$.taskInfo.inviteFriendsInit.reward}g\n`;
    }
  }
}

/**
 * 投食10次 任务
 */
async function feedReachInitFun() {
  that.log('投食任务开始...');
  let finishedTimes = $.taskInfo.feedReachInit.hadFeedAmount / 10; //已经喂养了几次
  let needFeedTimes = 10 - finishedTimes; //还需要几次
  let tryTimes = 20; //尝试次数
  do {
    that.log(`还需要投食${needFeedTimes}次`);
    const response = await request('feedPets');
    that.log(`本次投食结果: ${JSON.stringify(response)}`);
    if (response.resultCode == 0 && response.code == 0) {
      needFeedTimes--;
    }
    if (response.resultCode == 3003 && response.code == 0) {
      that.log('剩余狗粮不足, 投食结束');
      needFeedTimes = 0;
    }
    tryTimes--;
  } while (needFeedTimes > 0 && tryTimes > 0)
  that.log('投食任务结束...\n');
}
async function showMsg() {
  if ($.isNode() && process.env.PET_NOTIFY_CONTROL) {
    $.ctrTemp = `${process.env.PET_NOTIFY_CONTROL}` === 'false';
  } else if ($.getdata('jdPetNotify')) {
    $.ctrTemp = $.getdata('jdPetNotify') === 'false';
  } else {
    $.ctrTemp = `${jdNotify}` === 'false';
  }
  // jdNotify = `${notify.petNotifyControl}` === 'false' && `${jdNotify}` === 'false' && $.getdata('jdPetNotify') === 'false';
  if ($.ctrTemp) {
    $.msg($.name, subTitle, message, option);
    if ($.isNode()) {
      allMessage += `${subTitle}\n${message}${$.index !== cookiesArr.length ? '\n\n' : ''}`
      // await notify.sendNotify(`${$.name} - 账号${$.index} - ${$.nickName}`, `${subTitle}\n${message}`);
    }
  } else {
    $.log(`\n${message}\n`);
  }
}
function readShareCode() {
  return new Promise(async resolve => {
    $.get({url: `http://jd.turinglabs.net/api/v2/jd/pet/read/${randomCount}/`, 'timeout': 10000}, (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            that.log(`随机取个${randomCount}码放到您固定的互助码后面(不影响已有固定互助)`)
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
function shareCodesFormat() {
  return new Promise(async resolve => {
    // that.log(`第${$.index}个京东账号的助力码:::${jdPetShareArr[$.index - 1]}`)
    newShareCodes = [];
    if (jdPetShareArr[$.index - 1]) {
      newShareCodes = jdPetShareArr[$.index - 1].split('@');
    } else {
      that.log(`由于您第${$.index}个京东账号未提供shareCode,将采纳本脚本自带的助力码\n`)
      if(shareCodes.length>0){
          const tempIndex = $.index > shareCodes.length ? (shareCodes.length - 1) : ($.index - 1);
      newShareCodes = shareCodes[tempIndex].split('@');
      }
    }
    //因好友助力功能下线。故暂时屏蔽
    //const readShareCodeRes = await readShareCode();
    const readShareCodeRes = null;
    if (readShareCodeRes && readShareCodeRes.code === 200) {
      newShareCodes = [...new Set([...newShareCodes, ...(readShareCodeRes.data || [])])];
    }
    that.log(`第${$.index}个京东账号将要助力的好友${JSON.stringify(newShareCodes)}`)
    resolve();
  })
}
function requireConfig() {
  return new Promise(resolve => {
    that.log('开始获取东东萌宠配置文件\n')
    notify = $.isNode() ? require('./sendNotify') : '';
    //Node.js用户请在jdCookie.js处填写京东ck;
    const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
    const jdPetShareCodes = $.isNode() ? require('./jdPetShareCodes.js') : '';
    //IOS等用户直接用NobyDa的jd cookie
    if ($.isNode()) {
      Object.keys(jdCookieNode).forEach((item) => {
        if (jdCookieNode[item]) {
          cookiesArr.push(jdCookieNode[item])
        }
      })
      if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') that.log = () => {};
    } else {
      cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
    }
    that.log(`共${cookiesArr.length}个京东账号\n`)
    if ($.isNode()) {
      Object.keys(jdPetShareCodes).forEach((item) => {
        if (jdPetShareCodes[item]) {
          jdPetShareArr.push(jdPetShareCodes[item])
        }
      })
    } else {
      const boxShareCodeArr = ['jd_pet1', 'jd_pet2', 'jd_pet3', 'jd_pet4', 'jd_pet5'];
      const boxShareCodeArr2 = ['jd2_pet1', 'jd2_pet2', 'jd2_pet3', 'jd2_pet4', 'jd2_pet5'];
      const isBox1 = boxShareCodeArr.some((item) => {
        const boxShareCode = $.getdata(item);
        return (boxShareCode !== undefined && boxShareCode !== null && boxShareCode !== '');
      });
      const isBox2 = boxShareCodeArr2.some((item) => {
        const boxShareCode = $.getdata(item);
        return (boxShareCode !== undefined && boxShareCode !== null && boxShareCode !== '');
      });
      isBox = isBox1 ? isBox1 : isBox2;
      if (isBox1) {
        let temp = [];
        for (const item of boxShareCodeArr) {
          if ($.getdata(item)) {
            temp.push($.getdata(item))
          }
        }
        jdPetShareArr.push(temp.join('@'));
      }
      if (isBox2) {
        let temp = [];
        for (const item of boxShareCodeArr2) {
          if ($.getdata(item)) {
            temp.push($.getdata(item))
          }
        }
        jdPetShareArr.push(temp.join('@'));
      }
    }
    // that.log(`jdPetShareArr::${JSON.stringify(jdPetShareArr)}`)
    // that.log(`jdPetShareArr账号长度::${jdPetShareArr.length}`)
    that.log(`您提供了${jdPetShareArr.length}个账号的东东萌宠助力码\n`);
    resolve()
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
// 请求
async function request(function_id, body = {}) {
  await $.wait(3000); //歇口气儿, 不然会报操作频繁
  return new Promise((resolve, reject) => {
    $.post(taskUrl(function_id, body), (err, resp, data) => {
      try {
        if (err) {
          that.log('\n东东萌宠: API查询请求失败 ‼️‼️');
          that.log(JSON.stringify(err));
          $.logErr(err);
        } else {
          data = JSON.parse(data);
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data)
      }
    })
  })
}
// function taskUrl(function_id, body = {}) {
//   return {
//     url: `${JD_API_HOST}?functionId=${function_id}&appid=wh5&loginWQBiz=pet-town&body=${escape(JSON.stringify(body))}`,
//     headers: {
//       Cookie: cookie,
//       UserAgent: $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
//     }
//   };
// }
function taskUrl(function_id, body = {}) {
  body["version"] = 2;
  body["channel"] = 'app';
  return {
    url: `${JD_API_HOST}?functionId=${function_id}`,
    body: `body=${escape(JSON.stringify(body))}&appid=wh5&loginWQBiz=pet-town&clientVersion=9.0.4`,
    headers: {
      'Cookie': cookie,
      'User-Agent': $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
      'Host': 'api.m.jd.com',
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  };
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