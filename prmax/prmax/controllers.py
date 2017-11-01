# -*- coding: utf-8 -*-
"prmax controller"
#-----------------------------------------------------------------------------
# Name:        controllers.py
# Purpose:     Main controller for tg
#
# Author:       Chris Hoy
#
# Created:     28/07/2008
# Copyright:   (c) 2008
#-----------------------------------------------------------------------------
import logging
from turbogears import controllers, expose, config, identity, redirect, view, exception_handler, validate, visit
from turbogears.database import session
from cherrypy import request, response
from datetime import datetime, timedelta

from prmax.utilities.common import addConfigDetails
from prmax.model import Customer, User, Preferences

from prmax.sitecontrollers.layout import LayoutController
from prmax.sitecontrollers.search import SearchController
from prmax.sitecontrollers.general import GeneralController
from prmax.sitecontrollers.maintenance import MaintenanceController
from prmax.sitecontrollers.display import DisplayController
from prmax.sitecontrollers.interests import InterestController
from prmax.sitecontrollers.employee import EmployeeController
from prmax.sitecontrollers.lists import ListController
from prmax.sitecontrollers.report import ReportController
from prmax.sitecontrollers.projects import ProjectController
from prmax.sitecontrollers.contact import ContactController
from prmax.sitecontrollers.outlets import OutletController
from prmax.sitecontrollers.customer import CustomerController
from prmax.sitecontrollers.admin.admin import ExternalAdminController, InternalAdminController
from prmax.sitecontrollers.geographical import GeographicalController
from prmax.sitecontrollers.emails import EmailController
from prmax.sitecontrollers.open import OpenController
from prmax.sitecontrollers.user import UserController
from prmax.sitecontrollers.collateral import ICollateralController, ECollateralController, EmailReadController, EClickThroughtController
from prmax.sitecontrollers.roles import PRMaxRolesController
from prmax.sitecontrollers.dataadmin import DataAdminController
from prmax.sitecontrollers.marketing import MarketingController
from prmax.sitecontrollers.crm import CrmController
from prmax.sitecontrollers.advance import AdvanceController
from prmax.sitecontrollers.updatum import UpdatumController, UpdatumErrorController
from prmax.sitecontrollers.clients import ClientController
from prmax.sitecontrollers.admin.newsfeed import NewsFeedExternalController
from prmax.sitecontrollers.partners.partners import PartnersController
from prmax.sitecontrollers.pprrequest import PRRequestController
from prmax.sitecontrollers.unsubscribe import UnsubscribeController
from prmax.sitecontrollers.clippings.clippings import ClippingsController
import prmax.Constants as Constants
from prcommon.model import LoginTokens, CustomerGeneral, CustomerAccessLog
from prcommon.model import ClippingsGeneral
from prcommon.model.clippings.clippingselection import ClippingSelection
from prcommon.sales.salesorderconformation import SendOrderConfirmationBuilder, UpgradeConfirmationBuilder
from prcommon.sitecontrollers import QueryController
from prcommon.sitecontrollers.languages import LanguageController
from prcommon.sitecontrollers.clippingstypes import ClippingsTypeController
from prcommon.sitecontrollers.customeremailserver import CustomerEmailServerController
from prcommon.sitecontrollers.emails import EmailFooterController, EmailHeaderController, EmailLayoutController
from prcommon.sitecontrollers.search import SearchController as SearchController2
from prcommon.sitecontrollers.crm.statements import StatementController
from ttl.tg.validators import std_state_factory, PrFormSchema
from ttl.tg.errorhandlers import pr_std_exception_handler_text

LOGGER = logging.getLogger("prmax")

class Root(controllers.RootController):
	"Main tg root"
	tg_cookie_name = config.get("visit.cookie.name", "prmax-visit")
	layout = LayoutController()
	search = SearchController()
	search2 = SearchController2()
	maintenance = MaintenanceController()
	display = DisplayController()
	interests = InterestController()
	employees = EmployeeController()
	contacts = ContactController()
	lists = ListController()
	reports = ReportController()
	projects = ProjectController()
	outlets = OutletController()
	customers = CustomerController()
	eadmin = ExternalAdminController()
	iadmin = InternalAdminController()
	geographical = GeographicalController()
	emails = EmailController()
	common = OpenController()
	user = UserController()
	icollateral = ICollateralController()
	collateral = ECollateralController()
	track = EClickThroughtController()
	roles = PRMaxRolesController()
	dataadmin = DataAdminController()
	marketing = MarketingController()
	crm = CrmController()
	query = QueryController()
	advance = AdvanceController()
	v = EmailReadController()
	updatum = UpdatumController()
	updatumerror = UpdatumErrorController()
	clients = ClientController()
	newsitems = NewsFeedExternalController()
	partners = PartnersController()
	prrequest = PRRequestController()
	unsubscribe = UnsubscribeController()
	clippings = ClippingsController()
	languages = LanguageController()
	clippingstypes = ClippingsTypeController()
	customeremailserver = CustomerEmailServerController()
	emailheader = EmailHeaderController()
	emailfooter = EmailFooterController()
	emaillayout = EmailLayoutController()
	statement = StatementController()


	@expose("")
	def default(self, *args, **kw):
		""" Default page handler for a missing page
		captures and log it"""

		return GeneralController.WebSiteCommonFile(self, args, kw)


	@expose(template="prmax.templates.locked")
	def locked(self, *args, **kw):

		template = "prmax.templates.locked"
		fields = addConfigDetails(
		  dict(message='You have been locked. Please contact the system administrator',
		       support_phone="01582 380 198",
		       support_email="support@prmax.co.uk"
		       )
		)
		return view.render(fields, template=template)


	@expose("")
	def index(self, *args, **kw):
		" root index page"

		return ""

	LOGIN_PAGES = (("blueboo", "prmax.templates.logins/blueboo"),
	               ("ipcb", "prmax.templates.logins/ipcb"),
	               ("solidmediagroup", "prmax.templates.logins/solidmedia"),
	               ("relations", "prmax.templates.logins/solidmedia"),
	               ("mynewsdesk", "prmax.templates.logins/mynewsdesk"),
	               ("deperslijst", "prmax.templates.logins/deperslijst"),
	               ("professional", "mako:prmax.templates.logins.professional"),
	               ("levelcert", "mako:prmax.templates.logins.levelcert"))

	@expose("text/html")
	def login(self, forward_url=None, previous_url=None, *args, **kw):
		"std login method"

		if identity.current.anonymous:
			user = None
			if "user_name" in request.body_params and "password" in request.body_params:
				user = User.by_user_name(request.body_params['user_name'])
			elif "prmax_user_name" in request.params and "prmax_password" in request.params:
				user = User.by_user_name(request.params['prmax_user_name'])
			if user:
				user.invalid_login_tries += 1
				if user.invalid_login_tries >= 10:
					raise redirect("/locked")

		msg = None
		if not identity.current.anonymous \
			and identity.was_login_attempted() \
			and not identity.get_identity_errors():

			user = User.by_user_name(request.body_params['user_name'])
			customer = Customer.query.get(identity.current.user.customerid)
			if user.invalid_login_tries >= 10:
				raise redirect("/locked")
			User.reset_invalid_login_tries(user.user_id, True)
			#Clear current user ClippingSelection table
			ClippingsGeneral.clear_user_selection({'userid':user.user_id}, True)
			# check too see if a customer is a noninteractive on if so then LOGGER it out
			if customer.isFinancialOnly():
				identity.current.user.force_logout()
				response.status = 403
				raise redirect("/login")

			if customer.fail_ip_test(request.headers.get("X-Forwarded-For", request.remote.ip)):
				if identity.current.user.usertypeid != Constants.UserType_Support:
					session.add(CustomerAccessLog(customerid=identity.current.user.customerid,
					                              userid=identity.current.user.user_id,
					                              levelid=CustomerAccessLog.IPFAILED,
					                              username=identity.current.user.user_name))
				identity.current.user.force_logout()
				response.status = 403
				raise redirect("/login", dict(message="Forbidden"))

			print "post test"
			# clear connections
			try:
				# for 1.5
				sess = request.cookie.get(Root.tg_cookie_name, None)
				if sess:
					User.logout_other_users(sess.value, identity.current.user.user_id)
			except:
				pass

			raise redirect("/start")

		try:
			User.setTriedToLogin(request.simple_cookie.get(Root.tg_cookie_name, None))
		except:
			# This is 1.5
			try:
				User.setTriedToLogin(request.cookie.get(Root.tg_cookie_name, None))
			except:
				LOGGER.exception("login")

		forward_url = None
		try:
			previous_url = request.path
		except:
			previous_url = request.path_info

		if identity.was_login_attempted() or identity.get_identity_errors():
			msg = None
		else:
			msg = None
			forward_url = request.headers.get("Referer", "/")

		if "message" in kw:
			msg = kw["message"]

		response.status = 403

		# This is for P3P security and setting cookies in a iframe ask for by ai media
		# Link is http://adamyoung.net/IE-Blocking-iFrame-Cookies
		response.headers["P3P"] = Constants.Security_P3P

		template = "prmax.templates.login"
		# get host for https
		hostname = request.headers.get("X-Forwarded-Host")
		if not hostname:
			hostname = request.headers.get("HOST")
		hostname = hostname.lower()
		#hostname = "levelcert"

		for row in Root.LOGIN_PAGES:
			if hostname.find(row[0]) != -1:
				template = row[1]
				break

		fields = addConfigDetails(
		  dict(message=msg,
		       previous_url=previous_url,
		       logging_in=True,
		       original_parameters=request.params,
		       forward_url=forward_url))

		return view.render(fields, template=template)

	@expose()
	def logout(self, *argv, **kw):
		"common logout method"

		#Clear current user ClippingSelection table
		if identity.current.user:
			ClippingsGeneral.clear_user_selection({'userid':identity.current.user.user_id}, True)
		# clear connections
		try:
			try:
				sess = request.simple_cookie.get(Root.tg_cookie_name, None)
			except:
				# for 1.5
				sess = request.cookie.get(Root.tg_cookie_name, None)
			if sess:
				User.logout_other_users(sess.value, identity.current.user.user_id)
		except:
			pass
		try:
			identity.current.logout()

		except:
			LOGGER.exception("logout")

		raise redirect(kw.get("ref", "/login"))

	@expose("text/html")
	@identity.require(identity.not_anonymous())
	def start(self, *args, **kw):
		"""This is the standard page for application starts
		"""

		kw['message1'] = 'Please enter a new password'
		kw['message2'] = ''
		if 'pssw_name' in kw and 'pssw_conf' in kw:
			if kw['pssw_name'] != kw['pssw_conf']:
				kw['message1'] = 'Please re-type the password'
				kw['message2'] = 'New password and Confirm do not match.'
			else:
				kw['user_id'] = identity.current.user.user_id
				Preferences.update_password(kw)
				if identity.current.user.force_change_pssw:
					kw['message1'] = 'Please enter a valid password'
					kw['message2'] = 'Minimum length of 8 characters, at least one character upper case, one character lower case and one digit.'


		cust = Customer.query.get(identity.current.user.customerextid)
		org_template = template = cust.get_start_point()
		if identity.current.user.force_change_pssw:
			template = 'prmax.templates.eadmin/change_password'
		if cust.extended_security == True:
			startdate = datetime.now() - timedelta(days = 60)
			if startdate >= identity.current.user.last_change_pssw:
				template = 'prmax.templates.eadmin/change_password'
		if identity.current.user.invalid_login_tries >= 10:
			raise redirect('/login')

		User.setLoggedIn(identity.current.user.user_id)
		User.reset_invalid_login_tries(identity.current.user.user_id, True)
		#Clear current user ClippingSelection table
		ClippingsGeneral.clear_user_selection({'userid':identity.current.user.user_id}, True)
		if identity.current.user.usertypeid != Constants.UserType_Support and identity.current.user.force_change_pssw == False:
			session.add(CustomerAccessLog(customerid=identity.current.user.customerid,
		                                  userid=identity.current.user.user_id,
		                                  levelid=CustomerAccessLog.LOGGEDIN,
		                                  username=identity.current.user.user_name))

		# this is a financial only customer cannot be used for anything else
		if cust.isFinancialOnly():
			raise redirect("/login")
		elif cust.getConcurrentExeeded(identity.current.user.user_id):
			template = 'prmax.templates.eadmin/licenceexceeded'
			kw["users"] = cust.getLoggedinUserExclude(identity.current.user.user_id)
		elif cust.customerstatusid == Constants.Customer_Awaiting_Activation or not cust.has_started():
			template = 'prmax.templates.eadmin/awaitingactivation'
		elif cust.has_expired() or cust.customerstatusid == Constants.Customer_Inactive:
			# customer is inactive or licence ex
			if cust.isdemo:
				kw["para_1"] = "Your free evaluation period has now expired."
			else:
				kw["para_1"] = "Your PRmax subscription has now expired."
			template = 'prmax.templates.eadmin/relicence'
		elif cust.is_partner() is False and cust.abouttoexpire() and kw.get("source", "").lower() != "licencereminder":
			# customer's licence is about to expire s
			if cust.isdemo:
				kw["para_1"] = "Your free evaluation period is about to expire."
				kw["button_1"] = "Continue Trial"
			else:
				kw["para_1"] = "Your PRmax subscription is about to expire."
				kw["button_1"] = "Continue to PRmax"
			template = "prmax.templates.eadmin/licencereminder"
		elif cust.confirmation_new_tandc:
			template = 'prmax.templates.eadmin/update_tandc'
		elif cust.confirmation_accepted:
			response.headers["Content-type"] = "text/html;charset=utf-8"
			orderconfirm = SendOrderConfirmationBuilder()
			return orderconfirm.custconfirm(cust.customerid)
		elif cust.upgrade_confirmation_accepted:
			response.headers["Content-type"] = "text/html;charset=utf-8"
			orderupconfirm = UpgradeConfirmationBuilder()
			return orderupconfirm.custconfirm(cust.customerid)
		elif cust.updatum is True and identity.current.user.hasmonitoring is True and \
		     identity.current.user.monitoring_accepted is False:
			template = 'prmax.templates.eadmin/monitoringconfirmation'
		response.headers["P3P"] = Constants.Security_P3P

		if template == org_template and identity.current.user.usertypeid != Constants.UserType_Support and identity.current.user.force_change_pssw == False:
			session.add(CustomerAccessLog(customerid=identity.current.user.customerid,
			                              userid=identity.current.user.user_id,
					                          levelid=CustomerAccessLog.MAINSYSTEMACCESSED,
			                              username=identity.current.user.user_name))

		return view.render(addConfigDetails(kw), template=template)

	@expose(template="prmax.templates.login_failed")
	def login_as(self, *args, **kw):
		""" Seemless login """

		try:
			rvalue = addConfigDetails(kw)
			userid = LoginTokens.dologin(kw)
			# added for frame see above
			response.headers["P3P"] = Constants.Security_P3P
		except:
			LOGGER.exception("login_as")
			return rvalue
		else:
			# Delete the current session
			try:
				sess = request.simple_cookie.get(Root.tg_cookie_name, None)
				if sess:
					User.LogoutOtherUsers(sess.value, userid)
			except:
				pass

		raise redirect("/start")

	@expose("text/html")
	@identity.require(identity.not_anonymous())
	@exception_handler(pr_std_exception_handler_text)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def orderconfirmation_accepted(self, *args, **params):
		""" Accept the order confirmation for a logged in customer """

		Customer.accept_order_confirmation(params)
		raise redirect("/start")

	@expose("text/html")
	@identity.require(identity.not_anonymous())
	@exception_handler(pr_std_exception_handler_text)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def upgrade_confirmation_accepted(self, *args, **params):
		""" Accept the upgrade confirmation for a logged in customer """

		Customer.upgrade_upgrade_confirmation(params)

		raise redirect("/start")

	@expose("text/html")
	@identity.require(identity.not_anonymous())
	@exception_handler(pr_std_exception_handler_text)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def new_tanc_accepted(self, *args, **params):
		""" Accept updated T and c """

		CustomerGeneral.new_tanc_accepted(params)

		raise redirect("/start")

	@expose("text/html")
	@identity.require(identity.not_anonymous())
	@exception_handler(pr_std_exception_handler_text)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def monitoringconfirmation_accepted(self, *args, **params):
		""" The user hhas acceptet their responsability for nla/cla """

		Customer.accept_monitoring_confirmation(params)
		raise redirect("/start")


	#@expose("")
	#def reset(self,*argc, **kw):
	#	""" reset """

	#	u = User.query.get(1)
	#	u.password = "qwert"

	#	return ""

