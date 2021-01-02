import { apiRequest } from './request';

export interface AppPreferences {
  locale: string; // 	Currently selected language (e.g. en_GB for English)
  create_subfolder_enabled: boolean; // 	True if a subfolder should be created when adding a torrent
  start_paused_enabled: boolean; // 	True if torrents should be added in a Paused state
  auto_delete_mode: number; // 	TODO
  preallocate_all: boolean; // 	True if disk space should be pre-allocated for all files
  incomplete_files_ext: boolean; // 	True if ".!qB" should be appended to incomplete files
  auto_tmm_enabled: boolean; // 	True if Automatic Torrent Management is enabled by default
  torrent_changed_tmm_enabled: boolean; // 	True if torrent should be relocated when its Category changes
  save_path_changed_tmm_enabled: boolean; // 	True if torrent should be relocated when the default save path changes
  category_changed_tmm_enabled: boolean; // 	True if torrent should be relocated when its Category's save path changes
  save_path: string; // 	Default save path for torrents, separated by slashes
  temp_path_enabled: boolean; // 	True if folder for incomplete torrents is enabled
  temp_path: string; // 	Path for incomplete torrents, separated by slashes
  scan_dirs: object; // 	Property: directory to watch for torrent files, value: where torrents loaded from this directory should be downloaded to (see list of possible values below). Slashes are used as path separators; multiple key/value pairs can be specified
  export_dir: string; // 	Path to directory to copy .torrent files to. Slashes are used as path separators
  export_dir_fin: string; // 	Path to directory to copy .torrent files of completed downloads to. Slashes are used as path separators
  mail_notification_enabled: boolean; // 	True if e-mail notification should be enabled
  mail_notification_sender: string; // 	e-mail where notifications should originate from
  mail_notification_email: string; // 	e-mail to send notifications to
  mail_notification_smtp: string; // 	smtp server for e-mail notifications
  mail_notification_ssl_enabled: boolean; // 	True if smtp server requires SSL connection
  mail_notification_auth_enabled: boolean; // 	True if smtp server requires authentication
  mail_notification_username: string; // 	Username for smtp authentication
  mail_notification_password: string; // 	Password for smtp authentication
  autorun_enabled: boolean; // 	True if external program should be run after torrent has finished downloading
  autorun_program: string; // 	Program path/name/arguments to run if autorun_enabled is enabled; path is separated by slashes; you can use %f and %n arguments, which will be expanded by qBittorent as path_to_torrent_file and torrent_name (from the GUI; not the .torrent file name) respectively
  queueing_enabled: boolean; // 	True if torrent queuing is enabled
  max_active_downloads: number; // 	Maximum number of active simultaneous downloads
  max_active_torrents: number; // 	Maximum number of active simultaneous downloads and uploads
  max_active_uploads: number; // 	Maximum number of active simultaneous uploads
  dont_count_slow_torrents: boolean; // 	If true torrents w/o any activity (stalled ones) will not be counted towards max_active_* limits; see dont_count_slow_torrents for more information
  slow_torrent_dl_rate_threshold: number; // 	Download rate in KiB/s for a torrent to be considered "slow"
  slow_torrent_ul_rate_threshold: number; // 	Upload rate in KiB/s for a torrent to be considered "slow"
  slow_torrent_inactive_timer: number; // 	Seconds a torrent should be inactive before considered "slow"
  max_ratio_enabled: boolean; // 	True if share ratio limit is enabled
  max_ratio: number; // 	Get the global share ratio limit
  max_ratio_act: boolean; // 	Action performed when a torrent reaches the maximum share ratio. See list of possible values here below.
  listen_port: number; // 	Port for incoming connections
  upnp: boolean; // 	True if UPnP/NAT-PMP is enabled
  random_port: boolean; // 	True if the port is randomly selected
  dl_limit: number; // 	Global download speed limit in KiB/s; -1 means no limit is applied
  up_limit: number; // 	Global upload speed limit in KiB/s; -1 means no limit is applied
  max_connec: number; // 	Maximum global number of simultaneous connections
  max_connec_per_torrent: number; // 	Maximum number of simultaneous connections per torrent
  max_uploads: number; // 	Maximum number of upload slots
  max_uploads_per_torrent: number; // 	Maximum number of upload slots per torrent
  stop_tracker_timeout: number; // 	Timeout in seconds for a stopped announce request to trackers
  enable_piece_extent_affinity: boolean; // 	True if the advanced libtorrent option piece_extent_affinity is enabled
  bittorrent_protocol: number; // 	Bittorrent Protocol to use (see list of possible values below)
  limit_utp_rate: boolean; // 	True if [du]l_limit should be applied to uTP connections; this option is only available in qBittorent built against libtorrent version 0.16.X and higher
  limit_tcp_overhead: boolean; // 	True if [du]l_limit should be applied to estimated TCP overhead (service data: e.g. packet headers)
  limit_lan_peers: boolean; // 	True if [du]l_limit should be applied to peers on the LAN
  alt_dl_limit: number; // 	Alternative global download speed limit in KiB/s
  alt_up_limit: number; // 	Alternative global upload speed limit in KiB/s
  scheduler_enabled: boolean; // 	True if alternative limits should be applied according to schedule
  schedule_from_hour: number; // 	Scheduler starting hour
  schedule_from_min: number; // 	Scheduler starting minute
  schedule_to_hour: number; // 	Scheduler ending hour
  schedule_to_min: number; // 	Scheduler ending minute
  scheduler_days: number; // 	Scheduler days. See possible values here below
  dht: boolean; // 	True if DHT is enabled
  pex: boolean; // 	True if PeX is enabled
  lsd: boolean; // 	True if LSD is enabled
  encryption: number; // 	See list of possible values here below
  anonymous_mode: boolean; // 	If true anonymous mode will be enabled; read more here; this option is only available in qBittorent built against libtorrent version 0.16.X and higher
  proxy_type: number; // 	See list of possible values here below
  proxy_ip: string; // 	Proxy IP address or domain name
  proxy_port: number; // 	Proxy port
  proxy_peer_connections: boolean; // 	True if peer and web seed connections should be proxified; this option will have any effect only in qBittorent built against libtorrent version 0.16.X and higher
  proxy_auth_enabled: boolean; // 	True proxy requires authentication; doesn't apply to SOCKS4 proxies
  proxy_username: string; // 	Username for proxy authentication
  proxy_password: string; // 	Password for proxy authentication
  proxy_torrents_only: boolean; // 	True if proxy is only used for torrents
  ip_filter_enabled: boolean; // 	True if external IP filter should be enabled
  ip_filter_path: string; // 	Path to IP filter file (.dat, .p2p, .p2b files are supported); path is separated by slashes
  ip_filter_trackers: boolean; // 	True if IP filters are applied to trackers
  web_ui_domain_list: string; // 	Comma-separated list of domains to accept when performing Host header validation
  web_ui_address: string; // 	IP address to use for the WebUI
  web_ui_port: number; // 	WebUI port
  web_ui_upnp: boolean; // 	True if UPnP is used for the WebUI port
  web_ui_username: string; // 	WebUI username
  web_ui_password: string; // 	For API ≥ v2.3.0: Plaintext WebUI password, not readable, write-only. For API < v2.3.0: MD5 hash of WebUI password, hash is generated from the following string: username:Web UI Access:plain_text_web_ui_password
  web_ui_csrf_protection_enabled: boolean; // 	True if WebUI CSRF protection is enabled
  web_ui_clickjacking_protection_enabled: boolean; // 	True if WebUI clickjacking protection is enabled
  web_ui_secure_cookie_enabled: boolean; // 	True if WebUI cookie Secure flag is enabled
  web_ui_max_auth_fail_count: number; // 	Maximum number of authentication failures before WebUI access ban
  web_ui_ban_duration: number; // 	WebUI access ban duration in seconds
  web_ui_session_timeout: number; // 	Seconds until WebUI is automatically signed off
  web_ui_host_header_validation_enabled: boolean; // 	True if WebUI host header validation is enabled
  bypass_local_auth: boolean; // 	True if authentication challenge for loopback address (127.0.0.1) should be disabled
  bypass_auth_subnet_whitelist_enabled: boolean; // 	True if webui authentication should be bypassed for clients whose ip resides within (at least) one of the subnets on the whitelist
  bypass_auth_subnet_whitelist: string; // 	(White)list of ipv4/ipv6 subnets for which webui authentication should be bypassed; list entries are separated by commas
  alternative_webui_enabled: boolean; // 	True if an alternative WebUI should be used
  alternative_webui_path: string; // 	File path to the alternative WebUI
  use_https: boolean; // 	True if WebUI HTTPS access is enabled
  ssl_key: string; // 	For API < v2.0.1: SSL keyfile contents (this is a not a path)
  ssl_cert: string; // 	For API < v2.0.1: SSL certificate contents (this is a not a path)
  web_ui_https_key_path: string; // 	For API ≥ v2.0.1: Path to SSL keyfile
  web_ui_https_cert_path: string; // 	For API ≥ v2.0.1: Path to SSL certificate
  dyndns_enabled: boolean; // 	True if server DNS should be updated dynamically
  dyndns_service: number; // 	See list of possible values here below
  dyndns_username: string; // 	Username for DDNS service
  dyndns_password: string; // 	Password for DDNS service
  dyndns_domain: string; // 	Your DDNS domain name
  rss_refresh_interval: number; // 	RSS refresh interval
  rss_max_articles_per_feed: number; // 	Max stored articles per RSS feed
  rss_processing_enabled: boolean; // 	Enable processing of RSS feeds
  rss_auto_downloading_enabled: boolean; // 	Enable auto-downloading of torrents from the RSS feeds
  rss_download_repack_proper_episodes: boolean; // 	For API ≥ v2.5.1: Enable downloading of repack/proper Episodes
  rss_smart_episode_filters: string; // 	For API ≥ v2.5.1: List of RSS Smart Episode Filters
  add_trackers_enabled: boolean; // 	Enable automatic adding of trackers to new torrents
  add_trackers: string; // 	List of trackers to add to new torrent
  web_ui_use_custom_http_headers_enabled: boolean; // 	For API ≥ v2.5.1: Enable custom http headers
  web_ui_custom_http_headers: string; // 	For API ≥ v2.5.1: List of custom http headers
  max_seeding_time_enabled: boolean; // 	True enables max seeding time
  max_seeding_time: number; // 	Number of minutes to seed a torrent
  announce_ip: string; // 	TODO
  announce_to_all_tiers: boolean; // 	True always announce to all tiers
  announce_to_all_trackers: boolean; // 	True always announce to all trackers in a tier
  async_io_threads: number; // 	Number of asynchronous I/O threads
  banned_IPs: string; // 	List of banned IPs
  checking_memory_use: number; // 	Outstanding memory when checking torrents in MiB
  current_interface_address: string; // 	IP Address to bind to. Empty String means All addresses
  current_network_interface: string; // 	Network Interface used
  disk_cache: number; // 	Disk cache used in MiB
  disk_cache_ttl: number; // 	Disk cache expiry interval in seconds
  embedded_tracker_port: number; // 	Port used for embedded tracker
  enable_coalesce_read_write: boolean; // 	True enables coalesce reads & writes
  enable_embedded_tracker: boolean; // 	True enables embedded tracker
  enable_multi_connections_from_same_ip: boolean; // 	True allows multiple connections from the same IP address
  enable_os_cache: boolean; // 	True enables os cache
  enable_upload_suggestions: boolean; // 	True enables sending of upload piece suggestions
  file_pool_size: number; // 	File pool size
  outgoing_ports_max: number; // 	Maximal outgoing port (0: Disabled)
  outgoing_ports_min: number; // 	Minimal outgoing port (0: Disabled)
  recheck_completed_torrents: boolean; // 	True rechecks torrents on completion
  resolve_peer_countries: boolean; // 	True resolves peer countries
  save_resume_data_interval: number; // 	Save resume data interval in min
  send_buffer_low_watermark: number; // 	Send buffer low watermark in KiB
  send_buffer_watermark: number; // 	Send buffer watermark in KiB
  send_buffer_watermark_factor: number; // 	Send buffer watermark factor in percent
  socket_backlog_size: number; // 	Socket backlog size
  upload_choking_algorithm: number; // 	Upload choking algorithm used (see list of possible values below)
  upload_slots_behavior: number; // 	Upload slots behavior used (see list of possible values below)
  upnp_lease_duration: number; // 	UPnP lease duration (0: Permanent lease)
  utp_tcp_mixed_mode: number; // 	μTP-TCP mixed mode algorithm (see list of possible values below)
}

export const apiV2AppPreferences = () => apiRequest<AppPreferences>(`/api/v2/app/preferences`);
