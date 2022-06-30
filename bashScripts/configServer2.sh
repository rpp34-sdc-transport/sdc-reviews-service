export NVM_DIR=$HOME/.nvm;
source $NVM_DIR/nvm.sh;
nvm install 16.15.1
node -e "console.log('Running Node.js ' + process.version)"
npm install pm2@latest -g
pm2 start server/server.js
sudo env PATH=$PATH:/home/ubuntu/.nvm/versions/node/v16.15.1/bin /home/ubuntu/.nvm/versions/node/v16.15.1/lib/node_modules/pm2/bin/pm2 startup systemd -u ubuntu --hp /home/ubuntu
pm2 save
pm2 status