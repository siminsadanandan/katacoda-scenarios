curl -fsSL https://deb.nodesource.com/setup_current.x | sudo -E bash - &&\
sudo apt-get install -y nodejs

# cd ~
# curl -sL https://deb.nodesource.com/setup_14.x -o /tmp/nodesource_setup.sh


npm -g install element-cli

sudo apt install -y chromium-browser


element init my-element-project

sudo element run --mu my-element-project.perf.ts
