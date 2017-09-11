# -*- coding: utf-8 -*-
"Email Templates"
#-----------------------------------------------------------------------------
# Name:        email.py
# Purpose:     handles all the action to maintain the email template and
#						collateral systems
# Author:       Chris Hoy
#
# Created:     09/03/2009
# RCS-ID:      $Id:  $
# Copyright:   (c) 2009

#-----------------------------------------------------------------------------

from turbogears import expose, validate, error_handler, exception_handler
from ttl.tg.errorhandlers import  pr_form_error_handler, pr_std_exception_handler
from ttl.tg.controllers import SecureController
from ttl.base import stdreturn, duplicatereturn, errorreturn, formreturn, statusreturn
from ttl.tg.validators import std_state_factory, PrGridSchema, BooleanValidator, ISODateValidator, ISOTimeValidator, RestSchema, \
     TgInt, Int2Null
from prcommon.model import SEORelease
from prcommon.model import EmailTemplatesAttachements
from prcommon.sitecontrollers.distribution.distributiontemplates import DistributionTemplatesController
from prmax.utilities.validators import PrFormSchema, validators
from prmax.model import EmailTemplates, EmailQueue, WordToHtml, EmailTemplateList, ListMemberDistribution, List
from prmax.sitecontrollers.seopressreleases import SEOPressReleaseController

class WordToHtmlIdSchema(PrFormSchema):
	""" report id schema"""
	mswordqueueid = validators.Int()

class PrEmailtemplateSchema(PrFormSchema):
	""" Standard Schema for email templates"""
	emailtemplateid = validators.Int()
	delete_collateral = BooleanValidator()

class PrEmailTemplateUpdateSchema(PrFormSchema):
	""" Standard Schema for email templates"""
	emailtemplateid = validators.Int()
	delete_collateral = BooleanValidator()
	include_view_as_link = BooleanValidator()
	embargoed = BooleanValidator()
	embargo_date = ISODateValidator()
	embargo_time = ISOTimeValidator()
	emailsendtypeid = validators.Int(default=1)
#	clientid = Int2Null()
	templateheaderid = Int2Null()
	templatefooterid = Int2Null()

class PrListIdSchema(PrFormSchema):
	""" Standard Schema for email templates"""
	listid = validators.Int()
	emailtemplateid = validators.Int()

class EmailTemplateListSchema(PrFormSchema):
	""" Standard Schema for email templates"""
	emailtemplatelistid = validators.Int()

class EmailTemplateRenameSchema(PrFormSchema):
	""" email templates"""
	emailtemplateid = validators.Int()
	emailtemplatename = validators.String(not_empty=True)
	clientid = Int2Null()

class EmailTemplateAddSchema(PrFormSchema):
	""" email templates"""
	emailtemplatename = validators.String(not_empty=True)
	clientid = Int2Null()

class PrEmailPreviewSchema(PrFormSchema):
	""" Standard Schema for email templates"""
	include_view_as_link = BooleanValidator()
	embargoed = BooleanValidator()
	embargo_date = ISODateValidator()
	embargo_time = ISOTimeValidator()
	templateheaderid = Int2Null()
	templatefooterid = Int2Null()


class PrEmailTemplateSendSchema(PrFormSchema):
	""" Standard Schema for email templates"""
	emailtemplateid = validators.Int()
	embargoed = BooleanValidator()
	embargo_date = ISODateValidator()
	embargo_time = ISOTimeValidator()
	templateheaderid = Int2Null()
	templatefooterid = Int2Null()


class SEOPageSchema(PrFormSchema):
	""" SEO press release wizard page """
	seopressrelease = BooleanValidator()
	emailtemplateid = validators.Int()
	clientid = TgInt()
	seoimageid = TgInt()
	cat_1 = BooleanValidator()
	cat_2 = BooleanValidator()
	cat_3 = BooleanValidator()
	cat_4 = BooleanValidator()
	cat_5 = BooleanValidator()
	cat_6 = BooleanValidator()
	cat_7 = BooleanValidator()
	cat_8 = BooleanValidator()
	cat_9 = BooleanValidator()
	cat_10 = BooleanValidator()
	cat_11 = BooleanValidator()
	cat_12 = BooleanValidator()
	cat_13 = BooleanValidator()
	cat_14 = BooleanValidator()
	cat_15 = BooleanValidator()
	cat_16 = BooleanValidator()
	cat_17 = BooleanValidator()
	cat_18 = BooleanValidator()
	cat_19 = BooleanValidator()
	cat_20 = BooleanValidator()
	cat_21 = BooleanValidator()
	cat_22 = BooleanValidator()
	cat_23 = BooleanValidator()
	cat_24 = BooleanValidator()
	cat_25 = BooleanValidator()


class  PREmailDistSchema(PrFormSchema):
	""" schema """
	listmemberdistributionid = validators.Int()



class EmailController(SecureController):
	""" Email Controller"""

	seorelease = SEOPressReleaseController()
	distributiontemplates = DistributionTemplatesController()

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=EmailTemplateAddSchema(), state_factory=std_state_factory)
	def templates_add(self, *args, **params):
		""" adds a new email template """

		if EmailTemplates.exists(params):
			return duplicatereturn()

		params['emailtemplateid'] = EmailTemplates.add(params)

		return stdreturn(data=EmailTemplates.get(params, False))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrEmailtemplateSchema(), state_factory=std_state_factory)
	def templates_get(self, *args, **params):
		""" get the details for a specific email template """

		return stdreturn(data=EmailTemplates.get(params, True))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrEmailtemplateSchema(), state_factory=std_state_factory)
	def templates_get_min(self, *args, **params):
		""" get the details for a specific email template """

		return stdreturn(data=EmailTemplates.get(params, False))


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrEmailtemplateSchema(), state_factory=std_state_factory)
	def template_delete(self, *args, **params):
		""" get the details for a specific email template """
		return stdreturn(data=EmailTemplates.delete(params))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrEmailTemplateUpdateSchema(), state_factory=std_state_factory)
	def templates_update(self, *args, **params):
		""" update a specific email template """

		EmailTemplates.update(params)

		return stdreturn()


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrEmailtemplateSchema(), state_factory=std_state_factory)
	def template_pull(self, *args, **params):
		""" Pull a sent enabargoed release """

		return statusreturn(EmailTemplates.pull_release(params))

	@expose("text/html")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrEmailtemplateSchema(), state_factory=std_state_factory)
	def templates_text(self, *args, **params):
		""" get the html text associated with the template """

		return EmailTemplates.get_text(params)

	@expose(template="mako:prmax.templates.emails.analysis_view")
	@validate(validators=PrEmailtemplateSchema(), state_factory=std_state_factory)
	def templates_analysis(self, *args, **params):
		""" get the html text associated with the template """

		return EmailTemplates.get_analysis(params)

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrEmailtemplateSchema(), state_factory=std_state_factory)
	def templates_save_as_standing(self, *args, **params):
		""" Save result too a new standing list """

		if List.Exits(params['customerid'], params['listname']):
			return duplicatereturn()

		return stdreturn(
		            data=List.addFromDistribution(
		              params['customerid'],
		              params['listname'],
		              params["emailtemplateid"]))

	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)
	def templates_list(self, *argv, **params):
		""" returns a list of templates """

		return EmailTemplates.get_list(params)

	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)
	def templates_list_grid(self, *argv, **params):
		""" returns a list of templates """

		return EmailTemplates.get_grid_page(params)

	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=RestSchema(), state_factory=std_state_factory)
	def rest_distributions(self, *argv, **params):
		""" returns a list of templates """

		if argv:
			params["emailtemplateid"] = int(argv[0])

		return EmailTemplates.rest_grid_page(params)


	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)
	def distribution_view(self, *argv, **params):
		""" what the list was distributed too """

		return ListMemberDistribution.get_grid_page(params)

	@expose("")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PREmailDistSchema(), state_factory=std_state_factory)
	def distribution_details(self, *argv, **params):
		""" return the text part of the message for display"""

		return ListMemberDistribution.get_message_details(params["listmemberdistributionid"])

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrEmailPreviewSchema(), state_factory=std_state_factory)
	def email_preview(self, *args, **params):
		""" send a preview of an email """

		# update the content before sending the preview
		EmailTemplates.update_content(params)

		EmailTemplates.preview(params)
		return stdreturn()

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def email_count(self, *args, **params):
		""" Count of how many email to send """

		return stdreturn(data=EmailQueue.send_email_list_count(params))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=SEOPageSchema(), state_factory=std_state_factory)
	def seo_page_next(self, *args, **params):
		""" move the press release wizard from the seo page """

		seoreleaseid = SEORelease.save_release(params)
		data = EmailQueue.send_email_list_count(params)
		if seoreleaseid:
			data["seoreleaseid"] = seoreleaseid

		return stdreturn(data=data)

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrEmailTemplateSendSchema(), state_factory=std_state_factory)
	def email_send(self, *args, **params):
		""" distribute the list of email """

		EmailTemplates.update_content(params)

		if EmailTemplates.check_for_email_limit_exceeded(params["emailtemplateid"]) == True:
			return errorreturn("Daily Email Limited Exceeded please contact support")

		# update the content before senfing the list
		EmailTemplates.markassent(params)

		return stdreturn(data=dict(sent=0, total=0))

	@expose("")
	def wordtohtml_add(self, *args, **params):
		""" return the template for an outlet based upont ht etype of outlet"""

		state = std_state_factory()
		params["customerid"] = state.customerid
		params["userid"] = state.u.user_id
		try:
			if WordToHtml.is_word_file(params['wordtohtml_file']):
				data = stdreturn(
				  mswordqueueid=WordToHtml.add(params),
				  data=dict(statusid=0))
			else:
				mswordqueueid = WordToHtml.add_as_html(params),
				data = stdreturn(mswordqueueid=mswordqueueid,
				                data=dict(statusid=2))
		except:
			data = errorreturn(message="Problem Converting Document")

		return formreturn(data)

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=WordToHtmlIdSchema(), state_factory=std_state_factory)
	def mswordtohtml_status(self, *args, **params):
		""" get the status of a specific report"""
		statusid = WordToHtml.status(params['mswordqueueid'])
		if statusid == 2:
			html = WordToHtml.gethtml(params['mswordqueueid'])
		else:
			html = None

		return stdreturn(data=dict(statusid=statusid, html=html))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=WordToHtmlIdSchema(), state_factory=std_state_factory)
	def mswordtohtml_html(self, *args, **params):
		""" get the status of a specific report"""

		return stdreturn(html=WordToHtml.gethtml(params['mswordqueueid']))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrEmailtemplateSchema(), state_factory=std_state_factory)
	def templates_update_build_list(self, *args, **params):
		""" build a list of the attached list's into a single list """

		listid = EmailTemplates.build_list(params)
		return stdreturn(listid=listid)


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrEmailtemplateSchema(), state_factory=std_state_factory)
	def templates_update_rebuild_list(self, *args, **params):
		""" update the attached list based on the list of list and the option the user has
		selected """

		listid = EmailTemplates.rebuild_list(params)

		return stdreturn(listid=listid)

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrListIdSchema(), state_factory=std_state_factory)
	def template_lists_add(self, *args, **params):
		"""Add a list to the templates list of lists """

		return stdreturn(data=EmailTemplateList.add_list(params))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=EmailTemplateListSchema(), state_factory=std_state_factory)
	def templatelist_delete(self, *args, **params):
		"""Delete a list to the templates list of lists """

		EmailTemplateList.delete(params)
		return stdreturn()


	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=EmailTemplateListSchema(), state_factory=std_state_factory)
	def templatelist_update_selection(self, *args, **params):
		"""  Update the selection value for a list """

		return stdreturn(data=EmailTemplateList.update(params))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=EmailTemplateRenameSchema(), state_factory=std_state_factory)
	def template_rename(self, *args, **params):
		""" rename an email template """

		# does exist?
		if EmailTemplates.exists(params):
			return duplicatereturn()

		EmailTemplates.rename(params)

		return stdreturn(data=EmailTemplates.get(params))

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	@validate(validators=EmailTemplateRenameSchema(), state_factory=std_state_factory)
	def template_duplicate(self, *args, **params):
		""" rename an email template """

		# does exist?
		if EmailTemplates.exists(params):
			return duplicatereturn()

		# rename
		return stdreturn(data=dict(emailtemplateid=EmailTemplates.duplicate(params)))


	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrGridSchema(), state_factory=std_state_factory)
	def attachement_list(self, *argv, **params):
		""" list of attachements """

		return EmailTemplatesAttachements.get_grid_page(params)

	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def attachement_add_collateral(self, *argv, **params):
		""" add a file from the collateral store """
		params["emailtemplatesattachementid"] = EmailTemplatesAttachements.attachement_add_collateral(params)
		return stdreturn(data=EmailTemplatesAttachements.get(params))

	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def attachement_delete(self, *argv, **params):
		""" Delete an attachment """
		EmailTemplatesAttachements.attachement_delete(params)
		return stdreturn()

	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def attachement_add_coll(self, *argv, **params):
		""" add attachment from a collateral """
		params["emailtemplatesattachementid"] = EmailTemplatesAttachements.attachement_add_collateral(params)
		return stdreturn(data=EmailTemplatesAttachements.get(params))

	@expose("")
	def attachement_add_file(self, *args, **params):
		""" add a file from the os """

		state = std_state_factory()
		params["customerid"] = state.customerid
		params["userid"] = state.u.user_id
		try:
			params["emailtemplatesattachementid"] = EmailTemplatesAttachements.attachement_add_file(params)
			data = stdreturn(data=EmailTemplatesAttachements.get(params))
		except:
			data = errorreturn(message="Problem Adding Attachment File")

		return formreturn(data)

	@expose("json")
	@error_handler(pr_form_error_handler)
	@exception_handler(pr_std_exception_handler)
	def email_test_server(self, *args, **params):
		""" send a test email for a new customer email server """


		EmailTemplates.test_email_server(params)
		return stdreturn()



