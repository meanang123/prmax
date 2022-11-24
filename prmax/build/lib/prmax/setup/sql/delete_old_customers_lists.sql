select * from internal.customers WHERE licence_expire < '2015-02-01';


-- fix up move
UPDATE userdata.list as l 
SET customerid = 929
FROM userdata.emailtemplates as et
WHERE et.listid = l.listid AND l.customerid != et.customerid and l.customerid = 1893;


-- delete seo older then 3 yesr 
delete from seoreleases.seorelease where customerid in ( select customerid from internal.customers WHERE licence_expire < '2015-02-01' ) and expiredate < '2014-02-01';
-- remove link to sep for templates 
UPDATE seoreleases.seorelease SET emailtemplateid = NULL WHERE emailtemplateid IN (SELECT emailtemplateid FROM userdata.emailtemplates where customerid in ( select customerid from internal.customers WHERE licence_expire < '2015-02-01' ));
-- delete press release
delete from userdata.emailtemplates where customerid in ( select customerid from internal.customers WHERE licence_expire < '2013-02-01' );
-- delete list
delete from userdata.list where customerid in ( select customerid from internal.customers WHERE licence_expire < '2015-02-01' );
-- delete collateral
-- where customer haev no seo 
-- move complet of seo exist 

-- clean up collateral file !