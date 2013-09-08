require 'active_support/all' #bug in rubycas client requires this

module TWUtilization
  module CasHelpers

    CAS_CLIENT = CASClient::Client.new(
      :cas_base_url => "https://cas.thoughtworks.com/cas",
      :log => Logger.new(STDOUT),
      :ticket_store_config => {
        :storage_dir => "./tmp"
      })

    def need_authentication(request, session)
      return true unless session[:cas_ticket]
      request[:ticket] && session[:cas_ticket] != request[:ticket]
    end

    def process_cas_login(request, session)
      if request[:ticket] && request[:ticket] != session[:ticket]

        service_url = read_service_url(request)
        st = read_ticket(request[:ticket], service_url)

        CAS_CLIENT.validate_service_ticket(st)

        if st.success
          session[:cas_ticket] = st.ticket
          session[:cas_user] = st.user
        else
          raise "Service Ticket validation failed! #{st.failure_code} - #{st.failure_message}"
        end
      end

    end

    def logged_in?(request, session)
      session[:cas_ticket] && !session[:cas_ticket].empty?
    end

    def require_authorization(request, session)
      if !logged_in?(request, session)
        service_url = read_service_url(request)
        url = CAS_CLIENT.add_service_to_login_url(service_url)
        redirect url
      end
    end

    private
    def read_ticket(ticket_str, service_url)
      return nil unless ticket_str and !ticket_str.empty?

      if ticket_str =~ /^PT-/
        CASClient::ProxyTicket.new(ticket_str, service_url)
      else
        CASClient::ServiceTicket.new(ticket_str, service_url)
      end
    end

    def read_service_url(request)
      service_url = request.url.gsub(/\?.*/, "")
      if request.GET
        params = request.GET.dup
        params.delete(:ticket)
        if params
          [service_url, Rack::Utils.build_nested_query(params)].join('?')
        end
      end
      return service_url
    end
  end

  class Server < Sinatra::Base
    PUBLIC = File.join(root, "..", "..", "public")
    include CasHelpers
    extend CasHelpers

    use Rack::Session::Cookie, :secret => 'secret'
    use Rack::Static, :urls => %w(/common /dashboards /js /panels /partials /config.js), :root => PUBLIC
    use Rack::StreamingProxy do |request|
      path = request.path
      if path.start_with?("/es")
        session = request.session

        process_cas_login(request, session)
        "#{ENV['ELASTICSEARCH_URL']}/#{path.gsub('/es', '')}" if logged_in?(request, request.session)
      end
    end

    get '/' do
      process_cas_login(request, session) and redirect('/') if params[:ticket]
      require_authorization(request, session) unless logged_in?(request, session)

      File.read(File.join(PUBLIC, "index.html"))
    end

    get '/upload' do
      haml :upload
    end

    post '/upload' do
      Importer.import_from params[:file][:tempfile]
      redirect '/'
    end

    get '/delete' do
      raise "Need query params" unless params.present?
      Tire.delete('kibana-int'){|q| q.string params.map{|k,v| "#{k}:#{v}"}.join(" AND" ) }.to_s
    end
  end
end
