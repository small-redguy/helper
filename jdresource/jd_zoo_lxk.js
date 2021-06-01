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
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
const pKHelpFlag = true;//是否PK助力  true 助力，false 不助力
const pKHelpAuthorFlag = true;//是否助力作者PK  true 助力，false 不助力
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [];
$.cookie = '';
$.inviteList = [];
$.pkInviteList = [];
$.secretpInfo = {};
$.innerPkInviteList = [
];
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
  that.log('活动入口：京东APP-》搜索 玩一玩-》瓜分20亿\n' +
      '小程序任务：已完成\n' +
      '地图任务：已添加，下午2点到5点执行,抽奖已添加\n' +
      '金融APP任务：已完成\n' +
      '活动时间：2021-05-24至2021-06-20\n' +
      '脚本更新时间：2021-06-01');
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      $.cookie = cookiesArr[i];
      $.UserName = decodeURIComponent($.cookie.match(/pt_pin=([^; ]+)(?=;?)/) && $.cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]);
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = $.UserName;
      await TotalBean();
      that.log(`\n*****开始【京东账号${$.index}】${$.nickName || $.UserName}*****\n`);
      that.log(`\n如有未完成的任务，请多执行几次\n`);
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }
        continue
      }
      await zoo()
    }
  }
  let res = [];
  if (new Date().getUTCHours() + 8 >= 17) res = await getAuthorShareCode() || [];
//   if (pKHelpAuthorFlag) {
//     $.innerPkInviteList = getRandomArrayElements([...$.innerPkInviteList, ...res], [...$.innerPkInviteList, ...res].length);
//     $.pkInviteList.push(...$.innerPkInviteList);
//   }
  for (let i = 0; i < cookiesArr.length; i++) {
    $.cookie = cookiesArr[i];
    $.canHelp = true;
    $.UserName = decodeURIComponent($.cookie.match(/pt_pin=([^; ]+)(?=;?)/) && $.cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]);
    if (!$.secretpInfo[$.UserName]) {
      continue;
    }
    $.secretp = $.secretpInfo[$.UserName];
    $.index = i + 1;
    //that.log($.inviteList);
    //pk助力
    if (new Date().getUTCHours() + 8 >= 9) {
      that.log(`\n******开始内部京东账号【怪兽大作战pk】助力*********\n`);
      for (let i = 0; i < $.pkInviteList.length && pKHelpFlag && $.canHelp; i++) {
        that.log(`${$.UserName} 去助力PK码 ${$.pkInviteList[i]}`);
        $.pkInviteId = $.pkInviteList[i];
        await takePostRequest('pkHelp');
      }
      $.canHelp = true;
    }
    if ($.inviteList && $.inviteList.length) that.log(`\n******开始内部京东账号【邀请好友助力】*********\n`);
    for (let j = 0; j < $.inviteList.length && $.canHelp; j++) {
      $.oneInviteInfo = $.inviteList[j];
      if ($.oneInviteInfo.ues === $.UserName || $.oneInviteInfo.max) {
        continue;
      }
      //that.log($.oneInviteInfo);
      $.inviteId = $.oneInviteInfo.inviteId;
      that.log(`${$.UserName}去助力${$.oneInviteInfo.ues},助力码${$.inviteId}`);
      //await takePostRequest('helpHomeData');
      await takePostRequest('help');
      await $.wait(2000);
    }
  }
})()
  .catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
  })
  .finally(() => {
    $.done();
  })

async function zoo() {
  try {
    $.signSingle = {};
    $.homeData = {};
    $.secretp = ``;
    $.taskList = [];
    $.shopSign = ``;
    await takePostRequest('zoo_signSingle');
    if (JSON.stringify($.signSingle) === `{}` || $.signSingle.bizCode !== 0) {
      that.log($.signSingle.bizMsg);
      return;
    } else {
      that.log(`\n获取活动信息`);
    }
    await $.wait(1000);
    await takePostRequest('zoo_getHomeData');
    await $.wait(1000);
    await takePostRequest('zoo_getSignHomeData');
    await $.wait(1000);
    if($.signHomeData.todayStatus === 0){
      that.log(`去签到`);
      await takePostRequest('zoo_sign');
      await $.wait(1000);
    }else{
      that.log(`已签到`);
    }
    let raiseInfo = $.homeData.result.homeMainInfo.raiseInfo;
    if (Number(raiseInfo.totalScore) > Number(raiseInfo.nextLevelScore) && raiseInfo.buttonStatus === 1) {
      that.log(`满足升级条件，去升级`);
      await $.wait(3000);
      await takePostRequest('zoo_raise');
    }
    //收金币
    await $.wait(1000);
    await takePostRequest('zoo_collectProduceScore');
    await $.wait(1000);
    await takePostRequest('zoo_getTaskDetail');
    await $.wait(1000);
    //做任务
    for (let i = 0; i < $.taskList.length && $.secretp; i++) {
      $.oneTask = $.taskList[i];
      if ([1, 3, 5, 7, 9, 26].includes($.oneTask.taskType) && $.oneTask.status === 1) {
        $.activityInfoList = $.oneTask.shoppingActivityVos || $.oneTask.brandMemberVos || $.oneTask.followShopVo || $.oneTask.browseShopVo;
        for (let j = 0; j < $.activityInfoList.length; j++) {
          $.oneActivityInfo = $.activityInfoList[j];
          if ($.oneActivityInfo.status !== 1 || !$.oneActivityInfo.taskToken) {
            continue;
          }
          $.callbackInfo = {};
          that.log(`做任务：${$.oneActivityInfo.title || $.oneActivityInfo.taskName || $.oneActivityInfo.shopName};等待完成`);
          await takePostRequest('zoo_collectScore');
          if ($.callbackInfo.code === 0 && $.callbackInfo.data && $.callbackInfo.data.result && $.callbackInfo.data.result.taskToken) {
            await $.wait(8000);
            let sendInfo = encodeURIComponent(`{"dataSource":"newshortAward","method":"getTaskAward","reqParams":"{\\"taskToken\\":\\"${$.callbackInfo.data.result.taskToken}\\"}","sdkVersion":"1.0.0","clientLanguage":"zh"}`)
            await callbackResult(sendInfo)
          } else if ($.oneTask.taskType === 5 || $.oneTask.taskType === 3 || $.oneTask.taskType === 26) {
            await $.wait(2000);
            that.log(`任务完成`);
          } else {
            that.log($.callbackInfo);
            that.log(`任务失败`);
            await $.wait(3000);
          }
        }
      }else if ($.oneTask.taskType === 2 && $.oneTask.status === 1){
        that.log(`做任务：${$.oneTask.taskName};等待完成 (实际不会添加到购物车)`);
        $.taskId = $.oneTask.taskId;
        $.feedDetailInfo = {};
        await takePostRequest('zoo_getFeedDetail');
        let productList = $.feedDetailInfo.productInfoVos;
        let needTime = Number($.feedDetailInfo.maxTimes) - Number($.feedDetailInfo.times);
        for (let j = 0; j < productList.length && needTime > 0; j++) {
          if(productList[j].status !== 1){
            continue;
          }
          $.taskToken = productList[j].taskToken;
          that.log(`加购：${productList[j].skuName}`);
          await takePostRequest('add_car');
          await $.wait(1500);
          needTime --;
        }
      }
      await takePostRequest('zoo_getHomeData');
      let raiseInfo = $.homeData.result.homeMainInfo.raiseInfo;
      if (Number(raiseInfo.totalScore) > Number(raiseInfo.nextLevelScore) && raiseInfo.buttonStatus === 1) {
        that.log(`满足升级条件，去升级`);
        await $.wait(1000);
        await takePostRequest('zoo_raise');
      }
    }
    //===================================图鉴里的店铺====================================================================
    if (new Date().getUTCHours() + 8 >= 17 && new Date().getUTCHours() + 8 <= 18) {//分享
      $.myMapList = [];
      await takePostRequest('zoo_myMap');
      for (let i = 0; i < $.myMapList.length; i++) {
        await $.wait(3000);
        $.currentScence = i + 1;
        if ($.myMapList[i].isFirstShare === 1) {
          that.log(`去分享${$.myMapList[i].partyName}`);
          await takePostRequest('zoo_getWelfareScore');
        }
      }
    }
    if (new Date().getUTCHours() + 8 >= 14 && new Date().getUTCHours() + 8 <= 17){//30个店铺，为了避免代码执行太久，下午2点到5点才做店铺任务
      that.log(`去做店铺任务`);
      $.shopInfoList = [];
      await takePostRequest('qryCompositeMaterials');
      for (let i = 0; i < $.shopInfoList.length; i++) {
        $.shopSign = $.shopInfoList[i].extension.shopId;
        that.log(`执行第${i+1}个店铺任务：${$.shopInfoList[i].name} ID:${$.shopSign}`);
        $.shopResult = {};
        await takePostRequest('zoo_shopLotteryInfo');
        await $.wait(1000);
        if(JSON.stringify($.shopResult) === `{}`) continue;
        $.shopTask = $.shopResult.taskVos;
        for (let i = 0; i < $.shopTask.length; i++) {
          $.oneTask = $.shopTask[i];
          //that.log($.oneTask);
          if($.oneTask.taskType === 21 || $.oneTask.taskType === 14 || $.oneTask.status !== 1){continue;} //不做入会//不做邀请
          $.activityInfoList = $.oneTask.shoppingActivityVos || $.oneTask.simpleRecordInfoVo;
          if($.oneTask.taskType === 12){//签到
            if($.shopResult.dayFirst === 0){
              $.oneActivityInfo =  $.activityInfoList;
              that.log(`店铺签到`);
              await takePostRequest('zoo_bdCollectScore');
            }
            continue;
          }
          for (let j = 0; j < $.activityInfoList.length; j++) {
            $.oneActivityInfo = $.activityInfoList[j];
            if ($.oneActivityInfo.status !== 1 || !$.oneActivityInfo.taskToken) {
              continue;
            }
            $.callbackInfo = {};
            that.log(`做任务：${$.oneActivityInfo.subtitle || $.oneActivityInfo.title || $.oneActivityInfo.taskName || $.oneActivityInfo.shopName};等待完成`);
            await takePostRequest('zoo_collectScore');
            if ($.callbackInfo.code === 0 && $.callbackInfo.data && $.callbackInfo.data.result && $.callbackInfo.data.result.taskToken) {
              await $.wait(8000);
              let sendInfo = encodeURIComponent(`{"dataSource":"newshortAward","method":"getTaskAward","reqParams":"{\\"taskToken\\":\\"${$.callbackInfo.data.result.taskToken}\\"}","sdkVersion":"1.0.0","clientLanguage":"zh"}`)
              await callbackResult(sendInfo)
            } else  {
              await $.wait(2000);
              that.log(`任务完成`);
            }
          }
        }
        await $.wait(1000);
        let boxLotteryNum = $.shopResult.boxLotteryNum;
        for (let j = 0; j < boxLotteryNum; j++) {
          that.log(`开始第${j+1}次拆盒`)
          //抽奖
          await takePostRequest('zoo_boxShopLottery');
          await $.wait(3000);
        }
        // let wishLotteryNum = $.shopResult.wishLotteryNum;
        // for (let j = 0; j < wishLotteryNum; j++) {
        //   that.log(`开始第${j+1}次能量抽奖`)
        //   //抽奖
        //   await takePostRequest('zoo_wishShopLottery');
        //   await $.wait(3000);
        // }
        await $.wait(3000);
      }
    }
    //==================================微信任务========================================================================
    $.wxTaskList = [];
    await takePostRequest('wxTaskDetail');
    for (let i = 0; i < $.wxTaskList.length; i++) {
      $.oneTask = $.wxTaskList[i];
      if($.oneTask.taskType === 2 || $.oneTask.status !== 1){continue;} //不做加购
      $.activityInfoList = $.oneTask.shoppingActivityVos || $.oneTask.brandMemberVos || $.oneTask.followShopVo || $.oneTask.browseShopVo;
      for (let j = 0; j < $.activityInfoList.length; j++) {
        $.oneActivityInfo = $.activityInfoList[j];
        if ($.oneActivityInfo.status !== 1 || !$.oneActivityInfo.taskToken) {
          continue;
        }
        $.callbackInfo = {};
        that.log(`做任务：${$.oneActivityInfo.title || $.oneActivityInfo.taskName || $.oneActivityInfo.shopName};等待完成`);
        await takePostRequest('zoo_collectScore');
        if ($.callbackInfo.code === 0 && $.callbackInfo.data && $.callbackInfo.data.result && $.callbackInfo.data.result.taskToken) {
          await $.wait(8000);
          let sendInfo = encodeURIComponent(`{"dataSource":"newshortAward","method":"getTaskAward","reqParams":"{\\"taskToken\\":\\"${$.callbackInfo.data.result.taskToken}\\"}","sdkVersion":"1.0.0","clientLanguage":"zh"}`)
          await callbackResult(sendInfo)
        } else  {
          await $.wait(2000);
          that.log(`任务完成`);
        }
      }
    }
    //=======================================================京东金融=================================================================================
    $.jdjrTaskList = [];
    await takePostRequest('jdjrTaskDetail');
    await $.wait(1000);
    for (let i = 0; i < $.jdjrTaskList.length; i++) {
      $.taskId = $.jdjrTaskList[i].id;
      if($.taskId === '3980' || $.taskId === '3981' || $.taskId === '3982') continue;
      if($.jdjrTaskList[i].status === '1' || $.jdjrTaskList[i].status === '3'){
        that.log(`去做任务：${$.jdjrTaskList[i].name}`);
        await takePostRequest('jdjrAcceptTask');
        await $.wait(8000);
        await takeGetRequest();
      }else if($.jdjrTaskList[i].status === '2'){
        that.log(`任务：${$.jdjrTaskList[i].name},已完成`);
      }
    }
    //======================================================怪兽大作战=================================================================================
    $.pkHomeData = {};
    await takePostRequest('zoo_pk_getHomeData');
    if (JSON.stringify($.pkHomeData) === '{}') {
      that.log(`获取PK信息异常`);
      return;
    }
    await $.wait(1000);
    $.pkTaskList = [];
    await takePostRequest('zoo_pk_getTaskDetail');
    await $.wait(1000);
    for (let i = 0; i < $.pkTaskList.length; i++) {
      $.oneTask = $.pkTaskList[i];
      if ($.oneTask.status === 1) {
        $.activityInfoList = $.oneTask.shoppingActivityVos || $.oneTask.brandMemberVos || $.oneTask.followShopVo || $.oneTask.browseShopVo
        for (let j = 0; j < $.activityInfoList.length; j++) {
          $.oneActivityInfo = $.activityInfoList[j];
          if ($.oneActivityInfo.status !== 1) {
            continue;
          }
          that.log(`做任务：${$.oneActivityInfo.title || $.oneActivityInfo.taskName || $.oneActivityInfo.shopName};等待完成`);
          await takePostRequest('zoo_pk_collectScore');
          await $.wait(2000);
          that.log(`任务完成`);
        }
      }
    }
    await $.wait(1000);
    await takePostRequest('zoo_pk_getTaskDetail');
    let skillList = $.pkHomeData.result.groupInfo.skillList || [];
    //activityStatus === 1未开始，2 已开始
    $.doSkillFlag = true;
    for (let i = 0; i < skillList.length && $.pkHomeData.result.activityStatus === 2 && $.doSkillFlag; i++) {
      if (Number(skillList[i].num) > 0) {
        $.skillCode = skillList[i].code;
        for (let j = 0; j < Number(skillList[i].num) && $.doSkillFlag; j++) {
          that.log(`使用技能`);
          await takePostRequest('zoo_pk_doPkSkill');
          await $.wait(2000);
        }
      }
    }
  } catch (e) {
    $.logErr(e)
  }
}

async function takePostRequest(type) {
  let body = ``;
  let myRequest = ``;
  switch (type) {
    case 'zoo_signSingle':
      body = `functionId=zoo_signSingle&body={}&client=wh5&clientVersion=1.0.0`;
      myRequest = await getPostRequest(`zoo_signSingle`, body);
      break;
    case 'zoo_getHomeData':
      body = `functionId=zoo_getHomeData&body={}&client=wh5&clientVersion=1.0.0`;
      myRequest = await getPostRequest(`zoo_getHomeData`, body);
      break;
    case 'helpHomeData':
      body = `functionId=zoo_getHomeData&body={"inviteId":"${$.inviteId}"}&client=wh5&clientVersion=1.0.0`;
      myRequest = await getPostRequest(`zoo_getHomeData`, body);
      break;
    case 'zoo_collectProduceScore':
      body = getBody(type);
      myRequest = await getPostRequest(`zoo_collectProduceScore`, body);
      break;
    case 'zoo_getFeedDetail':
      body = `functionId=zoo_getFeedDetail&body={"taskId":"${$.taskId}"}&client=wh5&clientVersion=1.0.0`;
      myRequest = await getPostRequest(`zoo_getFeedDetail`, body);
      break;
    case 'zoo_getTaskDetail':
      body = `functionId=zoo_getTaskDetail&body={}&client=wh5&clientVersion=1.0.0`;
      myRequest = await getPostRequest(`zoo_getTaskDetail`, body);
      break;
    case 'zoo_collectScore':
      body = getBody(type);
      //that.log(body);
      myRequest = await getPostRequest(`zoo_collectScore`, body);
      break;
    case 'zoo_raise':
      body = `functionId=zoo_raise&body={}&client=wh5&clientVersion=1.0.0`;
      myRequest = await getPostRequest(`zoo_raise`, body);
      break;
    case 'help':
      body = getBody(type);
      //that.log(body);
      myRequest = await getPostRequest(`zoo_collectScore`, body);
      break;
    case 'zoo_pk_getHomeData':
      body = `functionId=zoo_pk_getHomeData&body={}&client=wh5&clientVersion=1.0.0`;
      myRequest = await getPostRequest(`zoo_pk_getHomeData`, body);
      break;
    case 'zoo_pk_getTaskDetail':
      body = `functionId=zoo_pk_getTaskDetail&body={}&client=wh5&clientVersion=1.0.0`;
      myRequest = await getPostRequest(`zoo_pk_getTaskDetail`, body);
      break;
    case 'zoo_pk_collectScore':
      body = getBody(type);
      //that.log(body);
      myRequest = await getPostRequest(`zoo_pk_collectScore`, body);
      break;
    case 'zoo_pk_doPkSkill':
      body = `functionId=zoo_pk_doPkSkill&body={"skillType":"${$.skillCode}"}&client=wh5&clientVersion=1.0.0`;
      myRequest = await getPostRequest(`zoo_pk_doPkSkill`, body);
      break;
    case 'pkHelp':
      body = getBody(type);
      myRequest = await getPostRequest(`zoo_pk_assistGroup`, body);
      break;
    case 'zoo_getSignHomeData':
      body = `functionId=zoo_getSignHomeData&body={"notCount":"1"}&client=wh5&clientVersion=1.0.0`;
      myRequest = await getPostRequest(`zoo_getSignHomeData`,body);
      break;
    case 'zoo_sign':
      body = `functionId=zoo_sign&body={}&client=wh5&clientVersion=1.0.0`;
      myRequest = await getPostRequest(`zoo_sign`,body);
      break;
    case 'wxTaskDetail':
      body = `functionId=zoo_getTaskDetail&body={"appSign":"2","channel":1,"shopSign":""}&client=wh5&clientVersion=1.0.0`;
      myRequest = await getPostRequest(`zoo_getTaskDetail`,body);
      break;
    case 'zoo_shopLotteryInfo':
      body = `functionId=zoo_shopLotteryInfo&body={"shopSign":"${$.shopSign}"}&client=wh5&clientVersion=1.0.0`;
      myRequest = await getPostRequest(`zoo_shopLotteryInfo`,body);
      break;
    case 'zoo_bdCollectScore':
      body = getBody(type);
      myRequest = await getPostRequest(`zoo_bdCollectScore`,body);
      break;
    case 'qryCompositeMaterials':
      body = `functionId=qryCompositeMaterials&body={"qryParam":"[{\\"type\\":\\"advertGroup\\",\\"mapTo\\":\\"resultData\\",\\"id\\":\\"05371960\\"}]","activityId":"2s7hhSTbhMgxpGoa9JDnbDzJTaBB","pageId":"","reqSrc":"","applyKey":"jd_star"}&client=wh5&clientVersion=1.0.0`;
      myRequest = await getPostRequest(`qryCompositeMaterials`,body);
      break;
    case 'zoo_boxShopLottery':
      body = `functionId=zoo_boxShopLottery&body={"shopSign":"${$.shopSign}"}&client=wh5&clientVersion=1.0.0`;
      myRequest = await getPostRequest(`zoo_boxShopLottery`,body);
      break;
    case `zoo_wishShopLottery`:
      body = `functionId=zoo_wishShopLottery&body={"shopSign":"${$.shopSign}"}&client=wh5&clientVersion=1.0.0`;
      myRequest = await getPostRequest(`zoo_boxShopLottery`,body);
      break;
    case `zoo_myMap`:
      body = `functionId=zoo_myMap&body={}&client=wh5&clientVersion=1.0.0`;
      myRequest = await getPostRequest(`zoo_myMap`,body);
      break;
    case 'zoo_getWelfareScore':
      body = getBody(type);
      myRequest = await getPostRequest(`zoo_getWelfareScore`,body);
      break;
    case 'jdjrTaskDetail':
      body = `reqData={"eid":"","sdkToken":"jdd014JYKVE2S6UEEIWPKA4B5ZKBS4N6Y6X5GX2NXL4IYUMHKF3EEVK52RQHBYXRZ67XWQF5N7XB6Y2YKYRTGQW4GV5OFGPDPFP3MZINWG2A01234567"}`;
      myRequest = await getPostRequest(`listTask`,body);
      break;
    case 'jdjrAcceptTask':
      body = `reqData={"eid":"","sdkToken":"jdd014JYKVE2S6UEEIWPKA4B5ZKBS4N6Y6X5GX2NXL4IYUMHKF3EEVK52RQHBYXRZ67XWQF5N7XB6Y2YKYRTGQW4GV5OFGPDPFP3MZINWG2A01234567","id":"${$.taskId}"}`;
      myRequest = await getPostRequest(`acceptTask`,body);
      break;
    case 'add_car':
      body = getBody(type);
      myRequest = await getPostRequest(`zoo_collectScore`,body);
      break;
    default:
      that.log(`错误${type}`);
  }
  return new Promise(async resolve => {
    $.post(myRequest, (err, resp, data) => {
      try {
        //that.log(data);
        dealReturn(type, data);
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

async function dealReturn(type, data) {
  try {
    data = JSON.parse(data);
  } catch (e) {
    that.log(`返回异常：${data}`);
    return;
  }
  switch (type) {
    case 'zoo_signSingle':
      if (data.code === 0) $.signSingle = data.data
      break;
    case 'zoo_getHomeData':
      if (data.code === 0) {
        $.homeData = data.data;
        $.secretp = data.data.result.homeMainInfo.secretp;
        $.secretpInfo[$.UserName] = $.secretp;
      }
      break;
    case 'helpHomeData':
      that.log(data)
      if (data.code === 0) {
        $.secretp = data.data.result.homeMainInfo.secretp;
        //that.log(`$.secretp：${$.secretp}`);
      }
      break;
    case 'zoo_collectProduceScore':
      if (data.code === 0) {
        that.log(`收取成功，获得：${data.data.result.produceScore}`);
      }
      break;
    case 'zoo_getTaskDetail':
      if (data.code === 0) {
        that.log(`互助码：${data.data.result.inviteId || '助力已满，获取助力码失败'}`);
        if (data.data.result.inviteId) {
          $.inviteList.push({
            'ues': $.UserName,
            'secretp': $.secretp,
            'inviteId': data.data.result.inviteId,
            'max': false
          });
        }
        $.taskList = data.data.result.taskVos;
      }
      break;
    case 'zoo_collectScore':
      $.callbackInfo = data;
      break;
    case 'zoo_raise':
      if (data.code === 0) that.log(`升级成功`);
      break;
    case 'help':
    case 'pkHelp':
      //that.log(data);
      switch (data.data.bizCode) {
        case 0:
          that.log(`助力成功`);
          break;
        case -201:
          that.log(`助力已满`);
          $.oneInviteInfo.max = true;
          break;
        case -202:
          that.log(`已助力`);
          break;
        case -8:
          that.log(`已经助力过该队伍`);
          break;
        case -6:
        case 108:
          that.log(`助力次数已用光`);
          $.canHelp = false;
          break;
        default:
          that.log(`怪兽大作战助力失败：${JSON.stringify(data)}`);
      }
      break;
    case 'zoo_pk_getHomeData':
      if (data.code === 0) {
        that.log(`PK互助码：${data.data.result.groupInfo.groupAssistInviteId}`);
        if (data.data.result.groupInfo.groupAssistInviteId) $.pkInviteList.push(data.data.result.groupInfo.groupAssistInviteId);
        $.pkHomeData = data.data;
      }
      break;
    case 'zoo_pk_getTaskDetail':
      if (data.code === 0) {
        $.pkTaskList = data.data.result.taskVos;
      }
      break;
    case 'zoo_getFeedDetail':
      if (data.code === 0) {
        $.feedDetailInfo = data.data.result.addProductVos[0];
      }
      break;
    case 'zoo_pk_collectScore':
      break;
    case 'zoo_pk_doPkSkill':
      if (data.data.bizCode === 0) that.log(`使用成功`);
      if (data.data.bizCode === -2) {
        that.log(`队伍任务已经完成，无法释放技能!`);
        $.doSkillFlag = false;
      }else if(data.data.bizCode === -2003){
        that.log(`现在不能打怪兽`);
        $.doSkillFlag = false;
      }
      break;
    case 'zoo_getSignHomeData':
      if(data.code === 0) {
        $.signHomeData = data.data.result;
      }
      break;
    case 'zoo_sign':
      if(data.code === 0 && data.data.bizCode === 0) {
        that.log(`签到获得成功`);
        if (data.data.result.redPacketValue) that.log(`签到获得：${data.data.result.redPacketValue} 红包`);
      }else{
        that.log(`签到失败`);
        that.log(data);
      }
      break;
    case 'wxTaskDetail':
      if (data.code === 0) {
        $.wxTaskList = data.data.result.taskVos;
      }
      break;
    case 'zoo_shopLotteryInfo':
      if (data.code === 0) {
        $.shopResult = data.data.result;
      }
      break;
    case 'zoo_bdCollectScore':
      if (data.code === 0) {
        that.log(`签到获得：${data.data.result.score}`);
      }
      break;
    case 'qryCompositeMaterials':
      //that.log(data);
      if (data.code === '0') {
        $.shopInfoList = data.data.resultData.list;
        that.log(`获取到${$.shopInfoList.length}个店铺`);
      }
      break
    case 'zoo_boxShopLottery':
      let result = data.data.result;
      switch (result.awardType) {
        case 8:
          that.log(`获得金币：${result.rewardScore}`);
          break;
        case 5:
          that.log(`获得：adidas能量`);
          break;
        case 2:
        case 3:
          that.log(`获得优惠券：${result.couponInfo.usageThreshold} 优惠：${result.couponInfo.quota}，${result.couponInfo.useRange}`);
          break;
        default:
          that.log(`抽奖获得未知`);
          that.log(JSON.stringify(data));
      }
      break
    case 'zoo_wishShopLottery':
      that.log(JSON.stringify(data));
      break
    case `zoo_myMap`:
      if (data.code === 0) {
        $.myMapList = data.data.result.sceneMap.sceneInfo;
      }
      break;
    case 'zoo_getWelfareScore':
      if (data.code === 0) {
        that.log(`分享成功，获得：${data.data.result.score}`);
      }
      break;
    case 'jdjrTaskDetail':
      if (data.resultCode === 0) {
        $.jdjrTaskList = data.resultData.top;
      }
      break;
    case 'jdjrAcceptTask':
      if (data.resultCode === 0) {
        that.log(`领任务成功`);
      }
      break;
    case 'add_car':
      if (data.code === 0) {
        let acquiredScore = data.data.result.acquiredScore;
        if(Number(acquiredScore) > 0){
          that.log(`加购成功,获得金币:${acquiredScore}`);
        }else{
          that.log(`加购成功`);
        }
      }else{
        that.log(JSON.stringify(data));
        that.log(`加购失败`);
      }
      break
    default:
      that.log(`未判断的异常${type}`);
  }
}
function takeGetRequest(){
  return new Promise(async resolve => {
    $.get({
      url:`https://ms.jr.jd.com/gw/generic/mission/h5/m/finishReadMission?reqData={%22missionId%22:%22${$.taskId}%22,%22readTime%22:8}`,
      headers:{
        'Origin' : `https://prodev.m.jd.com`,
        'Cookie': $.cookie,
        'Connection' : `keep-alive`,
        'Accept' : `*/*`,
        'Referer' : `https://prodev.m.jd.com`,
        'Host' : `ms.jr.jd.com`,
        'User-Agent': $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
        'Accept-Encoding' : `gzip, deflate, br`,
        'Accept-Language' : `zh-cn`
      }
    }, (err, resp, data) => {
      try {
        data = JSON.parse(data);
        if (data.resultCode === 0) {
          that.log(`任务完成`);
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

//领取奖励
function callbackResult(info) {
  return new Promise((resolve) => {
    let url = {
      url: `https://api.m.jd.com/?functionId=qryViewkitCallbackResult&client=wh5&clientVersion=1.0.0&body=${info}&_timestamp=` + Date.now(),
      headers: {
        'Origin': `https://bunearth.m.jd.com`,
        'Cookie': $.cookie,
        'Connection': `keep-alive`,
        'Accept': `*/*`,
        'Host': `api.m.jd.com`,
        'User-Agent': $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
        'Accept-Encoding': `gzip, deflate, br`,
        'Accept-Language': `zh-cn`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Referer': 'https://bunearth.m.jd.com'
      }
    }

    $.get(url, async (err, resp, data) => {
      try {
        data = JSON.parse(data);
        that.log(data.toast.subTitle)
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve()
      }
    })
  })
}

async function getPostRequest(type, body) {
  let url = `https://api.m.jd.com/client.action?functionId=${type}`;
  if(type === 'listTask' || type === 'acceptTask' ){
    url = `https://ms.jr.jd.com/gw/generic/hy/h5/m/${type}`;
  }
  const method = `POST`;
  const headers = {
    'Accept': `application/json, text/plain, */*`,
    'Origin': `https://wbbny.m.jd.com`,
    'Accept-Encoding': `gzip, deflate, br`,
    'Cookie': $.cookie,
    'Content-Type': `application/x-www-form-urlencoded`,
    'Host': `api.m.jd.com`,
    'Connection': `keep-alive`,
    'User-Agent': $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
    'Referer': `https://wbbny.m.jd.com`,
    'Accept-Language': `zh-cn`
  };
  return {url: url, method: method, headers: headers, body: body};
}

function getBody(type) {
  let rnd = Math.floor(1e6 + 9e6 * Math.random()).toString()
  let ss = JSON.stringify({"extraData" : {"log": "-1", "sceneid": "QD216hPageh5"}, "secretp": $.secretp, "random": rnd.toString()});
  let taskBody = '';
  if (type === 'help') {
    taskBody = `functionId=zoo_collectScore&body=${JSON.stringify({"taskId": 2,"inviteId":$.inviteId,"actionType":1,"ss" :ss})}&client=wh5&clientVersion=1.0.0`
  } else if (type === 'pkHelp') {
    taskBody = `functionId=zoo_pk_assistGroup&body=${JSON.stringify({"confirmFlag": 1,"inviteId" : $.pkInviteId,"ss" : ss})}&client=wh5&clientVersion=1.0.0`;
  } else if (type === 'zoo_collectProduceScore') {
    taskBody = `functionId=zoo_collectProduceScore&body=${JSON.stringify({"ss" :ss})}&client=wh5&clientVersion=1.0.0`;
  } else if(type === 'zoo_getWelfareScore'){
    taskBody = `functionId=zoo_getWelfareScore&body=${JSON.stringify({"type": 2,"currentScence":$.currentScence,"ss" : ss})}&client=wh5&clientVersion=1.0.0`;
  } else if(type === 'add_car'){
    taskBody = `functionId=zoo_collectScore&body=${JSON.stringify({"taskId": $.taskId,"taskToken":$.taskToken,"actionType":1,"ss" : ss})}&client=wh5&clientVersion=1.0.0`
  }else{
    taskBody = `functionId=${type}&body=${JSON.stringify({"taskId": $.oneTask.taskId,"actionType":1,"taskToken" : $.oneActivityInfo.taskToken,"ss" : ss})}&client=wh5&clientVersion=1.0.0`
  }
  return taskBody
}

/**
 * 随机从一数组里面取
 * @param arr
 * @param count
 * @returns {Buffer}
 */
function getRandomArrayElements(arr, count) {
  var shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
  while (i-- > min) {
    index = Math.floor((i + 1) * Math.random());
    temp = shuffled[index];
    shuffled[index] = shuffled[i];
    shuffled[i] = temp;
  }
  return shuffled.slice(min);
}
function getAuthorShareCode(url = "http://cdn.annnibb.me/eb6fdc36b281b7d5eabf33396c2683a.json") {
  return new Promise(async resolve => {
    $.get({url,headers:{
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/87.0.4280.88"
      }, "timeout": 10000}, async (err, resp, data) => {
      try {
        if (err) {
        } else {
          if (data) data = JSON.parse(data)
        }
      } catch (e) {
        // $.logErr(e, resp)
      } finally {
        resolve(data || []);
      }
    })
    await $.wait(10000)
    resolve();
  })
}

function TotalBean() {
  return new Promise(async resolve => {
    const options = {
      url: "https://me-api.jd.com/user_new/info/GetJDUserInfoUnion",
      headers: {
        Host: "me-api.jd.com",
        Accept: "*/*",
        Connection: "keep-alive",
        Cookie: $.cookie,
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

