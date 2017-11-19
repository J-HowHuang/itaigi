# -*- coding: utf-8 -*-
import os

from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import transaction
import xlrd


from 臺灣言語資料庫.資料模型 import 來源表
from 臺灣言語平臺.項目模型 import 平臺項目表
from 臺灣言語資料庫.資料模型 import 版權表


class 佳怡表匯入資料庫:
    資料夾 = '.'
    資料表檔名 = '新台語網站資料表20150320.xlsx'

    def 資料(self):
        這馬所在 = os.path.dirname(os.path.abspath(__file__))
        表格檔 = xlrd.open_workbook(os.path.join(這馬所在, self.資料夾, self.資料表檔名))
        表格 = 表格檔.sheet_by_name('kokgi')
        表格欄位 = {}
        for 第幾個, 資料 in enumerate(表格.row_values(0)):
            表格欄位[資料] = 第幾個
        資料 = []
        for 第幾逝 in range(1, 表格.nrows):
            逝 = 表格.row_values(第幾逝)
            資料.append(
                (逝[表格欄位['台語']], 逝[表格欄位['台羅']], [逝[表格欄位['華語']]],)
            )
        return 資料

    def 來源內容(self):
        return {'名': '臺灣閩南語常用詞辭典', '單位': '中華民國教育部'}


def 走():
    with transaction.atomic():
        版權表.objects.get_or_create(版權='會使公開')
        資料庫 = 佳怡表匯入資料庫()
        公家內容 = {
            '收錄者': 來源表.objects.get_or_create(名='鄉民')[0],
            '來源': 資料庫.來源內容(),
            '版權': '會使公開',
            '語言腔口': settings.MOTHER_TONGUE,
            '著作所在地': '臺灣',
            '著作年': '2014',
        }
        a = 0
        for 漢字, 音標, 華語 in 資料庫.資料():
            a += 1
            print(a)
            種類 = '字詞'
            閩南語內容 = {
                '文本資料': 漢字,
                '種類': 種類,
                '屬性': {'音標': 音標},
            }
            閩南語內容.update(公家內容)
            if len(華語) > 0:
                for 華 in 華語:
                    外語內容 = {
                        '種類': 種類,
                        '外語語言': '華語',
                        '外語資料': 華
                    }
                    外語內容.update(公家內容)
                    try:
                        外語平臺項目 = 平臺項目表.加外語資料(外語內容)
                        外語平臺項目編號 = 外語平臺項目.編號()
                    except ValidationError as 錯誤:
                        外語平臺項目編號 = 錯誤.平臺項目編號
                    文本平臺項目 = 平臺項目表.外語翻母語(外語平臺項目編號, 閩南語內容)
                    文本平臺項目.設為推薦用字()
            else:
                pass
