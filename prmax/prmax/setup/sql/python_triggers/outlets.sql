DROP FUNCTION IF EXISTS prmax_outlet_index() CASCADE;
DROP FUNCTION IF EXISTS outlet_research_add() CASCADE;
DROP FUNCTION IF EXISTS outlet_research_update() CASCADE;

CREATE OR REPLACE FUNCTION prmax_outlet_index ()
  RETURNS trigger
  AS $$

  from prmax.utilities.postgres import PostGresControl
  from prmax.utilities.DBIndexer import StandardIndexer
  from ttl.string import splitoutletname
  from prmax.utilities.search import encodeCirculation
  import prmax.Constants as Constants
  from prmax.utilities.caching import Invalidate_Cache_Object
  import prmax.Constants as Constants

  #control system
  controlSettings = PostGresControl(plpy)
  if controlSettings.isDisabled==1:
    return None
  controlSettings.doDebug(TD)

  if SD.has_key("prmax_outlet_index"):
    prmax_outlet_index = SD["prmax_outlet_index"]
	prmax_outlet_employee_del_index = SD["prmax_outlet_employee_del_index"]
	prmax_outlet_employee_del_index = SD['prmax_outlet_employee_add_index']
  else:
    prmax_outlet_index = plpy.prepare("INSERT INTO queues.indexerqueue( objecttype, objectid, data, action, customerid ) SELECT 119,$1,prmaxroleid::text::bytea,2,$2 FROM internal.prmaxroles where visible = true ;", [ "int","int"])
    SD["prmax_outlet_index"] = prmax_outlet_index
	prmax_outlet_employee_del_index = plpy.prepare("INSERT INTO queues.indexerqueue( objecttype, objectid, data, action, customerid ) SELECT $1,employeeid,$2::text::bytea,2,$3 FROM employees WHERE outletid = $4", [ "int","int","int","int","int"])
	SD["prmax_outlet_employee_del_index"] = prmax_outlet_employee_del_index
	prmax_outlet_employee_add_index = plpy.prepare("INSERT INTO queues.indexerqueue( objecttype, objectid, data, action, customerid ) SELECT $1,employeeid,$2::text::bytea,1,$3 FROM employees WHERE outletid = $4", [ "int","int","int","int","int"])
	SD["prmax_outlet_employee_add_index"] = prmax_outlet_employee_add_index


  if (TD['old'] and TD['old']['outlettypeid'] == Constants.Outlet_Type_Freelance) or   (TD['new'] and TD['new']['outlettypeid'] == Constants.Outlet_Type_Freelance):
    index_Fields = (
    ( Constants.outlet_statusid,'statusid',None,None),
    ( Constants.freelance_countryid,'countryid',None,None),
    ( Constants.outlet_searchtypeid,'outletsearchtypeid',None,None)
    )
  elif (TD['old'] and TD['old']['outlettypeid'] == Constants.Outlet_Type_Mp) or  (TD['new'] and TD['new']['outlettypeid'] == Constants.Outlet_Type_Mp):
    index_Fields = (
    ( Constants.outlet_statusid,'statusid',None,None),
    ( Constants.mp_countryid,'countryid',None,None),
    ( Constants.outlet_searchtypeid,'outletsearchtypeid',None,None)
    )
  else:
    index_Fields = (
    ( Constants.outlet_statusid,'statusid',None,None),
    ( Constants.outlet_countryid,'countryid',None,None),
    ( Constants.outlet_name,'outletname',splitoutletname, StandardIndexer.restictoutletindex ) ,
    ( Constants.outlet_circulationid,'circulation',encodeCirculation, StandardIndexer.restictoutletindex),
    ( Constants.outlet_searchtypeid,'outletsearchtypeid',None,None),
    ( Constants.outlet_outlettypeid,'prmax_outlettypeid',None,None),
    ( Constants.outlet_frequencyid,'frequencyid',None,None)
    )

  if TD["event"]=="DELETE":
    index_Fields = (
    ( Constants.outlet_statusid,'statusid',None,None),
    ( Constants.outlet_countryid,'countryid',None,None),
    ( Constants.outlet_name,'outletname',splitoutletname, StandardIndexer.restictoutletindex ) ,
    ( Constants.outlet_circulationid,'circulation',encodeCirculation, StandardIndexer.restictoutletindex),
    ( Constants.outlet_searchtypeid,'outletsearchtypeid',None,None),
    ( Constants.outlet_outlettypeid,'prmax_outlettypeid',None,None),
    ( Constants.mp_countryid,'countryid',None,None),
    ( Constants.freelance_countryid,'countryid',None,None),
    ( Constants.outlet_frequencyid,'frequencyid',None,None)
    )
    # clear out job roles index
    plpy.execute(prmax_outlet_index,[TD['old']['outletid'],TD['old']['customerid']])

  # need to cascade the country and outlettype chnages to the employee indexs
  if TD['event'] == 'UPDATE' AND TD['new'] AND TD['new']['countryid'] != TD['old']['countryid']:
    plpy.execute(prmax_outlet_employee_del_index,[Constants.employee_outletid_countryid, TD['old']['countryid'], TD['old']['customerid'],TD['old']['outletid']])
	plpy.execute(prmax_outlet_employee_add_index,[Constants.employee_outletid_countryid, TD['new']['countryid'], TD['new']['customerid'],TD['new']['outletid']])

  if TD['event'] == 'UPDATE' AND TD['new'] AND TD['new']['prmax_outlettypeid'] != TD['old']['prmax_outlettypeid']:
	plpy.execute(prmax_outlet_employee_del_index,[Constants.employee_prmaxoutlettypeid, TD['old']['prmax_outlettypeid'], TD['old']['customerid'],TD['old']['outletid']])
	plpy.execute(prmax_outlet_employee_add_index,[Constants.employee_prmaxoutlettypeid, TD['new']['prmax_outlettypeid'], TD['new']['customerid'],TD['new']['outletid']])

  controlSettings.doDebug(index_Fields)

  # do indexing
  indexer = StandardIndexer(
    SD,
    plpy,
    'outletid',
    TD,
    index_Fields,
    controlSettings.getIndexRebuildMode())
  indexer.RunIndexer()

  # intert records ect
  Invalidate_Cache_Object(plpy, SD, TD , Constants.Cache_Outlet_Objects)

$$ LANGUAGE plpythonu;


-- research/updated info

CREATE OR REPLACE FUNCTION outlet_research_add ()
  RETURNS trigger
AS $$
BEGIN
	INSERT INTO internal.research_control_record( objectid, objecttypeid, created_by )
	VALUES ( NEW.outletid, 1, NEW.userid ) ;
   RETURN NEW;
end
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION outlet_research_update()
  RETURNS trigger
AS $$
BEGIN
	IF EXISTS(select * from internal.research_control_record WHERE objectid = NEW.outletid AND objecttypeid = 1  ) THEN
		UPDATE internal.research_control_record
			SET updated_by = NEW.userid,
					updated_date = CURRENT_DATE
		WHERE objectid = NEW.outletid AND objecttypeid = 1 ;
	ELSE
		INSERT INTO internal.research_control_record( objectid, objecttypeid, created_by )
			VALUES ( NEW.outletid, 1, NEW.userid ) ;
	END IF;
   RETURN NEW;
end
$$ LANGUAGE plpgsql;


--DROP TRIGGER outlet_add ON outlets;
CREATE TRIGGER outlet_add AFTER INSERT ON outlets for each row EXECUTE PROCEDURE prmax_outlet_index();
CREATE TRIGGER outlet_update AFTER UPDATE ON outlets for each row EXECUTE PROCEDURE prmax_outlet_index();
CREATE TRIGGER outlet_delete AFTER DELETE ON outlets for each row EXECUTE PROCEDURE prmax_outlet_index();

CREATE TRIGGER outlet_research_add AFTER INSERT ON outlets for each row EXECUTE PROCEDURE outlet_research_add();
CREATE TRIGGER outlet_research_upd AFTER UPDATE ON outlets for each row EXECUTE PROCEDURE outlet_research_update();

