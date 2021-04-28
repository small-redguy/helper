$.name="'直播间抽奖（全局）"
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
let cookiesArr = [
], cookie = '', message='';
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') that.log = () => {
  };
} else {
  cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}
let lotteryArr = []
!(async () => {
  cookie = cookiesArr[0]
  $.beans = cookiesArr.map(() => 0)
  $.attend = cookiesArr.map(() => 0)
  $.acts = 0
  await main()
  $.name = '直播间抽奖（全局）'
  await showMsg()
})()
  .catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
  })
  .finally(() => {
    $.done();
  })

async function main() {
  for (let tab of [1, 76, 80, 77, 88, 78, 82, 89, 118, 113, 131, 132, 79, 96, 142, 155, 222, 243, 276]) {
    $.page = 1
    $.currentCount = 0
    that.log(`当前tab：${tab}`)
    while ($.page) {
      that.log(`当前页：${$.page}`)
      await discoveryLiveList(tab, $.page, $.currentCount)
      //await $.wait(2*1000)
    }
  }
}

function showMsg() {
  return new Promise(resolve => {
    for (let i = 0; i < $.beans.length; ++i) {
      message += `账号${i + 1}获得:${$.beans[i]}京豆（中奖概率${($.attend[i] / $.acts * 100).toFixed(2)}%）\n`
    }
    $.msg($.name, '', `${message}`);
    resolve()
  })
}

async function discoveryLiveList(tabId, page, currentCount) {
  let config = taskGetUrl("liveListWithTabToM", {
    "tabId": tabId, "page": page, "currentCount": currentCount, "timestamp": +new Date(), "appId": "mini-live"
  })
  return new Promise(async resolve => {
    $.get(config, async (err, resp, data) => {
      data = JSON.parse(data)
      if (data.data && data.data.list && data.data.list.length) {
        $.page++
        $.currentCount = data.data.currentCount
      } else {
        $.page = 0
      }
      for (let live of data.data.list) {
        if (live.data && live.data.userName) {
          $.name = live.data.userName
          $.id = live.data.id
          await getLiveActivity(live.data.id)
          //await $.wait(2*1000)
        }
      }
      resolve()
    })
  })
}


async function getLiveActivity(liveId = null) {
  let config = taskGetUrl("liveDetailToM", {"liveId": liveId, "sku": ""})
  config['headers']['Cookie'] = '1'
  return new Promise(async resolve => {
    $.get(config, async (err, resp, data) => {
      data = JSON.parse(data)
      if (data.data) {
        if(data.data.activityRemind) {
          $.acts++
          let lottery = data.data.activityRemind
          if (lottery.length) {
            lottery = lottery[0]
            that.log(`【${$.name}】找到抽奖活动！${lottery.data.lotteryId}`)
            if (!lotteryArr.includes(Number(lottery.data.lotteryId))) {
              let timeout = 0
              if (lottery['countdown']) {
                timeout = lottery['startTime'] - +new Date() + 500
                that.log(`需要等待 ${timeout} ms`)
                // await $.wait(timeout)
              } else
                await drawLiveActivity(lottery.data.lotteryId, liveId)
              lotteryArr.push(Number(lottery.data.lotteryId))
            } else {
              that.log(`抽奖活动已抽过`)
            }
          } else {
            that.log(`【${$.name}】未找到抽奖活动`)
          }
        }
      }else{
        that.log(`被检测到，等待60秒`)
        await $.wait(60*1000)
        await getLiveActivity(liveId)
      }
      resolve()
    })
  })
}

async function drawLiveActivity(lotteryId, liveId) {
  let config = taskGetUrl("liveNomalLotteryToM", {"lotteryId": lotteryId, "liveId": liveId})
  return new Promise(async resolve => {
    $.post(config, async (err, resp, data) => {
      data = JSON.parse(data)
      if (data && data.data && data.data.lotteryResult !== undefined) {
        $.bean = null
        switch (data.data.lotteryResult) {
          default:
          case 0:
          case 2:
            that.log(`账户1：未抽中`)
            break
          case 1:
            that.log(`账户1：优惠券`)
            break
          case 3:
            that.log('账户1：' + data.data.couponQuota)
            if (data.data.couponQuota && data.data.couponQuota.match(/(\d+)京豆/)) {
              $.beans[0] += Number(data.data.couponQuota.match(/(\d+)京豆/)[1])
              $.bean = Number(data.data.couponQuota.match(/(\d+)京豆/)[1])
            }
            $.attend[0]++
            break
        }
        for (let i = 1; i < cookiesArr.length; ++i) {
          config['headers']['Cookie'] = cookiesArr[i]
          $.index = i + 1
          await drawLiveActivity2(config)
        }
      }
      resolve()
    })
  })
}


async function drawLiveActivity2(config) {
  return new Promise(resolve => {
    $.get(config, (err, resp, data) => {
      data = JSON.parse(data)
      if (data && data.data && data.data.lotteryResult !== undefined) {
        switch (data.data.lotteryResult) {
          default:
          case 0:
            that.log(`账户${$.index}：未抽中`)
            break
          case 2:
            that.log(`账户${$.index}：优惠券`)
            break
          case 3:
            that.log(`账户${$.index}：` + data.data.couponQuota)
            if (data.data.couponQuota && data.data.couponQuota.match(/(\d+)京豆/)) {
              $.beans[$.index - 1] += Number(data.data.couponQuota.match(/(\d+)京豆/)[1])
              $.bean = Number(data.data.couponQuota.match(/(\d+)京豆/)[1])
            }
            $.attend[$.index - 1]++
            break
        }
      }
      resolve()
    })
  })
}


function taskGetUrl(function_id, body) {
  return {
    url: `https://api.m.jd.com/api?appid=mini-live&functionId=${function_id}&t=${+new Date()}&body=${escape(JSON.stringify(body))}`,
    headers: {
      'host': 'api.m.jd.com',
      'accept': 'application/json, text/plain, */*',
      'accept-encoding': 'gzip, deflate, br',
      'accept-language': 'zh-Hans-JP;q=1, en-JP;q=0.9, zh-Hant-TW;q=0.8, ja-JP;q=0.7, en-US;q=0.6',
      'Content-Type': 'application/x-www-form-urlencoded',
      "User-Agent": 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.1(0x1800012a) NetType/WIFI Language/zh_CN',
      'Referer': 'https://servicewechat.com/wx4830b51270836408/13/page-frame.html',
      'Cookie': cookie
    }
  }
}

function safeGet(data) {
  try {
    if (typeof JSON.parse(data) == "object") {
      return true;
    }
  } catch (e) {
    that.log(e);
    that.log(`服务器访问数据为空，请检查自身设备网络情况`);
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
