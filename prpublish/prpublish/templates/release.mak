# -*- coding: utf-8 -*-
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">
<head>
<%include file="header_common.mak"/>
% if seorelease:
<title>${seorelease['seo'].headline}</title>
<meta name="description" content="${seorelease['seo'].headline}"></meta>
<meta name="keywords" content="${seorelease['keywords']}"></meta>
%endif
<%include file="header_google.mak"/>
<script type="text/javascript">var switchTo5x=false;</script><script type="text/javascript" src="http://w.sharethis.com/button/buttons.js"></script><script type="text/javascript">stLight.options({publisher:'a8ad746a-9fd2-4279-b743-150377f85716'});</script>
</head>
<body>
<div class="totalframe">
<div class="headercontent"><%include file="header.mak"/></div>
<div class="maincontent"><div class="column1">
% if seorelease:
<%
from ttl.ttlmako import correct_http_link
%>
<div>${seorelease["content"]}</div></div>
<div class="column2">
<div class="heading">Contact</div>
<p>${seorelease["seo"].companyname}</p>
% if seorelease["seo"].tel:
<p>${seorelease["seo"].tel}</p>
% endif
% if seorelease["seo"].www:
<p><a href='${correct_http_link(seorelease["seo"].www)}' rel="nofollow" target="_blank">${seorelease["seo"].www}</a></p>
% endif
% if seorelease["seo"].email:
<p><a href='/releases/epage?seoreleaseid=${seorelease["seo"].seoreleaseid}'>Email</a></p>
% endif
% if seorelease["seo"].twitter:
<p><a href='${correct_http_link(seorelease["seo"].twitter)}' rel="nofollow" target="_blank">Twitter</a></p>
% endif
% if seorelease["seo"].facebook:
<p><a href='${correct_http_link(seorelease["seo"].facebook)}' rel="nofollow" target="_blank">Facebook</a></p>
% endif
% if seorelease["seo"].linkedin:
<p><a href='${correct_http_link(seorelease["seo"].linkedin)}' rel="nofollow" target="_blank">LinkedIn</a></p>
% endif

<p class='st_sharethis' displayText='ShareThis'></p>
<div class="heading">Categories</div>
<p class="categories" >${seorelease['categories'].replace(",","<br/>")}</p>

</div>
% else:
<p class="notfound">Release Not Found</p>
%endif
</div>
<%include file="footer.mak"/>
</div></div>
</body></html>
