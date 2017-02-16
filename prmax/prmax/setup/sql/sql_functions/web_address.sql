CREATE OR REPLACE FUNCTION Web_To_Html_Link_address(
win text
)
  RETURNS text

  AS $$
  w = win
  if w and not w.startswith("http:"):
    w = "http://"  + w

  return w

$$ LANGUAGE plpythonu;
