# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:         schedEvents.py
# Purpose:     To run the report generator application
#
# Author:       Chris Hoy
#
# Created:      22/10/2008
# RCS-ID:       $Id:  $
# Copyright:  (c) 2008

# look at sub-process.py look at better
#-----------------------------------------------------------------------------
from prmax.utilities.scheduler import Scheduler, ScheduleTask, SqlCommand, CheckQueue
from prmax.utilities.syncCacheDBInfo import SycnInfoForCacheDB, deleteAdvanceFeatures
# command list
Command_CleanUp = """SELECT * FROM SystemCleanUp()"""
Command_Optimize = "VACUUM"


Command_Cache_Clean = """ DELETE FROM actionlog WHERE when_date < CURRENT_DATE - interval '1 months'"""

Command_Visit_Clean = """DELETE FROM public.visit where expiry < CURRENT_DATE - interval '3 months'"""
Command_Email_Clean = """DELETE FROM queues.emailqueue where sent < CURRENT_DATE - interval '1 months'"""
Command_Word_Clean = """DELETE FROM queues.mswordqueue where uploaded < CURRENT_DATE - interval '1 months'"""
Command_Attachments_Clean = """DELETE FROM userdata.emailtemplatesattachements WHERE emailtemplateid in (
select emailtemplateid from userdata.emailtemplates where pressreleasestatusid = 2 and sent_time < current_date - Interval '5 days' and
( embargo is null or embargo < current_date - Interval '5 days' ) )"""

Command_Disabled_Expired_Demo = """UPDATE internal.customers AS c
SET customerstatusid = 3
WHERE c.isdemo = TRUE AND licence_expire < current_date AND c.isinternal = FALSE AND c.customerstatusid = 2"""


s = Scheduler()

# add options daily
s.addTask(ScheduleTask(0, (8, 53), SqlCommand(Command_CleanUp)))
s.addTask(ScheduleTask(0, (23, 00), SqlCommand(Command_Attachments_Clean)))
s.addTask(ScheduleTask(0, (23, 10), SqlCommand(Command_Visit_Clean)))
s.addTask(ScheduleTask(0, (23, 20), SqlCommand(Command_Email_Clean)))
s.addTask(ScheduleTask(0, (23, 30), SqlCommand(Command_Word_Clean)))
s.addTask(ScheduleTask(0, (23, 40), SqlCommand(Command_Cache_Clean, tocache=True)))
s.addTask(ScheduleTask(0, (23, 55), SqlCommand(Command_Optimize)))
s.addTask(ScheduleTask(1, 3600, SycnInfoForCacheDB))
s.addTask(ScheduleTask(0, (22,01), deleteAdvanceFeatures))
s.addTask(ScheduleTask(0, (22,04), SqlCommand(Command_Disabled_Expired_Demo)))
#s.addTask( ScheduleTask(1, 14400, CheckQueue))


s.run()
