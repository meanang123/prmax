-- customer unsub list
SELECT u.customerid,c.customername,COUNT(*) FROM userdata.unsubscribe AS u JOIN internal.customers AS c ON c.customerid = u.customerid GROUP BY u.customerid,c.customername ORDER BY COUNT(*) DESC;
-- day rate
SELECT CAST(created AS DATE) ,COUNT(*) FROM userdata.unsubscribe GROUP BY CAST(created AS DATE) ORDER BY created;

select emailaddress,count(*) from userdata.unsubscribe group by emailaddress order by count(*) desc;

-- releate to publication if possible
SELECT o.outletname
FROM communications AS c
JOIN userdata.unsubscribe AS u ON u.emailaddress ILIKE c.email
JOIN outlets AS o ON c.communicationid = o.communicationid
UNION
SELECT o.outletname
FROM communications AS c
JOIN userdata.unsubscribe AS u ON u.emailaddress ILIKE c.email
JOIN employees AS e on c.communicationid = e.communicationid
JOIN outlets AS o ON e.outletid = o.outletid
GROUP BY outletname;
