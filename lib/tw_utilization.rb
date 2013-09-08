require 'rubygems'
require 'bundler'

Bundler.require

ENV['ELASTICSEARCH_URL'] ||= "http://localhost:9200"

require_relative 'tw_utilization/importer'
require_relative 'tw_utilization/server'
