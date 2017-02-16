# -*- coding: utf-8 -*-
""" Contoller to access the Updateum interface  """
#-----------------------------------------------------------------------------
# Name:        updatum monitoring.py
# Purpose:     Interfce to the updatum monitoring System
#
# Author:      Chris Hoy
#
# Created:     27/06/2011
# RCS-ID:      $Id:  $
# Copyright:   (c) 2011

#-----------------------------------------------------------------------------

from turbogears import expose, validate, exception_handler, config
from ttl.tg.errorhandlers import pr_std_exception_handler_text
from ttl.tg.controllers import SecureController, OpenSecureController
from ttl.tg.validators import std_state_factory, PrFormSchema
from ttl.ttlcoding import TTLCoding
from prcommon.model import User, Customer
import prcommon.Constants as Constants
from  cherrypy import request

class UpdatumController(SecureController):
	""" handles the bounced email """

	@expose("html/text")
	@exception_handler(pr_std_exception_handler_text)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def updatum_view(self, *args, **inparams):
		""" create updatum page """

		customer = Customer.query.get(inparams["customerid"])
		user = User.query.get ( inparams["userid"] )
		enc = TTLCoding()

		params = dict ( updatum_username = user.updatum_username,
		                updatum_password = enc.decode ( user.updatum_password ),
		                web_address = config.get('prmax.web'))

		if request.headers["user-agent"].find("Safari/") != -1 and \
		   request.headers["user-agent"].find("Chrome/") == -1:
			return """<div>
			<p>Monitoring has been opened in a seperate window</p>
			<iframe id="show_monitoring" scrolling="yes" frameborder="0" width="100%%" height="100%%" src="%(web_address)supdatum/updatum_safari" >
			</iframe>
			</div>""" % params
		else:
			#if  customer.customertypeid == Constants.CustomerType_SolididMedia:
			#	return """<iframe scrolling="yes" frameborder="0" width="100%%" height="100%%" src="http://social.solidmediagroup.com/?username=%(updatum_username)s&password=%(updatum_password)s"></iframe>""" % params
			#else:
			return """<iframe scrolling="yes" frameborder="0" width="100%%" height="100%%" src="http://portal.cyberwatcher.com/v55/Login.aspx?username=%(updatum_username)s&password=%(updatum_password)s&logoutReturnUrl=http://app.prmax.co.uk/updatumerror/logout&loginErrorUrl=http://app.prmax.co.uk/updatumerror/error"></iframe>""" % params


	@expose("html/text")
	@exception_handler(pr_std_exception_handler_text)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def updatum_safari(self, *args, **inparams):
		"""Attempt to allow login from safaria"""

		customer = Customer.query.get(inparams["customerid"])
		user = User.query.get ( inparams["userid"] )
		enc = TTLCoding()

		params = dict ( updatum_username = user.updatum_username,
		                updatum_password = enc.decode ( user.updatum_password ))

		#if  customer.customertypeid == Constants.CustomerType_SolididMedia:
		#	return  """<div style="width:1px;height:1px;overflow:hidden"><form id="sub_btn" action="http://social.solidmediagroup.com" method="post" target="blank">
		#				<input name="ReturnUrl" type="hidden" value="" />
		#				<input name="UserName" type="text" value="%(updatum_username)s" />
		#				<input name="Password" type="password" value="%(updatum_password)s" />
		#				<input type="submit" value="OK" />
		#				</form>
		#				<script>
		#				document.getElementById("sub_btn").submit();
		#				</script></div>""" % params
		#else:
		return  """<div style="width:1px;height:1px;overflow:hidden"><form id="sub_btn" action="http://portal.cyberwatcher.com/v55/Account/Login" method="post" target="blank">
			<input name="ReturnUrl" type="hidden" value="" />
			<input name="UserName" type="text" value="%(updatum_username)s" />
			<input name="Password" type="password" value="%(updatum_password)s" />
			<input type="submit" value="OK" />
			</form>
			<script>
			document.getElementById("sub_btn").submit();
			</script></div>""" % params


class UpdatumErrorController(OpenSecureController):
	"""Eror Hamdle"""
	@expose("text/html")
	def error(self, *args, **inparams):
		""" error accessig updatum """

		return "An Error has Occured"

	@expose("text/html")
	def logout(self, *args, **inparams):
		""" logout done """

		return "Logged Out"
