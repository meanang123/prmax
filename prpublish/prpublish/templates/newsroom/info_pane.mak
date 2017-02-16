<div class="details_newsroom">
	<p class="client_name_header">${client.clientname}</p><br/>
	<a href="${newsroom.get_about_page()}">About ${client.clientname}</a><br/>
	<a href="${newsroom.get_collateral_page()}">Pictures &amp; Videos</a><br/>
	<a href="${newsroom.get_contact_details_page()}">Contact</a><br/>
% for row in newsroom.get_custom_links():
	<a target="_blank" href="${row.url}">${row.name}</a><br/>
%endfor
	<a title="RSS" class="toplinks" target="_blank" href="${newsroom.get_rss()}"><img height="14px" width="36px" alt="RSS" style="padding-top:4px"src="/prcommon/images/rss.gif"/></a><br/>
	<br/>
</div>
