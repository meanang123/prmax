# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:         ttlcsv.py
# Purpose:
#
# Author:      Chris Hoy
#
# Created:     31/10/2010
# RCS-ID:      $Id:  $
# Copyright:   (c) 2010
# Licence:
#-----------------------------------------------------------------------------

from datetime import date, timedelta, datetime
import os, csv
import calendar


class TtlDate(object):
	_BankHolidays = None
	_Names = ( "/home/prmax/prmax/bankholidays.csv" , "/temp/bankholidays.csv")

	@staticmethod
	def __LoadBankHolidays():
		TtlDate._BankHolidays = []
		name  = ""
		for row in TtlDate._Names :
			if os.path.exists ( row ) :
				name = row
				break

		if name:
			for row in csv.reader ( file ( name ) ) :
				TtlDate._BankHolidays.append ( datetime.strptime(row[0], "%d/%m/%Y"))

	@staticmethod
	def addWorkingDates( d, days = 0, *args , **kw ) :
		if TtlDate._BankHolidays == None:
			TtlDate.__LoadBankHolidays()
		td = datetime(d.year, d.month, d.day)
		loop = days
		while loop > 0:
			td = td + timedelta ( days = 1 )
			if td.isoweekday() in (1,2,3,4,5) and td not in TtlDate._BankHolidays:
				loop -= 1
		return td


def DatetoStdString( inDate, inFormat = "%d/%m/%y"):
	""" convert a date to a standard string formt """

	if type(inDate) in ( date, datetime):
		return inDate.strftime("%d/%m/%y")
	elif inDate:
		d = inDate.split("-")
		if not len(d) == 3:
			d = inDate.split("/")
		if len(d) == 3:
			d.reverse()
			d[0] = int(d[0])
			d[1] = int(d[1])
			d[2] = int(d[2])
			if d[2] > 100:
				d[2] = d[2] - 2000

			return "%02d/%02d/%2d" % tuple(d)

	return ""

def DateAddMonths(inDate,nbrofMonths):
	""" add months """

	year = inDate.year
	months = inDate.month + nbrofMonths
	day = inDate.day - 1
	# last day of previous months
	if day == 0 :
		day = 31
		months-=1

		# move forward
	while months > 12:
		year +=1
		months -= 12

	# get last day of month and correct if necessary
	(dummy, upper_date) = calendar.monthrange ( year, months )
	if day > upper_date:
		day = upper_date

	return date(year, months, day )

def get_ppr_day_of_week(indate = None):
	"""get the current date day of the week for ppr db"""

	if indate:
		day = indate.weekday()
	else:
		day = date.today().weekday()
	day = day + 2
	if day == 8:
		day = 1

	return day



class DateWeekly(object):
	def __init__(self,endofweekday,nextweek=False,startdate=None):
		# today
		td = datetime.today()
		self.today = td
		self.tomorrow = td + timedelta ( days = 1 )
		self.tomorrowweek = self.tomorrow + timedelta ( days = 7 )
		if startdate :
			td = startdate
		if nextweek:
			td+=timedelta ( days = 7 )

		self.endofweek = td
		start = self.endofweek
		eownottoday = False

		day = self.get_day(start)
		if endofweekday == 1:
			while day !=1:
				start = start + timedelta ( days = 1 )
				self.endofweek = start
				day = self.get_day(start)
				eownottoday = True
		else:
			while day < endofweekday :
				start = start + timedelta ( days = 1 )
				self.endofweek = start
				day = self.get_day(start)
				eownottoday = True

		self.startofweek = self.endofweek - timedelta ( days = 6 )
		self.setup_dates()

	def setup_dates(self):
		self.StartSql = self.startofweek.strftime("%Y-%m-%d")
		self.EndSql = self.endofweek.strftime("%Y-%m-%d")
		self.StartDate = self.startofweek.strftime("%d/%m/%Y")
		self.EndDate = self.endofweek.strftime("%d/%m/%Y")
		self.StartDateShort = self.startofweek.strftime("%d/%m/%y")
		self.EndDateShort = self.endofweek.strftime("%d/%m/%y")
		self.StartSql2 = (self.startofweek-timedelta (days=1)).strftime("%Y-%m-%d")
		self.tomorrowDate = self.tomorrow.strftime("%Y-%m-%d")
		self.tomorrowWeekDate = self.tomorrowweek.strftime("%Y-%m-%d")


	def MoveBackWeek(self):
		self.startofweek-= timedelta ( days = 7 )
		self.endofweek-= timedelta ( days = 7 )
		self.setupDates()

	def getTimeFrame(self,weeks,sql = False ):
		if sql:
			return ( (self.startofweek - timedelta (weeks = weeks )).strftime("%Y-%m-%d") , self.endofweek.strftime("%Y-%m-%d") )
		else:
			return ( self.startofweek - timedelta (weeks = weeks ) , self.endofweek )

	def getWeekArray(self,weeks):
		def _doRange(self,a):
			r = timedelta(weeks=a)
			return RangeObject( self.startofweek-r,self.endofweek-r)

		a = [ _doRange(self,a) for a in xrange(0,weeks+1)]
		a = a[1:]
		a.reverse()
		return a

	def getStartEndWeekDays(self,assql=True):
		if assql:
			return ( self.StartSql , self.EndSql )
		else:
			return ( self.StartDate , self.EndDate )

	def get_day(self,date):
		day = date.weekday()
		day = day + 2
		if day == 8:
			day = 1
		return day

	def get_days(self,start_date,end_date):

		if start_date < self.startofweek:
			start = self.startofweek
		else:
			start = start_date

		if end_date > self.endofweek:
			end = self.endofweek
		else:
			end = end_date

		result = []
		while start <= end :
			result.append ((self.get_day(start),start.strftime("%Y-%m-%d")))
			start = start + datetime.timedelta ( days = 1 )

		return result

	def ShouldIgnore(self,d1,d2,dayid):
		sdate = hndDates(d1.strftime("%d-%m-%Y")).SystemDate()
		try:
			edate = hndDates(d2.strftime("%d-%m-%Y")).SystemDate()
		except Exception, details:
			print details , d2
			edate = datetime.datetime ( 2020 , 1,1 ,0,0,0)

		# voucher is no appliable for start section
		if self.startofweek < sdate:
			# test each day from start of week upto but not including the voucher start_date
			# return true if the day is before the voucher start_date
			start = self.startofweek
			while start < sdate :
				day = start.weekday()
				day = day + 2
				if day == 8:
					day = 1
				if dayid == day:
					return True
				start = start + datetime.timedelta ( days = 1 )


		if edate < self.endofweek :
			start = edate
			start = start + datetime.timedelta ( days = 1 )
			# so start is now set as the voucher end_date + 1
			# test each day from this upto and including end of week
			# return true if the day is after the voucher end_date
			while start <= self.endofweek :
				day = start.weekday()
				day = day + 2
				if day == 8:
					day = 1
				if dayid == day:
					return True
				start = start + datetime.timedelta ( days = 1 )

		return False

	def DateIsThisDay(self,d1,dayid):
		# Called with either start or end holiday date to see whether ampm is relevant
		try:
			thisdate = hndDates(d1.strftime("%d-%m-%Y")).SystemDate()
		except Exception, details:
			print details , d1
			thisdate = datetime.datetime ( 2020 , 1,1 ,0,0,0)

		# is this date on the relevant day of week
		if self.startofweek <= thisdate and self.endofweek >= thisdate:
			# so this date falls in this week
			day = thisdate.weekday()
			day = day + 2
			if day == 8:
				day = 1
			if dayid == day:
				return True

		return False


	def get_end_of_week_posh(self):
		return self.endofweek.strftime("%d %b %Y")

	def get_end_of_week_display(self):
		return self.endofweek.strftime("%d/%m/%y")

	def get_end_of_week_posh_short(self):
		return self.endofweek.strftime("%d %b")

def build_date_dict(from_date,to_date,dlist = None):
	""" returns a dictional of dates"""
	result = {}

	while from_date <= to_date :
		if dlist :
			result[from_date.strftime("%Y-%m-%d")] = list(dlist)
			result[from_date.strftime("%Y-%m-%d")][1] = from_date.strftime("%d-%m-%Y")
		else:
			result[from_date.strftime("%Y-%m-%d")] = [2,from_date.strftime("%d-%m-%Y")]

		from_date = from_date + timedelta ( days = 1 )

	return result

def to_json_date( indate ):
	"""convert to dict or empty"""

	if not indate:
		return""
	else:
		if type(indate) == datetime and indate.date() == date(2200, 1, 1) or\
		   indate == date(2200, 1, 1):
			return ""
		else:
			return dict ( year = indate.year,
			              month = indate.month,
			              day = indate.day)

def date_by_adding_business_days(from_date, add_days,holidays):
	"date_by_adding_business_days"
	business_days_to_add = add_days
	current_date = from_date
	while business_days_to_add > 0:
		current_date += timedelta(days=1)
		weekday = current_date.weekday()
		if weekday >= 5: # sunday = 6
			continue
		if current_date in holidays:
			continue
		business_days_to_add -= 1
	return current_date
