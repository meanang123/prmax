select r.prmaxroleid,r.prmaxrole,rp.prmaxrole from internal.prmaxroles as r
LEFT OUTER JOIN internal.prmaxrolesynonyms as rs ON rs.childprmaxroleid = r.prmaxroleid
LEFT OUTER JOIN internal.prmaxroles as rp ON rs.parentprmaxroleid = rp.prmaxroleid
ORDER BY rs.parentprmaxroleid
