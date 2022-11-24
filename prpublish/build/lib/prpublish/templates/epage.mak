<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">
<head>
<meta name="robots" content="noindex">
<%include file="header_common.mak"/>
% if seorelease:
<title></title>
<meta name="description" content=""></meta>
%endif
<%include file="header_google.mak"/>
</head>

<body >
<%include file="header.mak"/>

<div class="content-width">
    <div class="single-news-content">
        <a class="back" href="/releases/${prefix}${newsroomid}/${seoreleaseid}.html">Back</a><br/><br/><br/>
        <div  class="single-news-text">
            <a href="mailto:${email}">Send Email</a><br/>
        </div>
    </div>
</div>
<%include file="footer.mak"/>
</body></html>
