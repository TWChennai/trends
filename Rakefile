require './lib/tw_utilization'

desc "Import from csv"
task :import, :file_path do |t, args|
  file_path = args[:file_path]
  TWUtilization::Importer.import_from file_path
end


desc "Delete all from elasticsearch"
task :delete_all do
  TWUtilization::Importer.delete_all
end
