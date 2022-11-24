# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:
# Purpose:     07/07/2008
#
# Author:       --<>
#
# Created:
# RCS-ID:        $Id:  $
# Copyright:   (c) 2008

#-----------------------------------------------------------------------------

from threading import RLock

def synchronized(lockname="_def_name"):
    def decorator(func):
        def wrapper(self,*__args,**__kw):
            rlock = getattr(self,lockname,None)
            if rlock ==None:
                rlock = self.__dict__.setdefault(lockname,RLock())
            rlock.acquire()
            try:
                return func(self,*__args,**__kw)
            finally:
                rlock.release()
        wrapper.__name__ = func.__name__
        wrapper.__dict__ = func.__dict__
        wrapper.__doc__ = func.__doc__
        return wrapper
    return decorator


def traced(func):
    def wrapper(*__args,**__kw):
        print ("entering", func)
        try:
            return func(*__args,**__kw)
        finally:
            print ("exiting", func)
    return wrapper