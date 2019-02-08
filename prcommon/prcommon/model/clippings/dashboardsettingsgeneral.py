# -*- coding: utf-8 -*-
"""Dashboard Settings"""
#-----------------------------------------------------------------------------
# Name:        dashboardsettings.py
# Purpose:
# Author:      Stamatia Vatsi
# Created:     11/12/2018
# Copyright:   (c) 2018
#-----------------------------------------------------------------------------
import logging
from datetime import date, timedelta,datetime
from turbogears.database import session
from sqlalchemy.sql import text
from prcommon.model.clippings.dashboardsettings import DashboardSettings
from prcommon.model.common import BaseSql
from ttl.tg.validators import DateRangeResult

LOGGER = logging.getLogger("prcommon.model")


class DashboardSettingsGeneral(object):
    """ Dashboard Settings """


    @staticmethod
    def get_for_edit(customerid,windowid):
        "Get for edit "

        ds = session.query(DashboardSettings).\
            filter(DashboardSettings.customerid == customerid).\
            filter(DashboardSettings.windowid == windowid).scalar()
        if ds:
            return dict(
                windowid=ds.windowid,
                dashboardsettingsmodeid=ds.dashboardsettingsmodeid,
                dashboardsettingsstandardid=ds.dashboardsettingsstandardid,
                dashboardsettingsstandardsearchbyid=ds.dashboardsettingsstandardsearchbyid,
                questionid=ds.questionid,
                questiontypeid=ds.questiontypeid,
                by_client=ds.by_client,
                by_issue=ds.by_issue,
                clientid=ds.clientid,
                issueid=ds.issueid,
                chartviewid=ds.chartviewid,
                daterangeid=ds.daterangeid,
                groupbyid=ds.groupbyid
            )
        else:
            return

    @staticmethod
    def settings_update(params):
        "Update dashboard settings"

        transaction = BaseSql.sa_get_active_transaction()
    
        try:
            ds = session.query(DashboardSettings).\
                filter(DashboardSettings.customerid == params['customerid']).\
                filter(DashboardSettings.windowid == params['windowid']).scalar()
            if not ds:
                ds = DashboardSettings(
                    customerid=params['customerid'],
                    windowid=params['windowid'],
                    dashboardsettingsmodeid=params['dashboardsettingsmodeid'],
                    dashboardsettingsstandardid=params['dashboardsettingsstandardid'],
                    dashboardsettingsstandardsearchbyid=params['dashboardsettingsstandardsearchbyid'],
                    questionid=params['questionid'],
                    questiontypeid=params['questiontypeid'],
                    by_client=params['by_client'],
                    by_issue= params['by_issue'],
                    clientid=params['clientid'],
                    issueid=params['issueid'],
                    chartviewid=params['chartviewid'],
                    daterangeid=params['daterangeid'],
                    groupbyid=params['groupbyid']
                    )
                session.add(ds)
                session.flush()
            else:
                ds.windowid = params['windowid']
                ds.dashboardsettingsmodeid = params['dashboardsettingsmodeid']
                ds.dashboardsettingsstandardid = params['dashboardsettingsstandardid']
                ds.dashboardsettingsstandardsearchbyid = params['dashboardsettingsstandardsearchbyid']
                ds.questionid = params['questionid']
                ds.questiontypeid = params['questiontypeid']
                ds.by_client = params['by_client']
                ds.by_issue = params['by_issue']
                ds.clientid = params['clientid']
                ds.issueid = params['issueid']
                ds.chartviewid = params['chartviewid']
                ds.daterangeid = params['daterangeid']
                ds.groupbyid = params['groupbyid']
                session.add(ds)
                session.flush()
    
            transaction.commit()
        except:
            LOGGER.exception("settings_update")
            try:
                transaction.rollback()
            except:
                pass
            raise
              
    @staticmethod
    def settings_save(params):
        "Save dashboard settings"

        transaction = cls.sa_get_active_transaction()
        try:
            
            ds = DashboardSettings(
                customerid=params['customerid'],
                windowid=params['windowid'],
                dashboardsettingsmodeid=params['dashboardsettingsmodeid'],
                dashboardsettingsstandardid=params['dashboardsettingsstandardid'],
                dashboardsettingsstandardsearchbyid=params['dashboardsettingsstandardsearchbyid'],
                questionid=params['questionid'],
                questiontypeid=params['questiontypeid'],
                by_client=params['by_client'],
                by_issue=params['by_issue'],
                clientid=params['clientid'],
                issueid=params['issueid'],
                chartviewid=params['chartviewid'],
                daterangeid=params['daterangeid'],
                groupbyid=params['groupbyid']
                )
            session.add(ds)
            session.flush()
    
            transaction.commit()
        except:
            LOGGER.exception("settings_save")
            try:
                transaction.rollback()
            except:
                pass
            raise
        
