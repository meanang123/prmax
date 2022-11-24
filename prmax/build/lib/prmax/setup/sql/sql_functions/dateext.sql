CREATE OR REPLACE FUNCTION ToPartialDate(
description text,
datefield date,
partial_date boolean)
  RETURNS text
  AS $$

  import datetime
  retvalue = ""

  if partial_date and datefield:
    d = datetime.datetime.strptime(datefield, "%Y-%m-%d")
    retvalue = d.strftime("%b %Y")
  elif datefield:
    d = datetime.datetime.strptime(datefield, "%Y-%m-%d")
    retvalue = d.strftime("%d %b %Y")

  return retvalue.strip()

$$ LANGUAGE plpythonu;