#-*-coding:utf-8-*-
import requests
import json
import time
import datetime
import re
import base64
import threading
import os
import sys
import execjs 
from Crypto.Cipher import PKCS1_v1_5 as Cipher_pkcs1_v1_5
from Crypto.PublicKey import RSA
from lxml import etree 
from pprint import pprint
import urllib3
import requests.utils, pickle
import argparse
import chardet
import random
#import matplotlib.pyplot as plt 
#import matplotlib.image as mpimg 
urllib3.disable_warnings()
reload(sys) 
sys.setdefaultencoding('utf-8') 
class myThread (threading.Thread):   #继承父类threading.Thread
    def __init__(self,id,func):
        threading.Thread.__init__(self)
        self.id = id
        self.func = func
    def run(self):  
        #print self.id
        self.func(self.id )

class JDG(object):
    """
    京东下单
    """
    def __init__(self):
        self.retry = 10
        self.cookie_dir = 'cookies'
        self.consignee_id_list = []
        self.s = requests.Session()
        self.host = "https://passport.jd.com"
        self.qrcode_url = ""
        self.page_url = self.host + r"/new/login.aspx?ReturnUrl=https%3A%2F%2Fwww.jd.com%2Fallsort.aspx"
        self.is_show_auth_url = self.host + r"/uc/showAuthCode?r=0.4358096930519497&version=2015"
        self.login_service_url=self.host + r'/uc/loginService?uuid={}&ReturnUrl=https%3A%2F%2Fwww.jd.com%2Fallsort.aspx&r=0.6503248905833312&version=2015'
        self.addCartUrl=r'https://cart.jd.com/tproduct?pid={}&rid=0.5520295465112095'
        self.saveAddrUrl = r"https://trade.jd.com/shopping/dynamic/consignee/saveConsignee.action"
        self.getIpUrl=r"https://trade.jd.com/shopping/dynamic/consignee/getAddressJDCodeByIP.action"
        self.setDefaultAddrUrl = "https://trade.jd.com/shopping/dynamic/consignee/setAllDefaultAddress.action"
        self.setNewAddrUrl="https://trade.jd.com/shopping/dynamic/consignee/saveConsignee.action"
        self.submmitUrl="https://trade.jd.com/shopping/order/submitOrder.action"
        self.cookies={}
        self.headers = {
            "User-Agent":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.108 Safari/537.36",
            "Host":"passport.jd.com",
            "Origin":"https://passport.jd.com",
            "Referer":r"https://passport.jd.com/new/login.aspx?ReturnUrl=https%3A%2F%2Fwww.jd.com%2Fallsort.aspx",
        }
    """
    @func:京东登陆接口
    """

    def get_hidden_area(self):
        try:
            req = self.s.get(
                url=self.page_url,
                headers=self.headers,
                            )
            html = req.content
            tree = etree.HTML(html)
            BsGjNzPtJo =tree.xpath('//*[@id="formlogin"]/input[8]/@value')[0]
            self.uuid = tree.xpath('//form[@id="formlogin"]/input[@id="uuid"]/@value')[0]
            self.pubKey = tree.xpath('//form[@id="formlogin"]/input[@id="pubKey"]/@value')[0]
            self.sa_token = tree.xpath('//form[@id="formlogin"]/input[@id="sa_token"]/@value')[0]
            self.qrcode_url = 'https:'+tree.xpath('//img/@src')[1]
            self.auth_code_url = 'https:' + tree.xpath('//*[@id="JD_Verification1"]/@src2')[0]+ '&yys=1516017502528'
            return True
        except Exception,e:
            return False

    def showAuthCode(self,loginName):

        payload = {
            'loginName':loginName
        }
        try:
            req = self.s.post(
                url=self.is_show_auth_url,
                headers=self.headers,
                data=payload,
            )
            self.is_need_verify = json.loads(req.content[1:-1])['verifycode']
            return json.loads(req.content[1:-1])['verifycode']
        except Exception,e:
            return False

    def down_auth_code(self):
        position="code.png"
        data = self.s.get(
            url=self.auth_code_url,
            headers={
                'Host':'authcode.jd.com',
                "User-Agent":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.108 Safari/537.36",
                "Referer":r"https://passport.jd.com/new/login.aspx?ReturnUrl=https%3A%2F%2Fwww.jd.com%2Fallsort.aspx"
            },
            # cookies={
            #     'cookie':'__jda=122270672.1516017477169750465946.1516017477.1516017477.1516017477.1; __jdb=122270672.1.1516017477169750465946|1.1516017477; __jdc=122270672; __jdv=122270672|direct|-|none|-|1516017477171; _jrda=1; _jrdb=1516017477392; wlfstk_smdl=j135ds54qzokg9ylw0ml3c47st897b2r; __jdu=1516017477169750465946; 3AB9D23F7A4B3C9B=ZRI44VBYUSMPN4NDVW7FGWMLWSUPVAIHYWBRDHQUP6CQYA6J3J5JA646L7OTIGKO7FAW5WJJEGEZGABSPMDBG4SPD4'
            # },
            verify=False,
            allow_redirects=False
        )
        with open(position,'wb') as f:
            f.write(data.content)

    def batch_down_auth_code(self,num):
        self.get_hidden_area()
        while num:
            num-=1
            if not os.path.exists('verifys'):
                os.makedirs('verifys')
            position=os.path.join('verifys', str(time.time())+'.png')
            data = self.s.get(
                url=self.auth_code_url,
                headers={
                    'Host':'authcode.jd.com',
                    "User-Agent":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.108 Safari/537.36",
                    "Referer":r"https://passport.jd.com/new/login.aspx?ReturnUrl=https%3A%2F%2Fwww.jd.com%2Fallsort.aspx"
                },
                cookies={
                    'cookie':'__jda=122270672.1516017477169750465946.1516017477.1516017477.1516017477.1; __jdb=122270672.1.1516017477169750465946|1.1516017477; __jdc=122270672; __jdv=122270672|direct|-|none|-|1516017477171; _jrda=1; _jrdb=1516017477392; wlfstk_smdl=j135ds54qzokg9ylw0ml3c47st897b2r; __jdu=1516017477169750465946; 3AB9D23F7A4B3C9B=ZRI44VBYUSMPN4NDVW7FGWMLWSUPVAIHYWBRDHQUP6CQYA6J3J5JA646L7OTIGKO7FAW5WJJEGEZGABSPMDBG4SPD4'
                },
                verify=False,
                allow_redirects=False
            )
            with open(position,'wb') as f:
                f.write(data.content)

    def login(self,loginName,pwd):
        if self.is_need_verify:
            authcode = raw_input("请输入验证码:".decode('utf8').encode('gbk'))
        else:
            authcode=""
        format_key = "-----BEGIN PUBLIC KEY-----\n"+self.pubKey+'\n'+"-----END PUBLIC KEY-----"
        rsakey = RSA.importKey(format_key)
        cipher = Cipher_pkcs1_v1_5.new(rsakey)
        rsa_pwd = base64.b64encode(cipher.encrypt(pwd))
        # print rsa_pwd
        payload = {
            'uuid':self.uuid,
            'eid':'ZRI44VBYUSMPN4NDVW7FGWMLWSUPVAIHYWBRDHQUP6CQYA6J3J5JA646L7OTIGKO7FAW5WJJEGEZGABSPMDBG4SPD4',
            'fp':'ad8b7bd38e611b85d498a3022deae1e2',
            '_t':'_t',
            'loginType':'c',
            'loginname':loginName,
            'nloginpwd':rsa_pwd,
            'chkRememberMe':'',
            'authcode':authcode,
            'pubKey':self.pubKey,
            'sa_token':self.sa_token,
        }
        req = self.s.post(
            url=self.login_service_url.format(self.uuid),
            headers = self.headers,
            data = payload
        )
        result = json.loads(req.content[1:-1])
        nflag = True if result.has_key("success") else False
        if not nflag:
            if self.retry<0:
                print u"登录失败,验证码输入次数已达最大限制!你的智商已经告别JDG了..."
                return False
            self.retry-=1
            result.pop('_t')
            error = result.values()[0]
            if error!=u"请输入验证码":
                print error
            if error==u"页面已失效，请重新访问":
                os.remove(os.path.join(self.cookie_dir,loginName))
            if error==u"账户名与密码不匹配，请重新输入":
                return False
            self.showAuthCode(loginName)
            self.down_auth_code()
            self.login(loginName,pwd)
        else:

            if not os.path.exists(self.cookie_dir):
                os.makedirs(self.cookie_dir)
            with open(os.path.join(self.cookie_dir,loginName), 'w') as f:
                pickle.dump(requests.utils.dict_from_cookiejar(self.s.cookies), f)
        return nflag

    def get_consignee_list(self):
        url="https://cd.jd.com/usual/address?callback=a&_=1516287024034"   
        try:
            req = self.s.get(
                url=url,
                headers={
                    'Host':'cd.jd.com',
                    "User-Agent":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.108 Safari/537.36",
                    "Referer":r"https://item.jd.com/831713.html"
                },
                #cookies=self.cookies
                verify=False,
                allow_redirects=False
            )
            false=False
            null=None
            true=True
            consignee_list = (eval(req.content[2:-1]) )
            for index, ele in enumerate(consignee_list): 
                self.consignee_id_list.append(ele['id'])
                print "*"*30
                print u"地址ID:"+str(ele['id']),u"用户名:"+ele['name'].decode('gbk').encode('utf8'),u"手机号:"+ele['mobile'].decode('gbk').encode('utf8'),u"地址:"+ele['fullAddress'].decode('gbk').encode('utf8')
                print "*"*30
            return True
        except Exception,e:
            return False

    def guodu(self,id,count):
        url="https://cart.jd.com/gate.action?rd=1233&"+"f=3&pid="+id+"&ptype=1&pcount="+str(count)+ "&callback=?"
        headers = {
            "User-Agent":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.108 Safari/537.36",
            "Host":"cart.jd.com",
            "Origin":"https://cart.jd.com",
            "Referer":r"https://cart.jd.com/addToCart.html?rcd=1&pid={}&pc=1&eb=1&gg=1&rid=1516025095018&em=".format(id),
        }
        try:
            req = self.s.get(
                url=url,
                headers=headers,
            )
            result = json.loads(req.content[2:-1])
            print result
            if result['isLogin']==1 and result['flag']==True:
                return True
            else:
                return False
        except Exception,e:
            return False

    def get_coupon_pc(self,role_key):
        url="https://a.jd.com/indexAjax/getCoupon.html"

        payload = {
            "callback":"a",
            "key":role_key,
            "type":1,
            "_":int(time.time())
        }
        headers = {
            "User-Agent":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.108 Safari/537.36",
            "Host":"a.jd.com",
            "Referer":"https://a.jd.com",
        }
        req = self.s.get(
            url=url,
            headers=headers,
            #data=payload,
            params=payload,
        )
        code = req.content
        print code

    def get_jd_server_time(self):
        url="https://a.jd.com/ajax/queryServerData.html?r=0.8643386550514414"
        headers = {
            "User-Agent":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.108 Safari/537.36",
            "Host":"a.jd.com",
            "Referer":"https://a.jd.com",
        }
        req = self.s.get(
            url=url,
            headers=headers,
        )
        timestamp =  req.json()['serverTime']
        timeArray = datetime.datetime.fromtimestamp(timestamp / 1000.0)
        self.deny = req.elapsed.total_seconds()
        print timeArray,req.elapsed.total_seconds()
        self.otherStyleTime = timeArray
        return self.otherStyleTime
        #print otherStyleTime

    def setInterval(self,time='2088-01-22 09:33:59.800000'):
        end_time = datetime.datetime.strptime(time,"%Y-%m-%d %H:%M:%S.%f")
        start_time = self.otherStyleTime
        cha = (end_time-start_time).total_seconds()
        return cha

    def buy(self):
        #print self.cookies
        payload = {
            "overseaPurchaseCookies":"",
            "submitOrderParam.sopNotPutInvoice":True,
            "submitOrderParam.trackID":"1x5OsB5Uc4KwvcpMedXTwbOJg9capaT64xa6jrGnJyaXNRUt5qWuKSHMOlr8qPhri4KDPNO5un7oaGRlaIJhlkzV0fwoK-AFvWGZaW6aZ8e8",
            "submitOrderParam.ignorePriceChange":0,
            "submitOrderParam.btSupport":0,
            "submitOrderParam.eid":"ZRI44VBYUSMPN4NDVW7FGWMLWSUPVAIHYWBRDHQUP6CQYA6J3J5JA646L7OTIGKO7FAW5WJJEGEZGABSPMDBG4SPD4",
            "submitOrderParam.fp":"ad8b7bd38e611b85d498a3022deae1e2",
            "riskControl":"D0E404CB705B9732205CFE39D3957A375E4EDF37439D534786D82F876FFC967A313C27FCDDBEC994"
        }
        req = self.s.post(
            url=self.submmitUrl,
            headers = {
                "User-Agent":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.108 Safari/537.36",
                "Host":"trade.jd.com",
                "Origin":"https://trade.jd.com",
                "Referer":r"https://trade.jd.com/shopping/order/getOrderInfo.action?rid=1516030671463",
            },
            data = payload
        )
        #self.cookies=req.cookies
        pprint(req.json())
        return req.json()

    def select_all_cart(self):
        url="https://cart.jd.com/selectAllItem.action"
        headers = {
            "User-Agent":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.108 Safari/537.36",
            "Host":"cart.jd.com",
            "Origin":"https://cart.jd.com",
            "Referer":r"https://cart.jd.com/cart.action?r=0.8578266298758266",
        }
        payload = {
            't':'0',
            'outSkus':'',
            'random':0.1994484591699408,
            'locationId':'10-698-45815-52315'
        }
        try:
            req = self.s.post(
                url=url,
                headers=headers,
                data=payload
            )
            return json.loads(req.content)['sortedWebCartResult']['success']
        except Exception,e:
            return False

    def batch_remove_cart(self):
        url="https://cart.jd.com/batchRemoveSkusFromCart.action"
        headers = {
            "User-Agent":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.108 Safari/537.36",
            "Host":"cart.jd.com",
            "Origin":"https://cart.jd.com",
            "Referer":r"https://cart.jd.com/cart.action?r=0.8578266298758266",
        }
        payload = {
            't':'0',
            'outSkus':'',
            'random':0.1994484591699408,
            'locationId':'10-698-45815-52315'
        }
        try:
            req = self.s.post(
                url=url,
                headers=headers,
                data=payload
            )
            return json.loads(req.content)['sortedWebCartResult']['success']
        except Exception,e:
            return False

    def down_qr_code(self):
        position="qrcode.jpg"
        data = self.s.get(
            url=self.qrcode_url,
            headers={
                #'Host':'authcode.jd.com',
                "User-Agent":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.108 Safari/537.36",
                #"Referer":r"https://passport.jd.com/new/login.aspx?ReturnUrl=https%3A%2F%2Fwww.jd.com%2Fallsort.aspx"
            },
            #cookies=self.cookies
            verify=False,
            allow_redirects=False
        )
        with open(position,'wb') as f:
            f.write(data.content) 

    def save_consignee(self,consignee_id=None):
        """保存收获地址"""

        if consignee_id==None:
            if self.consignee_id_list==[]:
                return False
            else:
                consignee_id = random.choice(self.consignee_id_list)
        payload = {
            "consigneeParam.id":consignee_id,
            "consigneeParam.type":1,
            "consigneeParam.commonConsigneeSize":len(self.consignee_id_list),
            "consigneeParam.isUpdateCommonAddress":0,
            "consigneeParam.giftSenderConsigneeName":"",
            "consigneeParam.giftSendeConsigneeMobile":"",
            "consigneeParam.noteGiftSender":False,
            "consigneeParam.isSelfPick":False,
            "consigneeParam.selfPickOptimize":0,
            "consigneeParam.pickType":0
        }
        req = self.s.post(
            url=self.saveAddrUrl,
            data=payload,
            headers = {
                "User-Agent":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.108 Safari/537.36",
                "Host":"trade.jd.com",
                "Origin":"https://trade.jd.com",
                "Referer":r"https://trade.jd.com/shopping/order/getOrderInfo.action?rid=1516025710579",
            },
            allow_redirects=False
        )
        return True
        # return req.json()['success']

    def delete_consignee(self, consignee_id=None):
        """删除收货人地址"""
        all_list = []
        actionUrl = "https://trade.jd.com/shopping/dynamic/consignee/deleteConsignee.action"
        if consignee_id==None:
            if self.consignee_id_list==[]:
                return True
            else:
                all_list =self.consignee_id_list
        else:
            all_list.append(consignee_id)
        try:

            for consignee_id in all_list:
                payload = {
                    "consigneeParam.id":consignee_id,
                }
                req = self.s.post(
                    url=actionUrl,
                    data=payload,
                    headers = {
                        "User-Agent":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.108 Safari/537.36",
                        "Host":"trade.jd.com",
                        "Origin":"https://trade.jd.com",
                        "Referer":r"https://trade.jd.com/shopping/order/getOrderInfo.action?rid=1516025710579",
                    },
                    allow_redirects=False
                )
                print req.content
            return True
        except Exception,e:
            return False

    def set_all_default_address(self, id):
        """ 设置默认收货地址"""
        req = self.s.post(
            url=self.setDefaultAddrUrl,
            headers = {
                "User-Agent":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.108 Safari/537.36",
                "Host":"trade.jd.com",
                "Origin":"https://trade.jd.com",
                "Referer":r"https://trade.jd.com/shopping/order/getOrderInfo.action?rid=1516025710579",
            },
            data = {
                "consigneeParam.id":id
            }
        )
        return req.json()

    
    def save_Pay(self, payId=4):
        """保存支付方式 1货到付款 4.在线支付"""
        actionUrl = "https://trade.jd.com/shopping/dynamic/payAndShip/getAdditShipment.action"
        payload = {
            "paymentId": payId,
            "shipParam.reset311" : 0,
            "resetFlag":0000000000,
            "shipParam.onlinePayType":0,
            "typeFlag":1,
            "promiseTagType":""
        }
        headers = {
            "User-Agent":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.108 Safari/537.36",
            "Host":"trade.jd.com",
            "Origin":"https://trade.jd.com",
            "Referer":r"https://trade.jd.com/shopping/order/getOrderInfo.action?rid=1516025710579",
        },
        req = self.s.post(
            url=actionUrl,
            data=payload,
        )
        return True

    def show_coupon_skuList(self):
        """显示优惠券的可用或不可用商品列表"""
        pass

    def yuyue(self,id):
        print id
        headers = {
            'Host':'yushou.jd.com',
            'Referer':'https://item.jd.com/{}.html',
            'User-Agent':'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.108 Safari/537.36'
        }
        url="https://yushou.jd.com/youshouinfo.action?callback=a&sku={}".format(id)
        req = self.s.get(
            url=url,
            headers=headers,
            allow_redirects=False,
        )
        print req.content[2:-2]
        url =  'https:' + json.loads(req.content[2:-2])['url']
        req = self.s.get(
            url=url,
            headers=headers,
            allow_redirects=False
        )
        return 1
    
    def qianggou(self,id):
        payload = {
            "orderParam.name":"",
            "orderParam.addressDetail":"",
            "orderParam.mobile":"",
            "orderParam.email":"",
            "orderParam.provinceId":"",
            "orderParam.cityId":"",
            "orderParam.countyId":"",
            "orderParam.townId":"",
            "orderParam.paymentType":4,
            "orderParam.password":"",
            "orderParam.invoiceTitle":4,
            "orderParam.invoiceContent":-1,
            "orderParam.invoiceCompanyName":"",
            "orderParam.invoiceTaxpayerNO":"",
            "orderParam.usualAddressId":"",
            "skuId":id,
            "num":1,
            "orderParam.provinceName":"",
            "orderParam.cityName":"",
            "orderParam.countyName":"",
            "orderParam.townName":"",
            "orderParam.codTimeType":3,
            "orderParam.mobileKey":"",
            "eid":"ZRI44VBYUSMPN4NDVW7FGWMLWSUPVAIHYWBRDHQUP6CQYA6J3J5JA646L7OTIGKO7FAW5WJJEGEZGABSPMDBG4SPD4",
            "fp":"ad8b7bd38e611b85d498a3022deae1e2",
        }
        url="https://marathon.jd.com/"+"seckill/submitOrder.action?skuId="+id+"&vid="
        req = self.s.post(
            url=url,
            headers = {
                'Host':'marathon.jd.com',
                'Referer':'https://item.jd.com/{}.html',
                'User-Agent':'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.108 Safari/537.36'
            },
            json=payload,
            allow_redirects=False,
            verify=False,
        )
        print req.content

    def get_nick_name(self):
        url="https://passport.jd.com/user/petName/getUserInfoForMiniJd.action?callback=a&_=1516114500944"
        headers = {
            'Host':'passport.jd.com',
            'Referer':'https://i.jd.com/user/info',
            'User-Agent':'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.108 Safari/537.36'
        }
        req = self.s.get(
            url=url,
            headers=headers,
            #allow_redirects=False
        )
        return json.loads(req.content[2:-2])["realName"]

    def get_ip_addr(self):
        import time
        req = self.s.post(
            url=self.getIpUrl,
            cookies=self.cookies,
            headers = {
                "User-Agent":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.108 Safari/537.36",
                "Host":"trade.jd.com",
                "Origin":"https://trade.jd.com",
                "Referer":r"https://trade.jd.com/shopping/dynamic/consignee/editConsignee.action?isOverSea=1&t="+str(int(time.time())),
            }
        )
        self.cookies=req.cookies
        #print req.json()
        return req.json()

    def sku_notify(self,id,price):
        action_url = "https://skunotify.jd.com/priceOrderSubMvc/priceSub.action"
        payload = {
            'hopePrice':price,
            'receiverInfo.receiver':'xx',
            'receiverInfo.receicerPhoneNo':'xx',
            'receiverInfo.address':'',
            'receiverInfo.id':'xx',
            'receiverInfo.addressType':1,
            'receiverInfo.area':'xx',
            'receiverInfo.payway':4,
            'validTime':'THREE_MONTH',
            'skuId':id,
            'subChannel':1,
            'pin':'xx',
        }
        req = self.s.post(
            url=action_url,
            headers={
                'Host':'skunotify.jd.com',
                'Origin':'https://skunotify.jd.com',
                'Referer':'https://skunotify.jd.com/pricenotify.html?skuId={}&pin=xx&webSite=1&origin=1&source=1&nocache=1516882679849&t=1516882680093'.format(id),
                'User-Agent':'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.108 Safari/537.36'
            },
            data = payload
        )
        result = json.loads(req.content)
        print result['msg']

    def setNewAddr(self,id):
        payload = {
            "consigneeParam.id":id,
            "consigneeParam.type":None,
            "consigneeParam.commonConsigneeSize":12,
            "consigneeParam.isUpdateCommonAddress":0,
            "consigneeParam.giftSenderConsigneeName":"",
            "consigneeParam.giftSendeConsigneeMobile":"",
            "consigneeParam.noteGiftSender":False,
            "consigneeParam.isSelfPick":0,
            "consigneeParam.selfPickOptimize":1,
            "consigneeParam.pickType":0,
        }
        req = self.s.post(
            url=self.setNewAddrUrl,
            cookies=self.cookies,
            headers = {
                "User-Agent":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.108 Safari/537.36",
                "Host":"trade.jd.com",
                "Origin":"https://trade.jd.com",
                "Referer":r"https://trade.jd.com/shopping/order/getOrderInfo.action?rid=1516025710579",
            },
            data = payload
        )
        self.cookies=req.cookies
        #print req.json()
        return req.json()

    def check_cookies(self,loginName):
        if os.path.exists(os.path.join(self.cookie_dir,loginName)):
            with open(os.path.join(self.cookie_dir,loginName)) as f:
                cookies = requests.utils.cookiejar_from_dict(pickle.load(f))
                self.s.cookies = cookies
                nick_name = self.get_nick_name()
                if nick_name:
                    return True
        return False

    def batch_notify(self,loginName,pwd,price):
        """批量预约没卵用,每日限制次数,乖乖爬虫"""
        pass
        
    def miaosha(self,loginName,pwd,itime,skuId,count,type,retry,payId):
        self.retry = retry
        is_succ_login = False
        is_valid_cookie = self.check_cookies(loginName)
        if not is_valid_cookie:
            print u"cookie不存在或者已过期，正重新登录"
            self.get_hidden_area()
            self.showAuthCode(loginName)
            self.down_auth_code()
            is_succ_login = self.login(loginName,pwd)
            if not is_succ_login:
                print u"身份认证失败,请重新登录客户端"
                return False
        print u"身份认证成功"
        self.sku_notify(skuId)
        self.get_consignee_list()

        # self.delete_consignee('138258896')

        is_succ_select = self.select_all_cart()
        if not is_succ_select:
            print u"选择购物车全部商品失败"
        else:
            print u"选择购物车全部商品成功" 

        is_succ_remove = self.batch_remove_cart()
        if not is_succ_remove:
            print u"清空购物车失败"
        else:
            print u"清空购物车成功" 
        if type==0:
            is_succ_add_cart = self.guodu(skuId,count)
            if not is_succ_add_cart:
                print u"添加购物车失败"
            else:
                print u"添加购物车成功"
            self.save_consignee()
            self.save_Pay(payId)
            jd_time = self.get_jd_server_time()
            cha = self.setInterval(itime)
            if cha>0:
                time.sleep(cha)

            self.buy()
        if type==1:
            self.yuyue(skuId)
            jd_time = self.get_jd_server_time()
            cha = self.setInterval(itime)
            time.sleep(cha)
            self.qianggou(skuId)

    def getArgsParse(self):
        pass

class JDWAP(object):
    def __init__(self):
        self.login_page_url = r'https://plogin.m.jd.com/user/login.action?appid=100&kpkey=&returnurl=https%3A%2F%2Fm.jd.com%3Findexloc%3D1%26sid%3Dc0bd65ec5b718789208ac442b3b4515b'
        self.s = requests.Session()

    def get_hidden_area(self):
        headers = {
            'Host':'plogin.m.jd.com',
            'Referer':'https://m.jd.com/',
            'Upgrade-Insecure-Requests':'1',
            'User-Agent':'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36',
        }
        req = self.s.get(self.login_page_url,headers =headers )
        html = req.content
        str_rsaString = re.findall("str_rsaString = '(\w+)'",html)[0]
        str_kenString  = re.findall("str_kenString = '(\w+)'",html)[0]
        func_dat = re.findall("function getDat.+}",html)[0]
        md5_func_body = open('md5.js', 'rb').read()
        ctx = execjs.compile(md5_func_body+func_dat)
        dat = ctx.call("getDat", 1, 2)
        wlfstk_datk = ctx.call("getDat", 1, 2)
        eid = "G5RAFGQEPTD5LSTEHDS6JFM7QCUNXVL6CXSKDFKEHMFDGUJ2HK7OJGW7OFCASW2Z7IA5ZGIWMMEVWQK5RF3JF54UIM"
        fp = "169ff3dcb60ab5e10aa2124f24591ec3"
        token = "GTFMP4NVRIQB37DCCQ4XRUUYMKMUEFULS3FZF4GGXZWH6URADGT3DAJPHCCDWRGGPTHCFRP2QOLH4"
        risk_jd = {
            'eid':eid,
            'fp':fp,
            'token':token,
        }

    def main(self,loginName,pwd):
        obj = self.get_hidden_area()

        nflag = self.showAuthCode('')
        if nflag==True:
            self.down_auth_code(obj['auth_code_url'])
            authcode = str(input())
        else:
            authcode=""

        is_login = self.login(loginName,pwd,authcode,obj)
        while not is_login:
            obj = self.get_hidden_area()

            nflag = self.showAuthCode('')
            if nflag==True:
                self.down_auth_code(obj['auth_code_url'])
                authcode = str(input())
            else:
                authcode=""

            is_login = self.login(loginName,pwd,authcode,obj)
        self.get_nick_name()
if __name__ == "__main__":

    parser = argparse.ArgumentParser(description=u"JD PC端秒杀工具,此版本支持加车和抢购模式",
                                        prog="JDG",)
    parser.add_argument("-v","--version", action='version', version='%(prog)s 1.0',help=u"JDG版本信息")
    parser.add_argument("-u","--username",type=str, required=True, help=u"JD用户名(邮箱,手机号,用户名)")
    parser.add_argument("-p","--password",required=True,  help=u"JD密码")
    parser.add_argument("-r","--retry",required=False,  type=int, help=u"JD验证码重试次数,默认为10次",default=10)
    parser.add_argument("-d","--sku",required=True,  help=u"JD商品ID(商品链接里面的数字编号)")
    parser.add_argument("-t","--time", help=u"JD商品秒杀时间 格式为2018-11-11 11:59:59.999000(默认当前时间)")
    parser.add_argument("-c","--count", help=u"JD购买商品数量(默认为1,除非特别说明可多个商品,否则请默认)", default=1)   
    parser.add_argument("-P","--pay", help=u"JD购买商品支付方式(1 货到付款,4 在线付款)", default=4)   
    parser.add_argument("-m", "--mode", help=u"JD秒杀模式，0 加车, 1 抢购,默认为加车",action="count", default=0)
    args = parser.parse_args()
    loginName=args.username
    pwd=args.password
    sku_id = args.sku #秒杀商品id
    count=args.count #商品数量,默认为 1.秒杀模式一般只能买一个,如果批量购买则可以修改值
    itime = args.time if args.time   else  datetime.datetime.fromtimestamp(time.time()).strftime("%Y-%m-%d %H:%M:%S.%f") #秒杀时间
    type = args.mode #加车模式为 0,预约抢购为 1
    retry = args.retry
    pay = args.pay
    role_key="0271DFD6890D3B60ACB8BA8A9E49BEB1BB0B558C96AD56812B4F52B2D5C63807EC726E1540808082260CF15CB0106C0C5C47DA11349BD74D3B841B45B7BC2F8DD920054329F1A6FD87534BE421F989A5A4DD553836E0D01739F45F9CF6024D84"
    #0271DFD6890D3B60ACB8BA8A9E49BEB1BB0B558C96AD56812B4F52B2D5C63807EC726E1540808082260CF15CB0106C0C5C47DA11349BD74D3B841B45B7BC2F8DD920054329F1A6FD87534BE421F989A5A4DD553836E0D01739F45F9CF6024D84
    #print u"请选择PC端登陆模式"
    #print u"<1>: 用户名密码登陆"
    #print u"<2>: 二维码扫描登陆"
    #login_type=raw_input("请输入对应编号: ".decode('utf-8').encode('gbk'))
    jd = JDG()
    # jd.batch_down_auth_code(180)
    # jd.miaosha(loginName,pwd,itime,sku_id,count,type,retry,args)
    jd.batch_notify(loginName,pwd,1)
