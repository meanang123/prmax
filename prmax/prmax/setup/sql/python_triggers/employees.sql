DROP FUNCTION IF EXISTS prmax_employees_index() CASCADE;

CREATE OR REPLACE FUNCTION prmax_employees_index ()
  RETURNS trigger
  AS $$

  from prmax.utilities.postgres import PostGresControl
  from prmax.utilities.DBIndexer import StandardIndexer, getOutletFind
  import prmax.Constants as Constants

  #control system
  controlSettings = PostGresControl(plpy)
  if controlSettings.isDisabled==1:
	return None
  controlSettings.doDebug(TD)

  if SD.has_key("prmax_contact_index_get"):
    plan = SD["prmax_contact_index_get"]
    plan_prmxrole_insert = SD["prmax_employee_plan_prmxrole_insert"]
    plan_prmxrole_delete = SD["prmax_employee_plan_prmxrole_delete"]
    insert_prmaxrole = SD["insert_prmaxrole_name_table_insert"]
    find_prmaxrole = SD["insert_prmaxrole_name_table_find"]
  else:
    plan = plpy.prepare("SELECT familyname FROM contacts WHERE contactid=$1",[ "int",])
    plan_prmxrole_insert  = plpy.prepare("""INSERT INTO employeeprmaxroles(employeeid,outletid,prmaxroleid,customerid)
					SELECT $1,$2,parentprmaxroleid,$4 from internal.prmaxrolesynonyms as prs JOIN internal.prmaxroles AS pr ON pr.prmaxroleid = prs.parentprmaxroleid
					WHERE childprmaxroleid = ( select prmaxroleid from internal.prmaxroles where prmaxrole = $3 )  AND pr.visible = true
					UNION SELECT $1,$2,prmaxroleid,$4 from internal.prmaxroles where prmaxrole = $3 AND visible = true""",
			["int","int","text","int"] )
    plan_prmxrole_delete  = plpy.prepare("DELETE FROM employeeprmaxroles WHERE employeeid = $1", ["int"] )
    insert_prmaxrole = plpy.prepare("INSERT INTO internal.prmaxroles(prmaxrole) VALUES($1)", ["text"] )
    find_prmaxrole = plpy.prepare("SELECT prmaxroleid FROM internal.prmaxroles WHERE prmaxrole = $1", ["text"] )

    SD["prmax_contact_index_get"] = plan
    SD["prmax_employee_plan_prmxrole_insert"] = plan_prmxrole_insert
    SD["prmax_employee_plan_prmxrole_delete"] = plan_prmxrole_delete
    SD["insert_prmaxrole_name_table_insert"] = insert_prmaxrole
    SD["insert_prmaxrole_name_table_find"] = find_prmaxrole

  # get plan for outlet find from employee
  controlSettings.doDebug("PRE")
  plan_outlet = getOutletFind(SD,plpy)
  controlSettings.doDebug("POST")

  # need to retrive the outlettype as we need to move freelance/parliamnetry
  # need to load contact surname at this point for the index
  if TD.has_key("new") and TD['new'] and TD['new'].has_key('contactid'):
	if TD['new']['contactid']:
		TD['new']['familyname']= plpy.execute(plan, [TD['new']['contactid'], ])[0]['familyname']
	else:
		if TD['new'] != None:
			TD['new']['familyname']= ""

  controlSettings.doDebug("1")

  if TD.has_key("old") and TD['old'] and TD['old'].has_key('contactid'):
	if TD['old']['contactid']:
		TD['old']['familyname']= plpy.execute(plan, [TD['old']['contactid'], ])[0]['familyname']
	else:
		if TD['old'] != None:
			TD['old']['familyname']= ""

  controlSettings.doDebug("2")
  # need to get outletid
  if TD['event']=="INSERT":
		# at this point we need to add a prmax job roles record if one exists
		# only do this for internal record
		if TD['new']['customerid'] == -1 and TD['new']['sourcetypeid'] !=4:
			plpy.execute(plan_prmxrole_insert, [TD['new']['employeeid'], TD['new']['outletid'], TD['new']['job_title'], TD['new']['customerid']])

		# handles indexing
		tdata = plpy.execute(plan_outlet, [TD['new']['outletid'], ])[0]
		outlettypeid = tdata['outlettypeid']
		prmax_outlettypeid = tdata['prmax_outlettypeid']
		TD['new']["prmax_outlettypeid"] = tdata['prmax_outlettypeid']
		TD['new']["countryid"] = tdata['countryid']
		# add code here for job title
		if outlettypeid not in ( 19, 40 ) :
			pass
  elif TD['event']=="UPDATE":
	# handle change on job title
	if TD['old']["job_title"] != TD['new']["job_title"] and TD['new']['customerid'] == -1 and TD['new']['sourcetypeid'] !=4:
		# need to delete old prmaxroles need to add new prmax roles
		plpy.execute(plan_prmxrole_delete, [TD['old']['employeeid'], ])
		plpy.execute(plan_prmxrole_insert, [TD['new']['employeeid'], TD['new']['outletid'], TD['new']['job_title'], TD['new']['customerid']])

	tdata = plpy.execute(plan_outlet, [TD['old']['outletid'], ])[0]
	outlettypeid = tdata['outlettypeid']
	prmax_outlettypeid = tdata['prmax_outlettypeid']
	TD['old']["prmax_outlettypeid"] = tdata['prmax_outlettypeid']
	TD['new']["prmax_outlettypeid"] = tdata['prmax_outlettypeid']
	TD['old']["countryid"] = tdata['countryid']
	TD['new']["countryid"] = tdata['countryid']

	# add code here for job title
	if outlettypeid not in ( 19, 40 ) :
		pass
  else:
	tdata = plpy.execute(plan_outlet, [TD['old']['outletid'], ])[0]
	outlettypeid = tdata['outlettypeid']
	prmax_outlettypeid = tdata['prmax_outlettypeid']
	TD['old']["prmax_outlettypeid"] = tdata['prmax_outlettypeid']
	TD['old']["countryid"] = tdata['countryid']

	outlettypeid = None

  # setup of correct type

  if outlettypeid==Constants.Outlet_Type_Freelance:
	index_fields_employeeid = (
		( Constants.freelance_employeeid,'familyname',StandardIndexer.standardise_string,None),
		( Constants.freelance_employeeid_countryid ,'countryid',None,None),
	  )
	index_fields_outletidid = (
		( Constants.freelance_employee_outletid ,'familyname',StandardIndexer.standardise_string,None),
		( Constants.employee_outletid_countryid ,'countryid',None,None),
	  )
  elif outlettypeid==Constants.Outlet_Type_Mp:
	index_fields_employeeid = (
			( Constants.mp_employeeid,'familyname',StandardIndexer.standardise_string,None),
			( Constants.employee_countryid ,'countryid',None,None),
		  )
	index_fields_outletidid = (
			( Constants.mp_employee_outletid ,'familyname',StandardIndexer.standardise_string,None),
			( Constants.employee_outletid_countryid ,'countryid',None,None),
	)
  elif outlettypeid != None:
	index_fields_employeeid = (
		  ( Constants.employee_contact_employeeid,'familyname',StandardIndexer.standardise_string,None),
			( Constants.employee_countryid ,'countryid',None,None),
		  ( Constants.employee_prmaxoutlettypeid,"prmax_outlettypeid",None,None)
		)
	index_fields_outletidid = (
		  ( Constants.employee_contact_outletid,'familyname',StandardIndexer.standardise_string,None),
			( Constants.employee_outletid_countryid ,'countryid',None,None)
	  )
  else:
		# assume basic contact
		index_fields_employeeid = (
			( Constants.mp_employeeid,'familyname',StandardIndexer.standardise_string,None),
			( Constants.employee_countryid ,'countryid',None,None),
		  )
		index_fields_outletidid = (
			( Constants.mp_employee_outletid ,'familyname',StandardIndexer.standardise_string,None),
			( Constants.employee_outletid_countryid ,'countryid',None,None),
		)

	if TD['event']=="DELETE":
		# this is for a delete cant get type as this point record missing so we just delete all references
		index_fields_employeeid = (
			( Constants.freelance_employeeid,'familyname',StandardIndexer.standardise_string,None),
			( Constants.mp_employeeid,'familyname',StandardIndexer.standardise_string,None),
			( Constants.employee_contact_employeeid,'familyname',StandardIndexer.standardise_string,None),
			( Constants.employee_contactfull_employeeid,'familyname',StandardIndexer.standardise_string,None),
			( Constants.employee_prmaxoutlettypeid,'prmax_outlettypeid',None,None),
			( Constants.freelance_employeeid_countryid ,'countryid',None,None),
			( Constants.employee_countryid ,'countryid',None,None)
		  )
		index_fields_outletidid = (
			( Constants.freelance_employee_outletid ,'familyname',StandardIndexer.standardise_string,None),
			( Constants.mp_employee_outletid ,'familyname',StandardIndexer.standardise_string,None),
			( Constants.employee_contact_outletid ,'familyname',StandardIndexer.standardise_string,None),
			( Constants.employee_outletid_countryid ,'countryid',None,None),
		)

  controlSettings.doDebug("4")
  # do indexing
  indexer = StandardIndexer(
	SD,
	plpy,
	'outletid',
	TD,
	index_fields_outletidid,
	controlSettings.getIndexRebuildMode())
  indexer.RunIndexer()

  controlSettings.doDebug("5")
  # now change the index source
  indexer.indexField = 'employeeid'
  indexer.index_Fields = index_fields_employeeid
  indexer.RunIndexer()

  # fll list used for quick search
  index_fields_full_employeeid = (
	( Constants.employee_contactfull_employeeid,'familyname',StandardIndexer.standardise_string,None),)

  indexer.index_Fields = index_fields_full_employeeid
  indexer.RunIndexer()

  controlSettings.doDebug("6")

  # add job title too roles map if mmissing
  if TD['event'] in ("INSERT","UPDATE"):
    key_field = "new"
    result = plpy.execute(find_prmaxrole, [TD[key_field]['job_title'], ])
    if not result:
      plpy.execute(insert_prmaxrole, [TD[key_field]['job_title'], ])


	# at this point we need research add/update/delete record

$$ LANGUAGE plpythonu;

CREATE TRIGGER employees_add AFTER INSERT ON employees for each row EXECUTE PROCEDURE prmax_employees_index();
CREATE TRIGGER employees_update AFTER UPDATE ON employees for each row EXECUTE PROCEDURE prmax_employees_index();
CREATE TRIGGER employees_delete AFTER DELETE ON employees for each row EXECUTE PROCEDURE prmax_employees_index();
