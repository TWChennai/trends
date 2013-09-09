require "./lib/tw_utilization"
require 'fileutils'

run TWUtilization::Server

FileUtils.touch('/tmp/app-initialized')
