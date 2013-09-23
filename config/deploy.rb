require 'bundler/capistrano'

set :application, "TW Vizualization"
set :repository,  "https://github.com/TWChennai/tw-utilization.git"
set :deploy_to, "/home/azureuser/apps/tw-utilization/"
set :normalize_asset_timestamps, false

set :user, "azureuser"
set :use_sudo, false

set :scm, :git

role :web, "viz.cloudapp.net"
role :app, "viz.cloudapp.net"

# if you want to clean up old releases on each deploy uncomment this:
after "deploy:restart", "deploy:cleanup"

namespace :deploy do
  task :start do
    run "cd #{current_path}; bundle exec rackup -D -P /tmp/tw-utilization.pid"
  end

  task :stop do
    run "if [ -f /tmp/tw-utilization.pid ]; then kill -9 `cat /tmp/tw-utilization.pid`; fi"
  end

  task :restart do
    stop
    start
  end
end
