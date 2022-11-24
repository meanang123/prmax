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

<%include file="default_header.mak"/>
<div class="content-width">
	<div class="single-news-content">
		<div class="single-news-text">
		
		<div class="news-title">About ${client.clientname}</div>
			<div>${newsroom.get_about_contents()}</div><br/><br/>
		</div>

		<div class="single-news-links">	
			<div class="news-contact">
				<div class="title">Info</div>
				<%include file="info_pane.mak"/>
			</div>
		</div>				
	</div>

	<%include file="default_footer.mak"/>
</div>	

</body></html>
