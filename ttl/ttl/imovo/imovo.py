# -*- coding: utf-8 -*-
""" I movo vocuher interface  """
#-----------------------------------------------------------------------------
# Name:        imovo.py
# Purpose:			To interact with the imove voucher system
#
# Author:      Chris Hoy
# Created:	   17/03/2014
# Copyright:   (c) 2014
#-----------------------------------------------------------------------------
import logging
import urllib2
import urllib
import uuid
from datetime import datetime
from ttl.ttlmaths import to_int, from_int
import ttl.Constants as Constants
LOGGER = logging.getLogger("ttl.model")
EXP_DATE_TFN = (datetime(2023, 5, 26), datetime(2024, 3, 13), datetime(2023, 2, 15)) # if web service expiry is set as "26/05/2023" then make it TFN (on test = 13/03/2024)
TFN_DATE = datetime(2100, 1, 1)

class IMovoRespose(object):
	"""Basic response to imovo request"""
	def __init__(self):
		""" vschemes are as follows
		FT007 = card is active at all times - letter inactive and cannot be registered (could be right at start or after a customer has moved house but the old shop is still delivering)
		FT005 = call has been made to echo - letter can be activated (could be right at start or after a customer has moved house and the old shop has stopped delivering)
		FT009 = like FT005 but commuter 5 days - call has been made to echo - letter can be activated
		FTPPR001 = letter registered
		FTPPR002 = letter registered but subscription has stopped so cannot reregister but can be claimed if monies still outstanding
		FTPPR003 = letter registered but card is active for today (due to our file on ftp site)


Daily Mail 3630, 3632 and Scottish version 3631,3633 and Irish version 26586,24669
DMG001                              Live Cards (for info)
DMG005                              Live Letters
DMG006                              Inactive Cards (for info)
DMG007                              Letters ready for Start Date
DMG010                              Non-accruing but redeemable letters for expired subscriptions OR during holidays
DMG011                              Letters awaiting replacement (non-redeemable but accruing, to store value to transfer to replacements, to 4-week max)
Things to note:
- DMG Letters do not need to be activated, they activate automatically and are moved into DMG005 on the Start Date
- They accrue daily from then on, except if the associated card has been used the previous day
- No need for ‘Claim / Card Active’ functionality
- Holiday functionality not required (but can be implemented if you wish)
		"""

		self._status = Constants.IMOVOFAILED
		self._uid = uuid.uuid1()
		self._rdate = datetime.now()
		self._did = "PRTEST01"
		self._message = ""
		self._ctrl_string = ""
		self._vnum = ""
		self._expire_date = None
		self._pub_mapping = {"FT":{"daily": 3596, "sunday": None, "regionals":{"channelislands": {"daily":32479, }, }, "name": "Financial Times", "vschemes": {"register": "FTPPR001", "stop": "FT005", "restart": "FT005",}, "can_register": ("FT005", "FTPPR001", "FTPPR003", "FT009"),},
		                     "DM":{"daily":3630, "sunday": 3632, "regionals":{"scottish": {"daily":3631, "sunday":3633}, "irish":{"daily":26586, "sunday":24669}}, "name": "Daily Mail", "vschemes":{"register": "DMG005", "stop": "DMG005", "restart": "DMG005",}, "can_register":("DMG001", "DMG005", "DMG007"),},
		                     "G":{"daily":3594, "sunday": 3595, "name": "Guardian", "vschemes": {"register": "", "stop": "", "restart": "",}, },
		                     }
		self._day_mapping = {"0": Constants.Monday,
		                     "1": Constants.Tuesday,
		                     "2": Constants.Wednesday,
		                     "3": Constants.Thursday,
		                     "4": Constants.Friday,
		                     "5": Constants.Saturday,
		                     "6": Constants.Sunday,}


	def request_fields(self):
		"get basic fields"

		return dict(UID=self._uid,
		            rdate=self._rdate,
		            origin="Kiosk")

	def paser_response(self, response):
		"""required """
		pass

	@property
	def message(self):
		"get message"
		return self._message

	@property
	def status(self):
		"""get object status"""

		return self._status

	@status.setter
	def status(self, value):
		self._status = value

	@property
	def expiredate(self):
		"expire date"
		return self._expire_date

	@property
	def expiredatedisplay(self):
		"expire date for display eg TFN"
		if self._expire_date == TFN_DATE:
			return "TFN"
		else:
			return self._expire_date.strftime("%d-%b-%y")

	@property
	def ctrl_string(self):
		"control string"
		return self._ctrl_string
"""uid=88934c30-dc3c-11e3-8968-902b3454cdb4|rcode=0|vnum=5215534886|ccode=3635|rval=13.20|expdatetime=13/03/2024 00:00:00|msg=Redemption successful - transaction is worth �13.20|G|1111111"""

class IMovoUpdVoucher(IMovoRespose):
	"""Basic response to imovo request - this adjusts the retailbal and/or scheme on the voucher by the input amount"""
	""" Return values:-
	OK|vnum=4272033838|retailbal=39.60
	OK|vnum=1234567890|vscheme=NEWSCHEME|retailbal=0.45|expdate=13/01/09 23:59:59
	FAIL|INVALIDPARAMS
	"""
	def __init__(self):
		"__init__"

		IMovoRespose.__init__(self)
		self._retailbal = 0

	@property
	def retailbal(self):
		"retailbal"
		return self._retailbal

	def paser_response(self, response):
		"""Get the response and split it up into a list of elements"""
		result = response.read().split("|")
		for entry in result:
			tmp = entry.split("=")
			if len(tmp) > 1:
				(field, value) = tmp
				if field == "vnum":
					self._vnum = value
				if field == "retailbal":
					value = value.replace(",", "")
					self._retailbal = to_int(float(value))
			elif len(tmp) == 1 and tmp[0] == "OK":
				self._status = Constants.IMOVOOK
			elif len(tmp) == 1 and tmp[0] == "FAIL" and len(result) > 1:
				self._message = result[1]
		if self._status == Constants.IMOVOOK:
			self._ctrl_string = "%s|%s" % (self._vnum, self._retailbal)

	@property
	def getdisplay(self):
		"get display"
		return "%s : %s" % (self._vnum, self._retailbal)


class IMovoVoucherRetailBal(IMovoRespose):
	"""Basic response to imovo request"""
	"""OK|vnum=5215534886|mnum=447915073563|retailbal=80.00|expdate=13/03/2024 00:00:00|"""
	def __init__(self):
		"__init__"

		IMovoRespose.__init__(self)
		self._mobile = None
		self._retailbal = 0

	@property
	def mobile(self):
		"mobile phone"
		return self._mobile

	@property
	def retailbal(self):
		"retailbal"
		return self._retailbal

	def paser_response(self, response):
		"""Get the response and split it up into a list of elements"""
		result = response.read().split("|")
		for entry in result:
			tmp = entry.split("=")
			if len(tmp) > 1:
				(field, value) = tmp
				if field == "vnum":
					self._vnum = value
				if field == "mnum":
					self._mobile = value
				if field == "expdate":
					self._expire_date = datetime.strptime(value[:10], "%d/%m/%Y")
					if self._expire_date in EXP_DATE_TFN:
						self._expire_date = TFN_DATE
				if field == "retailbal":
					value = value.replace(",", "")
					self._retailbal = to_int(float(value))
			elif len(tmp) == 1 and tmp[0] == "OK":
				self._status = Constants.IMOVOOK
		if self._status == Constants.IMOVOOK:
			self._ctrl_string = "%s|%s" % (self._vnum, self._retailbal)

	@property
	def getdisplay(self):
		"get display"
		if self._expire_date == datetime(1, 1, 1, 0, 0) or self._expire_date == TFN_DATE:
			return "%s : %s " % (self._vnum, self._pub_mapping[self._pub]["name"])
		else:
			return "%s : %s : %s" % (self._vnum, self._retailbal, self.expiredatedisplay)

class IMovoVoucherCheck(IMovoRespose):
	"""Basic response to imovo request"""
	""" old way
	uid=88934c30-dc3c-11e3-8968-902b3454cdb4|rcode=0|vnum=5215534886|ccode=3635|rval=13.20|expdatetime=13/03/2024 00:00:00|msg=Redemption successful - transaction is worth �13.20|G|1111111
	uid=21e5da8f-e801-11e3-8678-902b3454cdb4|rcode=1|vnum=9592886845|ccode=0|rval=0|expdatetime=01/01/0001 00:00:00|msg=This e-coupon has insufficient balance"""

	""" new way
	OK|vnum=9193032040|mnum=447915073563|description=Test Campaign for the FT, testing integration with PaperRound - this campaign is for daily accruals and redemption at PPR locations only|FT|1111110|retailbal=15.50|expdate=13/03/2024 00:00:00|"""

	def __init__(self):
		"__init__"

		IMovoRespose.__init__(self)
		self._pub = None
		self._days = None
		self._retailbal = 0
		self._vscheme = ""
		self._can_register = False

	@property
	def retailbal(self):
		"retailbal"
		if self._retailbal == 1: # this is where we have added a penny so that we can get the details
			self._retailbal = 0
		return self._retailbal

	@property
	def pub(self):
		"publication"
		return self._pub

	@property
	def days(self):
		"days voucher is valid for"
		days = []
		for index in xrange(0, len(self._days)):
			if self._days[index] == "1":
				days.append(self._day_mapping[str(index)])

		return days

	@property
	def current_vscheme(self):
		"get the current vscheme"
		return self._vscheme

	@property
	def can_register(self):
		"see whether it can be registered dependant on the current vscheme"
		return self._vscheme in self._pub_mapping[self._pub]["can_register"]

	def paser_response(self, response):
		"""Get the response and split it up into a list of elements"""
		""" old way
		uid=88934c30-dc3c-11e3-8968-902b3454cdb4|rcode=0|vnum=5215534886|ccode=3635|rval=13.20|expdatetime=13/03/2024 00:00:00|msg=Redemption successful - transaction is worth �13.20|G|1111111
		uid=21e5da8f-e801-11e3-8678-902b3454cdb4|rcode=1|vnum=9592886845|ccode=0|rval=0|expdatetime=01/01/0001 00:00:00|msg=This e-coupon has insufficient balance"""

		""" new way
		OK|vnum=9193032040|mnum=447915073563|description=Test Campaign|FT|1111110|retailbal=15.50|expdate=13/03/2024 00:00:00|
		OK|vnum=4415525954|mnum=447915073563|description=Guardian version|retailbal=8.00|expdate=13/03/2024 00:00:00|"""

		result = response.read().split("|")
		unknownresults = ""
		for entry in result:
			tmp = entry.split("=")
			if len(tmp) > 1:
				(field, value) = tmp
				if field in ("expdate", "expdatetime"):
					self._expire_date = datetime.strptime(value[:10], "%d/%m/%Y")
					if self._expire_date in EXP_DATE_TFN:
						self._expire_date = TFN_DATE
				if field == "msg":
					self._message = value
				if field == "rcode":
					if int(value):
						self._status = Constants.IMOVOFAILED
					else:
						self._status = Constants.IMOVOOK
				if field == "vnum":
					self._vnum = value
				if field in ("retailbal", "rval"):
					value = value.replace(",", "")
					self._retailbal = to_int(float(value))
				if field == "vscheme":
					self._vscheme = value
			elif len(tmp) == 1:
				value = tmp[0]
				if value == "OK":
					self._status = Constants.IMOVOOK
				else:
					unknownresults += value + "|"

		tmp = unknownresults.split("|")
		if len(tmp) >= 3:
			self._pub = tmp[0]
			self._days = tmp[1]
		#if len(result) > 7:
		#	self._pub = result[7]
		#	self._days = result[8]

		if self._status == Constants.IMOVOOK:
			if self._pub:
				self._ctrl_string = "%s|%s|%s" % (self._vnum, self._pub, self._days)
			elif self._vscheme == "": # they have entered the card number not the letter number
				self._status = Constants.IMOVOFAILED
				self._message += Constants.CARD_MESSAGE
			else:
				self._status = Constants.IMOVOFAILED
				self._message += " Unknown publication / scheme"
		else:
			self._status = Constants.IMOVOFAILED
	@property
	def publicationids(self):
		"list of publication ids for voucher"

		return self._pub_mapping[self._pub]

	@property
	def allpublicationids(self):
		"list of all publication ids for voucher - including regional editions"
		allpubids = []
		alldailypubids = []
		allsundaypubids = []
		pub_mapping = self._pub_mapping[self._pub]
		if pub_mapping.has_key("daily") and pub_mapping["daily"]:
			allpubids.append(pub_mapping["daily"])
			alldailypubids.append(pub_mapping["daily"])
		if pub_mapping.has_key("sunday") and pub_mapping["sunday"]:
			allpubids.append(pub_mapping["sunday"])
			allsundaypubids.append(pub_mapping["sunday"])
		if pub_mapping.has_key("regionals"):
			for region in pub_mapping["regionals"]:
				region_pub_mapping = pub_mapping["regionals"][region]
				if region_pub_mapping.has_key("daily"):
					allpubids.append(region_pub_mapping["daily"])
					alldailypubids.append(region_pub_mapping["daily"])
				if region_pub_mapping.has_key("sunday"):
					allpubids.append(region_pub_mapping["sunday"])
					allsundaypubids.append(region_pub_mapping["sunday"])
		return allpubids, alldailypubids, allsundaypubids, self._pub_mapping[self._pub]

	@property
	def getdisplay(self):
		"get display"
		if self._expire_date == datetime(1, 1, 1, 0, 0) or self._expire_date == TFN_DATE:
			return "%s : %s " % (self._vnum, self._pub_mapping[self._pub]["name"])
		else:
			return "%s : %s : Ending %s" % (self._vnum, self._pub_mapping[self._pub]["name"], self.expiredatedisplay)

	@property
	def getdays(self):
		"get days"

		return "%s" % self._days

	def getvscheme(self, schemetype):
		"get vscheme name to use depending on the publication and the type eg schemetype ='stop' is to stop the accruals "
		return "%s" % self._pub_mapping[self._pub]["vschemes"][schemetype]


class IMovoWebService(object):
	" base for web services"
	def __init__(self, imovotest=True):
		"init"
		self._is_test = imovotest

		self._base_rest_url = Constants.IMOVOTESTURL if self._is_test else Constants.IMOVOLIVEURL
		self._command = ""
		self._debuglevel = 1 if  self._is_test else 0

	def execute(self, inparams):
		"""Base Level """
		pass

	@property
	def debuglevel(self):
		return self._debuglevel

class IMovoGetVoucherDetails(IMovoWebService):
	"Price and Availability Web Service"

	def __init__(self, imovotest=True):
		"""init"""
		IMovoWebService.__init__(self, imovotest)

		#self._command = self._base_rest_url + "/api/receivereq.aspx"
		self._command = self._base_rest_url + "/api/tuvoucherdetaildesc.aspx"

	def execute(self, inparams):
		""" execute command """

		result = IMovoVoucherCheck()

		params = inparams.copy()
		# params.update(result.request_fields()) don't need these any longer
		# params["ttype"] = Constants.TTYPE_REQUEST

		try:
			handler = urllib2.HTTPHandler(debuglevel=1)
			opener = urllib2.build_opener(handler)
			urllib2.install_opener(opener)
			response = urllib2.urlopen(self._command+"?"+urllib.urlencode(params))
			result.paser_response(response)
			if result.message == Constants.ZERO_BALANCE_MESSAGE:
				update_command = IMovoUpdateVoucher(imovotest=self._is_test)
				# put a penny on then take it off so that we can see the expiry and publication details
				baladj = 1
				update_result = update_command.execute(dict(vnum=params["vnum"], retailvalue=from_int(baladj)))
				if update_result.status == Constants.IMOVOFAILED:
					raise Exception("Voucher Issue - Update Balance%s"%update_result.message)
				# redo the call to get the details
				response = urllib2.urlopen(self._command+"?"+urllib.urlencode(params))
				result.paser_response(response)
				baladj = baladj * -1
				update_result = update_command.execute(dict(vnum=params["vnum"], retailvalue=from_int(baladj)))
				if update_result.status == Constants.IMOVOFAILED:
					raise Exception("Voucher Issue - Update Balance%s"%update_result.message)
		except:
			LOGGER.exception("IMovoCustomerWebService-execute")
			raise

		return result


class IMovoClaimVouchers(IMovoWebService):
	""" Make a claim Web Service - Note this uses the same call as the voucher details but with ttype=REDEEM
	The total amount is claimed in one go now
	"""

	def __init__(self, imovotest=True):
		"""init"""
		IMovoWebService.__init__(self, imovotest)

		self._command = self._base_rest_url + "/api/receivereq.aspx"

	def execute(self, inparams):
		""" execute command """

		result = IMovoVoucherCheck()

		params = inparams.copy()
		params.update(result.request_fields())
		params["ttype"] = Constants.TTYPE_REDEEM

		try:
			handler = urllib2.HTTPHandler(debuglevel=1)
			opener = urllib2.build_opener(handler)
			urllib2.install_opener(opener)
			response = urllib2.urlopen(self._command+"?"+urllib.urlencode(params))
			result.paser_response(response)
		except:
			LOGGER.exception("IMovoCustomerWebService-execute-claim")
			raise

		return result

class IMovoGetRetailBal(IMovoWebService):
	" Get the retail balance and therefore we can work out the number of weeks we can claim from the Web Service"

	def __init__(self, imovotest=True):
		"""init"""
		IMovoWebService.__init__(self, imovotest)

		self._command = self._base_rest_url + "/api/tuVoucherDetail.aspx"

	def execute(self, inparams):
		""" execute command """

		result = IMovoVoucherRetailBal()

		params = inparams.copy()
		# don't need these other params params.update(result.request_fields())

		try:
			handler = urllib2.HTTPHandler(debuglevel=1)
			opener = urllib2.build_opener(handler)
			urllib2.install_opener(opener)
			response = urllib2.urlopen(self._command+"?"+urllib.urlencode(params))
			result.paser_response(response)
		except:
			LOGGER.exception("IMovoCustomerWebService-execute-retailbal")
			raise

		return result

class IMovoUpdateVoucher(IMovoWebService):
	" Update the retail balance and/or scheme in the Web Service"

	def __init__(self, imovotest=True):
		"""init"""
		IMovoWebService.__init__(self, imovotest)

		self._command = self._base_rest_url + "/api/tuUpdateVoucher.aspx"

	def execute(self, inparams):
		""" execute command """

		result = IMovoUpdVoucher()

		params = inparams.copy() # from_int
		# don't need these other params params.update(result.request_fields())

		try:
			handler = urllib2.HTTPHandler(debuglevel=1)
			opener = urllib2.build_opener(handler)
			urllib2.install_opener(opener)
			response = urllib2.urlopen(self._command+"?"+urllib.urlencode(params))
			result.paser_response(response)
		except:
			LOGGER.exception("IMovoCustomerWebService-execute-tuUpdateVoucher")
			raise

		return result


class IMovoAddShop(IMovoWebService):
	"Adds a new shop to the imovo system"

	def __init__(self, imovotest=True):
		"""init"""
		IMovoWebService.__init__(self, imovotest)

		self._command = self._base_rest_url + "/api/CreateLocation.aspx"

	def execute(self, inparams):
		""" execute command """

		"""INFO:
		URL: http://testext.i-movo.com/api/CreateLocation.aspx?

		Parameters
		lcode=					The i-movo Ref e.g. PR00631
		orgcode=		    Always ‘PaperRound’ for you guys
		rcode=          Always ‘All’ for you guys
		adddress=       The address i.e. all your Address fields concatenated and separated by commas (can’t contain ampersand characters)
		contact=        The Contact Name supplied by the store
		email=          The email address supplied by the store
		tel=            The telephone number supplied by the store
		postcode=       The postcode supplied by the store
		did=            The i-movo Ref repeated e.g. PR00631
		deviceinfo=     Always ‘PaperRound Site’ for you
		devicetype=     Always ‘Kiosk’ for you guys please

		So for example:

		http://testext.i-movo.com/api/CreateLocation.aspx?lcode=PR00631&orgcode=PaperRound&rcode=All&address=Great Wilbraham Post Office and Stores, 37 Angle End, Great Wilbraham&contact=Yasir Iqbal&email=yasiriq@hotmail.co.uk&tel=01223880375&postcode= CB21 5JG&did=PR00631&deviceinfo=PaperRound Site&devicetype=Kiosk"""

		result = IMovoRespose()

		# build command to add a shop
		params = {}
		params['lcode'] = inparams['imovo_pprid']
		params['did'] = inparams['imovo_pprid']
		params['orgcode'] = 'PaperRound'
		params['rcode'] = 'All'
		params['deviceinfo'] = 'PaperRound Site'
		params['devicetype'] = 'Kiosk'
		params['tel'] = inparams['telephone']
		params['email'] = inparams['email']
		params['postcode'] = inparams['postcode']
		params['contact'] = inparams['contactname']
		# name and address on a single like
		fields = [inparams['tradingname'], inparams['address1'], inparams['address2'], inparams['town']]
		params["address"] = ", ".join([field.replace("&", "") for field in fields])

		try:
			# execute command to add shop on the imovo system
			handler = urllib2.HTTPHandler(debuglevel=self.debuglevel)
			urllib2.install_opener(urllib2.build_opener(handler))
			urllib2.urlopen(self._command+"?"+urllib.urlencode(params))

			result.status = Constants.IMOVOOK
		except:
			LOGGER.exception("IMovoAddShop-execute")
			raise

		return result
