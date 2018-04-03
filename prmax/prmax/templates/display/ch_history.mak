<span class="common_prmax_layout">
%if chh:

 %if chh.contacthistoryhistorytypeid == 1:
  <label>From ${briefing_notes_description}</label><br/>
  <p>${chh.from_notes}</p><br/>
  <label>To  ${briefing_notes_description}</label><br/>
  <p>${chh.to_notes}</p><br/>
 %elif chh.contacthistoryhistorytypeid == 2:
  <label>Send By:</label><br/>
  <p>${chres.send_by}</p><br/>
  <label>To:</label><br/>
  <p>${chres.toemailaddress}</p><br/>
  <label>Statement:</label><br/>
  <p>${statementdescription}</p><br/>
  <label>Body:</label><br/>
  <p>${chres.response}</p><br/>
 %endif

%else:
 <p></p>

%endif

</span>
