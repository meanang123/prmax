from pr_reports.listing_pdf import ListingPDF
from pr_reports.pdf_fields import *


if __name__=='__main__':
    
    # delete the pdf file if present
    import os
    pdf='listing1.pdf'
    try:
        os.remove(pdf)
    except:
        pass
    
    # run the demo code
    
    #load the rows with a few headers
    rows=[]
    #for i in xrange(5):
    #    s='Round %d (Station Road, Harpenden)' % (i+1)
    #    row=(rwGROUP_HEADER,s,)  
    #    rows.append(row)
             
    #    for j in xrange(6):
    #        row=(rwHEADING,'01','Mike Kinton','49 Dalkeith Road',12.3)  
    #        rows.append(row)
    #        row=(rwHEADING,'02','Tim Couper','18 Netherfield Road',6.2)
    #        rows.append(row)
    #        row=(rwHEADING,'03','Tim Couper-Smithers-Bumblebee-qwerty','18 Netherfield Road, XXXXXXXXXXXXXXXXXX High Street, LongestEverYouCanImagineLane',6)
    #        rows.append(row)
    #    row=(rwSUBTOTAL,s+ ' subtotal','','',24.5)
    #    rows.append(row)
    
    rows.append((rwNORMAL,1,'Mike Kinton','49 Dalkeith Road',12.3))    
    rows.append((rwNORMALBACKGROUND,1,'Mike Kinton','49 Dalkeith Road',12.3))    
    rows.append((rwNORMAL,1,'Mike Kinton','49 Dalkeith Road',12.3))    
    rows.append((rwNORMALBACKGROUND,1,'Mike Kinton','49 Dalkeith Road',12.3))    
    # define the col_info and page_header:  
    col_info={
              'headers':[
                          ('','A Name','A Address','A'),
                          ('Seq','Customer Name','Address','Amount'),
                        ],
              'widths': (1,8,8,0),
              'ctypes':(ctNUMBER, ctSTRING,ctSTRING,ctAMOUNT),
             }
    # -headers can only take only tuple/list
    # -last value of widths can be any number - the system will fit the last col to 
    # so the report is the page width
    # -ctype values are defined in pdf_base.py         
    
    page_header={'shop_name':'My Own Shop',
                 'report_id':'124 v23',
                 'report_name':'This Report',
                 'report_date':'01 Jan 2005'
        }   
            
    # create the listing
    lis=ListingPDF(page_header,col_info,rows)
    # write the pdf
    lis.write(pdf)
    
    # launch the pdf 
    os.system(pdf)
