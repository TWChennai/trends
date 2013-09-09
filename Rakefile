require './lib/tw_utilization'

desc "Import from csv"
task :import, :file_path do |t, args|
  file_path = args[:file_path]
  TWUtilization::Importer.import_from file_path
end

desc "Import all csv files matching the pattern"
task :import_all_files, :pattern do |t, args|
  pattern = args[:pattern]
  files = Dir.glob pattern
  puts "Importing #{files.size} files.."

  files.each do |f|
    TWUtilization::Importer.import_from f
    puts "Completed #{f}"
  end
end

desc "Delete all from elasticsearch"
task :delete_all do
  TWUtilization::Importer.delete_all
end
