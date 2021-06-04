/*
新潮品牌狂欢@wenmoux
https://t.me/wenmouxx
抄自 @yangtingxiao 抽奖机脚本
活动入口：
已支持IOS双京东账号, Node.js支持N个京东账号
脚本兼容: QuantumultX, Surge, Loon, 小火箭，JSBox, Node.js
============Quantumultx===============
[task_local]
#新潮品牌狂欢
30 9,10 1-18 6 * https://cdn.jsdelivr.net/gh/Wenmoux/scripts/jd_mcxhd_brandcity.js, tag=新潮品牌狂欢, img-url=https://raw.githubusercontent.com/Orz-3/mini/master/Color/jd.png, enabled=true

================Loon==============
[Script]
cron "30 9,10 1-18 6 *" script-path=https://g/jd_scripts/raw/ tag=新潮品牌狂欢

===============Surge=================
新潮品牌狂欢 = type=cron,cronexp="30 9,10 1-18 6 *",wake-system=1,timeout=3600,script-path=https://cdn.jsdelivr.net/gh/Wenmoux/scripts/js/jd_mcxhd_brandcity.js

============小火箭=========
新潮品牌狂欢 = type=cron,script-path=https://cdn.jsdelivr.net/gh/Wenmoux/scripts/js/jd_mcxhd_brandcity.js, cronexpr="30 9,10 1-18 6 *", timeout=3600, enable=true

 */
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';

const randomCount = $.isNode() ? 20 : 5;
const notify = $.isNode() ? require('./sendNotify') : '';
let merge = {}
let codeList = []
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [],
    cookie = '';
if ($.isNode()) {
    Object.keys(jdCookieNode).forEach((item) => {
        cookiesArr.push(jdCookieNode[item])
    })
    if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') that.log = () => {};
} else {
    cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}

const JD_API_HOST = `https://api.m.jd.com/client.action`;


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

            //       $.taskList=[]
            //   await shareCodesFormat();
            that.log(`\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
            if (!$.isLogin) {
                $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {
                    "open-url": "https://bean.m.jd.com/bean/signIndex.action"
                });

                if ($.isNode()) {
                    await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
                }
                continue
            }

            await getaskList()
            for (j = 0; j < $.taskList.length; j++) {
                let taskType = $.taskList[j].taskType
                if ($.taskList[j].status === 2) {
                    that.log("该任务已完成")
                } else {
                    for (k = 0; k < $.taskList[j].subItem.length; k++) {
                        that.log("去做任务：" + $.taskList[j].taskName)
                        await doTask("mcxhd_brandcity_doTask",`{"itemToken":"${$.taskList[j].subItem[k].itemToken}","token":"jd17919499fb7031e5"}`)
                        if (taskType === "9") {
                            taskToken = $.taskList[j].subItem[k].taskToken
                       //     that.log( $.taskList[j])
                            await $.wait(5500);
                            await doTask("qryViewkitCallbackResult",  `{"dataSource":"newshortAward","method":"getTaskAward","reqParams":"{\\"taskToken\\":\\"${taskToken}\\"}","sdkVersion":"1.0.0","clientLanguage":"zh"}`)                         
                            await doTask("mcxhd_brandcity_checkTaskStatus", `{"itemToken":"${$.taskList[j].subItem[k].itemToken}","token":"jd17919499fb7031e5"}`)
                        }
                    }
                }


            }

        }
    }

    for (let i = 0; i < cookiesArr.length; i++) {
        cookie = cookiesArr[i];
        if (cookie) {
                    $.index = i + 1;
            that.log(`\n******开始【京东账号${$.index}】\n`);
            for (l = 0; l < codeList.length; l++) {
                that.log(`为 ${codeList[l]}助力中`)
                await doTask("mcxhd_brandcity_doTask",`{"itemToken":"${codeList[l]}","token":"jd17919499fb7031e5"}`)
                await $.wait(500);
            }
        }
    }

    for (let i = 0; i < cookiesArr.length; i++) {
        cookie = cookiesArr[i];
        if (cookie) {
            $.beans = 0
            $.index = i + 1;
            $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
          
            //   await shareCodesFormat();
            that.log(`\n******开始【京东账号${$.index}】${   $.UserName}\n`);

            that.log("开始抽奖")
            for (g=0;g<5;g++){
            await playgame()
            await $.wait(1000);
            }            
            that.log(`共获得${$.beans} 京豆`)
            message += `【京东账号${$.index}】${ $.UserName}\n共获得${$.beans} 京豆\n`

        }
    }
    await notify.sendNotify(`新潮品牌狂欢`, `${message}`);
})()
.catch((e) => $.logErr(e))
    .finally(() => $.done())
//获取活动信息

function playgame() {
    return new Promise(async (resolve) => {
        let score = parseInt(Math.random() * 50, 10) + 100
        that.log("上传分数：" + score)
        let options = taskPostUrl("mcxhd_brandcity_reportGame", `{"token":"jd17919499fb7031e5","score":${score}}`)
        $.post(options, async (err, resp, data) => {
            try {
                if (err) {
                    that.log(`${JSON.stringify(err)}`);
                    that.log(`${$.name} API请求失败，请检查网路重试`);
                } else {
                    data = JSON.parse(data);
                    //     that.log(data)
                    if (data.retCode === "200" && data.result) {
                        gift = data.result.gift
                        that.log("上传成功")
                        if (gift) {
                            that.log("获得" + gift.jbeanNum + "京豆")
                            $.beans += gift.jbeanNum
                        }
                    } else {
                        that.log(data.retMessage)
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

function getaskList() {
    return new Promise(async (resolve) => {
        let options = taskPostUrl("mcxhd_brandcity_taskList", `{"lat":"33.255229","lng":"107.147022","token":"jd17919499fb7031e5"}`)

        $.post(options, async (err, resp, data) => {
            try {
                if (err) {
                    that.log(`${JSON.stringify(err)}`);
                    that.log(`${$.name} API请求失败，请检查网路重试`);
                } else {
                    data = JSON.parse(data);
                    //     that.log(data)

                    if (data.result.tasks && data.result.tasks.length == 4) {
                        $.taskList = data.result.tasks
                        codeList[codeList.length] = data.result.tasks[3].subItem[0].itemToken
                    } else {
                      that.log(data)
                        that.log(data.retMessage)
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

function doTask(functionid,body) {
    return new Promise(async (resolve) => {
        let options = taskPostUrl(functionid,body )
        $.post(options, async (err, resp, data) => {
            try {
                if (err) {
                    that.log(`${JSON.stringify(err)}`);
                    that.log(`${$.name} API请求失败，请检查网路重试`);
                } else {
               //     that.log(data)
                    data = JSON.parse(data);
                    if (data.retCode === "200") {
                        that.log("任务成功啦~")
                    } else {
                    
                        that.log(data)
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





function taskPostUrl(functionid, body) {
    return {
        url: `https://api.m.jd.com/?client=wh5&clientVersion=1.0.0&functionId=${functionid}&body=${body}&appid=${functionid==="qryViewkitCallbackResult"?"":"publicUseApi"}&_t=${Date.now()}`,
        body: "",
        headers: {
            Accept: "application/json,text/plain, */*",
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "zh-cn",
            Connection: "keep-alive",
            Cookie: cookie,
            Host: "api.m.jd.com",
            Referer: "https://h5.m.jd.com/babelDiy/Zeus/31LKY9sFZZUvj5aN1TrZUE4V6xzQ/index.html?itemToken=43xA_erJaPow6F86M-TPd4qDWtScVpq8Ic-Xv4e0CQu-AoXanOJaHrqaPyBlbQkCd0kw&lng=107.147022&lat=33.255229&sid=e5150a3fdd017952350b4b41294b145w&un_area=27_2442_2444_31912",
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
            $.msg($.name, '', '请勿随意在BoxJs输入框修改内容\n建议通过脚本去获取cookie')
            return [];
        }
    }
}


