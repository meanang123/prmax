<div class="common_prmax_layout" style="width:100%">
% if chi['primary']:
<label class="label_1">Primary Issue</label><p>${chi['primary'].name}</p><br/>
%endif
%if chi['si']:
<label class="label_1">Primary Issue</label><p>${",".join([issue.name for issue in chi['si']])}</p><br/>
%endif
<label class="label_1">Details</label><p>${ch.details}</p><br/>
</div>
