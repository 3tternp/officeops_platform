#!/bin/bash

# ===================================
# OfficeOps Platform Health Check
# Version: 2.3.0
# Platform: Linux/Unix
# ===================================

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
FRONTEND_PORT=4028
BACKEND_PORT=3001
DB_NAME="officeops"
INSTALL_DIR="/opt/officeops"

# Health check results
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0
WARNING_CHECKS=0

# Log functions
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
    ((PASSED_CHECKS++))
}

error() {
    echo -e "${RED}❌ $1${NC}"
    ((FAILED_CHECKS++))
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    ((WARNING_CHECKS++))
}

info() {
    echo -e "${CYAN}ℹ️  $1${NC}"
}

# Print banner
print_banner() {
    clear
    echo -e "${PURPLE}"
    echo "╔══════════════════════════════════════════════════════════════════╗"
    echo "║                                                                  ║"
    echo "║              OfficeOps Platform Health Check                     ║"
    echo "║                        Version 2.3.0                            ║"
    echo "║                                                                  ║"
    echo "╚══════════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    echo
}

# Check system services
check_system_services() {
    log "🔍 Checking system services..."
    ((TOTAL_CHECKS++))
    
    # Check if systemd services are running
    if systemctl is-active --quiet officeops-frontend; then
        success "OfficeOps Frontend service is running"
    else
        if systemctl is-enabled --quiet officeops-frontend 2>/dev/null; then
            error "OfficeOps Frontend service is installed but not running"
        else
            warning "OfficeOps Frontend service is not installed (may be running via Docker)"
        fi
    fi
    
    if systemctl is-active --quiet officeops-backend 2>/dev/null; then
        success "OfficeOps Backend service is running"
    else
        warning "OfficeOps Backend service is not running (frontend-only deployment)"
    fi
}

# Check Docker containers
check_docker_containers() {
    log "🐳 Checking Docker containers..."
    ((TOTAL_CHECKS++))
    
    if command -v docker &> /dev/null; then
        local running_containers=$(docker ps --filter "name=officeops" --format "table {{.Names}}\t{{.Status}}" 2>/dev/null | grep -v NAMES)
        
        if [[ -n "$running_containers" ]]; then
            success "Docker containers are running:"
            echo "$running_containers" | while read line; do
                echo "    $line"
            done
        else
            warning "No OfficeOps Docker containers are running"
        fi
    else
        warning "Docker is not installed or not accessible"
    fi
}

# Check network connectivity
check_network() {
    log "🌐 Checking network connectivity..."
    ((TOTAL_CHECKS++))
    
    # Check frontend port
    if curl -f -s "http://localhost:$FRONTEND_PORT" > /dev/null; then
        success "Frontend is accessible on port $FRONTEND_PORT"
    else
        error "Frontend is not accessible on port $FRONTEND_PORT"
    fi
    
    ((TOTAL_CHECKS++))
    # Check backend port (if applicable)
    if curl -f -s "http://localhost:$BACKEND_PORT/health" > /dev/null 2>&1; then
        success "Backend is accessible on port $BACKEND_PORT"
    elif curl -f -s "http://localhost:$BACKEND_PORT" > /dev/null 2>&1; then
        warning "Backend is accessible on port $BACKEND_PORT but no /health endpoint"
    else
        warning "Backend is not accessible on port $BACKEND_PORT (frontend-only deployment)"
    fi
}

# Check database connectivity
check_database() {
    log "🗄️  Checking database connectivity..."
    ((TOTAL_CHECKS++))
    
    if command -v psql &> /dev/null; then
        if sudo -u postgres psql -d "$DB_NAME" -c "SELECT 1;" > /dev/null 2>&1; then
            success "PostgreSQL database connection successful"
        else
            error "Cannot connect to PostgreSQL database '$DB_NAME'"
        fi
    else
        warning "PostgreSQL client not found, skipping database check"
    fi
}

# Check file system
check_filesystem() {
    log "📁 Checking file system..."
    ((TOTAL_CHECKS++))
    
    if [[ -d "$INSTALL_DIR" ]]; then
        success "Installation directory exists: $INSTALL_DIR"
        
        # Check key files
        local required_files=("package.json" ".env" "dist/index.html")
        for file in "${required_files[@]}"; do
            ((TOTAL_CHECKS++))
            if [[ -f "$INSTALL_DIR/$file" ]]; then
                success "Required file exists: $file"
            else
                if [[ "$file" == "dist/index.html" ]]; then
                    error "Application not built: $file missing"
                else
                    error "Required file missing: $file"
                fi
            fi
        done
        
        # Check permissions
        ((TOTAL_CHECKS++))
        if [[ -r "$INSTALL_DIR" && -x "$INSTALL_DIR" ]]; then
            success "Installation directory has correct permissions"
        else
            error "Installation directory has incorrect permissions"
        fi
    else
        error "Installation directory not found: $INSTALL_DIR"
    fi
}

# Check system resources
check_resources() {
    log "💾 Checking system resources..."
    
    # Check memory usage
    ((TOTAL_CHECKS++))
    local mem_usage=$(free | grep Mem | awk '{printf "%.1f", $3/$2 * 100.0}')
    if (( $(echo "$mem_usage < 80" | bc -l) )); then
        success "Memory usage is healthy: ${mem_usage}%"
    elif (( $(echo "$mem_usage < 90" | bc -l) )); then
        warning "Memory usage is high: ${mem_usage}%"
    else
        error "Memory usage is critical: ${mem_usage}%"
    fi
    
    # Check disk space
    ((TOTAL_CHECKS++))
    local disk_usage=$(df "$INSTALL_DIR" | awk 'NR==2 {printf "%.1f", $5}' | sed 's/%//')
    if (( $(echo "$disk_usage < 80" | bc -l) )); then
        success "Disk usage is healthy: ${disk_usage}%"
    elif (( $(echo "$disk_usage < 90" | bc -l) )); then
        warning "Disk usage is high: ${disk_usage}%"
    else
        error "Disk usage is critical: ${disk_usage}%"
    fi
    
    # Check CPU load
    ((TOTAL_CHECKS++))
    local cpu_load=$(uptime | awk -F'load average:' '{ print $2 }' | cut -d, -f1 | sed 's/^[ \t]*//')
    local cpu_cores=$(nproc)
    local load_per_core=$(echo "scale=2; $cpu_load / $cpu_cores" | bc -l)
    
    if (( $(echo "$load_per_core < 0.7" | bc -l) )); then
        success "CPU load is healthy: $cpu_load (${load_per_core} per core)"
    elif (( $(echo "$load_per_core < 1.0" | bc -l) )); then
        warning "CPU load is moderate: $cpu_load (${load_per_core} per core)"
    else
        error "CPU load is high: $cpu_load (${load_per_core} per core)"
    fi
}

# Check log files
check_logs() {
    log "📋 Checking log files..."
    ((TOTAL_CHECKS++))
    
    local log_files=("/var/log/nginx/error.log" "/var/log/postgresql/postgresql-*.log")
    local errors_found=false
    
    for log_pattern in "${log_files[@]}"; do
        for log_file in $log_pattern; do
            if [[ -f "$log_file" ]]; then
                local recent_errors=$(tail -n 100 "$log_file" 2>/dev/null | grep -i error | wc -l)
                if [[ $recent_errors -gt 0 ]]; then
                    warning "Found $recent_errors recent errors in $log_file"
                    errors_found=true
                fi
            fi
        done
    done
    
    if [[ "$errors_found" == false ]]; then
        success "No recent errors found in system logs"
    fi
}

# Check security
check_security() {
    log "🔒 Checking security configuration..."
    ((TOTAL_CHECKS++))
    
    # Check firewall status
    if command -v ufw &> /dev/null; then
        if ufw status | grep -q "Status: active"; then
            success "UFW firewall is active"
        else
            warning "UFW firewall is not active"
        fi
    elif command -v firewall-cmd &> /dev/null; then
        if firewall-cmd --state 2>/dev/null | grep -q "running"; then
            success "Firewalld is running"
        else
            warning "Firewalld is not running"
        fi
    else
        warning "No supported firewall found"
    fi
    
    # Check for default passwords
    ((TOTAL_CHECKS++))
    if [[ -f "$INSTALL_DIR/.env" ]]; then
        if grep -q "your-super-secret-jwt-key" "$INSTALL_DIR/.env" 2>/dev/null; then
            error "Default JWT secret detected - please change it!"
        else
            success "JWT secret has been customized"
        fi
    fi
}

# Performance test
performance_test() {
    log "🚀 Running performance test..."
    ((TOTAL_CHECKS++))
    
    local start_time=$(date +%s%N)
    local response=$(curl -s -w "%{http_code},%{time_total}" "http://localhost:$FRONTEND_PORT" 2>/dev/null)
    local end_time=$(date +%s%N)
    
    if [[ -n "$response" ]]; then
        local http_code=$(echo "$response" | cut -d',' -f1 | tail -c 4)
        local response_time=$(echo "$response" | cut -d',' -f2)
        
        if [[ "$http_code" == "200" ]]; then
            local response_time_ms=$(echo "$response_time * 1000" | bc -l | cut -d'.' -f1)
            if [[ $response_time_ms -lt 1000 ]]; then
                success "Application response time: ${response_time_ms}ms"
            elif [[ $response_time_ms -lt 3000 ]]; then
                warning "Application response time is slow: ${response_time_ms}ms"
            else
                error "Application response time is very slow: ${response_time_ms}ms"
            fi
        else
            error "Application returned HTTP $http_code"
        fi
    else
        error "Failed to get application response"
    fi
}

# Check configuration
check_configuration() {
    log "⚙️  Checking configuration..."
    ((TOTAL_CHECKS++))
    
    if [[ -f "$INSTALL_DIR/.env" ]]; then
        success "Environment configuration file exists"
        
        # Check critical environment variables
        local critical_vars=("APP_NAME" "FRONTEND_PORT" "NODE_ENV")
        for var in "${critical_vars[@]}"; do
            ((TOTAL_CHECKS++))
            if grep -q "^$var=" "$INSTALL_DIR/.env"; then
                success "Environment variable $var is configured"
            else
                error "Environment variable $var is missing"
            fi
        done
    else
        error "Environment configuration file not found"
    fi
}

# Generate report
generate_report() {
    echo
    echo -e "${WHITE}╔══════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${WHITE}║                          HEALTH CHECK REPORT                     ║${NC}"
    echo -e "${WHITE}╚══════════════════════════════════════════════════════════════════╝${NC}"
    echo
    
    local server_ip=$(hostname -I | awk '{print $1}')
    echo -e "${WHITE}📋 System Information:${NC}"
    echo -e "  ${CYAN}• Server IP:${NC} $server_ip"
    echo -e "  ${CYAN}• Frontend URL:${NC} http://$server_ip:$FRONTEND_PORT"
    echo -e "  ${CYAN}• Installation Path:${NC} $INSTALL_DIR"
    echo -e "  ${CYAN}• Check Time:${NC} $(date)"
    echo
    
    echo -e "${WHITE}📊 Health Check Summary:${NC}"
    echo -e "  ${GREEN}• Passed:${NC} $PASSED_CHECKS"
    echo -e "  ${YELLOW}• Warnings:${NC} $WARNING_CHECKS"
    echo -e "  ${RED}• Failed:${NC} $FAILED_CHECKS"
    echo -e "  ${CYAN}• Total:${NC} $TOTAL_CHECKS"
    echo
    
    # Calculate health score
    local health_score=$(echo "scale=1; ($PASSED_CHECKS + $WARNING_CHECKS * 0.5) / $TOTAL_CHECKS * 100" | bc -l)
    
    echo -e "${WHITE}💯 Overall Health Score:${NC}"
    if (( $(echo "$health_score >= 90" | bc -l) )); then
        echo -e "  ${GREEN}$health_score% - Excellent${NC}"
    elif (( $(echo "$health_score >= 80" | bc -l) )); then
        echo -e "  ${YELLOW}$health_score% - Good${NC}"
    elif (( $(echo "$health_score >= 60" | bc -l) )); then
        echo -e "  ${YELLOW}$health_score% - Fair${NC}"
    else
        echo -e "  ${RED}$health_score% - Poor${NC}"
    fi
    echo
    
    if [[ $FAILED_CHECKS -gt 0 ]]; then
        echo -e "${RED}⚠️  Critical Issues Found:${NC}"
        echo "Please review the failed checks above and take appropriate action."
        echo
    fi
    
    echo -e "${WHITE}🔧 Recommended Actions:${NC}"
    if [[ $FAILED_CHECKS -gt 0 ]]; then
        echo -e "  ${RED}• Address all failed checks immediately${NC}"
    fi
    if [[ $WARNING_CHECKS -gt 0 ]]; then
        echo -e "  ${YELLOW}• Review warnings and consider improvements${NC}"
    fi
    echo -e "  ${CYAN}• Run this health check regularly${NC}"
    echo -e "  ${CYAN}• Monitor system logs for issues${NC}"
    echo -e "  ${CYAN}• Keep the system updated${NC}"
    echo
}

# Main health check function
main() {
    print_banner
    
    log "🏥 Starting OfficeOps Platform health check..."
    echo
    
    # Run all health checks
    check_system_services
    check_docker_containers
    check_network
    check_database
    check_filesystem
    check_resources
    check_logs
    check_security
    check_configuration
    performance_test
    
    # Generate final report
    generate_report
    
    # Exit with appropriate code
    if [[ $FAILED_CHECKS -gt 0 ]]; then
        exit 1
    elif [[ $WARNING_CHECKS -gt 0 ]]; then
        exit 2
    else
        exit 0
    fi
}

# Run the health check
main "$@"
