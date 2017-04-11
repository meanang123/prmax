<div>
	<a href="${newsroom.get_about_page()}">About ${client.clientname}</a><br/>
	<a href="${newsroom.get_collateral_page()}">Pictures &amp; Videos</a><br/>
	<a href="${newsroom.get_contact_details_page()}">Contact</a><br/>
% for row in newsroom.get_custom_links():
	<a target="_blank" href="${row.url}">${row.name}</a><br/>
%endfor
	<a title="RSS" target="_blank" href="${newsroom.get_rss()}"><i class="fa fa-rss-square fa-2x" aria-hidden="true"></i></a><br/>
</div>


