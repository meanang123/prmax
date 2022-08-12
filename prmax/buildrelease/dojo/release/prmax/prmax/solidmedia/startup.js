/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["prmax.solidmedia.startup"]){dojo._hasResource["prmax.solidmedia.startup"]=true;dojo.provide("prmax.solidmedia.startup");dojo.require("ttl.BaseWidget");dojo.require("prmax.search.PersonSearch");dojo.require("prcommon.recovery.passwordrecoverydetails");dojo.declare("prmax.solidmedia.startup",[dijit._Widget,dijit._Templated,dijit._Container],{widgetsInTemplate:true,templateString:"<div>\r\n\t<div class=\"box_1\">\r\n\t\t<div class=\"btn_size2 btn_left people_frame\">\r\n\t\t\t<button data-dojo-attach-event=\"onClick:_people\" data-dojo-attach-point=\"peoplebtn\" data-dojo-type=\"dijit.form.Button\" data-dojo-props='type:\"button\",label:\"People\",\"class\":\"people btn_size\",iconClass:\"fa fa-group fa-4x\"'></button>\r\n\t\t</div>\r\n\t\t<div class=\"btn_size2 btn_left issue_frame \" >\r\n\t\t\t<button data-dojo-attach-event=\"onClick:_issues\" data-dojo-attach-point=\"issuesbtn\" data-dojo-type=\"dijit.form.Button\" data-dojo-props='type:\"button\",label:\"Issues\",\"class\":\"issues btn_size\",iconClass:\"fa fa-flag-o fa-4x\"'></button>\r\n\t\t</div>\r\n\t\t<div class=\"btn_size2 btn_left tasks_frame\" >\r\n\t\t\t<button data-dojo-attach-event=\"onClick:_tasks\" data-dojo-attach-point=\"tasksbtn\" data-dojo-type=\"dijit.form.Button\" data-dojo-props='type:\"button\",label:\"Tasks\",\"class\":\"tasks btn_size\",iconClass:\"fa fa-pencil-square-o fa-4x\"'></button><br/><br/>\r\n\t\t</div><br/>\r\n\r\n\t\t<div class=\"btn_size2 btn_left distribution_frame\" >\r\n\t\t\t<button data-dojo-attach-event=\"onClick:_distribution\" data-dojo-attach-point=\"distributionbtn\" data-dojo-type=\"dijit.form.Button\" data-dojo-props='type:\"button\",label:\"Distribution\",\"class\":\"distribution btn_size button btn_left\",iconClass:\"fa fa-share-alt fa-4x\"'></button>\r\n\t\t</div>\r\n\t\t<div class=\"btn_size2 btn_left coverage_frame\">\r\n\t\t\t<button data-dojo-attach-event=\"onClick:_coverage\" data-dojo-attach-point=\"coveragebtn\" data-dojo-type=\"dijit.form.Button\" data-dojo-props='type:\"button\",label:\"Coverage\",\"class\":\"coverage btn_size btn_left\",iconClass:\"fa fa-newspaper-o fa-4x\"'></button><br/>\r\n\t\t</div>\r\n\t</div>\r\n\t<div data-dojo-type=\"prmax.search.PersonSearch\" data-dojo-attach-point=\"person_search\" data-dojo-props='\"class\":\"person_search prmaxhidden\",style:\"background-color:#0F83CE\"'></div>\r\n\t<div data-dojo-type=\"dijit.Dialog\" data-dojo-attach-point=\"set_passwordrecovery_dialog\" data-dojo-props='title:\"Set Password Recovery\",style:\"width:450px;height:250px\"'>\r\n\t\t<div data-dojo-type=\"prcommon.recovery.passwordrecoverydetails\" data-dojo-attach-point=\"set_passwordrecovery_ctrl\"></div>\r\n\t</div>\r\n</div>\r\n\r\n",postCreate:function(){this.issuesbtn.set("label",PRMAX.utils.settings.issue_description);if(PRMAX.utils.settings.force_passwordrecovery){var _1="set";if(PRMAX.utils.settings.passwordrecovery){_1="update";}this.set_passwordrecovery_dialog.show();this.set_passwordrecovery_ctrl.load(this.set_passwordrecovery_dialog,true,_1);}this.inherited(arguments);},_issues:function(){dijit.byId("std_banner_control")._issues();},_people:function(){this.person_search.start_search();},_distribution:function(){dijit.byId("std_banner_control").ShowExistingPressRelease();},_coverage:function(){dijit.byId("std_banner_control").show_coverage();},_tasks:function(){dijit.byId("std_banner_control").show_tasks();}});}