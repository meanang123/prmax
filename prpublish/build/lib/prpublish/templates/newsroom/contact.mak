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
<%include file="default_header.mak"/>
<div class="content-width">
	<div class="single-news-content">
		<div class="single-news-text">
			<div class="news-title">Contact Details</div>
			<%
			from ttl.ttlmako import correct_http_link
			%>
			${client.clientname}<br/>
			% if client.tel:
			${client.tel}<br/>
			% endif
			% if client.www:
			<a href='${correct_http_link(client.www)}' target="_blank">Link</a><br/>
			% endif
			% if client.email:
			<a href='mailto:${client.email}'>Email</a><br/>
			% endif
			% if client.twitter:
			<a href='${correct_http_link(client.twitter)}' target="_blank">Twitter</a><br/>
			% endif
			% if client.facebook:
			<a href='${correct_http_link(client.facebook)}' target="_blank">Facebook</a><br/>
			% endif
			% if client.linkedin:
			<a href='${correct_http_link(client.linkedin)}' target="_blank">LinkedIn</a><br/>
			% endif
			% if client.instagram:
			<a href='${correct_http_link(client.instagram)}' target="_blank">Instagram</a><br/>
			% endif
			<br/><br/>
			<div class="single-news-links">	
				<div class="news-contact">
					<div class="title">Info</div>
					<%include file="info_pane.mak"/>
				</div>
			</div>	
		</div>
	</div>
	<%include file="default_footer.mak"/>
</div>	

</body></html>
