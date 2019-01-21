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
from datetime import timedelta, datetime
from calendar import monthrange, month_name
from sqlalchemy.sql import text
from turbogears.database import session
from prcommon.model.clippings.clipping import Clipping
from prcommon.model.lookups import QuestionTypes, DateRanges
from prcommon.model.clippings.questions import Question
from prcommon.model.common import BaseSql
from prcommon.model import Client, Issue
from prcommon.model.clippings.dashboardsettings import DashboardSettings
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

    List_Customer_Data_Count = """SELECT COUNT(*)
            FROM userdata.clippings AS c
            JOIN internal.clippingstype AS ct ON ct.clippingstypeid = c.clippingstypeid """
    List_ClippingsType_Data_Date = """SELECT COUNT(c.clippingstypeid) as count, ct.clippingstypedescription as name, c.clippingstypeid as id, c.clip_source_date as date
            FROM userdata.clippings AS c
            JOIN internal.clippingstype AS ct ON ct.clippingstypeid = c.clippingstypeid """
    List_ClippingsType_Data = """SELECT COUNT(c.clippingstypeid) as count, ct.clippingstypedescription as name, c.clippingstypeid as id
            FROM userdata.clippings AS c
            JOIN internal.clippingstype AS ct ON ct.clippingstypeid = c.clippingstypeid """
    List_Client_Data = """SELECT COUNT(c.clippingid) as count,
            CASE
            WHEN c.clientid is null THEN 'No Client'
            WHEN c.clientid is not null THEN cl.clientname
            END AS name
            FROM userdata.clippings AS c
            LEFT OUTER JOIN userdata.client AS cl ON cl.clientid = c.clientid"""
    List_Client_Data_Date = """SELECT COUNT(c.clippingid) as count, c.clip_source_date as date,
            CASE
            WHEN c.clientid is null THEN 'No Client'
            WHEN c.clientid is not null THEN cl.clientname
            END AS name
            FROM userdata.clippings AS c
            LEFT OUTER JOIN userdata.client AS cl ON cl.clientid = c.clientid"""
    List_Issue_Data = """SELECT COUNT(c.clippingid) as count,
            CASE
            WHEN i.name is null THEN 'No Issue'
            WHEN i.name is not null THEN i.name
            END AS name
            FROM userdata.clippings AS c
            LEFT OUTER JOIN userdata.clippingsissues AS ci ON ci.clippingid = c.clippingid
            LEFT OUTER JOIN userdata.issues AS i ON i.issueid = ci.issueid"""
    List_Issue_Data_Date = """SELECT COUNT(c.clippingid) as count,
            CASE
            WHEN i.name is null THEN 'No Issue'
            WHEN i.name is not null THEN i.name
            END AS name,
            c.clip_source_date as date
            FROM userdata.clippings AS c
            LEFT OUTER JOIN userdata.clippingsissues AS ci ON ci.clippingid = c.clippingid
            LEFT OUTER JOIN userdata.issues AS i ON i.issueid = ci.issueid"""

    List_QuestionList_Data = """SELECT questiontext, answertext as name, count(answer_answerid)
            FROM userdata.questions as q
            LEFT OUTER JOIN userdata.questionanswers AS qa ON q.questionid = qa.questionid
            LEFT OUTER JOIN userdata.clippingsanalysis AS ca ON (ca.questionid = q.questionid AND ca.answer_answerid = qa.questionanswerid)
            LEFT OUTER JOIN userdata.clippings AS c on c.clippingid = ca.clippingid"""
    List_QuestionList_Data_Dates = """SELECT questiontext, answertext as name, count(answer_answerid), c.clip_source_date as date, answer_answerid
            FROM userdata.questions as q
            LEFT OUTER JOIN userdata.questionanswers AS qa ON q.questionid = qa.questionid
            LEFT OUTER JOIN userdata.clippingsanalysis AS ca ON (ca.questionid = q.questionid AND ca.answer_answerid = qa.questionanswerid)
            LEFT OUTER JOIN userdata.clippings AS c on c.clippingid = ca.clippingid"""

    List_QuestionMultiple_Data = """SELECT questiontext, answertext as name, count(answer_boolean)
            FROM userdata.questions as q
            LEFT OUTER JOIN userdata.questionanswers AS qa ON q.questionid = qa.questionid
            LEFT OUTER JOIN userdata.clippingsanalysis AS ca ON (ca.questionid = q.questionid AND ca.answer_answerid = qa.questionanswerid)
            LEFT OUTER JOIN userdata.clippings AS c on c.clippingid = ca.clippingid"""
    List_QuestionMultiple_Data_Dates = """SELECT questiontext, answertext as name, count(answer_boolean), c.clip_source_date as date, answer_boolean
            FROM userdata.questions as q
            LEFT OUTER JOIN userdata.questionanswers AS qa ON q.questionid = qa.questionid
            LEFT OUTER JOIN userdata.clippingsanalysis AS ca ON (ca.questionid = q.questionid AND ca.answer_answerid = qa.questionanswerid)
            LEFT OUTER JOIN userdata.clippings AS c on c.clippingid = ca.clippingid"""

    List_QuestionBoolean_Data = """SELECT questiontext,
            CASE 
            WHEN answer_boolean = 1 THEN 'YES' 
            WHEN answer_boolean = 0 then 'NO' 
            END AS name,
            count(answer_boolean)
            FROM userdata.questions as q
            LEFT OUTER JOIN userdata.clippingsanalysis AS ca ON ca.questionid = q.questionid
            LEFT OUTER JOIN userdata.clippings AS c on c.clippingid = ca.clippingid"""
    List_QuestionBoolean_Data_Dates = """SELECT questiontext,
            CASE 
            WHEN answer_boolean = 1 THEN 'YES' 
            WHEN answer_boolean = 0 then 'NO' 
            END AS name,
            count(answer_boolean), c.clip_source_date as date
            FROM userdata.questions as q
            LEFT OUTER JOIN userdata.clippingsanalysis AS ca ON ca.questionid = q.questionid 
            LEFT OUTER JOIN userdata.clippings AS c on c.clippingid = ca.clippingid"""

    List_QuestionNumeric_Data = """SELECT questiontext, answer_number as name,
            count(answer_number)
            FROM userdata.questions as q
            LEFT OUTER JOIN userdata.clippingsanalysis AS ca ON ca.questionid = q.questionid
            LEFT OUTER JOIN userdata.clippings AS c on c.clippingid = ca.clippingid"""
    List_QuestionNumeric_Data_Dates = """SELECT questiontext, answer_number as name,
            count(answer_number), c.clip_source_date as date
            FROM userdata.questions as q
            LEFT OUTER JOIN userdata.clippingsanalysis AS ca ON ca.questionid = q.questionid 
            LEFT OUTER JOIN userdata.clippings AS c on c.clippingid = ca.clippingid"""

    List_QuestionCurrency_Data = """SELECT questiontext, answer_currency as name,
            count(answer_currency)
            FROM userdata.questions as q
            LEFT OUTER JOIN userdata.clippingsanalysis AS ca ON ca.questionid = q.questionid
            LEFT OUTER JOIN userdata.clippings AS c on c.clippingid = ca.clippingid"""
    List_QuestionCurrency_Data_Dates = """SELECT questiontext, answer_currency as name,
            count(answer_currency), c.clip_source_date as date
            FROM userdata.questions as q
            LEFT OUTER JOIN userdata.clippingsanalysis AS ca ON ca.questionid = q.questionid 
            LEFT OUTER JOIN userdata.clippings AS c on c.clippingid = ca.clippingid"""

    @staticmethod
    def get_dashboard_chart_data(params):

        retdata = []
        ds = session.query(DashboardSettings).filter(DashboardSettings.customerid == params['customerid']).all()
        for i in range(0,len(ds)):
            params['windowid'] = ds[i].windowid
            params['dashboardsettingsmodeid'] = ds[i].dashboardsettingsmodeid
            params['dashboardsettingsstandardid'] = ds[i].dashboardsettingsstandardid
            params['dashboardsettingsstandardsearchbyid'] = ds[i].dashboardsettingsstandardsearchbyid
            params['questionid'] = ds[i].questionid
            params['questiontypeid'] = ds[i].questiontypeid
            params['daterangeid'] = ds[i].daterangeid
            params['chartviewid'] = ds[i].chartviewid
            params['by_client'] = ds[i].by_client
            params['by_issue'] = ds[i].by_issue
            params['groupbyid'] = ds[i].groupbyid
            params['clientid'] = ds[i].clientid
            params['issueid'] = ds[i].issueid

            data = ClippingsChartGeneral.get_chart_data2(params)
            retdata.append(data)

        return retdata

    @staticmethod
    def get_chart_data2(params):
        "Chart data builder"
        whereclause = BaseSql.addclause('', 'c.customerid = :customerid')
        groupbyclause = ''
        clippingstypes_db_trans = {NEWS_DB_DESC:3,
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
        command = ""
        clientname = ""
        issuename = ""
        message = "No results found"
        startdate = datetime.date(datetime.today())
        if params['daterangeid'] == 1:
            params["from_date"] = (datetime.date(datetime.today()) - timedelta(days=7)).strftime('%Y-%m-%d')
            startdate = datetime.date(datetime.today()) - timedelta(days=7)
        elif params['daterangeid'] == 2:
            params['from_date'] = (datetime.date(datetime.today()) - timedelta(days=14)).strftime('%Y-%m-%d')
            startdate = datetime.date(datetime.today()) - timedelta(days=14)
        elif params['daterangeid'] == 3:
            params['from_date'] = (datetime.date(datetime.today()) - timedelta(days=21)).strftime('%Y-%m-%d')
            startdate = datetime.date(datetime.today()) - timedelta(days=21)
        elif params['daterangeid'] == 4:
            params['from_date'] = (datetime.date(datetime.today()) - timedelta(days=30)).strftime('%Y-%m-%d')
            startdate = datetime.date(datetime.today()) - timedelta(days=30)
        elif params['daterangeid'] == 5:
            params['from_date'] = (datetime.date(datetime.today()) - timedelta(days=90)).strftime('%Y-%m-%d')
            startdate = datetime.date(datetime.today()) - timedelta(days=90)
        elif params['daterangeid'] == 6:
            params['from_date'] = (datetime.date(datetime.today()) - timedelta(days=180)).strftime('%Y-%m-%d')
            startdate = datetime.date(datetime.today()) - timedelta(days=180)
        elif params['daterangeid'] == 7:
            params['from_date'] = (datetime.date(datetime.today()) - timedelta(days=270)).strftime('%Y-%m-%d')
            startdate = datetime.date(datetime.today()) - timedelta(days=270)
        elif params['daterangeid'] == 8:
            params['from_date'] = (datetime.date(datetime.today()) - timedelta(days=365)).strftime('%Y-%m-%d')
            startdate = datetime.date(datetime.today()) - timedelta(days=365)
        whereclause = BaseSql.addclause(whereclause, 'c.clip_source_date >= :from_date')
        datetext = session.query(DateRanges.daterangedescription).filter(DateRanges.daterangeid == params['daterangeid']).scalar()
        
        if 'by_client' in params and params['by_client']:
            if 'clientid' in params and params['clientid'] != -1 and params['clientid'] != '-1':
                whereclause = BaseSql.addclause(whereclause, 'c.clientid = :clientid')
                clientname = session.query(Client.clientname).filter(Client.clientid == params['clientid']).scalar()
        if 'by_issue' in params and params['by_issue']:
            if 'issueid' in params and params['issueid'] != -1 and params['issueid'] != '-1':
                whereclause = BaseSql.addclause(whereclause, 'EXISTS (SELECT clippingsissueid FROM userdata.clippingsissues AS ci WHERE ci.issueid = :issueid AND ci.clippingid = c.clippingid)')
                issuename = session.query(Issue.name).filter(Issue.issueid == params['issueid']).scalar()
        if params['dashboardsettingsmodeid'] == 1:
            if params['dashboardsettingsstandardid'] == 1:
                if params['dashboardsettingsstandardsearchbyid'] == 1:
                    groupbyclause = 'GROUP BY ct.clippingstypedescription, c.clippingstypeid'
                    if params['chartviewid'] == 1:
                        command = ClippingsChartGeneral.List_ClippingsType_Data + whereclause + groupbyclause
                        results = Clipping.sqlExecuteCommand(text(command), params, BaseSql.ResultAsEncodedDict)
                        if results:
                            retdata = ClippingsChartGeneral.standard_noclips_view(results)
                    elif params['chartviewid'] == 2 or params['chartviewid'] == 3:
                        groupbyclause += ', c.clip_source_date'
                        command = ClippingsChartGeneral.List_ClippingsType_Data_Date + whereclause + groupbyclause
                        results = Clipping.sqlExecuteCommand(text(command), params, BaseSql.ResultAsEncodedDict)
                        if results:
                            retdata = ClippingsChartGeneral.standard_noclips_dates_view(results, startdate, params['groupbyid'], params['chartviewid'])
                    retdata['title'] = ClippingsChartGeneral.get_chart_title(datetext, "Channels", "Clippings Count", clientname, issuename) if results \
                        else ClippingsChartGeneral.get_chart_title(datetext, "Channels", "Clippings Count", clientname, issuename, message)
                elif params['dashboardsettingsstandardsearchbyid'] == 2:
                    if params['chartviewid'] == 1:
                        command = ClippingsChartGeneral.List_ClippingsType_Data + whereclause + groupbyclause
                        retdata = _standard_circulation_view(results)
                    elif params['chartviewid'] == 2 or params['chartviewid'] == 3:
                        retdata = _standard_circulation_dates_view(results)
                    retdata['title'] = ClippingsChartGeneral.get_chart_title(datetext, "Channels", "Circulation", clientname, issuename) if results \
                        else ClippingsChartGeneral.get_chart_title(datetext, "Channels", "Circulation", clientname, issuename, message)
                elif params['dashboardsettingsstandardsearchbyid'] == 3:
                    if params['chartviewid'] == 1:
                        groupbyclause = 'GROUP BY ct.clippingstypedescription, c.clippingstypeid'
                        command = ClippingsChartGeneral.List_ClippingsType_Data + whereclause + groupbyclause
                        retdata = _standard_eva_view(results)
                    elif params['chartviewid'] == 2 or params['chartviewid'] == 3:
                        retdata = _standard_eva_dates_view(results)
                    retdata['title'] = ClippingsChartGeneral.get_chart_title(datetext, "Channels", "EVA", clientname, issuename) if results \
                        else ClippingsChartGeneral.get_chart_title(datetext, "Channels", "EVA", clientname, issuename, message)
            elif params['dashboardsettingsstandardid'] == 2:
                if params['dashboardsettingsstandardsearchbyid'] == 1:
                    groupbyclause = 'GROUP BY c.clientid, cl.clientname'
                    if params['chartviewid'] == 1:
                        command = ClippingsChartGeneral.List_Client_Data + whereclause + groupbyclause
                        results = Clipping.sqlExecuteCommand(text(command), params, BaseSql.ResultAsEncodedDict)
                        if results:
                            retdata = ClippingsChartGeneral.standard_noclips_view(results)
                    elif params['chartviewid'] == 2 or params['chartviewid'] == 3:
                        groupbyclause += ', c.clip_source_date'
                        command = ClippingsChartGeneral.List_Client_Data_Date + whereclause + groupbyclause
                        results = Clipping.sqlExecuteCommand(text(command), params, BaseSql.ResultAsEncodedDict)
                        if results:
                            retdata = ClippingsChartGeneral.standard_noclips_dates_view(results, startdate, params['groupbyid'], params['chartviewid'])
                    retdata['title'] = ClippingsChartGeneral.get_chart_title(datetext, "Clients", "Clippings Count", clientname, issuename) if results \
                        else ClippingsChartGeneral.get_chart_title(datetext, "Clients", "Clippings Count", clientname, issuename, message)
                elif params['dashboardsettingsstandardsearchbyid'] == 2:
                    if params['chartviewid'] == 1:
                        command = ClippingsChartGeneral.List_ClippingsType_Data + whereclause + groupbyclause
                        _standard_client_circulation_view(params)
                    elif params['chartviewid'] == 2 or params['chartviewid'] == 3:
                        _standard_client_circulation_dates_view(params)
                    retdata['title'] = ClippingsChartGeneral.get_chart_title(datetext, "Clients", "Circulation", clientname, issuename) if results \
                        else ClippingsChartGeneral.get_chart_title(datetext, "Clients", "Circulation", clientname, issuename, message)
                elif params['dashboardsettingsstandardsearchbyid'] == 3:
                    if params['chartviewid'] == 1:
                        command = ClippingsChartGeneral.List_ClippingsType_Data + whereclause + groupbyclause
                        _standard_client_eva_view(params)
                    elif params['chartviewid'] == 2 or params['chartviewid'] == 3:
                        _standard_client_eva_dates_view(params)
                    retdata['title'] = ClippingsChartGeneral.get_chart_title(datetext, "Clients", "EVA", clientname, issuename) if results \
                        else ClippingsChartGeneral.get_chart_title(datetext, "Clients", "EVA", clientname, issuename, message)
            elif params['dashboardsettingsstandardid'] == 3:
                if params['dashboardsettingsstandardsearchbyid'] == 1:
                    groupbyclause = 'GROUP BY i.name'
                    if params['chartviewid'] == 1:
                        command = ClippingsChartGeneral.List_Issue_Data + whereclause + groupbyclause
                        results = Clipping.sqlExecuteCommand(text(command), params, BaseSql.ResultAsEncodedDict)
                        if results:
                            retdata = ClippingsChartGeneral.standard_noclips_view(results)
                    elif params['chartviewid'] == 2 or params['chartviewid'] == 3:
                        groupbyclause += ', c.clip_source_date'
                        command = ClippingsChartGeneral.List_Issue_Data_Date + whereclause + groupbyclause
                        results = Clipping.sqlExecuteCommand(text(command), params, BaseSql.ResultAsEncodedDict)
                        if results:
                            retdata = ClippingsChartGeneral.standard_noclips_dates_view(results, startdate, params['groupbyid'], params['chartviewid'])
                    retdata['title'] = ClippingsChartGeneral.get_chart_title(datetext, "Issues", "Clippings Count", clientname, issuename) if results \
                        else ClippingsChartGeneral.get_chart_title(datetext, "Issues", "Clippings Count", clientname, issuename, message)
                elif params['dashboardsettingsstandardsearchbyid'] == 2:
                    if params['chartviewid'] == 1:
                        command = ClippingsChartGeneral.List_ClippingsType_Data + whereclause + groupbyclause
                        _standard_issue_circulation_view(params)
                    elif params['chartviewid'] == 2 or params['chartviewid'] == 3:
                        _standard_issue_circulation_dates_view(params)
                    retdata['title'] = ClippingsChartGeneral.get_chart_title(datetext, "Issues", "Circulation", clientname, issuename) if results \
                        else ClippingsChartGeneral.get_chart_title(datetext, "Issues", "Circulation", clientname, issuename, message)
                elif params['dashboardsettingsstandardsearchbyid'] == 3:
                    if params['chartviewid'] == 1:
                        command = ClippingsChartGeneral.List_ClippingsType_Data + whereclause + groupbyclause
                        _standard_issue_eva_view(params)
                    elif params['chartviewid'] == 2 or params['chartviewid'] == 3:
                        _standard_issue_eva_dates_view(params)
                    retdata['title'] = ClippingsChartGeneral.get_chart_title(datetext, "Issues", "EVA", clientname, issuename) if results \
                        else ClippingsChartGeneral.get_chart_title(datetext, "Issues", "EVA", clientname, issuename, message)
        elif params['dashboardsettingsmodeid'] == 2:
            questiontypeid = session.query(QuestionTypes).filter(QuestionTypes.questiontypeid == params['questiontypeid']).scalar()
            questiontext = session.query(Question.questiontext).filter(Question.questionid == params['questionid']).scalar()
            whereclause = BaseSql.addclause(whereclause, 'ca.questionid = :questionid')
            if params['questiontypeid'] == 1 or params['questiontypeid'] == 4 or params['questiontypeid'] == 5:
                groupbyclause = 'GROUP BY questiontext, name'
            elif params['questiontypeid'] == 2:
                groupbyclause = 'GROUP BY questiontext, name, answer_answerid'
            elif params['questiontypeid'] == 6:
                whereclause = BaseSql.addclause(whereclause, ' answer_boolean = 1')
                groupbyclause = 'GROUP BY questiontext, name, answer_boolean'

            if params['chartviewid'] == 1:
                if params['questiontypeid'] == 1:
                    command = ClippingsChartGeneral.List_QuestionBoolean_Data + whereclause + groupbyclause
                elif params['questiontypeid'] == 2:
                    command = ClippingsChartGeneral.List_QuestionList_Data + whereclause + groupbyclause
                elif params['questiontypeid'] == 4:
                    command = ClippingsChartGeneral.List_QuestionNumeric_Data + whereclause + groupbyclause
                elif params['questiontypeid'] == 5:
                    command = ClippingsChartGeneral.List_QuestionCurrency_Data + whereclause + groupbyclause
                elif params['questiontypeid'] == 6:
                    command = ClippingsChartGeneral.List_QuestionMultiple_Data + whereclause + groupbyclause
                results = Clipping.sqlExecuteCommand(text(command), params, BaseSql.ResultAsEncodedDict)
                if results:
                    retdata = ClippingsChartGeneral.standard_noclips_view(results)
                retdata['title'] = ClippingsChartGeneral.get_chart_title(datetext, "Q: %s" %(questiontext), "Clippings Count", clientname, issuename) if results \
                    else ClippingsChartGeneral.get_chart_title(datetext, "Q: %s" %(questiontext), "Clippings Count", clientname, issuename, message)
                #retdata = _questions_view(results)
            elif params['chartviewid'] == 2 or params['chartviewid'] == 3:
                groupbyclause = '%s, c.clip_source_date ' %groupbyclause
                if params['questiontypeid'] == 1:
                    command = ClippingsChartGeneral.List_QuestionBoolean_Data_Dates + whereclause + groupbyclause
                elif params['questiontypeid'] == 2:
                    command = ClippingsChartGeneral.List_QuestionList_Data_Dates + whereclause + groupbyclause
                elif params['questiontypeid'] == 4:
                    command = ClippingsChartGeneral.List_QuestionNumeric_Data_Dates + whereclause + groupbyclause
                elif params['questiontypeid'] == 5:
                    command = ClippingsChartGeneral.List_QuestionCurrency_Data_Dates + whereclause + groupbyclause
                elif params['questiontypeid'] == 6:
                    command = ClippingsChartGeneral.List_QuestionMultiple_Data_Dates + whereclause + groupbyclause
                results = Clipping.sqlExecuteCommand(text(command), params, BaseSql.ResultAsEncodedDict)
                if results:
                    retdata = ClippingsChartGeneral.standard_noclips_dates_view(results, startdate, params['groupbyid'], params['chartviewid'])
                retdata['title'] = ClippingsChartGeneral.get_chart_title(datetext, "Q: %s" %(questiontext), "Clippings Count", clientname, issuename) if results \
                    else ClippingsChartGeneral.get_chart_title(datetext, "Q: %s" %(questiontext), "Clippings Count", clientname, issuename, message)

        retdata['windowid'] = params['windowid']
        retdata['chartviewid'] = params['chartviewid']
        return retdata

    @staticmethod
    def get_chart_data(params):
        "Chart data builder"

        whereclause = BaseSql.addclause('', 'c.customerid = :customerid')
        inclause = ''
        groupbyclause = 'GROUP BY c.clippingstypeid, ct.clippingstypedescription'

        clippingstypes_db_trans = {NEWS_DB_DESC:3,
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
                command = ClippingsChartGeneral.List_ClippingsType_Data_Date + whereclause + groupbyclause
                results = Clipping.sqlExecuteCommand(
                    text(command),
                    params,
                    BaseSql.ResultAsEncodedDict)
                _get_data_lineschart(retdata, results, daterange, clippingstypes_db_trans)

            if params['charttype'] == 'pie':
                command = ClippingsChartGeneral.List_ClippingsType_Data + whereclause + groupbyclause
                results = Clipping.sqlExecuteCommand(
                    text(command),
                    params,
                    BaseSql.ResultAsEncodedDict)
                _get_data_piechart(results, retdata, clippingstypes_db_trans)

        return retdata

    @staticmethod
    def get_questions_chart_data(params):
        "Chart data builder"

        retdata_pie = retdata_lines = {}
        #retdata_pie['data'] = retdata_lines['data'] = {}
        whereclause = BaseSql.addclause('', 'ca.customerid = :customerid')
        whereclause = BaseSql.addclause(whereclause, 'ca.questionid = :questionid')
        command_pie = ""
        command_lines = ""

        if params['questiontypeid'] == 1 or params['questiontypeid'] == 4 or params['questiontypeid'] == 5:
            groupbyclause = 'GROUP BY questiontext, name'
        elif params['questiontypeid'] == 2:
            groupbyclause = 'GROUP BY questiontext, name, answer_answerid'
        elif params['questiontypeid'] == 6:
            groupbyclause = 'GROUP BY questiontext, name, answer_boolean'

        if 'clientid' in params and params['clientid'] != -1 and params['clientid'] != '-1' and params['clientid'] != None:
            whereclause = BaseSql.addclause(whereclause, 'c.clientid = :clientid')
        if 'issueid' in params and params['issueid'] != -1 and params['issueid'] != '-1' and params['issueid'] != None:
            whereclause = BaseSql.addclause(whereclause, 'c.clippingid in (SELECT clippingid FROM userdata.clippingsissues WHERE issueid = :issueid)')
        if 'emailtemplateid' in params and params['emailtemplateid'] != -1 and params['emailtemplateid'] != '-1' and params['emailtemplateid'] != None:
            whereclause = BaseSql.addclause(whereclause, 'c.emailtemplateid = :emailtemplateid')
        if 'statementid' in params and params['statementid'] != -1 and params['statementid'] != '-1' and params['statementid'] != None:
            whereclause = BaseSql.addclause(whereclause, 'c.statementid = :statementid')

        if params['questiontypeid'] == 6:
            whereclause = BaseSql.addclause(whereclause, ' answer_boolean = 1')

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

        #if params['option'] == 1:
        groupbyclause_lines = '%s, c.clip_source_date ' %groupbyclause
        if params['questiontypeid'] == 1:
            command_lines = ClippingsChartGeneral.List_QuestionBoolean_Data_Dates + whereclause + groupbyclause_lines
        elif params['questiontypeid'] == 2:
            command_lines = ClippingsChartGeneral.List_QuestionList_Data_Dates + whereclause + groupbyclause_lines
        elif params['questiontypeid'] == 4:
            command_lines = ClippingsChartGeneral.List_QuestionNumeric_Data_Dates + whereclause + groupbyclause_lines
        elif params['questiontypeid'] == 5:
            command_lines = ClippingsChartGeneral.List_QuestionCurrency_Data_Dates + whereclause + groupbyclause_lines
        elif params['questiontypeid'] == 6:
            command_lines = ClippingsChartGeneral.List_QuestionMultiple_Data_Dates + whereclause + groupbyclause_lines
        #if params['option'] == 0:
        if params['questiontypeid'] == 1:
            command_pie = ClippingsChartGeneral.List_QuestionBoolean_Data + whereclause + groupbyclause
        elif params['questiontypeid'] == 2:
            command_pie = ClippingsChartGeneral.List_QuestionList_Data + whereclause + groupbyclause
        elif params['questiontypeid'] == 4:
            command_pie = ClippingsChartGeneral.List_QuestionNumeric_Data + whereclause + groupbyclause
        elif params['questiontypeid'] == 5:
            command_pie = ClippingsChartGeneral.List_QuestionCurrency_Data + whereclause + groupbyclause
        elif params['questiontypeid'] == 6:
            command_pie = ClippingsChartGeneral.List_QuestionMultiple_Data + whereclause + groupbyclause

        if command_lines != '':
            results_lines = Clipping.sqlExecuteCommand(
                text(command_lines),
                params,
                BaseSql.ResultAsEncodedDict)
            retdata_lines = _get_question_data_lineschart(results_lines, daterange)
        if command_pie != '':
            results_pie = Clipping.sqlExecuteCommand(
                text(command_pie),
                params,
                BaseSql.ResultAsEncodedDict)
            retdata_pie = _get_question_data_piechart(results_pie)

        return dict(pie=retdata_pie, lines=retdata_lines)

    @staticmethod
    def standard_noclips_view(results):
        retdata = {}
        retdata['data'] = {}
        retdata['data']['pie'] = []
        count = 0
        for i in range(0, len(results)):
            count += results[i]['count']
        y = 0
        x = ''
        for i in range(0, len(results)):
            y = results[i]['count']
            x = results[i]['name']
            if count != 0:
                percent = y*100/count
            else:
                percent = 0
            retdata['data']['pie'].append({"label":x, "y":int(y), "tooltip":str(percent)+'% '+results[i]['name'], "value":int(y), "text":'%s(%s)' %(x, int(y)), "legend":x})
        return retdata

    @staticmethod
    def standard_noclips_dates_view(results, startdate, groupbyid, chartviewid):
        retdata = {}
        retdata['data'] = {}
        yaxis = {}
        dayscount = daycount = {}
        weekscount = weekcount = {}
        monthscount = monthcount = {}
        names = []
        desc = []
        startrangedates = 0
        for x in range(0, len(results)):
            if results[x]['name'] not in retdata['data']:
                retdata['data'][results[x]['name']] = {}
                desc.append(results[x]['name'])
                retdata['data'][results[x]['name']]['data'] = []
            if results[x]['name'] not in names:
                names.append(results[x]['name'])

        numberofdays = (datetime.date(datetime.today()) - startdate).days
        if numberofdays == 0:
            numberofdays += 1
        retdata['dates'] = []
        if groupbyid == 2:
            if startdate.weekday() != 0:
                startdate = startdate - timedelta(days=startdate.weekday())
            numberofweeks = int(numberofdays/7)
            weekstartdate = startdate
            maxweek = 0
            for week in range(0, numberofweeks+1):
                for des in desc:
                    yaxis[des] = 0
                    weekscount[week] = {}
                    for name in names:
                        weekscount[week][name] = 0
                for daynumber in range(0, 7):
                    currentdate = weekstartdate + timedelta(days=daynumber)
                    for res in results:
                        if res["date"] == currentdate:
                            weekscount[week][res['name']] = weekscount[week][res['name']] + res['count']
                        yaxis[res['name']] = weekscount[week][res['name']]
                        if weekscount[week][res['name']] > maxweek:
                            maxweek = weekscount[week][res['name']]
                    for des in desc:
                        retdata['data'][des]['data'].append({"x":week, "y":int(yaxis[des]), "labelx" : str(weekstartdate), "tooltip":"Week Commencing %s: %s(%s)" %(str(weekstartdate.strftime("%d/%m/%y")),des, int(yaxis[des]))})
                retdata['dates'].append({"value": week, "label":str(weekstartdate.strftime("%d/%m/%y"))})
                weekstartdate = weekstartdate+timedelta(days=7)
            retdata['maxvalue'] = ClippingsChartGeneral.get_max_sum(weekscount) if chartviewid == 3 else ClippingsChartGeneral.get_max_max(weekscount)
        elif groupbyid == 3:
            if startdate.day != 1:
                startdate = startdate - timedelta(days=(startdate.day-1))
            numberofmonths = int(numberofdays/30) + 1
            monthstartdate = startdate
            maxmonth = 0
            for month in range(0, numberofmonths+1):
                for des in desc:
                    yaxis[des] = 0
                    monthscount[month] = {}
                    for name in names:
                        monthscount[month][name] = 0
                x, currentmonthdays = monthrange(monthstartdate.year, monthstartdate.month)
                for daynumber in range(0, currentmonthdays):
                    currentdate = monthstartdate + timedelta(days=daynumber)
                    for res in results:
                        if res["date"] == currentdate:
                            monthscount[month][res['name']] = monthscount[month][res['name']] + res['count']
                        yaxis[res['name']] = monthscount[month][res['name']]
                        if monthscount[month][res['name']] > maxmonth:
                            maxmonth = monthscount[month][res['name']]
                    for des in desc:
                        retdata['data'][des]['data'].append({"x":month, "y":int(yaxis[des]), "labelx" : str(monthstartdate), "tooltip":"%s(%s)" %(des, int(yaxis[des]))})
                retdata['dates'].append({"value": month, "label":str(month_name[monthstartdate.month])})
                monthstartdate = monthstartdate+timedelta(days=currentmonthdays)
            retdata['maxvalue'] = ClippingsChartGeneral.get_max_sum(monthscount) if chartviewid == 3 else ClippingsChartGeneral.get_max_max(monthscount)
        else:
            maxday = 0
            for daynumber in range(startrangedates, numberofdays+1):
                currentdate = startdate + timedelta(days=daynumber)
                for des in desc:
                    yaxis[des] = 0
                    dayscount[daynumber] = {}
                    for name in names:
                        dayscount[daynumber][name] = 0
                for res in results:
                    if res['date'] == currentdate:
                        dayscount[daynumber][res['name']] = dayscount[daynumber][res['name']] + res['count']
                        yaxis[res['name']] = dayscount[daynumber][res['name']]
                        if dayscount[daynumber][res['name']] > maxday:
                            maxday = dayscount[daynumber][res['name']]
                for des in desc:
                    retdata['data'][des]['data'].append({"x":daynumber, "y":int(yaxis[des]), "labelx" : str(currentdate), "tooltip":"%s: %s(%s)" %(str(currentdate.strftime("%d/%m/%y")), des, int(yaxis[des]))})
                retdata['dates'].append({"value": daynumber, "label":str(currentdate.strftime("%d/%m/%y"))})
            retdata['maxvalue'] = ClippingsChartGeneral.get_max_sum(dayscount) if chartviewid == 3 else max([x['count'] for x in results])
        return retdata
    
    @staticmethod
    def get_chart_title(datetext, option, searchby, clientname, issuename, message=""):
        title = ""
        if clientname != "" and issuename != "":
            title = '%s > %s > %s<br>Client: %s, Issue: %s' %(datetext, option, searchby, clientname, issuename)
        elif clientname != "" and issuename == "":
            title = '%s > %s > %s<br>Client: %s' %(datetext, option, searchby, clientname)
        elif clientname == "" and issuename != "":
            title = '%s > %s > %s<br>Issue: %s' %(datetext, option, searchby, issuename)
        elif clientname == "" and issuename == "":
            title = '%s > %s > %s' %(datetext, option, searchby)
        if message != "":
            title = '%s<br><br><b>%s</b>' %(title, message)
        return title

    @staticmethod
    def get_max_sum(count):
        maxcount = {}
        for x in range(0, len(count)):
            maxcount[x] = sum(count.values()[x].values())
        return max(maxcount.values())

    @staticmethod
    def get_max_max(count):
        maxcount = {}
        for x in range(0, len(count)):
            maxcount[x] = max(count.values()[x].values())
        return max(maxcount.values())

def _get_question_data_lineschart(results_lines, daterange):
    retdata = {}
    retdata['data'] = {}
    yaxis = {}
    startrangedates = 0
    desc = []
    for x in range(0, len(results_lines)):
        if results_lines[x]['name'] not in retdata['data']:
            retdata['data'][results_lines[x]['name']] = {}
            desc.append(results_lines[x]['name'])
            retdata['data'][results_lines[x]['name']]['data'] = []

    if len(results_lines) > 0:
        retdata['maxvalue'] = max([x['count'] for x in results_lines])

    firstclipsdate = min(x['date'] for x in results_lines)
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
        for des in desc:
            yaxis[des] = 0
        for res in results_lines:
            if res['date'] == currentdate:
                yaxis[res['name']] = res['count']
        for des in desc:
            retdata['data'][des]['data'].append({"x":daynumber, "y":int(yaxis[des]), "labelx" : str(currentdate)})
#            retdata['data'][res['name']]['data'].append({"x":daynumber, "y":int(yaxis), "labelx" : str(currentdate)})
        retdata['dates'].append({"value": daynumber, "label":str(currentdate .strftime("%d/%m/%y"))})
    return retdata

def _get_question_data_piechart(results_pie):
    retdata = {}
    retdata['data'] = {}
    retdata['data']['pie'] = []
    count = 0
    for i in range(0, len(results_pie)):
        count += results_pie[i]['count']

    y = 0
    x = ''
    for i in range(0, len(results_pie)):
        y = results_pie[i]['count']
        x = results_pie[i]['name']
        if count != 0:
            percent = y*100/count
        else:
            percent = 0
        retdata['data']['pie'].append({"label":x, "y":int(y), "tooltip":str(percent)+'%', "value":int(y), "text":'%s(%s)' %(x, int(y)), "legend":x})
    return retdata

def _get_data_lineschart(retdata, results, daterange, clippingstypes_db_trans):
    yaxis = {}
    for typedesc in clippingstypes_db_trans:
        retdata['data'][typedesc] = {}
        retdata['data'][typedesc]['data'] = []
    clippingstypeid = ''
    startrangedates = 0

    #maximum value for y axis
    if isinstance(results, list):
        retdata['maxvalue'] = max([x['count'] for x in results])
    elif isinstance(results, dict) and 'count' in results and results['count'] != None:
        retdata['maxvalue'] = results['count']

    firstclipsdate = min(x['date'] for x in results)

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
            if res['date'] == currentdate:
                yaxis[res['name']] = res['count']
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
        for i in range(0, len(results)):
            if typedesc == results[i]['name']:
                y = results[i]['count']
                x = results[i]['name']
        if count != 0:
            percent = y*100/count
        else:
            percent = 0
        retdata['data']['pie'].append({"label":x, "y":int(y), "tooltip":str(percent)+'%', "value":int(y), "text":'%s(%s)' %(x, int(y)), "legend":x, "clippingstypeid":clippingstypes_db_trans[typedesc]})


