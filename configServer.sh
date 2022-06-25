sudo apt-get update
sudo apt-get upgrade -y
sudo apt-get install git
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
. ~/.nvm/nvm.sh
nvm install --lts
node -e "console.log('Running Node.js ' + process.version)"
git config --global alias.ci commit
git config --global alias.st status