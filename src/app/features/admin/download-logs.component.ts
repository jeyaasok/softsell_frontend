import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../core/services/admin.service';
import { DownloadLog } from '../../core/models';

@Component({
  selector: 'app-download-logs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-extrabold text-white">Download Telemetry & Security Logs</h1>
          <p class="text-xs text-slate-400 mt-1">Forensic tracking of every software download request, single-use token consumption, and IP audit.</p>
        </div>
        <button (click)="loadLogs()" class="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-2 transition-colors">
          <i class="fa-solid fa-rotate text-blue-400"></i> Refresh Logs
        </button>
      </div>

      <!-- Logs Table -->
      <div class="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-900/80 text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th class="p-4">Customer</th>
                <th class="p-4">Software Package</th>
                <th class="p-4">IP Address</th>
                <th class="p-4">Status</th>
                <th class="p-4">Timestamp</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60 font-mono">
              <tr *ngFor="let log of logs" class="hover:bg-slate-900/40">
                <td class="p-4 font-sans font-medium text-white">{{ log.user?.name || 'Anonymous / Guest' }}</td>
                <td class="p-4 font-sans text-slate-300">{{ log.product?.name || 'Unknown' }}</td>
                <td class="p-4 text-blue-400">{{ log.ip_address || '127.0.0.1' }}</td>
                <td class="p-4 font-sans">
                  <span [ngClass]="log.status === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'"
                        class="px-2.5 py-0.5 rounded text-[10px] font-bold border capitalize">
                    {{ log.status }}
                  </span>
                </td>
                <td class="p-4 text-slate-400">{{ log.downloaded_at | date:'medium' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `
})
export class AdminDownloadLogsComponent implements OnInit {
  private admin = inject(AdminService);

  logs: DownloadLog[] = [];

  ngOnInit(): void {
    this.loadLogs();
  }

  loadLogs(): void {
    this.admin.getDownloadLogs().subscribe({
      next: (res) => {
        if (res.success) this.logs = res.data?.data || res.data || [];
      }
    });
  }
}

