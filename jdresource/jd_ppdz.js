/*


 [task_local]
 #东东泡泡大战
 1 0 * * * https://raw.githubusercontent.com/panghu999/panghu/master/jd_ppdz.js, tag=柠檬东东泡泡大战, img-url=https://raw.githubusercontent.com/Orz-3/mini/master/Color/jd.png, enabled=true
*/
const notify = $.isNode() ? require('./sendNotify') : '';
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
var timestamp = (new Date()).valueOf();
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [], cookie = '', message,no1,score,pm,kssj,jssj,ts,token;

if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') that.log = () => {};
} else {
  cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}
const JD_API_HOST = 'https://api.m.jd.com/client.action';

!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
    return;
  }

  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = '';
      message = '';
      await TotalBean();
      that.log(`\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});

        if ($.isNode()) {
          //await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }
        continue
      }
      
     await star()
     await rank()
      //await info()
      //await sf()
      

    }
  }
})()
  .catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
  })
  .finally(() => {
    $.done();
  })

async function star(){
for(let i = 0; i < 5; i ++){
no1 = i;

await fx5()
await shop()
await shop1()
await shop2()
await shop3()
}
} 


function fx5(timeout = 0) {

  return new Promise((resolve) => {
    setTimeout( ()=>{
      let url = {
        url : `https://api.m.jd.com/api?body=&clientVersion=8.8.8&uuid=86763302131156838bc92874434&client=H5&appid=zuma-web&functionId=activity_shareTask`,
      headers: {
        "Host": "api.m.jd.com",
        "Origin": "https://jingqih5.m.jd.com",
        "Cookie": cookie,
        "User-Agent": "jdapp;iPhone;9.5.2;14.3;6898c30638c55142969304c8e2167997fa59eb53;network/4g;ADID/F108E1B6-8E30-477C-BE54-87CF23435488;supportApplePay/0;hasUPPay/0;hasOCPay/0;model/iPhone9,2;addressid/4585826605;supportBestPay/0;appBuild/167650;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
      }
       
      }

      $.get(url, async (err, resp, data) => {
        try {
          //that.log(url.url)
          that.log(data)
          data = JSON.parse(data);
        //   that.log(data)
          //await notify.sendNotify(`${$.name} - 柠檬jxgc`, `京东账号${$.index} ${$.nickName}`+"电动车制造："+data)
         if (data.code === 0) {
            // that.log("柠檬赚京豆步数换京豆:2000步"+data.msg)
          //await notify.sendNotify(`${$.name} - 柠檬赚京豆步数换京豆`, `京东账号${$.index} ${$.nickName}`+"\n柠檬赚京豆步数换京豆:2000步\n"+data.msg)
            } else {
               //that.log("柠檬赚京豆步数换京豆:2000步"+data.msg)
               //await notify.sendNotify(`${$.name} - 柠檬赚京豆步数换京豆`, `京东账号${$.index} ${$.nickName}`+"\n柠檬赚京豆步数换京豆2000步\n步数不足或今日你已经兑换")
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

function shop(timeout = 0) {

  return new Promise((resolve) => {
    setTimeout( ()=>{
      let url = {
        url : `https://api.m.jd.com/api?body={"shopId":"1000000127"}&clientVersion=8.8.8&uuid=86763302131156838bc92874435&client=H5&appid=zuma-web&functionId=activity_followShop`,
      headers: {
        "Host": "api.m.jd.com",
        "Origin": "https://jingqih5.m.jd.com",
        "Cookie": cookie,
        "User-Agent": "jdapp;iPhone;9.5.2;14.3;6898c30638c55142969304c8e2167997fa59eb53;network/4g;ADID/F108E1B6-8E30-477C-BE54-87CF23435488;supportApplePay/0;hasUPPay/0;hasOCPay/0;model/iPhone9,2;addressid/4585826605;supportBestPay/0;appBuild/167650;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
      }
       
      }

      $.get(url, async (err, resp, data) => {
        try {
          //that.log(url.url)
          that.log(data)
          data  = JSON.parse(data);
        // url = data.taskInfo.allValues.value
          //await notify.sendNotify(`${$.name} - 柠檬jxgc`, `京东账号${$.index} ${$.nickName}`+"电动车制造："+data)
         if (data.code === 0) {
            // that.log("柠檬赚京豆步数换京豆:2000步"+data.msg)
          //await notify.sendNotify(`${$.name} - 柠檬赚京豆步数换京豆`, `京东账号${$.index} ${$.nickName}`+"\n柠檬赚京豆步数换京豆:2000步\n"+data.msg)
            } else {
               //that.log("柠檬赚京豆步数换京豆:2000步"+data.msg)
               //await notify.sendNotify(`${$.name} - 柠檬赚京豆步数换京豆`, `京东账号${$.index} ${$.nickName}`+"\n柠檬赚京豆步数换京豆2000步\n步数不足或今日你已经兑换")
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
function shop1(timeout = 0) {

  return new Promise((resolve) => {
    setTimeout( ()=>{
      let url = {
        url : `https://api.m.jd.com/api?body={"hallId":"https://pro.m.jd.com/mall/active/Y9FVe619hMoajzqpxky1CQQJAkk/index.html?babelChannel=ttt10"}&clientVersion=8.8.8&uuid=86763302131156838bc92874434&client=H5&appid=zuma-web&functionId=activity_stroll`,
      headers: {
        "Host": "api.m.jd.com",
        "Origin": "https://jingqih5.m.jd.com",
        "Cookie": cookie,
        "User-Agent": "jdapp;iPhone;9.5.2;14.3;6898c30638c55142969304c8e2167997fa59eb53;network/4g;ADID/F108E1B6-8E30-477C-BE54-87CF23435488;supportApplePay/0;hasUPPay/0;hasOCPay/0;model/iPhone9,2;addressid/4585826605;supportBestPay/0;appBuild/167650;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
      }
       
      }

      $.get(url, async (err, resp, data) => {
        try {
          //that.log(url.url)
          that.log(data)
          data  = JSON.parse(data);
        // url = data.taskInfo.allValues.value
          //await notify.sendNotify(`${$.name} - 柠檬jxgc`, `京东账号${$.index} ${$.nickName}`+"电动车制造："+data)
         if (data.code === 0) {
            // that.log("柠檬赚京豆步数换京豆:2000步"+data.msg)
          //await notify.sendNotify(`${$.name} - 柠檬赚京豆步数换京豆`, `京东账号${$.index} ${$.nickName}`+"\n柠檬赚京豆步数换京豆:2000步\n"+data.msg)
            } else {
               //that.log("柠檬赚京豆步数换京豆:2000步"+data.msg)
               //await notify.sendNotify(`${$.name} - 柠檬赚京豆步数换京豆`, `京东账号${$.index} ${$.nickName}`+"\n柠檬赚京豆步数换京豆2000步\n步数不足或今日你已经兑换")
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

function shop2(timeout = 0) {

  return new Promise((resolve) => {
    setTimeout( ()=>{
      let url = {
        url : `https://api.m.jd.com/api?body={"goodId":"100009255069"}&clientVersion=8.8.8&uuid=86763302131156838bc92874434&client=H5&appid=zuma-web&functionId=activity_followGood`,
      headers: {
        "Host": "api.m.jd.com",
        "Origin": "https://jingqih5.m.jd.com",
        "Cookie": cookie,
        "User-Agent": "jdapp;iPhone;9.5.2;14.3;6898c30638c55142969304c8e2167997fa59eb53;network/4g;ADID/F108E1B6-8E30-477C-BE54-87CF23435488;supportApplePay/0;hasUPPay/0;hasOCPay/0;model/iPhone9,2;addressid/4585826605;supportBestPay/0;appBuild/167650;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
      }
       
      }

      $.get(url, async (err, resp, data) => {
        try {
          //that.log(url.url)
         that.log(data)
         data  = JSON.parse(data);
        // url = data.taskInfo.allValues.value
          //await notify.sendNotify(`${$.name} - 柠檬jxgc`, `京东账号${$.index} ${$.nickName}`+"电动车制造："+data)
         if (data.code === 0) {
            // that.log("柠檬赚京豆步数换京豆:2000步"+data.msg)
          //await notify.sendNotify(`${$.name} - 柠檬赚京豆步数换京豆`, `京东账号${$.index} ${$.nickName}`+"\n柠檬赚京豆步数换京豆:2000步\n"+data.msg)
            } else {
               //that.log("柠檬赚京豆步数换京豆:2000步"+data.msg)
               //await notify.sendNotify(`${$.name} - 柠檬赚京豆步数换京豆`, `京东账号${$.index} ${$.nickName}`+"\n柠檬赚京豆步数换京豆2000步\n步数不足或今日你已经兑换")
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
function shop3(timeout = 0) {

  return new Promise((resolve) => {
    setTimeout( ()=>{
      let url = {
        url : `https://api.m.jd.com/api?body={"goodId":"100010338198"}&clientVersion=8.8.8&uuid=86763302131156838bc92874434&client=H5&appid=zuma-web&functionId=activity_followGood`,
      headers: {
        "Host": "api.m.jd.com",
        "Origin": "https://jingqih5.m.jd.com",
        "Cookie": cookie,
        "User-Agent": "jdapp;iPhone;9.5.2;14.3;6898c30638c55142969304c8e2167997fa59eb53;network/4g;ADID/F108E1B6-8E30-477C-BE54-87CF23435488;supportApplePay/0;hasUPPay/0;hasOCPay/0;model/iPhone9,2;addressid/4585826605;supportBestPay/0;appBuild/167650;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
      }
       
      }

      $.get(url, async (err, resp, data) => {
        try {
          //that.log(url.url)
         that.log(data)
          data  = JSON.parse(data);
        // url = data.taskInfo.allValues.value
          //await notify.sendNotify(`${$.name} - 柠檬jxgc`, `京东账号${$.index} ${$.nickName}`+"电动车制造："+data)
         if (data.code === 0) {
            // that.log("柠檬赚京豆步数换京豆:2000步"+data.msg)
          //await notify.sendNotify(`${$.name} - 柠檬赚京豆步数换京豆`, `京东账号${$.index} ${$.nickName}`+"\n柠檬赚京豆步数换京豆:2000步\n"+data.msg)
            } else {
               //that.log("柠檬赚京豆步数换京豆:2000步"+data.msg)
               //await notify.sendNotify(`${$.name} - 柠檬赚京豆步数换京豆`, `京东账号${$.index} ${$.nickName}`+"\n柠檬赚京豆步数换京豆2000步\n步数不足或今日你已经兑换")
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
function task(timeout = 0) {

  return new Promise((resolve) => {
    setTimeout( ()=>{
      let url = {
        url : `https://api.m.jd.com/api?body=&clientVersion=8.8.8&uuid=86763302131156838bc92874434&client=H5&appid=zuma-web&functionId=activity_taskInfo`,
      headers: {
        "Host": "api.m.jd.com",
        "Origin": "https://jingqih5.m.jd.com",
        "Cookie": cookie,
        "User-Agent": "jdapp;iPhone;9.5.2;14.3;6898c30638c55142969304c8e2167997fa59eb53;network/4g;ADID/F108E1B6-8E30-477C-BE54-87CF23435488;supportApplePay/0;hasUPPay/0;hasOCPay/0;model/iPhone9,2;addressid/4585826605;supportBestPay/0;appBuild/167650;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
      }
       
      }

      $.get(url, async (err, resp, data) => {
        try {
          //that.log(url.url)
          that.log(data)
          data  = JSON.parse(data);
        // url = data.taskInfo.allValues.value
          //await notify.sendNotify(`${$.name} - 柠檬jxgc`, `京东账号${$.index} ${$.nickName}`+"电动车制造："+data)
         if (data.code === 0) {
            // that.log("柠檬赚京豆步数换京豆:2000步"+data.msg)
          //await notify.sendNotify(`${$.name} - 柠檬赚京豆步数换京豆`, `京东账号${$.index} ${$.nickName}`+"\n柠檬赚京豆步数换京豆:2000步\n"+data.msg)
            } else {
               //that.log("柠檬赚京豆步数换京豆:2000步"+data.msg)
               //await notify.sendNotify(`${$.name} - 柠檬赚京豆步数换京豆`, `京东账号${$.index} ${$.nickName}`+"\n柠檬赚京豆步数换京豆2000步\n步数不足或今日你已经兑换")
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





function rank(timeout = 0) {

  return new Promise((resolve) => {
    setTimeout( ()=>{
      let url = {
        url : `https://api.m.jd.com/api?body=&clientVersion=8.8.8&uuid=86763302131156838bc92874434&client=H5&appid=zuma-web&functionId=activity_info`,
      headers: {
        "Host": "api.m.jd.com",
        "Origin": "https://jingqih5.m.jd.com",
        "Cookie": cookie,
        "User-Agent": "jdapp;iPhone;9.5.2;14.3;6898c30638c55142969304c8e2167997fa59eb53;network/4g;ADID/F108E1B6-8E30-477C-BE54-87CF23435488;supportApplePay/0;hasUPPay/0;hasOCPay/0;model/iPhone9,2;addressid/4585826605;supportBestPay/0;appBuild/167650;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
      }
       
      }

      $.get(url, async (err, resp, data) => {
        try {
          //that.log(url.url)
          //that.log(data) startTime":"2021-05-31 00:00:00","
         const result = JSON.parse(data);
         score = data.match(/"score":(.*?),/)[1]
         pm = data.match(/rank":"(.*?)","/)[1]
         kssj = data.match(/startTime":"(.*?)","/)[1]
         jssj = data.match(/endTime":"(.*?)","/)[1]
          //$.log(result)
          //$.log(result.score)
          //await notify.sendNotify(`${$.name} - 柠檬jxgc`, `京东账号${$.index} ${$.nickName}`+"电动车制造："+data)
         if (result.errorCode === 0) {
             $.log("\n柠檬东东泡泡大战,今日任务已完成\n")
             $.log("\n当前个人积分："+score+"\n当前个人排名："+pm)
             $.log("\n开始时间："+kssj+"\n结束时间："+jssj)
            } else {
               //that.log("柠檬赚京豆步数换京豆:2000步"+data.msg)
               //await notify.sendNotify(`${$.name} - 柠檬赚京豆步数换京豆`, `京东账号${$.index} ${$.nickName}`+"\n柠檬赚京豆步数换京豆2000步\n步数不足或今日你已经兑换")
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



function sf(timeout = 0) {
shuju = `{"ts":+ts,"token":+token,"maxRound":1,"eggRoundCount":0,"roundStars":{"1":4}}`

  return new Promise((resolve) => {
    setTimeout( ()=>{
      let url = {
        url : `https://api.m.jd.com/api?appid=orderCenter&functionId=picker_submitResult&clientVersion=8.0.0&client=m&body=`+a(shuju),
      headers: {
        "referer": "https://jingqih5.m.jd.com",
        "Origin": "https://jingqih5.m.jd.com",
        "Cookie": cookie,
        "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36 Edg/89.0.774.68",
      }
       
      }

      $.get(url, async (err, resp, data) => {
        try {
          //that.log(url.url)
          that.log(data) 
         //startTime":"2021-05-31 00:00:00","
         const result = JSON.parse(data);
         //token = data.match(/token":"(.*?)"/)[1]
         //ts = data.match(/ts":(.*?)}/)[1]
         //kssj = data.match(/startTime":"(.*?)","/)[1]
         //jssj = data.match(/endTime":"(.*?)","/)[1]
          //$.log(result)
          //$.log(result.score)
          //await notify.sendNotify(`${$.name} - 柠檬jxgc`, `京东账号${$.index} ${$.nickName}`+"电动车制造："+data)
         if (result.status === 0) {
             //$.log(token);
          $.log(ts);
             //$.log("\n当前个人积分："+score+"\n当前个人排名："+pm)
            // $.log("\n开始时间："+kssj+"\n结束时间："+jssj)
          //await notify.sendNotify(`${$.name} - 柠檬东东泡泡大战`, `京东账号${$.index} ${$.nickName}`+`\n柠檬东东泡泡大战,今日任务已完成\n`+`\n当前个人积分：`+score+`\n当前个人排名：`+pm+`\n开始时间：`+kssj+`\n结束时间：`+jssj)
            } else {
               //that.log("柠檬赚京豆步数换京豆:2000步"+data.msg)
               //await notify.sendNotify(`${$.name} - 柠檬赚京豆步数换京豆`, `京东账号${$.index} ${$.nickName}`+"\n柠檬赚京豆步数换京豆2000步\n步数不足或今日你已经兑换")
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
function info(timeout = 0) {

  return new Promise((resolve) => {
    setTimeout( ()=>{
      let url = {
        url : `https://api.m.jd.com/api?appid=orderCenter&functionId=picker_getUserInfo&clientVersion=8.0.0&client=m&body=5GlOj7xTF%2Fw%3D`,
      headers: {
        "referer": "https://jingqih5.m.jd.com",
        "Origin": "https://jingqih5.m.jd.com",
        "Cookie": cookie,
        "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36 Edg/89.0.774.68",
      }
       
      }

      $.get(url, async (err, resp, data) => {
        try {
          //that.log(url.url)
          //that.log(data) startTime":"2021-05-31 00:00:00","
         const result = JSON.parse(data);
          token = data.match(/token":"(.*?)"/)[1]
         ts = data.match(/ts":(.*?)}/)[1]
         //kssj = data.match(/startTime":"(.*?)","/)[1]
         //jssj = data.match(/endTime":"(.*?)","/)[1]
          //$.log(result)
          //$.log(result.score)
          //await notify.sendNotify(`${$.name} - 柠檬jxgc`, `京东账号${$.index} ${$.nickName}`+"电动车制造："+data)
         if (result.status === 0) {
             //$.log(token);
          $.log(ts);
             //$.log("\n当前个人积分："+score+"\n当前个人排名："+pm)
            // $.log("\n开始时间："+kssj+"\n结束时间："+jssj)
          //await notify.sendNotify(`${$.name} - 柠檬东东泡泡大战`, `京东账号${$.index} ${$.nickName}`+`\n柠檬东东泡泡大战,今日任务已完成\n`+`\n当前个人积分：`+score+`\n当前个人排名：`+pm+`\n开始时间：`+kssj+`\n结束时间：`+jssj)
            } else {
               //that.log("柠檬赚京豆步数换京豆:2000步"+data.msg)
               //await notify.sendNotify(`${$.name} - 柠檬赚京豆步数换京豆`, `京东账号${$.index} ${$.nickName}`+"\n柠檬赚京豆步数换京豆2000步\n步数不足或今日你已经兑换")
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

