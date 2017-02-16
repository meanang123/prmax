-- Initialise the outletsearchtypes
insert into outletsearchtypes( outletsearchtypeid,outletsearchtypename,internal)
VALUES (1, 'National Newspapers', 0),
(2, 'Regional Newspapers', 0),
(3, 'Politician', 0),
(4, 'Business Magazines', 0),
(5, 'Consumer Magazines', 0),
(6, 'Radio', 0),
(7, 'Tv', 0),
(8, 'New Media', 0),
(9, 'Other', 0),
(10, 'Freelance', 1);

insert into frequencies(frequencyid,frequencyname,prn_key)
VALUES ( 1, 'Annually', 250),
(2, 'Monthly', 251),
(3, 'Weekly', 252),
(4, 'Daily', 253),
(5, 'None', 254),
(6, 'Twice a year', 8031),
(7, 'Quarterly', 8032),
(8, 'Every other month', 8033),
(9, 'Twice a month', 8034),
(10, 'Online', 8035),
(11, 'Three times a year', 8036),
(12, 'Twice a week', 8037);

insert into outlettypes (outlettypeid, outlettypename, prn_key, outletsearchtypeid)
VALUES
(1, 'Feature', 416, 4),
(2, 'Financial outlet', 417, 4),
(3, 'Foreign bureau', 418, 4),
(4, 'Guild', 419, 4),
(5, 'Industry research organization', 420, 4),
(6, 'Media company', 421, 4),
(7, 'Network', 422, 4),
(8, 'News agency/wire service', 423, 4),
(9, 'News agency/wire service, foreign bureau', 424, 4),
(10, 'News agency/wire service, regional bureau', 425, 4),
(11, 'Organization', 426, 4),
(12, 'Print/online', 427, 4),
(13, 'Production/programming provider', 428, 4),
(14, 'Publishing company', 429, 4),
(15, 'Regional bureau', 430, 4),
(16, 'Station', 431, 4),
(17, 'Syndicator/producer', 432, 4),
(18, 'Unknown', 433, 9),
(19, 'Freelancer journalists outlet', 434, 10),
(20, 'Program/Column/Supplement', 435, 4),
(21, 'Actuaries & Consultants', 4020, 4),
(22, 'Authorised Banking Institutions', 4021, 4),
(23, 'Building Society', 4022, 4),
(24, 'Chambers of Commerce', 4023, 4),
(25, 'Charity', 4024, 4),
(26, 'Clearing Financial Institution', 4025, 4),
(27, 'Exchanges and related Organisations', 4026, 4),
(28, 'Government Departments', 4027, 4),
(29, 'Independent Investment Research Company', 4028, 4),
(30, 'Insurance/Assurance Company', 4029, 4),
(31, 'Investment Banks, Securities Houses, Corporate Finance', 4030, 4),
(32, 'Investment Management Company', 4031, 4),
(33, 'Pension Fund Owner', 4032, 4),
(34, 'Professional Bodies and Information Organisations', 4033, 4),
(35, 'Regulatory Organisations, Watchdogs and Ombudsmen', 4034, 4),
(36, 'Stockbrokers - Branch Office', 4035, 4),
(37, 'Stockbrokers - Head Office', 4036, 4),
(38, 'Trustee Organisation', 4037, 4),
(39, 'Venture Capital/Private Equity Company', 4038, 4),
(40, 'Unknown', 4039, 4),
(41, 'Politician', 503362, 4);


INSERT INTO setindextypes ( setindextypeid,setindextypename)
VALUES ( 1,'outlet_name'),
 ( 2,'outlet_statusid'),
( 3,'outlet_frequencyid'),
( 4,'outlet_circulationid'),
( 5,'outlet_searchtypeid');

INSERT INTO searchtypes ( searchtypeid,searchtypename)
VALUES ( 1,'Search');

