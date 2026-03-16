# DVA Wizard - Administrative Tasks Script
# Version 4.0
# Supports: Database Backups, Log Rotation, System Health Checks

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet('backup', 'logs', 'health', 'all')]
    [string]$Task = 'all'
)

# Configuration
$Date = Get-Date -Format "yyyy-MM-dd"
$BackupDir = "G:\projects\dva_wizard_v4\backups"
$LogDir = "G:\projects\dva_wizard_v4\logs"
$DbHost = "localhost"
$DbName = "dva_wizard_db"
$DbUser = "postgres"

# Create directories if they don't exist
if (-not (Test-Path $BackupDir)) { New-Item -ItemType Directory -Path $BackupDir | Out-Null }
if (-not (Test-Path $LogDir)) { New-Item -ItemType Directory -Path $LogDir | Out-Null }

function Write-Log {
    param([string]$Message)
    $LogEntry = "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] $Message"
    Write-Host $LogEntry -ForegroundColor Cyan
    Add-Content -Path "$LogDir\admin_tasks.log" -Value $LogEntry
}

function Backup-Database {
    Write-Log "Starting database backup..."
    try {
        $BackupFile = "$BackupDir\db_backup_$Date.sql"
        
        # Check if pg_dump is available
        if (Get-Command pg_dump -ErrorAction SilentlyContinue) {
            $Env:PGPASSWORD = "your_secure_password" # In production, use environment variables or vault
            pg_dump -h $DbHost -U $DbUser -d $DbName -F c -f $BackupFile
            Write-Log "Database backup successful: $BackupFile"
            
            # Compress backup
            Compress-Archive -Path $BackupFile -DestinationPath "$BackupFile.zip" -Force
            Remove-Item $BackupFile
        } else {
            Write-Log "ERROR: pg_dump not found. Please install PostgreSQL client tools."
        }
    } catch {
        Write-Log "CRITICAL: Database backup failed - $_"
    }
}

function Rotate-Logs {
    Write-Log "Rotating application logs..."
    try {
        $Logs = Get-ChildItem -Path $LogDir -Filter "*.log" | Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-7) }
        
        if ($Logs) {
            foreach ($Log in $Logs) {
                $ArchivePath = "$BackupDir\archived_logs_$Date.zip"
                Compress-Archive -Path $Log.FullName -DestinationPath $ArchivePath -Update
                Remove-Item $Log.FullName
                Write-Log "Archived and removed old log: $($Log.Name)"
            }
        } else {
            Write-Log "No logs older than 7 days found."
        }
    } catch {
        Write-Log "ERROR: Log rotation failed - $_"
    }
}

function Check-SystemHealth {
    Write-Log "Performing system health check..."
    
    # Check disk space
    $Disk = Get-PSDrive G
    $FreeSpaceGB = [math]::Round($Disk.Free / 1GB, 2)
    Write-Log "Disk Space (G:): $FreeSpaceGB GB free"
    
    if ($FreeSpaceGB -lt 5) {
        Write-Log "WARNING: Low disk space on G: drive."
    }

    # Check if Vite dev server is running (mock check)
    $Process = Get-Process -Name node -ErrorAction SilentlyContinue
    if ($Process) {
        Write-Log "Node.js processes detected: $($Process.Count)"
    }
}

# Main Execution
Write-Log "=========================================="
Write-Log "DVA Wizard Admin Tasks Started"
Write-Log "Task: $Task"
Write-Log "=========================================="

switch ($Task) {
    'backup' { Backup-Database }
    'logs' { Rotate-Logs }
    'health' { Check-SystemHealth }
    'all' {
        Backup-Database
        Rotate-Logs
        Check-SystemHealth
    }
}

Write-Log "Admin tasks completed."