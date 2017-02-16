<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">
<head>
<meta name="robots" content="noindex">
<%include file="header_common.mak"/>
% if seorelease:
<title></title>
<meta name="description" content=""></meta>
%endif
<%include file="header_google.mak"/>
</head>
<body>
<div class="totalframe">
<div class="headercontent"><%include file="header.mak"/></div>
<div class="maincontent"><div class="innertube">
<br/>
<a href="/releases/${seorelease.seoreleaseid}.html">Back to Release</a><br/>
<a href="mailto:${seorelease.email}">Send Email</a><br/>
<br/><br/><br/><br/><br/><br/>
</div></div>
<%include file="footer.mak"/>
</div>
</body></html>
