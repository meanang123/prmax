<%
from datetime import date
%>

<div class="main-header-cardiff">
    <div class="top-bar-newsroom-cardiff">
        <div class="content-width">
            <span class="menu-boxes-first"><a href="https://www.cardiffnewsroom.co.uk/">English</a></span>
            <span class="menu-boxes"><a href="https://www.cardiff.gov.uk/CYM/Eich-Cyngor/Newyddion/Ein-Caerdydd/Pages/default.aspx" target="_blank">Ein Caerdydd</a></span>
            <span class="menu-boxes"><a href="http://cardifffilmoffice.co.uk/cymraeg/" target="_blank">Ffilmio yng Nghaerdydd</a></span>
            <span class="menu-boxes-last"><a href="https://www.newyddioncaerdydd.co.uk/contacts_welsh" target="_self">Cysylltu a ni</a></span>
            <span class="menu-boxes" align="right">
                <a class="rss float-right" target="_blank" href="https://www.newyddioncaerdydd.co.uk/rss_welsh.xml"></a>
                <a class="twitter float-right" target="_blank" href="https://twitter.com/cyngorcaerdydd"></a>
                <a class="facebook float-right" target="_blank" href="https://www.facebook.com/cardiff.council1/"></a>
            </span>
        </div>
    </div>

    <div><a href="https://www.newyddioncaerdydd.co.uk"><div class="second-top-bar-newsroom-welsh"></div></a></div>
    
    <div class="search-bar">
        <div class="content-width">
            <form action="/searchwelsh" method="post" target="_parent">
                <button class="prmax-cardiff-btn dark-cardiff-btn latest-news"><a href="/" title="Newyddion Diweddaraf"><span>Newyddion Diweddaraf</span></a></button>
                <div class="search-menu-bar">
                    <div class="float-right">
                        <input type="text" class="default-input search" placeholder="Chwilio" name="search" id="search">
                        <button class="detailed-search prmax-cardiff-btn dark-cardiff-btn"><a href="https://www.newyddioncaerdydd.co.uk/searchmodal_welsh">Mwy</a></button>
                        <div class="menu-trigger-cardiff"> <span>Categoriau</span>
                            <div class="menu-categories">
                                <div><%include file="categories_welsh.mak"/></div>
                            </div>
                        </div>
                    </div>                
                </div>
            </form>
        </div>
    </div>     
</div>

