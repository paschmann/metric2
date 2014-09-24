#!/usr/bin/python
import dbapi
import smtplib
from datetime import datetime
from email.mime.text import MIMEText

try:
con = dbapi.connect('localhost',30015, '<HANAUSERNAME>', '<HANAPASSWORD>')
cur = con.cursor()
cur.execute('select * from metric2.m2_outgoing_email WHERE sent is not null')
email = cur.fetchall()
s = smtplib.SMTP('smtp.1and1.com', 587)
s.login('<SMTPUSERNAME>', '<SMTPPASSWORD>')

for item in email:
     msg = MIMEText(item[4])
     msg['Subject'] = item[3]
     msg['From'] = item[2]
     msg['To'] = item[1]
     s.sendmail(item[2], item[1], msg.as_string())
     strSQL = "UPDATE metric2.m2_outgoing_email SET sent = '" + str(datetime.now()) + "' WHERE id = " + str(item[0])
     cur.execute(strSQL)
except Exception, error:
     print str(error)
finally:
s.close()

