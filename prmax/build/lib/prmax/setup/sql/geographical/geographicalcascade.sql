CREATE OR REPLACE FUNCTION create_geographical_cascade ( p_geographicalid integer)
RETURNS void AS $$

DELETE from internal.geographicallookupcascade WHERE geographicalid = $1;
-- capture parent
INSERT INTO internal.geographicallookupcascade (geographicalid , geographicalrelationid )
Select $1, parentgeographicalareaid from internal.geographicaltree
where childgeographicalareaid = $1;

-- children level 1
INSERT INTO internal.geographicallookupcascade (geographicalid , geographicalrelationid )
Select $1,childgeographicalareaid from internal.geographicaltree  as g1
JOIN internal.geographical as g ON g.geographicalid = childgeographicalareaid
where parentgeographicalareaid = $1;

-- children level 2
INSERT INTO internal.geographicallookupcascade (geographicalid , geographicalrelationid )
Select $1,childgeographicalareaid from internal.geographicaltree   as g1
JOIN internal.geographical as g ON g.geographicalid = childgeographicalareaid
where parentgeographicalareaid in ( select childgeographicalareaid from internal.geographicaltree where parentgeographicalareaid =$1);

-- level 3
INSERT INTO internal.geographicallookupcascade (geographicalid , geographicalrelationid )
Select $1,childgeographicalareaid from internal.geographicaltree as g1
JOIN internal.geographical as g ON g.geographicalid = childgeographicalareaid
where parentgeographicalareaid in (select childgeographicalareaid from internal.geographicaltree where parentgeographicalareaid in ( select childgeographicalareaid from internal.geographicaltree where parentgeographicalareaid = $1));

$$ LANGUAGE  'sql';