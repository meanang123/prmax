call \Projects\tg15env\Scripts\activate.bat
SET PYTHONPATH=\Projects\prmax\development\prmax;\Projects\prmax\development\prcommon;\Projects\prmax\development\ttl
cd \Projects\prmax\development\prservices
\Projects\tg15env\Scripts\python \Projects\prmax\development\prservices\prservices\prappserver\prappserver.py --test
