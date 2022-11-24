CREATE OR REPLACE FUNCTION ContactName(
prefix text,
firstname text,
middlename text,
surname text,
suffix text
)
  RETURNS text
  AS $$
  # may be required
  # return " ".join([f.decode("utf-8") for f in args if f!=None and len(f)]).strip()
  return u" ".join([f for f in args if f!=None and len(f)]).strip()

$$ LANGUAGE plpythonu;
