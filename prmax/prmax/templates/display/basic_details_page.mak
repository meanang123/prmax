<div class="common_prmax_layout" style="width:100%">
% if chi['primary']:
<p class="prmaxrowdisplaylarge">${chi['primary'].name}</p><br/>
%endif
%if chi['si']:
<p class="prmaxrowdisplaylarge">${",".join([issue.name for issue in chi['si']])}</p><br/>
%endif
<p class="prmaxrowdisplay_profile2" style="width:98%">${ch.details}</p><br/>
</div>
