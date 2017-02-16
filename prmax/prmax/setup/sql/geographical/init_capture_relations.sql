-- select geographicalid,geographical_parent(geographicalid) from internal.geographicallookup;
TRUNCATE internal.geographicallookupcascade;

-- parent levels
-- level 4
INSERT INTO internal.geographicallookupcascade(geographicalid, geographicalrelationid) SELECT g1.geographicalid, level4.childgeographicalareaid
FROM internal.geographicallookup as g1
LEFT OUTER JOIN internal.geographicaltree as child ON child.childgeographicalareaid = g1.geographicalid
LEFT OUTER JOIN internal.geographicaltree as level1 ON child.parentgeographicalareaid = level1.childgeographicalareaid
LEFT OUTER JOIN internal.geographicaltree as level2 ON level1.parentgeographicalareaid = level2.childgeographicalareaid
LEFT OUTER JOIN internal.geographicaltree as level3 ON level2.parentgeographicalareaid = level3.childgeographicalareaid
LEFT OUTER JOIN internal.geographicaltree as level4 ON level3.parentgeographicalareaid = level4.childgeographicalareaid
LEFT OUTER JOIN internal.geographicallookupcascade as glc ON g1.geographicalid = glc.geographicalid AND level4.childgeographicalareaid = glc.geographicalrelationid
LEFT OUTER JOIN internal.geographical as  level4g ON level4g.geographicalid = level4.childgeographicalareaid
WHERE level4.childgeographicalareaid IS NOT NULL AND glc.geographicalid IS NULL
AND level4g.geographicaltypeid NOT IN ( 2419, 2420)
GROUP BY g1.geographicalid, level4.childgeographicalareaid;
-- level 3
INSERT INTO internal.geographicallookupcascade(geographicalid, geographicalrelationid) SELECT g1.geographicalid, level3.childgeographicalareaid
FROM internal.geographicallookup as g1
LEFT OUTER JOIN internal.geographicaltree as child ON child.childgeographicalareaid = g1.geographicalid
LEFT OUTER JOIN internal.geographicaltree as level1 ON child.parentgeographicalareaid = level1.childgeographicalareaid
LEFT OUTER JOIN internal.geographicaltree as level2 ON level1.parentgeographicalareaid = level2.childgeographicalareaid
LEFT OUTER JOIN internal.geographicaltree as level3 ON level2.parentgeographicalareaid = level3.childgeographicalareaid
LEFT OUTER JOIN internal.geographicallookupcascade as glc ON g1.geographicalid = glc.geographicalid AND level3.childgeographicalareaid = glc.geographicalrelationid
LEFT OUTER JOIN internal.geographical as  level3g ON level3g.geographicalid = level3.childgeographicalareaid
WHERE level3.childgeographicalareaid IS NOT NULL AND glc.geographicalid IS NULL
AND level3g.geographicaltypeid NOT IN ( 2419, 2420)
GROUP BY g1.geographicalid, level3.childgeographicalareaid;
-- level 2
INSERT INTO internal.geographicallookupcascade(geographicalid, geographicalrelationid) SELECT g1.geographicalid, level2.childgeographicalareaid
FROM internal.geographicallookup as g1
LEFT OUTER JOIN internal.geographicaltree as child ON child.childgeographicalareaid = g1.geographicalid
LEFT OUTER JOIN internal.geographicaltree as level1 ON child.parentgeographicalareaid = level1.childgeographicalareaid
LEFT OUTER JOIN internal.geographicaltree as level2 ON level1.parentgeographicalareaid = level2.childgeographicalareaid
LEFT OUTER JOIN internal.geographicallookupcascade as glc ON g1.geographicalid = glc.geographicalid AND level2.childgeographicalareaid = glc.geographicalrelationid
LEFT OUTER JOIN internal.geographical as  level2g ON level2g.geographicalid = level2.childgeographicalareaid
WHERE level2.childgeographicalareaid IS NOT NULL AND glc.geographicalid IS NULL
AND level2g.geographicaltypeid NOT IN ( 2419, 2420)
GROUP BY g1.geographicalid, level2.childgeographicalareaid;
-- level 1
INSERT INTO internal.geographicallookupcascade(geographicalid, geographicalrelationid) SELECT g1.geographicalid, level1.childgeographicalareaid
FROM internal.geographicallookup as g1
LEFT OUTER JOIN internal.geographicaltree as child ON child.childgeographicalareaid = g1.geographicalid
LEFT OUTER JOIN internal.geographicaltree as level1 ON child.parentgeographicalareaid = level1.childgeographicalareaid
LEFT OUTER JOIN internal.geographicallookupcascade as glc ON g1.geographicalid = glc.geographicalid AND level1.childgeographicalareaid = glc.geographicalrelationid
LEFT OUTER JOIN internal.geographical as  level1g ON level1g.geographicalid = level1.childgeographicalareaid
WHERE level1.childgeographicalareaid IS NOT NULL AND glc.geographicalid IS NULL
AND level1g.geographicaltypeid NOT IN ( 2419, 2420)
GROUP BY g1.geographicalid, level1.childgeographicalareaid;

--
-- Child levels
--

-- child 1
INSERT INTO internal.geographicallookupcascade(geographicalid, geographicalrelationid) SELECT g1.geographicalid, child.childgeographicalareaid
FROM internal.geographicallookup as g1
LEFT OUTER JOIN internal.geographicaltree as child ON child.parentgeographicalareaid = g1.geographicalid
LEFT OUTER JOIN internal.geographicallookupcascade as glc ON g1.geographicalid = glc.geographicalid AND child.childgeographicalareaid = glc.geographicalrelationid
WHERE child.childgeographicalareaid IS NOT NULL AND glc.geographicalid IS NULL
GROUP BY g1.geographicalid, child.childgeographicalareaid;

-- child 2
INSERT INTO internal.geographicallookupcascade(geographicalid, geographicalrelationid) SELECT g1.geographicalid, child1.childgeographicalareaid
FROM internal.geographicallookup as g1
LEFT OUTER JOIN internal.geographicaltree as child ON child.parentgeographicalareaid = g1.geographicalid
LEFT OUTER JOIN internal.geographicaltree as child1 ON child1.parentgeographicalareaid = child.childgeographicalareaid
LEFT OUTER JOIN internal.geographicallookupcascade as glc ON g1.geographicalid = glc.geographicalid AND child1.childgeographicalareaid = glc.geographicalrelationid
WHERE child1.childgeographicalareaid IS NOT NULL AND glc.geographicalid IS NULL
GROUP BY g1.geographicalid, child1.childgeographicalareaid;