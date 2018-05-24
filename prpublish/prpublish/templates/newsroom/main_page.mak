<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">
<head>
<%include file="../header_common.mak"/>
<title>${client.clientname} Newsroom</title>
<title>Newsroom</title>
<meta name="description" content=""></meta>
<meta name="keywords" content=""></meta>
<%include file="../header_google.mak"/>
</head>
<body>
<%include file="default_header.mak"/>
<div class="content-width">
	<div class="single-news-content">
		<div class="single-news-text">
			% if not results:
				<div class="empty" >No Results Found</div>
			% else:
				<%namespace file="../resulttrail.mak" import="create_trail"/>
				${create_trail( resultcount, criteria, offset)}
				% for result in results:
					%if result['seoimageid']:
						<img style="float:left;margin:0px 20px 10px 0px;" alt="Image" src="${'/releases/images?imageid=%d' % result['seoimageid']}" height="${result['height']}px" width="${result['width']}px"></img>
					%else:
						<img style="float:left" alt="No Image" src="/static/images/noimage.gif" height="100px" width="100px"></img>
					%endif
					<div class="news-title-newsroom"><a href="${result['link']}">${result['headline']}</a></div>
					<div class="newsroom-synopsis">${result['synopsis'].replace("\n"," ").replace("  "," ")}</div>
				% endfor
			%endif
		</div><br/><br/>
			
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
