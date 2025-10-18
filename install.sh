#!/bin/bash

# ===================================
# OfficeOps Platform Auto Installer
# Version: 2.3.0
# Platform: Linux/Unix
# ===================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="OfficeOps Platform"
APP_VERSION="2.3.0"
INSTALL_DIR="/opt/officeops"
SERVICE_USER="officeops"
FRONTEND_PORT=4028
BACKEND_PORT=3001
DB_NAME="officeops"
DB_USER="officeops_user"

# Installation options
INSTALL_DOCKER=true
INSTALL_NGINX=true
INSTALL_DATABASE=true
INSTALL_SSL=false
DEVELOPMENT_MODE=false

# System detection
detect_system() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        if [ -f /etc/os-release ]; then
            . /etc/os-release
            OS=$NAME
            OS_VERSION=$VERSION_ID
        fi
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        OS="macOS"
        OS_VERSION=$(sw_vers -productVersion)
    else
        echo -e "${RED}❌ Unsupported operating system: $OSTYPE${NC}"
        exit 1
    fi
    
    echo -e "${BLUE}🖥️  Detected OS: $OS $OS_VERSION${NC}"
}

# Print banner
print_banner() {
    clear
    echo -e "${PURPLE}"
    echo "╔══════════════════════════════════════════════════════════════════╗"
    echo "║                                                                  ║"
    echo "║              OfficeOps Platform Auto Installer                   ║"
    echo "║                        Version 2.3.0                            ║"
    echo "║                                                                  ║"
    echo "║  🚀 Production-Ready Enterprise Management Platform              ║"
    echo "║  ✅ Complete Risk Assessment System                              ║"
    echo "║  ✅ Full Asset Management CRUD                                   ║"
    echo "║  ✅ User & Profile Management                                    ║"
    echo "║                                                                  ║"
    echo "╚══════════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    echo
}

# Check if running as root
check_root() {
    if [[ $EUID -eq 0 ]]; then
        echo -e "${YELLOW}⚠️  Running as root. This is recommended for system-wide installation.${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️  Not running as root. Some features may require sudo privileges.${NC}"
        return 1
    fi
}

# Parse command line arguments
parse_args() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            --dev|--development)
                DEVELOPMENT_MODE=true
                echo -e "${BLUE}🔧 Development mode enabled${NC}"
                shift
                ;;
            --no-docker)
                INSTALL_DOCKER=false
                echo -e "${YELLOW}⚠️  Docker installation disabled${NC}"
                shift
                ;;
            --no-nginx)
                INSTALL_NGINX=false
                echo -e "${YELLOW}⚠️  Nginx installation disabled${NC}"
                shift
                ;;
            --no-db)
                INSTALL_DATABASE=false
                echo -e "${YELLOW}⚠️  Database installation disabled${NC}"
                shift
                ;;
            --ssl)
                INSTALL_SSL=true
                echo -e "${GREEN}🔒 SSL configuration enabled${NC}"
                shift
                ;;
            --help|-h)
                show_help
                exit 0
                ;;
            *)
                echo -e "${RED}❌ Unknown option: $1${NC}"
                show_help
                exit 1
                ;;
        esac
    done
}

# Show help
show_help() {
    echo -e "${WHITE}Usage: $0 [OPTIONS]${NC}"
    echo
    echo -e "${WHITE}Options:${NC}"
    echo -e "  ${GREEN}--dev, --development${NC}    Install in development mode"
    echo -e "  ${GREEN}--no-docker${NC}            Skip Docker installation"
    echo -e "  ${GREEN}--no-nginx${NC}             Skip Nginx installation"
    echo -e "  ${GREEN}--no-db${NC}                Skip database installation"
    echo -e "  ${GREEN}--ssl${NC}                  Enable SSL configuration"
    echo -e "  ${GREEN}--help, -h${NC}             Show this help message"
    echo
}

# Log function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

# Error function
error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}" >&2
}

# Success function
success() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] ✅ $1${NC}"
}

# Check prerequisites
check_prerequisites() {
    log "🔍 Checking system prerequisites..."
    
    # Check for required commands
    local missing_commands=()
    
    if ! command -v curl &> /dev/null; then
        missing_commands+=("curl")
    fi
    
    if ! command -v wget &> /dev/null; then
        missing_commands+=("wget")
    fi
    
    if ! command -v git &> /dev/null; then
        missing_commands+=("git")
    fi
    
    if [[ ${#missing_commands[@]} -gt 0 ]]; then
        error "Missing required commands: ${missing_commands[*]}"
        log "Installing missing dependencies..."
        install_system_dependencies
    fi
    
    success "Prerequisites check completed"
}

# Install system dependencies
install_system_dependencies() {
    log "📦 Installing system dependencies..."
    
    if [[ "$OS" == *"Ubuntu"* ]] || [[ "$OS" == *"Debian"* ]]; then
        sudo apt-get update
        sudo apt-get install -y curl wget git build-essential software-properties-common apt-transport-https ca-certificates gnupg lsb-release
    elif [[ "$OS" == *"CentOS"* ]] || [[ "$OS" == *"Rocky"* ]] || [[ "$OS" == *"Red Hat"* ]]; then
        sudo yum update -y
        sudo yum groupinstall -y "Development Tools"
        sudo yum install -y curl wget git
    elif [[ "$OS" == *"Fedora"* ]]; then
        sudo dnf update -y
        sudo dnf groupinstall -y "Development Tools"
        sudo dnf install -y curl wget git
    elif [[ "$OS" == "macOS" ]]; then
        if ! command -v brew &> /dev/null; then
            log "Installing Homebrew..."
            /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
        fi
        brew update
        brew install curl wget git
    else
        error "Unsupported Linux distribution: $OS"
        exit 1
    fi
    
    success "System dependencies installed"
}

# Install Node.js
install_nodejs() {
    log "🟢 Installing Node.js..."
    
    if command -v node &> /dev/null; then
        local node_version=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
        if [[ $node_version -ge 18 ]]; then
            success "Node.js $node_version is already installed"
            return
        fi
    fi
    
    # Install Node.js using NodeSource repository
    if [[ "$OS" == *"Ubuntu"* ]] || [[ "$OS" == *"Debian"* ]]; then
        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
        sudo apt-get install -y nodejs
    elif [[ "$OS" == *"CentOS"* ]] || [[ "$OS" == *"Rocky"* ]] || [[ "$OS" == *"Red Hat"* ]]; then
        curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
        sudo yum install -y nodejs
    elif [[ "$OS" == *"Fedora"* ]]; then
        curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
        sudo dnf install -y nodejs
    elif [[ "$OS" == "macOS" ]]; then
        brew install node@18
    fi
    
    # Verify installation
    if command -v node &> /dev/null && command -v npm &> /dev/null; then
        success "Node.js $(node --version) and npm $(npm --version) installed successfully"
    else
        error "Failed to install Node.js"
        exit 1
    fi
}

# Install Docker
install_docker() {
    if [[ "$INSTALL_DOCKER" != true ]]; then
        log "⏭️  Skipping Docker installation"
        return
    fi
    
    log "🐳 Installing Docker..."
    
    if command -v docker &> /dev/null; then
        success "Docker is already installed"
        return
    fi
    
    if [[ "$OS" == *"Ubuntu"* ]] || [[ "$OS" == *"Debian"* ]]; then
        curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
        echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
        sudo apt-get update
        sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
    elif [[ "$OS" == *"CentOS"* ]] || [[ "$OS" == *"Rocky"* ]] || [[ "$OS" == *"Red Hat"* ]]; then
        sudo yum install -y yum-utils
        sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
        sudo yum install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
    elif [[ "$OS" == "macOS" ]]; then
        brew install --cask docker
        echo -e "${YELLOW}⚠️  Please start Docker Desktop manually${NC}"
    fi
    
    # Install Docker Compose if not available
    if ! command -v docker-compose &> /dev/null; then
        log "Installing Docker Compose..."
        sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
        sudo chmod +x /usr/local/bin/docker-compose
    fi
    
    # Start and enable Docker service
    if [[ "$OS" != "macOS" ]]; then
        sudo systemctl start docker
        sudo systemctl enable docker
        
        # Add current user to docker group
        sudo usermod -aG docker $USER
        log "Added $USER to docker group. You may need to log out and back in for this to take effect."
    fi
    
    success "Docker installed successfully"
}

# Install PostgreSQL
install_database() {
    if [[ "$INSTALL_DATABASE" != true ]]; then
        log "⏭️  Skipping database installation"
        return
    fi
    
    log "🗄️  Installing PostgreSQL..."
    
    if [[ "$OS" == *"Ubuntu"* ]] || [[ "$OS" == *"Debian"* ]]; then
        sudo apt-get install -y postgresql postgresql-contrib
    elif [[ "$OS" == *"CentOS"* ]] || [[ "$OS" == *"Rocky"* ]] || [[ "$OS" == *"Red Hat"* ]]; then
        sudo yum install -y postgresql postgresql-server postgresql-contrib
        sudo postgresql-setup initdb
    elif [[ "$OS" == *"Fedora"* ]]; then
        sudo dnf install -y postgresql postgresql-server postgresql-contrib
        sudo postgresql-setup --initdb
    elif [[ "$OS" == "macOS" ]]; then
        brew install postgresql
        brew services start postgresql
    fi
    
    # Start and enable PostgreSQL service
    if [[ "$OS" != "macOS" ]]; then
        sudo systemctl start postgresql
        sudo systemctl enable postgresql
    fi
    
    success "PostgreSQL installed successfully"
}

# Install Nginx
install_nginx() {
    if [[ "$INSTALL_NGINX" != true ]]; then
        log "⏭️  Skipping Nginx installation"
        return
    fi
    
    log "🌐 Installing Nginx..."
    
    if [[ "$OS" == *"Ubuntu"* ]] || [[ "$OS" == *"Debian"* ]]; then
        sudo apt-get install -y nginx
    elif [[ "$OS" == *"CentOS"* ]] || [[ "$OS" == *"Rocky"* ]] || [[ "$OS" == *"Red Hat"* ]]; then
        sudo yum install -y nginx
    elif [[ "$OS" == *"Fedora"* ]]; then
        sudo dnf install -y nginx
    elif [[ "$OS" == "macOS" ]]; then
        brew install nginx
    fi
    
    # Start and enable Nginx service
    if [[ "$OS" != "macOS" ]]; then
        sudo systemctl start nginx
        sudo systemctl enable nginx
    else
        brew services start nginx
    fi
    
    success "Nginx installed successfully"
}

# Create service user
create_service_user() {
    log "👤 Creating service user..."
    
    if id "$SERVICE_USER" &>/dev/null; then
        success "User $SERVICE_USER already exists"
    else
        sudo useradd -r -s /bin/false -d "$INSTALL_DIR" "$SERVICE_USER"
        success "Created service user: $SERVICE_USER"
    fi
}

# Download and setup application
setup_application() {
    log "📥 Setting up OfficeOps Platform..."
    
    # Create installation directory
    sudo mkdir -p "$INSTALL_DIR"
    sudo chown "$SERVICE_USER:$SERVICE_USER" "$INSTALL_DIR"
    
    # Clone or copy application files
    if [[ -d ".git" ]]; then
        log "Copying current repository to $INSTALL_DIR"
        sudo cp -r . "$INSTALL_DIR/"
    else
        log "Cloning OfficeOps Platform repository..."
        sudo git clone https://github.com/yourusername/officeops-platform.git "$INSTALL_DIR"
    fi
    
    # Set ownership
    sudo chown -R "$SERVICE_USER:$SERVICE_USER" "$INSTALL_DIR"
    
    # Install npm dependencies
    cd "$INSTALL_DIR"
    log "Installing Node.js dependencies..."
    sudo -u "$SERVICE_USER" npm ci --production
    
    success "Application setup completed"
}

# Configure environment
configure_environment() {
    log "⚙️  Configuring environment..."
    
    local env_file="$INSTALL_DIR/.env"
    
    if [[ ! -f "$env_file" ]]; then
        log "Creating environment configuration..."
        sudo -u "$SERVICE_USER" cp "$INSTALL_DIR/.env.example" "$env_file"
        
        # Generate random passwords and secrets
        local jwt_secret=$(openssl rand -hex 32)
        local session_secret=$(openssl rand -hex 32)
        local db_password=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
        
        # Update configuration
        sudo -u "$SERVICE_USER" sed -i "s|NODE_ENV=development|NODE_ENV=production|g" "$env_file"
        sudo -u "$SERVICE_USER" sed -i "s|APP_URL=http://localhost:4028|APP_URL=http://$(hostname -I | awk '{print $1}'):$FRONTEND_PORT|g" "$env_file"
        sudo -u "$SERVICE_USER" sed -i "s|JWT_SECRET=.*|JWT_SECRET=$jwt_secret|g" "$env_file"
        sudo -u "$SERVICE_USER" sed -i "s|SESSION_SECRET=.*|SESSION_SECRET=$session_secret|g" "$env_file"
        sudo -u "$SERVICE_USER" sed -i "s|DB_PASSWORD=.*|DB_PASSWORD=$db_password|g" "$env_file"
        # Align DB settings with installer defaults
        sudo -u "$SERVICE_USER" sed -i "s|DB_USER=.*|DB_USER=$DB_USER|g" "$env_file"
        sudo -u "$SERVICE_USER" sed -i "s|DATABASE_URL=.*|DATABASE_URL=postgresql://$DB_USER:$db_password@localhost:5432/$DB_NAME|g" "$env_file"
        
        if [[ "$DEVELOPMENT_MODE" == true ]]; then
            sudo -u "$SERVICE_USER" sed -i "s|NODE_ENV=production|NODE_ENV=development|g" "$env_file"
            sudo -u "$SERVICE_USER" sed -i "s|DEBUG=false|DEBUG=true|g" "$env_file"
        fi
        
        success "Environment configuration created"
    else
        success "Environment configuration already exists"
    fi
}

# Setup database
setup_database() {
    if [[ "$INSTALL_DATABASE" != true ]]; then
        log "⏭️  Skipping database setup"
        return
    fi
    
    log "🗄️  Setting up database..."
    
    # Read database password from .env file
    local db_password=$(grep "DB_PASSWORD=" "$INSTALL_DIR/.env" | cut -d'=' -f2)
    
    # Create database and user
    sudo -u postgres psql <<EOF
CREATE DATABASE $DB_NAME;
CREATE USER $DB_USER WITH ENCRYPTED PASSWORD '$db_password';
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
ALTER DATABASE $DB_NAME OWNER TO $DB_USER;
\q
EOF

    # Import schema and seed data if available
    if [[ -f "$INSTALL_DIR/database/init/01-init.sql" ]]; then
        log "📄 Importing PostgreSQL schema (01-init.sql)"
        sudo -u postgres psql -v ON_ERROR_STOP=1 -d "$DB_NAME" -f "$INSTALL_DIR/database/init/01-init.sql"
    else
        log "ℹ️  Skipping schema import: $INSTALL_DIR/database/init/01-init.sql not found"
    fi
    
    if [[ -f "$INSTALL_DIR/database/init/02-seed-data.sql" ]]; then
        log "🌱 Importing PostgreSQL seed data (02-seed-data.sql)"
        sudo -u postgres psql -v ON_ERROR_STOP=1 -d "$DB_NAME" -f "$INSTALL_DIR/database/init/02-seed-data.sql"
    else
        log "ℹ️  Skipping seed import: $INSTALL_DIR/database/init/02-seed-data.sql not found"
    fi
    
    success "Database setup completed with schema and seed data"
}

# Configure Nginx
configure_nginx() {
    if [[ "$INSTALL_NGINX" != true ]]; then
        log "⏭️  Skipping Nginx configuration"
        return
    fi
    
    log "🌐 Configuring Nginx..."
    
    local nginx_config="/etc/nginx/sites-available/officeops"
    local nginx_enabled="/etc/nginx/sites-enabled/officeops"
    
    sudo tee "$nginx_config" > /dev/null <<EOF
server {
    listen 80;
    server_name _;
    root $INSTALL_DIR/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Handle client-side routing
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # API proxy
    location /api {
        proxy_pass http://localhost:$BACKEND_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security: deny access to hidden files
    location ~ /\. {
        deny all;
    }
}
EOF
    
    # Enable the site
    sudo ln -sf "$nginx_config" "$nginx_enabled"
    
    # Remove default site
    sudo rm -f /etc/nginx/sites-enabled/default
    
    # Test and reload Nginx
    sudo nginx -t && sudo systemctl reload nginx
    
    success "Nginx configuration completed"
}

# Create systemd services
create_systemd_services() {
    log "🔧 Creating systemd services..."
    
    # Frontend service
    sudo tee /etc/systemd/system/officeops-frontend.service > /dev/null <<EOF
[Unit]
Description=OfficeOps Platform Frontend
After=network.target

[Service]
Type=simple
User=$SERVICE_USER
WorkingDirectory=$INSTALL_DIR
ExecStart=/usr/bin/npm run start
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=$FRONTEND_PORT

[Install]
WantedBy=multi-user.target
EOF
    
    # Backend service (if backend exists)
    if [[ -f "$INSTALL_DIR/server.js" ]] || [[ -d "$INSTALL_DIR/backend" ]]; then
        sudo tee /etc/systemd/system/officeops-backend.service > /dev/null <<EOF
[Unit]
Description=OfficeOps Platform Backend
After=network.target postgresql.service

[Service]
Type=simple
User=$SERVICE_USER
WorkingDirectory=$INSTALL_DIR
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=$BACKEND_PORT
EnvironmentFile=$INSTALL_DIR/.env

[Install]
WantedBy=multi-user.target
EOF
    fi
    
    # Reload systemd and enable services
    sudo systemctl daemon-reload
    sudo systemctl enable officeops-frontend
    
    if [[ -f /etc/systemd/system/officeops-backend.service ]]; then
        sudo systemctl enable officeops-backend
    fi
    
    success "Systemd services created"
}

# Build application
build_application() {
    log "🔨 Building application..."
    
    cd "$INSTALL_DIR"
    sudo -u "$SERVICE_USER" npm run build
    
    success "Application built successfully"
}

# Start services
start_services() {
    log "🚀 Starting services..."
    
    if [[ "$DEVELOPMENT_MODE" == true ]]; then
        log "Starting in development mode with Docker Compose..."
        cd "$INSTALL_DIR"
        sudo -u "$SERVICE_USER" docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --profile dev
    else
        # Start systemd services
        sudo systemctl start officeops-frontend
        if [[ -f /etc/systemd/system/officeops-backend.service ]]; then
            sudo systemctl start officeops-backend
        fi
    fi
    
    success "Services started successfully"
}

# Setup firewall
setup_firewall() {
    log "🔥 Configuring firewall..."
    
    if command -v ufw &> /dev/null; then
        sudo ufw allow 22/tcp
        sudo ufw allow 80/tcp
        sudo ufw allow 443/tcp
        sudo ufw allow $FRONTEND_PORT/tcp
        
        if [[ "$INSTALL_SSL" == true ]]; then
            sudo ufw allow 443/tcp
        fi
        
        sudo ufw --force enable
        success "UFW firewall configured"
    elif command -v firewall-cmd &> /dev/null; then
        sudo firewall-cmd --permanent --add-port=22/tcp
        sudo firewall-cmd --permanent --add-port=80/tcp
        sudo firewall-cmd --permanent --add-port=443/tcp
        sudo firewall-cmd --permanent --add-port=$FRONTEND_PORT/tcp
        sudo firewall-cmd --reload
        success "Firewalld configured"
    else
        log "⚠️  No supported firewall found. Please configure manually."
    fi
}

# Verify installation
verify_installation() {
    log "🔍 Verifying installation..."
    
    local errors=0
    local server_ip=$(hostname -I | awk '{print $1}')
    
    # Check if services are running
    if [[ "$DEVELOPMENT_MODE" != true ]]; then
        if ! systemctl is-active --quiet officeops-frontend; then
            error "Frontend service is not running"
            ((errors++))
        fi
    fi
    
    # Check if application is responding
    sleep 5
    if curl -f -s "http://localhost:$FRONTEND_PORT" > /dev/null; then
        success "Application is responding on port $FRONTEND_PORT"
    else
        error "Application is not responding on port $FRONTEND_PORT"
        ((errors++))
    fi
    
    # Check database connection (if installed)
    if [[ "$INSTALL_DATABASE" == true ]]; then
        if sudo -u postgres psql -d "$DB_NAME" -c "SELECT 1;" > /dev/null 2>&1; then
            success "Database connection verified"
        else
            error "Database connection failed"
            ((errors++))
        fi
    fi
    
    if [[ $errors -eq 0 ]]; then
        success "Installation verification completed successfully"
        return 0
    else
        error "Installation verification failed with $errors errors"
        return 1
    fi
}

# Show completion message
show_completion() {
    echo
    echo -e "${GREEN}🎉 OfficeOps Platform installation completed successfully!${NC}"
    echo
    echo -e "${WHITE}📋 Installation Summary:${NC}"
    echo -e "  ${CYAN}• Application Directory:${NC} $INSTALL_DIR"
    echo -e "  ${CYAN}• Service User:${NC} $SERVICE_USER"
    echo -e "  ${CYAN}• Frontend Port:${NC} $FRONTEND_PORT"
    echo -e "  ${CYAN}• Backend Port:${NC} $BACKEND_PORT"
    
    local server_ip=$(hostname -I | awk '{print $1}')
    echo
    echo -e "${WHITE}🌐 Access URLs:${NC}"
    echo -e "  ${GREEN}• Application:${NC} http://$server_ip:$FRONTEND_PORT"
    echo -e "  ${GREEN}• Local Access:${NC} http://localhost:$FRONTEND_PORT"
    
    if [[ "$INSTALL_NGINX" == true ]]; then
        echo -e "  ${GREEN}• Nginx Proxy:${NC} http://$server_ip"
    fi
    
    echo
    echo -e "${WHITE}👤 Demo Accounts:${NC}"
    echo -e "  ${GREEN}• Admin:${NC} admin@demo.com / admin123"
    echo -e "  ${GREEN}• ISO:${NC} iso@demo.com / iso123"
    echo -e "  ${GREEN}• Manager:${NC} manager@demo.com / mgr123"
    echo -e "  ${GREEN}• Employee:${NC} employee@demo.com / emp123"
    
    echo
    echo -e "${WHITE}🔧 Service Management:${NC}"
    if [[ "$DEVELOPMENT_MODE" == true ]]; then
        echo -e "  ${CYAN}• View Logs:${NC} docker-compose logs -f"
        echo -e "  ${CYAN}• Stop Services:${NC} docker-compose down"
        echo -e "  ${CYAN}• Start Services:${NC} docker-compose up -d"
    else
        echo -e "  ${CYAN}• Frontend Status:${NC} sudo systemctl status officeops-frontend"
        echo -e "  ${CYAN}• View Frontend Logs:${NC} sudo journalctl -u officeops-frontend -f"
        echo -e "  ${CYAN}• Restart Frontend:${NC} sudo systemctl restart officeops-frontend"
    fi
    
    echo
    echo -e "${WHITE}📚 Documentation:${NC}"
    echo -e "  ${CYAN}• README:${NC} $INSTALL_DIR/README.md"
    echo -e "  ${CYAN}• Configuration:${NC} $INSTALL_DIR/.env"
    echo
    echo -e "${GREEN}🚀 Your OfficeOps Platform is ready to use!${NC}"
    echo
}

# Cleanup function
cleanup() {
    if [[ $? -ne 0 ]]; then
        error "Installation failed. Check the logs above for details."
        echo -e "${YELLOW}💡 For support, please check the troubleshooting section in the README.md${NC}"
    fi
}

# Main installation function
main() {
    trap cleanup EXIT
    
    print_banner
    parse_args "$@"
    
    log "🚀 Starting OfficeOps Platform installation..."
    
    detect_system
    check_root
    check_prerequisites
    install_nodejs
    install_docker
    install_database
    install_nginx
    create_service_user
    setup_application
    configure_environment
    setup_database
    build_application
    configure_nginx
    
    if [[ "$DEVELOPMENT_MODE" != true ]]; then
        create_systemd_services
    fi
    
    start_services
    setup_firewall
    
    if verify_installation; then
        show_completion
    else
        error "Installation completed with errors. Please check the logs above."
        exit 1
    fi
}

# Run main function with all arguments
main "$@"
