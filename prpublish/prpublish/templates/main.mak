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
<div class="totalframe">
<div class="headercontent"><%include file="header.mak"/></div>
<table width="100%" border="0" cellspacing="0" cellpadding="0">
  <tr>
    <td bgcolor="#6699cc" valign="top">
        <table width="100%" border="0" cellspacing="3" cellpadding="3">
           <tr>
             <td bgcolor="#d9e4ed"><%include file="search.mak"/></td>
        </tr>
         <tr>
             <td bgcolor="#d9e4ed"><%include file="categories.mak"/></td>
        </tr>
    </table>
    </td>
    <td bgcolor="#6699cc" width="1" valign="top">&nbsp;</td>
	<td width="5" valign="top">&nbsp;</td>
	<td valign="top">
<div class="maincontent">
<div class="innertube">
% if not results:
<p class="notfound" >No Results Found</p>
% else:
<%namespace file="resulttrail.mak" import="create_trail"/>
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
</div></div>
<%include file="footer.mak"/>
&nbsp;</td>
  </tr>
</table></div>
</body></html>
