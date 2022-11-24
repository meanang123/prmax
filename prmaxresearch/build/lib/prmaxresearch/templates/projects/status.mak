<table border="1">
%for row in status:
<tr><td  width="200px">${row[0]}</td><td align="right">${row[1]}&nbsp;</td></tr>
%endfor
<tr><td colspan="2">&nbsp;</td></tr>
<tr><td>Total Entries</td><td align="right">${total_records}&nbsp;</td></tr>
<tr><td colspan="2">&nbsp;</td></tr>
<tr><td>Total First Sent</td><td align="right">${researchproject.first_send_total}&nbsp;</td></tr>
</table>
