const activeEndTime = "2021/06/18 23:59:59+08:00"; //活动结束时间
const notify = $.isNode() ? require("./sendNotify") : "";
//Node.js用户请在jdCookie.js处填写京东ck;
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
const jdCookieNode = $.isNode() ? require("./jdCookie.js") : "";
!function(n){"use strict";function r(n,r){var t=(65535&n)+(65535&r);return(n>>16)+(r>>16)+(t>>16)<<16|65535&t}function t(n,r){return n<<r|n>>>32-r}function u(n,u,e,o,c,f){return r(t(r(r(u,n),r(o,f)),c),e)}function e(n,r,t,e,o,c,f){return u(r&t|~r&e,n,r,o,c,f)}function o(n,r,t,e,o,c,f){return u(r&e|t&~e,n,r,o,c,f)}function c(n,r,t,e,o,c,f){return u(r^t^e,n,r,o,c,f)}function f(n,r,t,e,o,c,f){return u(t^(r|~e),n,r,o,c,f)}function i(n,t){n[t>>5]|=128<<t%32,n[14+(t+64>>>9<<4)]=t;var u,i,a,h,g,l=1732584193,d=-271733879,v=-1732584194,C=271733878;for(u=0;u<n.length;u+=16)i=l,a=d,h=v,g=C,d=f(d=f(d=f(d=f(d=c(d=c(d=c(d=c(d=o(d=o(d=o(d=o(d=e(d=e(d=e(d=e(d,v=e(v,C=e(C,l=e(l,d,v,C,n[u],7,-680876936),d,v,n[u+1],12,-389564586),l,d,n[u+2],17,606105819),C,l,n[u+3],22,-1044525330),v=e(v,C=e(C,l=e(l,d,v,C,n[u+4],7,-176418897),d,v,n[u+5],12,1200080426),l,d,n[u+6],17,-1473231341),C,l,n[u+7],22,-45705983),v=e(v,C=e(C,l=e(l,d,v,C,n[u+8],7,1770035416),d,v,n[u+9],12,-1958414417),l,d,n[u+10],17,-42063),C,l,n[u+11],22,-1990404162),v=e(v,C=e(C,l=e(l,d,v,C,n[u+12],7,1804603682),d,v,n[u+13],12,-40341101),l,d,n[u+14],17,-1502002290),C,l,n[u+15],22,1236535329),v=o(v,C=o(C,l=o(l,d,v,C,n[u+1],5,-165796510),d,v,n[u+6],9,-1069501632),l,d,n[u+11],14,643717713),C,l,n[u],20,-373897302),v=o(v,C=o(C,l=o(l,d,v,C,n[u+5],5,-701558691),d,v,n[u+10],9,38016083),l,d,n[u+15],14,-660478335),C,l,n[u+4],20,-405537848),v=o(v,C=o(C,l=o(l,d,v,C,n[u+9],5,568446438),d,v,n[u+14],9,-1019803690),l,d,n[u+3],14,-187363961),C,l,n[u+8],20,1163531501),v=o(v,C=o(C,l=o(l,d,v,C,n[u+13],5,-1444681467),d,v,n[u+2],9,-51403784),l,d,n[u+7],14,1735328473),C,l,n[u+12],20,-1926607734),v=c(v,C=c(C,l=c(l,d,v,C,n[u+5],4,-378558),d,v,n[u+8],11,-2022574463),l,d,n[u+11],16,1839030562),C,l,n[u+14],23,-35309556),v=c(v,C=c(C,l=c(l,d,v,C,n[u+1],4,-1530992060),d,v,n[u+4],11,1272893353),l,d,n[u+7],16,-155497632),C,l,n[u+10],23,-1094730640),v=c(v,C=c(C,l=c(l,d,v,C,n[u+13],4,681279174),d,v,n[u],11,-358537222),l,d,n[u+3],16,-722521979),C,l,n[u+6],23,76029189),v=c(v,C=c(C,l=c(l,d,v,C,n[u+9],4,-640364487),d,v,n[u+12],11,-421815835),l,d,n[u+15],16,530742520),C,l,n[u+2],23,-995338651),v=f(v,C=f(C,l=f(l,d,v,C,n[u],6,-198630844),d,v,n[u+7],10,1126891415),l,d,n[u+14],15,-1416354905),C,l,n[u+5],21,-57434055),v=f(v,C=f(C,l=f(l,d,v,C,n[u+12],6,1700485571),d,v,n[u+3],10,-1894986606),l,d,n[u+10],15,-1051523),C,l,n[u+1],21,-2054922799),v=f(v,C=f(C,l=f(l,d,v,C,n[u+8],6,1873313359),d,v,n[u+15],10,-30611744),l,d,n[u+6],15,-1560198380),C,l,n[u+13],21,1309151649),v=f(v,C=f(C,l=f(l,d,v,C,n[u+4],6,-145523070),d,v,n[u+11],10,-1120210379),l,d,n[u+2],15,718787259),C,l,n[u+9],21,-343485551),l=r(l,i),d=r(d,a),v=r(v,h),C=r(C,g);return[l,d,v,C]}function a(n){var r,t="",u=32*n.length;for(r=0;r<u;r+=8)t+=String.fromCharCode(n[r>>5]>>>r%32&255);return t}function h(n){var r,t=[];for(t[(n.length>>2)-1]=void 0,r=0;r<t.length;r+=1)t[r]=0;var u=8*n.length;for(r=0;r<u;r+=8)t[r>>5]|=(255&n.charCodeAt(r/8))<<r%32;return t}function g(n){return a(i(h(n),8*n.length))}function l(n,r){var t,u,e=h(n),o=[],c=[];for(o[15]=c[15]=void 0,e.length>16&&(e=i(e,8*n.length)),t=0;t<16;t+=1)o[t]=909522486^e[t],c[t]=1549556828^e[t];return u=i(o.concat(h(r)),512+8*r.length),a(i(c.concat(u),640))}function d(n){var r,t,u="";for(t=0;t<n.length;t+=1)r=n.charCodeAt(t),u+="0123456789abcdef".charAt(r>>>4&15)+"0123456789abcdef".charAt(15&r);return u}function v(n){return unescape(encodeURIComponent(n))}function C(n){return g(v(n))}function A(n){return d(C(n))}function m(n,r){return l(v(n),v(r))}function s(n,r){return d(m(n,r))}function b(n,r,t){return r?t?m(r,n):s(r,n):t?C(n):A(n)}$.md5=b}();
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [], cookie = "", allMsg = '';
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
let starID = [
  {
    "starId": "flp-songqian",
  },
  {
    "starId": "ykd-liutao",
  }
];
$.allShareId = {};
const JD_API_HOST = "https://guardianstarjd.m.jd.com/star";
!(async () => {
  if (!cookiesArr[0]) {
    $.msg(
        $.name,
        "【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取",
        "https://bean.m.jd.com/bean/signIndex.action",
        { "open-url": "https://bean.m.jd.com/bean/signIndex.action" }
    );
    return;
  }
  cookie = cookiesArr[0];
  await starRanking();
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(
          cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]
      );
      $.index = i + 1;
      $.beanCount = 0;
      $.jdNum = 0;
      $.isLogin = true;
      $.nickName = "";
      $.shareID = [];
      await TotalBean();
      that.log(
          `\n===============开始【京东账号${$.index}】${
              $.nickName || $.UserName
          }==================\n`
      );
      if (!$.isLogin) {
        $.msg(
            $.name,
            `【提示】cookie已失效`,
            `京东账号${$.index} ${
                $.nickName || $.UserName
            }\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`,
            { "open-url": "https://bean.m.jd.com/bean/signIndex.action" }
        );

        if ($.isNode()) {
          await notify.sendNotify(
              `${$.name}cookie已失效 - ${$.UserName}`,
              `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`
          );
        }
        continue;
      }
      that.log(`一共${starID.length}个${$.name}任务，耗时会很久，京豆先到先得！！！！！！！！！！！
请提前知晓`);
      // $.beanCount = beforeTotal && beforeTotal['base'].jdNum;
      for (let index = 0; index < starID.length; index++) {
        $.activeId = starID[index]['starId'];
        that.log(`开始 【${$.activeId}】 星推官，加入店铺会员任务不做\n`);
        $.j = index;
        $.times = 0;
        await JD_XTG(true);
        await indexInfo();//抽奖
      }
      await showMsg();
    }
  }
  if ($.isNode() && allMsg) {
    await notify.sendNotify($.name, allMsg);
  }
  //助力功能
  for (let index = 0; index < starID.length; index++) {
    $.invites = [];
    $.activeId = starID[index]['starId'];
    $.appIndex = index + 1;
    that.log(`\n获取星推官【${$.activeId}】下的邀请码\n`)
    for (let v = 0; v < cookiesArr.length; v++) {
      cookie = cookiesArr[v];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]);
      $.index = v + 1;
      await initSuportInfo();
    }
    if ($.invites.length > 0) {
      $.allShareId[starID[index]['starId']] = $.invites;
    }
  }
  if (!cookiesArr || cookiesArr.length < 2) return
  for (let v = 0; v < cookiesArr.length; v++) {
    cookie = cookiesArr[v];
    $.index = v + 1;
    $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]);
    that.log(`自己账号内部互助\n\n`);
    for (let oneAppId in $.allShareId) {
      let oneAcHelpList = $.allShareId[oneAppId];
      for (let j = 0; j < oneAcHelpList.length; j++) {
        $.item = oneAcHelpList[j];
        if ($.UserName === $.item['userName']) continue;
        if (!$.item['inviteId'] || $.item['max']) continue
        that.log(`账号${$.index} ${$.UserName} 去助力账号 ${$.item['userName']}的第${$.item['index']}个星推官活动【${$.item['starId']}】，邀请码 【${$.item['inviteId']}】`)
        $.canHelp = true;
        $.activeId = $.item['starId'];
        await doSupport($.item['inviteId']);
        if (!$.canHelp) {
          that.log(`助力机会已耗尽，跳出`);
          break;//此处如果break，则遇到第一个活动就无助力机会时，不会继续助力第二个活动了
        }
      }
    }
  }
})()
    .catch((e) => {
      $.log("", `❌ ${$.name}, 失败! 原因: ${e}!`, "");
    })
    .finally(() => {
      $.done();
    });
async function showMsg() {
  let nowTime = new Date().getTime() + new Date().getTimezoneOffset() * 60 * 1000 + 8 * 60 * 60 * 1000;
  if (nowTime > new Date(activeEndTime).getTime()) {
    $.msg($.name, 'xtg', `请删除或禁用此脚本\n咱江湖再见`);
    if ($.isNode()) await notify.sendNotify($.name + '活动已结束', `请删除此脚本\n咱江湖再见`)
  } else {
    if ($.beanCount) {
      $.msg($.name, ``, `京东账号${$.index} ${$.nickName || $.UserName}\n星推官活动获得：${$.beanCount}京豆`);
      allMsg += `京东账号${$.index} ${$.nickName || $.UserName}\n星推官活动获得：${$.beanCount}京豆\n`;
    }
  }
}
async function JD_XTG(flag = false) {
  var skuCount = 15, meetingCount = 15;
  await getHomePage();
  if ($.homeData && $.homeData.code === 200) {
    let { dayTask, supportTask } = $.homeData.data;
    if (flag) {
      // that.log(`\n===========活动${$.j + 1}-[${starID[$.j]['starId']}] 助力码==========\n${shareId}\n`);
      // $.shareID.push(shareId);
    }
    dayTask = dayTask.filter(vo => (vo['type'] === 'sku' || vo['type'] === 'meeting' || vo['type'] === 'followShop') && vo['finishCount'] !== vo['count']);
    for (let item of dayTask) {
      if (item['type'] === 'memberShop') {
        that.log(`开通【${item['name']}】会员,跳过\n`);
        continue
      }
      if (item['type'] === 'sku') {
        meetingCount = item['count'];
        that.log(`浏览【${item['name']}】（${item['finishCount']}/${item['count']}），需等待6秒`);
        const res = await doTask(item['type'], item["id"]);
        const t = Date.now();
        if (res && res.code === 200) {
          await $.wait(6 * 1000)
          // const b = `browse_task_${$.activeId}_${item["id"]}_${$.time('yyyyMMdd')}_${item['type']}_${t + 7 * 1000}`;
          await getBrowsePrize(res.data);
          // await getBrowsePrize(b);
        }
      }
      if (item['type'] === 'meeting') {
        skuCount = item['count'];
        that.log(`浏览会场【${item['name']}】（${item['finishCount']}/${item['count']}），需等待6秒`);
        const res = await doTask(item['type'], item["id"]);
        const t = Date.now();
        if (res && res.code === 200) {
          await $.wait(6 * 1000)
          await getBrowsePrize(res.data);
        }
      }
      if (item['type'] === 'followShop') {
        that.log(`关注店铺【${item['name']}】（${item['finishCount']}/${item['count']}）`);
        await doTask(item['type'], item["id"], `followShop`);
      }
    }
    dayTask = dayTask.filter(vo => (vo['type'] === 'sku' || vo['type'] === 'meeting' || vo['type'] === 'followShop') && vo['finishCount'] !== vo['count']);
    if (dayTask && dayTask.length) {
      $.times += 1;
      that.log(`第 ${$.times + 1}次循环执行JD_XTG`)
      // await JD_XTG();
      if ($.times <= Math.max(skuCount, meetingCount)) {
        // that.log(`第 ${$.times + 1}次循环执行JD_XTG`)
        await JD_XTG();
      } else {
        that.log(`估计已死循环，不再执行JD_XTG\n`)
      }
    } else {
      that.log(`${$.activeId}星推官任务已做完\n`)
    }
  } else {
    that.log(`京东服务器返回无数据！`);
  }
}
//获取邀请码
function initSuportInfo() {
  return new Promise(async (resolve) => {
    const options = taskPostUrl('task/initSuportInfo', 'initSuportInfo',`starId=${$.activeId}`);
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`);
          that.log(`${$.name} API请求失败，请检查网路重试`);
        } else {
          // that.log(`\n助力结果:${data}`);
          data = JSON.parse(data);
          if (data['code'] === 200) {
            that.log(`账号${$.index} ${$.UserName} ${$.activeId}星推官邀请码：${data.data}`);
            $.invites.push({
              inviteId: data.data,
              userName: $.UserName,
              starId: $.activeId,
              index: $.appIndex,
              max: false
            })
          } else {
            that.log(`邀请码获取失败:`)
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    });
  });
}
function starRanking() {
  return new Promise(async (resolve) => {
    const options = taskPostUrl('task/starRanking', 'starRanking', 'starId=bl-gongjun')
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`);
          that.log(`${$.name} API请求失败，请检查网路重试`);
        } else {
          // that.log(`\n助力结果:${data}`);
          data = JSON.parse(data);
          if (data['code'] === 200) {
            starID = data.data
          } else {
            that.log(`frontConfig失败:`)
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    });
  });
}
function getHomePage() {
  return new Promise((resolve) => {
    const options = taskPostUrl('task/getList', 'getList', `starId=${$.activeId}`);
    $.post(options, async (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`);
          that.log(`${$.name} API请求失败，请检查网路重试`);
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data['code'] === 200) {
              $.homeData = data;
            } else {
              that.log(`getList异常`)
            }
          } else {
            that.log(`京东服务器返回空数据`);
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    });
  });
}
function doTask(type, id, functionID = 'doBrowse') {
  return new Promise(async (resolve) => {
    const options = taskPostUrl(`task/${functionID}`, functionID, `starId=${$.activeId}&id=${id}&type=${type}`)
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`);
          that.log(`${$.name} API请求失败，请检查网路重试`);
        } else {
          that.log(`doBrowse做任务结果:${data}`);
          data = JSON.parse(data);
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    });
  });
}
function getBrowsePrize(browseId) {
  return new Promise(async (resolve) => {
    const options = taskPostUrl('task/getBrowsePrize', 'getBrowsePrize', `starId=${$.activeId}&browseId=${browseId}`)
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`);
          that.log(`${$.name} API请求失败，请检查网路重试`);
        } else {
          that.log(`getBrowsePrize做任务结果:${data}`);
          data = JSON.parse(data);
          if (data && data.code === 200) {
            $.beanCount += data.data['jingBean'];
            that.log(`获得京豆：${data.data['jingBean']}\n`);
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    });
  });
}
function doSupport(shareId) {
  return new Promise(async (resolve) => {
    const options = taskPostUrl('task/doSupport', 'doSupport', `starId=${$.activeId}&shareId=${shareId}`)
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`);
          that.log(`${$.name} API请求失败，请检查网路重试`);
        } else {
          data = JSON.parse(data);
          if (data && data.code === 200) {
            if (data['data']['status'] === 6) {
              that.log('助力成功')
            }
            if (data['data']['status'] === 5) $.canHelp = false;
            if (data['data']['status'] === 4) $.item['max'] = true;
          }
          that.log(`助力结果:${JSON.stringify(data)}\n`);
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    });
  });
}
function indexInfo() {
  return new Promise(async (resolve) => {
    const options = taskPostUrl('index/indexInfo', 'indexInfo', `starId=${$.activeId}&type=null`);
    $.post(options, async (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`);
          that.log(`${$.name} API请求失败，请检查网路重试`);
        } else {
          data = JSON.parse(data);
          if (data && data.code === 200) {
            $.starPrizeVoList = (data.data.starPrizeVoList || []).filter(vo => vo.status === 0 && data.data.myTotalStar >= vo['starGradeNum']);
            for (let item of $.starPrizeVoList) {
              await lottery(item['id']);
              // await $.wait(500);
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    });
  });
}
function lottery(id) {
  return new Promise(async (resolve) => {
    const options = taskPostUrl('task/lottery', 'lottery', `starId=${$.activeId}&id=${id}`);
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`);
          that.log(`${$.name} API请求失败，请检查网路重试`);
        } else {
          data = JSON.parse(data);
          if (data && data.code === 200) {
            if (data.data && data.data.status === 1) {
              that.log(`京东账号${$.index} ${$.nickName || $.UserName}恭喜中奖\n【${$.activeId}】星推官抽奖详情${JSON.stringify(data)}\n`);
            } else {
              that.log(`【${$.activeId}】星推官抽奖：未中奖\n`)
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    });
  });
}
function TotalBean() {
  return new Promise(async (resolve) => {
    const options = {
      url: `https://wq.jd.com/user/info/QueryJDUserInfo?sceneval=2`,
      headers: {
        Accept: "application/json,text/plain, */*",
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-cn",
        Connection: "keep-alive",
        Cookie: cookie,
        Referer: "https://wqs.jd.com/my/jingdou/my.shtml?sceneval=2",
        "User-Agent": "jdapp;android;9.4.4;10;3b78ecc3f490c7ba;network/UNKNOWN;model/M2006J10C;addressid/138543439;aid/3b78ecc3f490c7ba;oaid/7d5870c5a1696881;osVer/29;appBuild/85576;psn/3b78ecc3f490c7ba|541;psq/2;uid/3b78ecc3f490c7ba;adk/;ads/;pap/JA2015_311210|9.2.4|ANDROID 10;osv/10;pv/548.2;jdv/0|iosapp|t_335139774|appshare|CopyURL|1606277982178|1606277986;ref/com.jd.lib.personal.view.fragment.JDPersonalFragment;partner/xiaomi001;apprpd/MyJD_Main;Mozilla/5.0 (Linux; Android 10; M2006J10C Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045227 Mobile Safari/537.36",
      },
    };
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`);
          that.log(`${$.name} API请求失败，请检查网路重试`);
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data["retcode"] === 13) {
              $.isLogin = false; //cookie过期
              return;
            }
            if (data["retcode"] === 0) {
              $.nickName = (data["base"] && data["base"].nickname) || $.UserName;
            } else {
              $.nickName = $.UserName;
            }
          } else {
            that.log(`京东服务器返回空数据`);
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
// function getDayPrizeStatus(prizeType, prizeId, status) {
//   let r = Date.now().toString();
//   let hi = "07035cabb557f096";
//   let o = hi + r;
//   let t = "getDayPrizeStatus";
//   let a = `starId=${$.activeId}&status=${status}&prizeType=${prizeType}&prizeId=${prizeId}`;
//   return new Promise(async (resolve) => {
//     const options = {
//       url: `${JD_API_HOST}/getDayPrizeStatus`,
//       body: `starId=${$.activeId}&status=${status}&prizeType=${prizeType}&prizeId=${prizeId}`,
//       headers: {
//         Accept: "application/json,text/plain, */*",
//         "Content-Type": "application/x-www-form-urlencoded",
//         "Accept-Encoding": "gzip, deflate, br",
//         "Accept-Language": "zh-cn",
//         Connection: "keep-alive",
//         Cookie: cookie,
//         Host: "urvsaggpt.m.jd.com",
//         Referer: "https://urvsaggpt.m.jd.com/static/index.html",
//         sign: za(a, o, t).toString(),
//         timestamp: r,
//         "User-Agent": "jdapp;android;9.4.4;10;3b78ecc3f490c7ba;network/UNKNOWN;model/M2006J10C;addressid/138543439;aid/3b78ecc3f490c7ba;oaid/7d5870c5a1696881;osVer/29;appBuild/85576;psn/3b78ecc3f490c7ba|541;psq/2;uid/3b78ecc3f490c7ba;adk/;ads/;pap/JA2015_311210|9.2.4|ANDROID 10;osv/10;pv/548.2;jdv/0|iosapp|t_335139774|appshare|CopyURL|1606277982178|1606277986;ref/com.jd.lib.personal.view.fragment.JDPersonalFragment;partner/xiaomi001;apprpd/MyJD_Main;Mozilla/5.0 (Linux; Android 10; M2006J10C Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045227 Mobile Safari/537.36",
//       },
//     };
//     $.post(options, (err, resp, data) => {
//       try {
//         if (err) {
//           that.log(`${JSON.stringify(err)}`);
//           that.log(`${$.name} API请求失败，请检查网路重试`);
//         } else {
//           that.log(`抽奖结果:${data}`);
//           // data = JSON.parse(data);
//         }
//       } catch (e) {
//         $.logErr(e, resp);
//       } finally {
//         resolve();
//       }
//     });
//   });
// }
function taskPostUrl(functionId, t, a) {
  let o = '', r = '';
  const time = Date.now();
  // if (t === 'getBrowsePrize') {
  //   o = "07035cabb557f096" + (time + 6 * 1000);
  //   r = (time + 6 * 1000).toString()
  // } else {
  //   o = "07035cabb557f096" + time;
  //   r = time.toString();
  // }
  o = "07035cabb557f096" + time;
  r = time.toString();
  // let t = "/khc/task/doQuestion";
  // let a = "brandId=555555&questionId=2&result=1"
  return {
    url: `${JD_API_HOST}/${functionId}`,
    body: a,
    headers: {
      Accept: "application/json,text/plain, */*",
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "zh-cn",
      Connection: "keep-alive",
      Cookie: cookie,
      Host: "guardianstarjd.m.jd.com",
      Referer: "https://guardianstarjd.m.jd.com/",
      sign: za(a, o, t).toString(),
      timestamp: r,
      "User-Agent": "jdapp;android;9.4.4;10;3b78ecc3f490c7ba;network/UNKNOWN;model/M2006J10C;addressid/138543439;aid/3b78ecc3f490c7ba;oaid/7d5870c5a1696881;osVer/29;appBuild/85576;psn/3b78ecc3f490c7ba|541;psq/2;uid/3b78ecc3f490c7ba;adk/;ads/;pap/JA2015_311210|9.2.4|ANDROID 10;osv/10;pv/548.2;jdv/0|iosapp|t_335139774|appshare|CopyURL|1606277982178|1606277986;ref/com.jd.lib.personal.view.fragment.JDPersonalFragment;partner/xiaomi001;apprpd/MyJD_Main;Mozilla/5.0 (Linux; Android 10; M2006J10C Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045227 Mobile Safari/537.36",
    }
  }
}
function jsonParse(str) {
  if (typeof str == "string") {
    try {
      return JSON.parse(str);
    } catch (e) {
      that.log(e);
      $.msg($.name, "", "请勿随意在BoxJs输入框修改内容\n建议通过脚本去获取cookie");
      return [];
    }
  }
}
function taskUrl(function_id) {
  let r = Date.now().toString();
  let hi = "07035cabb557f096";
  let o = hi + r;
  let t = function_id;
  let a = `t=${r}&starId=${$.activeId}`;
  return {
    url: `${JD_API_HOST}/${function_id}?t=${r}&starId=${$.activeId}`,
    headers: {
      Accept: "application/json,text/plain, */*",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "zh-cn",
      Connection: "keep-alive",
      Cookie: cookie,
      Host: "urvsaggpt.m.jd.com",
      Referer: "https://guardianstarjd.m.jd.com/",
      sign: za(a, o, t).toString(),
      timestamp: r,
      "User-Agent": "jdapp;android;9.4.4;10;3b78ecc3f490c7ba;network/UNKNOWN;model/M2006J10C;addressid/138543439;aid/3b78ecc3f490c7ba;oaid/7d5870c5a1696881;osVer/29;appBuild/85576;psn/3b78ecc3f490c7ba|541;psq/2;uid/3b78ecc3f490c7ba;adk/;ads/;pap/JA2015_311210|9.2.4|ANDROID 10;osv/10;pv/548.2;jdv/0|iosapp|t_335139774|appshare|CopyURL|1606277982178|1606277986;ref/com.jd.lib.personal.view.fragment.JDPersonalFragment;partner/xiaomi001;apprpd/MyJD_Main;Mozilla/5.0 (Linux; Android 10; M2006J10C Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045227 Mobile Safari/537.36",
    },
  };
}

// prettier-ignore
function za(t, e, a) {
  var n = "",
      i = a.split("?")[1] || "";
  if (t) {
    if ("string" == typeof t) n = t + i;
    else if ("object" == ka(t)) {
      var s = [];
      for (var r in t) s.push(r + "=" + t[r]);
      n = s.length ? s.join("&") + i : i;
    }
  } else n = i;
  if (n) {
    var o = n.split("&").sort().join("");
    return $.md5(o + e);
  }
  return $.md5(e);
}

