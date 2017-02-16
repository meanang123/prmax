<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">
<head>
<%include file="header_common.mak"/>
<title>PRnewslink - Site Map</title>
<meta name="description" content="The site map of the PRnewslink news distribution web site"></meta>
<meta name="keywords" content="PRnewslink"></meta>

<%include file="header_google.mak"/>
</head>
<body >
<div class="totalframe">
<div class="headercontent"><%include file="header.mak"/></div>
<div class="maincontent"><div class="innertube">
<p>Categories</p><br/>
% for cat in categories:
<table border="0" cellspacing="3" cellpadding="3">
  <tr>
    <td width="250px"><a title="${cat.seocategorydescription}" href="/search?seocategoryid=${cat.seocategoryid}">${cat.seocategorydescription}</a></td>
    <td width="20px"><a title="RSS" target="_blank" href="/rss.xml?seocategoryid=${cat.seocategoryid}"><img height="14px" width="36px" alt="RSS" src="/prcommon/images/rss.gif"></img></a></td>
   </tr>
</table>
% endfor
<br/><br/>
</div>
</div></div>
<%include file="footer.mak"/>
</div>
</body></html>