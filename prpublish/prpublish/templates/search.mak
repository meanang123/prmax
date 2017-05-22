<div class="searchform">
<div align="center" class="searchheader">
  Search<br/>
</div>
<form class="searchform" action="/search" method="post" target="_parent">
  <label class="searchtext">Keywords</label><br/><input type="text" name="keywords" value="" /><br/>
  <br/><label class="searchtext">Headline</label><br/><input type="text" name="headline" value="" /><br/>
  <br/><label class="searchtext">Categories</label><br/>
<select name="seocategoryid">
<option value="-1">All Selections</option>
% for cat in categories:
<option value="${cat['seocategoryid']}">${cat['seocategorydescription']}</option>
%endfor
</select><br/><br/>
<label class="searchtext">Body Text</label><br/><input type="text" name="bodytext" value="" /><br/>
  <input style="margin-left:172px" type="submit" value="Search" />
</form>
<br/><br/><br/>
</div>
