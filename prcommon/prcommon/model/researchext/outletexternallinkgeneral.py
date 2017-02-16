# -*- coding: utf-8 -*-
"""OutletExternalLinkGeneral Record """
#-----------------------------------------------------------------------------
# Name:        outletexternallinkgeneral.py
# Purpose:
# Author:      Chris Hoy
# Created:     08/05/2015
# Copyright:   (c) 2015
#-----------------------------------------------------------------------------
import logging
import xlrd
from turbogears.database import session
from sqlalchemy import text
from prcommon.model.common import BaseSql
from prcommon.model.researchext.outletexternallinks import OutletExternalLink
from prcommon.model.clippings.clipping import Clipping
from prcommon.model.outlet import Outlet
from prcommon.model.queues import ProcessQueue
from prcommon.model.lookups import ClippingSource
import prcommon.Constants as Constants

LOGGER = logging.getLogger("prcommon")

class OutletExternalLinkGeneral(object):
	""" OutletExternalLinkGeneral record """

	Grid_View = """
	SELECT outletexternallinkid,linktext,linkdescription,oel.outletid,o.outletname,url,
	linktypeid,
	cs.clippingsourcedescription AS clipsource,
	cs.clippingsourceid
	FROM research.outlet_external_links as oel
	LEFT OUTER JOIN outlets AS o ON o.outletid = oel.outletid
	LEFT OUTER JOIN internal.clippingsource AS cs ON cs.clippingsourceid = oel.linktypeid"""

	Grid_View_Count = """SELECT COUNT(*) FROM research.outlet_external_links AS oel LEFT OUTER JOIN outlets AS o ON o.outletid = oel.outletid"""

	@staticmethod
	def get_rest_page(params):
		"""Rest Page """

		whereclause = ''
		if params.get('not_linked', 'false') == 'true':
			whereclause = BaseSql.addclause(whereclause, 'oel.outletid IS NULL')

		if 'linktext' in params:
			whereclause = BaseSql.addclause(whereclause, 'oel.linktext ilike :linktext')
			params['linktext'] = params['linktext'] + '%'

		if 'linkdescription' in params:
			whereclause = BaseSql.addclause(whereclause, 'oel.linkdescription ilike :linkdescription')
			params['linkdescription'] = '%' + params['linkdescription'] + '%'

		if 'linkurl' in params:
			whereclause = BaseSql.addclause(whereclause, 'oel.url ilike :linkurl')
			params['linkurl'] = '%' + params['linkurl'] + '%'

		if 'hide_ignore' in params:
			whereclause = BaseSql.addclause(whereclause, 'oel.ignore = false')

		data = BaseSql.get_grid_page(
		  params,
		  'linktext',
		  'datasourcetranslationid',
		  OutletExternalLinkGeneral.Grid_View + whereclause + BaseSql.Standard_View_Order,
		  OutletExternalLinkGeneral.Grid_View_Count + whereclause,
		  OutletExternalLink)

		return BaseSql.grid_to_rest(data, params["offset"])

	Grid_Outlet_View = """SELECT outletid,outletname,outletid as id FROM outlets AS o """
	Grid_View_Outlet_Count = """SELECT COUNT(*) FROM outlets AS o """

	@staticmethod
	def list_outlets(params):
		"""Rest Page """

		whereclause = BaseSql.addclause('', 'o.customerid=-1 AND o.sourcetypeid IN (1,2)')
		if 'outletid' in params:
			whereclause = BaseSql.addclause(whereclause, 'o.outletid=:outletid')
			params['outletid'] = int(params['outletid'])

		if 'countryid' in params:
			whereclause = BaseSql.addclause(whereclause, 'o.countryid=:countryid')
			params['countryid'] = int(params['countryid'])

		if "outletname" in params:
			if params["outletname"] != "*":
				whereclause = BaseSql.addclause(whereclause, "outletname ilike :outletname")
				if params["outletname"]:
					if params["outletname"][-1] == "*":
						params["outletname"] = params["outletname"][:-1]
					params["outletname"] = params["outletname"] + "%"

		data = BaseSql.get_grid_page(
		  params,
		  'outletname',
		  'outletid',
		  OutletExternalLinkGeneral.Grid_Outlet_View + whereclause + BaseSql.Standard_View_Order,
		  OutletExternalLinkGeneral.Grid_View_Outlet_Count + whereclause,
		  OutletExternalLink)

		return BaseSql.grid_to_rest(data,
		                            params["offset"],
		                            	True if 'outletid' in params else False)

	@staticmethod
	def get(outletexternallinkid):
		"get"

		oelr = OutletExternalLink.query.get(outletexternallinkid)
		data = dict(outletexternallinkid=oelr.outletexternallinkid,
		            linktypeid=oelr.linktypeid,
		            linktext=oelr.linktext,
		            linkdescription=oelr.linkdescription,
		            outletid=oelr.outletid,
		            outletname='',
		            countryid=1,
		            clippingsourcedescription="",
		            clippingsourceid=1,
		            url=oelr.url,
		            ignore=oelr.ignore)
		if oelr.outletid:
			record = session.query(Outlet.outletname, Outlet.countryid).filter(Outlet.outletid == oelr.outletid).one()
			data['outletname'] = record[0]
			data['countryid'] = record[1]
			clipsource = ClippingSource.query.get(oelr.linktypeid)
			if clipsource:
				data["clipsource"] = clipsource.clippingsourcedescription
				data["clippingsourceid"] = clipsource.clippingsourceid

		return data


	@staticmethod
	def update(params):
		"update"
		transaction = BaseSql.sa_get_active_transaction()
		try:

			oelr = OutletExternalLink.query.get(params['outletexternallinkid'])
			oelr.outletid = params['outletid']
			oelr.ignore = False if params['outletid'] else params['ignore']

			if oelr.linktypeid == Constants.Outlet_link_source_madaptive:
				session.query(Clipping).filter(Clipping.clip_outlet_source_name == oelr.linktext).\
				  filter(Clipping.clippingsourceid == Constants.Outlet_link_source_madaptive).\
				  update({'outletid': params['outletid']})
				session.flush()
			else:
				session.query(Clipping).filter(Clipping.clip_outlet_source_id == oelr.linktext).update({'outletid': params['outletid'],})
				session.flush()
			# this doens't work sqlalchemy doesn't allow constants at this point
			#query = session.query(OutletExternalLink.outletid, Constants.Process_Clipping_View).filter_by(outletid=params['outletid'])
			#ins = insert(ProcessQueue).from_select((ProcessQueue.objectid, ProcessQueue.objecttypeid), query)
			session.execute(text("""INSERT INTO queues.processqueue(objectid,processid) SELECT clippingid,:processid FROM userdata.clippings WHERE outletid =:outletid"""),
			                dict(outletid=params['outletid'],
			                     processid=Constants.Process_Clipping_View),
			                ProcessQueue)

			transaction.commit()
		except:
			LOGGER.exception("update_clippings_link_outlets")
			transaction.rollback()
			raise

	@staticmethod
	def import_xls(sourcefile):

		transaction = BaseSql.sa_get_active_transaction()
		try:
			workbook = xlrd.open_workbook(sourcefile)
			xls_sheet = workbook.sheet_by_name("Sheet1")
			for rnum in xrange(1, xls_sheet.nrows):
				try:
					outletid = int(xls_sheet.cell_value(rnum, 2))
					exists = session.query(Outlet.outletid).filter(Outlet.outletid == outletid).scalar()
					if not exists:
						continue
				except:
					continue
				ipcb = str(int(xls_sheet.cell_value(rnum, 0)))
				record = session.query(OutletExternalLink).filter(OutletExternalLink.linktext == ipcb).scalar()
				if record and record.outletid != outletid:
					record.outletid = outletid

				elif not record:
					session.add(OutletExternalLink(
					  linktext=ipcb,
					  linkdescription=xls_sheet.cell_value(rnum, 1),
					  outletid=outletid,
					  linktypeid=Constants.Clipping_Source_IPCB))
					session.query(Clipping).filter(Clipping.clip_outlet_source_id == ipcb).update({'outletid': outletid,})
			transaction.commit()
		except:
			LOGGER.exception("update_clippings_link_outlets")
			transaction.rollback()
			raise
