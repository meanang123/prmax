<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">
<head>
<%include file="../header_common.mak"/>
<title>${client.clientname} Newsroom</title>
<meta name="description" content=""></meta>
<meta name="keywords" content=""></meta>
<%include file="../header_google.mak"/>
</head>
<body>
<div class="totalframe">
	<%include file="default_header.mak"/>
	<div class="maincontent">
		<div class="innertube innertube_newsroom">
% if not results:
			<p class="notfound" >No Results Found</p>
% else:
<%namespace file="../resulttrail.mak" import="create_trail"/>
			${create_trail( resultcount, criteria, offset)}
% for result in results:
			<div class="release">
				<div class="image_frame">
%if result['seoimageid']:
					<img style="float:left" alt="Image" src="${'/releases/images?imageid=%d' % result['seoimageid']}" height="${result['height']}px" width="${result['width']}px"></img>
%else:
					<img style="float:left" alt="No Image" src="/static/images/noimage.gif" height="100px" width="100px"></img>
%endif
				</div>
				<div class="details_frame">
					<a style="float:right" class="sidelinks" href="${result['link']}">View Details</a>
					<p class="headline" >${result['headline']}</p>
					<p class="synopsis" >${result['synopsis'].replace("\n"," ").replace("  "," ")}</p>
				</div>
			</div>
% endfor
%endif
		</div>
		<%include file="info_pane.mak"/>
	</div>
<%include file="default_footer.mak"/>
	</div>
</body></html>
