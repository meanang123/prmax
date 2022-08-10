/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["prmax.display.startup.plugins.passwordrecovery"]){dojo._hasResource["prmax.display.startup.plugins.passwordrecovery"]=true;dojo.provide("prmax.display.startup.plugins.passwordrecovery");dojo.declare("prmax.display.startup.plugins.passwordrecovery",[ttl.BaseWidget],{widgetsInTemplate:true,templateString:"<div>\r\n\t<div data-dojo-type=\"dijit.Dialog\" data-dojo-attach-point=\"set_passwordrecovery_dialog\" data-dojo-props='title:\"Set Password Recovery\",style:\"width:450px;height:250px\"'>\r\n\t\t<div data-dojo-type=\"prcommon.recovery.passwordrecoverydetails\" data-dojo-attach-point=\"set_passwordrecovery_ctrl\"></div>\r\n\t</div>\r\n</div>\r\n",constructor:function(){},postCreate:function(){if(PRMAX.utils.settings.force_passwordrecovery){var _1="set";if(PRMAX.utils.settings.passwordrecovery){_1="update";}this.set_passwordrecovery_dialog.show();this.set_passwordrecovery_ctrl.load(this.set_passwordrecovery_dialog,true,_1);}this.inherited(arguments);}});}