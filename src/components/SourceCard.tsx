import { Source } from '../types';
import { getSourceBadgeColor, getSourceTypeColor } from '../utils/helpers';
import { ExternalLink, FileText } from 'lucide-react';

interface SourceCardProps {
  source: Source;
}

export function SourceCard({ source }: SourceCardProps) {
  return (
    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors">
      <div className="flex items-start gap-3">
        <div className={`w-1 h-12 rounded-full ${getSourceTypeColor(source.sourceType)} flex-shrink-0`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2 py-0.5 text-xs font-medium rounded border ${getSourceBadgeColor(source.level)}`}>
              {source.level}
            </span>
            <span className="text-xs text-slate-500 capitalize">
              {source.sourceType}
            </span>
          </div>
          <h4 className="text-sm font-medium text-slate-800 mb-1 line-clamp-2">
            {source.title}
          </h4>
          <p className="text-xs text-slate-600 line-clamp-2 mb-2">
            {source.snippet}
          </p>
          <a 
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            View Source
          </a>
        </div>
      </div>
    </div>
  );
}