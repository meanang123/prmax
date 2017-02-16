<%
from datetime import date
%>
<div class="headercontent_nr" style="background-color:${newsroom.get_client_background_colour()}">
<a class="toplinks" href="${newsroom.get_home_page()}"><img style="float:left" height="${newsroom.get_client_logo_link_height(1)}px" width="${newsroom.get_client_logo_link_width(1)}px" src="${newsroom.get_client_logo_link(1)}" border="0" title="Back to home page" alt="${client.clientname}"></img></a>
<a class="toplinks" href="${newsroom.get_home_page()}"><img style="float:right;padding-right:0px" height="${newsroom.get_client_logo_link_height(2)}px" width="${newsroom.get_client_logo_link_width(2)}px" src="${newsroom.get_client_logo_link(2)}" border="0" title="Back to home page" alt="${client.clientname}"></img></a>
<table width="100%" border="0" cellspacing="0" cellpadding="0">
  <tr>
    <td><a href="${newsroom.get_home_page()}" style="float:left;margin-top:5px;padding-right:0px" title="Latest News"><img src="/static/images/nr_lnews.png" width="120" height="32" border="0" alt="Latest News" /></a></td>
  </tr>
</table>
</div>