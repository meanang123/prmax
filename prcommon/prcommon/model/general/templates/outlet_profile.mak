# -*- coding: utf-8 -*-
<%!
from ttl.ttlmako import isnull, text_html
%>
<table width="100%" cellspacing="0" cellpadding="0" style="padding-top:5px;padding-left:4px">
<tr><td width="150px"></td><td></td></tr>
%if pr["publisher"]:
	<tr><td valign="top" class="prmaxrowtag" >Publisher</td><td class="prmaxrowdisplay_profile">${pr['publisher'].publishername}</td></tr>
%endif
%if pr["profile"].editorialprofile:
<tr><td class="prmaxrowtag"  valign="top">Editorial Profile</td><td class="prmaxrowdisplay_profile">${text_html(pr['profile'].editorialprofile)}</td></tr>
%endif
%if pr["profile"].officialjournalof:
	<tr><td class="prmaxrowtag"  valign="top">Official Journal of</td><td class="prmaxrowdisplay_profile">${text_html(pr['profile'].officialjournalof)}</td></tr>
%endif
%if pr["languages"]:
	<tr><td class="prmaxrowtag"  valign="top">Language</td><td class="prmaxrowdisplay_profile">${"<br/>".join(pr['languages'])}</td></tr>
%endif
%if pr["seriesparent"]:
	<tr><td class="prmaxrowtag" >Series Parent</td><td class="prmaxrowdisplay_profile">${pr['seriesparent']}</td></tr>
%endif
%if pr["profile"].readership:
<tr><td valign="top" class="prmaxrowtag" >Readership/Audience</td><td class="prmaxrowdisplay_profile">${text_html(pr['profile'].readership)}</td></tr>
%endif
%if pr["profile"].nrsreadership:
<tr><td valign="top" class="prmaxrowtag" >NRS Readership</td><td class="prmaxrowdisplay_profile">${text_html(pr['profile'].nrsreadership)}</td></tr>
%endif
%if pr["coverage"] and pr["outlet"].prmax_outlettypeid not in (1,41):
	<tr><td class="prmaxrowtag"  valign="top">Coverage</td><td class="prmaxrowdisplay_profile">${", ".join(pr['coverage'])}</td></tr>
%endif
%if pr["profile"].jicregreadership:
	<tr><td class="prmaxrowtag"  valign="top">JICREG Readership</td><td class="prmaxrowdisplay_profile">${text_html(pr['profile'].jicregreadership)}</td></tr>
%endif
%if pr["profile"].incorporating:
	<tr><td class="prmaxrowtag"  valign="top">Incorporating</td><td class="prmaxrowdisplay_profile">${text_html(pr['profile'].incorporating)}</td></tr>
%endif
%if pr["productioncompany"]:
	<tr><td class="prmaxrowtag" >Production Company</td><td class="prmaxrowdisplay_profile">${text_html(pr['productioncompany'].productioncompanydescription)}</td></tr>
%endif
%if pr["profile"].broadcasttimes:
	<tr><td class="prmaxrowtag"  valign="top">Broadcast Times</td><td class="prmaxrowdisplay_profile">${text_html(pr['profile'].broadcasttimes)}</td></tr>
%endif
%if pr["profile"].deadline:
	<tr><td class="prmaxrowtag"  valign="top">Deadlines</td><td class="prmaxrowdisplay_profile">${text_html(pr['profile'].deadline)}</td></tr>
%endif
%if pr["seriesmembers"]:
	<tr><td class="prmaxrowtag" valign="top">Series Members</td><td class="prmaxrowdisplay_profile">${"<br/>".join(pr['seriesmembers'])}</td></tr>
%endif
%if pr["supplementof"]:
	<tr><td class="prmaxrowtag" valign="top">Supplement of</td><td class="prmaxrowdisplay_profile">${pr['supplementof']}</td></tr>
%endif
%if pr["supplements"]:
	<tr><td class="prmaxrowtag"  valign="top">Supplements</td><td class="prmaxrowdisplay_profile">${"<br/>".join(pr['supplements'])}</td></tr>
%endif
%if pr["editions"]:
	<tr><td class="prmaxrowtag"  valign="top">Editions</td><td class="prmaxrowdisplay_profile">${"<br/>".join(pr['editions'])}</td></tr>
%endif
%if pr["broadcaston"]:
	<tr><td class="prmaxrowtag"  valign="top">Broadcast on</td><td class="prmaxrowdisplay_profile">${"<br/>".join(pr['broadcaston'])}</td></tr>
%endif
<tr><td class="prmaxrowtag" valign="top">Private: <button class="edit_profile" type="button" onclick='javascript:dojo.publish("/crm/edit_notes",[${pr['outlet'].outletid}]);'>Add Notes</button></td><td class="prmaxrowdisplay_profile"><span name="private"></span></td></tr>
</table>
