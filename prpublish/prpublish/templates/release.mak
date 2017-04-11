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
<body>
<%include file="header.mak"/>
<div class="content-width">
    <div class="single-news-content">
        <a class="back" href="/search_results">Back</a>
        <div class="news-date">
            <div class="day">${seorelease['seo'].published.day}.</div>
            <div class="month">${seorelease['seo'].published.strftime("%B")}</div>
            <div class="year">${seorelease['seo'].published.year}.</div>
        </div>

        % if seorelease:
            <%
            from ttl.ttlmako import correct_http_link
            %>
    
            <div class="single-news-text">
                <div class="news-title">${seorelease["seo"].headline}</div>
                <div>${seorelease["content"]}</div>
            </div>
    
            <div class="single-news-links">
                <div class="news-contact">
                    <div class="title">Contact</div>
                    ${seorelease["seo"].companyname}<br/>
                    % if seorelease["seo"].tel:
                        ${seorelease["seo"].tel}<br/>
                    % endif
                    % if seorelease["seo"].www:
                        <a href='${correct_http_link(seorelease["seo"].www)}' rel="nofollow" target="_blank">${seorelease["seo"].www}</a><br/><br/>
                    % endif
                    % if seorelease["seo"].email:
                        <a href='/releases/epage?seoreleaseid=${seorelease["seo"].seoreleaseid}'>Email</a><br/>
                    % endif
                    % if seorelease["seo"].twitter:
                        <a href='${correct_http_link(seorelease["seo"].twitter)}' rel="nofollow" target="_blank">Twitter</a><br/>
                    % endif
                    % if seorelease["seo"].facebook:
                        <a href='${correct_http_link(seorelease["seo"].facebook)}' rel="nofollow" target="_blank">Facebook</a><br/>
                    % endif
                    % if seorelease["seo"].linkedin:
                        <a href='${correct_http_link(seorelease["seo"].linkedin)}' rel="nofollow" target="_blank">LinkedIn</a><br/>
                    % endif
                </div>
                <div class="news-category">
                    <div class="title">Category</div>
                    %for cat in seorelease['categories2']:
                        <div class="category-item">${cat}</div>
                    %endfor
                </div>
            </div>
        %else:
            <div class="empty-page">No results found</div>
        %endif
    </div>
</div>
<%include file="footer.mak"/>
</body></html>
