# ./redeploy.sh
rm -rf /u/_docker/arpas_nginx_html/react-geo-app/
mkdir /u/_docker/arpas_nginx_html/react-geo-app/
cp -vR ./build/* /u/_docker/arpas_nginx_html/react-geo-app/

echo 
echo passo 1 - login  192.168.24.70
echo passo 2 - ./app_nginx

ssh 192.168.24.70
