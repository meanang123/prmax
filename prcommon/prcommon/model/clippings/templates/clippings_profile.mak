# -*- coding: utf-8 -*-
<%!
from ttl.ttlmako import isnull, text_html
%>
<span class="common_prmax_layout">
<h1 style="text-align:center">Clip Details</h1>
<label class="label_1 label_tag label_align_r">Title</label><p>${text_html(pr['clippings'].clip_title)}</p><br/>
<label class="label_1 label_tag label_align_r">Abstract</label><span class="text_display">${pr['clippings'].clip_abstract}</span><br/>
%if pr["outlet"]:
	<label class="label_1 label_tag label_align_r">Outlet</label><p>${pr['outlet'].outletname}</p><br/>
%else:
	%if pr["clippings"].authorname:
		<label class="label_1 label_tag label_align_r">Author Name</label><p>${pr['clippings'].authorname}</p><br/>
	%endif
%endif
<label class="label_1 label_tag label_align_r">Date</label><p class="content_width_1">${pr['clippings'].clip_source_date.strftime("%d/%m/%y")}</p><br/>
%if pr["clippings"].clippingstypeid:
<label class="label_1 label_tag label_align_r">Type</label><p class="content_width_1">${pr['clippingstype'].clippingstypedescription}</p><br/>
%endif
%if pr["clippings"].clippingstoneid:
<label class="label_1 label_tag label_align_r">Tone</label><p class="content_width_1">${pr['clippingstone'].clippingstonedescription}</p><br/>
%endif
%if pr["clippings"].clip_keywords:
<label class="label_1 label_tag label_align_r">Keywords</label><p class="content_width_1">${pr['clippings'].clip_keywords}</p><br/>
%endif
%if pr["clippings"].clientid:
<label class="label_1 label_tag label_align_r">%CLIENTNAME%</label><p class="content_width_1">${pr['client'].clientname}</p><br/>
%endif
%if pr["issues"]:
<label class="label_1 label_tag label_align_r">%ISSUENAME%</label><p>${pr['issues']}</p><br/>
%endif
<br/>
%if pr["clippings"].clippingsourceid == 1:
<label class="label_1 label_tag label_align_r">Page</label><p class="content_width_1">${pr['clippings'].clip_source_page}</p>
	<label class="label_1 label_tag label_align_r">Size (cm)</label><p class="content_width_1">${pr['clippings'].clip_article_size}</p>
	<label class="label_1 label_tag label_align_r">Words</label><p class="content_width_1">${pr['clippings'].clip_words}</p><br/>
<label class="label_1 label_tag label_align_r">Circulation</label><p class="content_width_1">${pr['clippings'].clip_circulation}</p>
	<label class="label_1 label_tag label_align_r">Readership</label><p class="content_width_1">${pr['clippings'].clip_readership}</p><br/>
	<label class="label_1 label_tag label_align_r">Rate</label><p class="content_width_1">${pr['clippings'].get_disrate()}</p><br/>
%endif
%if pr["outlet"]:
	%if pr["outlet"].mediaaccesstypeid == 1:
		%if pr["clippings"].has_link:
		<label class="label_1 label_tag label_align_r">Image</label><a target="_blank" href="${pr['clippings'].get_link()}"><i class="fa fa-eye fa-2x" aria-hidden="true"></i></a><br/>
		%endif
	%elif pr["mediaaccesstype"]:
		%if pr["clippings"].has_link:
			<label class="label_1 label_tag label_align_r">Image</label><a target="_blank" href="${pr['clippings'].get_link()}"><i class="fa fa-eye fa-2x" aria-hidden="true"></i></a><br/>
		%endif
	%else:
		<label class="label_1 label_tag label_align_r">Link</label><p>${pr['clippings'].get_link()}</p><br/>
	%endif
%else:
	%if pr["clippings"].has_link:
		<label class="label_1 label_tag label_align_r">Image</label><a target="_blank" href="${pr['clippings'].get_link()}"><i class="fa fa-eye fa-2x" aria-hidden="true"></i></a><br/>
	%endif
%endif
%if pr["analytics"]:
<h2 style="text-align:center">Analysis</h2>
%for row in pr["analytics"]:
	%if row.row_type == 2:
		<h2>${row.header}</h2>
	%else:
		<label class="label_2 label_tag label_align_r" style="margin:2px">${row.question.questiontext}</label>
		%if row.question.questiontypeid in (1,3,4,5):
			<p>${row.get_answer_display()}</p>
		%elif row.question.questiontypeid == 2:
				<p>${row.get_answer_display()}</p>
		%elif row.question.questiontypeid == 6:
			%for answer in row.answers:
				% if row.answers[0] != answer:
					<label class="label_2">&nbsp;</label>
				%endif
					<p>${row.get_answer_display(answer)}</p><br/>
			%endfor
		%endif
		<br/>
	%endif
%endfor
%endif
%if pr['clippings'].clip_text:
<h2>Clip Text</h2>
<p>${text_html(pr['clippings'].clip_text)}</p>
%endif
<br/><br/>
<label class="label_1 label_tag label_align_r">Source</label><p>${pr['clippingsource'].clippingsourcedescription}</p><br/>
<label class="label_1 label_tag label_align_r">Updated</label><p>${pr['updated']}</p><br/>
</span>
