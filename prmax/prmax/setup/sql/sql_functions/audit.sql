CREATE OR REPLACE FUNCTION audit_to_string(
fieldid int,
invalue text
)
  RETURNS text
  AS $$
    outvalue = invalue

    import prmax.Constants as Constants

    #if fieldid == Constants.Field_Frequency:
     #   TD['new']['familyname']= plpy.execute(plan, [TD['new']['contactid'], ])[0]['familyname']

    return outvalue

$$ LANGUAGE plpythonu;
