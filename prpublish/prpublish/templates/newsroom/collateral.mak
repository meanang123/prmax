﻿<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">
<head>
<%include file="../header_common.mak"/>
<title>${client.clientname} Pictures &amp; Videos</title>
<meta name="description" content=""></meta>
<meta name="keywords" content=""></meta>
<%include file="../header_google.mak"/>
</head>
<body>
<div class="totalframe">
	<%include file="default_header.mak"/>
	<div class="maincontent">
		<div class="innertube innertube_collateral">
		<table width="100%" cellpadding="0px" cellspacing="0px">
			<tr><th><p class="heading">Pictures &amp; Videos</p></th></tr>
%for collateral in clientcollateral:
			<tr class="${loop.cycle('odd', 'even')}"><td width="100%"><a href="${collateral.get_link_address()}" target="_blank">${collateral.get_link_description()}</a></td></tr>
%endfor
		</table>
%if len(clientcollateral)< 18:
%for x in xrange(len(clientcollateral),18):
	<br/>
%endfor
%endif
		</div>
		<%include file="info_pane.mak"/>
	</div>
<%include file="default_footer.mak"/>
	</div>
</body></html>
