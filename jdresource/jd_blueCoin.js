const notify = $.isNode() ? require('./sendNotify') : '';
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
let coinToBeans = '0'; //兑换多少数量的京豆（20或者1000），0表示不兑换，默认兑换20京豆，如需兑换把0改成20或者1000，或者'商品名称'(商品名称放到单引号内)即可
let jdNotify = false;//是否开启静默运行，默认false关闭(即:奖品兑换成功后会发出通知提示)
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [], cookie = '';
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') that.log = () => {};
} else {
  let cookiesData = $.getdata('CookiesJD') || "[]";
  cookiesData = jsonParse(cookiesData);
  cookiesArr = cookiesData.map(item => item.cookie);
  cookiesArr.reverse();
  cookiesArr.push(...[$.getdata('CookieJD2'), $.getdata('CookieJD')]);
  cookiesArr.reverse();
  cookiesArr = cookiesArr.filter(item => item !== "" && item !== null && item !== undefined);
}

const JD_API_HOST = `https://api.m.jd.com/api?appid=jdsupermarket`;
!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
    return;
  }
  for (let i =0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i];
    if (cookie) {
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=(.+?);/) && cookie.match(/pt_pin=(.+?);/)[1])
      $.index = i + 1;
      $.data = {};
      $.coincount = 0;
      $.beanscount = 0;
      $.blueCost = 0;
      $.coinerr = "";
      $.beanerr = "";
      $.title = '';
      //that.log($.coincount);
      $.isLogin = true;
      $.nickName = '';
      await TotalBean();
      that.log(`\n开始【京东账号${$.index}】${$.nickName || $.UserName}\n`);
      that.log(`目前暂无兑换酒类的奖品功能，即使输入酒类名称，脚本也会提示下架\n`)
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});

        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }
        continue
      }
      //先兑换京豆
      if ($.isNode()) {
        if (process.env.MARKET_COIN_TO_BEANS) {
          coinToBeans = process.env.MARKET_COIN_TO_BEANS;
        }
      }
      if (`${coinToBeans}` !== '0') {
        await smtgHome();//查询蓝币数量，是否满足兑换的条件
        await PrizeIndex();
      } else {
        that.log('查询到您设置的是不兑换京豆选项，现在为您跳过兑换京豆。如需兑换，请去BoxJs设置或者修改脚本coinToBeans\n')
      }
      await msgShow();
    }
  }
})()
  .catch((e) => $.logErr(e))
  .finally(() => $.done())
async function PrizeIndex() {
  await smtg_queryPrize();
  // await smtg_materialPrizeIndex();//兑换酒类奖品，此兑换API与之前的兑换京豆类的不一致，故目前无法进行
  // const prizeList = [...$.queryPrizeData, ...$.materialPrizeIndex];
  const prizeList = [...$.queryPrizeData];
  that.log("当前奖品兑换列表");
  for(let item of prizeList){
      that.log('奖品Id:'+item.prizeId+",奖品名称："+item.title+",需蓝币:"+item.blueCost);
  }
  if (`${coinToBeans}` === '1000') {
    if (prizeList[1] && prizeList[1].beanType === 'BeanPackage') {
      that.log(`查询换${prizeList[1].title}ID成功，ID:${prizeList[1].prizeId}`)
      $.title = prizeList[1].title;
      $.blueCost = prizeList[1].blueCost;
    } else {
      that.log(`查询换1000京豆ID失败`)
      $.beanerr = `东哥今天不给换`;
      return ;
    }
    if (prizeList[1] && prizeList[1].inStock === 506) {
      $.beanerr = `失败，1000京豆领光了，请明天再来`;
      return ;
    }
    if (prizeList[1] && prizeList[1].targetNum === prizeList[1] && prizeList[1].finishNum) {
      $.beanerr = `${prizeList[1].subTitle}`;
      return ;
    }
    //兑换1000京豆
    if ($.totalBlue > $.blueCost) {
      await smtg_obtainPrize(prizeList[1].prizeId);
    } else {
      that.log(`兑换失败,您目前蓝币${$.totalBlue}个,不足以兑换${$.title}所需的${$.blueCost}个`);
      $.beanerr = `兑换失败,您目前蓝币${$.totalBlue}个,不足以兑换${$.title}所需的${$.blueCost}个`;
    }
  } else if (`${coinToBeans}` === '20') {
    if (prizeList[0] && prizeList[0].beanType === 'Bean') {
      that.log(`查询换${prizeList[0].title}ID成功，ID:${prizeList[0].prizeId}`)
      $.title = prizeList[0].title;
      $.blueCost = prizeList[0].blueCost;
    } else {
      that.log(`查询换万能的京豆ID失败`)
      $.beanerr = `东哥今天不给换`;
      return ;
    }
    if (prizeList[0] && prizeList[0].inStock === 506) {
      that.log(`失败，万能的京豆领光了，请明天再来`);
      $.beanerr = `失败，万能的京豆领光了，请明天再来`;
      return ;
    }
    if ((prizeList[0] && prizeList[0].targetNum) === (prizeList[0] && prizeList[0].finishNum)) {
      $.beanerr = `${prizeList[0].subTitle}`;
      return ;
    }
    //兑换万能的京豆(1-20京豆)
    if ($.totalBlue > $.blueCost) {
      await smtg_obtainPrize(prizeList[0].prizeId,1000);
    } else {
      that.log(`兑换失败,您目前蓝币${$.totalBlue}个,不足以兑换${$.title}所需的${$.blueCost}个`);
      $.beanerr = `兑换失败,您目前蓝币${$.totalBlue}个,不足以兑换${$.title}所需的${$.blueCost}个`;
    }
  } else {
    //自定义输入兑换
    let prizeId = '', i;
    for (let index = 0; index < prizeList.length; index ++) {
      if (prizeList[index].title.indexOf(coinToBeans) > -1) {
        prizeId = prizeList[index].prizeId;
        i = index;
        $.title = prizeList[index].title;
        $.blueCost = prizeList[index].blueCost;
      }
    }
    if (prizeId) {
      if(prizeId){
          let count=0;
          while(count<100){
            count++;
            await smtg_obtainPrize(prizeId);
            await $.wait(100);
          }
      }
      if (prizeList[i].inStock === 506 || prizeList[i].inStock === -1) {
        that.log(`失败，您输入设置的${coinToBeans}领光了，请明天再来`);
        $.beanerr = `失败，您输入设置的${coinToBeans}领光了，请明天再来`;
        return ;
      }
      if ((prizeList[i].targetNum) && prizeList[i].targetNum === prizeList[i].finishNum) {
        $.beanerr = `${prizeList[0].subTitle}`;
        return ;
      }
      if ($.totalBlue > $.blueCost) {
          let count=0;
          while(count<100){
            count++;
            await smtg_obtainPrize(prizeId);
            await $.wait(100);
          }
      } else {
        that.log(`兑换失败,您目前蓝币${$.totalBlue}个,不足以兑换${$.title}所需的${$.blueCost}个`);
        $.beanerr = `兑换失败,您目前蓝币${$.totalBlue}个,不足以兑换${$.title}所需的${$.blueCost}个`;
      }
    } else {
      that.log(`奖品兑换列表[${coinToBeans}]已下架，请检查APP是否存在此商品，如存在请检查您的输入是否正确`);
      $.beanerr = `奖品兑换列表[${coinToBeans}]已下架`;
    }
  }
}
//查询白酒类奖品列表API
function smtg_materialPrizeIndex(timeout = 0) {
  return new Promise((resolve) => {
    setTimeout( ()=>{
      let url = {
        url : `${JD_API_HOST}&functionId=smtg_materialPrizeIndex&clientVersion=8.0.0&client=m&body=%7B%22channel%22:%221%22%7D&t=${Date.now()}`,
        headers : {
          'Origin' : `https://jdsupermarket.jd.com`,
          'Cookie' : cookie,
          'Connection' : `keep-alive`,
          'Accept' : `application/json, text/plain, */*`,
          'Referer' : `https://jdsupermarket.jd.com/game/?tt=1597540727225`,
          'Host' : `api.m.jd.com`,
          'Accept-Encoding' : `gzip, deflate, br`,
          'Accept-Language' : `zh-cn`
        }
      }
      $.post(url, async (err, resp, data) => {
        try {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.data.bizCode !== 0) {
              $.beanerr = `${data.data.bizMsg}`;
              return
            }
            $.materialPrizeIndex = data.data.result.prizes || [];
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
//查询任务
function smtg_queryPrize(timeout = 0){
  return new Promise((resolve) => {
    setTimeout( ()=>{
      let url = {
        url : `${JD_API_HOST}&functionId=smtg_queryPrize&clientVersion=8.0.0&client=m&body=%7B%7D&t=${Date.now()}`,
        headers : {
          'Origin' : `https://jdsupermarket.jd.com`,
          'Cookie' : cookie,
          'Connection' : `keep-alive`,
          'Accept' : `application/json, text/plain, */*`,
          'Referer' : `https://jdsupermarket.jd.com/game/?tt=1597540727225`,
          'Host' : `api.m.jd.com`,
          'Accept-Encoding' : `gzip, deflate, br`,
          'Accept-Language' : `zh-cn`
        }
      }
      $.post(url, async (err, resp, data) => {
        try {
          if (safeGet(data)) {
            data = JSON.parse(data);
            $.queryPrizeData = data;
            if (data.data.bizCode !== 0) {
              $.beanerr = `${data.data.bizMsg}`;
              return
            }
            if (data.data.bizCode === 0) {
              const { prizeList } = data.data.result;
              $.queryPrizeData = data.data.result.prizeList || [];
            }
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
//换京豆
function smtg_obtainPrize(prizeId, timeout = 0) {
  //1000京豆，prizeId为4401379726
  return new Promise((resolve) => {
    setTimeout( ()=>{
      let url = {
        url : `${JD_API_HOST}&functionId=smtg_obtainPrize&clientVersion=8.0.0&client=m&body=%7B%22prizeId%22:%22${prizeId}%22%7D&t=${Date.now()}`,
        headers : {
          'Origin' : `https://jdsupermarket.jd.com`,
          'Cookie' : cookie,
          'Connection' : `keep-alive`,
          'Accept' : `application/json, text/plain, */*`,
          'Referer' : `https://jdsupermarket.jd.com/game/?tt=1597540727225`,
          'Host' : `api.m.jd.com`,
          'Accept-Encoding' : `gzip, deflate, br`,
          'Accept-Language' : `zh-cn`
        }
      }
      $.post(url, async (err, resp, data) => {
        try {
          that.log(`兑换结果:${data}`);
          if (safeGet(data)) {
            data = JSON.parse(data);
            $.data = data;
            if ($.data.data.bizCode !== 0) {
              $.beanerr = `${$.data.data.bizMsg}`;
              //that.log(`【京东账号${$.index}】${$.nickName} 换取京豆失败：${$.data.data.bizMsg}`)
              return
            }
            if ($.data.data.bizCode === 0) {
              if (`${coinToBeans}` === '1000') {
                $.beanscount ++;
                that.log(`【京东账号${$.index}】${$.nickName} 第${$.data.data.result.exchangeNum}次换${$.title}成功`)
                if ($.beanscount === 1) return;
              } else if (`${coinToBeans}` === '20') {
                $.beanscount ++;
                that.log(`【京东账号${$.index}】${$.nickName} 第${$.data.data.result.exchangeNum}次换${$.title}成功`)
                if ($.data.data.result.exchangeNum === 20 || $.beanscount === coinToBeans || $.data.data.result.blue < 500) return;
              } else {
                $.beanscount ++;
                that.log(`【京东账号${$.index}】${$.nickName} 第${$.data.data.result.exchangeNum}次换${$.title}成功`)
                if ($.beanscount === 1) return;
              }
            }
          }
          await  smtg_obtainPrize(prizeId,3000);
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve()
        }
      })
    },timeout)
  })
}
function smtgHome() {
  return new Promise((resolve) => {
    $.get(taskUrl('smtg_home'), (err, resp, data) => {
      try {
        if (err) {
          that.log('\n京小超兑换奖品: API查询请求失败 ‼️‼️')
          that.log(JSON.stringify(err));
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.data.bizCode === 0) {
              const { result } = data.data;
              $.totalGold = result.totalGold;
              $.totalBlue = result.totalBlue;
              that.log(`【总金币】${$.totalGold}个\n`);
              that.log(`【总蓝币】${$.totalBlue}个\n`);
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

//通知
function msgShow() {
  // $.msg($.name, ``, `【京东账号${$.index}】${$.nickName}\n【收取蓝币】${$.coincount ? `${$.coincount}个` : $.coinerr }${coinToBeans ? `\n【兑换京豆】${ $.beanscount ? `${$.beanscount}个` : $.beanerr}` : ""}`);
  return new Promise(async resolve => {
    $.log(`\n【京东账号${$.index}】${$.nickName}\n${coinToBeans ? `【兑换${$.title}】${$.beanscount ? `成功` : $.beanerr}` : "您设置的是不兑换奖品"}\n`);
    let ctrTemp;
    if ($.isNode() && process.env.MARKET_REWARD_NOTIFY) {
      ctrTemp = `${process.env.MARKET_REWARD_NOTIFY}` === 'false';
    } else if ($.getdata('jdSuperMarketRewardNotify')) {
      ctrTemp = $.getdata('jdSuperMarketRewardNotify') === 'false';
    } else {
      ctrTemp = `${jdNotify}` === 'false';
    }
    //默认只在兑换奖品成功后弹窗提醒。情况情况加，只打印日志，不弹窗
    if ($.beanscount && ctrTemp) {
      $.msg($.name, ``, `【京东账号${$.index}】${$.nickName}\n${coinToBeans ? `【兑换${$.title}】${ $.beanscount ? `成功，数量：${$.beanscount}个` : $.beanerr}` : "您设置的是不兑换奖品"}`);
      if ($.isNode()) {
        await notify.sendNotify(`${$.name} - 账号${$.index} - ${$.nickName}`, `【京东账号${$.index}】${$.UserName}\n${coinToBeans ? `【兑换${$.title}】${$.beanscount ? `成功，数量：${$.beanscount}个` : $.beanerr}` : "您设置的是不兑换奖品"}`)
      }
    }
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
function taskUrl(function_id, body = {}) {
  return {
    url: `${JD_API_HOST}&functionId=${function_id}&clientVersion=8.0.0&client=m&body=${escape(JSON.stringify(body))}&t=${Date.now()}`,
    headers: {
      'User-Agent': $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0"),
      'Host': 'api.m.jd.com',
      'Cookie': cookie,
      'Referer': 'https://jdsupermarket.jd.com/game',
      'Origin': 'https://jdsupermarket.jd.com',
    }
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