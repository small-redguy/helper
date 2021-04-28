const notify = $.isNode() ? require('./sendNotify') : '';
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [], cookie = '', message;
const JD_API_HOST = 'https://api.m.jd.com/api?appid=interCenter_shopSign';

let activityId=''
let vender=''
let num=0
let shopName=''
const token=[
'F2FA870C86F2BDC5B11B92A7DC671256',//4.1日添加20天66
  '7C1820082C993AB3103EB02E1B5AEC39',//4.1日添加18天20
  '6CF6DE5D1AFE8E45652C30458DEEAA4E',//4.1日添加7天10
  '5923488026EC4B52DB11E9D5CB75BBA9',//4.1日添加7天10
  '43D8744137B24C95DDA15BB7AE0CDF6F',//4.1日添加7天10
  '1D2F4BD7D6F73DD7473B2ADF1E154BC6',//4.1日添加10天20
  'AB8B120EB16A090179AE4ED13C36B29D',//4.1日添加6天2  13天5
  '31F79F4424A50A0F83D0E7C8E2527E64',//4.1日添加3天3 7天5
  '17AABB287E29B0CCE7AEDFD502463782',//4.2日添加3天3 5天5 10天10
  '2C0B1ABD512B71663DB6BA85B1C4E6A9',//4.2日添加3天3 5天5
  '4C676E07FEDABA47B86766F4C367C21F',//4.2日添加7天5
  'E88C4CD1927118269703DDCA03D991A1',//4.2日添加7天50
  '2CEE37FA49014FA58BD32D42998300D4',//4.2日添加7天30
  '4F14F96E9CB62BF8523F26F2BDC97941',//4.2日添加3天20
  '7230153017ACC87413B9BAA97C64E38B',//4.2日添加5天50
  'FC52E985D2781510BB4AF3DB067286C1',//4.2日添加5天20
  'A8E250725F8C34653D0D683F2FFC9C65',//4.2日添加7天50 15天100
  '7CCC19AA3F4AD64EB02EA927F57D6A2A',//4.2日添加3天3
  '978FCCE248F3E5EB1763F86057B55D68',//4.3日添加15天100r
]
//IOS等用户直接用NobyDa的jd cookie

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

!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
    return;
  }
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=(.+?);/) && cookie.match(/pt_pin=(.+?);/)[1])
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
      await dpqd()
      await showMsg()
    }
  }
})()
    .catch((e) => {
      $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
    })
    .finally(() => {
      $.done();
    })

//开始店铺签到
async function dpqd(){
  for (var j = 0; j < token.length; j++) {
    num=j+1
    if (token[j]=='') {continue}
    await getvenderId(token[j])
    if (vender=='') {continue}
    await getvenderName(vender)
    await getActivityInfo(token[j],vender)
    await signCollectGift(token[j],vender,activityId)
    await taskUrl(token[j],vender)
  }
}

//获取店铺ID
function getvenderId(token) {
  return new Promise(resolve => {
    const options = {
      url: `https://api.m.jd.com/api?appid=interCenter_shopSign&t=${Date.now()}&loginType=2&functionId=interact_center_shopSign_getActivityInfo&body={%22token%22:%22${token}%22,%22venderId%22:%22%22}&jsonp=jsonp1000`,
      headers: {
        "accept": "*/*",
        "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
        "cookie": cookie,
        "referer": 'https://h5.m.jd.com/',
        "User-Agent": `Mozilla/5.0 (Linux; U; Android 10; zh-cn; MI 8 Build/QKQ1.190828.002) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/79.0.3945.147 Mobile Safari/537.36 XiaoMi/MiuiBrowser/13.5.40`
      }
    }
    $.get(options, (err, resp, data) => {
      try {
        if (err) {
          that.log(`\n${$.name}: API查询请求失败 ‼️‼️`)
          $.logErr(err);
        } else {
          //that.log(data)
          data = JSON.parse(/{(.*)}/g.exec(data)[0])
          if (data.code==402) {
            vender=''
            that.log(`第`+num+`个店铺签到活动已失效`)
            message +=`第`+num+`个店铺签到活动已失效\n`
          }else{
            vender=data.data.venderId
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

//获取店铺名称
function getvenderName(venderId) {
  return new Promise(resolve => {
    const options = {
      url: `https://wq.jd.com/mshop/QueryShopMemberInfoJson?venderId=${venderId}`,
      headers: {
        "accept": "*/*",
        "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
        "cookie": cookie,
        "User-Agent": `Mozilla/5.0 (Linux; U; Android 10; zh-cn; MI 8 Build/QKQ1.190828.002) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/79.0.3945.147 Mobile Safari/537.36 XiaoMi/MiuiBrowser/13.5.40`
      }
    }
    $.get(options, (err, resp, data) => {
      try {
        if (err) {
          that.log(`\n${$.name}: API查询请求失败 ‼️‼️`)
          $.logErr(err);
        } else {
          //that.log(data)
          data = JSON.parse(data)
          shopName = data.shopName
          that.log(`【`+shopName+`】`)
          message +=`【`+shopName+`】`
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}


//获取店铺活动信息
function getActivityInfo(token,venderId) {
  return new Promise(resolve => {
    const options = {
      url: `${JD_API_HOST}&t=${Date.now()}&loginType=2&functionId=interact_center_shopSign_getActivityInfo&body={%22token%22:%22${token}%22,%22venderId%22:${venderId}}&jsonp=jsonp1005`,
      headers: {
        "accept": "accept",
        "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
        "cookie": cookie,
        "referer": `https://h5.m.jd.com/babelDiy/Zeus/2PAAf74aG3D61qvfKUM5dxUssJQ9/index.html?token=${token}&sceneval=2&jxsid=16105853541009626903&cu=true&utm_source=kong&utm_medium=jingfen&utm_campaign=t_1001280291_&utm_term=fa3f8f38c56f44e2b4bfc2f37bce9713`,
        "User-Agent": `Mozilla/5.0 (Linux; U; Android 10; zh-cn; MI 8 Build/QKQ1.190828.002) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/79.0.3945.147 Mobile Safari/537.36 XiaoMi/MiuiBrowser/13.5.40`
      }
    }
    $.get(options, (err, resp, data) => {
      try {
        if (err) {
          // that.log(data)
          that.log(`\n${$.name}: API查询请求失败 ‼️‼️`)
          $.logErr(err);
        } else {
          //that.log(data)
          data = JSON.parse(/{(.*)}/g.exec(data)[0])
          activityId=data.data.id
          //that.log(data)
          let mes='';
          for (let i = 0; i < data.data.continuePrizeRuleList.length; i++) {
            const level=data.data.continuePrizeRuleList[i].level
            const discount=data.data.continuePrizeRuleList[i].prizeList[0].discount
            mes += "签到"+level+"天,获得"+discount+'豆'
          }
          //that.log(message+mes+'\n')
          //message += mes+'\n'
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}

//店铺签到
function signCollectGift(token,venderId,activitytemp) {
  return new Promise(resolve => {
    const options = {
      url: `${JD_API_HOST}&t=${Date.now()}&loginType=2&functionId=interact_center_shopSign_signCollectGift&body={%22token%22:%22${token}%22,%22venderId%22:688200,%22activityId%22:${activitytemp},%22type%22:56,%22actionType%22:7}&jsonp=jsonp1004`,
      headers: {
        "accept": "accept",
        "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
        "cookie": cookie,
        "referer": `https://h5.m.jd.com/babelDiy/Zeus/2PAAf74aG3D61qvfKUM5dxUssJQ9/index.html?token=${token}&sceneval=2&jxsid=16105853541009626903&cu=true&utm_source=kong&utm_medium=jingfen&utm_campaign=t_1001280291_&utm_term=fa3f8f38c56f44e2b4bfc2f37bce9713`,
        "User-Agent": `Mozilla/5.0 (Linux; U; Android 10; zh-cn; MI 8 Build/QKQ1.190828.002) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/79.0.3945.147 Mobile Safari/537.36 XiaoMi/MiuiBrowser/13.5.40`
      }
    }
    $.get(options, (err, resp, data) => {
      try {
        if (err) {
          that.log(`\n${$.name}: API查询请求失败 ‼️‼️`)
          $.logErr(err);
        } else {
          //that.log(data)
          data = JSON.parse(/{(.*)}/g.exec(data)[0])
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}

//店铺获取签到信息
function taskUrl(token,venderId) {
  return new Promise(resolve => {
    const options = {
      url: `${JD_API_HOST}&t=${Date.now()}&loginType=2&functionId=interact_center_shopSign_getSignRecord&body={%22token%22:%22${token}%22,%22venderId%22:${venderId},%22activityId%22:${activityId},%22type%22:56}&jsonp=jsonp1006`,
      headers: {
        "accept": "application/json",
        "accept-language": "zh-CN,zh;q=0.9",
        "cookie": cookie,
        "referer": `https://h5.m.jd.com/`,
        "user-agent": `Mozilla/5.0 (Linux; U; Android 10; zh-cn; MI 8 Build/QKQ1.190828.002) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/79.0.3945.147 Mobile Safari/537.36 XiaoMi/MiuiBrowser/13.5.40`
      }
    }
    $.get(options, (err, resp, data) => {
      try {
        if (err) {
          that.log(`\n${$.name}: API查询请求失败 ‼️‼️`)
          $.logErr(err);
        } else {
            //that.log(data)
            data = JSON.parse(/{(.*)}/g.exec(data)[0])
            that.log(`已签到：`+data.data.days+`天`)
            message +=`已签到：`+data.data.days+`天\n`
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}

async function showMsg() {
  if ($.isNode()) {
    $.msg($.name, '', `【京东账号${$.index}】${$.nickName}\n${message}`);
    await notify.sendNotify(`${$.name} - 账号${$.index} - ${$.nickName}`, `【京东账号${$.index}】${$.nickName}\n${message}`);
  }
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
        "User-Agent": `jdapp;android;9.3.5;10;3353234393134326-3673735303632613;network/wifi;model/MI 8;addressid/138719729;aid/3524914bc77506b1;oaid/274aeb3d01b03a22;osVer/29;appBuild/86390;psn/Mp0dlaZf4czQtfPNMEfpcYU9S/f2Vv4y|2255;psq/1;adk/;ads/;pap/JA2015_311210|9.3.5|ANDROID 10;osv/10;pv/2039.1;jdv/0|androidapp|t_335139774|appshare|QQfriends|1611211482018|1611211495;ref/com.jingdong.app.mall.home.JDHomeFragment;partner/jingdong;apprpd/Home_Main;eufv/1;jdSupportDarkMode/0;Mozilla/5.0 (Linux; Android 10; MI 8 Build/QKQ1.190828.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045230 Mobile Safari/537.36`
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
            $.nickName = data['base'].nickname;
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