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
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';

//IOS等用户直接用NobyDa的jd cookie

let cookiesArr = [], cookie = '', message = '', allMessage = '';


if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') that.log = () => {};
  if (JSON.stringify(process.env).indexOf('GITHUB') > -1) process.exit(0)
} else {
  cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}
let inviteCodes = [];
const JD_API_HOST = 'https://carnivalcity.m.jd.com';
const activeEndTime = '2021/06/21 00:00:00+08:00';//活动结束时间
let nowTime = new Date().getTime() + new Date().getTimezoneOffset()*60*1000 + 8*60*60*1000;
!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
    return;
  }
  $.temp = [];
  if (nowTime > new Date(activeEndTime).getTime()) {
    //活动结束后弹窗提醒
    $.msg($.name, '活动已结束', `该活动累计获得京豆：${$.jingBeanNum}个\n请删除此脚本\n咱江湖再见`);
    if ($.isNode()) await notify.sendNotify($.name + '活动已结束', `请删除此脚本\n咱江湖再见`);
    return
  }
  await updateShareCodesCDN();
  await requireConfig();
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = '';
      $.jingBeanNum = 0;//累计获得京豆
      $.integralCount = 0;//累计获得积分
      $.integer = 0;//当天获得积分
      $.lasNum = 0;//当天参赛人数
      $.num = 0;//当天排名
      $.beans = 0;//本次运行获得京豆数量
      $.blockAccount = false;//黑号
      message = '';
      await TotalBean();
      that.log(`\n开始【京东账号${$.index}】${$.nickName || $.UserName}\n`);
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});

        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }
        continue
      }
      await shareCodesFormat();
      await JD818();
    }
  }
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.canHelp = true;//能否助力
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      if ((cookiesArr && cookiesArr.length >= 1) && $.canHelp) {
        that.log(`\n先自己账号内部相互邀请助力\n`);
        for (let item of $.temp) {
          that.log(`\n${$.UserName} 去参助力 ${item}`);
          const helpRes = await toHelp(item.trim());
          if (helpRes.data.status === 5) {
            that.log(`助力机会已耗尽，跳出助力`);
            $.canHelp = false;
            break;
          }
        }
      }
      if ($.canHelp) {
        //that.log(`\n\n如果有剩余助力机会，则给作者lxk0301以及随机码助力`)
        //await doHelp();
      }
    }
  }
  // that.log(JSON.stringify($.temp))
  if (allMessage) {
    //NODE端,默认每月一日运行进行推送通知一次
    if ($.isNode()) {
      await notify.sendNotify($.name, allMessage, { url: JD_API_HOST });
      $.msg($.name, '', allMessage);
    }
  }
})()
    .catch((e) => {
      $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
    })
    .finally(() => {
      $.done();
    })

async function JD818() {
  try {
    await indexInfo();//获取任务
    await supportList();//助力情况
    await getHelp();//获取邀请码
    if ($.blockAccount) return
    await indexInfo(true);//获取任务
    await doHotProducttask();//做热销产品任务
    await doBrandTask();//做品牌手机任务
    await doBrowseshopTask();//逛好货街，做任务
    // await doHelp();
    await myRank();//领取往期排名奖励
    await getListRank();
    await getListIntegral();
    await getListJbean();
    await check();//查询抽奖记录(未兑换的，发送提醒通知);
    await showMsg()
  } catch (e) {
    $.logErr(e)
  }
}
async function doHotProducttask() {
  $.hotProductList = $.hotProductList.filter(v => !!v && v['status'] === "1");
  if ($.hotProductList && $.hotProductList.length) that.log(`开始 【浏览热销手机产品】任务,需等待6秒`)
  for (let item of $.hotProductList) {
    await doBrowse(item['id'], "", "hot", "browse", "browseHotSku");
    await $.wait(1000 * 6);
    if ($.browseId) {
      await getBrowsePrize($.browseId)
    }
  }
}
//做任务 API
function doBrowse(id = "", brandId = "", taskMark = "hot", type = "browse", logMark = "browseHotSku") {
  return new Promise(resolve => {
    const body = `brandId=${brandId}&id=${id}&taskMark=${taskMark}&type=${type}&logMark=${logMark}`;
    const options = taskPostUrl('/khc/task/doBrowse', body)
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          that.log(`doBrowse 做${taskMark}任务:${data}`);
          data = JSON.parse(data);
          if (data && data['code'] === 200) {
            $.browseId = data['data']['browseId'] || "";
          } else {
            that.log(`doBrowse异常`);
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
//领取奖励
function getBrowsePrize(browseId, brandId = '') {
  return new Promise(resolve => {
    const body = `brandId=${brandId}&browseId=${browseId}`;
    const options = taskPostUrl('/khc/task/getBrowsePrize', body)
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          that.log(`getBrowsePrize 领取奖励 结果:${data}`);
          data = JSON.parse(data);
          if (data && data['code'] === 200) {
            if (data['data']['jingBean']) $.beans += data['data']['jingBean'];
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

async function doBrandTask() {
  for (let brand of $.brandList) {
    await brandTaskInfo(brand['brandId']);
  }
}
function brandTaskInfo(brandId) {
  const options = taskUrl('/khc/index/brandTaskInfo', { t: Date.now(), brandId })
  $.skuTask = [];
  $.shopTask = [];
  $.meetingTask = [];
  $.questionTask = {};
  return new Promise( (resolve) => {
    $.get(options, async (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          if (data.code === 200) {
            let brandId = data['data']['brandId'];
            $.skuTask = data['data']['skuTask'] || [];
            $.shopTask = data['data']['shopTask'] || [];
            $.meetingTask = data['data']['meetingTask'] || [];
            $.questionTask = data['data']['questionTask'] || [];
            for (let sku of $.skuTask.filter(vo => !!vo && vo['status'] !== '4')){
              that.log(`\n开始做 品牌手机 【${data['data']['brandName']}】 任务`)
              that.log(`开始浏览 1-F 单品区 任务 ${sku['name']}`);
              await doBrowse(sku['id'], brandId, "brand", "presell", "browseSku");
              await $.wait(1000 * 6);
              if ($.browseId) await getBrowsePrize($.browseId, brandId);
            }
            for (let sku of $.shopTask.filter(vo => !!vo && vo['status'] !== '4')){
              that.log(`\n开始做 品牌手机 【${data['data']['brandName']}】 任务`)
              that.log(`开始浏览 2-F 专柜区 任务 ${sku['name']}，需等待10秒`);
              await doBrowse(sku['id'], brandId, "brand", "follow", "browseShop");
              await $.wait(10100);
              if ($.browseId) await getBrowsePrize($.browseId, brandId);
            }
            for (let sku of $.meetingTask.filter(vo => !!vo && vo['status'] !== '4')){
              that.log(`\n开始做 品牌手机 【${data['data']['brandName']}】 任务`)
              that.log(`开始浏览 3-F 综合区 任务 ${sku['name']}，需等待10秒`);
              await doBrowse(sku['id'], brandId, "brand", "meeting", "browseVenue");
              await $.wait(10500);
              if ($.browseId) await getBrowsePrize($.browseId, brandId);
            }
            if ($.questionTask.hasOwnProperty('id') && $.questionTask['result'] === '0') {
              that.log(`\n开始做 品牌手机 【${data['data']['brandName']}】 任务`)
              that.log(`开始做答题任务 ${$.questionTask['question']}`);
              let result = 0;
              for (let i = 0; i < $.questionTask['answers'].length; i ++) {
                if ($.questionTask['answers'][i]['right']) {
                  result = i + 1;//正确答案
                }
              }
              if (result !== 0) {
                await doQuestion(brandId, $.questionTask['id'], result);
              }
            }
          } else {
            that.log(`失败：${JSON.stringify(data)}`);
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  });
}
function doQuestion(brandId, questionId, result) {
  return new Promise(resolve => {
    const body = `brandId=${brandId}&questionId=${questionId}&result=${result}`;
    const options = taskPostUrl('/khc/task/doQuestion', body)
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          that.log(`doQuestion 领取答题任务奖励 结果:${data}`);
          data = JSON.parse(data);
          if (data && data['code'] === 200) {
            if (data['data']['jingBean']) $.beans += data['data']['jingBean'];
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
//逛好货街，做任务
async function doBrowseshopTask() {
  $.browseshopList = $.browseshopList.filter(v => !!v && v['status'] === "6");
  if ($.browseshopList && $.browseshopList.length) that.log(`\n开始 【逛好货街，做任务】，需等待10秒`)
  for (let shop of $.browseshopList) {
    await doBrowse(shop['id'], "", "browseShop", "browse", "browseShop");
    await $.wait(10000);
    if ($.browseId) {
      await getBrowsePrize($.browseId)
    }
  }
}
function indexInfo(flag = false) {
  const options = taskUrl('/khc/index/indexInfo', { t: Date.now() })
  $.hotProductList = [];
  $.brandList = [];
  $.browseshopList = [];
  return new Promise( (resolve) => {
    $.get(options, async (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          if (data.code === 200) {
            $.hotProductList = data['data']['hotProductList'];
            $.brandList = data['data']['brandList'];
            $.browseshopList = data['data']['browseshopList'];
            if (flag) {
              // that.log(`助力情况：${data['data']['supportedNums']}/${data['data']['supportNeedNums']}`);
              // message += `邀请好友助力：${data['data']['supportedNums']}/${data['data']['supportNeedNums']}\n`
            }
          } else {
            that.log(`异常：${JSON.stringify(data)}`)
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    })
  });
}
//获取助力信息
function supportList() {
  const options = taskUrl('/khc/index/supportList', { t: Date.now() })
  return new Promise( (resolve) => {
    $.get(options, async (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          if (data.code === 200) {
            that.log(`助力情况：${data['data']['supportedNums']}/${data['data']['supportNeedNums']}`);
            message += `邀请好友助力：${data['data']['supportedNums']}/${data['data']['supportNeedNums']}\n`
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    })
  });
}
//积分抽奖
function lottery() {
  const options = taskUrl('/khc/record/lottery', { t: Date.now() })
  return new Promise( (resolve) => {
    $.get(options, async (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          if (data.code === 200) {
            if (data.data.prizeId !== 8) {
              //已中奖
              const url = 'https://carnivalcity.m.jd.com/#/integralDetail';
              that.log(`积分抽奖获得:${data.data.prizeName}`);
              message += `积分抽奖获得：${data.data.prizeName}\n`;
              $.msg($.name, '', `京东账号 ${$.index} ${$.nickName || $.UserName}\n积分抽奖获得：${data.data.prizeName}\n兑换地址：${url}`, { 'open-url': url });
              if ($.isNode()) await notify.sendNotify($.name, `京东账号 ${$.index} ${$.nickName || $.UserName}\n积分抽奖获得：${data.data.prizeName}\n兑换地址：${url}`);
            } else {
              that.log(`积分抽奖结果:${data['data']['prizeName']}}`);
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    })
  });
}
//查询抽奖记录(未兑换的)
function check() {
  const options = taskUrl('/khc/record/convertRecord', { t: Date.now(), pageNum: 1 })
  return new Promise( (resolve) => {
    $.get(options, async (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          let str = '';
          if (data.code === 200) {
            for (let obj of data.data) {
              if (obj.hasOwnProperty('fillStatus') && obj.fillStatus !== true) {
                str += JSON.stringify(obj);
              }
            }
          }
          if (str.length > 0) {
            const url = 'https://carnivalcity.m.jd.com/#/integralDetail';
            $.msg($.name, '', `京东账号 ${$.index} ${$.nickName || $.UserName}\n积分抽奖获得：${str}\n兑换地址：${url}`, { 'open-url': url });
            if ($.isNode()) await notify.sendNotify($.name, `京东账号 ${$.index} ${$.nickName || $.UserName}\n积分抽奖获得：${str}\n兑换地址：${url}`);
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    })
  });
  return new Promise((resolve)=>{
    var request = require('request');
    let timestamp = (new Date()).getTime()
    var headers = {
      'Sgm-Context': '144512924112128160;144512924112128160',
      'Host': 'carnivalcity.m.jd.com',
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1 Mobile/15E148 Safari/604.1',
      'sign': 'c5a92160e87206287af0faee2b056429',
      'Referer': 'https://carnivalcity.m.jd.com/',
      'timestamp': `${timestamp}`,
      'Cookie': cookie
    };

    var options = {
      url: `https://carnivalcity.m.jd.com/khc/record/convertRecord?pageNum=1&t=${timestamp}`,
      headers: headers
    };

    async function callback(error, response, body) {
      if (!error && response.statusCode == 200) {
        // $.log(body);
        let result = JSON.parse(body)
        let message = ""
        if (result.data.length > 0) {
          message += message += `\n开始【京东账号${$.index}】${$.nickName || $.UserName}\n`
        }
        for (let obj of result.data) {
          if (obj.hasOwnProperty('fillStatus') && obj.fillStatus != true) {
            message += JSON.stringify(obj)
          }
        }
        if (message.length > 0) {
          await notify.sendNotify($.name, message);
        }
        resolve()
      }
    }

    request(options, callback);

  })
}
function myRank() {
  return new Promise(resolve => {
    const body = {
      t: Date.now()
    }
    const options = taskUrl("/khc/rank/myPastRanks", body);
    $.get(options, async (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          if (data.code === 200) {
            if (data.data && data.data.length) {
              for (let i = 0; i < data.data.length; i++) {
                $.date = data.data[i]['date'];
                if (data.data[i].status === '1') {
                  that.log(`开始领取往期奖励【${data.data[i]['prizeName']}】`)
                  let res = await saveJbean($.date);
                  // that.log('领奖结果', res)
                  if (res && res.code === 200) {
                    $.beans += Number(res.data);
                    that.log(`${data.data[i]['date']}日 【${res.data}】京豆奖励领取成功`)
                  } else {
                    that.log(`往期奖励领取失败：${JSON.stringify(res)}`);
                  }
                  await $.wait(500);
                } else if (data.data[i].status === '3') {
                  that.log(`${data.data[i]['date']}日 【${data.data[i]['prizeName']}】往期京豆奖励已领取~`)
                } else {
                  that.log(`${data.data[i]['date']}日 【${data.data[i]['status']}】往期京豆奖励，今日争取进入前30000名哦~`)
                }
              }
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
//领取往期奖励API
function saveJbean(date) {
  return new Promise(resolve => {
    const body = "date=" + date;
    const options = taskPostUrl('/khc/rank/getRankJingBean', body)
    $.post(options, (err, resp, data) => {
      try {
        // that.log('领取京豆结果', data);
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}
async function doHelp() {
  that.log(`\n开始助力好友`);
  for (let item of $.newShareCodes) {
    if (!item) continue;
    const helpRes = await toHelp(item.trim());
    if (helpRes.data.status === 5) {
      that.log(`助力机会已耗尽，跳出助力`);
      break;
    }
  }
}
//助力API
function toHelp(code = "7a0b2520-6e61-42cf-9a24-04029accc99d") {
  return new Promise(resolve => {
    const body = "shareId=" + code;
    const options = taskPostUrl('/khc/task/doSupport', body)
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          that.log(`助力结果:${data}`);
          data = JSON.parse(data);
          if (data && data['code'] === 200) {
            if (data['data']['status'] === 6) that.log(`助力成功\n`)
            if (data['data']['jdNums']) $.beans += data['data']['jdNums'];
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
//获取邀请码API
function getHelp() {
  return new Promise(resolve => {
    const body = {
      t: Date.now()
    }
    const options = taskUrl("/khc/task/getSupport", body);
    $.get(options, async (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          if (data.code === 200) {
            that.log(`\n\n${$.name}互助码每天都变化,旧的不可继续使用`);
            $.log(`【京东账号${$.index}（${$.UserName}）的${$.name}好友互助码】${data.data.shareId}\n\n`);
            $.temp.push(data.data.shareId);
          } else {
            that.log(`获取邀请码失败：${JSON.stringify(data)}`);
            if (data.code === 1002) $.blockAccount = true;
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
//获取当前活动总京豆数量
function getListJbean() {
  return new Promise(resolve => {
    const body = {
      t: Date.now(),
      pageNum: ``
    }
    const options = taskUrl("/khc/record/jingBeanRecord", body);
    $.get(options, async (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          if (data.code === 200) {
            $.jingBeanNum = data.data.jingBeanNum || 0;
            message += `累计获得京豆：${$.jingBeanNum}🐶\n`;
          } else {
            that.log(`jingBeanRecord失败：${JSON.stringify(data)}`);
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
//查询累计获得积分
function getListIntegral() {
  return new Promise(resolve => {
    const body = {
      t: Date.now(),
      pageNum: ``
    }
    const options = taskUrl("/khc/record/integralRecord", body);
    $.get(options, async (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          if (data.code === 200) {
            $.integralCount = data.data.integralNum || 0;//累计活动积分
            message += `累计获得积分：${$.integralCount}\n`;
            that.log(`开始抽奖，当前积分可抽奖${parseInt($.integralCount / 50)}次\n`);
            for (let i = 0; i < parseInt($.integralCount / 50); i ++) {
              await lottery();
              await $.wait(500);
            }
          } else {
            that.log(`integralRecord失败：${JSON.stringify(data)}`);
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

//查询今日累计积分与排名
function getListRank() {
  return new Promise(resolve => {
    const body = {
      t: Date.now()
    }
    const options = taskUrl("/khc/rank/dayRank", body);
    $.get(options, async (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          if (data.code === 200) {
            if (data.data.myRank) {
              $.integer = data.data.myRank.integral;//当前获得积分
              $.num = data.data.myRank.rank;//当前排名
              message += `当前获得积分：${$.integer}\n`;
              message += `当前获得排名：${$.num}\n`;
            }
            if (data.data.lastRank) {
              $.lasNum = data.data.lastRank.rank;//当前参加活动人数
              message += `当前参赛人数：${$.lasNum}\n`;
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

function updateShareCodesCDN(url = 'https://cdn.jsdelivr.net/gh/gitupdate/updateTeam@master/shareCodes/jd_cityShareCodes.json') {
  return new Promise(resolve => {
    $.get({url , headers:{"User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")}, timeout: 200000}, async (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          $.updatePkActivityIdRes = JSON.parse(data);
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

function readShareCode() {
  that.log(`开始`)
  return new Promise(async resolve => {
    $.get({url: `http://share.turinglabs.net/api/v3/carnivalcity/query/20/`, 'timeout': 20000}, (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            data = JSON.parse(data);
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
    await $.wait(20000);
    resolve()
  })
}
//格式化助力码
function shareCodesFormat() {
  return new Promise(async resolve => {
    // that.log(`第${$.index}个京东账号的助力码:::${$.shareCodesArr[$.index - 1]}`)
    $.newShareCodes = [];
    if ($.shareCodesArr[$.index - 1]) {
      $.newShareCodes = $.shareCodesArr[$.index - 1].split('@');
    } else {
      that.log(`由于您第${$.index}个京东账号未提供shareCode,将采纳本脚本自带的助力码\n`)
      const tempIndex = $.index > inviteCodes.length ? (inviteCodes.length - 1) : ($.index - 1);
      $.newShareCodes = inviteCodes[tempIndex] && inviteCodes[tempIndex].split('@') || [];
      if ($.updatePkActivityIdRes && $.updatePkActivityIdRes.length) $.newShareCodes = [...$.updatePkActivityIdRes, ...$.newShareCodes];
    }
    const readShareCodeRes = await readShareCode();
    if (readShareCodeRes && readShareCodeRes.code === 200) {
      $.newShareCodes = [...new Set([...$.newShareCodes, ...(readShareCodeRes.data || [])])];
    }
    // that.log(`第${$.index}个京东账号将要助力的好友${JSON.stringify($.newShareCodes)}`)
    resolve();
  })
}
function requireConfig() {
  return new Promise(resolve => {
    that.log(`开始获取${$.name}配置文件\n`);
    let shareCodes = [];
    if ($.isNode()) {
      if (process.env.JD818_SHARECODES) {
        if (process.env.JD818_SHARECODES.indexOf('\n') > -1) {
          shareCodes = process.env.JD818_SHARECODES.split('\n');
        } else {
          shareCodes = process.env.JD818_SHARECODES.split('&');
        }
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

function taskUrl(t, a) {
  const r = Date.now().toString();
  // const r = "1617242355798";
  // 07035cabb557f09a51617242355798
  let o = "07035cabb557f09a5" + r;
  // let t = "/khc/index/brandTaskInfo";
  // let a = {
  //   brandId: "66666",
  //   t: Date.now()//此时间戳和url后面的&t=一致
  // };
  let str = ''
  const cc = Object.keys(a);
  cc.map((item, index) => {
    str += `${item}=${a[item]}${index + 1 !== cc.length ? '&' : ''}`;
  })
  return {
    url: `${JD_API_HOST}${t}?${str}`,
    headers: {
      "accept": "application/json, text/plain, */*",
      "accept-encoding": "gzip, deflate, br",
      "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
      "referer": "https://carnivalcity.m.jd.com/",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "Cookie": cookie,
      "User-Agent": "jdapp;android;9.4.4;10;3b78ecc3f490c7ba;network/UNKNOWN;model/M2006J10C;addressid/138543439;aid/3b78ecc3f490c7ba;oaid/7d5870c5a1696881;osVer/29;appBuild/85576;psn/3b78ecc3f490c7ba|541;psq/2;uid/3b78ecc3f490c7ba;adk/;ads/;pap/JA2015_311210|9.2.4|ANDROID 10;osv/10;pv/548.2;jdv/0|iosapp|t_335139774|appshare|CopyURL|1606277982178|1606277986;ref/com.jd.lib.personal.view.fragment.JDPersonalFragment;partner/xiaomi001;apprpd/MyJD_Main;Mozilla/5.0 (Linux; Android 10; M2006J10C Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045227 Mobile Safari/537.36",
      sign: za(a, o, t).toString(),
      timestamp: r,
    }
  }
}
function taskPostUrl(t, a) {
  const r = Date.now().toString();
  let o = "07035cabb557f09a5" + r;
  // let t = "/khc/task/doQuestion";
  // let a = "brandId=555555&questionId=2&result=1"
  return {
    url: `${JD_API_HOST}${t}`,
    body: a,
    headers: {
      "Accept": "application/json, text/plain, */*",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "zh-cn",
      "Connection": "keep-alive",
      "Content-Type": "application/x-www-form-urlencoded",
      "Host": "carnivalcity.m.jd.com",
      "Origin": "https://carnivalcity.m.jd.com",
      "Referer": "https://carnivalcity.m.jd.com/?lng=113.325695&lat=23.198318&sid=dfb50c19b37544d6ce10759e26c451dw&un_area=19_1601_50258_62858",
      "User-Agent": "jdapp;iPhone;9.4.4;14.3;88732f840b77821b345bf07fd71f609e6ff12f43;network/4g;ADID/B28DA848-0DA0-4AAA-AE7E-A6F55695C590;supportApplePay/0;hasUPPay/0;hasOCPay/0;model/iPhone11,8;addressid/2005183373;supportBestPay/0;appBuild/167588;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
      "Cookie": cookie,
      sign: za(a, o, t).toString(),
      timestamp: r,
    }
  }
}

function P(t) {
  return P = "function" === typeof Symbol && "symbol" === typeof Symbol.iterator ? function (t) {
        return typeof t
      }
      : function (t) {
        return t && "function" === typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
      }
      ,
      P(t)
}
function za(t, e, n) {
  var a = ""
      , i = n.split("?")[1] || "";
  if (t) {
    if ("string" == typeof t)
      a = t + i;
    else if ("object" == P(t)) {
      var r = [];
      for (var s in t)
        r.push(s + "=" + t[s]);
      a = r.length ? r.join("&") + i : i
    }
  } else
    a = i;
  if (a) {
    var o = a.split("&").sort().join("");
    return $.md5(o + e)
  }
  return $.md5(e)
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

async function showMsg() {
  if ($.beans) {
    allMessage += `京东账号${$.index} ${$.nickName || $.UserName}\n本次运行获得：${$.beans}京豆\n${message}活动地址：${JD_API_HOST}${$.index !== cookiesArr.length ? '\n\n' : ''}`
  }
  $.msg($.name, `京东账号${$.index} ${$.nickName || $.UserName}`, `${message}具体详情点击弹窗跳转后即可查看`, {"open-url": JD_API_HOST});
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
// prettier-ignore
!function(n){"use strict";function r(n,r){var t=(65535&n)+(65535&r);return(n>>16)+(r>>16)+(t>>16)<<16|65535&t}function t(n,r){return n<<r|n>>>32-r}function u(n,u,e,o,c,f){return r(t(r(r(u,n),r(o,f)),c),e)}function e(n,r,t,e,o,c,f){return u(r&t|~r&e,n,r,o,c,f)}function o(n,r,t,e,o,c,f){return u(r&e|t&~e,n,r,o,c,f)}function c(n,r,t,e,o,c,f){return u(r^t^e,n,r,o,c,f)}function f(n,r,t,e,o,c,f){return u(t^(r|~e),n,r,o,c,f)}function i(n,t){n[t>>5]|=128<<t%32,n[14+(t+64>>>9<<4)]=t;var u,i,a,h,g,l=1732584193,d=-271733879,v=-1732584194,C=271733878;for(u=0;u<n.length;u+=16)i=l,a=d,h=v,g=C,d=f(d=f(d=f(d=f(d=c(d=c(d=c(d=c(d=o(d=o(d=o(d=o(d=e(d=e(d=e(d=e(d,v=e(v,C=e(C,l=e(l,d,v,C,n[u],7,-680876936),d,v,n[u+1],12,-389564586),l,d,n[u+2],17,606105819),C,l,n[u+3],22,-1044525330),v=e(v,C=e(C,l=e(l,d,v,C,n[u+4],7,-176418897),d,v,n[u+5],12,1200080426),l,d,n[u+6],17,-1473231341),C,l,n[u+7],22,-45705983),v=e(v,C=e(C,l=e(l,d,v,C,n[u+8],7,1770035416),d,v,n[u+9],12,-1958414417),l,d,n[u+10],17,-42063),C,l,n[u+11],22,-1990404162),v=e(v,C=e(C,l=e(l,d,v,C,n[u+12],7,1804603682),d,v,n[u+13],12,-40341101),l,d,n[u+14],17,-1502002290),C,l,n[u+15],22,1236535329),v=o(v,C=o(C,l=o(l,d,v,C,n[u+1],5,-165796510),d,v,n[u+6],9,-1069501632),l,d,n[u+11],14,643717713),C,l,n[u],20,-373897302),v=o(v,C=o(C,l=o(l,d,v,C,n[u+5],5,-701558691),d,v,n[u+10],9,38016083),l,d,n[u+15],14,-660478335),C,l,n[u+4],20,-405537848),v=o(v,C=o(C,l=o(l,d,v,C,n[u+9],5,568446438),d,v,n[u+14],9,-1019803690),l,d,n[u+3],14,-187363961),C,l,n[u+8],20,1163531501),v=o(v,C=o(C,l=o(l,d,v,C,n[u+13],5,-1444681467),d,v,n[u+2],9,-51403784),l,d,n[u+7],14,1735328473),C,l,n[u+12],20,-1926607734),v=c(v,C=c(C,l=c(l,d,v,C,n[u+5],4,-378558),d,v,n[u+8],11,-2022574463),l,d,n[u+11],16,1839030562),C,l,n[u+14],23,-35309556),v=c(v,C=c(C,l=c(l,d,v,C,n[u+1],4,-1530992060),d,v,n[u+4],11,1272893353),l,d,n[u+7],16,-155497632),C,l,n[u+10],23,-1094730640),v=c(v,C=c(C,l=c(l,d,v,C,n[u+13],4,681279174),d,v,n[u],11,-358537222),l,d,n[u+3],16,-722521979),C,l,n[u+6],23,76029189),v=c(v,C=c(C,l=c(l,d,v,C,n[u+9],4,-640364487),d,v,n[u+12],11,-421815835),l,d,n[u+15],16,530742520),C,l,n[u+2],23,-995338651),v=f(v,C=f(C,l=f(l,d,v,C,n[u],6,-198630844),d,v,n[u+7],10,1126891415),l,d,n[u+14],15,-1416354905),C,l,n[u+5],21,-57434055),v=f(v,C=f(C,l=f(l,d,v,C,n[u+12],6,1700485571),d,v,n[u+3],10,-1894986606),l,d,n[u+10],15,-1051523),C,l,n[u+1],21,-2054922799),v=f(v,C=f(C,l=f(l,d,v,C,n[u+8],6,1873313359),d,v,n[u+15],10,-30611744),l,d,n[u+6],15,-1560198380),C,l,n[u+13],21,1309151649),v=f(v,C=f(C,l=f(l,d,v,C,n[u+4],6,-145523070),d,v,n[u+11],10,-1120210379),l,d,n[u+2],15,718787259),C,l,n[u+9],21,-343485551),l=r(l,i),d=r(d,a),v=r(v,h),C=r(C,g);return[l,d,v,C]}function a(n){var r,t="",u=32*n.length;for(r=0;r<u;r+=8)t+=String.fromCharCode(n[r>>5]>>>r%32&255);return t}function h(n){var r,t=[];for(t[(n.length>>2)-1]=void 0,r=0;r<t.length;r+=1)t[r]=0;var u=8*n.length;for(r=0;r<u;r+=8)t[r>>5]|=(255&n.charCodeAt(r/8))<<r%32;return t}function g(n){return a(i(h(n),8*n.length))}function l(n,r){var t,u,e=h(n),o=[],c=[];for(o[15]=c[15]=void 0,e.length>16&&(e=i(e,8*n.length)),t=0;t<16;t+=1)o[t]=909522486^e[t],c[t]=1549556828^e[t];return u=i(o.concat(h(r)),512+8*r.length),a(i(c.concat(u),640))}function d(n){var r,t,u="";for(t=0;t<n.length;t+=1)r=n.charCodeAt(t),u+="0123456789abcdef".charAt(r>>>4&15)+"0123456789abcdef".charAt(15&r);return u}function v(n){return unescape(encodeURIComponent(n))}function C(n){return g(v(n))}function A(n){return d(C(n))}function m(n,r){return l(v(n),v(r))}function s(n,r){return d(m(n,r))}function b(n,r,t){return r?t?m(r,n):s(r,n):t?C(n):A(n)}$.md5=b}();
