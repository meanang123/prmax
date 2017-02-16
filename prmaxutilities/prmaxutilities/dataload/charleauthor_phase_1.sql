
update outlets 
set primaryemployeeid = (select employeeid from employees where outletid in ( select outletid from outlets where outletname ='The Guardian (Science & Technology)' ) and job_title = 'Computer Editor')
where outletname ='The Guardian (Science & Technology)';

update employees 
set isprimary = 1 where outletid in ( select outletid from outlets where outletname ='The Guardian (Science & Technology)' ) and job_title = 'Computer Editor' ;
update employees 
set isprimary = 1 where outletid in ( select outletid from outlets where outletname ='The Guardian (Science & Technology)' ) and job_title = 'Technology Editor' ;

