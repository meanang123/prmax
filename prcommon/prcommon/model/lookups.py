# -*- coding: utf-8 -*-
"""Lookups"""
#-----------------------------------------------------------------------------
# Name:        lookups.py
# Purpose:		Basic lookup tables
#
# Author:      Chris Hoy
#
# Created:    13/09/2010
# RCS-ID:      $Id:  $
# Copyright:   (c) 2010

#-----------------------------------------------------------------------------
from datetime import date
import logging
from turbogears.database import metadata, mapper, session
from sqlalchemy import Table
from sqlalchemy.sql import text
from prcommon.model.common import BaseSql
import prcommon.Constants as Constants
from ttl.model.common import WhereClause

LOGGER = logging.getLogger("prcommon")

class CustomerTypes(BaseSql):
	"""CustomerTypes"""
	List_Customer_types = """
	SELECT countrytype.customertypeid AS id ,JSON_ENCODE(countrytype.customertypename) as name
	FROM internal.customertypes  as countrytype
	ORDER BY countrytype.customertypename"""

	@classmethod
	def getLookUp(cls, params):
		""" get lookups for customertypes and open """
		def _convert(data):
			"internal"
			return  [dict(id=row.id, name=row.name)
			         for row in data.fetchall()]

		data = cls.sqlExecuteCommand(text(CustomerTypes.List_Customer_types),
		                             params,
		                             _convert)

		if params.has_key("include_no_option"):
			data.insert(0, dict(id=-1, name="No Filter"))

		return data

	@classmethod
	def get_by_sortname(cls, shortname):
		""" by name """
		return session.query(cls).filter_by(shortname=shortname).first()

	def convert_to_type(self):
		"""Convert sales feed to prmax type """
		if self.customertypeid in (11,):
			return Constants.CustomerType_PRmax
		else:
			return self.customertypeid

class UserTypes(BaseSql):
	"""User Types """
	List_User_Types = """
	SELECT ut.usertypeid AS id ,JSON_ENCODE(ut.usertypename) as name
	FROM internal.usertypes AS ut
	ORDER BY countrytype.customertypename"""

	@classmethod
	def getLookUp(cls, params):
		""" get lookups for customertypes and open """
		def _convert(data):
			"internal"
			return  [dict(id=row.id, name=row.name)
			         for row in data.fetchall()]

		return cls.sqlExecuteCommand(text(UserTypes.List_User_Types), params, _convert)

class SortOrder(BaseSql):
	""" Sort order table for the system """

	List_Types = """SELECT sortorderid,sortordername FROM internal.sortorder ORDER BY sortordername"""

	@classmethod
	def getLookUp(cls, params):
		""" get a lookup list """
		def _convert(data):
			""""local convert"""
			return [dict(id=row.sortorderid, name=row.sortordername)
					for row in data.fetchall()]
		return cls.sqlExecuteCommand(text(SortOrder.List_Types), None, _convert)

class Frequencies(BaseSql):
	""" Frequencies lookup"""
	List_Types = """SELECT f.frequencyid,f.frequencyname FROM internal.frequencies as f ORDER BY f.frequencyname"""

	@classmethod
	def getLookUp(cls, params):
		""" get a lookup list """
		def _convert(data):
			""""local convert"""
			return [dict(id=row.frequencyid, name=row.frequencyname)
					for row in data.fetchall()]
		return cls.sqlExecuteCommand(text(Frequencies.List_Types), None, _convert)

	@classmethod
	def getLookupAsDict(cls, params):
		"getLookupAsDict"
		result = {}
		for row in cls.getLookUp(params):
			result[row["id"]] = row
		return result

class Selection(BaseSql):
	""" List of the list selection options """
	pass


class PRmaxOutletTypes(BaseSql):
	""" outlet types """
	List_Types = """SELECT i.prmax_outlettypeid,i.prmax_outlettypename,prmax_outletgroupid FROM internal.prmax_outlettypes as i ORDER BY i.prmax_outlettypename"""

	@classmethod
	def getLookUp(cls, params):
		""" get a lookup list """
		def _convert(data):
			""""local convert"""
			return [dict(id=row.prmax_outlettypeid, name=row.prmax_outlettypename, grouptypeid=row.prmax_outletgroupid)
					for row in data.fetchall()]
		return cls.sqlExecuteCommand(text(PRmaxOutletTypes.List_Types), params, _convert)


class AdvanceFeaturesStatus(BaseSql):
	""" All the researcg status for advance features """
	List_Types = """SELECT advancefeaturesstatusid,advancefeaturesstatusdescription FROM research.advancefeaturesstatus ORDER BY advancefeaturesstatusdescription"""

	@classmethod
	def getLookUp(cls, params):
		""" get a lookup list """
		def _convert(data):
			""""local convert"""
			return [dict(id=row.advancefeaturesstatusid,
						 name=row.advancefeaturesstatusdescription)
					for row in data.fetchall()]
		return cls.sqlExecuteCommand(text(AdvanceFeaturesStatus.List_Types), params, _convert)

class FinancialStatus(BaseSql):
	""" The financial status of a customer """
	List_Types = """SELECT financialstatusid,financialstatusdescription FROM internal.financialstatus"""

	@classmethod
	def getLookUp(cls, params):
		""" get a lookup list """
		def _convert(data):
			""""local convert"""
			return [dict(id=row.financialstatusid,
						 name=row.financialstatusdescription)
					for row in data.fetchall()]
		data = cls.sqlExecuteCommand(text(FinancialStatus.List_Types), params, _convert)

		if "ignore" in params:
			data.insert(0, dict(id=-1, name="No Filter"))

		return data

class PaymentReturnReason(BaseSql):
	""" The financial status of a customer """
	List_Types = """SELECT paymentreturnreasonid,paymentreturnreasonname FROM internal.paymentreturnreason"""

	@classmethod
	def getLookUp(cls, params):
		""" get a lookup list """
		def _convert(data):
			""""local convert"""
			return [dict(id=row.paymentreturnreasonid, name=row.paymentreturnreasonname)
					for row in data.fetchall()]
		data = cls.sqlExecuteCommand(text(PaymentReturnReason.List_Types), params, _convert)

		if "ignore" in params:
			data.insert(0, dict(id=-1, name="No Filter"))

		return data

class OutletPrices(BaseSql):
	""" outlet price type """

	@classmethod
	def getLookUp(cls, params):
		""" get a lookup list """

		def _convert(row):
			""""local convert"""
			return dict(id=row.outletpriceid, name=row.outletpricedescription)

		data = [_convert(row) for row in session.query(OutletPrices).order_by(OutletPrices.outletpricedescription).all()]

		if "ignore" in params:
			data.insert(0, dict(id=-1, name="No Filter"))

		return data

class Months(object):
	""" Months of the year for look ups """
	_Months = {1 : 'January',
	           2 : 'February',
	           3 : 'March',
	           4 : 'April',
	           5 : 'May',
	           6 : 'June',
	           7 : 'July',
	           8 : 'August',
	           9 : 'September',
	           10: 'October',
	           11: 'November',
	           12: 'December'}

	@classmethod
	def getLookUp(cls, params):
		""" get a lookup list """
		data = [dict(id=rowid[0], name=rowid[1]) for rowid in Months._Months.items()]
		if "ignore" in params:
			data.insert(0, dict(id=-1, name="No Filter"))

		return data

	@staticmethod
	def getDescription(monthid):
		""" get description"""

		return Months._Months.get(monthid, "")

class DaysOfMonth(object):
	""" Days of the month for subscription and dd date
	this can only be the days that are common too all standard months"""

	_Days = [dict(id=rowid, name=str(rowid)) for rowid in xrange(1, 29)]

	@classmethod
	def getLookUp(cls, params):
		""" get a lookup list """
		return DaysOfMonth._Days

class Years(object):
	""" Look up of the next few year for the selection """

	_Years = {}

	@staticmethod
	def _Load():
		""" Load years """
		if not len(Years._Years):
			year = date.today().year
			Years._Years[year] = str(year)
			Years._Years[year-1] = str(year-1)
			Years._Years[year+1] = str(year+1)

	@classmethod
	def getLookUp(cls, params):
		""" get a lookup list """
		Years._Load()
		return [dict(id=a[0], name=a[1]) for a in Years._Years.items()]

	@staticmethod
	def getDescription(yearid):
		""" get description"""
		Years._Load()

		return Years._Years.get(yearid, "")


class CustomerOrderStatus(BaseSql):
	""" Customer orders Statuss"""
	_List_Status = """SELECT customerorderstatusid,customerorderstatusdescription FROM internal.customerorderstatus ORDER BY customerorderstatusid"""

	@classmethod
	def getLookUp(cls, params):
		""" get the list of options """
		data = [dict(id=row.customerorderstatusid, name=row.customerorderstatusdescription)
		         for row in session.query(CustomerOrderStatus).order_by(CustomerOrderStatus.customerorderstatusid).all()]

		if "ignore" in params:
			data.insert(0, dict(id=-1, name="No Filter"))

		return data

class VatCodes(BaseSql):
	""" List of all the vat codes """

	def calc_vat_amount(self, amount):
		""" calucalte amount of vat in a value """
		return round((100 / (100 + (self.rate/10.0))) * amount, 2)

	def calc_vat_required(self, amount):
		"calc_vat_required"
		return  (self.rate / 1000.0) * amount

	def calc_vat_amount_int(self, amount):
		""" calculate  amount of vat in a value """
		return int(amount - round((100 / (100 + (self.rate/10.0))) * amount, 0))


class Countries(BaseSql):
	""" List of countries for the customers and not research """

	List_Types = """SELECT countryid AS id ,countryname AS name ,vatnbrequired
	FROM internal.countries AS c
	JOIN internal.vatcode AS v ON v.vatcodeid =  c.vatcodeid
	%s
	ORDER BY countryname"""

	@classmethod
	def getLookUp(cls, params):
		""" get a lookup list """
		wc = WhereClause()
		if "name" in params:
			params["name"] = params["name"].replace("*", "%")
			wc.add("c.countryname ilike :name")

		data = cls.sqlExecuteCommand(text(Countries.List_Types % wc.whereclause), params, BaseSql.ResultAsEncodedDict)
		if params.get("name", "") == "%":
			data.insert(0, dict(id=-1, name="No Selection"))

		return data

	ListData = """SELECT c.countryid,c.countryname,countrytype.countrytypedescription, cp.countryname as parentcountryname FROM internal.countries AS c JOIN internal.countrytypes AS countrytype ON countrytype.countrytypeid =  c.countrytypeid LEFT OUTER JOIN internal.countries AS cp ON cp.countryid = c.regioncountryid """
	ListDataOrder = """ ORDER BY  %s %s LIMIT :limit  OFFSET :offset"""
	ListDataCount = """SELECT COUNT(*) FROM internal.countries AS c """

	@classmethod
	def getGridPage(cls, kw):
		""" return the page of countries"""
		wc = WhereClause()

		# filter
		if "countrytypeid" in kw:
			wc.add("c.countrytypeid = :countrytypeid")

		if "countryname" in kw:
			kw["countryname"] = kw["countryname"] + "%"
			wc.add("c.countryname ILIKE :countryname")

		# sort
		if kw.get("sortfield", "") == "countryname":
			kw["sortfield"] = 'UPPER(c.countryname)'

		if kw.get("sortfield", "") == "countryname":
			kw["sortfield"] = 'UPPER(cp.parentcountryname)'

		return BaseSql.getGridPage(kw,
								'UPPER(c.countryname)',
								'countryid',
								Countries.ListData + wc.whereclause + Countries.ListDataOrder,
								Countries.ListDataCount + wc.whereclause,
								cls)

	@classmethod
	def get_rest_page(cls, params):
		"""Rest Page """

		return cls.grid_to_rest(
		  cls.getGridPage(params),
		  params["offset"])

	@classmethod
	def Exists(cls, kw):
		""" Check too see if a country exits """

		obj = session.query(Countries).filter_by(countryname=kw['countryname']).all()
		if kw.has_key("countryid"):
			kw["countryid"] = int(kw["countryid"])
			obj = [row for row in obj if row.countryid != kw["countryid"]]

		return True if len(obj) else False

	@classmethod
	def get(cls, countryid):
		""" return the details for country """

		country = Countries.query.get(countryid)
		countrytype = CountryTypes.query.get(country.countrytypeid)

		rdata = dict(countryid=countryid,
		             countryname=country.countryname,
		             countrytypeid=country.countrytypeid,
		             countrytypedescription=countrytype.countrytypedescription,
		             regioncountryid=country.regioncountryid,
		             parentcountryname=""
		             )

		if country.regioncountryid:
			rdata["parentcountryname"] = Countries.query.get(country.regioncountryid).countryname

		return rdata

	@classmethod
	def add(cls, kw):
		""" add a new country"""
		transaction = cls.sa_get_active_transaction()

		try:
			country = Countries(countryname=kw["countryname"],
			                    countrytypeid=kw["countrytypeid"])
			if kw["regioncountryid"] and kw["regioncountryid"] != "-1":
				country.regioncountryid = int(kw["regioncountryid"])

			session.add(country)
			session.flush()
			transaction.commit()
			return country.countryid
		except:
			LOGGER.error("Countries_add")
			transaction.rollback()
			raise

	@classmethod
	def update(cls, params):
		""" update country"""

		transaction = BaseSql.sa_get_active_transaction()

		try:
			country = Countries.query.get(params["countryid"])

			country.countryname = params["countryname"]
			country.countrytypeid = params["countrytypeid"]
			if params.get("regioncountryid", None) == -1:
				country.regioncountryid = None
			else:
				country.regioncountryid = params.get("regioncountryid", None)

			transaction.commit()
		except:
			LOGGER.exception("Countries_update")
			transaction.rollback()
			raise

	@classmethod
	def get_user_selection(cls, params):
		""" get a list of countries based on the user selection """
		if "filter" in params and params.get("filter", "-1") != "-1":
			params["word"] = params["word"].replace("*", "")
			return session.query(Countries).\
			       filter(Countries.continentid == int(params.get("filter"))).\
			       filter(Countries.countryname.ilike(params["word"] + "%")).order_by(Countries.countryname).all()
		else:
			return session.query(Countries).filter(Countries.countryname.ilike(params["word"] + "%")).order_by(Countries.countryname).all()


class OutletTypes(BaseSql):
	""" outlet types """
	List_Types = """SELECT i.producttypeid,i.producttypename FROM internal.producttypes as i  WHERE i.visible=true ORDER BY i.producttypename"""

	@classmethod
	def getLookUp(cls, params):
		""" get a lookup list """
		def _convert(data):
			""""local convert"""
			return [dict(id=row.producttypeid, name=row.producttypename)
					for row in data.fetchall()]
		return cls.sqlExecuteCommand(text(OutletTypes.List_Types), params, _convert)

class CustomerStatus(BaseSql):
	""" customer status"""
	List = """SELECT customerstatusid as id, customerstatusname as name FROM internal.customerstatus"""
	@classmethod
	def getLookUp(cls, params):
		""" get a lookup list """
		def _convert(data):
			""""local convert"""
			return [dict(id=row.id, name=row.name)
					for row in data.fetchall()]

		lines = cls.sqlExecuteCommand(text(CustomerStatus.List), None, _convert)
		if params.get('filter'):
			lines.insert(0, dict(id=-1, name="No Filter"))
		if "show_all" in params:
			lines.insert(0, dict(id=0,name='Show All'))
		return lines

class OutletSearchType(BaseSql):
	""" Oultet search types """
	List_Types = """SELECT i.outletsearchtypeid,i.outletsearchtypename FROM internal.outletsearchtypes as i WHERE i.internal=0 ORDER BY i.outletsearchtypename"""

	@classmethod
	def getLookUp(cls, params):
		""" get a lookup list """
		def _convert(data):
			""""local convert"""
			return [dict(id=row.outletsearchtypeid, name=row.outletsearchtypename)
					for row in data.fetchall()]
		return cls.sqlExecuteCommand(text(OutletSearchType.List_Types), params, _convert)

class CustomerPaymentTypes(BaseSql):
	"CustomerPaymentTypes"
	List_Types = """SELECT i.customerpaymenttypeid,i.customerpaymenttypename FROM internal.customerpaymenttypes as i ORDER BY i.customerpaymenttypename"""

	@classmethod
	def getLookUp(cls, params):
		""" get a lookup list """
		def _convert(data):
			""""local convert"""
			return [dict(id=row.customerpaymenttypeid, name=row.customerpaymenttypename)
					for row in data.fetchall()]
		return cls.sqlExecuteCommand(text(CustomerPaymentTypes.List_Types), params, _convert)

class PaymentMethods(BaseSql):
	""" Sort order table for the system """

	List_Types = """SELECT paymentmethodid,paymentmethodname FROM internal.paymentmethods ORDER BY paymentmethodname"""

	@classmethod
	def getLookUp(cls, params):
		""" get a lookup list """
		def _convert(data):
			""""local convert"""
			return [dict(id=row.paymentmethodid, name=row.paymentmethodname)
					for row in data.fetchall()]
		return cls.sqlExecuteCommand(text(PaymentMethods.List_Types), None, _convert)

class AdjustmentsTypes(BaseSql):
	""" Account adjustments types """

	List_Types = """SELECT adjustmenttypeid,adjustmenttypedescriptions FROM internal.adjustmenttypes ORDER BY adjustmenttypeid"""

	@classmethod
	def getLookUp(cls, params):
		""" get a lookup list """
		def _convert(data):
			""""local convert"""
			return [dict(id=row.adjustmenttypeid, name=row.adjustmenttypedescriptions)
					for row in data.fetchall()]
		return cls.sqlExecuteCommand(text(AdjustmentsTypes.List_Types), None, _convert)

class TaskStatus(BaseSql):
	"TaskStatus"
	List_Types = """SELECT taskstatusid,taskstatusdescription FROM internal.taskstatus ORDER BY taskstatusid"""

	@classmethod
	def getLookUp(cls, params):
		""" get a lookup list """
		def _convert(data):
			""""local convert"""
			return [dict(id=row.taskstatusid, name=row.taskstatusdescription)
					for row in data.fetchall()]
		return cls.sqlExecuteCommand(text(TaskStatus.List_Types), None, _convert)

class PrmaxModules(BaseSql):
	"PrmaxModules"
	List_Types = """SELECT prmaxmoduleid,prmaxmoduledescription FROM internal.prmaxmodules ORDER BY prmaxmoduleid"""

	@classmethod
	def getLookUp(cls, params):
		""" get a lookup list """
		def _convert(data):
			""""local convert"""
			return [dict(id=row.prmaxmoduleid, name=row.prmaxmoduledescription)
					for row in data.fetchall()]
		return cls.sqlExecuteCommand(text(PrmaxModules.List_Types), None, _convert)

class CustomerSources(BaseSql):
	"CustomerSources"
	List_Types = """SELECT customersourceid,customersourcedescription FROM internal.customersources ORDER BY customersourcedescription"""

	@classmethod
	def getLookUp(cls, params):
		""" get a lookup list """
		def _convert(data):
			""""local convert"""
			return [dict(id=row.customersourceid, name=row.customersourcedescription)
					for row in data.fetchall()]

		data = cls.sqlExecuteCommand(text(CustomerSources.List_Types), None, _convert)
		if params.has_key("include_no_option"):
			data.insert(0, dict(id=-1, name="No Filter"))

		return data

class CustomerProducts(BaseSql):
	"CustomerProducts"
	List_Types = """SELECT customerproductid,customerproductdescription FROM internal.customerproducts ORDER BY customerproductdescription"""

	@classmethod
	def getLookUp(cls, params):
		""" get a lookup list """
		def _convert(data):
			""""local convert"""
			return [dict(id=row.customerproductid, name=row.customerproductdescription)
					for row in data.fetchall()]
		return cls.sqlExecuteCommand(text(CustomerProducts.List_Types), None, _convert)

class CountryTypes(BaseSql):
	"CountryTypes"
	List_Types = """SELECT countrytypeid,countrytypedescription FROM internal.countrytypes ORDER BY countrytypedescription"""

	@classmethod
	def getLookUp(cls, params):
		""" get a lookup list """
		def _convert(data):
			""""local convert"""
			return [dict(id=row.countrytypeid, name=row.countrytypedescription)
					for row in data.fetchall()]
		return cls.sqlExecuteCommand(text(CountryTypes.List_Types), None, _convert)


class OrderConformationPaymentMethods(object):
	""" list of payment methods for the order confirmation """
	_Data = [
	  dict(id=1, name="Credit Card", isdd=False),
	  dict(id=2, name="Send invoice - Give Access", isdd=False),
	  dict(id=3, name="Send invoice - No Access Given", isdd=False),
	  dict(id=4, name="DD - Bank Details Supplied - Give Access", isdd=True),
	  dict(id=5, name="DD - Send Mandate - Give Access", isdd=True),
	  dict(id=6, name="DD - Send Mandate - No Access", isdd=True)]

	@classmethod
	def getLookUp(cls, kw):
		""" get lookup list """

		if "dd" in kw:
			return [row for row in OrderConformationPaymentMethods._Data if (kw["dd"] == "0" and row["isdd"]) or\
			         (kw["dd"] == "1" and row["isdd"])]
		else:
			return OrderConformationPaymentMethods._Data

class ResearchProjectStatus(BaseSql):
	"ResearchProjectStatus"
	List_Types = """SELECT researchprojectstatusid,researchprojectstatusdescription FROM internal.researchprojectstatus ORDER BY researchprojectstatusdescription"""

	@classmethod
	def getLookUp(cls, params):
		""" get a lookup list """
		def _convert(data):
			""""local convert"""
			return [dict(id=row.researchprojectstatusid, name=row.researchprojectstatusdescription)
					for row in data.fetchall()]
		return cls.sqlExecuteCommand(text(ResearchProjectStatus.List_Types), None, _convert)

class SEOCategories(BaseSql):
	""" Seo Categories """

	@classmethod
	def get_list(cls):
		""" get a listing """

		return [dict(seocategoryid=row.seocategoryid, \
		             seocategorydescription=row.seocategorydescription.replace("&", "&amp;"), \
		             seocategorydescription_welsh=row.seocategorydescription_welsh.replace("&", "&amp;"), \
		             web_page=row.web_page) \
		        for row in session.query(SEOCategories).all()]

	@classmethod
	def get_page_map(cls):
		"""map of page names to categories"""
		tmp = {}
		for row in session.query(SEOCategories).all():
			tmp[row.web_page] = row

		return tmp

class SEOStatus(BaseSql):
	""" SEO status """

	@classmethod
	def getLookUp(cls, params):
		""" get a listing """
		return [dict(id=row.seostatusid, name=row.seostatusdescription)
		         for row in session.query(SEOStatus).order_by(SEOStatus.seostatusdescription).all()]

class SeoPaymentTypes(BaseSql):
	""" SeoPaymentTypes """

	@classmethod
	def getLookUp(cls, params):
		""" get a listing """
		return [dict(id=row.seopaymenttypeid, name=row.seopaymenttypedescription)
		        for row in session.query(SeoPaymentTypes).order_by(SeoPaymentTypes.seopaymenttypedescription).all()]

class NewsFeedTypes(BaseSql):
	""" News Feed types  """

	@classmethod
	def getLookUp(cls, params):
		""" get a listing """
		return [dict(id=row.newsfeedtypeid, name=row.newsfeedtypedescription)
		         for row in session.query(NewsFeedTypes).order_by(NewsFeedTypes.newsfeedtypedescription).all()]

class UnSubscribeReason(BaseSql):
	""" unsubscribereason """

	@classmethod
	def getLookUp(cls, params):
		""" get a listing """
		return [dict(id=row.unsubscribereasonid, name=row.unsubscribereason)
		         for row in session.query(UnSubscribeReason).order_by(UnSubscribeReason.unsubscribereason).all()]

class EmailSendTypes(BaseSql):
	""" emailsendtypes """

	@classmethod
	def getLookUp(cls, params):
		""" get a listing """
		return [dict(id=row.emailsendtypeid, name=row.emailsendtypedescription)
		        for row in session.query(EmailSendTypes).order_by(EmailSendTypes.emailsendtypeid).all()]

class IssueStatus(BaseSql):
	""" Issue Status  """

	@classmethod
	def getLookUp(cls, params):
		""" get a listing """
		return [dict(id=row.issuestatusid, name=row.issuestatusdescription)
		        for row in session.query(IssueStatus).order_by(IssueStatus.issuestatusid).all()]

class ContactHistoryStatus(BaseSql):
	""" contacthistorystatus  """

	@classmethod
	def getLookUp(cls, params):
		""" get a listing """
		return [dict(id=row.contacthistorystatusid, name=row.contacthistorystatusdescription)
		         for row in session.query(ContactHistoryStatus).order_by(ContactHistoryStatus.contacthistorystatusid).all()]

class QuestionTypes(object):
	"QuestionTypes"
	@classmethod
	def getLookUp(cls, params):
		""" get a listing """
		return [dict(id=row.questiontypeid, name=row.questiondescription)
		         for row in session.query(QuestionTypes).order_by(QuestionTypes.questiontypeid).all()]

class ClippingPriceServiceLevel(object):
	"ClippingPriceServiceLevel"
	@classmethod
	def getLookUp(cls, params):
		""" get a listing """
		return [dict(id=row.clippingpriceservicelevelid, name=row.clippingpriceserviceleveldescription)
		        for row in session.query(ClippingPriceServiceLevel).order_by(ClippingPriceServiceLevel.clippingpriceservicelevelid).all()]

class ClippingStatus(object):
	"ClippingStatus"
	@classmethod
	def getLookUp(cls, params):
		""" get a listing """
		return [dict(id=row.clippingsstatusid, name=row.clippingsstatusdescription)
		        for row in session.query(ClippingStatus).order_by(ClippingStatus.clippingsstatusid).all()]

class ClippingSource(object):
	"ClippingSource"
	@classmethod
	def getLookUp(cls, params):
		""" get a listing """
		return [dict(id=row.clippingsourceid, name=row.clippingsourcedescription)
		        for row in session.query(ClippingSource).order_by(ClippingSource.clippingsourceid).all()]

class DistributionTemplateTypes(object):
	"distributiontemplatesdescription"
	pass

class ClippingsTone(object):
	"ClippingsTone"
	@classmethod
	def getLookUp(cls, params):
		""" get a listing """
		return [dict(id=row.clippingstoneid, name=row.clippingstonedescription)
		        for row in session.query(ClippingsTone).order_by(ClippingsTone.clippingstoneid).all()]


class ClippingsTypes(object):
	"clippingstypes"
	@classmethod
	def getLookUp(cls, params):
		""" get a listing """
		data = [dict(id=row.clippingstypeid, name='<i class="fa %s" aria-hidden="true"></i>&nbsp;%s' % (row.icon_name, row.clippingstypedescription))
		        for row in session.query(ClippingsTypes).order_by(ClippingsTypes.clippingstypeid).all()]

		if "show_all" in params:
			data.insert(0, dict(id=-1,name='<i class="fa fa-align-justify" aria-hidden="true"></i>&nbsp;All Types'))

		return data

class ServerTypes(object):
	"serverstypes"
	@classmethod
	def getLookUp(cls, params):
		""" get a listing """
		data = [dict(id=row.servertypeid, name=row.servertypename)
		        for row in session.query(ServerTypes).order_by(ServerTypes.servertypeid).all()]

		return data

class MediaAccessTypes(BaseSql):
	""" media acceess types """

	@classmethod
	def getLookUp(cls, params):
		""" get a lookup list """

		def _convert(row):
			""""local convert"""
			return dict(id=row.mediaaccesstypeid, name=row.mediaaccesstypedescription)

		data = [_convert(row) for row in session.query(MediaAccessTypes).order_by(MediaAccessTypes.mediaaccesstypedescription).all()]

		return data

class TaskTypeStatus(BaseSql):
	"TaskTypeStatus"
	List_Types = """SELECT tasktypestatusid,tasktypestatusdescription FROM internal.tasktypestatus ORDER BY tasktypestatusid"""

	@classmethod
	def getLookUp(cls, params):
		""" get a lookup list """
		def _convert(data):
			""""local convert"""
			return [dict(id=row.tasktypestatusid, name=row.tasktypestatusdescription)
					for row in data.fetchall()]
		return cls.sqlExecuteCommand(text(TaskTypeStatus.List_Types), None, _convert)

class Publishers(BaseSql):
	"Publishers"
	List_Types = """SELECT publisherid,publishername FROM internal.publishers ORDER BY publisherid"""

	@classmethod
	def getLookUp(cls, params):
		""" get a lookup list """
		def _convert(data):
			""""local convert"""
			return [dict(id=row.publisherid, name=row.publishername)
					for row in data.fetchall()]
		return cls.sqlExecuteCommand(text(Publishers.List_Types), None, _convert)

#########################################################
# load tables from db
EmailSendTypes.mapping = Table('emailsendtypes', metadata, autoload=True, schema="internal")
UnSubscribeReason.mapping = Table('unsubscribereason', metadata, autoload=True, schema="sales")
CustomerTypes.mapping = Table('customertypes', metadata, autoload=True, schema="internal")
UserTypes.mapping = Table('usertypes', metadata, autoload=True, schema="internal")
SortOrder.mapping = Table('sortorder', metadata, autoload=True, schema='internal')
Frequencies.mapping = Table('frequencies', metadata, autoload=True, schema="internal")
PRmaxOutletTypes.mapping = Table('prmax_outlettypes', metadata, autoload=True, schema='internal')
FinancialStatus.mapping = Table('financialstatus', metadata, autoload=True, schema='internal')
AdvanceFeaturesStatus.mapping = Table('advancefeaturesstatus', metadata, autoload=True, schema='research')
PaymentReturnReason.mapping = Table('paymentreturnreason', metadata, autoload=True, schema='internal')
CustomerOrderStatus.mapping = Table('customerorderstatus', metadata, autoload=True, schema='internal')
VatCodes.mapping = Table('vatcode', metadata, autoload=True, schema='internal')
Countries.mapping = Table('countries', metadata, autoload=True, schema='internal')
Selection.mapping = Table('selection', metadata, autoload=True, schema='internal')
OutletTypes.mapping = Table('producttypes', metadata, autoload=True, schema="internal")
CustomerStatus.mapping = Table('customerstatus', metadata, autoload=True, schema="internal")
OutletSearchType.mapping = Table('outletsearchtypes', metadata, autoload=True, schema="internal")
CustomerPaymentTypes.mapping = Table('customerpaymenttypes', metadata, autoload=True, schema='internal')
PaymentMethods.mapping = Table('paymentmethods', metadata, autoload=True, schema='internal')
AdjustmentsTypes.mapping = Table('adjustmenttypes', metadata, autoload=True, schema='internal')
TaskStatus.mapping = Table('taskstatus', metadata, autoload=True, schema='internal')
PrmaxModules.mapping = Table('prmaxmodules', metadata, autoload=True, schema='internal')
CustomerSources.mapping = Table('customersources', metadata, autoload=True, schema='internal')
CustomerProducts.mapping = Table('customerproducts', metadata, autoload=True, schema='internal')
CountryTypes.mapping = Table('countrytypes', metadata, autoload=True, schema='internal')
ResearchProjectStatus.mapping = Table('researchprojectstatus', metadata, autoload=True, schema='internal')
SEOCategories.mapping = Table('seocategories', metadata, autoload=True, schema='internal')
SEOStatus.mapping = Table('seostatus', metadata, autoload=True, schema='internal')
SeoPaymentTypes.mapping = Table('seopaymenttypes', metadata, autoload=True, schema='internal')
NewsFeedTypes.mapping = Table('newsfeedtypes', metadata, autoload=True, schema='internal')
OutletPrices.mapping = Table('outletprices', metadata, autoload=True, schema='internal')
IssueStatus.mapping = Table('issuestatus', metadata, autoload=True, schema='internal')
ContactHistoryStatus.mapping = Table('contacthistorystatus', metadata, autoload=True, schema='internal')
QuestionTypes.mapping = Table('questiontypes', metadata, autoload=True, schema='internal')
ClippingPriceServiceLevel.mapping = Table('clippingpriceservicelevel', metadata, autoload=True, schema='internal')
ClippingStatus.mapping = Table('clippingstatus', metadata, autoload=True, schema='internal')
ClippingSource.mapping = Table('clippingsource', metadata, autoload=True, schema='internal')
DistributionTemplateTypes.mapping = Table('distributiontemplatetypes', metadata, autoload=True, schema='internal')
ClippingsTone.mapping = Table('clippingstone', metadata, autoload=True, schema='internal')
ClippingsTypes.mapping = Table('clippingstype', metadata, autoload=True, schema='internal')
MediaAccessTypes.mapping = Table('mediaaccesstypes', metadata, autoload=True, schema='internal')
TaskTypeStatus.mapping = Table('tasktypestatus', metadata, autoload=True, schema='internal')
Publishers.mapping = Table('publishers', metadata, autoload = True, schema='internal')
try:
	ServerTypes.mapping = Table('servertypes', metadata, autoload=True, schema='internal')
except:
	pass

mapper(EmailSendTypes, EmailSendTypes.mapping)
mapper(UnSubscribeReason, UnSubscribeReason.mapping)
mapper(Frequencies, Frequencies.mapping)
mapper(CustomerTypes, CustomerTypes.mapping)
mapper(UserTypes, UserTypes.mapping)
mapper(SortOrder, SortOrder.mapping)
mapper(PRmaxOutletTypes, PRmaxOutletTypes.mapping)
mapper(AdvanceFeaturesStatus, AdvanceFeaturesStatus.mapping)
mapper(FinancialStatus, FinancialStatus.mapping)
mapper(PaymentReturnReason, PaymentReturnReason.mapping)
mapper(CustomerOrderStatus, CustomerOrderStatus.mapping)
mapper(VatCodes, VatCodes.mapping)
mapper(Countries, Countries.mapping)
mapper(Selection, Selection.mapping)
mapper(OutletTypes, OutletTypes.mapping)
mapper(CustomerStatus, CustomerStatus.mapping)
mapper(OutletSearchType, OutletSearchType.mapping)
mapper(CustomerPaymentTypes, CustomerPaymentTypes.mapping)
mapper(PaymentMethods, PaymentMethods.mapping)
mapper(AdjustmentsTypes, AdjustmentsTypes.mapping)
mapper(TaskStatus, TaskStatus.mapping)
mapper(PrmaxModules, PrmaxModules.mapping)
mapper(CustomerSources, CustomerSources.mapping)
mapper(CustomerProducts, CustomerProducts.mapping)
mapper(CountryTypes, CountryTypes.mapping)
mapper(ResearchProjectStatus, ResearchProjectStatus.mapping)
mapper(SEOCategories, SEOCategories.mapping)
mapper(SEOStatus, SEOStatus.mapping)
mapper(SeoPaymentTypes, SeoPaymentTypes.mapping)
mapper(NewsFeedTypes, NewsFeedTypes.mapping)
mapper(OutletPrices, OutletPrices.mapping)
mapper(IssueStatus, IssueStatus.mapping)
mapper(ContactHistoryStatus, ContactHistoryStatus.mapping)
mapper(QuestionTypes, QuestionTypes.mapping)
mapper(ClippingPriceServiceLevel, ClippingPriceServiceLevel.mapping)
mapper(ClippingStatus, ClippingStatus.mapping)
mapper(ClippingSource, ClippingSource.mapping)
mapper(DistributionTemplateTypes, DistributionTemplateTypes.mapping)
mapper(ClippingsTone, ClippingsTone.mapping)
mapper(ClippingsTypes, ClippingsTypes.mapping)
mapper(MediaAccessTypes, MediaAccessTypes.mapping)
mapper(TaskTypeStatus, TaskTypeStatus.mapping)
mapper(Publishers, Publishers.mapping )
mapper(ServerTypes, ServerTypes.mapping)


