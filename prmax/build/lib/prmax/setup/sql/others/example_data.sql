SELECT 
oc.outletcoverageid,
o.outletid,
outletname,
ga.geographicalname AS coverage,
glt.geographicallookupdescription AS coverage_type,
gap.geographicalname AS coverage_parent,
gltp.geographicallookupdescription AS coverage_parent_type
FROM outlets AS o 
JOIN outletcoverage AS oc ON oc.outletid = o.outletid
JOIN internal.geographical AS ga ON ga.geographicalid = oc.geographicalid
JOIN internal.geographicallookuptypes AS glt ON glt.geographicallookuptypeid = ga.geographicallookuptypeid
JOIN internal.geographicaltree as gt ON oc.geographicalid = gt.childgeographicalareaid
LEFT OUTER JOIN internal.geographical AS gap ON gap.geographicalid = gt.parentgeographicalareaid
LEFT OUTER JOIN internal.geographicallookuptypes AS gltp ON gltp.geographicallookuptypeid = gap.geographicallookuptypeid

WHERE o.prmax_outlettypeid in (6,9,10) AND o.sourcetypeid in (1,2)

-- outletname IN ('Milton Keynes Citizen Series','Hendon & Finchley Times','Grimsby Telegraph')
