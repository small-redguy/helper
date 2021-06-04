/*
翻翻乐@wenmoux
更新: 2021-06-04 00:25
抄自 @yangtingxiao 抽奖机脚本
活动入口： 京东极速版-我的-省钱大赢家-翻翻乐
极速版大赢家翻翻乐活动
 */
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
const openum = 5  //翻牌次数 可以自己改
const randomCount = $.isNode() ? 20 : 5;
const notify = $.isNode() ? require('./sendNotify') : '';
let merge = {}
let codeList = []
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [],message,k,
    cookie = '';
if ($.isNode()) {
    Object.keys(jdCookieNode).forEach((item) => {
        cookiesArr.push(jdCookieNode[item])
    })
    if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') that.log = () => {};
} else {
    cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}
 
const JD_API_HOST = `https://api.m.jd.com`;
message = ""
    !(async () => {
        if (!cookiesArr[0]) {
            $.msg($.name, '【提示】请先获取cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/', {
                "open-url": "https://bean.m.jd.com/"
            });
            return;
        }
        message = ''
        for (let i = 0; i < cookiesArr.length; i++) {
            cookie = cookiesArr[i];
            if (cookie) {
                $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
                $.index = i + 1;
                $.isLogin = true;
                $.canDraw = true;
                $.prize =0;
                $.linkid = "YhCkrVusBVa_O2K-7xE6hA"
                $.message = `【京东账号${$.index}】${$.UserName}\n`
                that.log(`\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
                if (!$.isLogin) {
                    $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {
                        "open-url": "https://bean.m.jd.com/bean/signIndex.action"
                    });
 
                    continue
                }
                let leftTime = await check()
                if (leftTime != 0) {
                    that.log("时间未到,请继续等待哦！")
                    $.message += "还没到开红包时间哦~  \n"
                } else {
                    that.log("时间已到,开始开红包")
                    await open("gambleOpenReward")
                    for (k = 0; k < 5&& $.canDraw; k++) {
                        await open("gambleChangeReward")
                        await $.wait(500);
                    }
                    if ($.canDraw) {
                        $.message += "当前：" + $.reward.rewardValue + "\n"
                        await open("gambleObtainReward", $.reward.rewardType)
                        await Draw($.reward.id, $.reward.poolBaseId, $.reward.prizeGroupId, $.reward.prizeBaseId, $.reward.prizeType)
                    }
                    
                }
                message += $.message + `累计获得：￥${$.prize}  \n`
            }
        }
 
    })()
    .catch((e) => $.logErr(e))
    .finally(() => $.done())
//获取活动信息
 
 
 
function check() {
    return new Promise(async (resolve) => {
        let options = taskUrl("gambleHomePage", `{"linkId":"YhCkrVusBVa_O2K-7xE6hA"}`)
        $.get(options, async (err, resp, data) => {
            try {
                if (err) {
                    that.log(`${JSON.stringify(err)}`);
                    that.log(`${$.name} API请求失败，请检查网路重试`);
                } else {
                    //     that.log(data)
                    data = JSON.parse(data);
 
                    if (data.code === 0) {
                        resolve(data.data.leftTime)
                        let time = (parseInt(data.data.leftTime / 60000))
                        that.log("查询成功 剩余时间：" + time + "min")
                    } else {
                        that.log(data)
                        resolve("6")
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
function totalPrize() {
    return new Promise(async (resolve) => {
        let options = taskUrl("gamblePrizeList", `{"linkId":"${$.linkid}","pageNum":1,"pageSize":999999}`)
        $.get(options, async (err, resp, data) => {
            try {
                if (err) {
                    that.log(`${JSON.stringify(err)}`);
                    that.log(`${$.name} API请求失败，请检查网路重试`);
                } else {
                    //     that.log(data)
                    data = JSON.parse(data);
 
                    if (data.code === 0 && data.data&&data.data.items) {
                        for (item in data.data.items){
                       $.prize =parseFloat($.prize)+ parseFloat(data.data.items[item].amount)
                        }                        
                        that.log("查询成功 共提现：￥" + $.prize)
                    } else {
                        $essage += data.errMsg
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
 
 
 
 
 
function open(functionid, type) {
    return new Promise(async (resolve) => {
        let options = taskPostUrl(functionid, `{"linkId":"${$.linkid}"}`)
        if (type) {
            options = taskPostUrl(functionid, `{"linkId":"${$.linkid}","rewardType":${type}}`)
        }
        $.post(options, async (err, resp, data) => {
            try {
                if (err) {
                    that.log(`${JSON.stringify(err)}`);
                    that.log(`${$.name} API请求失败，请检查网路重试`);
                } else {
                    //that.log(data)
                    data = JSON.parse(data);
                    if (data.code === 0 && data.data) {
                        $.reward = data.data
                        that.log("当前红包：" + data.data.rewardValue + "翻倍次数：" + data.data.changeTimes)
                    } else {
                        $.canDraw = false
                        that.log(data)
                        $.message += "  翻倍失败😅\n"
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
 
 
function Draw(id, poolBaseId, prizeGroupId, prizeBaseId, prizeType) {
    return new Promise(async (resolve) => {
        let options = taskPostUrl("apCashWithDraw", `{"businessSource":"GAMBLE","base":{"id":${id},"business":"redEnvelopeDouble","poolBaseId":${poolBaseId},"prizeGroupId":${prizeGroupId},"prizeBaseId":${prizeBaseId},"prizeType":${prizeType}},"linkId":"${$.linkid}"}`)
        //   that.log(options)
        $.post(options, async (err, resp, data) => {
            try {
                if (err) {
                    that.log(`${JSON.stringify(err)}`);
                    that.log(`${$.name} API请求失败，请检查网路重试`);
                } else {
                    //     that.log(data)
                    data = JSON.parse(data);
                    if (data.code === 0 && data.data && data.data.message) {
                        that.log("提现结果：" + data.data.message)
                        $.message += "提现结果：" + data.data.message
                    } else {
                        that.log(data)
                        $.message += "提现结果：" + JSON.stringify(data)
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
 
 
 
function taskUrl(function_id, body) {
    return {
        url: `${JD_API_HOST}/?functionId=${function_id}&body=${body}&t=${Date.now()}&appid=activities_platform&clientVersion=3.5.0`,
        headers: {
            "Accept": "*/*",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "zh-cn",
            "Connection": "keep-alive",
            "Content-Type": "application/x-www-form-urlencoded",
            "Host": "api.m.jd.com",
            "Referer": "https://618redpacket.jd.com/?activityId=DA4SkG7NXupA9sksI00L0g&channel=wjicon&sid=0a1ec8fa2455796af69028f8410996aw&un_area=1_2803_2829_0",
            "Cookie": cookie,
            "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
        }
    }
}
 
 
function taskPostUrl(functionid, body) {
    return {
        url: `${JD_API_HOST}/`,
        body: `functionId=${functionid}&body=${body}&t=${Date.now()}&appid=activities_platform&clientVersion=3.5.0`,
        headers: {
            "Accept": "*/*",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "zh-cn",
            "Connection": "keep-alive",
            "Content-Type": "application/x-www-form-urlencoded",
            "Host": "api.m.jd.com",
            "Referer": "https://618redpacket.jd.com/?activityId=DA4SkG7NXupA9sksI00L0g&channel=wjicon&sid=0a1ec8fa2455796af69028f8410996aw&un_area=1_2803_2829_0",
            "Cookie": cookie,
            "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
        }
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
 
