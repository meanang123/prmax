SELECT outletid,outletname,o.www,c.tel,c.email,a.townname,a.postcode,f.frequencyname
FROM  
outlets AS o
JOIN communications AS c ON c.communicationid = o.communicationid
JOIN addresses AS a ON c.addressid = a.addressid
JOIN internal.frequencies AS f ON o.frequencyid = f.frequencyid
WHERE o.prmax_outlettypeid = (select prmax_outlettypeid from internal.prmax_outlettypes where prmax_outlettypename = 'Magazines - Business orientated' )
ORDER BY o.outletname;