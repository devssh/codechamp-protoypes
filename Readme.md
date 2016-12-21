## Instructions to setup code champ application on your Mac ##

* Open Terminal
* Signin as root user by using
```
    sudo -i
```
* Clone the git repository in the Webserver's root directory 
```
cd /Library/WebServer/Documents
git clone <link to code-champ repository>
mv codechamp_prototypes Codechamp
```
## Configuring your apache server ##
* Take a backup of your existing httpd.conf file by using the command
```
cp /etc/apache2/httpd.conf /etc/apache2/httpd.conf.backup
```
**Note : This is only to be on the safer side 

* Copy replace the httpd.conf file in /etc/apache2/httpd.conf with the configuration file present in the repository
```
cp Codechamp/httpd.conf /etc/apache2/httpd.conf 
```
** The httpd.conf file in Codechamp repository has configuration to enable CGI scripts on Apache server and the it points to the /cgi-bin to Codechamp/cgi-scripts

* Now restart your apache server using 
```
apachectl restart
```

*** 
Now check in the browser if the the application is running to do this

* Open browser 
* Go to : http://localhost/Codechamp/code_viz.html
    You should now be able to view the application :-)

***
To be able to clone the repository from next time without using sudo just change the ownership of the Codechamp repository

** Please remember that the codechamp repository will be present at /Library/Webserver/Codechamp
```
sudo chown -R <your user-name> /Library/Webserver/Documents/Codechamp
```
** To know your user-name you can use the below command
```
whoami
```
