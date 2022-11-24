CREATE OR REPLACE FUNCTION AddressFull(
address1 text,
address2 text,
county text,
postcode text,
geographicalname text,
town text,
country text
)
  RETURNS text
  AS $$
  addr = (address1,address2,town,county,postcode,country)

  return ", ".join([f for f in addr if f!=None and len(f)]).strip()

$$ LANGUAGE plpythonu;


CREATE OR REPLACE FUNCTION getTown( town text , postcode text )
  RETURNS text
  AS $$
    from ttl.string import postCodeIsLondon

    if not town and postcode and postCodeIsLondon (postcode):
        return "London"
    return town
$$ LANGUAGE plpythonu;
