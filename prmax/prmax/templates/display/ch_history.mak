<span class="common_prmax_layout">
%if chh:

 %if chh.contacthistoryhistorytypeid == 1:
  <label>From Notes</label><br/>
  <p>${chh.from_notes}</p><br/>
  <label>To  Notes</label><br/>
  <p>${chh.to_notes}</p><br/>
 %elif chh.contacthistoryhistorytypeid == 2:
  <label>To:</label><br/>
  <p>${chh.from_notes}</p><br/>
  <label>Body:</label><br/>
  <p>${chh.to_notes}</p><br/>
 %endif

%else:
 <p></p>

%endif

</span>
