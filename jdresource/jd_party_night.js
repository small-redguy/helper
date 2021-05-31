/*
沸腾之夜
开启预约活动得0.18元红包，得到五个助力后，得1.58元红包
内部账号自己相互助力，一个账号3次助力机会。
 */
const notify = $.isNode() ? require('./sendNotify') : '';
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
$.inviteCodeList = [];
let cookiesArr = [
];
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
if ($.isNode()) {
     Object.keys(jdCookieNode).forEach((item) => {
          cookiesArr.push(jdCookieNode[item])
     })
     if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') that.log = () => {};
} else {
     cookiesArr = [
          $.getdata("CookieJD"),
          $.getdata("CookieJD2"),
          ...$.toObj($.getdata("CookiesJD") || "[]").map((item) => item.cookie)].filter((item) => !!item);
}

!(async () => {
     if (!cookiesArr[0]) {
          $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
          return;
     }
     for (let i = 0; i < 5; i++) {
          that.log(`开始第${i+1}次抽奖`);
          for (let i = 0; i < cookiesArr.length; i++) {
               $.index = i + 1;
               $.cookie = cookiesArr[i];
               $.UserName = decodeURIComponent($.cookie.match(/pt_pin=([^; ]+)(?=;?)/) && $.cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]);
               that.log(`\n*****开始【京东账号${$.index}】${$.nickName || $.UserName}*****\n`);
               await partyNight();
               if(cookiesArr.length>5){
                    await $.wait(1500);
               }else{
                    await $.wait(5000);
               }
          }
     }

     // //助力-------------------------
     // for (let i = 0; i < cookiesArr.length; i++) {
     //      $.index = i + 1;
     //      $.cookie = cookiesArr[i];
     //      $.UserName = decodeURIComponent($.cookie.match(/pt_pin=([^; ]+)(?=;?)/) && $.cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]);
     //      that.log(`\n*****开始【京东账号${$.index}】${$.nickName || $.UserName}*****\n`);
     //      $.canHelp = true;
     //      for (let j = 0; j < $.inviteCodeList.length && $.canHelp; j++) {
     //           await $.wait(2000);
     //           $.oneInviteInfo = $.inviteCodeList[j];
     //           if($.oneInviteInfo.use === $.UserName){
     //                continue;
     //           }
     //           if($.oneInviteInfo.max){
     //                continue;
     //           }
     //           $.inviteCode = $.oneInviteInfo.inviteCode;
     //           that.log(`${$.UserName}去助力${$.oneInviteInfo.use},助力码：${$.inviteCode}`)
     //           await takePostRequest('partyTonight_assist');
     //      }
     //      //await $.wait(3000);
     // }
})()
  .catch((e) => {
       $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
  })
  .finally(() => {
       $.done();
  })

async function partyNight(){
     // $.mainInfo = {};
     // await takePostRequest('partyTonight_init');
     // if(JSON.stringify($.mainInfo) === '{}'){
     //      return ;
     // }else {
     //      that.log('获取活动信息成功');
     // }

     $.runFlag = true;
     //for (let i = 0; i < 10 && $.runFlag; i++) {

          await takePostRequest('partyTonight_lottery');
          //await $.wait(5000);
     //}
     //预约
     //await $.wait(2000);
     //await takePostRequest('partyTonight_remind');
}

async function takePostRequest(type) {
     let body = ``;
     let myRequest = ``;
     switch (type) {
          case 'partyTonight_init':
               body = `functionId=partyTonight_init&body={}&client=wh5&clientVersion=1.0.0&uuid=`;
               myRequest = getPostRequest(`partyTonight_init`, body);
               break;
          case 'partyTonight_remind':
               body = `functionId=partyTonight_remind&body={}&client=wh5&clientVersion=1.0.0&uuid=`;
               myRequest = getPostRequest(`partyTonight_remind`, body);
               break;
          case 'partyTonight_assist':
               body = `functionId=partyTonight_assist&body={"inviteCode":"${$.inviteCode}"}&client=wh5&clientVersion=1.0.0&uuid=`;
               myRequest = getPostRequest(`partyTonight_assist`, body);
               break;
          case 'partyTonight_lottery':
               body = `functionId=partyTonight_lottery&body={}&client=wh5&clientVersion=1.0.0&uuid=`;
               myRequest = getPostRequest(`partyTonight_lottery`, body);
               break;
          default:
               that.log(`错误${type}`);
     }
     return new Promise(async resolve => {
          $.post(myRequest, (err, resp, data) => {
               try {
                    dealReturn(type, data);
               } catch (e) {
                    $.logErr(e, resp)
               } finally {
                    resolve();
               }
          })
     })
}

function dealReturn(type, data) {
     try {
          data = JSON.parse(data);
     } catch (e) {
          that.log(`返回异常：${data}`);
          return;
     }
     switch (type) {
          case 'partyTonight_init':
               if (data.code === 0 && data.data && data.data.bizCode === 0) {
                    $.mainInfo = data.data.result;
                    $.inviteCode = $.mainInfo.inviteCode;
                    that.log(`邀请码：${$.inviteCode}`);
                    if($.mainInfo.assistStatus === 4){
                         that.log(`助力已满`);
                    }else{
                         $.inviteCodeList.push(
                           {
                                'inviteCode':$.inviteCode,
                                'use':$.UserName,
                                'max':false
                           }
                         )
                    }
               }else{
                    that.log(JSON.stringify(data));
               }
               break;
          case 'partyTonight_remind':
               if (data.code === 0 && data.data && data.data.bizCode === 0) {
                    that.log(`预约成功，获得：${data.data.result.remindRedPacketValue}`)
               }else if(data.code === 0 && data.data && data.data.bizCode === -201){
                    that.log(JSON.stringify(data.data.bizMsg));
               }else{
                    that.log(JSON.stringify(data));
               }
               break;
          case 'partyTonight_assist':
               if (data.code === 0 && data.data && (data.data.bizCode === -303 || data.data.bizCode === -1001)) {
                    $.canHelp = false
               }else if (data.code === 0 && data.data && data.data.bizCode === -304) {
                    $.oneInviteInfo.max = true;
               }
               that.log(JSON.stringify(data));
               break;
          case 'partyTonight_lottery':
               if (data.code === 0 && data.data && data.data.bizCode === 0) {
                    let result = data.data.result;
                    if(result.type === 1){
                         that.log(`获得红包：${result.hongbaoValue}`);
                    }else if(result.type === 2){
                         that.log(`获得优惠券：`);
                    }else if(result.type === 3){
                         that.log(`获得京豆：${result.beanCount}`);
                    }else{
                         that.log(JSON.stringify(data));
                    }
               }else {
                    $.runFlag = false;
                    that.log(JSON.stringify(data));
               }
               break;
          default:
     }
}

function getPostRequest(type, body) {
     const url = `https://api.m.jd.com/`;
     const method = `POST`;
     const headers = {
          'Accept' : `application/json, text/plain, */*`,
          'Origin' : `https://h5static.m.jd.com`,
          'Accept-Encoding' : `gzip, deflate, br`,
          'Cookie' : $.cookie,
          'Content-Type' : `application/x-www-form-urlencoded`,
          'Host' : `api.m.jd.com`,
          'Connection' : `keep-alive`,
          'User-Agent' : $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
          'Referer' : `https://h5static.m.jd.com/babelDiy/Zeus/qEfNdq9oRsJfhYJ7XR1EahyLt9L/index.html`,
          'Accept-Language' : `zh-cn`
     };
     return {url: url, method: method, headers: headers, body: body};
}

