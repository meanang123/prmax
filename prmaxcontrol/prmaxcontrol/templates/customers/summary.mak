# -*- coding: utf-8 -*-
<%!
from ttl.ttlmako import isnull
%>
<div class="common_prmax_layout" style="padding-top:5px;padding-left:4px">
<label class="label_size_2 label_tag label_align_r">Customer</label><p>${"%6d - %s" % (customer.customerid, customer.customername)}</p><br/>
<label class="label_size_2 label_tag label_align_r">Login Attempts</label>
%if last_logged_in:
<p>${last_logged_in.strftime("%d/%m/%y %H:%M")}</p>
%else:
<p>Not Accessed</p>
%endif
<br/>
<label class="label_size_2 label_tag label_align_r">Accessed App</label>
%if last_accessed:
<p>${last_accessed.strftime("%d/%m/%y %H:%M")}  : Nbr  - ${last_accessed_count}</p>
%else:
<p>Not Accessed</p>
%endif
<br/>
<label class="label_size_2 label_tag label_align_r">Last Search</label>
%if last_searched_in:
<p>${last_searched_in.strftime("%d/%m/%y %H:%M")}</p>
%else:
<p>Not Searched</p>
%endif
<br/>
<label class="label_size_2 label_tag label_align_r">Max User Accounts</label><p>${customer.maxnbrofusersaccounts}</p><br/>
<label class="label_size_2 label_tag label_align_r">Concurrent Logins</label><p>${customer.logins}</p><br/>
<label class="label_size_2 label_tag label_align_r">Status</label><p>${status.customerstatusname}</p><br/>
<label class="label_size_2 label_tag label_align_r">Expires</label><p>${customer.licence_expire.strftime("%d/%m/%y")}</p><br/>
<label class="label_size_2 label_tag label_align_r">Created</label><p>${customer.created.strftime("%d/%m/%y")}</p><br/>
</div>
