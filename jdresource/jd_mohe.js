const notify = $.isNode() ? require('./sendNotify') : '';
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
let jdNotify = true;//是否关闭通知，false打开通知推送，true关闭通知推送
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [], cookie = '', message, allMessage = '';
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') that.log = () => {};
} else {
  cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}

const JD_API_HOST = 'https://isp5g.m.jd.com';
//邀请码一天一变化，已确定
$.shareId = [];
!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
    return;
  }
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]);
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = '';
      message = '';
      await TotalBean();
      that.log(`\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});

        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }
        continue
      }
      await shareUrl();
      await getCoin();//领取每三小时自动生产的热力值
      await Promise.all([
        task0(),
        task1(),
      ])
      await taskList();
      await getAward();//抽奖
    }
  }
  if (allMessage) {
    if ($.isNode()) await notify.sendNotify($.name, allMessage);
    $.msg($.name, '', allMessage, {"open-url": "https://isp5g.m.jd.com"})
  }
  for (let v = 0; v < cookiesArr.length; v++) {
    cookie = cookiesArr[v];
    $.index = v + 1;
    $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]);
    that.log(`\n\n自己账号内部互助`);
    for (let item of $.shareId) {
      that.log(`账号 ${$.index} ${$.UserName} 开始给 ${item}进行助力`)
      const res = await addShare(item);
      if (res && res['code'] === 2005) {
        that.log(`次数已用完，跳出助力`)
        break
      }
    }
    that.log(`\n\n如果有剩余助力机会则随机互助`);
    for (let item of $.body || []) {
      that.log(`账号 ${$.index} ${$.UserName} 开始给 ${item}进行助力`)
      const res = await addShare(item);
      if (res && res['code'] === 2005) {
        that.log(`次数已用完，跳出助力`)
        break
      }
    }
  }
})()
    .catch((e) => {
      $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
    })
    .finally(() => {
      $.done();
    })


async function task0() {
  const confRes = await conf();
  if (confRes.code === 200) {
    const { brandList, skuList } = confRes.data;
    if (skuList && skuList.length > 0) {
      for (let item of skuList) {
        if (item.state === 0) {
          let homeGoBrowseRes = await homeGoBrowse(0, item.id);
          that.log('商品', homeGoBrowseRes);
          await $.wait(1000);
          const taskHomeCoin0Res = await taskHomeCoin(0, item.id);
          that.log('商品领取金币', taskHomeCoin0Res);
          // if (homeGoBrowseRes.code === 200) {
          //   await $.wait(1000);
          //   await taskHomeCoin(0, item.id);
          // }
        } else {
          that.log('精选好物任务已完成')
        }
      }
    }
  }
}
async function task1() {
  const confRes = await conf();
  if (confRes.code === 200) {
    const { brandList, skuList } = confRes.data;
    if (brandList && brandList.length > 0) {
      for (let item of brandList) {
        if (item.state === 0) {
          let homeGoBrowseRes = await homeGoBrowse(1, item.id);
          // that.log('店铺', homeGoBrowseRes);
          await $.wait(1000);
          const taskHomeCoin1Res = await taskHomeCoin(1, item.id);
          that.log('店铺领取金币', taskHomeCoin1Res);
          // if (homeGoBrowseRes.code === 200) {
          //   await $.wait(1000);
          //   await taskHomeCoin(1, item.id);
          // }
        } else {
          that.log('精选店铺-任务已完成')
        }
      }
    }
  }
}
function addShare(shareId) {
  return new Promise((resolve) => {
    const url = `addShare?shareId=${shareId}&t=${Date.now()}`;
    $.get(taskurl(url), (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          that.log(`助力结果${data}`)
          data = JSON.parse(data);
          if (data['code'] === 200) {
            // that.log(`\n【京东账号${$.index}（${$.nickName || $.UserName}）助力好友 【${data['data']}】 成功\n`);
            that.log(`\n助力好友 【${data['data']}】 成功\n`);
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
function conf() {
  return new Promise((resolve) => {
    const url = `conf`;
    $.get(taskurl(url), (err, resp, data) => {
      try {
        // that.log('ddd----ddd', data)
        data = JSON.parse(data);
        // that.log('ddd----ddd', data)
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}
function homeGoBrowse(type, id) {
  return new Promise((resolve) => {
    const url = `homeGoBrowse?type=${type}&id=${id}`;
    $.get(taskurl(url), (err, resp, data) => {
      try {
        // that.log('homeGoBrowse', data)
        data = JSON.parse(data);
        // that.log('homeGoBrowse', data)
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}
function taskHomeCoin(type, id) {
  return new Promise((resolve) => {
    const url = `taskHomeCoin?type=${type}&id=${id}`;
    $.get(taskurl(url), (err, resp, data) => {
      try {
        // that.log('homeGoBrowse', data)
        data = JSON.parse(data);
        // that.log('homeGoBrowse', data)
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}
function getCoin() {
  return new Promise((resolve) => {
    const url = `getCoin?t=${Date.now()}`;
    $.get(taskurl(url), (err, resp, data) => {
      try {
        // that.log('homeGoBrowse', data)
        data = JSON.parse(data);
        // that.log('homeGoBrowse', data)
        if (data.code === 1001) {
          that.log(data.msg);
          $.msg($.name, '领取失败', `${data.msg}`);
          $.done();
        } else {
          that.log(`成功领取${data.data}热力值`)
          resolve(data);
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    })
  })
}
function taskList() {
  return new Promise((resolve) => {
    const url = `taskList?t=${Date.now()}`;
    $.get(taskurl(url), async (err, resp, data) => {
      try {
        // that.log('homeGoBrowse', data)
        data = JSON.parse(data);
        // that.log(`成功领取${data.data}热力值`)
        if (data.code === 200) {
          const { task4, task6, task5, task2, task1 } = data.data;
          if (task4.finishNum < task4.totalNum) {
            await browseProduct(task4.skuId);
            await taskCoin(task4.type);
          }
          //浏览会场
          if (task1.finishNum < task1.totalNum) {
            await strollActive((task1.finishNum + 1));
            await taskCoin(task1.type);
          }
          if (task2.finishNum < task2.totalNum) {
            await strollShop(task2.shopId);
            await taskCoin(task2.type);
          }
          // if (task5.finishNum < task5.totalNum) {
          //   that.log(`\n\n分享好友助力 ${task5.finishNum}/${task5.totalNum}\n\n`)
          // } else {
          //   that.log(`\n\n分享好友助力 ${task5.finishNum}/${task5.totalNum}\n\n`)
          // }
          if (task4.state === 2 && task1.state === 2 && task2.state === 2) {
            that.log('\n\n----taskList的任务全部做完了---\n\n')
            that.log(`分享好友助力 ${task5.finishNum}/${task5.totalNum}\n\n`)
          } else {
            that.log(`请继续等待,正在做任务,不要退出哦`)
            await taskList();
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
//浏览商品(16个)
function browseProduct(skuId) {
  return new Promise((resolve) => {
    const url = `browseProduct?0=${skuId}&t=${Date.now()}`;
    $.get(taskurl(url), (err, resp, data) => {
      try {
        // that.log('homeGoBrowse', data)
        data = JSON.parse(data);
        // that.log('homeGoBrowse', data)
        // that.log(`成功领取${data.data}热力值`)
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}
// 浏览会场(10个)
function strollActive(index) {
  return new Promise((resolve) => {
    const url = `strollActive?0=${index}&t=${Date.now()}`;
    $.get(taskurl(url), (err, resp, data) => {
      try {
        // that.log('homeGoBrowse', data)
        data = JSON.parse(data);
        // that.log('homeGoBrowse', data)
        // that.log(`成功领取${data.data}热力值`)
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}
//关注或浏览店铺(9个)
function strollShop(shopId) {
  return new Promise((resolve) => {
    const url = `strollShop?shopId=${shopId}&t=${Date.now()}`;
    $.get(taskurl(url), (err, resp, data) => {
      try {
        // that.log('homeGoBrowse', data)
        data = JSON.parse(data);
        // that.log('homeGoBrowse', data)
        // that.log(`成功领取${data.data}热力值`)
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}
// 加入会员(7)
function strollMember(venderId) {
  return new Promise((resolve) => {
    const url = `strollMember?venderId=${venderId}&t=${Date.now()}`;
    $.get(taskurl(url), (err, resp, data) => {
      try {
        // that.log('homeGoBrowse', data)
        data = JSON.parse(data);
        // that.log('homeGoBrowse', data)
        // that.log(`成功领取${data.data}热力值`)
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}

function taskCoin(type) {
  return new Promise((resolve) => {
    const url = `taskCoin?type=${type}&t=${Date.now()}`;
    $.get(taskurl(url), (err, resp, data) => {
      try {
        // that.log('homeGoBrowse', data)
        data = JSON.parse(data);
        // that.log('homeGoBrowse', data)
        // that.log(`成功领取${data.data}热力值`)
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}
async function getAward() {
  const coinRes = await coin();
  if (coinRes.code === 200) {
    const { total, need } = coinRes.data;
    if (total > need) {
      const times = Math.floor(total / need);
      for (let i = 0; i < times; i++) {
        await $.wait(2000);
        let lotteryRes = await lottery();
        if (lotteryRes.code === 200) {
          that.log(`====抽奖结果====,${JSON.stringify(lotteryRes.data)}`);
          that.log(lotteryRes.data.name);
          that.log(lotteryRes.data.beanNum);
          if ((lotteryRes.data['prizeId'] && lotteryRes.data['prizeId'] !== '9999') || lotteryRes.data.name === '未中奖') {
            message += `抽奖获得：${lotteryRes.data.name}\n`;
          }
        } else if (lotteryRes.code === 4001) {
          that.log(`抽奖失败,${lotteryRes.msg}`);
          break;
        }
      }
      if (message) allMessage += `京东账号${$.index} ${$.nickName}\n${message}抽奖详情查看 https://isp5g.m.jd.com/#/myPrize${$.index !== cookiesArr.length ? '\n\n' : ''}`
    } else {
      that.log(`目前热力值${total},不够抽奖`)
    }
  }
}
//获取有多少热力值
function coin() {
  return new Promise((resolve) => {
    const url = `coin?t=${Date.now()}`;
    $.get(taskurl(url), (err, resp, data) => {
      try {
        // that.log('homeGoBrowse', data)
        data = JSON.parse(data);
        // that.log('homeGoBrowse', data)
        // that.log(`成功领取${data.data}热力值`)
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}
//抽奖API
function lottery() {
  return new Promise((resolve) => {
    const options = {
      'url': `${JD_API_HOST}/prize/lottery?t=${Date.now()}`,
      'headers': {
        "accept": "*/*",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
        "content-type": "application/x-www-form-urlencoded",
        "cookie": cookie,
        "referer": "https://isp5g.m.jd.com",
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
      }
    }
    $.get(options, (err, resp, data) => {
      try {
        // that.log('homeGoBrowse', data)
        data = JSON.parse(data);
        // that.log('homeGoBrowse', data)
        // that.log(`成功领取${data.data}热力值`)
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}
function shareUrl() {
  return new Promise((resolve) => {
    const options = {
      'url': `${JD_API_HOST}/active/shareUrl?t=${Date.now()}`,
      'headers': {
        "accept": "*/*",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
        "content-type": "application/x-www-form-urlencoded",
        "cookie": cookie,
        "referer": "https://isp5g.m.jd.com",
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
      }
    }
    $.get(options, async (err, resp, data) => {
      try {
        // that.log('好友邀请码', data)
        data = JSON.parse(data);
        if (data['code'] === 5000) {
          that.log(`重新运行一次脚本即可获取好友邀请码`)
        }
        // that.log('homeGoBrowse', data)
        if (data['code'] === 200) {
          $.shareId.push(data['data']);
          that.log(`\n【京东账号${$.index}（${$.nickName || $.UserName}）的${$.name}好友互助码】${data['data']}\n`);
          that.log(`此邀请码一天一变化，旧的不可用`)
          $.http.get({url: `https://code.c-hiang.cn/autocommit/mohe/insert/${data['data']}`, timeout: 30000}).then((resp) => {
            // that.log('resp', resp)
            if (resp.statusCode === 200) {
              try {
                let { body } = resp;
                body = JSON.parse(body);
                if (body['code'] === 200) {
                  that.log(`\n【京东账号${$.index}（${$.nickName || $.UserName}）的${$.name}好友互助码】${data['data']}提交成功\n`)
                } else if (body['code'] === 400) {
                  // that.log(`邀请码 【${data['data']}】 已存在\n`)
                } else {
                  that.log(`邀请码提交结果:${JSON.stringify(body)}\n`)
                }
              } catch (e) {
                that.log(`邀请码提交异常:${e}`)
              }
            }
          }).catch((e) => that.log(`catch 邀请码提交异常:${e}`));
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    })
  })
}
function taskurl(url) {
  return {
    'url': `${JD_API_HOST}/active/${url}`,
    'headers': {
      "accept": "*/*",
      "accept-encoding": "gzip, deflate, br",
      "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
      "content-type": "application/x-www-form-urlencoded",
      "cookie": cookie,
      "referer": "https://isp5g.m.jd.com",
      "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
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