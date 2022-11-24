DROP VIEW prmaxrolesynonyms_view;
CREATE OR REPLACE VIEW prmaxrolesynonyms_view AS SELECT
s.parentprmaxroleid AS prmaxroleid,
s.childprmaxroleid as synonymid,
r.prmaxrole
FROM internal.prmaxrolesynonyms as s
JOIN internal.prmaxroles as r ON r.prmaxroleid = s.childprmaxroleid;

GRANT SELECT ON prmaxrolesynonyms_view TO prmax;

CREATE OR REPLACE  VIEW prmaxrolesinterest_view AS SELECT pr.prmaxroleid,pr.interestid,i.interestname FROM internal.prmaxroleinterests AS pr JOIN interests AS i ON i.interestid = pr.interestid ORDER BY prmaxroleid,i.interestname;

GRANT SELECT ON prmaxrolesinterest_view TO prmax;