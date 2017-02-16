<div class="searchform">
  <div align="center" class="searchheader" >
    Categories<br/>
  </div>
% for cat in categories:
  <table width="100%" border="0" cellspacing="3" cellpadding="3">
    <tr><td><a title="${cat.seocategorydescription.replace("&", "&amp;")}" class="toplinks" target="_parent" href="/${cat.web_page}">${cat.seocategorydescription.replace("&", "&amp;")}</a></td></tr>
  </table>
% endfor
  <br/><br/>
</div>