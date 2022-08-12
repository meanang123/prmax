//>>built
require({cache:{"url:research/translations/templates/subjects.html":"<div>\r\n\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"top\",style:\"height:44px;width:100%;overflow:hidden\"'>\r\n\t\t<div data-dojo-type=\"dijit/Toolbar\" data-dojo-props='style:\"float:left;height:99%;width:100%;padding:0px;margin:0px\"'>\r\n\t\t\t<div data-dojo-attach-event=\"onClick:_new_subject_mapping\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='iconClass:\"PRMaxCommonStdIcon PRMaxAddIcon\"'><span>Add Mapping</span></div>\r\n\t\t\t<div data-dojo-attach-event=\"onClick:_refresh\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='iconClass:\"PRMaxCommonStdIcon PRMaxRefreshIcon\"'><span>Refresh</span></div>\r\n\t\t</div>\r\n\t</div>\r\n\t<div data-dojo-attach-point=\"grid_view\" data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"center\"'></div>\r\n\t<div data-dojo-attach-point=\"link_dlg\" data-dojo-type=\"dijit/Dialog\" data-dojo-props='title:\"Subject to Keyword\"'>\r\n\t\t<form data-dojo-attach-point=\"form\" data-dojo-type=\"dijit/form/Form\" data-dojo-props='onsubmit:\"return false;\",\"class\":\"prmaxdefault\"' >\r\n\t\t\t<input data-dojo-props='type:\"hidden\",value:\"-1\",name:\"subjectid\"' data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"subjectid\"/>\r\n\t\t\t<table width=\"500px\" class=\"prmaxtable\" cellpadding=\"0\" cellspacing=\"0\"  border =\"0\">\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" width=\"80px\">Subject</td><td  data-dojo-attach-point=\"heading\" class=\"prmaxrowdisplaylarge\" colspan=\"2\" ></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" >Keyword</td><td ><select data-dojo-attach-point=\"interestid\" data-dojo-type =\"dijit/form/FilteringSelect\" data-dojo-props='name:\"interestid\",searchAttr:\"interestname\",labelType:\"html\",style:\"width:98%\",\"class\":\"prmaxrequired\"'/></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" colspan=\"2\"><button data-dojo-type=\"dijit/form/Button\" data-dojo-props='type:\"button\",name:\"submit\",label:\"Update\"' data-dojo-attach-event=\"onClick:_update_subject\" ></button></td></tr>\r\n\t\t\t</table>\r\n\t\t</form>\r\n\t</div>\r\n\t<div data-dojo-attach-point=\"add_link_dlg\" data-dojo-type=\"dijit/Dialog\" data-dojo-props='title:\"Add Subject and Keyword\"'>\r\n\t\t<form data-dojo-attach-point=\"form2\" data-dojo-type=\"dijit/form/Form\" data-dojo-props='onsubmit:\"return false;\",\"class\":\"prmaxdefault\"' >\r\n\t\t\t<table width=\"300px\" class=\"prmaxtable\" cellpadding=\"1\" cellspacing=\"1\"  border =\"0\">\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" width=\"80px\">Subject</td><td ><input data-dojo-attach-point=\"subjectname2\" data-dojo-props='style:\"width:95%\",name:\"subjectname\",type:\"text\",required:true' data-dojo-type=\"dijit/form/ValidationTextBox\"></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" >Keyword</td><td ><select data-dojo-attach-point=\"interestid2\" data-dojo-type =\"dijit/form/FilteringSelect\" data-dojo-props='name:\"interestid\",searchAttr:\"interestname\",labelType:\"html\",style:\"width:98%\",\"class\":\"prmaxrequired\"'/>\r\n\t\t\t\t<tr><td align=\"right\" colspan=\"2\"><button data-dojo-type=\"dijit/form/Button\" data-dojo-props='type:\"button\",name:\"submit\",label:\"Add\"' data-dojo-attach-event=\"onClick:_add_subject\" ></button></td></tr>\r\n\t\t\t</table>\r\n\t\t</form>\r\n\t</div>\r\n</div>\r\n"}});define("research/translations/subjects",["dojo/_base/declare","ttl/BaseWidgetAMD","dojo/text!../translations/templates/subjects.html","dijit/layout/BorderContainer","ttl/grid/Grid","ttl/store/JsonRest","dojo/store/Observable","dojo/request","ttl/utilities2","dojo/json","dojo/topic","dojo/_base/lang","dojo/dom-attr","dojo/dom-class","dojox/data/JsonRestStore","dijit/layout/ContentPane","dijit/Toolbar","dijit/Dialog","dijit/form/Form","dijit/form/TextBox","dijit/form/FilteringSelect","dijit/form/ValidationTextBox"],function(_1,_2,_3,_4,_5,_6,_7,_8,_9,_a,_b,_c,_d,_e,_f){return _1("research.translations.subjects",[_2,_4],{templateString:_3,gutters:false,constructor:function(){this.model=new _7(new _6({target:"/research/admin/subjects/list",idProperty:"subjectid"}));this._store=new _f({target:"/research/admin/interests/list",idProperty:"interestid"});this._add_subject_call_back=_c.hitch(this,this._add_subject_call);this._delete_subject_call_back=_c.hitch(this,this._delete_subject_call);this._update_subject_call_back=_c.hitch(this,this._update_subject_call);},postCreate:function(){var _10=[{label:"Subject",className:"standard",field:"subjectname"},{label:"Interest",className:"standard",field:"interestname"},{label:" ",field:"delete",className:"grid-field-image-view",formatter:_9.delete_row_ctrl},];this.grid=new _5({columns:_10,selectionMode:"single",store:this.model,query:{}});this.grid_view.set("content",this.grid);this.grid.on(" .dgrid-cell:click",_c.hitch(this,this._on_cell_call));this.interestid2.set("store",this._store);this.interestid.set("store",this._store);this.inherited(arguments);},_on_cell_call:function(e){var _11=this.grid.cell(e);if(_11==null){return;}if(_11.column.field=="delete"){if(confirm("Delete Subject")){_8.post("/research/admin/subjects/delete_subject",_9.make_params({data:{subjectid:_11.row.data.subjectid}})).then(this._delete_subject_call_back);}}else{_d.set(this.heading,"innerHTML",_11.row.data.subjectname);this.interestid.set("value",_11.row.data.interestid);this.subjectid.set("value",_11.row.data.subjectid);this.link_dlg.show();}},_delete_subject_call:function(_12){if(_12.success=="OK"){this.model.remove(_12.subjectid);alert("Subject Deleted");}else{alert("Problem Deleting Subject");}},_new_subject_mapping:function(){this._add_clear();this.add_link_dlg.show();},_refresh:function(){this.grid.set("query",{});},_update_subject:function(){if(_9.form_validator(this.form)==false){alert("Not all required fields filled in");throw "N";}if(confirm("Update Subject Interest Mapping")){_8.post("/research/admin/subjects/add_mapping",_9.make_params({data:this.form.get("value")})).then(this._update_subject_call_back);}},_update_subject_call:function(_13){if(_13.success=="OK"){alert("Updated");this.model.put(_13.data);this.link_dlg.hide();}else{alert("Problem Updating Mapping");}},_add_subject:function(){if(_9.form_validator(this.form2)==false){alert("Not all required fields filled in");throw "N";}if(confirm("Add Subject Interest Mapping")){_8.post("/research/admin/subjects/add_mapping",_9.make_params({data:this.form2.get("value")})).then(this._add_subject_call_back);}},_add_subject_call:function(_14){if(_14.success=="OK"){alert("Updated");this.model.put(_14.data);this.add_link_dlg.hide();this._add_clear();}else{if(_14.success=="DU"){alert("Subject Exists");this.subjectname2.focus();}else{alert("Problem Adding Mapping");}}},_add_clear:function(){this.subjectname2.set("value","");this.interestid2.set("value",null);}});});