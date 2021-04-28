let cookiesArr = [], cookie = '';
let time=0;//延时毫秒
//这个脚本需要用到的是pc端的ck，目前要使用需要去软件中的扫码获取pc端ck那里获取，获取到后不用管那个ck已失效的提示，ck已经复制到剪辑版了，直接粘贴进来就是
cookiesArr=['cookie1','cookie2(依次内推，单账号可删除这个)'];

//店铺Id列表
let shopIds=[];
!(async () => {
    await initShopIds();
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/', {"open-url": "https://bean.m.jd.com/"});
    return;
  }
  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i];
    if (cookie) {
      $.UserName = decodeURIComponent(cookie.match(/unick=(.+?);/) && cookie.match(/unick=(.+?);/)[1])
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = '';
      await  TotalBean();
      if (i+1) that.log(`\n***************开始京东账号${i + 1}【${$.UserName}】***************`)

          for(let shopId of shopIds){
              await getShopGiftInfo(shopId);
              await $.wait(time);
          }
    }
  }
})()
  .catch((e) => $.logErr(e))
  .finally(() => $.done())
async function getShopGiftInfo(shopId){
     return new Promise(resolve => {
        let t=new Date().getTime();
        let tokenstr=''+shopId+''+t;
        let token=stringtoHex(tokenstr);
        const options = {
          url: `https://f-mall.jd.com/shopGift/getShopGiftInfo?token=${token}&_=${t}`,
          headers: {
            "Cookie": cookie,
            "Referer": `https://mall.jd.com/index-${shopId}.html`,
            "Connection": "Keep-Alive",
            "Accept": "*/*",
            "Accept-Language": "zh-cn",
            "User-Agent": "Mozilla/4.0 (compatible; MSIE 9.0; Windows NT 6.1)",
            "Host": "f-mall.jd.com"
          }
        }
        $.get(options, async (err, resp, data) => {
          try {
            if (err) {
              that.log(`\n${$.name}: API查询请求失败 ‼️‼️`)
              $.logErr(err);
            } else {
              data = JSON.parse(data);
              if (data.result=='true'||data.result==true) {
                  let jshop_token=data.jshop_token;
                  let giftList=data.giftList;
                  if(giftList){
                      $.prizeStr='';
                      let vId='';
                      let aId='';
                      for(let gift of giftList){
                          vId=gift.venderId;
                          aId=gift.activityId;
                          if(gift.prizeType==1){
                              $.prizeStr+='优惠券【'+gift.quota+'-'+gift.discount+'】;';
                          }else if(gift.prizeType==4){
                               $.prizeStr+='京豆【'+gift.discount+'】;';
                          }else if(gift.prizeType==6){
                               $.prizeStr+='积分【'+gift.discount+'】;';
                          }else{
                               $.prizeStr+='未知类型【'+gift.discount+'】;';
                          }
                      }
                      await drawShopGiftInfo(vId,aId,jshop_token);
                  }else{
                       that.log('店铺ID【'+shopId+'】:'+data.message);
                  }
              }else{
                  that.log('店铺ID【'+shopId+'】:'+data.message);
              }
            }
          } catch (e) {
            $.logErr(e, resp);
          } finally {
            resolve(data);
          }
        })
    });
}

async function drawShopGiftInfo(vId,aId,jshop_token){
    return new Promise(resolve => {
        let t=new Date().getTime();
        const options = {
          url: `https://f-mall.jd.com/shopGift/drawShopGiftInfo?vId=${vId}&jshop_token=${jshop_token}&aId=${aId}&_=${t}`,
          headers: {
           "Cookie": cookie,
            "Referer": `https://mall.jd.com/index-${vId}.html`,
            "Connection": "Keep-Alive",
            "Accept": "*/*",
            "Accept-Language": "zh-cn",
            "User-Agent": "Mozilla/4.0 (compatible; MSIE 9.0; Windows NT 6.1)",
            "Host": "f-mall.jd.com"
          }
        }
        $.get(options,async  (err, resp, data) => {
          try {
            if (err) {
              that.log(`\n${$.name}: API查询请求失败 ‼️‼️`)
              $.logErr(err);
            } else {
              data = JSON.parse(data);
              if (data.result=='true'||data.result==true) {
                  that.log('店铺ID【'+vId+'】:'+data.message+'\n奖品:'+$.prizeStr);
              }else{
                  that.log('店铺ID【'+vId+'】失败:'+data.message);
              }
            }
          } catch (e) {
            $.logErr(e, resp);
          } finally {
            resolve(data);
          }
        })
    });
}

function stringtoHex(str) {
    var val = "";
    for (var i = 0; i < str.length; i++) {
        if (val == "")
            val = str.charCodeAt(i).toString(16);
        else
            val += str.charCodeAt(i).toString(16);
    }
    return '0x'+val
}

function initShopIds(){
    return new Promise(async resolve => {
    const options = {
      "url": `https://www.tyh52.com/jd/static/shopUrl.txt`,
    }
    $.get(options, (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            data=data+'';
            let shopurls=data.split('\n');
            for(let shopurl of shopurls){
                let shopid=/index-[0-9]*.html/g.exec(shopurl)[0];
                shopid=shopid.replace('index-','').replace('.html','')
                if(shopid){
                    shopIds.push(shopid);
                }
            }
            that.log('获取店铺数据成功，一共获取到'+shopIds.length+'条数据');
          } else {
            that.log(`获取店铺数据失败`)
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
        "User-Agent":"jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"
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