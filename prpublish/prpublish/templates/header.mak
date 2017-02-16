<%
from datetime import date
%>
<a class="toplinks" href="/"><img style="float:left" height="49px" width="215px" src="/static/images/prmaxlogo.png" border="0" title="Back to home page" alt="PRnewslink Press Release distribution"></img></a>
<h1 style="float:left;padding-left:15px"></h1>
<div style="float:right;padding:0px;margin:0px">
  <a href="http://www.prmax.co.uk" target="_blank"><img src="/static/images/aservice.png" width="206" height="27" border="0" alt="A service from PRmax" /></a>
</div>
<div style="float:right;margin-top:40px;padding-left:15px">
  <img height="43px" width="119px" alt="null" border="0" src="/static/images/spacer.gif"></img>
</div>
<table width="100%" border="0" cellspacing="3" cellpadding="3">
  <tr>
    <td><a href="/" style="float:left;margin-top:15px;padding-right:0px" title="Latest News"><img src="/static/images/lnews.png" width="120" height="32" border="0" alt="Latest News" /></a></td>
    <td style="float:left;margin-top:20px;font-weight:bold">${ date.today().strftime("%d %B %Y") }</td>
    <td style="width:150px;align:right">
      <table width="100%" border="0" cellspacing="0" cellpadding="1">
      <tr>
% if seocategoryid:
        <td><a title="RSS" class="toplinks" target="_blank" href="/rss.xml?seocategoryid=${seocategoryid}"><img height="14px" width="36px" alt="RSS" src="/prcommon/images/rss.gif"/></a></td>
% else:
        <td><a title="RSS" class="toplinks" target="_blank" href="/rss.xml"><img height="14px" width="36px" alt="RSS" src="/prcommon/images/rss.gif"/></a></td>
% endif
        <td><a title="google RSS" class="toplinks" href="http://fusion.google.com/add?source=atgs&amp;feedurl=http%3A//prnewslink.net/rss.xml"><img src="http://gmodules.com/ig/images/plus_google.gif" border="0" alt="Add to Google"/></a></td>
        <td style="width:143px"><div style="width:143px;overflow:hidden"><a href="https://twitter.com/PRnewslink" class="twitter-follow-button" data-show-count="false" data-lang="en">Follow @PRnewslink</a>
            <script type="javascript">!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="//platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script></div></td>
        </tr></table>
      </td>
  </tr>
</table>
