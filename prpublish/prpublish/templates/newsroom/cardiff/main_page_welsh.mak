<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">
<head>
<%include file="../../header_common.mak"/>
<meta name="description" content=""></meta>
<meta name="keywords" content=""></meta>
<%include file="../../header_google.mak"/>
</head>
<body class="cardiff">
<div id="fb-root"></div>
<script>(function(d, s, id) {
var js, fjs = d.getElementsByTagName(s)[0];
if (d.getElementById(id)) return;
js = d.createElement(s); js.id = id;
js.src = "//connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v2.9";
fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));</script>
<script>
var ssiSocialTrackingCode = '081ef02f8d4a40f2';
</script>
<script>
	!function(s,e){s._ssiAsyncQueue=[],s._ssiAddBeacon=function(e){s._ssiAsyncQueue.push({methodName:"_ssiAddBeacon",args:[e,(new Date).getTime()]})},s._ssiLinkCustomer=function(e){s._ssiAsyncQueue.push({methodName:"_ssiLinkCustomer",args:[e,(new Date).getTime()]})},s._ssiLoginCustomer=function(e){s._ssiAsyncQueue.push({methodName:"_ssiLoginCustomer",args:[e,(new Date).getTime()]})},s._ssiLogPurchase=function(e){s._ssiAsyncQueue.push({methodName:"_ssiLogPurchase",args:[e,(new Date).getTime()]})};var n=e.createElement("script");n.async=1,n.src="https://app.socialsignin.net/assets/v2/js/social-tracking.js";var t=e.getElementsByTagName("script")[0];t.parentNode.insertBefore(n,t)}(window,document);
</script>

<%include file="default_header_welsh.mak"/>
<div class="content-width">
	<div class="news-content-cardiff">
		<p class="content-title" align="center">Diweddaraf Datganiadau</p>
		<div class="single-news-text">
			% if not results:
				<div class="empty" >Ni chafwyd canlyniadau</div>
			% else:
				% for result in results:
					%if result['seoimageid']:
						<img style="float:left;margin:0px 20px 10px 0px;" alt="Image" src="${'/releases/images?imageid=%d' % result['seoimageid']}" height="${result['height']}px" width="${result['width']}px"></img>
					%else:
						<img style="float:left" alt="No Image" src="/static/images/noimage.gif" height="100px" width="100px"></img>
					%endif
					<div class="news-title-newsroom">${result['published_display2']} - <a href="${result['link']}">${result['headline']}</a></div>
					<div class="newsroom-synopsis">${result['synopsis'].replace("\n"," ").replace("  "," ")}</div>
				% endfor
			%endif
		</div><br/><br/>

		<div class="single-news-links">
			<p class="socialmedia-title">Trydar diweddaraf</p>
			<div class="latest-tweets">
				<a class="twitter-timeline" href="https://twitter.com/cyngorcaerdydd">Tweets by cardiffcouncil</a>
				<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>
			</div>

			<p class="socialmedia-title">Facebook</p>
			<div class="facebook">
				<div class="fb-page" data-href="https://www.facebook.com/cardiff.council1/" data-tabs="timeline" data-small-header="false" data-adapt-container-width="true" data-hide-cover="false" data-show-facepile="true">
					<blockquote cite="https://www.facebook.com/cardiff.council1/" class="fb-xfbml-parse-ignore">
						<a href="https://www.facebook.com/cardiff.council1/">The City of Cardiff Council / Cyngor Dinas Caerdydd</a>
					</blockquote>
				</div>
			</div>
		</div>
		<div class="load-more-cardiff">
			<%namespace file="resulttrail_welsh.mak" import="create_trail"/>
			${create_trail( resultcount, criteria, offset)}
		</div>
	</div>
	<img src="/static/images/RedCityscape.jpg" height="150px" width="990px"></img>
</div>
</body></html>
