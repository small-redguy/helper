const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
const notify = $.isNode() ? require('./sendNotify') : '';

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
const jdNotify = true;//是否关闭通知，false打开通知推送，true关闭通知推送
let goodPageSize = 0;// 运行一次取消多少个已关注的商品。数字0表示不取关任何商品
let shopPageSize =  0;// 运行一次取消多少个已关注的店铺。数字0表示不取关任何店铺
let stopGoods = '';//遇到此商品不再进行取关，此处内容需去商品详情页（自营处）长按拷贝商品信息
let stopShop = '';//遇到此店铺不再进行取关，此处内容请尽量从头开始输入店铺名称
const JD_API_HOST = 'https://wq.jd.com/fav';
!(async () => {
  if (!cookiesArr[0]) {
    $.msg('【京东账号一】取关京东店铺商品失败', '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
  }
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=(.+?);/) && cookie.match(/pt_pin=(.+?);/)[1])
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
      await requireConfig();
      await jdUnsubscribe();
      await showMsg();
    }
  }
})()
    .catch((e) => {
      $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
    })
    .finally(() => {
      $.done();
    })
async function jdUnsubscribe(doubleKey) {
  await Promise.all([
    unsubscribeGoods(doubleKey),
    unsubscribeShops()
  ])
  await Promise.all([
    getFollowShops(),
    getFollowGoods()
  ])
}
function showMsg() {
  if (!jdNotify || jdNotify === 'false') {
    $.msg($.name, ``, `【京东账号${$.index}】${$.nickName}\n【已取消关注店铺】${$.unsubscribeShopsCount}个\n【已取消关注商品】${$.unsubscribeGoodsCount}个\n【还剩关注店铺】${$.shopsTotalNum}个\n【还剩关注商品】${$.goodsTotalNum}个\n`);
  } else {
    $.log(`\n【京东账号${$.index}】${$.nickName}\n【已取消关注店铺】${$.unsubscribeShopsCount}个\n【已取消关注商品】${$.unsubscribeGoodsCount}个\n【还剩关注店铺】${$.shopsTotalNum}个\n【还剩关注商品】${$.goodsTotalNum}个\n`);
  }
}
function unsubscribeGoods() {
  return new Promise(async (resolve) => {
    let followGoods = await getFollowGoods();
    if (followGoods.iRet === '0') {
      let count = 0;
      $.unsubscribeGoodsCount = count;
      if ((goodPageSize * 1) !== 0) {
        if (followGoods.totalNum > 0) {
          for (let item of followGoods.data) {

            that.log(`是否匹配：：${item.commTitle.indexOf(stopGoods.replace(/\ufffc|\s*/g, ''))}`)

            if (stopGoods && item.commTitle.indexOf(stopGoods.replace(/\ufffc|\s*/g, '')) > -1) {
              that.log(`匹配到了您设定的商品--${stopGoods}，不在进行取消关注商品`)
              break;
            }
            let res = await unsubscribeGoodsFun(item.commId);
            // that.log('取消关注商品结果', res);
            if (res.iRet === 0 && res.errMsg === 'success') {
              that.log(`取消关注商品---${item.commTitle.substring(0, 20).concat('...')}---成功\n`)
              count ++;
            } else {
              that.log(`取消关注商品---${item.commTitle.substring(0, 20).concat('...')}---失败\n`)
            }
          }
          $.unsubscribeGoodsCount = count;
          resolve(count)
        } else {
          resolve(count)
        }
      } else {
        that.log(`\n您设置的是不取关商品\n`);
        resolve(count);
      }
    }
  })
}
function getFollowGoods() {
  return new Promise((resolve) => {
       const option = {
      url: `${JD_API_HOST}/comm/FavCommQueryFilter?cp=1&pageSize=${goodPageSize}&_=${Date.now()}&category=0&promote=0&cutPrice=0&coupon=0&stock=0&areaNo=1_72_4139_0&sceneval=2&g_login_type=1&callback=jsonpCBKB&g_ty=ls`,
      headers: {
        "Host": "wq.jd.com",
        "Accept": "*/*",
        "Connection": "keep-alive",
        "Cookie": cookie,
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
        "Accept-Language": "zh-cn",
        "Referer": "https://wqs.jd.com/my/fav/goods_fav.shtml?ptag=37146.4.1&sceneval=2&jxsid=15963530166144677970",
        "Accept-Encoding": "gzip, deflate, br"
      },
    }
    $.get(option, (err, resp, data) => {
      try {
        data = JSON.parse(data.slice(14, -13));
        $.goodsTotalNum = data.totalNum;
        // that.log('data', data.data.length)
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    });
  })
}
function unsubscribeGoodsFun(commId) {
  return new Promise(resolve => {
    const option = {
      url: `${JD_API_HOST}/comm/FavCommDel?commId=${commId}&_=${Date.now()}&sceneval=2&g_login_type=1&callback=jsonpCBKP&g_ty=ls`,
      headers: {
        "Host": "wq.jd.com",
        "Accept": "*/*",
        "Connection": "keep-alive",
        'User-Agent': $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
        'Referer': 'https://wqs.jd.com/my/fav/goods_fav.shtml?ptag=37146.4.1&sceneval=2&jxsid=15963530166144677970',
        'Cookie': cookie,
        "Accept-Language": "zh-cn",
        "Accept-Encoding": "gzip, deflate, br"
      },
    }
    $.get(option, (err, resp, data) => {
      try {
        data = JSON.parse(data.slice(14, -13).replace(',}', '}'));
        // that.log('data', data);
        // that.log('data', data.errMsg);
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    });
  })
}

function unsubscribeShops() {
  return new Promise(async (resolve) => {
    let followShops = await getFollowShops();
    if (followShops.iRet === '0') {
      let count = 0;
      $.unsubscribeShopsCount = count;
      if ((shopPageSize * 1) !== 0) {
        if (followShops.totalNum > 0) {
          for (let item of followShops.data) {
            if (stopShop && (item.shopName && item.shopName.indexOf(stopShop.replace(/\s*/g, '')) > -1)) {
              that.log(`匹配到了您设定的店铺--${item.shopName}，不在进行取消关注店铺`)
              break;
            }
            let res = await unsubscribeShopsFun(item.shopId);
            // that.log('取消关注店铺结果', res);
            if (res.iRet === '0') {
              that.log(`取消已关注店铺---${item.shopName}----成功\n`)
              count ++;
            } else {
              that.log(`取消已关注店铺---${item.shopName}----失败\n`)
            }
          }
          $.unsubscribeShopsCount = count;
          resolve(count)
        } else {
          resolve(count)
        }
      } else {
        that.log(`\n您设置的是不取关店铺\n`);
        resolve(count)
      }
    }
  })
}
function getFollowShops() {
  return new Promise((resolve) => {
    const option = {
      url: `${JD_API_HOST}/shop/QueryShopFavList?cp=1&pageSize=${shopPageSize}&_=${Date.now()}&sceneval=2&g_login_type=1&callback=jsonpCBKA&g_ty=ls`,
      headers: {
        "Host": "wq.jd.com",
        "Accept": "*/*",
        "Connection": "keep-alive",
        "Cookie": cookie,
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
        "Accept-Language": "zh-cn",
        "Referer": "https://wqs.jd.com/my/fav/shop_fav.shtml?sceneval=2&jxsid=15963530166144677970&ptag=7155.1.9",
        "Accept-Encoding": "gzip, deflate, br"
      },
    }
    $.get(option, (err, resp, data) => {
      try {
        data = JSON.parse(data.slice(14, -13));
        $.shopsTotalNum = data.totalNum;
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    });
  })
}
function unsubscribeShopsFun(shopId) {
  return new Promise(resolve => {
    const option = {
      url: `${JD_API_HOST}/shop/DelShopFav?shopId=${shopId}&_=${Date.now()}&sceneval=2&g_login_type=1&callback=jsonpCBKG&g_ty=ls`,
      headers: {
        "Host": "wq.jd.com",
        "Accept": "*/*",
        "Connection": "keep-alive",
        'User-Agent': $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
        'Referer': 'https://wqs.jd.com/my/fav/shop_fav.shtml?sceneval=2&jxsid=15960121319555534107&ptag=7155.1.9',
        'Cookie': cookie,
        "Accept-Language": "zh-cn",
        "Accept-Encoding": "gzip, deflate, br"
      },
    }
    $.get(option, (err, resp, data) => {
      try {
        data = JSON.parse(data.slice(14, -13));
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    });
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
function requireConfig() {
  return new Promise(resolve => {
    if ($.isNode() && process.env.UN_SUBSCRIBES) {
      if (process.env.UN_SUBSCRIBES.indexOf('&') > -1) {
        $.UN_SUBSCRIBES = process.env.UN_SUBSCRIBES.split('&');
      } else if (process.env.UN_SUBSCRIBES.indexOf('\n') > -1) {
        $.UN_SUBSCRIBES = process.env.UN_SUBSCRIBES.split('\n');
      } else if (process.env.UN_SUBSCRIBES.indexOf('\\n') > -1) {
        $.UN_SUBSCRIBES = process.env.UN_SUBSCRIBES.split('\\n');
      } else {
        $.UN_SUBSCRIBES = process.env.UN_SUBSCRIBES.split();
      }
      that.log(`您secret设置的取关参数:\n${JSON.stringify($.UN_SUBSCRIBES)}`)
      goodPageSize = $.UN_SUBSCRIBES[0] || goodPageSize;
      shopPageSize = $.UN_SUBSCRIBES[1] || shopPageSize;
      stopGoods = $.UN_SUBSCRIBES[2] || stopGoods;
      stopShop = $.UN_SUBSCRIBES[3] || stopShop;
    }
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