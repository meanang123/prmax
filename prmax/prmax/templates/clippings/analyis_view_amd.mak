<span class="common_prmax_layout">
<form data-dojo-props='onsubmit:"return false",id:"form_clip_${clippingid}"' data-dojo-type="dijit/form/Form">
	<input data-dojo-props='type:"hidden",value:"${clippingid}",name:"clippingid"' data-dojo-type="dijit/form/TextBox" />
% for row in analytics:
%if row.row_type == 2:
<h1>${row.header}</h1>
%else:
<label class="label_tag label_size_2" style="margin:2px;text-align:right">${row.question.questiontext}&nbsp;</label>
%if row.question.questiontypeid == 1:
	<input data-dojo-props='name:"an_${row.def_analysis.clippingsanalysistemplateid}",type:"checkbox",checked:"${row.get_answer()}",style:"margin:2px"' data-dojo-type="dijit/form/CheckBox"/>
%elif row.question.questiontypeid == 2:
%for answer in row.answers:
% if row.answers[0] != answer:
<label class="label_tag label_size_2">&nbsp;</label>
%endif
<label class="label_tag label_size_2"><input data-dojo-props='name:"an_${row.def_analysis.clippingsanalysistemplateid}",type:"radio",checked:"${row.get_answer(answer)}",value:"${answer.questionanswerid}"' data-dojo-type="dijit/form/RadioButton"/> ${answer.answertext}</label>
% if row.answers[-1] != answer:
<br/>
%endif
%endfor
%elif row.question.questiontypeid == 3:
	<input data-dojo-props='name:"an_${row.def_analysis.clippingsanalysistemplateid}",type:"text",maxlength:80,trim:true,style:"width:16em;margin:2px",value:"${row.get_answer()}"' data-dojo-type="dijit/form/ValidationTextBox"/>
%elif row.question.questiontypeid == 4:
	<input data-dojo-props='name:"an_${row.def_analysis.clippingsanalysistemplateid}",type:"text",trim:true,style:"width:6em;margin:2px",value:"${row.get_answer()}"' data-dojo-type="dijit/form/NumberTextBox"/>
%elif row.question.questiontypeid == 5:
	<input data-dojo-props='name:"an_${row.def_analysis.clippingsanalysistemplateid}",type:"text",trim:true,style:"width:6em;margin:2px",value:"${row.get_answer()}"' data-dojo-type="dijit/form/CurrencyTextBox"/>
%elif row.question.questiontypeid == 6:
%for answer in row.answers:
% if row.answers[0] != answer:
<label class="label_tag label_size_2">&nbsp;</label>
%endif
<label class="label_tag label_size_2"><input data-dojo-props='name:"an_${row.def_analysis.clippingsanalysistemplateid}:${answer.questionanswerid}",type:"checkbox",checked:"${row.get_answer(answer)}"' data-dojo-type="dijit/form/CheckBox"/> ${answer.answertext}</label><br/>
%endfor
%endif
<br/>
%endif
%endfor
</form>
</span>

