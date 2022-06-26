sudo apt-get update
sudo apt-get upgrade -y
git config --global alias.ci commit
git config --global alias.st status
sudo apt-get install -y nginx
sudo apt install net-tools    # For Networking tools

# The the /etc/nginx/sites-available/default must be modified with upstream servers and location settings
