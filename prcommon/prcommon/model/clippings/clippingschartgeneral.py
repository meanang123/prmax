# -*- coding: utf-8 -*-
"""ClippingsChartGeneral"""
#-----------------------------------------------------------------------------
# Name:        clippingschartgeneral.py
# Purpose:
# Author:      Chris Hoy
# Created:     20/4/2015
# Copyright:   (c) 2015
#-----------------------------------------------------------------------------
import logging
from datetime import date, timedelta,datetime
from sqlalchemy.sql import text
from prcommon.model.clippings.clipping import Clipping
from prcommon.model.common import BaseSql
from ttl.tg.validators import DateRangeResult

LOGGER = logging.getLogger("prcommon.model")

NEWS_DB_DESC = 'News'
TWITTER_DB_DESC = 'Twitter'
FACEBOOK_DB_DESC = 'Facebook'
FORUMS_DB_DESC = 'Forums'
BLOGS_DB_DESC = 'Blogs'
INSTAGRAM_DB_DESC = 'Instagram'
YOUTUBE_DB_DESC = 'YouTube'
GOOGLEPLUS_DB_DESC = 'GooglePlus'
TUMBLR_DB_DESC = 'Tumblr'
VKONTAKTE_DB_DESC = 'VKontakte'
CHAT_DB_DESC = 'Chat'

class ClippingsChartGeneral(object):
    """ ClippingsChartGeneral """

    List_Customer_Data = """SELECT COUNT(c.clippingstypeid), c.clippingstypeid, ct.clippingstypedescription, c.clip_source_date
            FROM userdata.clippings AS c
            JOIN internal.clippingstype AS ct ON ct.clippingstypeid = c.clippingstypeid """

    List_Customer_Data_Count = """SELECT COUNT(*)
            FROM userdata.clippings AS c
            JOIN internal.clippingstype AS ct ON ct.clippingstypeid = c.clippingstypeid """

    List_Customer_Data2 = """SELECT COUNT(c.clippingstypeid), c.clippingstypeid, ct.clippingstypedescription
            FROM userdata.clippings AS c
            JOIN internal.clippingstype AS ct ON ct.clippingstypeid = c.clippingstypeid """

    @staticmethod
    def get_chart_data(params):
        "Chart data builder"

        whereclause = BaseSql.addclause('', 'c.customerid = :customerid')
        inclause = ''
        groupbyclause = 'GROUP BY c.clippingstypeid, ct.clippingstypedescription'

        clippingstypes_db_trans={NEWS_DB_DESC:3,
                                 TWITTER_DB_DESC:4,
                                 FACEBOOK_DB_DESC:5,
                                 FORUMS_DB_DESC:6,
                                 BLOGS_DB_DESC:7,
                                 INSTAGRAM_DB_DESC:8,
                                 YOUTUBE_DB_DESC:9,
                                 GOOGLEPLUS_DB_DESC:10,
                                 TUMBLR_DB_DESC:11,
                                 VKONTAKTE_DB_DESC:12,
                                 CHAT_DB_DESC:13
                                 }
        retdata = {}
        retdata['data'] = {}

        if params['charttype']:
            retdata['charttitle'] = 'CHANNELS'

            if "clientid" in params and params['clientid'] != '' and params['clientid'] is not None:
                whereclause = BaseSql.addclause(whereclause, 'c.clientid=:clientid')
                params['clientid'] = int(params['clientid'])

            if 'issueid' in params and params['issueid'] != '' and params['issueid'] is not None:
                whereclause = BaseSql.addclause(whereclause, 'EXISTS (SELECT clippingsissueid FROM userdata.clippingsissues AS ci WHERE ci.issueid = :issueid AND ci.clippingid = c.clippingid)')
                params['issueid'] = int(params['issueid'])

            # tones on the filter
            if params.get("tones", None):
                whereclause = BaseSql.addclause(whereclause, "c.clippingstoneid IN (%s)" % ",".join([str(tone) for tone in params["tones"]]))

            #date range
            daterange = params["daterange"]
            if daterange.option == DateRangeResult.BEFORE:
                params["from_date"] = daterange.from_date
                whereclause = BaseSql.addclause(whereclause, 'c.clip_source_date <= :from_date')
            elif daterange.option == DateRangeResult.AFTER:
                params["from_date"] = daterange.from_date
                whereclause = BaseSql.addclause(whereclause, 'c.clip_source_date >= :from_date')
            elif daterange.option == DateRangeResult.BETWEEN:
                # ABetween
                params["from_date"] = daterange.from_date
                params["to_date"] = daterange.to_date
                whereclause = BaseSql.addclause(whereclause, 'c.clip_source_date BETWEEN :from_date AND :to_date')

            if params['charttype'] == 'lines':
                groupbyclause += ', c.clip_source_date'
                command = ClippingsChartGeneral.List_Customer_Data + whereclause + groupbyclause
                results = Clipping.sqlExecuteCommand(
                    text(command),
                    params,
                    BaseSql.ResultAsEncodedDict)
                _get_data_lineschart(retdata, results, daterange,clippingstypes_db_trans)

            if params['charttype'] == 'pie':
                command = ClippingsChartGeneral.List_Customer_Data2 + whereclause + groupbyclause
                results = Clipping.sqlExecuteCommand(
                    text(command),
                    params,
                    BaseSql.ResultAsEncodedDict)
                _get_data_piechart(results, retdata, clippingstypes_db_trans)

        return retdata

def _get_data_lineschart(retdata, results, daterange, clippingstypes_db_trans):
    yaxis = {}
    for typedesc in clippingstypes_db_trans:
        retdata['data'][typedesc] = {}
        retdata['data'][typedesc]['data'] = []
    clippingstypeid = ''
    startrangedates = 0

    #maximum value for y axis
    retdata['maxvalue'] = max([x['count'] for x in results]) 
    
    firstclipsdate = min(x['clip_source_date'] for x in results)
    
    if daterange.option == 1:
        startdate = firstclipsdate
        numberofdays = (daterange.from_date - firstclipsdate).days
        startrangedates = -1
    else:
        startdate = daterange.from_date - timedelta(days=0)
        numberofdays = (daterange.to_date - daterange.from_date).days
        
    if numberofdays == 0:
        numberofdays += 1
    retdata['dates'] = []

    for daynumber in range(startrangedates, numberofdays+1):
        currentdate = startdate + timedelta(days=daynumber)
        for typedesc in clippingstypes_db_trans:
            yaxis[typedesc] = 0
        for res in results:
            if res['clip_source_date'] == currentdate:
                yaxis[res['clippingstypedescription']] = res['count']
        for typedesc in clippingstypes_db_trans:
            retdata['data'][typedesc]['data'].append({"x":daynumber, "y":int(yaxis[typedesc]), "labelx" : str(currentdate), "clippingstypeid":clippingstypes_db_trans[typedesc]})
        retdata['dates'].append({"value": daynumber, "label":str(currentdate .strftime("%d/%m/%y"))})

def _get_data_piechart(results, retdata, clippingstypes_db_trans):
    retdata['data']['pie'] = []
    count = 0
    for i in range(0, len(results)):
        count += results[i]['count']
    for typedesc in clippingstypes_db_trans:
        y = 0
        x = typedesc
        for i in range (0, len(results)):
            if typedesc == results[i]['clippingstypedescription']:
                y = results[i]['count']
                x = results[i]['clippingstypedescription']
        if count != 0:
            percent = y*100/count
        else:
            percent = 0
        retdata['data']['pie'].append({"label":x, "y":int(y), "tooltip":str(percent)+'%', "value":int(y), "text":'%s(%s)' %(x,int(y)), "legend":x, "clippingstypeid":clippingstypes_db_trans[typedesc]})
