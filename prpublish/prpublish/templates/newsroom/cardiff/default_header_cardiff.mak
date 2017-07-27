<%
from datetime import date
%>

<div class="main-header-cardiff">
    <div class="top-bar-newsroom-cardiff">
        <div class="content-width">
            <span class="menu-boxes-first"><a href="https://www.newyddioncaerdydd.co.uk">Cymraeg</a></span>
            <span class="menu-boxes"><a href="https://www.cardiff.gov.uk/ENG/Your-Council/News/In-Cardiff/Pages/default.aspx" target="_blank">In Cardiff</a></span>
            <span class="menu-boxes"><a href="http://cardifffilmoffice.co.uk/" target="_blank">Filming in Cardiff</a></span>
            <span class="menu-boxes-last"><a href="https://www.cardiffnewsroom.co.uk/contacts_cardiff" target="_self">Press Contacts</a></span>
            <span class="menu-boxes" align="right">
                <a class="twitter float-right" target="_blank" href="https://twitter.com/cardiffcouncil"></a>
                <a class="facebook float-right" target="_blank" href="https://www.facebook.com/cardiff.council1/"></a>
            </span>
        </div>
    </div>
    <div><a href="https://www.cardiffnewsroom.co.uk"><div class="second-top-bar-newsroom-cardiff"></div></a></div>

    <div class="search-bar">
        <div class="content-width">
            <form action="/searchcardiff" method="post" target="_parent">
                <button class="prmax-cardiff-btn dark-cardiff-btn latest-news"><a href="/" title="Latest News"><span>Latest news</span></a></button>
                <div class="search-menu-bar">
                    <div class="float-right">
                        <input type="text" class="default-input search" placeholder="Search" name="search" id="search">
                        <button class="detailed-search prmax-cardiff-btn dark-cardiff-btn"><a href="https://www.cardiffnewsroom.co.uk/searchmodal_cardiff">More</a></button>
                        <div class="menu-trigger-cardiff"> <span>Categories</span>
                            <div class="menu-categories">
                                <div><%include file="../../categories.mak"/></div>
                            </div>
                        </div>
                    </div>                
                </div>
            </form>
        </div>
    </div> 
    
</div>
