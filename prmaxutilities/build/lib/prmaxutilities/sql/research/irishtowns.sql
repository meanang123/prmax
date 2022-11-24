select outletid, outletname from outlets
where communicationid 
in  (select communicationid from communications where addressid in ( 
select addressid from addresses where 
LOWER(townname) in ('blackrock','passage west', 'birr','tipperary','roscommon','clane','roscrea','ardee','loughrea','carrickmacross','listowel','ballybofey','clonakilty','kilcock','kinsale','mountmellick','blessington','sallins','kinsealy','macroom','oranmore','dunshaughlin','cahir','mitchelstown','bantry','kilcoole','duleek')
OR 
LOWER(address2) in ('blackrock','passage west', 'birr','tipperary','roscommon','clane','roscrea','ardee','loughrea','carrickmacross','listowel','ballybofey','clonakilty','kilcock','kinsale','mountmellick','blessington','sallins','kinsealy','macroom','oranmore','dunshaughlin','cahir','mitchelstown','bantry','kilcoole','duleek')
OR 
LOWER(county) in ('blackrock','passage west', 'birr','tipperary','roscommon','clane','roscrea','ardee','loughrea','carrickmacross','listowel','ballybofey','clonakilty','kilcock','kinsale','mountmellick','blessington','sallins','kinsealy','macroom','oranmore','dunshaughlin','cahir','mitchelstown','bantry','kilcoole','duleek')
))
