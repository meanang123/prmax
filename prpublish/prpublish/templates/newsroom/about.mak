<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">
<head>
<%include file="../header_common.mak"/>
<title>${client.clientname} About</title>
<meta name="description" content=""></meta>
<meta name="keywords" content=""></meta>
<%include file="../header_google.mak"/>
</head>
<body>
<div class="totalframe">
	<%include file="default_header.mak"/>
	<div class="maincontent">
		<div class="innertube innertube_newsroom">
		<p class="header">About ${client.clientname}</p>
		<div>${newsroom.get_about_contents()}</div>
		</div>
		<%include file="info_pane.mak"/>
	</div>
<%include file="default_footer.mak"/>
	</div>
</body></html>
