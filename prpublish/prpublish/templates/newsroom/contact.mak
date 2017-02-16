<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">
<head>
<%include file="../header_common.mak"/>
<title>${client.clientname} Contact</title>
<meta name="description" content=""></meta>
<meta name="keywords" content=""></meta>
<%include file="../header_google.mak"/>
</head>
<body>
<div class="totalframe">
	<%include file="default_header.mak"/>
	<div class="maincontent">
		<div class="innertube innertube_newsroom">

		<p class="header">Contact Details</p>
<%
from ttl.ttlmako import correct_http_link
%>
<div style="padding-left:20px;padding-bottom:20px">
<p>${client.clientname}</p>
% if client.tel:
<p>${client.tel}</p>
% endif
% if client.www:
<p><a href='${correct_http_link(client.www)}' target="_blank">${client.www}</a></p>
% endif
% if client.email:
<p><a href='mailto:${client.email}'>Email</a></p>
% endif
% if client.twitter:
<p><a href='${correct_http_link(client.twitter)}' target="_blank">Twitter</a></p>
% endif
% if client.facebook:
<p><a href='${correct_http_link(client.facebook)}' target="_blank">Facebook</a></p>
% endif
% if client.linkedin:
<p><a href='${correct_http_link(client.linkedin)}' target="_blank">LinkedIn</a></p>
% endif
		</div>
		</div>
		<%include file="info_pane.mak"/>
	</div>
<%include file="default_footer.mak"/>
	</div>
</body></html>
