# -*- coding: utf-8 -*-
"""PPR Generic date handling """
#-----------------------------------------------------------------------------
# Name:			pprdates.py
# Purpose:	class for ppr date handling
#
# Author:		Chris Hoy
#
# Created:	15/01/2012
# Copyright:   (c) 2012
#-----------------------------------------------------------------------------
import  datetime


class DateWeekly(object):
	""" Date of week handling for ppr"""
	def __init__(self, endofweekday, nextweek = False, startdate = None):
		# today
		td = datetime.datetime.today()
		self.today = td
		self.tomorrow = td + datetime.timedelta ( days = 1 )
		self.tomorrowweek = self.tomorrow + datetime.timedelta ( days = 7 )
		if startdate :
			td = startdate
		if nextweek:
			td+=datetime.timedelta ( days = 7 )

		self.endofweek = datetime.datetime( td.year, td.month, td.day, 0, 0, 0 )
		start = self.endofweek
		eownottoday = False

		day = self.getDay(start)
		if endofweekday == 1:
			while day !=1:
				start = start + datetime.timedelta ( days = 1 )
				self.endofweek = start
				day = self.getDay(start)
				eownottoday = True
		else:
			while day < endofweekday :
				start = start + datetime.timedelta ( days = 1 )
				self.endofweek = start
				day = self.getDay(start)
				eownottoday = True

		#if eownottoday:
		#    self.startofweek = self.endofweek - datetime.timedelta ( days = 5 )
		#    self.endofweek = self.endofweek + datetime.timedelta ( days = 1 )
		#else:
		self.startofweek = self.endofweek - datetime.timedelta ( days = 6 )
		self.setupDates()

	def setupDates(self):
		self.StartSql = self.startofweek.strftime("%Y-%m-%d")
		self.EndSql = self.endofweek.strftime("%Y-%m-%d")
		self.StartDate = self.startofweek.strftime("%d/%m/%Y")
		self.EndDate = self.endofweek.strftime("%d/%m/%Y")
		self.StartDateShort = self.startofweek.strftime("%d/%m/%y")
		self.EndDateShort = self.endofweek.strftime("%d/%m/%y")
		self.StartSql2 = (self.startofweek-datetime.timedelta (days=1)).strftime("%Y-%m-%d")
		self.tomorrowDate = self.tomorrow.strftime("%Y-%m-%d")
		self.tomorrowWeekDate = self.tomorrowweek.strftime("%Y-%m-%d")
		self.endofweek_date = datetime.date(self.endofweek.year, self.endofweek.month, self.endofweek.day)
		self.startofweek_date = datetime.date(self.startofweek.year, self.startofweek.month, self.startofweek.day)

	def MoveBackWeek(self):
		self.startofweek-= datetime.timedelta ( days = 7 )
		self.endofweek-= datetime.timedelta ( days = 7 )
		self.setupDates()

	def getTimeFrame(self,weeks,sql = False ):
		if sql:
			return ( (self.startofweek - datetime.timedelta (weeks = weeks )).strftime("%Y-%m-%d") , self.endofweek.strftime("%Y-%m-%d") )
		else:
			return ( self.startofweek - datetime.timedelta (weeks = weeks ) , self.endofweek )

	def getWeekArray(self,weeks):
		def _doRange(self,a):
			r = datetime.timedelta(weeks=a)
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

	def getDay(self,date):
		day = date.weekday()
		day = day + 2
		if day == 8:
			day = 1
		return day

	def getDays(self,start_date,end_date):

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
			result.append ((self.getDay(start),start.strftime("%Y-%m-%d")))
			start = start + datetime.timedelta ( days = 1 )

		return result

	def ShouldIgnore(self,d1,d2,dayid):
		sdate = datetime.datetime(d1.year, d1.month, d1.day)
		try:
			edate = datetime.datetime(d2.year, d2.month, d2.day)
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
			thisdate = d1
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


	def getEndofWeekPosh(self):
		return self.endofweek.strftime("%a %d %b")

	def getEndofWeekDisplay(self):
		return self.endofweek.strftime("%d %m %Y")


def BuildDayList(dc1,dc2,tomorrow = False):
	"""return a list of day id for between to days"""
	result = []

	if dc1 :
		start = dc1
	else:
		start = datetime.date.today()

	if tomorrow:
		start = start + datetime.timedelta ( days = 1 )

	if dc2 :
		end = dc2
	else:
		end = datetime.date.today()

	while start <= end :
		day = start.weekday()
		day = day + 2
		if day == 8:
			day = 1

		result.append ((day,datetime.date(start.year,start.month,start.day)))
		start = start + datetime.timedelta ( days = 1 )

	return result