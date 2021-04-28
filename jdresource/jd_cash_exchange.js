const printDetail = false;
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
let cookiesArr = [], cookie = '';
  if ($.isNode()) {
      Object.keys(jdCookieNode).forEach((item) => {
        if (jdCookieNode[item]) {
          cookiesArr.push(jdCookieNode[item])
        }
      })
      if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {};
    } else {
      let cookiesData = $.getdata('CookiesJD') || "[]";
      cookiesData = jsonParse(cookiesData);
      cookiesArr = cookiesData.map(item => item.cookie);
      cookiesArr.reverse();
      cookiesArr.push(...[$.getdata('CookieJD2'), $.getdata('CookieJD')]);
      cookiesArr.reverse();
      cookiesArr = cookiesArr.filter(item => item !== "" && item !== null && item !== undefined);
    }
    that.log(`共${cookiesArr.length}个京东账号\n`)
const JD_API_HOST = `https://api.m.jd.com/client.action?functionId=cash_getRedPacket`;
!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/', {"open-url": "https://bean.m.jd.com/"});
    return;
  }
  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i];
    if (cookie) {
      $.index = i + 1;
      await  QueryJDUserInfo();
      if (i+1) that.log(`\n***************开始京东账号${i + 1}【${$.nickname}】***************`)
      //initial();  
      if (!$.isLogin)  //cookie不可用
      {
        //$.setdata('', `CookieJD${i ? i + 1 : "" }`);//cookie失效，故清空cookie。
        $.msg($.name, `【提示】京东账号${i + 1} cookie已过期！请先获取cookie\n直接使用NobyDa的京东签到获取`, 'https://bean.m.jd.com/', {"open-url": "https://bean.m.jd.com/"});
        continue;
      }
      else{
         $.count=0;
        while($.count<100){
           $.count++;
           await exchange_redpocket(); 
           await $.wait(100);
        }
		await msgShow();
      }
    }
  }
})()
  .catch((e) => $.logErr(e))
  .finally(() => $.done())

function exchange_redpocket(){
  return new Promise(resolve => {
    $.post(jdUrl('cash_getRedPacket'), (err, resp, data) => {
      try {
        if (err) {
          data = JSON.parse(resp.body);
		  that.log(`Error：${JSON.stringify(data)}`);
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
			that.log(`Result：${JSON.stringify(data)}`);
			if(data.data.bizCode==0){
				//$.message = data.data.result.shareRewardTip;
				$.message = '成功！';
			}
			else{
				$.message = '今日可兑换的红包已抢完';
			}
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
function msgShow() {
	return new Promise(resolve => {
    $.msg($.name, '', `【京东账号${$.index}】${$.nickname}\n${$.message}`);
    resolve()
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

//?timestamp=${new Date().getTime() + new Date().getTimezoneOffset() * 60 * 1000 + 8 * 60 * 60 * 1000}
function taskUrl(function_id, body = {}) {
  return {
    url: `${JD_API_HOST}${function_id}`,
    headers: {
      "Accept": "application/json, text/plain, */*",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "zh-cn",
      "Connection": "keep-alive",
      "Content-Type": "application/x-www-form-urlencoded",
      "Host": "api.m.jd.com",
      'origin': 'https://h5.m.jd.com',
      "Referer": "https://h5.m.jd.com/babelDiy/Zeus/GzY6gTjVg1zqnQRnmWfMKC4PsT1/index.html",
      "Cookie": cookie,
      "User-Agent": "jdapp;iPhone;9.4.2;13.4.1;e9241834b8e0994edf39389a4d18ff6eeba990f5;network/4g;supportApplePay/0;hasUPPay/0;hasOCPay/0;model/iPhone10,1;addressid/2413614733;supportBestPay/0;appBuild/167568;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 13_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
    }
  }
}

function jdUrl(function_id, body={}) {
  return {
    url: `https://api.m.jd.com/client.action?functionId=${function_id}`,
    body: 'area=12_904_3375_62168&body=%7B%22type%22%3A%222%22%2C%22amount%22%3A%221000%22%7D&build=167568&client=apple&clientVersion=9.4.2&d_brand=apple&d_model=iPhone10%2C1&eid=eidI7e0881206ds1SM32L/0VTwCr9pypbIK71EjN96Ar5iWtIQ80IdYlQ%2BS9Hquok3hgImlD95zTSq6RCyVM6OOO/6bine%2BXwICjjYPHS2HNCOJRYpA3&isBackground=N&joycious=78&lang=zh_CN&networkType=4g&networklibtype=JDNetworkBaseAF&openudid=e9241834b8e0994edf39389a4d18ff6eeba990f5&osVersion=13.4.1&partner=apple&rfs=0000&scope=11&screen=750%2A1334&sign=be8cfeeadc15ec25063e3bf0b23c8647&st=1614868202765&sv=122&uts=0f31TVRjBSto9/0xW/caLvwNVtr1%2Bfw3D78ba4pjkx%2BE5nueBcxpmyJawSIY2T47vFiOAgL0RXsOi3Dy7y5AZTZXRTRKi%2BTkCxPCG2PTKNtdIugmJsxGXqAvxgVIgQsquSX%2BJvLMjDBDkb2Y%2BVWFukYFF%2BS9y3L4htiO/2pfeiBQuKmmxkGQB51p%2BaTzjj1NKmmUNrYyhK2FqufkI7fg5g%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=unknown',
    headers: {
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': '*/*',
      'Host': 'api.m.jd.com',
	  'User-Agent': 'JD4iPhone/167568 (iPhone; iOS 13.4.1; Scale/2.00)',
	  'Accept-Language': 'en-HK;q=1, zh-Hans-HK;q=0.9, zh-Hant-HK;q=0.8',
      'Cookie': cookie
    }
  }
}
//获取昵称
function QueryJDUserInfo(timeout = 0) {
  return new Promise((resolve) => {
    setTimeout( ()=>{
      let url = {
        url : `https://me-api.jd.com/user_new/info/GetJDUserInfoUnion`,
        headers : {
          'Host' : `me-api.jd.com`,
          'Cookie' : cookie
        }
      }
      $.get(url, (err, resp, data) => {
        try {
          if (printDetail) that.log(data)
          data = JSON.parse(data);
          if (data.retcode === 13) {
            $.isLogin = false;
            return
          }
          //$.nickname = data.data.userInfo.baseInfo.nickname;
          $.isLogin = true;
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve()
        }
      })
    },timeout)
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