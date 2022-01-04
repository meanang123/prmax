<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">
<head>
<%include file="header_common.mak"/>
<title>PRnewslink - Home Page</title>
<meta name="description" content="The home page of the PRnewslink Press Release distribution, the essential journalist's news resource for News Releases, Financial Reports, Statements from hundreds of companies and organisations across the UK"></meta>
<meta name="keywords" content="PRnewslink Journalist News Press Distribution SEO Optimised Company, Information, new product information, Press release"></meta>
<%include file="header_google.mak"/>
</head>
<body>
<%include file="header.mak"/>
<div class="content-width">
	<div class="news-list">		
		% if len(results)>0:
			% for result in results:
			
			<div class="news-box">
				<div class="news-box-content">
					<a class="news-box-title" href="${result['link']}">${result['headline']}</a>
					%if result['seoimageid']:
					<img alt="Image" src="${'/releases/images?imageid=%d' % result['seoimageid']}"></img><br />
					%endif						
					${result['synopsis'].replace("\n"," ").replace("  "," ")}
				</div>
				<div class="news-box-date">${result['published_display']}</div>
			</div>	
			
			% endfor
		%else:
			<div class="empty-page">No results found</div>
		%endif
	</div>

<div class="load-more">
	<%namespace file="resulttrail.mak" import="create_trail"/>
	${create_trail( resultcount, criteria, page_title, offset)}		

</div>
<%include file="footer.mak"/>

</body></html>

