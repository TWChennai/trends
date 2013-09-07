require 'csv'
require 'date'

module TWUtilization
  class Importer

    def self.import_from(file)
      csv = CSV.read(file, :headers => true, :encoding => 'windows-1251:utf-8')
      create_index
      csv.each do |row|
        save(row)
      end
    end

    def self.save(row)
      row_to_save = row.to_hash.each_with_object({}) { |(key, value), obj| obj[key.gsub(" ", "")] = value }
      row_to_save["WeekEndingTimestamp"] = DateTime.strptime(row_to_save["WeekEndingDt"], "%d/%m/%y").to_time.to_i * 1000
      row_to_save["type"] = "utilization"

      rows = []
      rows += row_to_save["Billable"].to_i.times.map { row_to_save.merge :billable_type => "Billable" }
      rows += row_to_save["TWNonbillable"].to_i.times.map { row_to_save.merge :billable_type => "ThoughtworksNonBillable" }
      rows += row_to_save["ClientNonbillable"].to_i.times.map { row_to_save.merge :billable_type => "ClientNonBillable" }
      index.import rows
    rescue => e
      p "Failed for #{row} with #{e.inspect}"
    end

    def self.create_index
      index.create :mappings => {
        :utilization => {
          :properties => {
            :Name => { :type => 'string', :index => :not_analyzed },
            :WeekEndingDt => { :type => 'string', :index => :not_analyzed },
            :Role => { :type => 'string', :index => :not_analyzed },
            :Grade => { :type => 'string', :index => :not_analyzed }
          }
        }
      }
    end

    def self.index
      Tire::Index.new('kibana-int')
    end

    def self.delete_all
      index.delete
    end
  end
end
