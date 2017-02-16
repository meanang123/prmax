call \Projects\tg15env\Scripts\activate.bat
SET PYTHONPATH=\Projects\prmaxtest\prmax;\Projects\prmaxtest\prcommon;\Projects\ttl
cd \Projects\prmaxtest\prservices
\Projects\tg15env\Scripts\python \Projects\prmaxtest\prservices\prservices\prappserver\prappserver.py --test
