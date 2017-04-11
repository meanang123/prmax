<%
from datetime import date
%>

<div class="main-header" style="background-color:${newsroom.get_client_background_colour()}">
    <div class="top-bar-newsroom">
        <div class="content-width">
            %if newsroom.get_client_logo_link(1) or newsroom.get_client_logo_link(2):
                <a href="${newsroom.get_home_page()}"><img style="float:left" height="${newsroom.get_client_logo_link_height(1)}px" width="${newsroom.get_client_logo_link_width(1)}px" src="${newsroom.get_client_logo_link(1)}" border="0" title="Back to home page" alt="${client.clientname}"></img></a>
                <a href="${newsroom.get_home_page()}"><img style="float:right;padding-right:0px" height="${newsroom.get_client_logo_link_height(2)}px" width="${newsroom.get_client_logo_link_width(2)}px" src="${newsroom.get_client_logo_link(2)}" border="0" title="Back to home page" alt="${client.clientname}"></img></a>
            %else:
                <a href="${newsroom.get_home_page()}">abc ${client.clientname}</a>
            %endif
        </div>
    </div>
</div>

