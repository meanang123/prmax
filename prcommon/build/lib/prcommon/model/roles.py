# -*- coding: utf-8 -*-
"""prmaxrole record """
#-----------------------------------------------------------------------------
# Name:        roles.py
# Purpose:     Hold the interface to the prmax roles
# Author:      Chris Hoy
#
# Created:     27/06/2009
# RCS-ID:      $Id:  $
# Copyright:   (c) 2009

#-----------------------------------------------------------------------------
import logging
from turbogears.database import  metadata, mapper, session
from sqlalchemy import Table, Column, Integer
from sqlalchemy.sql import text
from prcommon.model.common import BaseSql

LOGGER = logging.getLogger("prmax.model")

class PRMaxRoleSynonymsView(BaseSql):
	"PRMaxRoleSynonymsView"
	pass

class PRMaxRoleSynonyms(BaseSql):
	"PRMaxRoleSynonyms"
	pass

class PRMaxRoles(BaseSql):
	""" Prmax role list"""

# add back when gonto postgres 9.x
#	  array_to_string(array(
#    SELECT prp.prmaxrole FROM internal.prmaxrolesynonyms AS prs
#	  JOIN internal.prmaxroles AS prp ON prp.prmaxroleid = prs.childprmaxroleid
#	  WHERE prs.parentprmaxroleid = pr.prmaxroleid ORDER BY prp.prmaxrole LIMIT 2), ', ')

	ListData = """
		SELECT
		pr.prmaxroleid,
		pr.prmaxrole,
		pr.visible,
	  '' AS roles
		FROM internal.prmaxroles AS pr  """

	ListData_2 = """ ORDER BY  %s %s LIMIT :limit  OFFSET :offset """

	ListDataCount = """ SELECT COUNT(*) FROM  internal.prmaxroles as pr """

	@classmethod
	def get_grid_page(cls, params):
		""" get display page for role maintanence """
		filtercommand = ""
		if params.has_key("filter") and params["filter"]:
			filtercommand = " WHERE prmaxrole ilike :rolefilter"
			params["rolefilter"] = "%" + params["filter"] + "%"
		if params.has_key("visible"):
			if filtercommand:
				filtercommand += " AND visible=true"
			else:
				filtercommand += " WHERE visible=true"

		return BaseSql.getGridPage(
									params,
									'prmaxrole',
									'prmaxroleid',
									PRMaxRoles.ListData + filtercommand + PRMaxRoles.ListData_2,
									PRMaxRoles.ListDataCount + filtercommand,
									cls)

	@classmethod
	def get_rest_list(cls, params):
		"""get result as rest """

		single = True if "prmaxroleid" in params else False
		return cls.grid_to_rest(cls.get_grid_page(params),
		                        params['offset'],
		                        single)

	@classmethod
	def getLookUp(cls, params):
		""" get a listing """
		return [dict(id=row.prmaxroleid, name=row.prmaxrole)
		        for row in session.query(PRMaxRoles).\
		        filter(PRMaxRoles.visible == 1).\
		        order_by(PRMaxRoles.prmaxrole).all()]

	@classmethod
	def exists(cls, params):
		""" check to see a specufuc role exists """

		data = session.query(PRMaxRoles).filter_by(prmaxrole=params["rolename"])
		return True if data.count() > 0 else False

	@classmethod
	def add(cls, params):
		""" add a new role to the system """
		transaction = cls.sa_get_active_transaction()

		try:
			prmaxrole = PRMaxRoles(prmaxrole=params["rolename"])
			session.add(prmaxrole)
			session.flush()
			transaction.commit()
			return prmaxrole
		except:
			LOGGER.exception("PRMaxRoles Add")
			try:
				transaction.rollback()
			except:
				pass
			raise

	@classmethod
	def set_visible(cls, params):
		""" set or hide the visiblility of a prmaxrole """
		transaction = cls.sa_get_active_transaction()

		try:
			prmaxrole = PRMaxRoles.query.get(params["prmaxroleid"])
			prmaxrole.visible = True if "visible" in params else False

			if not "visible" in params:
				# get list of interesys
				dbinterests = session.query(PRMaxRoleInterests).filter_by(prmaxroleid=params["prmaxroleid"])
				# remove all the link information
				for prmaxrec in session.query(PRMaxRoleSynonyms).filter_by(parentprmaxroleid=params["prmaxroleid"]):
					# delete child roles
					tmp = PRMaxRoles.query.get(prmaxrec.childprmaxroleid)
					session.delete(prmaxrec)
					# remove role from all children
					session.execute("""DELETE FROM employeeprmaxroles
					WHERE employeeid IN ( SELECT employeeid FROM employees WHERE job_title =:job_title AND customerid=-1) """,
					    dict(job_title=tmp.prmaxrole), mapper=cls)
					# delete interests
					for interest in dbinterests:
						session.execute("""DELETE FROM employeeinterests AS ei
						USING employeeprmaxroles AS epr
						WHERE ei.interestid = :interestid AND ei.employeeid = epr.employeeid AND epr.prmaxroleid = :prmaxroleid AND ei.sourceid = 2 """, \
						dict(prmaxroleid=prmaxrole.prmaxroleid, interestid=interest.interestid), \
						mapper=cls)
				for interest in session.query(PRMaxRoleInterests).filter_by(prmaxroleid=params["prmaxroleid"]):
					session.delete(interest)

			else:
				# forice the primary contact
				# this is wrong should delete on the prmaxroleid
				session.execute("""DELETE FROM employeeprmaxroles
					WHERE employeeid IN ( SELECT employeeid FROM employees WHERE job_title =:job_title AND customerid=-1) """,
					    dict(job_title=prmaxrole.prmaxrole), mapper=cls)

				session.execute("""INSERT INTO employeeprmaxroles(employeeid,outletid,prmaxroleid)
				SELECT employeeid,outletid,:prmaxroleid FROM employees WHERE job_title =:job_title AND customerid=-1 AND prmaxstatusid != 2 """,
           dict(prmaxroleid=prmaxrole.prmaxroleid, job_title=prmaxrole.prmaxrole), mapper=cls)

			session.flush()
			transaction.commit()
		except:
			LOGGER.exception("PRMaxRoles setvisible")
			try:
				transaction.rollback()
			except:
				pass
			raise

	@classmethod
	def get_ext(cls, prmaxroleid):
		""" Get prmaxrole details and extended details"""

		return dict(
		  prmaxroleslist=session.query(PRMaxRoleSynonymsView).filter_by(prmaxroleid=prmaxroleid).order_by(PRMaxRoleSynonymsView.prmaxrole).all(),
		  prmaxrole=PRMaxRoles.query.get(prmaxroleid),
		  prmaxlistinterests=session.query(PRMaxRoleInterestsView).filter_by(prmaxroleid=prmaxroleid).order_by(PRMaxRoleInterestsView.interestname).all())

	Find_Role = """ SELECT r.prmaxroleid, r.prmaxrole FROM internal.prmaxroles as r WHERE r.prmaxrole ilike :prmaxrole AND r.prmaxroleid != :prmaxroleid ORDER BY UPPER(r.prmaxrole)"""

	@classmethod
	def find(cls, prmaxroleid, prmaxrole):
		""" Find """

		data = dict(prmaxroleid=prmaxroleid, prmaxrole='%' + prmaxrole + '%')
		return cls.sqlExecuteCommand(PRMaxRoles.Find_Role, data, BaseSql.ResultAsList)


	@classmethod
	def update_synonims(cls, params):
		""" Update the synonims for a prmaxrole
		This also now updates the interest for the role
		"""

		transaction = cls.sa_get_active_transaction()

		try:

			# first we need to add/delete the interests
			prmaxlist = {}
			for prmaxr in PRMaxRoleInterests.query.filter_by(prmaxroleid=params["prmaxroleid"]).all():
				prmaxlist[prmaxr.interestid] = prmaxr

			exist = {}
			# do adds
			for interestid in params["interests"] if params["interests"] else []:
				exist[interestid] = interestid
				if not interestid in prmaxlist:
					session.add(PRMaxRoleInterests(prmaxroleid=params["prmaxroleid"],
					                               interestid=interestid))
					# at this point we need to add this to all the place where this is used
					#if already exist we need too capture and convert even if private
					_result = session.execute("""INSERT INTO employeeinterests (employeeid, interestid, sourceid, outletid, employeeprmaxroleid )
					SELECT epr.employeeid, :interestid,2,epr.outletid,epr.employeeprmaxroleid
					FROM employeeprmaxroles AS epr
					WHERE  NOT EXISTS  (SELECT interestid FROM employeeinterests AS eii WHERE eii.interestid = :interestid AND epr.employeeid = eii.employeeid)
					AND epr.prmaxroleid =:prmaxroleid""",
					        dict(prmaxroleid=params["prmaxroleid"], interestid=interestid),
					        mapper=cls)

			# do deletes
			for prmaxrec in prmaxlist.itervalues():
				if not prmaxrec.interestid in exist:
					session.delete(prmaxrec)
					# simple cascade od delete record
					session.execute("""DELETE FROM employeeinterests AS ei
					USING employeeprmaxroles AS epr
					WHERE ei.interestid = :interestid AND ei.employeeid = epr.employeeid AND epr.prmaxroleid = :prmaxroleid AND ei.sourceid = 2""",
					    dict(prmaxroleid=params["prmaxroleid"], interestid=prmaxrec.interestid),
					        mapper=cls)

			# now do setup
			prmaxrole = PRMaxRoleSynonyms.query.filter_by(parentprmaxroleid=params["prmaxroleid"]).all()
			prmaxlist = {}
			for prmaxr in prmaxrole:
				prmaxlist[prmaxr.childprmaxroleid] = prmaxr

			exist = {}
			for prmaxroleid in params["roles"] if params["roles"] else []:
				exist[prmaxroleid] = prmaxroleid
				if not prmaxroleid in prmaxlist:
					session.add(PRMaxRoleSynonyms(parentprmaxroleid=params["prmaxroleid"],
					                              childprmaxroleid=prmaxroleid))
					# at this point we now need to examine all job titles and add a role for them
					# add role should cascade the interests
					tmp = PRMaxRoles.query.get(prmaxroleid)
					session.execute("""INSERT INTO employeeprmaxroles(employeeid,outletid,prmaxroleid)
						SELECT employeeid,outletid,:prmaxroleid FROM employees WHERE job_title =:job_title AND customerid=-1 AND prmaxstatusid != 2""",
					    dict(prmaxroleid=params["prmaxroleid"], job_title=tmp.prmaxrole), mapper=cls)

					session.flush()

			for prmaxrec in prmaxrole:
				if not prmaxrec.childprmaxroleid in exist:
					tmp = PRMaxRoles.query.get(prmaxrec.childprmaxroleid)
					session.delete(prmaxrec)
					# at this point we now need to examine all job titles and delete a role for them
					# delete role should cascade the interests
					session.execute("""DELETE FROM employeeprmaxroles
					WHERE employeeid IN ( SELECT employeeid FROM employees WHERE job_title =:job_title AND customerid=-1) """,
					    dict(job_title=tmp.prmaxrole), mapper=cls)

			session.flush()
			transaction.commit()
		except:
			LOGGER.exception("PRMaxRoleSynonyms update_synonims")
			try:
				transaction.rollback()
			except:
				pass
			raise

	@classmethod
	def update_roles_db(cls, params):
		""" replace the exusting role map with the new role map"""

		transaction = cls.sa_get_active_transaction()

		try:
			#session.execute(text("select Reapplyroles()"), None, cls)
			transaction.commit()
		except:
			LOGGER.exception("PRMaxRoles update_roles_db")
			try:
				transaction.rollback()
			except:
				pass
			raise

class PRMaxRolesWords(BaseSql):
	""" Prmax role word inteface"""

	# command to get a list of workds
	Words_List = "SELECT pr.prmaxrole,pr.prmaxroleid FROM internal.prmaxrolewords as prw JOIN internal.prmaxroles as pr ON prw.prmaxroleid = pr.prmaxroleid WHERE prw.word ilike :word%d"
	Words_List_Last_Line = " GROUP BY pr.prmaxrole,pr.prmaxroleid ORDER BY prmaxrole"

	@classmethod
	def get_user_selection(cls, inparams):
		""" get a list of roles for the words"""
		lines = []
		params = {}
		for word in inparams["word"]:
			if lines:
				lines.append("Intersect")
			indexid = inparams["word"].index(word)+1
			params["word"+ str(indexid)] = word
			lines.append(PRMaxRolesWords.Words_List%(indexid))

		return cls.sqlExecuteCommand(text(" ".join(lines) + PRMaxRolesWords.Words_List_Last_Line),
									   params, BaseSql.ResultAsList)

class PRMaxRoleInterests(BaseSql):
	""" List of interest that are associated with a role """
	pass

class PRMaxRoleInterestsView(BaseSql):
	""" view of prmaxroles and interestname  """
	pass


#########################################################
## Map object to db
#########################################################

PRMaxRoles.mapping = Table('prmaxroles', metadata, autoload=True, schema='internal')
PRMaxRolesWords.mapping = Table('prmaxrolewords', metadata, autoload=True, schema='internal')
PRMaxRoleSynonyms.mapping = Table('prmaxrolesynonyms', metadata, autoload=True, schema='internal')
PRMaxRoleSynonymsView.mapping = Table('prmaxrolesynonyms_view', metadata,
							Column("prmaxroleid", Integer, primary_key=True), # needed to load a view
							Column("synonymid", Integer, primary_key=True), # needed to load a view
							autoload=True)
PRMaxRoleInterests.mapping  = Table('prmaxroleinterests', metadata, autoload=True, schema='internal')

PRMaxRoleInterestsView.mapping = Table('prmaxroleinterest_view', metadata,
							Column("prmaxroleid", Integer, primary_key=True), # needed to load a view
							Column("interestid", Integer, primary_key=True), # needed to load a view
							autoload=True)

mapper(PRMaxRoleSynonymsView, PRMaxRoleSynonymsView.mapping)
mapper(PRMaxRoleSynonyms, PRMaxRoleSynonyms.mapping)
mapper(PRMaxRoles, PRMaxRoles.mapping)
mapper(PRMaxRolesWords, PRMaxRolesWords.mapping)
mapper(PRMaxRoleInterests, PRMaxRoleInterests.mapping)
mapper(PRMaxRoleInterestsView, PRMaxRoleInterestsView.mapping)

