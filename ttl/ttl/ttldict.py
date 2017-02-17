# -*- coding: utf-8 -*-
from __future__ import with_statement

from threading import Lock
from  datetime import datetime, timedelta
import random

class SafeDict(dict):
	def __init__(self,*args,**kwargs):
		self.mylock=Lock();
		super(SafeDict, self).__init__(*args, **kwargs)

	def __setitem__(self,*args,**kwargs):
		with self.mylock:
			super(SafeDict,self).__setitem__(*args,**kwargs)

class NotTooOften(object):
	"""Attempt not to bombard domain"""
	def __init__(self):
		""" setup"""
		self._dict =  SafeDict()

	def _get_domain(self, email):
		"""get domain for email"""

		# check for invalid email address
		tmp = email.split("@")
		if len(tmp) > 1:
			return tmp[1].lower()
		else:
			return""

	def set_sent(self, email):
		"""Set the time and email last sent too this domain"""

		# check for invalid email address
		if email.find("@") !=  -1:
			domain = self._get_domain(email)
			self._dict[domain] = datetime.now()

	def _get_random_seconds( self ):
		"""number of seconds to add """

		return random.randint(1, 10)

	def able_to_send(self, email):
		"""check too see if we should send email email too thhis domain"""
		domain = self._get_domain(email)

		if domain in self._dict:
			if self._dict[domain] + timedelta(seconds = self._get_random_seconds()) < datetime.now():
				return True
			return False
		else:
			return True