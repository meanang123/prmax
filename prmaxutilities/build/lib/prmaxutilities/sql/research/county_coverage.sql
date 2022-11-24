-- creates map of town/county/region
select
gc.geographicalid as townid ,gc.geographicalname as townname,
gp.geographicalid as countyid,gp.geographicalname as countyname,
reg.geographicalid as regionid,reg.geographicalname as regionyname
from internal.geographicaltree as gt
join internal.geographical AS gp on gt.parentgeographicalareaid = gp.geographicalid
join internal.geographical AS gc on gt.childgeographicalareaid = gc.geographicalid
left outer join internal.geographicaltree as gtr ON gp.geographicalid = gtr.childgeographicalareaid
left outer join internal.geographical AS reg on gtr.parentgeographicalareaid = reg.geographicalid
where gt.childgeographicalareaid IN ( select geographicalid from internal.geographicallookup WHERE geographicallookuptypeid = 1 )
AND reg.geographicalid IN ( select geographicalid from internal.geographicallookup WHERE geographicallookuptypeid = 3 )
ORDER BY gp.geographicalname