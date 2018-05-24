# -*- coding: utf-8 -*-
""" Clean up database """
#-----------------------------------------------------------------------------
# Name:        dataclean.py
# Purpose:	   Clean up database from suspended/inactive customers
#
# Author:
#
# Created:     May 2018
# Copyright:   (c) 2018
#-----------------------------------------------------------------------------

from sqlalchemy import MetaData, Table, text, or_, and_, distinct, not_
from turbogears import config
from turbogears.database import metadata, mapper, session, config
import sys
import simplejson
from ttl.model import BaseSql
from prcommon.model.outlet import Outlet
from prcommon.model.customer.customergeneral import Customer
from prcommon.model.seopressreleases import SEORelease
from prcommon.model.client import Client
from prcommon.model.emails import EmailTemplates
from prcommon.model.newsroom.clientnewsroom import ClientNewsRoom
from prcommon.model.newsroom.clientnewsroomimage import ClientNewsRoomImage
from prcommon.model.newsroom.clientnewsroomcustumlinks import ClientNewsRoomCustumLinks
from prcommon.model.newsroom.clientnewsroomcontactdetails import ClientNewsRoomContactDetails
from prcommon.model.crm import ContactHistory
from prcommon.model.collateral import Collateral, ECollateral
from prcommon.model.interests import Interests, OutletInterestView, EmployeeInterestView, InterestGroups
from datetime import datetime, timedelta, date

import prcommon.Constants as Constants

import logging
LOGGER = logging.getLogger("prcommon.model")

class DataClean(object):
    """Clean prmax database """

    def start_service(self):

        fromdate1 = date.today() - timedelta(days = 365*2)
        fromdate2 = date.today() - timedelta(days = 365*3)
        customers_todelete = session.query(Customer.customerid).\
            outerjoin(SEORelease, SEORelease.customerid == Customer.customerid).\
            filter(or_(and_(Customer.customerstatusid == 3, SEORelease.published < fromdate2), 
                       Customer.licence_expire < fromdate2,  
                       (and_(Customer.licence_expire > fromdate2, 
                             Customer.licence_expire < fromdate1, 
                             SEORelease.published < fromdate2)))).distinct().all()
                #filter(Customer.customerid > 1800).distinct().all()
                #filter(Customer.customerid == 1134).all()

        print 'start'
        print len(customers_todelete)
        counter = 0
        for customerid in customers_todelete:
            counter += 1
            session.begin()
            try:

                session.execute(text('DELETE FROM internal.emailfooter WHERE customerid = :customerid'), {'customerid': customerid}, Customer)
                session.execute(text('DELETE FROM internal.emailheader WHERE customerid = :customerid'), {'customerid': customerid}, Customer)
                session.execute(text('DELETE FROM internal.emaillayout WHERE customerid = :customerid'), {'customerid': customerid}, Customer)
                session.execute(text('DELETE FROM internal.interesttypes WHERE customerid = :customerid'), {'customerid': customerid}, Customer)
                session.execute(text('DELETE FROM internal.labels WHERE customerid = :customerid'), {'customerid': customerid}, Customer)
                session.execute(text('DELETE FROM internal.prmaxcustomerinfo WHERE customerid = :customerid'), {'customerid': customerid}, Customer)
                session.execute(text('DELETE FROM internal.promotionused WHERE customerid = :customerid'), {'customerid': customerid}, Customer)
                session.execute(text('DELETE FROM internal.reporttemplates WHERE customerid = :customerid'), {'customerid': customerid}, Customer)
                session.execute(text('DELETE FROM internal.tasktypes WHERE customerid = :customerid'), {'customerid': customerid}, Customer)
                session.execute(text('DELETE FROM userdata.advancefeatureslist WHERE customerid = :customerid'), {'customerid': customerid}, Customer)
                session.execute(text('DELETE FROM userdata.documents WHERE customerid = :customerid'), {'customerid': customerid}, Customer)
                session.execute(text('DELETE FROM userdata.exclusionlist WHERE customerid = :customerid'), {'customerid': customerid}, Customer)
                session.execute(text('DELETE FROM userdata.issues WHERE customerid = :customerid'), {'customerid': customerid}, Customer)
                session.execute(text('DELETE FROM userdata.briefingnotesstatus WHERE customerid = :customerid'), {'customerid': customerid}, Customer)
                session.execute(text('DELETE FROM userdata.projects WHERE customerid = :customerid'), {'customerid': customerid}, Customer)
                session.execute(text('DELETE FROM userdata.questions WHERE customerid = :customerid'), {'customerid': customerid}, Customer)
                session.execute(text('DELETE FROM userdata.questionscope WHERE customerid = :customerid'), {'customerid': customerid}, Customer)
                session.execute(text('DELETE FROM userdata.setindex WHERE customerid = :customerid'), {'customerid': customerid}, Customer)
                session.execute(text('DELETE FROM userdata.statements WHERE customerid = :customerid'), {'customerid': customerid}, Customer)
                session.execute(text('DELETE FROM userdata.tasks WHERE ref_customerid = :customerid'), {'customerid': customerid}, Customer)
                session.execute(text('DELETE FROM userdata.useractions WHERE customerid = :customerid'), {'customerid': customerid}, Customer)

                clientnewsrooms = session.query(ClientNewsRoom.newsroomid).filter(ClientNewsRoom.customerid == customerid).all()
                for newsroomid in clientnewsrooms:
                    session.execute(text('DELETE FROM userdata.clientnewsroomcustumlinks WHERE newsroomid = :newsroomid'), {'newsroomid': newsroomid}, Customer)
                    session.execute(text('DELETE FROM userdata.clientnewsroomimage WHERE newsroomid = :newsroomid'), {'newsroomid': newsroomid}, Customer)
                    session.execute(text('DELETE FROM userdata.clientnewroomcontactdetails WHERE newsroomid = :newsroomid'), {'newsroomid': newsroomid}, Customer)
                session.flush()		
                session.execute(text('DELETE FROM userdata.clientnewsroom WHERE customerid = :customerid'), {'customerid': customerid}, Customer)
                session.execute(text('DELETE FROM userdata.clippings WHERE customerid = :customerid'), {'customerid': customerid}, Customer)
                session.execute(text('DELETE FROM userdata.clippingsanalysis WHERE customerid = :customerid'), {'customerid': customerid}, Customer)
                session.execute(text('DELETE FROM userdata.clippingsanalysistemplate WHERE customerid = :customerid'), {'customerid': customerid}, Customer)
                session.execute(text('DELETE FROM userdata.customersolidmediaprofiles WHERE customerid = :customerid'), {'customerid': customerid}, Customer)
                session.execute(text('DELETE FROM userdata.customersolidmedia WHERE customerid = :customerid'), {'customerid': customerid}, Customer)


                contacthistory = session.query(ContactHistory.contacthistoryid).filter(ContactHistory.ref_customerid == customerid).all()
                for contacthistoryid in contacthistory:
                    session.execute(text('DELETE FROM userdata.contacthistoryhistory WHERE contacthistoryid = :contacthistoryid'), {'contacthistoryid': contacthistoryid}, Customer)
                    session.execute(text('DELETE FROM userdata.contacthistoryissues WHERE contacthistoryid = :contacthistoryid'), {'contacthistoryid': contacthistoryid}, Customer)
                    session.execute(text('DELETE FROM userdata.contacthistoryresponses WHERE contacthistoryid = :contacthistoryid'), {'contacthistoryid': contacthistoryid}, Customer)

                session.execute(text('DELETE FROM userdata.contacthistoryuserdefine WHERE customerid = :customerid'), {'customerid': customerid}, Customer)
                session.execute(text('DELETE FROM userdata.contacthistory WHERE customerid = :customerid'), {'customerid': customerid}, Customer)

                session.execute(text('DELETE FROM userdata.distributiontemplates WHERE customerid = :customerid'), {'customerid': customerid}, Customer)
                session.execute(text('DELETE FROM userdata.collateral WHERE customerid = :customerid'), {'customerid': customerid}, Customer)
                session.execute(text('DELETE FROM userdata.searchsession WHERE customerid = :customerid'), {'customerid': customerid}, Customer)
                session.execute(text('DELETE FROM public.advancefeaturesinterests WHERE customerid = :customerid'), {'customerid': customerid}, Customer)
                session.execute(text('DELETE FROM public.advancefeatures WHERE customerid = :customerid'), {'customerid': customerid}, Customer)
                session.execute(text('DELETE FROM public.customeremailserver WHERE customerid = :customerid'), {'customerid': customerid}, Customer)


                outlets = session.query(Outlet).filter(Outlet.customerid == customerid).all()
                nbr = 0
                for outlet in outlets:
                    nbr += 1
                    session.execute(text('SELECT outlet_delete(:outletid)'), {'outletid':outlet.outletid}, Outlet)
                    if nbr % 50 == 0:
                        session.commit()
                        session.begin()
                        print('%s: %5d' % (customerid, nbr))

                session.execute(text('DELETE FROM public.employeeinterests WHERE customerid = :customerid'), {'customerid': customerid}, Customer)
                session.execute(text('DELETE FROM public.outletinterests WHERE customerid = :customerid'), {'customerid': customerid}, Customer)
                session.execute(text('DELETE FROM public.employeeprmaxroles WHERE customerid = :customerid'), {'customerid': customerid}, Customer)
                session.execute(text('DELETE FROM public.outletcustomers WHERE customerid = :customerid'), {'customerid': customerid}, Customer)
                session.execute(text('DELETE FROM public.outletcoverage WHERE customerid = :customerid'), {'customerid': customerid}, Customer)
                session.execute(text('DELETE FROM public.outletpostcodes WHERE customerid = :customerid'), {'customerid': customerid}, Customer)
                session.execute(text('DELETE FROM public.employeecustomers WHERE customerid = :customerid'), {'customerid': customerid}, Customer)

                interests = session.query(Interests.interestid).filter(Interests.customerid == customerid).all()
                for interestid in interests:
                    session.execute(text('DELETE FROM public.outletinterests WHERE interestid = :interestid'), {'interestid': interestid}, Customer)
                    session.execute(text('DELETE FROM public.employeeinterests WHERE interestid = :interestid'), {'interestid': interestid}, Customer)

                session.execute(text('DELETE FROM public.interests WHERE customerid = :customerid'), {'customerid': customerid}, Customer)
                session.execute(text('DELETE FROM public.employees WHERE customerid = :customerid'), {'customerid': customerid}, Customer)
                session.execute(text('DELETE FROM public.contacts WHERE customerid = :customerid'), {'customerid': customerid}, Customer)
                session.execute(text('DELETE FROM public.communications WHERE customerid = :customerid'), {'customerid': customerid}, Customer)
                session.execute(text('DELETE FROM public.outlets WHERE customerid = :customerid'), {'customerid': customerid}, Customer)

                #delete clients that are not linked with an SEO
                clients = [row.clientid for row in session.query(Client.clientid).\
                           filter(Client.customerid == customerid).all()]
                clients_seo = [row.clientid for row in session.query(SEORelease.clientid).\
                               filter(SEORelease.customerid == customerid).\
                               filter(SEORelease.clientid.in_(clients)).distinct().all()]
                clients_todelete = []
                if clients and clients_seo:
                    clients_todelete = (list(set(clients) - set(clients_seo)))
                for clientid in clients_todelete:
                    session.execute(text('DELETE FROM userdata.client WHERE customerid = :customerid AND clientid = :clientid'), 
                                    {'customerid': customerid, 'clientid':clientid}, Customer)

                #transaction = session.begin(subtransactions=True)
                #delete distributions that are not linked with an SEO
                emailtemplates = [row.emailtemplateid for row in session.query(EmailTemplates.emailtemplateid).\
                                  filter(EmailTemplates.customerid == customerid).all()]
                emailtemplates_seo = [row.emailtemplateid for row in session.query(SEORelease.emailtemplateid).\
                                      filter(SEORelease.customerid == customerid).\
                                      filter(SEORelease.emailtemplateid.in_(emailtemplates)).distinct().all()]

                for emailtemplateid in emailtemplates:
                    session.execute(text("DELETE FROM userdata.emailtemplatesattachements WHERE emailtemplateid = :emailtemplateid"), {'emailtemplateid':emailtemplateid}, Customer)
                    session.execute(text("DELETE FROM userdata.emailtemplateslinkthrough WHERE emailtemplateid = :emailtemplateid"), {'emailtemplateid':emailtemplateid}, Customer)
                    session.execute(text("DELETE FROM userdata.emailtemplatelist WHERE emailtemplateid = :emailtemplateid"), {'emailtemplateid':emailtemplateid}, Customer)
                    session.execute(text("UPDATE userdata.emailtemplates SET listid = null WHERE emailtemplateid = :emailtemplateid"), {'emailtemplateid':emailtemplateid}, Customer)

                emailtemplates_todelete = []
                if emailtemplates and emailtemplates_seo:
                    emailtemplates_todelete = (list(set(emailtemplates) - set(emailtemplates_seo)))
                for emailtemplateid in emailtemplates_todelete:
                    session.execute(text('DELETE FROM userdata.emailtemplates WHERE customerid = :customerid AND emailtemplateid = :emailtemplateid'), 
                                    {'customerid': customerid, 'emailtemplateid':emailtemplateid}, Customer)

                session.flush()
                session.execute(text('DELETE FROM userdata.list WHERE customerid = :customerid'), {'customerid': customerid}, Customer)

                session.execute(text('DELETE FROM public.tg_user WHERE customerid = :customerid AND user_id != 5732'), {'customerid': customerid}, Customer)

                session.commit()
            except:
                LOGGER.exception("Delete Failure")
                session.rollback()
                raise			
            print '%s: %s' %(counter,customerid)
        print 'finished'

class CollateralClean(object):
    """Clean collateral database """

    def start_service(self):

        prmaxcollateral = session.query(Collateral.collateralid).all()
        collateral_todelete = session.query(ECollateral).filter(not_(ECollateral.collateralid.in_(prmaxcollateral))).all()

        session.begin()
        for collateralcollateral in collateral_todelete:
            session.delete(collateralcollateral)
            session.flush()
        session.commit()
