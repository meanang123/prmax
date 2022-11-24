# -*- coding: utf-8 -*-
"""Validators"""
#-----------------------------------------------------------------------------
# Name:        validators.py
# Purpose:     Holds extended turbogears validates
#
# Author:      Chris Hoy
#
# Created:     24/09/2008
# RCS-ID:      $Id:  $
# Copyright:   (c) 2008

#-----------------------------------------------------------------------------
import datetime
import time
import simplejson
from decimal import Decimal
try:
	import httpagentparser
	HTTPAGENTLOADED = True
except:
	HTTPAGENTLOADED = False
from turbogears import identity
from turbogears.database import session
from turbogears.validators import TgFancyValidator, Number
from sqlalchemy import text
from formencode.validators import Int, Invalid
from formencode.schema import Schema, SimpleFormValidator
from formencode.api import Invalid
from cherrypy import request
from cherrypy import response
from turbojson import jsonify
from ttl.ttlmaths import to_int
from ttl.tg.errorhandlers import SecurityException

class JSONValidatorListInt(TgFancyValidator):
	"""A validator for JSON format numerical list."""

	def _convert_from_python(self, value, state):
		return jsonify.encode(value)

	def  _convert_to_python(self, value, state):
		return [int(i) for i in simplejson.loads(value)]

class IntExt(Int):
	def __initargs__(self, args):
		self.default = args.get("default", None)
		Int.__initargs__(self, args)

	def  _convert_to_python(self, value, state):
		try:
			if value:
				return int(value)
			else:
				return None
		except (ValueError, TypeError):
			raise Invalid(self.message('integer', state),
										value, state)

	_convert_from_python = _convert_to_python

class JSONValidator(TgFancyValidator):
	"""A validator for JSON format numerical list."""

	def _convert_from_python(self, value, state):
		return jsonify.encode(value)

	def  _convert_to_python(self, value, state):
		return simplejson.loads(value)

class JSONValidatorInterests(TgFancyValidator):
	"""A validator for JSON format numerical list."""


	if_missing = []

	def _convert_from_python(self, value, state):
		return jsonify.encode(value)

	def  _convert_to_python(self, value, state):
		data = simplejson.loads(value)
		return data['data'] if 'data' in data else []

#Form validate base classes and methods
class StateBlob(object):
	pass

def std_state_factory():
	"""
	Creates the standard state for a prmax system capture both the user id and
	the customerid as fields"""


	sb = StateBlob()
	# capture the current user
	sb.u = identity.current.user
	try:
		# attempt to capture the current customerid
		sb.customerid = identity.current.user.customerextid
		sb.productid = -1
	except:
		sb.customerid = None
		sb.productid = -1

	# set the default caching state for all returned data
	# this is the easist place to call as this is called by almost all exposed methods
	try:
		response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
		response.headers['Pragma'] = 'no-cache'
		response.headers['expires'] = '-1'
	except:
		pass


	return sb

@SimpleFormValidator
def std_state_chained(value_dict, state, validator):
	""" creates the standard state entries in the dictionary
	this is run as a pre validator for a form
	"""
	value_dict['productid'] = -1
	if identity.current.user:
		value_dict['user_id'] = identity.current.user.user_id
		value_dict['userid'] = identity.current.user.user_id
		value_dict['tshopid'] = getattr(identity.current.user, "shopid", -1)
		value_dict["zownerid"] = __get_owner()
		value_dict["permissions"] = __get_permissions()
	else:
		# not logged in just set both to -1
		value_dict['user_id'] = -1
		value_dict['userid'] = -1
		value_dict['tshopid'] = -1
		value_dict['zownerid'] = None
		value_dict["permissions"] = []
	if state:
		# set to an invalid value
		value_dict['customerid'] = getattr(state, "customerid", -2)
		value_dict['prstate'] = state
		value_dict['productid'] = getattr(state, "productid", -1)

	value_dict['browser'] = __get_browser_info()

@SimpleFormValidator
def grid_fields(value_dict, state, validator):
	""" add the fields to the system"""
	value_dict['direction'] = "asc"
	value_dict['sortfield'] = value_dict.get('sort', "")
	if len(value_dict['sortfield']) > 0 and value_dict['sortfield'][0] == "-":
		value_dict['direction'] = "desc"
		value_dict['sortfield'] = value_dict['sortfield'][1:]
	count = value_dict.get("count", "100")
	if  count.lower() == "infinity":
		value_dict['limit'] = 32000
	else:
		value_dict['limit'] = int(count)

	value_dict['offset'] = abs(int(value_dict.get("start", "0")))
	value_dict['count'] = value_dict['limit']

class PrFormSchema(Schema):
	""" base form validator class sets up t
	"""
	# allow the extra arguments
	allow_extra_fields = True
	#setup the data that run before all the validators
	# this by default just load the user state
	pre_validators = (std_state_chained,)

class PrGridSchema(Schema):
	""" base form validator class sets up t
	"""
	# allow the extra arguments
	allow_extra_fields = True
	#setup the data that run before all the validators
	# this by default just load the user state
	pre_validators = (std_state_chained, grid_fields)

class GridNoIdentitySchema(Schema):
	""" base form validator class sets up t
	"""
	# allow the extra arguments
	allow_extra_fields = True
	#setup the data that run before all the validators
	# this by default just load the user state
	pre_validators = (grid_fields,)



class ExtendedDateValidator(TgFancyValidator):
	"""convert and extended date to an object
	fix update """

	def _convert_from_python(self, value, state):
		return jsonify.encode(value)

	def  _convert_to_python(self, value, state):
		obj = simplejson.loads(value)
		if obj["date"]:
			tmp = obj["date"].split("-")
			obj["date"] = datetime.date(int(tmp[0]), int(tmp[1]), int(tmp[2]))
		else:
			obj["date"] = None

		return obj

class BooleanValidator(TgFancyValidator):
	"""convert a checkbox field to a boolean value the default value if not
	present is false """

	if_missing = False

	def _convert_from_python(self, value, state):
		return jsonify.encode(value)

	def  _convert_to_python(self, value, state):
		if value == "ok" or value == "true" or value == "on" or value == "1":
			return True
		return False

class TgInt(Int):
	""" int with missing value """
	if_missing = -1

class IntNull(Int):
	""" int with missing value """
	if_missing = None

	def  _convert_to_python(self, value, state):
		try:
			if value.lower() == "nan":
				return 0

			return int(value)
		except (ValueError, TypeError):
			raise Invalid(self.message('integer', state), value, state)

class Int2Null(Int):
	""" int with missing value """
	if_missing = None

	def  _convert_to_python(self, value, state):
		try:
			if value is None:
				return None

			if value.lower() in ("nan", "-1", ""):
				return None

			return int(value)

		except (ValueError, TypeError):
			raise Invalid(self.message('integer', state), value, state)

class IntZero(Int):
	""" int with missing value """
	if_missing = 0

class IntOne(Int):
	""" int with missing value """
	if_missing = 1

class ISODateValidator(TgFancyValidator):
	""" convert a date stirng in ISO format to date object"""

	def _convert_from_python(self, value, state):
		try:
			return value.strftime("%Y/%m/%d")
		except ValueError:
			raise Invalid(self.message('badFormat', state), value, state)


	@staticmethod
	def _s_to_python(value):
		""" """

		return ISODateValidator()._convert_to_python(value, None)


	def  _convert_to_python(self, value, state):
		if value:
			if value == "TFN":
				return datetime.date(2100, 1, 1)

			dt = datetime.datetime.strptime(value, "%Y-%m-%d")
			return datetime.date(dt.year, dt.month, dt.day)
		else:
			return None

class ISODateValidatorNull(ISODateValidator):
	"""Missing date is null"""
	if_missing = None

class ISODateTimeValidator(TgFancyValidator):
	""" convert a date stirng in ISO format to date object"""

	def _convert_from_python(self, value, state):
		try:
			return value.strftime("%Y/%m/%d %H:%M:%S")
		except ValueError:
			raise Invalid(self.message('badFormat', state), value, state)

	def  _convert_to_python(self, value, state):
		if value:
			if value == "TFN":
				return datetime.date(2100, 1, 1)
			try:
				return datetime.datetime.strptime(value.replace("/", "-"), "%Y-%m-%d %H:%M:%S %p")
			except:
				try:
					return datetime.datetime.strptime(value.replace("/", "-"), "%Y-%m-%d %H:%M:%S")
				except:
					return datetime.datetime.strptime(value.replace("/", "-"), "%Y-%m-%d")
		else:
			return None

class ISOTimeValidator(TgFancyValidator):
	""" convert a time stirng in ISO format to time object"""

	def _convert_from_python(self, value, state):
		return value.strftime("HH:MM:SS")

	def  _convert_to_python(self, value, state):
		if value:
			dt = time.strptime(value, "%H:%M:%S")
			return datetime.time(dt.tm_hour, dt.tm_min, dt.tm_sec)
		else:
			return None

try:
	class DateRangeResult(object):
		"""date range """

		NOSELECTION = 0
		BEFORE = 1
		AFTER = 2
		BETWEEN = 3

		_convert_types = {
		  "None": 0,
		  "Before" : 1,
		  "After" : 2,
		  "Between" : 3}

		@property
		def option(self):
			"""get the option"""
			return self._option

		@option.setter
		def option(self, value):
			"""get the option"""
			self._option = value

		@property
		def from_date(self):
			"""get from date"""
			return self._from_date

		@from_date.setter
		def from_date(self, date):
			"""get from date"""
			self._from_date = date

		@property
		def to_date(self):
			"""get to date"""
			return self._to_date

		@to_date.setter
		def to_date(self, date):
			"""get to date"""

			self._to_date = date

		@property
		def option_text(self):
			"""get the option"""
			return self._option_text

		@option_text.setter
		def option_text(self, value):
			"""get the option"""
			self.option_text = value

		def __init__(self):
			"""init"""
			self._option = 0
			self._from_date = datetime.date.today()
			self._to_date = datetime.date.today()
			self._option_text = "Between"

		def load_from_json(self, invalue):
			"""load from a jsonstring """
			obj = simplejson.loads(invalue)
			self._option = DateRangeResult._convert_types[obj['option']]
			self._from_date = ISODateValidator._s_to_python(obj['from_date'])
			self._to_date = ISODateValidator._s_to_python(obj['to_date'])

		def get_as_json(self):
			"""return as json string """

			return simplejson.dumps(
			  {
			    "option": self._option_text,
			    "from_date": self._from_date.strftime("%Y-%m-%d"),
			    "to_date": self._to_date.strftime("%Y-%m-%d"),
			  }
			)
except:
	class DateRangeResult(object):
		"""dummy for python 2.5"""
		pass


try:
	class SingleDateResult(object):
		"""single date """

		@property
		def the_date(self):
			"""get the date"""
			return self._the_date

		@the_date.setter
		def the_date(self, date):
			"""get the date"""
			self._the_date = date

		def __init__(self):
			"""init"""
			self._the_date = datetime.date.today()

		def load_from_json(self, invalue):
			"""load from a jsonstring """
			obj = simplejson.loads(invalue)
			self._the_date = ISODateValidator._s_to_python(obj['the_date'])

except:
	class SingleDateResult(object):
		"""dummy for python 2.5"""
		pass


try:
	class AmountRangeResult(object):
		"""amount range """

		NOSELECTION = 0
		EXACTLY = 1
		LEAST = 2
		MOST = 3
		BETWEEN = 4
		_convert_types = {"None" : 0,
			                "Exactly" : 1,
			                "At Least" : 2,
		                  "At Most" : 3,
			                "Between" : 4}

		@property
		def option(self):
			"""get the option"""
			return self._option

		@property
		def lower(self):
			"""get lower amount"""
			return self._lower

		@lower.setter
		def lower(self, amount):
			"""get lower amount"""
			self._lower = amount

		@property
		def upper(self):
			"""get upper amount"""
			return self._upper

		@upper.setter
		def upper(self, amount):
			"""get upper amount"""
			self._upper = amount


		def __init__(self):
			"""init"""
			self._option = 0
			self._lower = None
			self._upper = None

		def load_from_json(self, invalue):
			"""load from a jsonstring """
			obj = simplejson.loads(invalue)
			self._option = AmountRangeResult._convert_types[obj['option']]
			self._lower = obj['amount1']
			self._upper = obj['amount2']
except:
	class AmountRangeResult(object):
		"""dummy for python 2.5"""
		pass

try:
	class MultiSelect(object):
		"""multi select list """

		@property
		def data(self):
			"""get the data"""
			return self._data

		@data.setter
		def data(self, data):
			"""get the data"""
			self._data = data

		def __init__(self):
			"""init"""
			self._data = None

		def load_from_json(self, invalue):
			"""load from a jsonstring """
			obj = simplejson.loads(invalue)
			self._data = obj['data']
except:
	class MultiSelect(object):
		"""dummy for python 2.5"""
		pass


class DateRangeValidator(TgFancyValidator):
	""" convert a date range object into actual values"""

	if_missing = DateRangeResult()

	def _convert_from_python(self, value, state):
		return ""

	def  _convert_to_python(self, value, state):
		" convert"
		obj = DateRangeResult()
		obj.load_from_json(value)
		return obj

class FloatToIntValidator(TgFancyValidator):
	def _convert_from_python(self, value, state):
		return "%.f2" % ((value * 100) / 100.0)

	def  _convert_to_python(self, value, state):
		if not value:
			return 0
		if value == "NaN":
			return 0

		return to_int(float(value))


class RoundsSelectorValidator(TgFancyValidator):
	def _convert_from_python(self, value, state):
		pass

	def  _convert_to_python(self, value, state):
		if not value:
			return None
		tmp = value.split(",")
		roundid = int(tmp[0])
		if len(tmp) > 1:
			tmp = tmp[1].split(":")
			locationid = int(tmp[0])
			locationtypeid = int(tmp[1])
		else:
			locationid = locationtypeid = None

		return (roundid, locationid, locationtypeid)

class ListofIntsValidator(TgFancyValidator):
	accept_iterator = True
	if_missing = None

	def _convert_from_python(self, value, state):
		pass

	def _temp(self, value):
		""" schema """
		try:
			ret = int(value)
		except:
			ret = None

		return ret

	def  _convert_to_python(self, value, state):
		v_set = set()
		for row in value:
			tmp = self._temp(row)
			if tmp:
				v_set.add(self._temp(row))

		return list(v_set)


# Restfull controller
@SimpleFormValidator
def rest_grid_fields(value_dict, state, validator):
	""" add the fields to the system"""

	# sort fields
	value_dict['direction'] = "asc"
	value_dict['sortfield'] = value_dict.get('sort', "").strip()
	if len(value_dict['sortfield']) > 0 and value_dict['sortfield'][0] == "-":
		value_dict['direction'] = "desc"
		value_dict['sortfield'] = value_dict['sortfield'][1:].strip()

	# Range of data requested
	try:
		items = request.headers['Range'].split("=")[1].split("-")
		lower = int(items[0])
		upper = int(items[1])
	except:
		lower = 0
		upper = 49

	value_dict["count"] = abs((upper - lower) + 1)
	value_dict["offset"] = lower
	value_dict["start"] = lower
	value_dict['limit'] = value_dict['count']

################################################################################
# common ppr function
################################################################################

@SimpleFormValidator
def ppr_std_state_chained(value_dict, state, validator):
	""" creates the standard state entries in the dictionary
	this is run as a pre validator for a form
	"""
	if identity.current.user:
		value_dict['user_id'] = identity.current.user.user_id
		value_dict['userid'] = identity.current.user.user_id
		value_dict['ucustomerid'] = identity.current.user.customerid
		value_dict['shopid'] = identity.current.user.shopid
		value_dict['zuserid'] = identity.current.user.zuserid
		try:
			value_dict['shopgroupid'] = identity.current.user.shopgroupid
		except:
			value_dict['shopgroupid'] = -1

		value_dict["zownerid"] = __get_owner()
		value_dict["permissions"] = __get_permissions()
	else:
		value_dict['user_id'] = -1
		value_dict['userid'] = -1
		value_dict['ucustomerid'] = -1
		value_dict['shopid'] = -1
		value_dict['zuserid'] = -1
		value_dict['shopgroupid'] = -1
		value_dict['zownerid'] = None
		value_dict["permissions"] = []
	if state:
		# set to an invalid value
		value_dict['pprstate'] = state

	value_dict['browser'] = __get_browser_info()

@SimpleFormValidator
def ppr_customer_std_state_chained(value_dict, state, validator):
	""" creates the standard state entries in the dictionary
	this is run as a pre validator for a form
	"""
	if identity.current.user:
		# check user to customer security
		if not identity.current.user.check_access(value_dict.get("icustomerid", None)):
			raise SecurityException("")

		value_dict['user_id'] = identity.current.user.user_id
		value_dict['userid'] = identity.current.user.user_id
		value_dict['ucustomerid'] = identity.current.user.customerid
		value_dict['shopid'] = identity.current.user.shopid
	else:
		value_dict['user_id'] = -1
		value_dict['userid'] = -1
		value_dict['ucustomerid'] = -1
		value_dict['shopid'] = -1
	if state:
		# set to an invalid value
		value_dict['prstate'] = state

class PPRFormSchema(Schema):
	""" base form validator class sets up t
	"""
	# allow the extra arguments
	allow_extra_fields = True
	#setup the data that run before all the validators
	# this by default just load the user state
	pre_validators = (ppr_std_state_chained,)

def ppr_std_state_factory():
	"""
	Creates the standard state for a ppr system capture both the user id and shopid
	the customerid as fields"""

	sb = StateBlob()
	# capture the current user
	sb.u = identity.current.user
	try:
		# attempt to capture the current customerid
		sb.ucustomerid = identity.current.user.customerid
		sb.shopid = identity.current.user.shopid
	except:
		sb.ucustomerid = -1
		sb.shopid = -1

	# cope with shop groups
	try:
		sb.shopgroupid = identity.current.user.shopgroupid
	except:
		sb.shopgroupid = -1

	# set the default caching state for all returned data
	# this is the easist place to call as this is called by almost all exposed methods
	try:
		response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
		response.headers['Pragma'] = 'no-cache'
		response.headers['expires'] = '-1'
	except:
		pass

	return sb

class RestSchema(Schema):
	""" base form validator class sets up t
	"""
	# allow the extra arguments
	allow_extra_fields = True
	#setup the data that run before all the validators
	# this by default just load the user state
	pre_validators = (std_state_chained, rest_grid_fields)

class PPRRestSchema(Schema):
	""" base form validator class sets up t
	"""
	# allow the extra arguments
	allow_extra_fields = True
	#setup the data that run before all the validators
	# this by default just load the user state
	pre_validators = (ppr_std_state_chained, rest_grid_fields)

class OpenRestSchema(Schema):
	""" Base controller for
	"""
	# allow the extra arguments
	allow_extra_fields = True
	#setup the data that run before all the validators
	# this by default just load the user state
	pre_validators = (rest_grid_fields, )

class PRmaxFormSchema(Schema):
	""" new base for prmax """
	# allow the extra arguments
	allow_extra_fields = True
	#setup the data that run before all the validators
	# this by default just load the user state
	pre_validators = (std_state_chained,)

class PRmaxOpenFormSchema(Schema):
	""" base form validator class sets up t
	"""
	# allow the extra arguments
	allow_extra_fields = True
	#setup the data that run before all the validators
	# this by default just load the user state

class PrOutletIdFormSchema(PrFormSchema):
	""" form that  contains a single outletid  """
	outletid = Int()

class DecimalNumber(Number):
	"""Validate a decimal number."""

	decimals = None

	def  _convert_to_python(self, value, state):
		"""Parse a string and return a float or integer."""
		retvalue = super(DecimalNumber, self). _convert_to_python(value, state)
		return Decimal(str(retvalue))

	def _convert_from_python(self, value, state):
		return super(DecimalNumber, self). _convert_from_python(value, state)




def __get_owner():
	"""get the current users owner id"""
	zuserid = getattr(identity.current.user, "zuserid", None)
	if zuserid:
		owner = session.execute(text("SELECT ownerid FROM users WHERE id =:id "), \
		                        {"id": zuserid,}, identity.current.user.__class__).fetchall()
		if owner:
			zownerid = owner[0][0]
		else:
			zownerid = owner[0][0]
	else:
		zownerid = None

	return zownerid

def __get_permissions():
	"""get a list of extended permissions"""

	shopid = getattr(identity.current.user, "shopid", None)
	if shopid:
		return [permissionid for permissionid in
		        session.execute(text("SELECT permission_id FROM user_permission WHERE user_id = :id "),\
		                        {"id": identity.current.user.user_id,}, identity.current.user.__class__).fetchall()]
	else:
		return []


AGENTSLIST = ('User-Agent', 'user-agent')

def __get_browser_info():
	# capture browser details
	if HTTPAGENTLOADED:
		for agent in AGENTSLIST:
			if agent in request.headers:
				return httpagentparser.simple_detect(request.headers[agent])
		return {}
	else:
		return None

def is_fixed_size_screen(browser):
	"""Check to see if we should be using a fixed size screen """
	if browser and ("Chrome 19.0.1084.56" in browser or
	   "Chrome 19.0.1084.52" in browser):
		return True
	else:
		return False
	
def embedded_flags(browser,shop,paystation = None):
	""" Check for browser used and theme to determine active classes """

	fashion = "modern"
	theme = ""
	write = 1
	if browser and ("Chrome 19.0.1084.56" in browser or
	   "Chrome 19.0.1084.52" in browser):
		fashion = "retro"
	elif browser and "Microsoft Internet Explorer 8.0" in browser:
		fashion += " ie8"
	if shop.embeddedtheme:
		theme = shop.embeddedtheme
	write = shop.embeddedkeyboard
	if paystation:
		if paystation[0].theme:
			theme = paystation[0].theme
		write = paystation[0].keyboard
	if theme:
		fashion += " " + theme
		
	return (fashion, write)

__all__ = ["JSONValidatorListInt", "JSONValidator", "JSONValidatorInterests", \
           "std_state_chained", "std_state_factory", "PrFormSchema",
           "SimpleFormValidator", "BooleanValidator", "ISODateValidator",
           "FloatToIntValidator", "RestSchema", "PRmaxFormSchema",
           "PRmaxOpenFormSchema", "PrOutletIdFormSchema"]
