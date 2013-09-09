require 'csv'
require 'date'

module TWUtilization
  class Importer

    class <<self
      def import_from(file)
        csv = CSV.read(file, :headers => true, :encoding => 'windows-1251:utf-8')
        create_index
        csv.each do |row|
          next if row["Name"].blank? # Reject all blank rows
          save(row)
        end
      end

      def create_index
        index.create :mappings => {
          :utilization => {
            :properties => {
              :Name => { :type => 'string', :index => :not_analyzed },
              :WeekEndingDt => { :type => 'string', :index => :not_analyzed },
              :WeekEndingTimestamp => { :type => 'date', :format => 'date_time' },
              :Role => { :type => 'string', :index => :not_analyzed },
              :Grade => { :type => 'string', :index => :not_analyzed }
            }
          }
        }
      end

      def delete_all
        index.delete
      end

      private
      def save(row)
        index.import explode(row)
      rescue => e
        p "Failed for #{row} with #{e.inspect}"
      end

      def explode(row)
        row = row.to_hash
        row.delete(nil)
        row_to_save = row.each_with_object({}) { |(key, value), obj| obj[key.gsub(" ", "")] = value }
        date = parse_date(row_to_save["WeekEndingDt"])
        row_to_save["WeekEndingTimestamp"] = date.to_time.utc.strftime("%FT%T.000Z")
        row_to_save["WeekEndingDt"] = date.strftime "%Y-%m-%d"
        row_to_save["type"] = "utilization"

        rows = []
        rows += row_to_save["Billable"].to_i.times.map { row_to_save.merge :billable_type => "Billable" }
        rows += row_to_save["TWNonbillable"].to_i.times.map { row_to_save.merge :billable_type => "ThoughtworksNonBillable" }
        rows += row_to_save["ClientNonbillable"].to_i.times.map { row_to_save.merge :billable_type => "ClientNonBillable" }
        rows
      end

      def index
        Tire::Index.new('kibana-int')
      end

      def parse_date(date)
        DateTime.strptime(date, "%d/%m/%y")
      rescue ArgumentError => e
        if date.to_i > 35000  # Handle weird excel date format
          DateTime.parse("1900-01-01") - 2 + date.to_i
        else
          raise e
        end
      end
    end
  end
end
