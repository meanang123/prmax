#!/usr/bin/env python
# -*- coding: utf-8 -*-
# Author:   --<>
# Purpose: 
# Created: 01/06/2007


from threading import Lock
import time

_lock_storage = {}
_storage_lock = Lock()

def get_lock(file_id):
	file_lock = None
	_storage_lock.acquire()
	try:	
		file_lock = _lock_storage.get(file_id)
		if not file_lock: 
			file_lock = _lock_storage[file_id]=Lock()
		else:
			time.sleep(0.2)
	finally:
		_storage_lock.release()
	
	if file_lock:
		try:
			file_lock.acquire()
		except Exception, details:
			print (details)

def release_lock(file_id):
	try:
		_storage_lock.acquire()
		try:
			file_lock = _lock_storage.get(file_id)
			file_lock.release()
		finally:
			_storage_lock.release()
	except: pass
	