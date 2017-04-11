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
<%include file="header.mak"/>
<div class="content-width">

    <div class="plain-page about">
        <div class="plain-page-title">Categories</div>
        <div class="plain-page-logo"></div>
        <div class="plain-page-content">
          % for cat in categories:
          <table border="0" cellspacing="3" cellpadding="3">
            <tr>
              <td width="280px"><a title="${cat.seocategorydescription}" href="/search?seocategoryid=${cat.seocategoryid}">${cat.seocategorydescription}</a></td>
              <td width="20px"><a class="rss" title="RSS" target="_blank" href="/rss.xml?seocategoryid=${cat.seocategoryid}"><i class="fa fa-rss-square fa-2x" aria-hidden="true"></i></a></td>
             </tr>
          </table>
          % endfor
        </div>
    </div>

</div>
<%include file="footer.mak"/>
</body></html>