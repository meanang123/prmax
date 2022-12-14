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
import sys
from sqlalchemy import MetaData, Table, text, or_, and_, distinct, not_
from turbogears import config
from turbogears.database import metadata, mapper, session, config
import sys
import simplejson
from ttl.model import BaseSql
from prcommon.model.outlet import Outlet
from prcommon.model.customer.customergeneral import Customer
from prcommon.model import CustomerInvoice, CustomerAllocation, CustomerPayments, Adjustments
from prcommon.model import CustomerTypes
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
from prcommon.model import ClippingsOrder, Clipping
from datetime import datetime, timedelta, date

import prcommon.Constants as Constants

import logging
LOGGER = logging.getLogger("prcommon.model")

class DataClean(object):
    """Clean prmax database """

    def start_service(self):

        fromdate1 = date.today() - timedelta(days = 365*2)
        fromdate2 = date.today() - timedelta(days = 365*3)
        customers_todelete = [cust.customerid for cust in session.query(Customer).\
            outerjoin(SEORelease, SEORelease.customerid == Customer.customerid).\
            filter(or_(and_(Customer.customerstatusid == 3, Customer.createddate < fromdate2, SEORelease.published < fromdate2),
                       Customer.licence_expire < fromdate2,
                       (and_(Customer.licence_expire > fromdate2,
                             Customer.licence_expire < fromdate1,
                             SEORelease.published < fromdate2)))).distinct().\
                filter(Customer.isinternal == False).all()]
                #filter(Customer.customerid > 1800).distinct().all()
                #filter(Customer.customerid == 1134).all()

        print ('start service dataclean')
        print (len(customers_todelete))
        self.delete_customers(customers_todelete)

    def delete_3years_suspended_and_licence_expired(self):

        
        customerinvoices = [ci.customerid for ci in session.query(CustomerInvoice.customerid).order_by(CustomerInvoice.customerid).distinct()]
        customerpayments = [ca.customerid for ca in session.query(CustomerPayments.customerid).order_by(CustomerPayments.customerid).distinct()]
        customerseoreleases = [seo.customerid for seo in session.query(SEORelease.customerid).filter(SEORelease.seostatusid==2).order_by(SEORelease.customerid).distinct()]
        customerclippingsorders = [co.customerid for co in session.query(ClippingsOrder.customerid).order_by(ClippingsOrder.customerid).distinct()]
        
        fromdate2 = date.today() - timedelta(days = 365*3)
        customers_todelete = [cust.customerid for cust in session.query(Customer).\
                filter(Customer.customerstatusid == 3).\
                filter(Customer.licence_expire < fromdate2).\
                filter(not_(Customer.customerid.in_(customerinvoices))).\
                filter(not_(Customer.customerid.in_(customerpayments))).\
                filter(not_(Customer.customerid.in_(customerseoreleases))).\
                filter(not_(Customer.customerid.in_(customerclippingsorders))).\
                filter(Customer.isinternal == False).all()]
                #filter(Customer.customerid > 1800).distinct().all()
                #filter(Customer.customerid == 1134).all()

        print ('start service dataclean')
        print (len(customers_todelete))
        self.delete_customers(customers_todelete)


    def delete_customers(self, customers_todelete):
        print ('Start delete_customers')
        print (len(customers_todelete))

        counter = 0
        for customerid in customers_todelete:
            counter += 1
            print ('%s: %s' %(counter,customerid))
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
                clippingsorders = session.query(ClippingsOrder.clippingsorderid).filter(ClippingsOrder.customerid == customerid).all()
                for clippingsorderid in clippingsorders:
                    session.execute(text('DELETE FROM internal.clippingsordercountry WHERE clippingsorderid = :clippingsorderid'), {'clippingsorderid': clippingsorderid}, Customer)
                    session.execute(text('DELETE FROM internal.clippingsorderlanguage WHERE clippingsorderid = :clippingsorderid'), {'clippingsorderid': clippingsorderid}, Customer)
                    session.execute(text('DELETE FROM internal.clippingsordertype WHERE clippingsorderid = :clippingsorderid'), {'clippingsorderid': clippingsorderid}, Customer)
                session.flush()
                session.execute(text('DELETE FROM internal.clippingsorder WHERE customerid = :customerid'), {'customerid': customerid}, Customer)
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

                session.execute(text('DELETE FROM seoreleases.seorelease WHERE customerid = :customerid'), {'customerid': customerid}, Customer)

                #delete clients that are not linked with an SEO
                clients = [row.clientid for row in session.query(Client.clientid).\
                           filter(Client.customerid == customerid).all()]
                #clients_seo = [row.clientid for row in session.query(SEORelease.clientid).\
                #               filter(SEORelease.customerid == customerid).\
                #               filter(SEORelease.clientid.in_(clients)).distinct().all()]
                #clients_clippings = [row.defaultclientid for row in session.query(ClippingsOrder.defaultclientid).\
                #               filter(ClippingsOrder.customerid == customerid).\
                #               filter(ClippingsOrder.defaultclientid.in_(clients)).distinct().all()]
                clients_todelete = clients
                #if clients:
                #    if clients_seo: #and clients_clippings:
                #        clients_todelete = (list(set(clients) - set(clients_seo))) # - set(clients_clippings)))
                    #elif clients_seo and not clients_clippings:
                    #    clients_todelete = (list(set(clients) - set(clients_seo)))
                    #elif not clients_seo and clients_clippings:
                    #    clients_todelete = (list(set(clients) - set(clients_clippings)))
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

                emailtemplates_todelete = emailtemplates
                if emailtemplates and emailtemplates_seo:
                    emailtemplates_todelete = (list(set(emailtemplates) - set(emailtemplates_seo)))
                for emailtemplateid in emailtemplates_todelete:
                    session.execute(text('DELETE FROM userdata.emailtemplates WHERE customerid = :customerid AND emailtemplateid = :emailtemplateid'),
                                    {'customerid': customerid, 'emailtemplateid':emailtemplateid}, Customer)

                session.flush()
                session.execute(text('DELETE FROM userdata.list WHERE customerid = :customerid'), {'customerid': customerid}, Customer)
                session.execute(text('DELETE FROM queues.indexerqueue WHERE customerid = :customerid'), {'customerid': customerid}, Customer)
                session.execute(text('DELETE FROM queues.cachequeue WHERE customerid = :customerid'), {'customerid': customerid}, Customer)
                session.execute(text('DELETE FROM queues.emailqueue WHERE customerid = :customerid'), {'customerid': customerid}, Customer)
                #session.execute(text('DELETE FROM queues.mswordqueue WHERE customerid = :customerid'), {'customerid': customerid}, Customer)
                session.execute(text('DELETE FROM queues.reports WHERE customerid = :customerid'), {'customerid': customerid}, Customer)

                session.execute(text('DELETE FROM internal.customermenusettings WHERE customerid = :customerid'), {'customerid': customerid}, Customer)

                session.execute(text('DELETE FROM public.tg_user WHERE customerid = :customerid AND user_id != 5732 AND usertypeid = 1'), {'customerid': customerid}, Customer)
                session.flush()
                
                customerinvoices = [row.customerinvoiceid for row in session.query(CustomerInvoice.customerinvoiceid).\
                                  filter(CustomerInvoice.customerid == customerid).all()]
                for customerinvoiceid in customerinvoices:
                    session.execute(text('DELETE FROM accounts.customerallocation WHERE alloc_invoiceid = :customerinvoiceid'), {'customerinvoiceid': customerinvoiceid}, Customer)
                session.flush()    
                customerpayments = [row.customerpaymentid for row in session.query(CustomerPayments.customerpaymentid).\
                                  filter(CustomerPayments.customerid == customerid).all()]
                for customerpaymentid in customerpayments:
                    session.execute(text('DELETE FROM accounts.customerallocation WHERE alloc_paymentid = :customerpaymentid'), {'customerpaymentid': customerpaymentid}, Customer)
                    session.execute(text('DELETE FROM accounts.customerallocation WHERE source_paymentid = :customerpaymentid'), {'customerpaymentid': customerpaymentid}, Customer)
                session.flush()            

                customeradjustments = [row.adjustmentid for row in session.query(Adjustments.adjustmentid).\
                                  filter(Adjustments.customerid == customerid).all()]
                for adjustmentid in customeradjustments:
                    session.execute(text('DELETE FROM accounts.customerallocation WHERE alloc_adjustmentid = :adjustmentid'), {'adjustmentid': adjustmentid}, Customer)
                    session.execute(text('DELETE FROM accounts.customerallocation WHERE source_adjustmentid = :adjustmentid'), {'adjustmentid': adjustmentid}, Customer)
                session.flush()
                    
                session.execute(text('DELETE FROM accounts.customerinvoices WHERE customerid = :customerid'), {'customerid': customerid}, Customer)
                session.flush()
                session.execute(text('DELETE FROM accounts.audittrail WHERE customerid = :customerid'), {'customerid': customerid}, Customer)
                session.flush()
                

                session.execute(text('DELETE FROM accounts.adjustments WHERE customerid = :customerid'), {'customerid': customerid}, Customer)
                session.execute(text('DELETE FROM accounts.customerpayments WHERE customerid = :customerid'), {'customerid': customerid}, Customer)

                #session.execute(text('DELETE FROM internal.customers WHERE customerid = :customerid'), {'customerid': customerid}, Customer)
                #print('Deleted customerid: %s' %customerid)
                session.commit()

            except:
                LOGGER.exception("Delete Failure")
                session.rollback()
                raise
            # print ('%s: %s' %(counter,customerid))
        print ('finished')

    def start_old_data(self):

        for customer in session.query(Customer).filter(Customer.isinternal == False).all():
            #  delete all list/distributions that are over3 years old
            try:
                deletedata = session.execute(text("""select emailtemplateid,listid from userdata.emailtemplates where sent_time < current_date - interval '3 years' and listid is not null and customerid = :customerid"""), {'customerid': customer.customerid,}, Customer).fetchall()

                print ('Start', customer.customerid, customer.customername, len(deletedata))
                totallen =  len(deletedata)

                if totallen >  0 and totallen <= 100:
                    session.begin()
                    # 1 UPDATE all emailtemplates and removelist
                    templates = ",".join([str(row[0]) for row in deletedata])
                    lists = ",".join([str(row[1]) for row in deletedata])
                    session.execute(text("""UPDATE userdata.emailtemplates SET listid = NULL WHERE customerid=:customerid AND emailtemplateid IN (%s)""" % (templates, )), {'customerid': customer.customerid,}, Customer)
                    #  error issue
                    session.execute(text("""UPDATE userdata.emailtemplates SET listid = NULL WHERE customerid=:customerid AND listid IN (%s)""" % (lists, )), {'customerid': customer.customerid,}, Customer)
                    session.flush()
                    # 2 DELETE ALL lists
                    session.execute(text('DELETE FROM userdata.list WHERE customerid = :customerid AND listid IN (%s)' % (lists, )), {'customerid': customer.customerid}, Customer)
                    session.flush()
                    # 3 DELETE ALL emailtemplates
                    for (emailtemplateid,_) in deletedata:
                        session.execute(text("""DELETE FROM userdata.emailtemplates WHERE customerid = :customerid AND emailtemplateid  = :emailtemplateid
                        AND emailtemplateid NOT IN (SELECT emailtemplateid FROM seoreleases.seorelease WHERE emailtemplateid = :emailtemplateid)"""), {'customerid': customer.customerid,  'emailtemplateid': emailtemplateid,}, Customer)
                    session.commit()
                elif totallen > 100:
                    # need to do them in batch's
                    session.begin()
                    for (emailtemplateid,listid) in deletedata:
                        nbr = deletedata.index((emailtemplateid,listid))
                        session.execute(text("""UPDATE userdata.emailtemplates SET listid = NULL WHERE customerid=:customerid AND emailtemplateid = :emailtemplateid"""), {'customerid': customer.customerid,'emailtemplateid': emailtemplateid,}, Customer)
                        session.flush()
                        #  error issue
                        session.execute(text("""UPDATE userdata.emailtemplates SET listid = NULL WHERE customerid=:customerid AND listid = :listid"""), {'customerid': customer.customerid, 'listid': listid,}, Customer)
                        session.flush()
                        session.execute(text('DELETE FROM userdata.list WHERE customerid = :customerid AND listid = :listid'), {'customerid': customer.customerid, 'listid': listid}, Customer)
                        session.flush()
                        session.execute(text("""DELETE FROM userdata.emailtemplates WHERE customerid = :customerid AND emailtemplateid  = :emailtemplateid
                        AND emailtemplateid NOT IN (SELECT emailtemplateid FROM seoreleases.seorelease WHERE emailtemplateid = :emailtemplateid)"""), {'customerid': customer.customerid,  'emailtemplateid': emailtemplateid,}, Customer)
                        session.flush()
                        if nbr % 40 == 0:
                            session.commit()
                            session.begin()
                            sys.stdout.write('.')
                            sys.stdout.flush()

                    sys.stdout.write('\r')
                    session.commit()
                print ("Completed")
            except:
                LOGGER.exception("Delete Failure")
                session.rollback()
                raise
        print ("finished")

class CollateralClean(object):
    """Clean collateral database """

    def start_service(self):

        prmaxcollateral = session.query(Collateral.collateralid).all()
        print ('prmaxcollateral: %s' %len(prmaxcollateral))

        nbr = 0
        for x in range(136, 200):
            collateral_collateral = session.query(ECollateral).\
                filter(ECollateral.collateralid < x*1000).filter(ECollateral.collateralid >= (x-1)*1000).all()

            print ('collateral_collateral: %s' %len(collateral_collateral))
            session.begin()
            for col in collateral_collateral:
                if col.collateralid not in prmaxcollateral:
                    nbr += 1
                    session.delete(col)
                    if nbr%50 == 0:
                        session.commit()
                        session.begin()
                        print ('%5d:' % nbr)
            session.commit()
        print ('Total deleted: %s' % nbr)

class CustomersClean(object):
    """Delete old customers """

    CUSTOMERTYPES_TODELETE = [2,4,6,7,11,12,14,16,17,19,21]

    def delete_old_customers(self):
        
        customerinvoices = [ci.customerid for ci in session.query(CustomerInvoice.customerid).order_by(CustomerInvoice.customerid).distinct()]
        customerpayments = [ca.customerid for ca in session.query(CustomerPayments.customerid).order_by(CustomerPayments.customerid).distinct()]
        
        customers_todelete = [cust.customerid for cust in session.query(Customer).\
            filter(Customer.customertypeid.in_((2,4,6,7,11,12,14,16,17,19,21))).\
            #filter(not_(Customer.customerid.in_(customerinvoices))).\
            #filter(not_(Customer.customerid.in_(customerpayments))).\
            all()]

#            filter(Customer.customerid != 4332).\
#            filter(Customer.customerid != 4823).\
#            filter(Customer.customerid != 3690).\
#            filter(Customer.customerid != 1953).\
#            filter(Customer.customerid != 5209).\
#            filter(Customer.customerid != 2736).\
#            filter(Customer.customerid != 2783).\
#            filter(Customer.customerid != 1314).\
#            filter(Customer.customerid != 926).\
#            filter(Customer.customerid != 843).\
#            filter(Customer.customerid != 2365).\
#            filter(Customer.customerid != 1892).\
#            filter(Customer.customerid != 3972).\
#            filter(Customer.customerid != 1975).\
#            filter(Customer.customerid != 2119).\
#            filter(Customer.customerid != 85).\
#            filter(Customer.customerid != 5817).\
#            filter(Customer.customerid != 1997).\
#            filter(Customer.customerid != 2537).\
#            filter(Customer.customerid != 4822).\
#            filter(Customer.customerid != 4693).\
#            all()]

        a = DataClean()
        print('Start customertypes')
        a.delete_customers(customers_todelete)

#        session.begin()
        if customers_todelete:
            print('Start Customers')
            for customerid in customers_todelete:
                print(customerid)
                session.begin()
                session.execute(text("""DELETE FROM internal.customers where customerid=:customerid"""), {'customerid': customerid}, Customer)
                session.commit()
            print('End Customers')

        print('Start CustomerTypes')
        session.begin()
        session.execute(text("""DELETE FROM internal.customertypes where customertypeid in (4,11,12,14,16,21)"""), {}, CustomerTypes)
        session.execute(text("""DELETE FROM internal.customertypes where customertypeid in (2,4,6,7,11,12,14,16,17,19,21)"""), {}, CustomerTypes)
                
        session.commit()
        print('End customertypes')


class ClippingsClean(object):
    """Delete old clippings """

    pass