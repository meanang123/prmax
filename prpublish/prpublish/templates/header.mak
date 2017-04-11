<%
from datetime import date
%>

<div class="main-header">
    <div class="top-bar">
        <div class="content-width">
            <a class="logo" href="/"></a>
            <a class="twitter float-right" target="_blank" href="https://twitter.com/PRnewslink"></a>
            <div class="date float-right"><script> document.write(new Date().toDateString()); </script></div>
        </div>
    </div>
    <div class="content-width">
        <div class="prmax-link">a service from <a href="https://www.prmax.co.uk/" target="_blank"></a></div>
        <div class="main-title">The essential journalist news source</div>
        <div class="search-bar">
            <form action="/search" method="post" target="_parent">
                <button class="prmax-btn dark-btn latest-news"><a href="/" title="Latest News">Latest News</a></button>
                <div class="search-menu-bar">
                    <div class="float-right">
                        <input type="text" class="default-input search" placeholder="Search" name="search" id="search">
                        <button class="detailed-search prmax-btn light-btn"><a href="/searchmodal">More</a></button>
                        <div class="menu-trigger"> <span>Categories</span>
                            <div class="menu-categories">
                                <div><%include file="categories.mak"/></div>
                            </div>
                        </div>
                    </div>                
                </div>
            </form>
            <div class="clear-fix"></div>
        </div>
    </div>    
<div>
