
insert into interests(interestname) select subjectname from internal.subjects as s left outer join interests as i on i.interestname = s.subjectname WHERE i.interestid is null;
insert into interestsubjects(interestid,subjectid) select i.interestid,s.subjectid from internal.subjects as s left outer join interests as i on i.interestname = s.subjectname left outer join interestsubjects AS its ON s.subjectid = its.subjectid WHERE its.subjectid is NULL;

-- This module initialises all the information for building the interest lookup tree
-- INSERT INTO interests(interestname,isroot) VALUES ('Custom Tags',1);

-- cleanup
TRUNCATE interestgroups;
-- setup root notes
INSERT INTO interestgroups ( childinterestid ) SELECT isub.interestid from internal.subjects as s join interestsubjects as isub ON s.subjectid = isub.subjectid where s.subjectparentid is null;
INSERT INTO interestgroups ( parentinterestid, childinterestid )
SELECT pi.interestid, ci.interestid
from internal.subjects as s
JOIN interestsubjects as ci ON s.subjectid = ci.subjectid
JOIN interestsubjects as pi ON s.subjectparentid = pi.subjectid
where s.subjectparentid is not null;