CREATE OR REPLACE FUNCTION capture_geographical_level ( p_geographicaltypeid integer)
RETURNS SETOF integer AS $$

SELECT DISTINCT g.geographicalid from internal.geographicaltree as child
LEFT OUTER JOIN internal.geographicaltree as level1 ON level1.childgeographicalareaid = child.parentgeographicalareaid
LEFT OUTER JOIN internal.geographicaltree as level2 ON level2.childgeographicalareaid = level1.parentgeographicalareaid
LEFT OUTER JOIN internal.geographicaltree as level3 ON level3.childgeographicalareaid = level2.parentgeographicalareaid
LEFT OUTER JOIN internal.geographicaltree as level4 ON level4.childgeographicalareaid = level3.parentgeographicalareaid
LEFT OUTER JOIN internal.geographical as g ON child.childgeographicalareaid = g.geographicalid

where child.childgeographicalareaid  IN (select geographicalid from internal.geographical WHERE geographicaltypeid = $1)
AND
(
	level3.childgeographicalareaid IN (select geographicalid from internal.geographical WHERE geographicalname = 'United Kingdom') OR
	level2.childgeographicalareaid IN (select geographicalid from internal.geographical WHERE geographicalname = 'United Kingdom') OR
	level1.childgeographicalareaid IN (select geographicalid from internal.geographical WHERE geographicalname = 'United Kingdom')
)

$$ LANGUAGE  'sql';
