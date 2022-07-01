sudo apt-get update
sudo apt-get upgrade -y
git config --global alias.ci commit
git config --global alias.st status
sudo apt-get install -y nginx
sudo apt install net-tools    # For Networking tools
# The the /etc/nginx/sites-available/default must be modified with upstream servers and location settings

sudo curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash;
source ~/.bashrc
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
nvm install 16.15.1
node -e "console.log('Running Node.js ' + process.version)"
npm install pm2@latest -g
pm2 start server/initLoadBal.js
sudo env PATH=$PATH:/home/ubuntu/.nvm/versions/node/v16.15.1/bin /home/ubuntu/.nvm/versions/node/v16.15.1/lib/node_modules/pm2/bin/pm2 startup systemd -u ubuntu --hp /home/ubuntu
pm2 save
pm2 status