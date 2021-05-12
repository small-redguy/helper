const STRSPLIT = "|";
const needSum = false;            //是否需要显示汇总
const printDetail = false;        //是否显示出参详情

const appIdArr = ['1EFRRxA','1EFRQwA','1EFRQw64','1EFRXxg','1EFVRww','1EFRYxA','1EFRZwA','1EFRZwQ','1EFRYwA']
const homeDataFunPrefixArr = ['interact_template','interact_template','','','','','','','','','','','','','','','','interact_template','interact_template']
const collectScoreFunPrefixArr = ['','','','','','','','','','','','','','','','','','interact_template','interact_template']
const lotteryResultFunPrefixArr = ['','','','','','interact_template','','','','','','','','','','','','','interact_template','interact_template']
let merge = {}
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [], cookie = '';
let appId='';
	let shareCode=undefined;
	let shareCodeArr=[];
	let homeDataFunPrefix = 'interact_template'
	let collectScoreFunPrefix ='harmony'
	let lotteryResultFunPrefix = homeDataFunPrefix
	let browseTime =  6
	let scorePerLottery="";
const JD_API_HOST = `https://api.m.jd.com/client.action`;
!(async () => {
  await requireConfig()
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/', {"open-url": "https://bean.m.jd.com/"});
    return;
  }
  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i];
    if (cookie) {
      if (i) that.log(`\n***************开始京东账号${i + 1}***************`)
      initial();
      await  QueryJDUserInfo();
      if (!merge.enabled)  //cookie不可用
      {
        $.setdata('', `CookieJD${i ? i + 1 : "" }`);//cookie失效，故清空cookie。
        $.msg($.name, `【提示】京东账号${i + 1} cookie已过期！请先获取cookie\n直接使用NobyDa的京东签到获取`, 'https://bean.m.jd.com/', {"open-url": "https://bean.m.jd.com/"});
        continue;
      }
      for (let j in appIdArr) {
        //j = appIdArr.length - 1
        appId = appIdArr[j]
        homeDataFunPrefix = homeDataFunPrefixArr[j]||'healthyDay'
        collectScoreFunPrefix = collectScoreFunPrefixArr[j]||'harmony'
        lotteryResultFunPrefix = lotteryResultFunPrefixArr[j]||'interact_template'
        browseTime = 6
        if (parseInt(j)) that.log(`\n开始第${parseInt(j) + 1}个抽奖活动`)
        await interact_template_getHomeData();
        //break
      }
      await msgShow();
      //break
    }
  }
})()
  .catch((e) => $.logErr(e))
  .finally(() => $.done())

//获取昵称
function QueryJDUserInfo(timeout = 0) {
  return new Promise((resolve) => {
    setTimeout( ()=>{
      let url = {
        url : `https://wq.jd.com/user/info/QueryJDUserInfo?sceneval=2`,
        headers : {
          'Referer' : `https://wqs.jd.com/my/iserinfo.html`,
          'Cookie' : cookie
        }
      }
      $.get(url, (err, resp, data) => {
        try {
          data = JSON.parse(data);
          if (data.retcode === 13) {
            merge.enabled = false
            return
          }
          merge.nickname = data.base.nickname;
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve()
        }
      })
    },timeout)
  })
}
//获取活动信息
function interact_template_getHomeData(timeout = 0) {
  return new Promise((resolve) => {
    setTimeout( ()=>{
      let url = {
        url : `${JD_API_HOST}`,
        headers : {
          'Origin' : `https://h5.m.jd.com`,
          'Cookie' : cookie,
          'Connection' : `keep-alive`,
          'Accept' : `application/json, text/plain, */*`,
          'Content-Type': 'application/x-www-form-urlencoded',
          'Referer' : `https://h5.m.jd.com/babelDiy/Zeus/2WBcKYkn8viyxv7MoKKgfzmu7Dss/index.html`,
          'Host' : `api.m.jd.com`,
          'Accept-Encoding' : `gzip, deflate, br`,
          'Accept-Language' : `zh-cn`
        },
        body : `functionId=${homeDataFunPrefix}_getHomeData&body={"appId":"${appId}","taskToken":""}&client=wh5&clientVersion=1.0.0`
      }

      $.post(url, async (err, resp, data) => {
        try {
          if (printDetail) that.log(data);
          data = JSON.parse(data);
          if (data.data.bizCode !== 0) {
            that.log(data.data.bizMsg);
            merge.jdBeans.fail++;
            merge.jdBeans.notify = `${data.data.bizMsg}`;
            return
          }
          scorePerLottery = data.data.result.userInfo.scorePerLottery||data.data.result.userInfo.lotteryMinusScore
          if (data.data.result.raiseInfo&&data.data.result.raiseInfo.levelList) scorePerLottery = data.data.result.raiseInfo.levelList[data.data.result.raiseInfo.scoreLevel];
          //that.log(scorePerLottery)
          for (let i = 0;i < data.data.result.taskVos.length;i ++) {
            that.log("\n" + data.data.result.taskVos[i].taskType + '-' + data.data.result.taskVos[i].taskName  + '-' + (data.data.result.taskVos[i].status === 1 ? `已完成${data.data.result.taskVos[i].times}-未完成${data.data.result.taskVos[i].maxTimes}` : "全部已完成"))
            //签到
            if (data.data.result.taskVos[i].status === 3) {
              that.log('开始抽奖')
              await interact_template_getLotteryResult(data.data.result.taskVos[i].taskId);
              continue;
            }
            if ([0,13].includes(data.data.result.taskVos[i].taskType)) {
              if (data.data.result.taskVos[i].status === 1) {
                await harmony_collectScore(data.data.result.taskVos[i].simpleRecordInfoVo.taskToken,data.data.result.taskVos[i].taskId);
              }
              continue
            }
            if ([14,6].includes(data.data.result.taskVos[i].taskType)) {
              //that.log(data.data.result.taskVos[i].assistTaskDetailVo.taskToken)
              if (cookiesArr.indexOf(cookie) === 0) {
                shareCodeArr[appIdArr.indexOf(appId)] = data.data.result.taskVos[i].assistTaskDetailVo.taskToken
              }
              if (shareCode) await harmony_collectScore(shareCode,data.data.result.taskVos[i].taskId);
              for (let j = 0;j <(data.data.result.userInfo.lotteryNum||0);j++) {
                if (appId === "1EFRTxQ") {
                  await ts_smashGoldenEggs()
                }  else {
                  await interact_template_getLotteryResult(data.data.result.taskVos[i].taskId);
                }
              }
              continue
            }
            let list = data.data.result.taskVos[i].productInfoVos || data.data.result.taskVos[i].followShopVo || data.data.result.taskVos[i].shoppingActivityVos || data.data.result.taskVos[i].browseShopVo
            if (data.data.result.taskVos[i].subTitleName.match(/(\d+)(s)/)) {
              browseTime = parseInt(data.data.result.taskVos[i].subTitleName.match(/(\d+)(s)/)[0])
            }
            for (let k = data.data.result.taskVos[i].times; k < data.data.result.taskVos[i].maxTimes; k++) {
              for (let j in list) {
                if (list[j].status === 1) {
                  //that.log(list[j].simpleRecordInfoVo||list[j].assistTaskDetailVo)
                  that.log("\n" + (list[j].title || list[j].shopName||list[j].skuName))
                  //that.log(list[j].itemId)
                  if (list[j].itemId) {
                    await harmony_collectScore(list[j].taskToken,data.data.result.taskVos[i].taskId,list[j].itemId,1);
                    if (k === data.data.result.taskVos[i].maxTimes - 1) await interact_template_getLotteryResult(data.data.result.taskVos[i].taskId);
                  } else {
                    await harmony_collectScore(list[j].taskToken,data.data.result.taskVos[i].taskId)
                  }
                  list[j].status = 2;
                  break;
                } else {
                  continue;
                }
              }
            }
          }
          if (scorePerLottery) await interact_template_getLotteryResult();
          //for (let j = 0;j <(data.data.result.userInfo.lotteryNum||0 && appId === "1EFRTxQ");j++) {
          //    await ts_smashGoldenEggs()
          //}
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve()
        }
      })
    },timeout)
  })
}
//做任务
function harmony_collectScore(taskToken,taskId,itemId = "",actionType = 0,timeout = 0) {
  return new Promise((resolve) => {
    setTimeout( ()=>{
      let url = {
        url : `${JD_API_HOST}`,
        headers : {
          'Origin' : `https://h5.m.jd.com`,
          'Cookie' : cookie,
          'Connection' : `keep-alive`,
          'Accept' : `application/json, text/plain, */*`,
          'Referer' : `https://h5.m.jd.com/babelDiy/Zeus/2WBcKYkn8viyxv7MoKKgfzmu7Dss/index.html`,//?inviteId=P225KkcRx4b8lbWJU72wvZZcwCjVXmYaS5jQ P225KkcRx4b8lbWJU72wvZZcwCjVXmYaS5jQ?inviteId=${shareCode}
          'Host' : `api.m.jd.com`,
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept-Encoding' : `gzip, deflate, br`,
          'Accept-Language' : `zh-cn`
        },
        body : `functionId=${collectScoreFunPrefix}_collectScore&body={"appId":"${appId}","taskToken":"${taskToken}","taskId":${taskId}${itemId ? ',"itemId":"'+itemId+'"' : ''},"actionType":${actionType}&client=wh5&clientVersion=1.0.0`
      }
      //that.log(url.body)
      //if (appId === "1EFRTxQ") url.body += "&appid=golden-egg"
      $.post(url, async (err, resp, data) => {
        try {
          if (printDetail) that.log(data);
          data = JSON.parse(data);
          that.log(data.data.bizMsg)
          if (data.data.bizMsg === "任务领取成功") {
            await harmony_collectScore(taskToken,taskId,itemId,0,parseInt(browseTime) * 1000);
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve()
        }
      })
    },timeout)
  })
}
//抽奖
function interact_template_getLotteryResult(taskId,timeout = 0) {
  return new Promise((resolve) => {
    setTimeout( ()=>{
      let url = {
        url : `${JD_API_HOST}`,
        headers : {
          'Origin' : `https://h5.m.jd.com`,
          'Cookie' : cookie,
          'Connection' : `keep-alive`,
          'Accept' : `application/json, text/plain, */*`,
          'Referer' : `https://h5.m.jd.com/babelDiy/Zeus/2WBcKYkn8viyxv7MoKKgfzmu7Dss/index.html?inviteId=P04z54XCjVXmYaW5m9cZ2f433tIlGBj3JnLHD0`,//?inviteId=P225KkcRx4b8lbWJU72wvZZcwCjVXmYaS5jQ P225KkcRx4b8lbWJU72wvZZcwCjVXmYaS5jQ
          'Host' : `api.m.jd.com`,
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept-Encoding' : `gzip, deflate, br`,
          'Accept-Language' : `zh-cn`
        },
        body : `functionId=${lotteryResultFunPrefix}_getLotteryResult&body={"appId":"${appId}"${taskId ? ',"taskId":"'+taskId+'"' : ''}}&client=wh5&clientVersion=1.0.0`
      }
      //that.log(url.body)
      //if (appId === "1EFRTxQ") url.body = `functionId=ts_getLottery&body={"appId":"${appId}"${taskId ? ',"taskId":"'+taskId+'"' : ''}}&client=wh5&clientVersion=1.0.0&appid=golden-egg`
      $.post(url, async (err, resp, data) => {
        try {
          if (printDetail) that.log(data);
          if (!timeout) that.log('\n开始抽奖')
          data = JSON.parse(data);
          if (data.data.bizCode === 0) {
            if (data.data.result.userAwardsCacheDto.jBeanAwardVo) {
              merge.jdBeans.success++;
              that.log('京豆:' + data.data.result.userAwardsCacheDto.jBeanAwardVo.quantity)
              merge.jdBeans.prizeCount += parseInt(data.data.result.userAwardsCacheDto.jBeanAwardVo.quantity)
            }
            if (data.data.result.userAwardsCacheDto.redPacketVO) {
              merge.redPacket.show = true;
              merge.redPacket.success++;
              that.log('红包:' + data.data.result.userAwardsCacheDto.redPacketVO.value)
              merge.redPacket.prizeCount += parseFloat(data.data.result.userAwardsCacheDto.redPacketVO.value)
            }
            if (data.data.result.raiseInfo) scorePerLottery = parseInt(data.data.result.raiseInfo.nextLevelScore);
            if (parseInt(data.data.result.userScore) >= scorePerLottery && scorePerLottery) {
              await interact_template_getLotteryResult(1000)
            }
          } else{
            merge.jdBeans.fail++;
            that.log(data.data.bizMsg)
            if (data.data.bizCode === 111 ) data.data.bizMsg = "无机会"
            merge.jdBeans.notify = `${data.data.bizMsg}`;
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve()
        }
      })
    },timeout)
  })
}

function requireConfig() {
  return new Promise(resolve => {
    //Node.js用户请在jdCookie.js处填写京东ck;
    const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
    //IOS等用户直接用NobyDa的jd cookie
    if ($.isNode()) {
      Object.keys(jdCookieNode).forEach((item) => {
        if (jdCookieNode[item]) {
          cookiesArr.push(jdCookieNode[item])
        }
      })
    } else {
      let cookiesData = $.getdata('CookiesJD') || "[]";
      cookiesData = jsonParse(cookiesData);
      cookiesArr = cookiesData.map(item => item.cookie);
      cookiesArr.reverse();
      cookiesArr.push(...[$.getdata('CookieJD2'), $.getdata('CookieJD')]);
      cookiesArr.reverse();
      cookiesArr = cookiesArr.filter(item => item !== "" && item !== null && item !== undefined);
    }
    that.log(`共${cookiesArr.length}个京东账号\n`);
    resolve()
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

//初始化
function initial() {
   merge = {
     nickname: "",
     enabled: true,
     redPacket: {prizeDesc : "抽得|红包|元",number : true,fixed : 2},  //定义 动作|奖励名称|奖励单位   是否是数字
     jdBeans: {prizeDesc : "抽得|京豆|个",number : true,fixed : 0}
  }
  //for (let i in merge) {
    merge.success = 0;
    merge.fail = 0;
    merge.prizeCount = 0;
    merge.notify = "";
    merge.show = true;
  //}
  merge.redPacket.show = false;
}
//通知
function msgShow() {
  let message = "";//https://h5.m.jd.com/babelDiy/Zeus/YgnrqBaEmVHWppzCgW8zjZj3VjV/index.html
  let url ={ "open-url" : `openapp.jdmobile://virtual?params=%7B%22category%22%3A%22jump%22%2C%22des%22%3A%22m%22%2C%22url%22%3A%22https%3A%2F%2Fbean.m.jd.com%2FbeanDetail%2Findex.action%3FresourceValue%3Dbean%22%7D`}
  let title = `京东账号：${merge.nickname}`;
  for (let i in merge) {
    if (typeof (merge[i]) !== "object" || !merge[i].show) continue;
    if (merge[i].notify.split("").reverse()[0] === "\n") merge[i].notify = merge[i].notify.substr(0,merge[i].notify.length - 1);
    message += `${merge[i].prizeDesc.split(STRSPLIT)[0]}${merge[i].prizeDesc.split(STRSPLIT)[1]}：` + (merge[i].success ? `${merge[i].prizeCount.toFixed(merge[i].fixed)}${merge[i].prizeDesc.split(STRSPLIT)[2]}\n` : `失败：${merge[i].notify}\n`)
  }
//合计
  if (needSum) {
    $.sum = {};
    for (let i in merge) {
      if (typeof (merge[i]) !== "object" || !merge[i].show) continue;
      if (typeof ($.sum[merge[i].prizeDesc.split(STRSPLIT)[1]]) === "undefined")  $.sum[merge[i].prizeDesc.split(STRSPLIT)[1]] = {count : 0};
      $.sum[merge[i].prizeDesc.split(STRSPLIT)[1]].count += merge[i].prizeCount;
    }
    message += `合计：`
    for (let i in $.sum)
    {
      message += `${$.sum[i].count.toFixed($.sum[i].fixed)}${i}，`
    }
  }
  message += `请点击通知跳转至APP查看`
  //message = message.substr(0,message.length - 1);
  $.msg($.name, title, message, url);
}
