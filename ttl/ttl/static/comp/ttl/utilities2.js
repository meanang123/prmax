//-----------------------------------------------------------------------------
// Name:    utilities2.js
// Author:  Chris Hoy
// Purpose: Common function what would be used by any dojo based web site
// Created: 01/05/2012
//
// To do:
//
//-----------------------------------------------------------------------------

define(["dojo/_base/declare",
	"dojo/number",
	"dojo/_base/lang",
	"dojo/_base/array"],
function(declare, number, lang, array)
{
	  tmp = declare("ttl.utilities2",null,{});

		ttl.utilities2.generic_view = function(inDatum) {
				if ( inDatum == null )
					return "...";

			if ( inDatum )
				return '<img src="/prcommon/images/view.png" alt="view" width="16" height="16" style="padding:0px;margin:0px"/>';

			return "";
		};

		ttl.utilities2.delete_icon = function(inDatum) {
				if ( inDatum == null )
					return "...";

				return '<img title="'+ inDatum+'" height="10px" width="10px" style="padding:0x;margin:0px" src="/prcommon/images/delete.gif"></img>';
		};

		ttl.utilities2.delete_icon_row = function(inDatum) {
				return '<img height="10px" width="10px" style="padding:0x;margin:0px" src="/prcommon/images/delete.gif"></img>';
		};


		ttl.utilities2.edit_icon = function(inDatum) {
				if ( inDatum == null )
					return "...";

				return '<img title="' + inDatum + '" height="10px" width="10px" style="padding:0x;margin:0px" src="/prcommon/images/edit.gif"></img>';
		};

		ttl.utilities2.row_button_small = function(inDatum) {
				if ( inDatum == null )
					return "...";

				return '<img height="10px" width="10px" style="padding:0x;margin:0px" src="/prcommon/images/rowctrl.gif"></img>';
		};

		ttl.utilities2.format_row_ctrl = function(inDatum) {
			return '<img title="Options" height="14px" width="14px" style="padding:0x;margin:0px" src="/prcommon/images/rowctrl.gif"></img>';
		};

		ttl.utilities2.delete_row_ctrl = function(inDatum) {
				return '<img title="Delete" height="14px" width="14px" style="padding:0x;margin:0px" src="/prcommon/images/remove.gif"></img>';
		};

		ttl.utilities2.edit_row_ctrl = function(inDatum) {
				return '<img title="' + inDatum + '" height="14px" width="14px" style="padding:0x;margin:0px" src="/prcommon/images/edit.gif"></img>';
		};

		ttl.utilities2.pdf_icon_row = function(inDatum) {
				if ( inDatum == null )
					return "...";
				return '<img height="10px" width="10px" style="padding:0x;margin:0px" src="/prcommon/images/pdf.gif" alt="view"></img>';
		};

		ttl.utilities2.check_cell = function(inDatum)
		{
			var image_name = inDatum==true? 'checked.gif':'unchecked.gif';
			return '<img  height="10px" width="10px" style="padding:0x;margin:0px" src="/prcommon/images/'+ image_name +'" ></img>';
		}

		ttl.utilities2.format_deleted_ctrl = function(inDatum)
		{
			if ( inDatum == 2 )
				return '<img height="10px" width="10px" style="padding:0x;margin:0px" src="/prcommon/images/delete.gif"></img>';
			else
				return "&nbsp;";
		}

		ttl.utilities2.outlet_type = function(inDatum)
		{
			if (inDatum == null ) return "...";

			var color = "";

			switch ( inDatum )
			{
				case 'national':
					color="blue";
					break;
				case 'regional':
					color="green";
					break;
				case 'business':
					color="yellow";
					break;
				case 'consumer':
					color="orange";
					break;
				case 'television':
					color="purple";
					break;
				case 'radio':
					color="black";
					break;
				case 'internet':
					color="pink";
					break;
				case 'news':
					color="indigo";
					break;
				case 'others':
					color="white";
					break;
				case 'freelance':
					color="white";
					break;
				case 'parliamentary':
					color="gray";
					break;
			}
			return "<div style='background-color:"+color + ";width:6px;height:100%'>&nbsp;</div>";
		}

		ttl.utilities2.form_validator = function(form)
		{
			var actForm = null;
				return array.every(form.getChildren(),
				function(widget)
				{
					// ignore disabled ones
					if (widget.get("disabled")==true )
						return true;

					var rest = !widget.isValid || widget.isValid();
					if ( rest == false )
					{
						if (widget.isFocusable())
						{
							try{
								// if hidden this will throw an error
								widget.focus();
							} catch(e) {}
						}
						else
							rest = true ;
					}
					return rest;
				});
		};

		ttl.utilities2.to_json_date = function( inDate)
		{
			if ( inDate == null )
				return "";
			else
				return inDate.getFullYear() + "-" + (inDate.getMonth() + 1 )  + "-" + inDate.getDate();
		};

		ttl.utilities2.error_checker=function(response)
		{
			var security_failed = false;
			try
			{
				if ( response.status==403)
					security_failed =true;
			}
			catch(a) { }

			if (security_failed)
			{
				window.location.href = TTL.login_page || "/login";
				throw "Security Failure";
			}
		};

		ttl.utilities2.xhr_post_error=function(response, ioArgs)
		{
			ttl.utilities2.error_checker(response);

			// no message
			if (TTL.isDebug==false) return;

			try
			{
				alert("Problem with call to server :\nstatus: "+response.status + "\nmessage :" + response.message+ "\nresponseText :" + response.responseText);
			}
				catch (e)
			{
				alert("Problem with call to server\n"+response);
			}
		};


		ttl.utilities2.default_params = {
			preventCache:true,
			timeout:30000,
			handleAs: 'json',
			url: "/error"
		};

		ttl.utilities2.make_params = function(inParams)
		{
			var res = lang.mixin(
				{
					preventCache:true,
					timeout:30000,
					handleAs: 'json',
					url: "/error"
				}	,
				inParams || {}
			);
			if ( inParams.error == null )
				res["error"] = ttl.utilities2.xhr_post_error;
			return res;
		};

		ttl.utilities2.make_params_ignore = function(inParams)
		{
			var res = lang.mixin(
				ttl.utilities2.default_params,
				inParams || {}
			);
			res["error"] = ttl.utilities2.globalerrorchecker;
			return res;
		};

		ttl.utilities2.get_prevent_cache=function(inparams)
		{
			var tmp_date = new Date().valueOf();

			return lang.mixin({"dojo.preventCache": tmp_date},
				inparams || {});
		}

		ttl.utilities2.get_prevent_cache_param=function()
		{
			var tmp_date = new Date().valueOf();

			return "dojo.preventcache=" + tmp_date ;
		}

		ttl.utilities2.from_object_date = function( inDate )
		{
			if ( inDate == null || inDate === "")
				return new Date();
			else
			{
				return new Date ( new Date(inDate.year, inDate.month-1, inDate.day));
			}
		}

		ttl.utilities2.from_object_date_no_date = function( inDate )
		{
			if ( inDate == null || inDate === "")
				return null;
			else
			{
				return new Date ( new Date(inDate.year, inDate.month-1, inDate.day));
			}
		}


		ttl.utilities2.display_money = function(inDatum)
		{
			if (isNaN(inDatum))	{	return '...'}
			else
			{
				try	{
					return number.format (parseFloat ( inDatum ), {places:2});
				}
				catch ( e ){
					return "0.00"
				}
			}
		}

		ttl.utilities2.display_int_money = function(inDatum)
		{
			if (isNaN(inDatum)) { return '...'}
			else
			{
				try	{
					return number.format (parseFloat ( inDatum )/100.00, {places:2});
				}
				catch ( e ){
					return "0.00"
				}
			}
		};

		ttl.utilities2.document_exists = function(inDatum) {
			if ( inDatum == null )
				return "...";
		
			if ( inDatum == true )
						return "<img src='/prcommon/images/pdf.gif' width='16' height='16' style='padding:0px;margin:0px'/>";
		
			return "";
		};

		ttl.utilities2.fonticon = function(inDatum) {
			if (inDatum == null ) return "...";

			var font_icon = "";
			var font_title = "";

			switch ( inDatum )
			{
				case 'News':
					font_icon="fa fa-newspaper-o";
					font_title="News";
					break;
				case 'Twitter':
					font_icon="fa fa-twitter-square";
					break;
				case 'Facebook':
					font_icon="fa fa-facebook-square";
					break;
				case 'Forums':
					font_icon="fa fa-forumbee";
					break;
				case 'Blogs':
					font_icon="fa fa-bold";
					break;
				case 'Instagram':
					font_icon="fa fa-instagram";
					break;
				case 'YouTube':
					font_icon="fa fa-youtube-square";
					break;
				case 'GooglePlus':
					font_icon="fa fa-google-plus-official";
					break;
				case 'Tumblr':
					font_icon="fa fa-tumblr-square";
					break;
				case 'VKontakte':
					font_icon="fa fa-check-square";
					break;
				case 'Chat':
					font_icon="fa fa-weixin";
					break;
			}
			return '<i class=" fa-fw ' + font_icon + '" title="' + font_title +'" aria-hidden="true"></i>';
		};

		ttl.utilities2.fonticon2 = function(inDatum) {
			if (inDatum == null ) return "...";

			return '<i class=" fa ' + inDatum + '" aria-hidden="true"></i>';
		};

		ttl.utilities2.format_row_icon = function()
		{
			return '<i class=" fa fa-bars aria-hidden="true"></i>';
		};


		ttl.utilities2.EMPTYGRID = {data_mode:"EMPTYGRID"};

		ttl.utilities2.range = function(start, end)
		{
			var total = [];

			if (!end)
			{
				end = start;
        start = 0;
			}

			for (var i = start; i < end; i += 1)
			{
			    total.push(i);
			}

			return total;
		};

		return tmp;
});


