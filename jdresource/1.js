// author：疯疯
/*
球队赢好礼
默认：不加购物车，不注册店铺会员卡。
活动地址：https://mpdz-isv.isvjcloud.com/ql/front/tcl002/loadTclAct?id=tclTeamAct002&user_id=10299171
已支持IOS双京东账号,Node.js支持N个京东账号
脚本兼容: QuantumultX, Surge, Loon, JSBox, Node.js
============QuantumultX==============
[task_local]
#球队赢好礼
10 1 * * * https://jdsharedresourcescdn.azureedge.net/jdresource/jd_tcl.js, tag=球队赢好礼, img-url=https://raw.githubusercontent.com/58xinian/icon/master/jdyjd.png, enabled=true
=================Loon===============
[Script]
cron "10 1 * * *" script-path=https://jdsharedresourcescdn.azureedge.net/jdresource/jd_tcl.js,tag=球队赢好礼
=================Surge==============
[Script]
球队赢好礼 = type=cron,cronexp="10 1 * * *",wake-system=1,timeout=3600,script-path=https://jdsharedresourcescdn.azureedge.net/jdresource/jd_tcl.js

============小火箭=========
球队赢好礼 = type=cron,script-path=https://jdsharedresourcescdn.azureedge.net/jdresource/jd_tcl.js, cronexpr="10 1 * * *", timeout=3600, enable=true
*/
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
const notify = $.isNode() ? require("./sendNotify") : "";
const jdCookieNode = $.isNode() ? require("./jdCookie.js") : "";
const sck = $.isNode() ? "set-cookie" : "Set-Cookie";
let cookiesArr = [],
  cookie = "",
  message;
let shareUUID= [
]
let isPurchaseShops = false
isPurchaseShops = $.isNode() ? (process.env.PURCHASE_SHOPS ? process.env.PURCHASE_SHOPS : isPurchaseShops) : ($.getdata("isPurchaseShops") ? $.getdata("isPurchaseShops") : isPurchaseShops);

if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item]);
  });
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === "false") that.log = () => {};
} else {
  cookiesArr = [
    $.getdata("CookieJD"),
    $.getdata("CookieJD2"),
    ...jsonParse($.getdata("CookiesJD") || "[]").map((item) => item.cookie),
  ].filter((item) => !!item);
}
const JD_API_HOST = "https://api.m.jd.com/client.action";
!(async () => {
  if (!cookiesArr[0]) {
    $.msg(
      $.name,
      "【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取",
      "https://bean.m.jd.com/",
      { "open-url": "https://bean.m.jd.com/" }
    );
    return;
  }
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(
        cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]
      );
      $.index = i + 1;
      message = "";
      that.log(`\n******开始【京东账号${$.index}】${$.UserName}*********\n`);
      await genToken();
      await isvObfuscator();
      await setCookie();
      await main()
    }
  }
  if ($.isNode()) await notify.sendNotify(`${$.name}`, `${message}\n\n如需做注册店铺会员任务，请点击下方链接手动完成\nhttps%3A%2F%2Fmpdz-isv.isvjcloud.com%2Fql%2Ffront%2Ftcl002%2FloadTclAct%3Fid%3DtclTeamAct002%26user_id%3D10299171\n\nhttps://mpdz-isv.isvjcloud.com/ql/front/tcl002/loadTclAct?id=tclTeamAct002&user_id=10299171`);
})()
  .catch((e) => {
    $.log("", `❌ ${$.name}, 失败! 原因: ${e}!`, "");
  })
  .finally(() => {
    $.done();
  });

function showMsg() {
  return new Promise(resolve => {
    $.log($.name, '', `京东账号${$.index}${$.nickName}\n${message}`);
    resolve()
  })
}
async function main() {
  await loadAct()
  await helpFriend()
  await sign()
  await $.wait(1000)
  await getShopList()
  if (isPurchaseShops) await getGoodsList()
  await browse()
  await $.wait(1000)
  await browse(1)
  await $.wait(1000)
  await draw()
}

function helpFriend(inviterNickAes = '') {
  return new Promise((resolve) => {
    $.post(taskUrl('/ql/front/tcl002/helpFriend', `inviterNickAes=${inviterNickAes}`), async (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`);
          that.log(`${$.name} API请求失败，请检查网路重试`);
        } else {
        //   data = $.toObj(data)
        //   that.log(data.msg)
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    });
  });
}

function loadAct() {
  return new Promise((resolve) => {
    $.get(taskGetUrl(), async (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`);
          that.log(`${$.name} API请求失败，请检查网路重试`);
        } else {
          //that.log(data)
          let id = data.match(/<input type="hidden" id="buyer_nick_code" name="buyer_nick_code" value="(.*)">/)
          //that.log('好友助力码' + id[1])
          if (data.indexOf('<div class="yourChoice">') === -1) {
            that.log(`未选择球队，去选择`)
            await chooseTeam()
          } else {
            that.log(`已选择球队`)
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    });
  });
}

function chooseTeam() {
  return new Promise((resolve) => {
    $.post(taskUrl('/ql/front/tcl002/chooseTeam', `team=0`), async (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`);
          that.log(`${$.name} API请求失败，请检查网路重试`);
        } else {
          data = $.toObj(data)
          that.log(`选择队伍结果：` + data.msg)
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    });
  });
}

function sign() {
  return new Promise((resolve) => {
    $.post(taskUrl('/ql/front/tcl002/goSign'), async (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`);
          that.log(`${$.name} API请求失败，请检查网路重试`);
        } else {
          data = $.toObj(data)
          that.log(`签到结果：` + data.msg)
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    });
  });
}

function browse(type = 0) {
  return new Promise((resolve) => {
    $.post(taskUrl('/ql/front/tcl002/browesVenue', `type=${type}`), async (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`);
          that.log(`${$.name} API请求失败，请检查网路重试`);
        } else {
          data = $.toObj(data)
          that.log(`浏览会场结果：` + data.msg)
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    });
  });
}

function getShopList() {
  return new Promise((resolve) => {
    $.post(taskUrl('/ql/front/tcl002/showshopload'), async (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`);
          that.log(`${$.name} API请求失败，请检查网路重试`);
        } else {
          data = $.toObj(data)
          for (let vo of data.data) {
            if (!vo.followFlag) {
              await browseShop(vo.id)
              await $.wait(1000)
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    });
  });
}

function browseShop(shopId) {
  return new Promise((resolve) => {
    $.post(taskUrl('/ql/front/tcl002/goBrowseShop', `shopId=${shopId}`), async (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`);
          that.log(`${$.name} API请求失败，请检查网路重试`);
        } else {
          data = $.toObj(data)
          that.log('关注店铺结果：' + data.msg)
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    });
  });
}

function getGoodsList() {
  return new Promise((resolve) => {
    $.post(taskUrl('/ql/front/tcl002/showgoodsload'), async (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`);
          that.log(`${$.name} API请求失败，请检查网路重试`);
        } else {
          data = $.toObj(data)
          for (let vo of data.data) {
            if (!vo.itemFlag) {
              await goPlus(vo.skuId)
              await $.wait(1000)
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    });
  });
}

function goPlus(goodId) {
  return new Promise((resolve) => {
    $.post(taskUrl('/ql/front/tcl002/goplus', `goodId=${goodId}`), async (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`);
          that.log(`${$.name} API请求失败，请检查网路重试`);
        } else {
          data = $.toObj(data)
          that.log('加入购物车结果：' + data.msg)
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    });
  });
}

function draw() {
  return new Promise((resolve) => {
    $.post(taskUrl('/ql/front/tcl002/drawTcl002', ``), async (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`);
          that.log(`${$.name} API请求失败，请检查网路重试`);
        } else {
          data = $.toObj(data)
          message = '抽奖结果：' + data.msg
          that.log('抽奖结果：' + data.msg)
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    });
  });
}

function genToken() {
  let config = {
    url: 'https://api.m.jd.com/client.action?functionId=genToken',
    body: 'uuid=8888888&client=apple&clientVersion=9.5.2&st=1619194107036&sign=8feb09628c3c7a76dd0f2f8a694eaf79&sv=100&body=%7B%22to%22%3A%22https%3A//mpdz-isv.isvjcloud.com/ql/front/tcl002/loadTclAct%3Fid%3DtclTeamAct002%26user_id%3D10299171%26comeResource%3D10%26bizExtString%3D4C8602ED441A318612CD57B4A16EB59EE8AF00C05E1043CAA3E9C10B6DA615700C9463CE3D33670238160230F84D490EE29440149504E2EB1EAD11840F8E2980DDDA672BF446E2FCC0D1D6B4E52826D1%22%2C%22action%22%3A%22to%22%7D',
    headers: {
      Host: "api.m.jd.com",
      accept: "*/*",
      "user-agent": "JD4iPhone/167638 (iPhone; iOS 13.7; Scale/3.00)",
      "accept-language":
        "zh-Hans-JP;q=1, en-JP;q=0.9, zh-Hant-TW;q=0.8, ja-JP;q=0.7, en-US;q=0.6",
      "content-type": "application/x-www-form-urlencoded",
      Cookie: cookie,
    },
  };
  return new Promise((resolve) => {
    $.post(config, async (err, resp, data) => {
      try {
        if (err) {
          that.log(`${$.name} API请求失败，请检查网路重试`);
          that.log(`${JSON.stringify(err)}`);
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            $.isvToken = data["tokenKey"];
            // that.log('isvToken'+$.isvToken);
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    });
  });
}

function isvObfuscator() {
  let config = {
    url: 'https://api.m.jd.com/client.action?functionId=isvObfuscator',
    body: 'uuid=8888888&client=apple&clientVersion=9.5.2&st=1619194362037&sign=1f829aab2583c598c1b6b1feeec5fe05&sv=101&body=%7B%22url%22%3A%22https%3A//mpdz-isv.isvjcloud.com/ql/front/tcl002/loadTclAct%3Fid%3DtclTeamAct002%26user_id%3D10299171%26comeResource%3D10%26bizExtString%3D4C8602ED441A318612CD57B4A16EB59EE8AF00C05E1043CAA3E9C10B6DA615700C9463CE3D33670238160230F84D490EE29440149504E2EB1EAD11840F8E2980DDDA672BF446E2FCC0D1D6B4E52826D1%22%2C%22id%22%3A%22%22%7D',
    headers: {
      Host: "api.m.jd.com",
      accept: "*/*",
      "user-agent": "JD4iPhone/167638 (iPhone; iOS 13.7; Scale/3.00)",
      "accept-language":
        "zh-Hans-JP;q=1, en-JP;q=0.9, zh-Hant-TW;q=0.8, ja-JP;q=0.7, en-US;q=0.6",
      "content-type": "application/x-www-form-urlencoded",
      Cookie: cookie,
    },
  };
  return new Promise((resolve) => {
    $.post(config, async (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`);
          that.log(`${$.name} API请求失败，请检查网路重试`);
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            $.token = data["token"];
            // that.log('token'+$.token);
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    });
  });
}

function setCookie() {
  return new Promise((resolve) => {
    //  that.log(taskUrl('front/setMixNick', `strTMMixNick=${$.token}`));
    $.post(taskUrl('front/setMixNick', `strTMMixNick=${$.token}`), async (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`);
          that.log(`${$.name} API请求失败，请检查网路重试`);
        } else {
          let setCookie = resp.header[sck];
          let  dfs = setCookie.toString().match(/dfs=(.*?);/)[1];
          let  jwt = setCookie.toString().match(/jwt=(.*?);/)[1];
          cookie = cookie+`;dfs=${dfs}; jwt=${jwt}; IsvToken=${$.token}`;
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    });
  });
}

function taskUrl(functionId, body) {
  return {
    url: `https://mpdz-isv.isvjcloud.com/${functionId}`,
    body: `userId=10299171&source=01&${body}`,
    headers: {
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      'Cookie': cookie,
      "Accept-Language": "zh-cn",
      Connection: "keep-alive",
      "content-type": "application/x-www-form-urlencoded",
      Host: "mpdz-isv.isvjcloud.com",
      "User-Agent": 'jdapp;iPhone;9.5.0;14.0.1;370c564f3ec5abbbe14f1f9f46ac73742fd56f58;network/wifi;ADID/4F7F967C-F9D8-41DE-902A-D87F8D45113A;supportApplePay/0;hasUPPay/0;hasOCPay/0;model/iPhone11,8;addressid/33553535;supportBestPay/0;appBuild/167638;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_0_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1'
    }
  }
}

function taskGetUrl() {
  return {
    url: `https://mpdz-isv.isvjcloud.com/ql/front/tcl002/loadTclAct?id=tclTeamAct002&user_id=10299171&comeResource=10&bizExtString=4C8602ED441A318612CD57B4A16EB59EE8AF00C05E1043CAA3E9C10B6DA615700C9463CE3D33670238160230F84D490EE29440149504E2EB1EAD11840F8E2980DDDA672BF446E2FCC0D1D6B4E52826D1`,
    headers: {
      'Host': 'mpdz-isv.isvjcloud.com',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'zh-cn',
      'Cookie': cookie,
      Connection: "keep-alive",
      "content-type": "application/x-www-form-urlencoded",
      "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1") : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
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
    that.log(`京东服务器访问数据为空，请检查自身设备网络情况`);
    return false;
  }
}

function jsonParse(str) {
  if (typeof str == "string") {
    try {
      return JSON.parse(str);
    } catch (e) {
      that.log(e);
      $.msg($.name, "", "不要在BoxJS手动复制粘贴修改cookie");
      return [];
    }
  }
}
