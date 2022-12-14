# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:        md_Display.py
# Purpose:
#
# Author:      Chris Hoy
#
# Created:     27-10-2008
# RCS-ID:      $Id:  $
# Copyright:   (c) 2008

#-----------------------------------------------------------------------------
from turbogears.database import session, mapper, metadata
from sqlalchemy import Table, desc
from sqlalchemy.sql import text

from prmax.prmaxmodel.md_Common import BaseSql
from prmax.prmaxmodel.md_Outlet import Outlet, OutletCustomerView
from prcommon.model import OutletProfile, CirculationSources, CirculationDates, Frequencies, OutletPrices, WebSources, WebDates, OutletLanguages
from prcommon.model.language import Languages
from prcommon.model.productioncompany import ProductionCompany
import prmax.Constants as Constants
from ttl.dates import strftimeext

import logging
log = logging.getLogger("prmax.md_Display")

class DisplayAlt(object):
	""" other name object """
	pass

class Display(object):
	"""Display    """
	@classmethod
	def getContactCount(cls, params):
		""" getContactCount """
		return -1

	@classmethod
	def getDisplayContactPage(cls, params):
		""" getDisplayContactPage """

class OutletDisplay(BaseSql):
	"""
	OutletDisplay
	"""
	Outlet_Display_Details = """
	SELECT
	o.outletname,op.outletname as poutletname,op.outletid as poutletid,
	get_override(oc_c.tel,c.tel) as tel,
	get_overrideflag(oc_c.tel,c.tel) as telflag,
	get_override(oc_c.email,c.email) as email,
	get_overrideflag(oc_c.email,c.email) as emailflag,
	get_override(oc_c.fax,c.fax) as fax,
	get_overrideflag(oc_c.fax,c.fax) as faxflag,
	get_override(oc_c.mobile,c.mobile) as mobile,
	get_overrideflag(oc_c.mobile,c.mobile) as mobileflag,
	o.outlettypeid,
	addr_co.countryname,
	CASE WHEN a_oc.address1 IS NULL THEN
	    CASE WHEN (o.sourcetypeid = 5 OR o.sourcetypeid = 6) THEN
	        CASE WHEN a_o.county = a_o.townname THEN
	            AddressFull(a_o.address1,a_o.address2,a_o.townname,'',town.geographicalname,a_o.postcode,'')
	        ELSE
	            AddressFull(a_o.address1,a_o.address2,a_o.townname,'',town.geographicalname,a_o.postcode,'')
	        END
	    ELSE
	        AddressFull(a_o.address1,a_o.address2,a_o.county,a_o.postcode,town.geographicalname,a_o.townname,'')
	    END
	ELSE
	    CASE WHEN (o.sourcetypeid = 5 OR o.sourcetypeid = 6) THEN
	        CASE WHEN a_oc.county = a_oc.townname THEN
	            AddressFull(a_oc.address1,a_oc.address2,a_oc.townname,'',a_octown.geographicalname,a_oc.postcode,'')
	        ELSE
	            AddressFull(a_oc.address1,a_oc.address2,a_oc.townname,'',a_octown.geographicalname,a_oc.postcode,'')
	        END
	    ELSE
	        AddressFull(a_oc.address1,a_oc.address2,a_oc.county,a_oc.postcode,a_octown.geographicalname,a_oc.townname,'')
	    END
	END as address,
	CASE WHEN a_oc.address1 IS NULL THEN  false ELSE true END as addressflag,
	ot.outlettypename,ii.industryname,f.frequencyname,rf.regionalfocusname,o.circulation,
	o.profile,o.established,o.price,o.subprice,
	Web_To_Html_Link_address(o.www) as www,
	dp.deliverypreferencename,
	ContactName(con.prefix,con.firstname,con.middlename,con.familyname,con.suffix) as contactname,
	CASE WHEN o.customerid=-1 AND NOT e.customerid=-1 THEN true ELSE false END as employeeflag,
	e.job_title,
	o.customerid,
	o.outletid,
	o.outlettypeid,
	get_overrideflag(oc.primaryemployeeid,o.primaryemployeeid) as primaryflag,
	prmax_ot.prmax_outlettypename,
	o.prmax_outlettypeid,
	pub.publishername,
	co.countryname,
	o.mp_sqcm,
	c.twitter,
	c.linkedin,
	c.instagram,
	c.facebook,
	c.facebook as profileimageurl,
	l.languagename,
	Web_To_Html_Link_address(c.blog) as blog
	FROM outlets as o
	LEFT OUTER JOIN outletcustomers as oc ON oc.outletid = o.outletid AND oc.customerid = :customerid
	LEFT OUTER JOIN outlets as op ON o.parentoutletid = op.outletid
	JOIN communications as c ON c.communicationid = o.communicationid
	LEFT OUTER JOIN communications as oc_c ON oc_c.communicationid = oc.communicationid
	LEFT OUTER JOIN addresses as a_o on a_o.addressid = c.addressid
	LEFT OUTER JOIN addresses as a_oc on a_oc.addressid = oc_c.addressid
	JOIN internal.outlettypes as ot on ot.outlettypeid = o.outlettypeid
	LEFT OUTER JOIN internal.industries as ii on ii.industryid = o.industryid
	LEFT OUTER JOIN internal.frequencies as f on f.frequencyid = o.frequencyid
	LEFT OUTER JOIN internal.regionalfocus as rf on rf.regionalfocusid = o.regionalfocusid
	LEFT OUTER JOIN internal.deliverypreferences as dp ON dp.deliverypreferenceid = o.deliverypreferenceid
	LEFT OUTER JOIN internal.geographical AS town ON a_o.townid=town.geographicalid
	LEFT OUTER JOIN  internal.geographical AS a_octown ON a_oc.townid=a_octown.geographicalid
	LEFT OUTER JOIN employees as e ON CASE WHEN  oc.primaryemployeeid IS NULL THEN o.primaryemployeeid ELSE oc.primaryemployeeid END = e.employeeid
	LEFT OUTER JOIN contacts as con ON con.contactid = e.contactid
	LEFT OUTER JOIN internal.prmax_outlettypes AS prmax_ot ON prmax_ot.prmax_outlettypeid = o.prmax_outlettypeid
	LEFT OUTER JOIN internal.countries AS co ON co.countryid = o.countryid
	LEFT OUTER JOIN internal.countries AS addr_co ON addr_co.countryid = o.countryid
	LEFT OUTER JOIN internal.publishers AS pub ON o.publisherid = pub.publisherid
	LEFT OUTER JOIN outletlanguages AS ol ON ol.outletid = o.outletid and ol.isprefered = 1
	LEFT OUTER JOIN internal.languages AS l ON l.languageid = ol.languageid
	
	WHERE
	o.outletid = :outletid"""

	Outlet_Display_Interest_Query = """
	SELECT interestname  FROM outletinterest_view
	WHERE ( customerid=-1 OR customerid=:customerid ) AND outletid = :outletid AND interesttypeid = 1"""

	Outlet_Display_Tags_Query = """
	SELECT interestname  FROM outletinterest_view
	WHERE ( customerid=-1 OR customerid=:customerid ) AND outletid = :outletid AND interesttypeid = 2"""

	Freelance_Display_Interest_Query = """
	SELECT interestname FROM employeeinterest_view
	WHERE ( customerid=-1 OR customerid=:customerid ) AND employeeid = :employeeid"""


	Outlet_Display_Series = """
	SELECT o.outletname from outlets as o
	WHERE ( o.customerid is NULL OR o.customerid=:customerid ) AND o.parentoutletid = :outletid
	ORDER BY o.outletname"""

	Outlet_Display_Coverage_Query = """
	select oc.geographicalname from outletcoverage_view as oc
	WHERE ( oc.customerid=-1 OR oc.customerid=:customerid ) AND oc.outletid = :outletid"""

	Outlet_Display_Primary_Contact_Query = """
	SELECT e.employeeid,e.job_title,
	ContactName(c.prefix,c.firstname,c.middlename,c.familyname,c.suffix) as contactname
	FROM employees as e
	JOIN outlets as o ON e.outletid = o.outletid
	LEFT OUTER JOIN outletcustomers as oc ON oc.outletid = o.outletid AND oc.customerid=:customerid
	LEFT OUTER JOIN contacts as c ON c.contactid = e.contactid
	WHERE ( e.customerid=-1 OR e.customerid=:customerid ) AND e.outletid = :outletid AND
	e.employeeid = COALESCE(oc.primaryemployeeid,o.primaryemployeeid)"""

	Outlet_Display_Main_Control = {
		"outlet" : (Outlet_Display_Details,False),
		"interests" : (Outlet_Display_Interest_Query,True),
		"tags" : (Outlet_Display_Tags_Query,True),
		"primary" : (Outlet_Display_Primary_Contact_Query,False),
		"coverage": (Outlet_Display_Coverage_Query,True),
	}

	Outlet_Display_Mp = {
		"outlet" : (Outlet_Display_Details,False),
		"interests" : (Outlet_Display_Interest_Query,True),
		"coverage": (Outlet_Display_Coverage_Query,True),
	}


	Outlet_Display_Extra = {
		"outlet" : (Outlet_Display_Details,False),
	}

	Outlet_Display_Coverage = {
		"coverage": (Outlet_Display_Coverage_Query,True),
	}

	Outlet_Display_Interests = {
		"interestso" : (Outlet_Display_Interest_Query,True),
		"interestsf" : (Freelance_Display_Interest_Query,True),
		"tags" : (Outlet_Display_Tags_Query,True),
	}

	Outlet_Display_Individual = {
		"outlet" : (Outlet_Display_Details,False),
		"interests" : (Freelance_Display_Interest_Query,True),
		"primary" : (Outlet_Display_Primary_Contact_Query,False),
		"tags" : (Outlet_Display_Tags_Query,True)
	}

	@classmethod
	def get_new_profile(cls, outletid):
		"""get new profile"""

		retdata = {"subtitle": "", "incorporating": "", "officialjournalof": "", "circulation": "", "webbrowsers": "", "frequency": "", "costfield": "","seriesparent": "",
		           "web_profile_link": None, "editorialprofile":"", "readership":"", "jicregreadership": "", "nrsreadership": "", "geographicalname":"", "broadcasttimes": "",
			   "seriesmembers": "", "languages": "", "supplements": "", "supplementof": "", "productioncompany": ""}

		outletprofile = OutletProfile.query.get ( outletid )
		outlet = Outlet.query.get( outletid )
		if outletprofile:
			if outletprofile.subtitle:
				retdata["subtitle"] = outletprofile.subtitle
			if outletprofile.incorporating:
				retdata["incorporating"] = outletprofile.incorporating
			if outletprofile.officialjournalof:
				retdata["officialjournalof"] = outletprofile.officialjournalof
			if  outletprofile.web_profile_link:
				retdata["web_profile_link"] =  outletprofile.web_profile_link
			if outletprofile.editorialprofile:
				retdata["editorialprofile"] = outletprofile.editorialprofile
			if outletprofile.readership:
				retdata["readership"] = outletprofile.readership
			if outletprofile.jicregreadership:
				retdata["jicregreadership"] = outletprofile.jicregreadership
			if outletprofile.nrsreadership:
				retdata["nrsreadership"] = outletprofile.nrsreadership
			if outletprofile.broadcasttimes:
				retdata["broadcasttimes"] = outletprofile.broadcasttimes
			if outletprofile.supplementofid:
				retdata["supplementof"] = Outlet.query.get( outletprofile.supplementofid).outletname	
			if outletprofile.productioncompanyid:
				productioncompany = ProductionCompany.query.get( outletprofile.productioncompanyid )			

		if outlet.circulation > 0:
			circ = ""
			if outlet.circulationauditdateid:
				circulationdates = CirculationDates.query.get( outlet.circulationauditdateid )
				circ += circulationdates.circulationauditdatedescription

			if outlet.circulationsourceid:
				circulationsource = CirculationSources.query.get( outlet.circulationsourceid )
				if circ:
					circ += " "
				circ += circulationsource.circulationsourcedescription

			if circ:
				circ += " "
			circ += '{:,d}'.format(outlet.circulation)

			retdata["circulation"] = circ

		if outlet.webbrowsers > 0:
			webbrowsers = ""
			if outlet.webauditdateid:
				webdates = WebDates.query.get( outlet.webauditdateid )
				webbrowsers += webdates.webauditdatedescription

			if outlet.websourceid:
				websource = WebSources.query.get( outlet.websourceid )
				if webbrowsers:
					webbrowsers += " "
				webbrowsers += websource.websourcedescription

			if webbrowsers:
				webbrowsers += " "
			webbrowsers += '{:,d}'.format(outlet.webbrowsers)

			retdata["webbrowsers"] = webbrowsers

		if outlet.frequencyid:
			frequency = Frequencies.query.get(outlet.frequencyid)
			retdata["frequency"] = frequency.frequencyname
			if outletprofile and outletprofile.frequencynotes:
				retdata["frequency"] += " " + outletprofile.frequencynotes
		elif outletprofile:
			if outletprofile.frequencynotes:
				retdata['frequency'] = outletprofile.frequencynotes
		else:
			retdata["frequency"] = ""

		if outlet.outletpriceid and outlet.outletpriceid != 1:
			outletprice = OutletPrices.query.get(outlet.outletpriceid)
			retdata["costfield"] = outletprice.outletpricedescription
		else:
			retdata["costfield"] = ""

		# series parent
		if outletprofile and outletprofile.seriesparentid:
			retdata["seriesparent"] = Outlet.query.get( outletprofile.seriesparentid ).outletname

		# series members
		seriesmembers = [ row[1].outletname for row in session.query( OutletProfile, Outlet).\
				  join(Outlet, Outlet.outletid == OutletProfile.outletid).\
				  filter(OutletProfile.seriesparentid == outletid).all()]
		if seriesmembers:
			retdata['seriesmembers'] = seriesmembers
			
		languages = [row[1].languagename for row in session.query(OutletLanguages, Languages).\
			     join(Languages,  Languages.languageid == OutletLanguages.languageid).\
			     filter(OutletLanguages.outletid == outlet.outletid).\
			     order_by(desc(OutletLanguages.isprefered)).all()]	
		if languages:
			retdata['languages'] = languages

		supplements = [ row[1].outletname for  row in  session.query( OutletProfile, Outlet).\
				join(Outlet, Outlet.outletid == OutletProfile.outletid).\
				filter(OutletProfile.supplementofid == outlet.outletid).all()]
		if supplements:
			retdata['supplements'] = supplements
			
		return retdata



	@classmethod
	def main_only_display(cls, outletid, customerid):
		"""
		main_only_display
		"""
		outlet = Outlet.query.get(outletid)
		BaseSql.checkprivate(outlet.customerid)
		data = None
		profile_image_url = ''
		
		if outlet.outlettypeid in Constants.Outlet_Is_Individual:
			data = cls._capture ( outletid, customerid ,
								  OutletDisplay.Outlet_Display_Individual,
								  outlet.primaryemployeeid)
			profile_image_url = '/static/images/unnamed2.jpg'
			
			'''
			if data['outlet']['twitter'] != None and data['outlet']['twitter'] != '':
				from prcommon.model.general.twittergeneral import TwitterSearch
				profile_image_url = TwitterSearch.get_twitter_profile_image_url(data['outlet']['twitter'])
			elif data['outlet']['facebook'] != None and data['outlet']['facebook'] != '':
				facebookid = data['outlet']['facebook']
				if facebookid.startswith("https:"):
					facebookid = facebookid[25:]
				elif facebookid.startswith("http:"):
					facebookid = facebookid[24:]
				profile_image_url = "http://graph.facebook.com/%s/picture" % facebookid
			'''
			data['outlet']['profileimageurl'] = profile_image_url

		elif outlet.prmax_outlettypeid in Constants.Outlet_Is_Mp:
			data = cls._capture ( outletid, customerid , OutletDisplay.Outlet_Display_Mp)
			data["profile"] = cls.getProfileList(outletid, customerid)
			'''
			if data['outlet']['twitter'] != None and data['outlet']['twitter'] != '':
				from prcommon.model.general.twittergeneral import TwitterSearch
				profile_image_url = TwitterSearch.get_twitter_profile_image_url(data['outlet']['twitter'])
			elif data['outlet']['facebook'] != None and data['outlet']['facebook'] != '':
				facebookid = data['outlet']['facebook']
				if facebookid.startswith("https:"):
					facebookid = facebookid[25:]
				elif facebookid.startswith("http:"):
					facebookid = facebookid[24:]
				profile_image_url = "http://graph.facebook.com/%s/picture" % facebookid
			'''
			data['outlet']['profileimageurl'] = profile_image_url
		else:
			data = cls._capture ( outletid, customerid , OutletDisplay.Outlet_Display_Main_Control)
			#profile_image_url = ''
			'''
			if data['outlet']['twitter'] != None and data['outlet']['twitter'] != '':
				from prcommon.model.general.twittergeneral import TwitterSearch
				profile_image_url = TwitterSearch.get_twitter_profile_image_url(data['outlet']['twitter'])
			elif data['outlet']['facebook'] != None and data['outlet']['facebook'] != '':
				facebookid = data['outlet']['facebook']
				if facebookid.startswith("https:"):
					facebookid = facebookid[25:]
				elif facebookid.startswith("http:"):
					facebookid = facebookid[24:]
				profile_image_url = "http://graph.facebook.com/%s/picture" % facebookid
			'''
			data['outlet']['profileimageurl'] = profile_image_url

		data["newprofile"] = cls.get_new_profile(outletid)
		if 'incorporating' in data['newprofile'] and data['newprofile']['incorporating'] != None and data['newprofile']['incorporating'] != '' and data['newprofile']['incorporating'] != 'None':
			data['incorporatingdisplay'] = 'Incorporating with %s' % (data['newprofile']['incorporating'])
		if 'subtitle' in data['newprofile'] and data['newprofile']['subtitle'] != None and data['newprofile']['subtitle'] != '' and data['newprofile']['subtitle'] != 'None':
			data['subtitledisplay'] = data['newprofile']['subtitle'].strip()
		if 'officialjournalof' in data['newprofile'] and data['newprofile']['officialjournalof'] != None and data['newprofile']['officialjournalof'] != '' and data['newprofile']['officialjournalof'] != 'None':
			data['officialjournalofdisplay'] = 'Official Journal of %s' % (data['newprofile']['officialjournalof'])
		data['prmaxoutlettypedisplay'] = data['outlet']['prmax_outlettypename'].strip() if data['outlet']['prmax_outlettypename'] else None
		if 'frequency' in data['newprofile'] and data['newprofile']['frequency'] != None and data['newprofile']['frequency'] != '' and data['newprofile']['frequency'] != 'None':
			data['prmaxoutlettypedisplay'] = '%s %s' % (data['newprofile']['frequency'].strip() if data['newprofile']['frequency'].strip()[-1] != '.' else data['newprofile']['frequency'].strip()[:-1],  data['outlet']['prmax_outlettypename'])
		
		languages = languagesdisplay = ''
		if 'languages' in data['newprofile'] and data['newprofile']['languages'] != None and data['newprofile']['languages'] != '' and data['newprofile']['languages'] != 'None':
			languages = data['newprofile']['languages']
				
		
		if languages != '':
			languagesdisplay = 'In %s' %(' and '.join(languages))

		data['editorialprofiledisplay'] = '%s' %(languagesdisplay)
		if 'editorialprofile' in data['newprofile'] and data['newprofile']['editorialprofile'] != None and data['newprofile']['editorialprofile'] != "" and data['newprofile']['editorialprofile'] != "None":
			data['editorialprofiledisplay'] = '%s. %s' %(data['newprofile']['editorialprofile'].strip() if data['newprofile']['editorialprofile'].strip()[-1] != '.' else data['newprofile']['editorialprofile'].strip()[:-1], languagesdisplay)
		data['addressdisplay'] = '%s, %s' %(data['outlet']['address'], data['outlet']['countryname'])
		
		data['circulationdisplay'] = data['webbrowsersdisplay'] = data['publisherdisplay'] = \
		interestdisplay =  data['interestdisplay'] = coveragedisplay = data['coveragedisplay'] = \
		seriesparentdisplay = data['seriesparentdisplay'] = \
		data['seriesmembersdisplay'] = \
		data['broadcasttimesdisplay'] = \
		data['supplementofdisplay'] =  data['supplementsdisplay'] = \
		data['productioncompanydisplay'] = ''
		
		if 'circulation' in data['newprofile'] and data['newprofile']['circulation'] != None and data['newprofile']['circulation'] != '' and data['newprofile']['circulation'] != 'None':
			data['circulationdisplay'] = 'Circulation %s' %(data['newprofile']['circulation'])
		if 'webbrowsers' in data['newprofile'] and data['newprofile']['webbrowsers'] != None and data['newprofile']['webbrowsers'] != '' and data['newprofile']['webbrowsers'] != 'None':
			data['webbrowsersdisplay'] = 'Web Browsers %s' %(data['newprofile']['webbrowsers'])
		
		if 'publishername' in data['outlet'] and data['outlet']['publishername'] != None and data['outlet']['publishername'] != '' and data['outlet']['publishername'] != 'None':
			data['publisherdisplay'] = 'Published by %s' %(data['outlet']['publishername'])
		if 'interests' in data and data['interests']:
			for interest in data['interests']:
				interestdisplay += '%s, ' % interest['interestname']
			data['interestdisplay'] = 'Covers news on %s' %interestdisplay[:-2]
		if 'coverage' in data and data['coverage']:
			for coverage in data['coverage']:
				coveragedisplay += '%s, ' % coverage['geographicalname']
			data['coveragedisplay'] = 'Geo Coverage is %s' %coveragedisplay[:-2]
		if 'seriesparent' in data['newprofile'] and data['newprofile']['seriesparent'] != None and data['newprofile']['seriesparent'] != '' and data['newprofile']['seriesparent'] != 'None':
			data['seriesparentdisplay'] = 'Lead outlet %s' %(data['newprofile']['seriesparent'])
		if 'seriesmembers' in data['newprofile'] and data['newprofile']['seriesmembers'] != None and data['newprofile']['seriesmembers'] != '' and data['newprofile']['seriesmembers'] != 'None':
			data['seriesmembersdisplay'] = 'Group outlets %s' %(', '.join(data['newprofile']['seriesmembers']))
		if 'broadcasttimes' in data['newprofile'] and data['newprofile']['broadcasttimes'] != None and data['newprofile']['broadcasttimes'] != '' and data['newprofile']['broadcasttimes'] != 'None':
			data['broadcasttimesdisplay'] = 'Broadcast times are %s' % (data['newprofile']['broadcasttimes'])
		if 'supplementof' in data['newprofile'] and data['newprofile']['supplementof'] != None and data['newprofile']['supplementof'] != '' and data['newprofile']['supplementof'] != 'None':
			data['supplementofdisplay'] = 'Supplement of %s' %(data['newprofile']['supplementof'])
		if 'supplements' in data['newprofile'] and data['newprofile']['supplements'] != None and data['newprofile']['supplements'] != '' and data['newprofile']['supplements'] != 'None':
			data['supplementsdisplay'] = 'Supplements %s' %(', '.join(data['newprofile']['supplements']))
		if 'productioncompany' in data['newprofile'] and data['newprofile']['productioncompany'] != None and data['newprofile']['productioncompany'] != '' and data['newprofile']['productioncompany'] != 'None':
			data['productioncompanydisplay'] = 'Production Company is %s' % (data['newprofile']['productioncompany'])
			
		

		return data

	@classmethod
	def _capture(cls, outletid, customerid, queries, employeeid = None):
		""" _capture """
		kw = { 'outletid' : outletid , 'success': False, "error_message":"",
			   'employeeid':employeeid}
		try:
			fields = dict(customerid = customerid,
						  outletid = outletid,
						  employeeid = employeeid)
			for key, (query, islist) in queries.iteritems():
				result = session.execute(text(query), fields, cls)
				data = BaseSql.ResultAsEncodedDict(result)
				result.close()
				if islist:
					kw[key] = data
				else:
					if len(data):
						kw[key] = data[0]
					else:
						kw[key] = None

				kw['success'] = True
		except Exception, ex :
			log.exception("_capture")
			kw["error_message"] = str(ex)

		return dict(kw)

	@classmethod
	def getProfile(cls, outletid):
		"""getProfile"""
		query = session.query(Outlet.profile, Outlet.customerid).filter_by(outletid = outletid)
		BaseSql.checkprivate(query[0].customerid)
		try:
			if query[0].profile and query[0].profile.strip():
				return (query[0].profile, query[0].customerid)
		except Exception, ex:
			log.debug( "getProfile" + str(ex))
			raise ex
		return ("", -1)

	__SplitFields = ("GENERAL DETAILS", "Cost:",
						   "READERSHIP/AUDIENCE PROFILE",
			               "LISTENERS/AUDIENCE",
						   "AUDIENCE/CIRCULATION",
			               "EDITORIAL PROFILE",
						   "SERIES TITLES")

	@classmethod
	def getProfileList(cls, outletid, icustomerid):
		""" getProfileList """
		(profile, customerid) = cls.getProfile(outletid)
		if profile:
			profile = profile.replace("\n","<br/>")
		data = []
		if customerid == -1:
			for field in OutletDisplay.__SplitFields:
				offset = profile.find(field)
				if offset != -1:
					data.append([offset, offset + len(field), "", field])
			data.sort()

			for row in data:
				# check is end
				if row == data[-1]:
					# is end
					row[2] = profile[row[1]:]
				else:
					endrow = data[data.index(row)+1]
					row[2] = profile[row[1]:endrow[0]-1]
				#fix up profile
				if row[2].startswith('<br/>') and len(row[2]) > 5:
					row[2] = row[2][5:]

			if not len(data) and len(profile):
				# this has not sections add section
				data.append(("", "", profile, "GENERAL" ))

			outlet = session.query(OutletCustomerView).filter_by(
				outletid = outletid, customerid = icustomerid).all()
			if outlet and outlet[0].profile:
				pnotes = outlet[0].profile
			else:
				pnotes = ""

			data.append(("", "", pnotes , """PRIVATE NOTES <button class="edit_profile" type="button" onclick='javascript:dojo.publish("/crm/edit_notes",[%d]);'>Edit</button>""" % outletid ))
		else:
			if profile:
				data.append ( ("", "", profile,  "GENERAL DETALS") )
				data.append(("", "", "", """PRIVATE NOTES <button class="edit_profile" type="button" onclick='javascript:dojo.publish("/crm/edit_notes",[%d]);'>Edit</button>""" % outletid ))

		return [ (row[2], row[3]) for row in data ]

	@classmethod
	def interests_display(cls, outletid, customerid):
		""" outlet interets """
		return cls._capture ( outletid, customerid , OutletDisplay.Outlet_Display_Interests)

	@classmethod
	def coverage_display(cls, outletid, customerid):
		""" outlet coverage """
		return cls._capture ( outletid, customerid , OutletDisplay.Outlet_Display_Coverage)

	@classmethod
	def outlet_extra_display(cls, outletid, customerid):
		""" outlet coverage """
		data = cls._capture ( outletid, customerid , OutletDisplay.Outlet_Display_Extra)
		data["outlet"]["established_display"] = strftimeext ( data["outlet"]["established"] )

		return data


	@staticmethod
	def setupClass( data, datakey, count = 20, classname = "listarea" ,
					prefix = "attr_"):
		"""setup the scrolling zones in the display if necessary"""
		if data.has_key(datakey):
			inclassname = classname if len(data[datakey])>count else ""
			data[prefix+datakey ] = {'class': inclassname }

################################################################################
outlet_table = Table('outlets', metadata, autoload = True)
mapper(OutletDisplay, outlet_table)
