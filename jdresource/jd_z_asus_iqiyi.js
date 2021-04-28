  $.name="华硕-爱奇艺"
  let CryptoJS=$.CryptoJS;
  const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
  const notify = $.isNode() ? require('./sendNotify') : '';
  let cookiesArr = [], cookie = '', originCookie = '', message = '';
  let helpAuthor = false;//为作者助力的开关
  const API_HOST = 'https://asusiqiyi.m.jd.com/hsiqy/task/';
  const Ot = "12z65c88d1212p16";
  let doList;
  if ($.isNode()) {
    Object.keys(jdCookieNode).forEach((item) => {
      cookiesArr.push(jdCookieNode[item])
    })
    if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') that.log = () => { };
  } else {
    let cookiesData = $.getdata('CookiesJD') || "[]";
    cookiesData = JSON.parse(cookiesData);
    cookiesArr = cookiesData.map(item => item.cookie);
    cookiesArr.reverse();
    cookiesArr.push(...[$.getdata('CookieJD2'), $.getdata('CookieJD')]);
    cookiesArr.reverse();
    cookiesArr = cookiesArr.filter(item => !!item);
  }
  !(async () => {
    $.CryptoJS = $.isNode() ? require('crypto-js') : CryptoJS;
    if (!cookiesArr[0]) {
      $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', { "open-url": "https://bean.m.jd.com/bean/signIndex.action" });
      return;
    }
    for (let i = 0; i < cookiesArr.length; i++) {
      if (cookiesArr[i]) {
        cookie = cookiesArr[i]
        originCookie = cookiesArr[i]
        $.UserName = decodeURIComponent(cookie.match(/pt_pin=(.+?);/) && cookie.match(/pt_pin=(.+?);/)[1])
        $.index = i + 1;
        $.isLogin = true;
        $.nickName = '';
        await checkCookie();
        that.log(`\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
        if (!$.isLogin) {
          $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, { "open-url": "https://bean.m.jd.com/bean/signIndex.action" });
          if ($.isNode()) {
            await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
          }
          continue
        }
        $.bean = 0;
        await ASUS_iqiyi();
        if ($.bean > 10) {
          if ($.isNode()) {
            await notify.sendNotify(`${$.name} - ${$.UserName}`, `恭喜抢到${$.bean}个京豆`);
          } else {
            $.msg(`${$.name}`, `${$.UserName}`, `恭喜抢到${$.bean}个京豆`);
          }
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
  async function ASUS_iqiyi() {
    await getShopList();
    await getCartList();
    await getBrowseList();
    await $.wait(3000);
    await doJob();
  }
  async function doJob() {
    if ($.shopList) {
      doList = $.shopList.filter((x) => x.status === 0);
      for (let i = 0; i < doList.length; i++) {
        that.log(`去关注 - ${doList[i].shopName}`)
        await doTask('followShop', `shopId=${doList[i].shopId}`);
        await $.wait(2000);
      }
    }
    if ($.cartList) {
      doList = $.cartList.skuInfos.filter((x) => x.status === 0);
      for (let i = 0; i < doList.length; i++) {
        that.log(`加购 - ${doList[i].skuName}`);
        await doTask('addCart', `skuId=${doList[i].skuId}&enStr=${encrypt($.UserName + '' + doList[i].skuId)}`);
        await $.wait(2000);
      }
    }
    if ($.browseList) {
      doList = $.browseList.skuInfos.filter((x) => x.status === 0);
      for (let i = 0; i < doList.length; i++) {
        that.log(`浏览 - ${doList[i].skuName}`);
        await doTask('toBrowse', `skuId=${doList[i].skuId}`);
        await $.wait(3500);
        await doTask('getBrowsePrize', `skuId=${doList[i].skuId}`);
        await $.wait(2000);
      }
    }
  }
  function getShopList() {
    return new Promise(resolve => {
      $.get(taskUrl('shopInfo'), (err, resp, data) => {
        try {
          if (err) {
            that.log(JSON.stringify(err));
          } else {
            data = JSON.parse(data);
            $.shopList = data.data;
            if ($.shopList) {
              that.log('获取店铺列表信息成功');
            }
          }
        } catch (e) {
          that.log(`异常：${JSON.stringify(e)}`)
        } finally {
          resolve();
        }
      })
    })
  }
  function getBrowseList() {
    return new Promise(resolve => {
      $.get(taskUrl('browseList'), (err, resp, data) => {
        try {
          if (err) {
            that.log(JSON.stringify(err));
          } else {
            data = JSON.parse(data);
            $.browseList = data.data;
            if ($.browseList) {
              that.log('获取浏览商品列表信息成功');
            }
          }
        } catch (e) {
          that.log(`异常：${JSON.stringify(e)}`)
        } finally {
          resolve();
        }
      })
    })
  }
  function getCartList() {
    return new Promise(resolve => {
      $.get(taskUrl('cartList'), (err, resp, data) => {
        try {
          if (err) {
            that.log(JSON.stringify(err));
          } else {
            data = JSON.parse(data);
            $.cartList = data.data;
            if ($.shopList) {
              that.log('获取加购商品列表信息成功');
            }
          }
        } catch (e) {
          that.log(`异常：${JSON.stringify(e)}`)
        } finally {
          resolve();
        }
      })
    })
  }
  function doTask(function_name, body = '') {
    return new Promise(resolve => {
      $.post(taskPostUrl(function_name, body), (err, resp, data) => {
        try {
          if (err) {
            that.log(`${JSON.stringify(err)}`)
          } else {
            data = JSON.parse(data);
            if (data.code === 200) {
              if (data.data.hasOwnProperty('jdNum') && data.data.jdNum !== 0) {
                that.log(`恭喜，获得${data.data.jdNum}个京豆`);
                $.bean += data.data.jdNum;
              } else {
                that.log(`完成任务`);
              }
            }
          }
        } catch (e) {
          that.log(e, resp)
        } finally {
          resolve();
        }
      })
    })
  }
  
  function taskPostUrl(function_id, body) {
    return {
      url: `${API_HOST}${function_id}`,
      headers: {
        'Host': 'asusiqiyi.m.jd.com',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Origin': 'https://asusiqiyi.m.jd.com',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cookie': cookie,
        'Connection': 'keep-alive',
        'Accept': 'application/json, text/plain, */*',
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1',
        'Referer': 'https://asusiqiyi.m.jd.com/',
        'Accept-Language': 'zh-cn',
      },
      body: body,
    }
  }
  function taskUrl(function_id) {
    return {
      url: `${API_HOST}${function_id}?t=${Date.now()}`,
      headers: {
        'Host': 'asusiqiyi.m.jd.com',
        'Accept': 'application/json, text/plain, */*',
        'Connection': 'keep-alive',
        'Cookie': cookie,
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15',
        'Accept-Language': 'zh-cn',
        'Referer': 'https://asusiqiyi.m.jd.com/',
        'Accept-Encoding': 'gzip, deflate, br',
      }
    }
  }
  
  function checkCookie() {
    const options = {
        url: "https://me-api.jd.com/user_new/info/GetJDUserInfoUnion",
        headers: {
            "Host": "me-api.jd.com",
            "Accept": "*/*",
            "Connection": "keep-alive",
            "Cookie": cookie,
            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.2 Mobile/15E148 Safari/604.1",
            "Accept-Language": "zh-cn",
            "Referer": "https://home.m.jd.com/myJd/newhome.action?sceneval=2&ufc=&",
            "Accept-Encoding": "gzip, deflate, br",
        }
    };
    return new Promise(resolve => {
        $.get(options, (err, resp, data) => {
            try {
                if (err) {
                    $.logErr(err)
                } else {
                    if (data) {
                        data = JSON.parse(data);
                        if (data.retcode === "1001") {
                            $.isLogin = false; //cookie过期
                            return;
                        }
                        if (data.retcode === "0" && data.data.hasOwnProperty("userInfo")) {
                            $.nickName = data.data.userInfo.baseInfo.nickname;
                        }
                    } else {
                        $.log('京东返回了空数据');
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
  function encrypt(t) {
    var e = t,
      n = {
        mode: $.CryptoJS.mode.ECB,
        padding: $.CryptoJS.pad.Pkcs7
      },
      a = $.CryptoJS.enc.Utf8.parse(Ot),
      r = $.CryptoJS.AES.encrypt(e, a, n),
      s = r.toString().replace(/\//g, "_");
    return s = s.replace(/\+/g, "-"), s
  }