<span class="common_prmax_layout prmaxrowdisplay_profile">
%if chh:

 %if chh.contacthistoryhistorytypeid == 1:
  <label><b>From</b> ${briefing_notes_description}:</label><br/>
  <p>${chh.from_notes}</p><br/>
  <label><b>To</b> ${briefing_notes_description}:</label><br/>
  <p>${chh.to_notes}</p><br/>
 %elif chh.contacthistoryhistorytypeid == 2:
  <label><b>Send By:</b></label><br/>
  <p>${chres.send_by}</p><br/>
  <label><b>To:</b></label><br/>
  <p>${chres.toemailaddress}</p><br/>
  <label><b>Statement:</b></label><br/>
  <p>${statementdescription}</p><br/>
  <label><b>Body:</b></label><br/>
  <p>${chres.response}</p><br/>
 %endif

%else:
 <p></p>

%endif

</span>
