<span class="common_prmax_layout">
<h2>Email Status</h2>
%for row in emailstatus:
<label class="label_1">${row[0]}</label><p>${row[1]}</p><br/>
%endfor
%if customer.has_clickthrought:
<h2>Click Through Analysis</h2>
<b><label class="label_0">Count</label><label class="label_1">Link</label><br/></b>
%for row in clickthrough:
<label class="label_0">${row[1]}</label><a href="${row[2]}">${row[0]}</a><br/>
%endfor
%endif
</span>
