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
<script type="text/javascript">var switchTo5x=false;</script>
<script type="text/javascript">stLight.options({publisher:'a8ad746a-9fd2-4279-b743-150377f85716'});</script>
</head>
<body class="cardiff">
<%include file="default_header_welsh.mak"/>
<div class="content-width">
    <div class="single-news-content-cardiff">
        <a class="back" href="/">Back</a>
        % if seorelease:
            <%
            from ttl.ttlmako import correct_http_link
            %>
    
            <div class="single-news-text">
                <div class="news-title">${seorelease["seo"].headline}</div>
                <div>${seorelease["content"]}</div>
            </div>
        %else:
            <div class="empty-page">No results found</div>
        %endif
    </div>
</div>
</body></html>
